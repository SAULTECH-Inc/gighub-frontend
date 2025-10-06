import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  APIResponse,
  ApplicationMethod,
  JobPostResponse,
  SkillsResponseDto,
} from "../utils/types";
import {
  API_BASE_URL,
  NODE_ENV,
  secureStorageWrapper,
} from "../utils/constants.ts";
import { privateApiClient } from "../client/axios.ts";
import { handleError } from "../utils/helpers.ts";

export interface AutoRejectReason {
  value: string;
  label: string;
}

export interface JobAiSettings {
  minimumMatchPercentage: number;
  enableAiScreening: boolean;
  autoRejectThreshold?: number;
  autoAcceptApplications: boolean;
  strictSkillMatching: boolean;
  criticalSkills: string[];
  minimumExperienceStrict?: number;
  requiredEducationLevels?: string[];
  matchPriority: ["skills", "experience"];
  autoRejectSettings: {
    enableAutoReject: boolean;
    rejectReasons: AutoRejectReason[];
    sendRejectionEmail: boolean;
    customRejectionMessage?: string;
  };
  resumeAnalysis: {
    checkEmploymentGaps: boolean;
    analyzeCareerProgression: boolean;
  };
}

export interface ScreeningQuestion {
  id: string;
  question: string;
  type: "short_text" | "long_text" | "yes_no" | "options" | "dropdown";
  required: boolean;
  options?: string[];
  expectedAnswer?: string | string[]; // Expected answer(s) for AI scoring
  aiWeight?: number; // Weight of this question in AI scoring (1-10)
  scoringCriteria?: string; // How to evaluate text answers
}

export interface JobFormData {
  title: string;
  endDate: string;
  description: string;
  responsibility: string;
  requirements: string;
  experienceYears: number;
  department: string;
  jobType: string;
  level: string;
  frequency: string;
  employmentType: string;
  currency: string;
  priority: string;
  hiringManager: string;
  skillSet: SkillsResponseDto[];
  maximumAmount: number;
  minimumAmount: number;
  location: string;
  preferredCandidateCountry: string[];
  preferredCandidatePreviousCompany: string[];
  preferredCandidateUniversity: string[];
  applicationMethod: ApplicationMethod;
  aiSettings?: JobAiSettings;
  screeningQuestions?: ScreeningQuestion[];
}

interface JobFormStore {
  step: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  job: JobFormData;
  setJobData: (data: Partial<JobFormData>) => void;
  postJob: (job: JobFormData) => Promise<APIResponse<JobPostResponse>>;
  resetFormData: () => void;
}

export const useJobFormStore = create<JobFormStore>()(
  persist(
    immer<JobFormStore>((set) => ({
      step: 1,
      job: {
        title: "",
        endDate: "",
        description: "",
        responsibility: "",
        requirements: "",
        department: "",
        experienceYears: 0,
        jobType: "",
        level: "",
        frequency: "",
        employmentType: "",
        currency: "₦",
        priority: "MEDIUM",
        hiringManager: "",
        skillSet: [] as SkillsResponseDto[],
        maximumAmount: 0,
        minimumAmount: 0,
        location: "",
        preferredCandidateCountry: [],
        preferredCandidatePreviousCompany: [],
        preferredCandidateUniversity: [],
        applicationMethod: {
          byCv: false,
          byVideo: false,
          byPortfolio: false,
          byProfile: false,
          byCoverLetter: false,
        },
        aiSettings: {
          minimumMatchPercentage: 60,
          enableAiScreening: false,
          autoRejectThreshold: 30,
          autoAcceptApplications: false,
          strictSkillMatching: false,
          criticalSkills: [],
          minimumExperienceStrict: undefined,
          requiredEducationLevels: [],
          matchPriority: ["skills", "experience"],
          autoRejectSettings: {
            enableAutoReject: false,
            rejectReasons: [],
            sendRejectionEmail: true,
            customRejectionMessage: "",
          },
          resumeAnalysis: {
            checkEmploymentGaps: false,
            analyzeCareerProgression: false,
          },
        },
        screeningQuestions: [],
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
      postJob: async (job) => {
        try {
          const response = await privateApiClient.post<
            APIResponse<JobPostResponse>
          >(`${API_BASE_URL}/jobs/create`, job);
          return response?.data;
        } catch (err: any) {
          handleError(err);
          return {} as APIResponse<JobPostResponse>;
        }
      },
      resetFormData: () => {
        set((state) => {
          state.job = {
            title: "",
            endDate: "",
            description: "",
            responsibility: "",
            requirements: "",
            department: "",
            jobType: "",
            level: "",
            frequency: "",
            experienceYears: 0,
            employmentType: "",
            currency: "₦",
            priority: "MEDIUM",
            hiringManager: "",
            skillSet: [] as SkillsResponseDto[],
            maximumAmount: 0,
            minimumAmount: 0,
            location: "",
            preferredCandidateCountry: [],
            preferredCandidatePreviousCompany: [],
            preferredCandidateUniversity: [],
            applicationMethod: {
              byCv: false,
              byVideo: false,
              byPortfolio: false,
              byProfile: false,
              byCoverLetter: false,
            },
            aiSettings: {
              minimumMatchPercentage: 60,
              enableAiScreening: false,
              autoRejectThreshold: 30,
              autoAcceptApplications: false,
              strictSkillMatching: false,
              criticalSkills: [],
              minimumExperienceStrict: undefined,
              requiredEducationLevels: [],
              matchPriority: ["skills", "experience"],
              autoRejectSettings: {
                enableAutoReject: false,
                rejectReasons: [],
                sendRejectionEmail: true,
                customRejectionMessage: "",
              },
              resumeAnalysis: {
                checkEmploymentGaps: false,
                analyzeCareerProgression: false,
              },
            },
            screeningQuestions: [],
          };
          state.step = 1;
        });
      },
    })),
    {
      name: "employer-job-form",
      partialize: (state) => ({
        job: state.job,
        step: state.step,
      }),
      storage: createJSONStorage(() =>
        NODE_ENV === "development" ? localStorage : secureStorageWrapper,
      ),
    },
  ),
);
