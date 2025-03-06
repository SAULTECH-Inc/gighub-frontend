import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import {toast} from "react-toastify";
import {
    APIResponse,
    ApplicantData, ApplicantPersonalInfo,
    ApplicantSignupRequest, EducationResponseDto,
    EmployerData, EmployerSignupRequest,
    PasswordResetRequest, ProfessionalSummaryData,
    Role
} from "../utils/types";
import {UserType} from "../utils/types/enums.ts";
import {privateApiClient, publicApiClient} from "../api/axios.ts";
import {immer} from "zustand/middleware/immer";
import secureLocalStorage from "react-secure-storage";
import {API_BASE_URL, secureStorageWrapper} from "../utils/constants.ts";


export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthData {
    isAuthenticated: boolean;
    redirectPath: string | "";
    employer: EmployerData | "";
    email: string | "";
    otp: string | "";
    applicant: ApplicantData;
    loginRequest: LoginRequest | null;
    applicantSignupRequest: ApplicantSignupRequest;
    applicantPersonalInfo: ApplicantPersonalInfo;
    employerSignupRequest: EmployerSignupRequest;
    professionalSummaryData: ProfessionalSummaryData;
    resetApplicantPersonalInfo: () => void;
    resetProfessionalSummaryData: ()=>void;
    passwordResetRequest: PasswordResetRequest;
    role: Role | null;
    userType: UserType | null ;
    loading: boolean;
    error: string | null;
    signupSuccess: boolean;
    login: (data: LoginRequest) => Promise<boolean>;
    signup: (userType: UserType, request: EmployerSignupRequest | ApplicantSignupRequest) => Promise<boolean>;
    updateProfile: (data: Partial<EmployerData> | Partial<ApplicantData>)=> void;
    setProfileData: (data: Partial<EmployerData> | Partial<ApplicantData>)=>void;
    setApplicantPersonalInfo: (data: ApplicantPersonalInfo)=>void;
    updateApplicantPersonalInfo: (data: ApplicantPersonalInfo)=>Promise<ApplicantPersonalInfo | null>;
    setProfessionalSummaryData: (data:ProfessionalSummaryData)=>void;
    updateProfessionalSummaryData: (data: ProfessionalSummaryData)=>Promise<ProfessionalSummaryData | null>;
    setUserType: (userType: UserType)=>void;
    setEmail: (email: string)=>void;
    setOtp: (otp: string)=>void;
    sendVerificationOtp: (email: string, action: string) => Promise<boolean>;
    verifyAccount: (email: string) => Promise<boolean>;
    verifyOtp: (email: string, otp: string) => Promise<boolean>;
    sendOtp: (email: string) => Promise<boolean>;
    setPasswordResetRequest: (data: PasswordResetRequest)=>void;
    setApplicantSignupRequest: (data: ApplicantSignupRequest)=>void;
    setEmployerSignupRequest: (data: EmployerSignupRequest)=>void;
    resetPassword: (data: PasswordResetRequest) => Promise<boolean>;
    resetSignupRequest: ()=>void;
    logout: () => Promise<boolean>;
    setRedirectPath: (path: string)=>void;
    resetApplicantSignupRequest: ()=>void;
}

