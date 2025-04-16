import {create} from "zustand";
import {createJSONStorage, devtools, persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {NODE_ENV, secureStorageWrapper} from "../utils/constants.ts";

export interface UseJobSearchSettings {
    sortBy: string;
    sortOrder: string;
    jobType: string[];
    salaryRange: {
        min: number;
        max: number;
        currency: string;
        frequency: string;
    },
    experienceLevel: string[];
    location: string;
}

interface SearchSettingsState{
    settings: UseJobSearchSettings | null;
    setSettings: (settings: UseJobSearchSettings) => void;
    resetSettings: () => void;
    updateSettings: (newSettings: Partial<UseJobSearchSettings>) => void;
}


export const useJobSearchSettings = create<SearchSettingsState>()(devtools(persist(immer<SearchSettingsState>((set,)=>({
    settings: null,
    setSettings: (settings: UseJobSearchSettings) => {
        set((state) => {
            state.settings = settings;
        });
    },
    resetSettings: () => {
        set((state) => {
            state.settings = null;
        });
    },
    updateSettings: (newSettings: Partial<UseJobSearchSettings>) => {
        set((state) => {
            state.settings = {
                ...state.settings,
                ...newSettings,
            } as UseJobSearchSettings;
        });
    },
})),{
    name: "search-settings-storage",
    partialize: (state)=>({
        settings: state.settings,
    }),
    storage: createJSONStorage(() =>
        NODE_ENV === "production" ? secureStorageWrapper : localStorage
    ),
})));
