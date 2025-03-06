import {create} from "zustand";
import {persist} from "zustand/middleware";
import {toast} from "react-toastify";
import {useFormStore} from "./useFormStore";
import {ApplicantData, EmployerData, PasswordResetRequest, Role} from "../utils/types";
import { UserType } from "../utils/enums.ts";
import {privateApiClient, publicApiClient} from "../api/axios.ts";
import {immer} from "zustand/middleware/immer";
import secureLocalStorage from "react-secure-storage";


// ✅ Import the form store

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5173";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthData {
    isAuthenticated: boolean;
    redirectPath: string | null;
    employer: EmployerData | null;
    email: string | null;
    otp: string | null;
    applicant: ApplicantData | null;
    loginRequest: LoginRequest | null;
    passwordResetRequest: PasswordResetRequest | null;
    role: Role | null;
    userType: UserType | null ;
    loading: boolean;
    error: string | null;
    signupSuccess: boolean;
    login: (data: LoginRequest) => Promise<boolean>;
    signup: (userType: UserType) => Promise<boolean>;
    updateProfile: (data: Partial<EmployerData> | Partial<ApplicantData>)=> void;
    setProfileData: (data: Partial<EmployerData> | Partial<ApplicantData>)=>void;
    setUserType: (userType: UserType)=>void;
    setEmail: (email: string)=>void;
    setOtp: (otp: string)=>void;
    verifyAccount: (email: string, action: string) => Promise<boolean>;
    verifyOtp: (email: string, otp: string) => Promise<boolean>;
    sendOtp: (email: string) => Promise<boolean>;
    setPasswordResetRequest: (data: PasswordResetRequest)=>void;
    resetPassword: (data: PasswordResetRequest) => Promise<boolean>;
    logout: () => Promise<boolean>;
    setRedirectPath: (path: string)=>void;
}

