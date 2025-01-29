import { create } from "zustand";

interface SignupState {
  step: number;
  data: {
    employer: boolean;
    jobSeeker: boolean;
    firstName: string;
    surname: string;
    middleName: string;
    companyName: string;
    email: string;
    phone: string;
    password: string;
    documentName: string;
    document: File[] | null;
    companyWebsite: string;
    companyLogo: File | null;
    companyCoverPage: File | null;
    companyDescription: string;
  };
  updateData: (key: keyof SignupState["data"], value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  step: 1,
  data: {
    employer: false,
    jobSeeker: false,
    firstName: "",
    surname: "",
    middleName: "",
    companyName: "",
    email: "",
    phone: "",
    password: "",
    documentName: "",
    document: null,
    companyWebsite: "",
    companyLogo: null,
    companyCoverPage: null,
    companyDescription: "",
  },
  updateData: (key, value) =>
    set((state) => ({
      data: { ...state.data, [key]: value },
    })),
  nextStep: () =>
    set((state) => ({
      step: state.step + 1,
    })),
  prevStep: () =>
    set((state) => ({
      step: Math.max(state.step - 1, 1),
    })),
}));
