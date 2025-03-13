import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer';
import { SkillsResponseDto } from '../utils/types';
import {NODE_ENV, secureStorageWrapper} from "../utils/constants.ts";

export interface JobFormData {
  title: string;
  endDate: string;
  description: string;
  responsibility: string;
  experienceYears: number;
  department: string;
  jobType: string;
  level: string;
  frequency: string;
  employmentType: string;
  currency: string;
  skillSet: SkillsResponseDto[];
  maximumAmount: number;
  minimumAmount: number;
  location: string;
  preferredCandidateCountry: string[];
  preferredCandidatePreviousCompany: string[];
  preferredCandidateUniversity: string[];
}

interface JobFormStore {
  step: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  job: JobFormData;
  setJobData: (data: Partial<JobFormData>) => void;
  resetFormData: () => void;
}

export const useJobFormStore = create<JobFormStore>()(persist(immer<JobFormStore>((set,)=>({
  step: 1,
  job: {
    title: "",
    endDate: "",
    description: "",
    responsibility: "",
    department: "",
    experienceYears: 0,
    jobType: "",
    level: "",
    frequency: "",
    employmentType: "",
    currency: "USD",
    skillSet: [] as SkillsResponseDto[],
    maximumAmount: 0,
    minimumAmount: 0,
    location: "",
    preferredCandidateCountry: [],
    preferredCandidatePreviousCompany: [],
    preferredCandidateUniversity: [],
  },
  setStep: (step) => {
    set((state) => {
      state.step = step;
    });
  },
  nextStep: () => {
    set((state) => {
      state.step += 1;
    });
  },
  prevStep: () => {
    set((state) => {
      state.step = Math.max(1, state.step - 1);
    });
  },
  reset: () => {
    set((state) => {
      state.step = 1;
    });
  },
  setJobData: (data) => {
    set((state) => {
      state.job = { ...state.job, ...data };
    });
  },
  resetFormData: () => {
    set((state) => {
      state.job = {
        title: "",
        endDate: "",
        description: "",
        responsibility: "",
        department: "",
        jobType: "",
        level: "",
        frequency: "",
        experienceYears: 0,
        employmentType: "",
        currency: "USD",
        skillSet: [] as SkillsResponseDto[],
        maximumAmount: 0,
        minimumAmount: 0,
        location: "",
        preferredCandidateCountry: [],
        preferredCandidatePreviousCompany: [],
        preferredCandidateUniversity: [],
      };
    });
  },
})),{
  name: "employer-job-form",
  partialize: (state)=>({
    job: state.job,
    step: state.step
  }),
  storage: createJSONStorage(() => localStorage),
}));