export const useAuth = create<AuthData>()(
    persist(
        immer<AuthData>((set, ) => ({
            isAuthenticated: !!secureLocalStorage.getItem("auth-token"),
            redirectPath: "",
            signupSuccess: false,
            employer: {} as EmployerData,
            applicant: {} as ApplicantData,
            role: secureLocalStorage.getItem("auth-role") as Role | null,
            userType: secureLocalStorage.getItem("userType") as UserType | null,
            email: "",
            otp: "",
            loginRequest: {} as LoginRequest,
            passwordResetRequest: {} as PasswordResetRequest,
            applicantSignupRequest: {} as ApplicantSignupRequest,
            employerSignupRequest: {} as EmployerSignupRequest,
            applicantPersonalInfo: {} as ApplicantPersonalInfo,
            professionalSummaryData: {} as ProfessionalSummaryData,
            applicantEducation: {} as EducationResponseDto,
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
                    console.log("LOGGED IN USER ::: ", userData);
                    set((state) => {
                        state.isAuthenticated = true;
                        state.role = userData.role as Role;
                        state.userType = userData.userType;

                        if (userData.userType === UserType.EMPLOYER) {
                            state.employer = userData as EmployerData;
                            state.applicant = {} as ApplicantData;
                        } else {
                            const appData = userData as ApplicantData;
                            state.applicant = appData;
                            state.applicantPersonalInfo = {
                                firstName: appData?.firstName,
                                lastName: appData?.lastName,
                                middleName: appData?.middleName,
                                email: appData?.email,
                                phoneNumber: appData?.phoneNumber,
                                country: appData?.country,
                                city: appData?.city,
                                dateOfBirth: appData?.dateOfBirth,
                                address: appData?.address,
                            } as ApplicantPersonalInfo;
                            state.professionalSummaryData = {
                                professionalTitle: appData?.cv?.professionalTitle as string,
                                professionalSummary: appData?.cv?.professionalSummary as string
                            }
                            state.employer = {} as EmployerData;
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

            signup: async (userType, request: EmployerSignupRequest | ApplicantSignupRequest) => {
                set((state) => {
                    state.loading = true;
                    state.error = null;
                    state.signupSuccess = false;
                });

                try {
                    const form = new FormData();
                    const formData = userType === UserType.EMPLOYER ? request as EmployerSignupRequest : request;

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
                            state.applicant = {} as ApplicantData;
                        } else {
                            state.applicant = userData as ApplicantData;
                            state.employer = {} as EmployerData;
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
            sendVerificationOtp: async (email: string, action: string) => {
                set((state) => {
                    state.loading = true;
                    state.error = null;
                });

                try {
                    await publicApiClient.get(`${API_BASE_URL}/auth/send-verification-otp?email=${email}&action=${action}`);
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
            verifyAccount: async (email: string)=>{
                set((state) => {
                    state.loading = true;
                    state.error = null;
                });

                try {
                    const response = await publicApiClient.get<APIResponse<boolean>>(`${API_BASE_URL}/auth/verify-account`, {
                        params: { email: email },
                    })
                        .then(res=>res.data);
                    set((state) => {
                        state.email = email;
                        state.loading = false;
                    });
                    return response.data;
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
                        params: { otp: otp },
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
                    set((state)=> {
                        state.loading = true;
                    });
                    await privateApiClient.post(`${API_BASE_URL}/auth/logout`);
                    secureLocalStorage.removeItem("auth-token");
                    secureLocalStorage.removeItem("auth-role");
                    secureLocalStorage.removeItem("userType");
                    secureLocalStorage.removeItem("auth-storage");
                    secureLocalStorage.removeItem("job-preference-store");
                    secureLocalStorage.removeItem("redirectPath");
                    secureLocalStorage.removeItem("applicantJobProfile");
                    secureLocalStorage.removeItem("auth-storage");


                    set((state) => {
                        state.isAuthenticated = false;
                        state.employer = {} as EmployerData;
                        state.applicant = {} as ApplicantData;
                        state.role = {} as Role;
                        state.email = "";
                        state.otp = "";
                        state.passwordResetRequest = {} as PasswordResetRequest;
                        state.applicantSignupRequest = {} as ApplicantSignupRequest;
                        state.employerSignupRequest = {} as EmployerSignupRequest;
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
            setApplicantSignupRequest: async (request: ApplicantSignupRequest)=>{
                set((state) => {
                    state.applicantSignupRequest = {
                       ...state.applicantSignupRequest,
                       ...request,
                    };
                });
            },
            setEmployerSignupRequest: async (request: EmployerSignupRequest) => {
                set((state) => {
                    state.employerSignupRequest = {
                       ...state.employerSignupRequest,
                       ...request,
                    };
                });
            },
            resetSignupRequest: async ()=>{
                set((state) => {
                    state.employerSignupRequest = {
                        companyName: "",
                        companyDescription: "",
                        companyWebsite: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        companyPhone: "",
                        coverPage: null,
                        companyLogo: null,
                    };
                    state.applicantSignupRequest = {
                        firstName: "",
                        lastName: "",
                        middleName: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        phoneNumber: "",
                        resume: null,
                        address: "",
                        coverLetter: null,
                        portfolio: null,
                        videoCv: null,
                        documentType: "",
                    };
                });
            },
            setApplicantPersonalInfo: data => {
                set((state) => {
                    state.applicantPersonalInfo = {
                       ...state.applicantPersonalInfo,
                       ...data,
                    } as ApplicantPersonalInfo;
                });
            },
            updateApplicantPersonalInfo: async (data: ApplicantPersonalInfo) => {
                //call backend
                try {
                    set((state) => {
                        state.loading = true;
                    });
                    const response = await privateApiClient.put<APIResponse<ApplicantPersonalInfo>>(`${API_BASE_URL}/users/applicants/update/personal-info`, data);
                    set((state)=>{
                        state.loading = false;
                        state.error = null;
                    });
                    return response?.data?.data;
                }catch (err: any) {
                    toast.error(err.response?.data?.message || "Error updating personal information");
                    set((state) => {
                        state.error = err.response?.data?.message || "Error updating personal information";
                        state.loading = false;
                    });
                    return null;
                }
            },
            setProfessionalSummaryData: (data: ProfessionalSummaryData) => {
                set((state) => {
                    state.professionalSummaryData = {
                        ...state.professionalSummaryData,
                        ...data,
                    };
                });
            },
            updateProfessionalSummaryData: async (data) => {
                try {
                    set((state) => {
                        state.loading = true;
                    });
                    const response = await privateApiClient.put<APIResponse<ProfessionalSummaryData>>(`${API_BASE_URL}/users/applicants/update/professional-summary`, data);
                    set((state)=>{
                        state.loading = false;
                        state.error = null;
                    });
                    return response?.data?.data;
                }catch (err: any) {
                    toast.error(err.response?.data?.message || "Error updating professional summary");
                    set((state) => {
                        state.error = err.response?.data?.message || "Error updating professional summary";
                        state.loading = false;
                    });
                    return null;
                }
            },
            resetApplicantPersonalInfo: async () => {
                set((state) => {
                    state.applicantPersonalInfo = {} as ApplicantPersonalInfo;
                });
            },
            resetProfessionalSummaryData: async () =>{
                set((state) => {
                    state.professionalSummaryData = {} as ProfessionalSummaryData;
                });
            },
            resetApplicantSignupRequest: async () =>{
                set((state) => {
                    state.applicantSignupRequest = {} as ApplicantSignupRequest;
                });
            }
        })),
        {
            name: "auth-storage",
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                employer: state.employer,
                applicant: state.applicant,
                employerSignupRequest: state.employerSignupRequest,
                applicantSignupRequest: state.applicantSignupRequest,
                applicantPersonalInfo: state.applicantPersonalInfo,
                professionalSummaryData: state.professionalSummaryData,
                signupSuccess: state.signupSuccess,
                email: state.email,
                otp: state.otp,
                passwordResetRequest: state.passwordResetRequest,
                redirectPath: state.redirectPath,
                userType: state.userType,
                role: state.role,
            }),
            storage: createJSONStorage(()=>secureStorageWrapper)
        }
    )
);