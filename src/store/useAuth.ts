import {create} from "zustand";
import {persist} from "zustand/middleware";
import {toast} from "react-toastify";
import {useFormStore} from "./useFormStore";
import {ApplicantData, EmployerData, Role} from "../utils/types";
import {UserType} from "../utils/types/enums.ts";
import {privateApiClient, publicApiClient} from "../api/axios.ts";
import {immer} from "zustand/middleware/immer";
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
    applicant: ApplicantData | null;
    loginRequest: LoginRequest | null;
    role: Role | null;
    userType: UserType | null ;
    loading: boolean;
    error: string | null;
    signupSuccess: boolean;
    login: (data: LoginRequest) => Promise<boolean>;
    signup: (userType: UserType) => void;
    updateProfile: (data: Partial<EmployerData> | Partial<ApplicantData>)=> void;
    setProfileData: (data: Partial<EmployerData> | Partial<ApplicantData>)=>void;
    logout: () => void;
    setRedirectPath: (path: string)=>void;
}

export const useAuth = create<AuthData>()(
    persist(
        immer<AuthData>((set, ) => ({
            isAuthenticated: !!localStorage.getItem("auth-token"),
            redirectPath: null,
            signupSuccess: false,
            employer: null,
            applicant: null,
            role: localStorage.getItem("auth-role") as Role | null,
            userType: localStorage.getItem("userType") as UserType | null,
            loginRequest: null,
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
                    alert(userData.userType)
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

                    localStorage.setItem("auth-token", userData.token as string);
                    localStorage.setItem("auth-role", JSON.stringify(userData.role));
                    localStorage.setItem("userType", JSON.stringify(userData.userType));
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
                        if (value !== null) form.append(key, value);
                    });

                    const response = await publicApiClient.post(
                        `${API_BASE_URL}/auth/${userType}/signup`,
                        form,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );

                    toast.success(response.data.message);

                    set((state) => {
                        state.signupSuccess = true;
                        state.isAuthenticated = true;
                        state.userType = userType;
                        state.loading = false;

                        if (userType === UserType.EMPLOYER) {
                            state.employer = response.data.data;
                        } else {
                            state.applicant = response.data.data;
                        }
                    });
                } catch (err: any) {
                    toast.error(err.response?.data?.message || "Signup failed");

                    set((state) => {
                        state.error = err.response?.data?.message || "Signup failed";
                        state.signupSuccess = false;
                        state.isAuthenticated = false;
                        state.loading = false;
                    });
                }
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

            logout: async () => {
                try {
                    await privateApiClient.post(`${API_BASE_URL}/auth/logout`);
                } catch (err) {
                    console.error("Logout error:", err);
                }

                localStorage.removeItem("auth-token");
                localStorage.removeItem("auth-role");
                localStorage.removeItem("userType");

                set((state) => {
                    state.isAuthenticated = false;
                    state.employer = null;
                    state.applicant = null;
                    state.role = null;
                    state.userType = null;
                });
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
                redirectPath: state.redirectPath,
                userType: state.userType,
                role: state.role,
            }),
        }
    )
);