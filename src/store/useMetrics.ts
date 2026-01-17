import { ApplicationMetrics } from "../utils/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UseMetricsState {
  metric: ApplicationMetrics;
  setMetrics: (metrics: ApplicationMetrics) => void;
  resetMetric: () => void;
}

export const useMetrics = create<UseMetricsState>()(
  persist(
    (set) => ({
      metric: {
        jobsApplied: 0,
        rejected: 0,
        applied: 0,
        withdrawn: 0,
        clicked: 0,
        pending: 0,
        hired: 0,
        shortlisted: 0,
        interviewed: 0,
        viewed: 0,
        remote: 0,
        onsite: 0,
        hybrid: 0,
      },
      setMetrics: (metrics) => set({ metric: metrics }),
      resetMetric: () =>
        set({
          metric: {
            jobsApplied: 0,
            rejected: 0,
            applied: 0,
            withdrawn: 0,
            clicked: 0,
            pending: 0,
            hired: 0,
            shortlisted: 0,
            interviewed: 0,
            viewed: 0,
            remote: 0,
            onsite: 0,
            hybrid: 0,
          },
        }),
    }),
    {
      name: "application-metrics", // key in localStorage
      partialize: (state) => ({ metric: state.metric }),
    },
  ),
);
