import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer';
import {NODE_ENV, secureStorageWrapper} from "../utils/constants.ts";

export interface JobFormData {
  title: string;
  company: string;
  endDate: string;
  description: string;
  responsibility: string;
  experienceYears: number;
  department: string;
  jobType: string;
  employmentType: string;
  jobStatus: string;
  currency: string;
  frequency: string;
  skillSet: string[];
  exactAmount: number;
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

// export const useJobFormStore = create<JobFormStore>()(
//   persist(
//     {
//       step: 1,
//       setStep: (step) => {
//         set({ step });
//       },
//       nextStep: () => {
//         const newStep = get().step + 1;
//         set({ step: newStep });
//       },
//       prevStep: () => {
//         const newStep = Math.max(1, get().step - 1);
//         set({ step: newStep });
//       },
//       reset: () => set({ step: 1 }),
//       job: {
//         title: "",
//         company: "",
//         endDate: "",
//         description: "",
//         responsibility: "",
//         department: "",
//         experienceYears: 0,
//         jobType: "",
//         employmentType: "",
//         jobStatus: "",
//         currency: "USD",
//         frequency: "per hour",
//         skillSet: [],
//         exactAmount: 0,
//         maximumAmount: 0,
//         minimumAmount: 0,
//         location: "",
//         preferredCandidateCountry: [],
//         preferredCandidatePreviousCompany: [],
//         preferredCandidateUniversity: [],
//       },
//       setJobData: (data) => set((state) => ({ job: { ...state.job, ...data } })),
//       resetFormData: () => set(() => ({
//         job: {
//           title: "",
//           company: "",
//           endDate: "",
//           description: "",
//           responsibility: "",
//           department: "",
//           jobType: "",
//           experienceYears: 0,
//           employmentType: "",
//           jobStatus: "",
//           currency: "USD",
//           frequency: "per month",
//           skillSet: [],
//           exactAmount: 0,
//           maximumAmount: 0,
//           minimumAmount: 0,
//           location: "",
//           preferredCandidateCountry: [],
//           preferredCandidatePreviousCompany: [],
//           preferredCandidateUniversity: [],
//         }
//       })),
//     },
//     {
//       name: "employer-job-form",
//       storage: createJSONStorage(() => localStorage),
//     }

//   )
// )

export const useJobFormStore = create<JobFormStore>()(persist(immer<JobFormStore>((set,)=>({
  step: 1,
  job: {
    title: "",
    company: "",
    endDate: "",
    description: "",
    responsibility: "",
    department: "",
    experienceYears: 0,
    jobType: "",
    employmentType: "",
    jobStatus: "",
    currency: "USD",
    frequency: "per hour",
    skillSet: [],
    exactAmount: 0,
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
        company: "",
        endDate: "",
        description: "",
        responsibility: "",
        department: "",
        jobType: "",
        experienceYears: 0,
        employmentType: "",
        jobStatus: "",
        currency: "USD",
        frequency: "per month",
        skillSet: [],
        exactAmount: 0,
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
  storage: createJSONStorage(()=>NODE_ENV === 'development' ? localStorage: secureStorageWrapper)
}));
