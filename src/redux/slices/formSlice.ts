import { StateCreator } from "zustand";

export interface FormData {
  firstName: string;
  middleName: string;
  surname: string;
  email: string;
  password: string;
  // Add fields for other steps as needed
}

export interface FormSlice {
  currentStep: number;
  formData: {
    [key: string]: any; // Flexible to accomodate dynamic fields
  };
  setStep: (step: number) => void;
  updateFormData: (data: Partial<FormData>) => void;
}

export const createFormSlice: StateCreator<FormSlice> = (set) => ({
  currentStep: 1,
  formData: {
    firstName: "",
    surname: "",
    middleName: "",
    email: "",
    password: "",
  },
  setStep: (step) => set({ currentStep: step }),
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
});
