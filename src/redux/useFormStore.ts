import { create } from 'zustand';

export interface FormData {
    firstName: string;
    surname: string;
    middleName: string;
    email: string;
    password: string;
    otp: string;
    phone: string;
    address: string;
    cv: File | null;
    coverLetter: File | null;
    portfolio: File | null;
    documentType: string;
}

interface FormStore {
    formData: FormData;
    setFormData: (data: Partial<FormData>) => void;
    resetFormData: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
    formData: {
        firstName: '',
        surname: '',
        middleName: '',
        email: '',
        password: '',
        otp: '',
        phone: '',
        address: '',
        cv: null,
        coverLetter: null,
        portfolio: null,
        documentType: ''
    },
    setFormData: (data) =>
        set((state) => ({
            formData: { ...state.formData, ...data }
        })),
    resetFormData: () =>
        set(() => ({
            formData: {
                firstName: '',
                surname: '',
                middleName: '',
                email: '',
                password: '',
                otp: '',
                phone: '',
                address: '',
                cv: null,
                coverLetter: null,
                portfolio: null,
                documentType: ''
            }
        }))
}));