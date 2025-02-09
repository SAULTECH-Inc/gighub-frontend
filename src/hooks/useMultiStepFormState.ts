import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface MultiStepFormState {
    step: number;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;
}

export const createMultiStepFormStore = (storeName: string) => {
    return create<MultiStepFormState>()(
        persist(
            (set, get) => ({
                step: 1,
                setStep: (step) => {
                    set({ step });
                },
                nextStep: () => {
                    const newStep = get().step + 1;
                    set({ step: newStep });
                },
                prevStep: () => {
                    const newStep = Math.max(1, get().step - 1);
                    set({ step: newStep });
                },
                reset: () => set({ step: 1 }),
            }),
            {
                name: storeName,
                storage: createJSONStorage(() => localStorage), // Ensures correct persistence
            }
        )
    );
};
