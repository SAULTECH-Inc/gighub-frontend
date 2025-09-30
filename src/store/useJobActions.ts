// store/useJobActions.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApplicationMethod, ScreeningAnswer } from "../utils/types";
import { applyForJob, rateJob, referJobToSomeone } from "../services/api";
import { RateeType } from "../utils/enums.ts";

interface JobActionState {
  referSomeoneToAJob: (jobId: number, emails: string[]) => Promise<any>;
  applyToJob: (
    jobId: number,
    applicationMethod: ApplicationMethod,
    screeningAnswers?: ScreeningAnswer[]
  ) => Promise<any>;
  rateSomeone: (
    rating: number,
    userId: number,
    rateeType: RateeType,
    comment?: string,
  ) => Promise<any>;
}

export const useJobActions = create<JobActionState>()(
  persist(
    () => ({
      referSomeoneToAJob: async (jobId, emails) => {
        return await referJobToSomeone(jobId, emails); // just return the promise
      },
      applyToJob: async (jobId, applicationMethod) => {
        return await applyForJob({
          jobId: jobId,
          applicationMethod: applicationMethod,
        });
      },
      rateSomeone: async (rating, userId, rateeType, comment) => {
        return await rateJob({
          rateeId: userId,
          score: rating,
          rateeType: rateeType,
          comment: comment,
        });
      },
    }),
    {
      name: "job-actions",
    },
  ),
);
