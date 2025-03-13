import {create} from "zustand";
import {createJSONStorage, devtools, persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {
    AboutCompany,
    APIResponse,
    BrandAndVisuals,
    CompanyInfos,
    ComplianceAndVerifications,
    ContactInfo,
    EmployerData,
    FileUploadRequest,
    FileUploadResponse,
    Socials
} from "../utils/types";
import {privateApiClient} from "../api/axios.ts";
import {API_BASE_URL, NODE_ENV, secureStorageWrapper, VITE_API_FILE_SERVICE} from "../utils/constants.ts";

interface InitialProfileState {
    // Employer Profile
    employerProfile: EmployerData | null;
    setEmployerProfile: (employerProfile: EmployerData) => void;
    updateEmployerProfile: (employerProfile: EmployerData) => Promise<EmployerData | null>;
    resetEmployerProfile: () => void;

    // Company Info
    companyInfo: CompanyInfos | null;
    setCompanyInfo: (companyInfo: CompanyInfos) => void;
    updateCompanyInfo: (companyInfo: CompanyInfos) => Promise<CompanyInfos | null>;
    resetCompanyInfo: () => void;

    // Contact Info
    contactInfo: ContactInfo | null;
    setContactInfo: (contactInfo: ContactInfo) => void;
    updateContactInfo: (contactInfo: ContactInfo) => Promise<ContactInfo | null>;
    resetContactInfo: () => void;

    // Brand and Visuals
    brandAndVisuals: BrandAndVisuals | null;
    setBrandAndVisuals: (brandAndVisuals: BrandAndVisuals) => void;
    updateBrandAndVisuals: (brandAndVisuals: FileUploadRequest) => Promise<FileUploadResponse | null>;
    deleteBrandAndVisuals: (request: FileUploadRequest) => Promise<boolean>;
    resetBrandAndVisuals: () => void;

    // About Company
    aboutCompany: AboutCompany | null;
    setAboutCompany: (aboutCompany: AboutCompany) => void;
    updateAboutCompany: (aboutCompany: AboutCompany) => Promise<AboutCompany | null>;
    resetAboutCompany: () => void;

    // Socials
    socials: Socials | null;
    setSocials: (socials: Socials) => void;
    updateSocials: (socials: Socials) => Promise<Socials | null>;
    resetSocials: () => void;

    // Compliance and Verification
    complianceAndVerification: ComplianceAndVerifications;
    setComplianceAndVerification: (complianceAndVerification: ComplianceAndVerifications) => void;
    updateComplianceAndVerification: (
        complianceAndVerification: ComplianceAndVerifications
    ) => Promise<ComplianceAndVerifications | null>;
    resetComplianceAndVerification: () => void;


    uploadFile: (request: FileUploadRequest)=>Promise<FileUploadResponse | null>;
}

export const useEmployerProfile = create<InitialProfileState>()(devtools(persist(immer<InitialProfileState>((set,)=>({
    // Employer Profile
    employerProfile: null,
    setEmployerProfile: (employerProfile: EmployerData) => {
        set((state) => {
            state.employerProfile = employerProfile;
        });
    },
    updateEmployerProfile: async (employerProfile: EmployerData) => {
        try {
            const response = await privateApiClient.put<APIResponse<EmployerData>>("/employer/profile", employerProfile);
            set((state) => {
                state.employerProfile = response?.data?.data;
            });
            return response?.data?.data;
        }catch (err: any){
            console.error(err.response?.data?.message || "Update failed");
            return null;
        }
    },
    resetEmployerProfile: () => {
        set((state) => {
            state.employerProfile = null;
        });
    },
    // Company Info
    companyInfo: null,
    setCompanyInfo: (companyInfo: CompanyInfos) => {
        set((state) => {
            state.companyInfo = companyInfo;
        });
    },
    updateCompanyInfo: async (companyInfo: CompanyInfos) => {
        try {
            const response = await privateApiClient.put<APIResponse<CompanyInfos>>(`${API_BASE_URL}/users/employers/update/company-info`, companyInfo);
            set((state) => {
                state.companyInfo = response?.data?.data;
            });
            return response?.data?.data;
        }catch (err: any){
            console.error(err.response?.data?.message || "Update failed");
            return null;
        }
    },
    resetCompanyInfo: () => {
        set((state) => {
            state.companyInfo = null;
        });
    },
    // Contact Info
    contactInfo: null,
    setContactInfo: (contactInfo: ContactInfo) => {
        set((state) => {
            state.contactInfo = contactInfo;
        });
    },
    updateContactInfo: async (contactInfo: ContactInfo) => {
        try {
            const response = await privateApiClient.put<APIResponse<ContactInfo>>(`${API_BASE_URL}/users/employers/update/contact-info`, contactInfo);
            set((state) => {
                state.contactInfo = response?.data?.data;
            });
            return response?.data?.data;
        }catch (err: any){
            console.error(err.response?.data?.message || "Update failed");
            return null;
        }
    },
    resetContactInfo: () => {
        set((state) => {
            state.contactInfo = null;
        });
    },
    // Brand and Visuals
    brandAndVisuals: null,
    setBrandAndVisuals: (brandAndVisuals: BrandAndVisuals) => {
        set((state) => {
            state.brandAndVisuals = brandAndVisuals;
        });
    },
    updateBrandAndVisuals: async (brandAndVisuals: FileUploadRequest) => {
        try {
            const formData = new FormData();

            // Append the file if it exists and is a File type
            if (brandAndVisuals.file && brandAndVisuals.file instanceof File) {
                formData.append("file", brandAndVisuals.file);
            }

            // Append other fields as strings
            formData.append("fileUrl", brandAndVisuals.fileUrl || "");
            formData.append("userId", brandAndVisuals.userId.toString());
            formData.append("userType", brandAndVisuals.userType);
            formData.append("action", brandAndVisuals.action);
            formData.append("whatIsTheItem", brandAndVisuals.whatIsTheItem);

            const response = await privateApiClient.post<APIResponse<FileUploadResponse>>(
                `${VITE_API_FILE_SERVICE}/gighub/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return response?.data?.data;
        } catch (err: any) {
            console.error(err.response?.data?.message || "Update failed");
            return null;
        }
    },

    resetBrandAndVisuals: () => {
        set((state) => {
            state.brandAndVisuals = null;
        });
    },
    deleteBrandAndVisuals: async (request: FileUploadRequest) => {
        try {
            const response = await privateApiClient.post<APIResponse<boolean>>(`${VITE_API_FILE_SERVICE}/gighub/files/delete`, request);
            return response?.data?.data;
        }catch (err: any){
            console.error(err.response?.data?.message || "Delete failed");
            return false;
        }
    },
    // About Company
    aboutCompany: null,
    setAboutCompany: (aboutCompany: AboutCompany) => {
        set((state) => {
            state.aboutCompany = aboutCompany;
        });
    },
    updateAboutCompany: async (aboutCompany: AboutCompany) => {
        try {
            const response = await privateApiClient.put<APIResponse<AboutCompany>>(`${API_BASE_URL}/users/employers/update/company-overview`, aboutCompany);
            set((state) => {
                state.aboutCompany = response?.data?.data;
            });
            return response?.data?.data;
        }catch (err: any){
            console.error(err.response?.data?.message || "Update failed");
            return null;
        }
    },
    resetAboutCompany: () => {
        set((state) => {
            state.aboutCompany = null;
        });
    },
    // Socials
    socials: null,
    setSocials: (socials: Socials) => {
        set((state) => {
            state.socials = socials;
        });
    },
    updateSocials: async (socials: Socials) => {
        try {
            const response = await privateApiClient.put<APIResponse<Socials>>(`${API_BASE_URL}/users/employers/update/company-socials`, socials);
            set((state) => {
                state.socials = response?.data?.data;
            });
            return response?.data?.data;
        }catch (err: any){
            console.error(err.response?.data?.message || "Update failed");
            return null;
        }
    },
    resetSocials: () => {
        set((state) => {
            state.socials = null;
        });
    },
    // Compliance and Verification
    complianceAndVerification: {
        taxIdentificationNumber: "",
        registrationNumber: "",
    },
    setComplianceAndVerification: (complianceAndVerification: ComplianceAndVerifications) => {
        set((state) => {
            state.complianceAndVerification = complianceAndVerification;
        });
    },
    updateComplianceAndVerification: async (complianceAndVerification: ComplianceAndVerifications) => {
        try {
            const response = await privateApiClient.put<APIResponse<ComplianceAndVerifications>>(`${API_BASE_URL}/users/employers/update/compliance-and-verification`, complianceAndVerification);
            set((state) => {
                state.complianceAndVerification = response?.data?.data;
            });
            return response?.data?.data;
        }catch (err: any){
            console.error(err.response?.data?.message || "Update failed");
            return null;
        }
    },
    resetComplianceAndVerification: () => {
        set((state) => {
            state.complianceAndVerification = {
                taxIdentificationNumber: "",
                registrationNumber: "",
            };
        });
    },
    uploadFile: async (request: FileUploadRequest) => {
        try {
            const formData = new FormData();

            // Append the file if it exists and is a File type
            if (request.file && request.file instanceof File) {
                formData.append("file", request.file);
            }
            formData.append("userId", request.userId.toString());
            formData.append("userType", request.userType);
            formData.append("action", request.action);
            formData.append("whatIsTheItem", request.whatIsTheItem);
            const response = await privateApiClient.post<APIResponse<FileUploadResponse>>(`${VITE_API_FILE_SERVICE}/gighub/upload`, request,{
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response?.data?.data;
        }catch (err: any){
            console.error(err.response?.data?.message || "Upload failed");
            return null;
        }
    }
})),{
    name: 'employer-profile',
    partialize: (state)=>({
        employerProfile: state.employerProfile,
        companyInfo: state.companyInfo,
        contactInfo: state.contactInfo,
        brandAndVisuals: state.brandAndVisuals,
        aboutCompany: state.aboutCompany,
        socials: state.socials,
        complianceAndVerification: state.complianceAndVerification
    }),
    storage: createJSONStorage(()=>NODE_ENV === 'development' ? localStorage: secureStorageWrapper)
}),{
    name: 'employer-profile'
}));
