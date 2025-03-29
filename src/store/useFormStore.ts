import { create } from "zustand";

export interface ApplicantFormData {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    password: string;
    confirmPassword: string;
    otp: string;
    phoneNumber: string;
    address: string;
    resume: File | null;
    coverLetterLink: File | null;
    portfolio: File | null;
    videoCv: File | null;
    documentType: string;
}

export interface EmployerFormData {
    companyName: string;
    companyDescription: string;
    companyWebsite: string;
    email: string;
    password: string;
    confirmPassword: string;
    otp: string;
    companyPhone: string;
    coverPage: File | null;
    companyLogo: File | null;
}

interface FormStore {
    applicant: ApplicantFormData;
    employer: EmployerFormData;
    setApplicantData: (data: Partial<ApplicantFormData>) => void;
    setEmployerData: (data: Partial<EmployerFormData>) => void;
    resetFormData: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
    applicant: {
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        password: "",
        confirmPassword: "",
        otp: "",
        phoneNumber: "",
        address: "",
        resume: null,
        coverLetterLink: null,
        portfolio: null,
        videoCv: null,
        documentType: "",
    },
    employer: {
        companyName: "",
        companyDescription: "",
        companyWebsite: "",
        email: "",
        password: "",
        confirmPassword: "",
        otp: "",
        companyPhone: "",
        coverPage: null,
        companyLogo: null,
    },
    setApplicantData: (data) =>
        set((state) => ({
            applicant: { ...state.applicant, ...data },
        })),
    setEmployerData: (data) =>
        set((state) => ({
            employer: { ...state.employer, ...data },
        })),
    resetFormData: () =>
        set(() => ({
            applicant: {
                firstName: "",
                lastName: "",
                middleName: "",
                email: "",
                password: "",
                confirmPassword: "",
                otp: "",
                phoneNumber: "",
                address: "",
                resume: null,
                coverLetterLink: null,
                portfolio: null,
                videoCv: null,
                documentType: "",
            },
            employer: {
                companyName: "",
                companyDescription: "",
                companyWebsite: "",
                email: "",
                password: "",
                confirmPassword: "",
                otp: "",
                companyPhone: "",
                coverPage: null,
                companyLogo: null,
            },
        })),
}));