export const useAuth = create<AuthData>()(
    persist(
        immer<AuthData>((set, ) => ({
            isAuthenticated: !!secureLocalStorage.getItem("auth-token"),
            redirectPath: null,
            signupSuccess: false,
            employer: null,
            applicant: null,
            role: secureLocalStorage.getItem("auth-role") as Role | null,
            userType: secureLocalStorage.getItem("userType") as UserType | null,
            email: null,
            otp: null,
            loginRequest: null,
            passwordResetRequest: null,
            loading: false,
            error: null,

            login: async (data) => {
                set((state) => {
                    state.loading = true;
                    state.error = null;
                });

                try {
                    const response = await privateApiClient.post(`${API_BASE_URL}/auth/login`, data);
                    const userData: ApplicantData | EmployerData = response.data.data;
                    set((state) => {
                        state.isAuthenticated = true;
                        state.role = userData.role as Role;
                        state.userType = userData.userType;

                        if (userData.userType === UserType.EMPLOYER) {
                            state.employer = userData as EmployerData;
                            state.applicant = null;
                        } else {
                            state.applicant = userData as ApplicantData;
                            state.employer = null;
                        }

                        state.loading = false;
                    });

                    secureLocalStorage.setItem("auth-token", userData.token as string);
                    secureLocalStorage.setItem("auth-role", JSON.stringify(userData.role));
                    secureLocalStorage.setItem("userType", userData.userType as  string);
                    return true;
                } catch (err: any) {
                    set((state) => {
                        state.error = err.response?.data?.message || "Login failed";
                        state.loading = false;
                    });

                    toast.error(err.response?.data?.message || "Login failed");
                }
                return false;
            },

            signup: async (userType) => {
                const { applicant, employer } = useFormStore.getState();
                set((state) => {
                    state.loading = true;
                    state.error = null;
                    state.signupSuccess = false;
                });

                try {
                    const form = new FormData();
                    const formData = userType === UserType.EMPLOYER ? employer : applicant;

                    Object.entries(formData).forEach(([key, value]) => {
                        if(key !== "otp" && key!== "confirmPassword"){
                            if (value !== null) form.append(key, value);
                        }
                    });

                    const response = await publicApiClient.post(
                        `${API_BASE_URL}/auth/${userType}/signup`,
                        form,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );

                    const userData: ApplicantData | EmployerData = response.data.data;
                    set((state) => {
                        state.isAuthenticated = true;
                        state.role = userData.role as Role;
                        state.userType = userData.userType as UserType;

                        if (userData.userType === UserType.EMPLOYER) {
                            state.employer = userData as EmployerData;
                            state.applicant = null;
                        } else {
                            state.applicant = userData as ApplicantData;
                            state.employer = null;
                        }

                        state.loading = false;
                    });

                    secureLocalStorage.setItem("auth-token", userData.token as string);
                    secureLocalStorage.setItem("auth-role", JSON.stringify(userData.role));
                    secureLocalStorage.setItem("userType", JSON.stringify(userData.userType));
                    return true;
                } catch (err: any) {
                    toast.error(err.response?.data?.message || "Signup failed");

                    set((state) => {
                        state.error = err.response?.data?.message || "Signup failed";
                        state.signupSuccess = false;
                        state.isAuthenticated = false;
                        state.loading = false;
                    });
                }
                return false;
            },

            updateProfile: async (data: Partial<EmployerData> | Partial<ApplicantData>) => {
                set((state) => {
                    state.loading = true;
                    state.error = null;
                });

                try {
                    const app = data as ApplicantData;
                    console.log("FORM DATA ::: " + JSON.stringify(app));
                    const form = new FormData();

                    Object.entries(app).forEach(([key, value]) => {
                        if (value !== null && value !== undefined) {
                            if (typeof value === "object") {
                                // Handle nested objects/arrays
                                form.append(key, JSON.stringify(value));
                            } else {
                                form.append(key, value as any);
                            }
                        }
                    });

                    console.log("FORM DATA :: " + JSON.stringify(form));



                    const response = await privateApiClient.patch(
                        `${API_BASE_URL}/auth/update-profile`,
                        form,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );

                    toast.success(response.data.message);

                    set((state) => {
                        state.loading = false;
                        state.error = null;

                        if (state.userType === UserType.EMPLOYER) {
                            state.employer = {
                                ...state.employer,
                                ...response.data.data,
                            };
                        } else {
                            state.applicant = {
                                ...state.applicant,
                                ...response.data.data,
                            };
                        }

                    });
                } catch (err: any) {
                    toast.error(err.response?.data?.message || "Profile update failed");

                    set((state) => {
                        state.error = err.response?.data?.message || "Profile update failed";
                        state.loading = false;
                    });
                }
            },

            setProfileData: (data) => {
                set((state) => {
                    if (state.userType === UserType.APPLICANT && state.applicant) {
                        const asApplicant = data as ApplicantData;
                        return {
                            applicant: {
                                ...state.applicant,
                                ...asApplicant,
                                // Ensure nested CV and role updates are safely merged
                                cv: {
                                    ...state.applicant.cv,
                                    ...asApplicant.cv,
                                },
                                role: {
                                    ...state.applicant.role,
                                    ...asApplicant.role,
                                },
                            },
                        };
                    }
                    return {};
                });
            },
            setUserType: (userType) => {
                secureLocalStorage.setItem("userType", JSON.stringify(userType));
                set((state) => {
                    state.userType = userType;
                });
            },
            setEmail: (email) => {
                set((state) => {
                    state.email = email;
                    secureLocalStorage.setItem("email", email);
                });
            },
            setOtp: (otp) => {
                set((state) => {
                    state.otp = otp;
                    secureLocalStorage.setItem("otp", otp);
                });
            },
            verifyAccount: async (email: string, action: string) => {
                set((state) => {
                    state.loading = true;
                    state.error = null;
                });

                try {
                    await publicApiClient.get(`${API_BASE_URL}/auth/send-verification-otp?email=${email}&action=${action}`);
                    toast.success("Account verification link sent successfully.");
                    return true;
                } catch (err: any) {
                    toast.error(err.response?.data?.message || "Verification failed");
                    set((state) => {
                        state.error = err.response?.data?.message || "Verification failed";
                        state.loading = false;
                    });
                }
                return false;
            },
            verifyOtp: async (email: string, otp: string) => {
                set((state) => {
                    state.loading = true;
                    state.error = null;
                });

                try {
                    await publicApiClient.get(`${API_BASE_URL}/auth/otp/verify`, {
                        params: { email: email, otp: otp },
                    });
                    secureLocalStorage.setItem("email", email);
                    set((state) => {
                        state.email = email;
                        state.loading = false;
                    });
                    toast.success("OTP verified successfully.");
                    return true;
                } catch (err: any) {
                    toast.error(err.response?.data?.message || "OTP verification failed");
                    set((state) => {
                        state.error = err.response?.data?.message || "OTP verification failed";
                        state.loading = false;
                    });
                }
                return false;
            },
            sendOtp: async (email: string) => {
                set((state) => {
                    state.loading = true;
                    state.error = null;
                });

                try {
                    await publicApiClient.post(`${API_BASE_URL}/auth/send-otp`, { email: email });
                    toast.success("OTP sent successfully.");
                    return true;
                } catch (err: any) {
                    toast.error(err.response?.data?.message || "OTP sending failed");
                    set((state) => {
                        state.error = err.response?.data?.message || "OTP sending failed";
                        state.loading = false;
                    });
                }
                return false;
            },
            setPasswordResetRequest: async (data: PasswordResetRequest) => {
                set((state) => {
                    state.passwordResetRequest = data;
                });
            },
            resetPassword: async (data: PasswordResetRequest) => {
                set((state) => {
                    state.loading = true;
                    state.error = null;
                });

                try {
                    await publicApiClient.post(`${API_BASE_URL}/auth/reset-password`, data);
                    toast.success("Password reset successful.");
                    return true;
                } catch (err: any) {
                    toast.error(err.response?.data?.message || "Password reset failed");
                    set((state) => {
                        state.error = err.response?.data?.message || "Password reset failed";
                        state.loading = false;
                    });
                }
                return false;
            },

            logout: async () => {
                try {
                    await privateApiClient.post(`${API_BASE_URL}/auth/logout`);
                    secureLocalStorage.removeItem("auth-token");
                    secureLocalStorage.removeItem("auth-role");
                    secureLocalStorage.removeItem("userType");
                    secureLocalStorage.removeItem("auth-storage");
                    secureLocalStorage.removeItem("job-preference-store");
                    secureLocalStorage.removeItem("redirectPath");


                    set((state) => {
                        state.isAuthenticated = false;
                        state.employer = null;
                        state.applicant = null;
                        state.role = null;
                        state.userType = null;
                        state.loading = false;
                        state.error = null;
                    });
                    return true;
                } catch (error: any) {
                    console.error("Logout error:", error);
                    set((state)=>{
                        state.error = error.response?.data?.message || "Error while logging out"
                    })
                }
                return false;

            },

            setRedirectPath: (path) => {
                set((state) => {
                    state.redirectPath = path;
                });
            },
        })),
        {
            name: "auth-storage",
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                employer: state.employer,
                applicant: state.applicant,
                signupSuccess: state.signupSuccess,
                email: state.email,
                otp: state.otp,
                passwordResetRequest: state.passwordResetRequest,
                redirectPath: state.redirectPath,
                userType: state.userType,
                role: state.role,
            }),
        }
    )
);