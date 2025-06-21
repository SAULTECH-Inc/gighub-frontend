import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { NODE_ENV, secureStorageWrapper } from "../utils/constants.ts";
import { JobPostResponse } from "../utils/types";
import { EmploymentType } from "../utils/employmentTypes.ts";

// function isValidCurrency(curr: string): curr is CurrencyType {
//     return currencies.map(c=>c.label).includes(curr as CurrencyType);
// }
export interface UseJobSearchSettings {
  sortBy: string;
  sortOrder: string;
  jobType: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
    frequency: string;
  };
  experienceLevel: string[];
  location: string;
  employmentType?: EmploymentType;
}

interface SearchSettingsState {
  settings: UseJobSearchSettings;
  jobCurrentlyViewed: JobPostResponse | null;
  jobToApply: JobPostResponse | null;
  setJobToApply: (job: JobPostResponse | null) => void;
  viewingJob: boolean;
  setViewingJob: (viewing: boolean) => void;
  setCurrentlyViewed: (job: JobPostResponse) => void;
  setSettings: (settings: UseJobSearchSettings) => void;
  resetSettings: () => void;
  updateSettings: (newSettings: Partial<UseJobSearchSettings>) => void;
}

export const useJobSearchSettings = create<SearchSettingsState>()(
  devtools(
    persist(
      immer<SearchSettingsState>((set) => ({
        settings: {
          sortBy: "",
          sortOrder: "",
          jobType: [],
          salaryRange: {
            min: 0,
            max: 0,
            currency: "₦",
            frequency: "month",
          },
          experienceLevel: [],
          location: "",
        },
        jobCurrentlyViewed: null,
        viewingJob: false,
        setViewingJob: (viewing: boolean) => {
          set((state) => {
            state.viewingJob = viewing;
          });
        },
        setCurrentlyViewed: (job: JobPostResponse) => {
          set((state) => {
            state.jobCurrentlyViewed = job;
          });
        },
        jobToApply: null,
        setJobToApply: (job: JobPostResponse | null) => {
          set((state) => {
            state.jobToApply = job;
          });
        },
        setSettings: (settings: UseJobSearchSettings) => {
          set((state) => {
            state.settings = settings;
          });
        },
        resetSettings: () => {
          set((state) => {
            state.settings = {
              sortBy: "",
              sortOrder: "",
              jobType: [],
              salaryRange: {
                min: 0,
                max: 0,
                currency: "₦",
                frequency: "month",
              },
              experienceLevel: [],
              location: "",
            };
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
      })),
      {
        name: "search-settings-storage",
        partialize: (state) => ({
          settings: state.settings,
          viewingJob: state.viewingJob,
          jobCurrentlyViewed: state.jobCurrentlyViewed,
        }),
        storage: createJSONStorage(() =>
          NODE_ENV === "production" ? secureStorageWrapper : localStorage,
        ),
      },
    ),
  ),
);
