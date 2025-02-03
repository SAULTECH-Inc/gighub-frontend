import { create } from 'zustand';

export interface FormData {
    applicant: {
        firstName: string;
        surname: string;
        middleName: string;
        email: string;
        password: string;
        otp: string;
        phone: string;
        address: string;
        resume: File | null;
        coverLetter: File | null;
        portfolio: File | null;
        videoCv: File | null;
        documentType: string;
    }
    employer: {
        companyName: string;
        companyDescription: string;
        companyWebsite: string;
        email: string;
        password: string;
        otp: string;
        phone: string;
        coverPage: File | null;
        companyLogo: File | null;
    }
}

interface FormStore {
    formData: FormData;
    setFormData: (data: Partial<FormData>) => void;
    resetFormData: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
    formData: {
        applicant: {
            firstName: '',
            surname: '',
            middleName: '',
            email: '',
            password: '',
            otp: '',
            phone: '',
            address: '',
            resume: null,
            coverLetter: null,
            portfolio: null,
            videoCv: null,
            documentType: '',
        },
        employer: {
            companyName: '',
            companyDescription: '',
            companyWebsite: '',
            email: '',
            password: '',
            otp: '',
            phone: '',
            coverPage: null,
            companyLogo: null,
        }
    },
    setFormData: (data) =>
        set((state) => ({
            formData: { ...state.formData, ...data }
        })),
    resetFormData: () =>
        set(() => ({
            formData: {
                applicant: {
                    firstName: '',
                    surname: '',
                    middleName: '',
                    email: '',
                    password: '',
                    otp: '',
                    phone: '',
                    address: '',
                    resume: null,
                    coverLetter: null,
                    portfolio: null,
                    videoCv: null,
                    documentType: '',
                },
                employer: {
                    companyName: '',
                    companyDescription: '',
                    companyWebsite: '',
                    email: '',
                    password: '',
                    otp: '',
                    phone: '',
                    coverPage: null,
                    companyLogo: null,
                }
            }
        }))
}));