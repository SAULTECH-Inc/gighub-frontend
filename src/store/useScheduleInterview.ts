import {
  ApplicantData,
  InterviewScheduleDetails,
  JobPostResponse,
} from "../utils/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { NODE_ENV, secureStorageWrapper } from "../utils/constants.ts";

interface ScheduleInterviewState {
  interviewDetails: InterviewScheduleDetails | null;
  setInterviewDetails: (details: InterviewScheduleDetails) => void;
  selectedCandidates: ApplicantData[];
  setSelectedCandidates: (candidates: ApplicantData[]) => void;
  selectedJob: JobPostResponse | null;
  setSelectedJob: (job: JobPostResponse) => void;
  interviewId: number | null;
  setInterviewId: (id: number | null) => void;
  step: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useScheduleInterview = create<ScheduleInterviewState>()(
  persist(
    (set) => ({
      interviewDetails: null,
      setInterviewDetails: (details) =>
        set((state) => ({
          interviewDetails: { ...state.interviewDetails, ...details },
        })),
      selectedCandidates: [],
      setSelectedCandidates: (
        updater: ApplicantData[] | ((prev: ApplicantData[]) => ApplicantData[]),
      ) => {
        set((state): Partial<ScheduleInterviewState> => {
          const newCandidates =
            typeof updater === "function"
              ? updater(state.selectedCandidates)
              : updater;

          return {
            selectedCandidates: newCandidates,
            interviewDetails: {
              ...state.interviewDetails,
              applicantId: newCandidates.map((c) => c.id),
            } as InterviewScheduleDetails,
          };
        });
      },
      selectedJob: null,
      setSelectedJob: (job: JobPostResponse) =>
        set((state) => ({ selectedJob: { ...state.selectedJob, ...job } })),
      interviewId: null,
      setInterviewId: (id: number | null) => set(() => ({ interviewId: id })),
      step: 1,
      setStep: (step) => set({ step }),
      nextStep: () => set((state) => ({ step: state.step + 1 })),
      prevStep: () => set((state) => ({ step: state.step - 1 })),
      reset: () =>
        set({
          step: 1,
          interviewDetails: null,
          selectedCandidates: [],
          selectedJob: null,
        }),
    }),
    {
      partialize: (state) => ({
        step: state.step,
        interviewDetails: state.interviewDetails,
        selectedCandidates: state.selectedCandidates,
        selectedJob: state.selectedJob,
        interviewId: state.interviewId,
      }),
      storage: createJSONStorage(() =>
        NODE_ENV === "development" ? localStorage : secureStorageWrapper,
      ),
      name: "schedule-interview-storage",
    },
  ),
);
