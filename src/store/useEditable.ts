import { useMemo } from "react";
import {create} from "zustand";

interface FormStore {
    editableSections: Record<string, boolean>;
    toggleSectionEdit: (section: string) => void;
}

// Zustand store
const useFormStore = create<FormStore>((set) => ({
    editableSections: {},

    toggleSectionEdit: (section: string) =>
        set((state) => ({
            editableSections: {
                ...state.editableSections,
                [section]: !state.editableSections[section],
            },
        })),
}));


const useSectionEditable = (sectionName: string) => {
    const isEditable = useFormStore((state) => state.editableSections[sectionName] || false);
    const toggleEdit = useFormStore((state) => {
        return state.toggleSectionEdit;
    });

    // Memoize the return object to prevent re-renders
    return useMemo(() => ({ isEditable, toggleEdit: () => toggleEdit(sectionName) }), [isEditable, toggleEdit, sectionName]);
};

export { useFormStore, useSectionEditable };
