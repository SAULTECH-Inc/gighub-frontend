// hooks/useDashboardData.ts - Updated to match APIResponse interface

import { useState, useEffect, useCallback } from "react";
import {
  DashboardMetrics,
  DashboardCandidate,
  DashboardInterview,
  DashboardJobPosting,
  ActivityFeedItem,
  HiringFunnelData,
  WeeklyGoals,
  AIInsight,
  DashboardFilters,
} from "../utils/types/dashboard.ts";
import {
  fetchDashboardData,
  fetchDashboardMetrics,
  fetchTopCandidates,
  fetchUpcomingInterviews,
  fetchActiveJobs,
  fetchRecentActivity,
  fetchHiringFunnel,
  fetchWeeklyGoals,
  fetchAIInsights,
  transformMetricsData,
  transformExistingMetrics,
} from "../services/services/dashboardApi";
import { useMetrics } from "../store/useMetrics"; // Your existing metrics store
import { APIResponse } from "../utils/types"; // Your actual APIResponse interface

interface DashboardDataState {
  metrics: DashboardMetrics | null;
  topCandidates: DashboardCandidate[];
  upcomingInterviews: DashboardInterview[];
  activeJobs: DashboardJobPosting[];
  recentActivity: ActivityFeedItem[];
  hiringFunnel: HiringFunnelData | null;
  weeklyGoals: WeeklyGoals | null;
  aiInsights: AIInsight[];
}

interface DashboardLoadingState {
  isLoading: boolean;
  metricsLoading: boolean;
  candidatesLoading: boolean;
  interviewsLoading: boolean;
  jobsLoading: boolean;
  activityLoading: boolean;
  funnelLoading: boolean;
  goalsLoading: boolean;
  insightsLoading: boolean;
}

interface DashboardErrorState {
  error: string | null;
  metricsError: string | null;
  candidatesError: string | null;
  interviewsError: string | null;
  jobsError: string | null;
  activityError: string | null;
  funnelError: string | null;
  goalsError: string | null;
  insightsError: string | null;
}

export const useDashboardData = (
  loadingStrategy: "single" | "sections" = "single",
  filters: DashboardFilters = {},
) => {
  const { metric: existingMetrics, setMetrics } = useMetrics(); // Your existing metrics store

  const [data, setData] = useState<DashboardDataState>({
    metrics: null,
    topCandidates: [],
    upcomingInterviews: [],
    activeJobs: [],
    recentActivity: [],
    hiringFunnel: null,
    weeklyGoals: null,
    aiInsights: [],
  });

  const [loading, setLoading] = useState<DashboardLoadingState>({
    isLoading: false,
    metricsLoading: false,
    candidatesLoading: false,
    interviewsLoading: false,
    jobsLoading: false,
    activityLoading: false,
    funnelLoading: false,
    goalsLoading: false,
    insightsLoading: false,
  });

  const [errors, setErrors] = useState<DashboardErrorState>({
    error: null,
    metricsError: null,
    candidatesError: null,
    interviewsError: null,
    jobsError: null,
    activityError: null,
    funnelError: null,
    goalsError: null,
    insightsError: null,
  });

  // Helper function to check if response was successful
  const isSuccessfulResponse = <T>(response: APIResponse<T>): boolean => {
    // Check for your actual success criteria
    return (
      response.statusCode === 200 ||
      (!response.error && !response.statusCode) ||
      (response.statusCode >= 200 && response.statusCode < 300)
    );
  };

  // Single API call approach
  const loadAllData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, isLoading: true }));
    setErrors((prev) => ({ ...prev, error: null }));

    try {
      const response = await fetchDashboardData(filters);

      if (isSuccessfulResponse(response)) {
        // Since your controller returns a complete dashboard data object
        const dashboardData = response.data;

        setData({
          metrics: dashboardData.metrics || null,
          topCandidates: dashboardData.topCandidates || [],
          upcomingInterviews: dashboardData.upcomingInterviews || [],
          activeJobs: dashboardData.activeJobs || [],
          recentActivity: dashboardData.recentActivity || [],
          hiringFunnel: dashboardData.hiringFunnel || null,
          weeklyGoals: dashboardData.weeklyGoals || null,
          aiInsights: dashboardData.aiInsights || [],
        });

        // Update your existing metrics store if needed
        if (existingMetrics && dashboardData.metrics) {
          setMetrics(existingMetrics); // Keep existing format for other parts of app
        }
      } else {
        throw new Error(
          response.error || response.message || "Failed to load dashboard data",
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setErrors((prev) => ({ ...prev, error: errorMessage }));
      console.error("Dashboard data loading error:", error);

      // Fallback: try to use existing metrics if available
      if (existingMetrics) {
        try {
          const transformedMetrics =
            await transformExistingMetrics(existingMetrics);
          setData((prev) => ({ ...prev, metrics: transformedMetrics }));
        } catch (transformError) {
          console.error(
            "Failed to transform existing metrics:",
            transformError,
          );
        }
      }
    } finally {
      setLoading((prev) => ({ ...prev, isLoading: false }));
    }
  }, [filters, existingMetrics, setMetrics]);

  // Section-by-section loading approach
  const loadMetrics = useCallback(
    async (period: string = "month") => {
      setLoading((prev) => ({ ...prev, metricsLoading: true }));
      setErrors((prev) => ({ ...prev, metricsError: null }));

      try {
        const response = await fetchDashboardMetrics(period);
        if (isSuccessfulResponse(response)) {
          setData((prev) => ({ ...prev, metrics: response.data }));
        } else {
          throw new Error(response.error || "Failed to load metrics");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load metrics";
        setErrors((prev) => ({ ...prev, metricsError: errorMessage }));

        // Fallback to existing metrics
        if (existingMetrics) {
          try {
            const transformedMetrics =
              await transformExistingMetrics(existingMetrics);
            setData((prev) => ({ ...prev, metrics: transformedMetrics }));
          } catch (transformError) {
            console.error(
              "Failed to transform existing metrics:",
              transformError,
            );
          }
        }
      } finally {
        setLoading((prev) => ({ ...prev, metricsLoading: false }));
      }
    },
    [existingMetrics],
  );

  const loadCandidates = useCallback(
    async (limit: number = 10) => {
      setLoading((prev) => ({ ...prev, candidatesLoading: true }));
      setErrors((prev) => ({ ...prev, candidatesError: null }));

      try {
        const response = await fetchTopCandidates(
          limit,
          filters.applicationStatus,
        );
        if (isSuccessfulResponse(response)) {
          setData((prev) => ({ ...prev, topCandidates: response.data }));
        } else {
          throw new Error(response.error || "Failed to load candidates");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load candidates";
        setErrors((prev) => ({ ...prev, candidatesError: errorMessage }));
      } finally {
        setLoading((prev) => ({ ...prev, candidatesLoading: false }));
      }
    },
    [filters.applicationStatus],
  );

  const loadInterviews = useCallback(async (days: number = 7) => {
    setLoading((prev) => ({ ...prev, interviewsLoading: true }));
    setErrors((prev) => ({ ...prev, interviewsError: null }));

    try {
      const response = await fetchUpcomingInterviews(days);
      if (isSuccessfulResponse(response)) {
        setData((prev) => ({
          ...prev,
          upcomingInterviews: response.data,
        }));
      } else {
        throw new Error(response.error || "Failed to load interviews");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load interviews";
      setErrors((prev) => ({ ...prev, interviewsError: errorMessage }));
    } finally {
      setLoading((prev) => ({ ...prev, interviewsLoading: false }));
    }
  }, []);

  const loadJobs = useCallback(async (limit: number = 10) => {
    setLoading((prev) => ({ ...prev, jobsLoading: true }));
    setErrors((prev) => ({ ...prev, jobsError: null }));

    try {
      const response = await fetchActiveJobs(limit);
      if (isSuccessfulResponse(response)) {
        setData((prev) => ({
          ...prev,
          activeJobs: response.data,
        }));
      } else {
        throw new Error(response.error || "Failed to load jobs");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load jobs";
      setErrors((prev) => ({ ...prev, jobsError: errorMessage }));
    } finally {
      setLoading((prev) => ({ ...prev, jobsLoading: false }));
    }
  }, []);

  const loadActivity = useCallback(async (limit: number = 10) => {
    setLoading((prev) => ({ ...prev, activityLoading: true }));
    setErrors((prev) => ({ ...prev, activityError: null }));

    try {
      const response = await fetchRecentActivity(limit);
      if (isSuccessfulResponse(response)) {
        setData((prev) => ({ ...prev, recentActivity: response.data }));
      } else {
        throw new Error(response.error || "Failed to load activity");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load activity";
      setErrors((prev) => ({ ...prev, activityError: errorMessage }));
    } finally {
      setLoading((prev) => ({ ...prev, activityLoading: false }));
    }
  }, []);

  const loadFunnel = useCallback(async (period: string = "month") => {
    setLoading((prev) => ({ ...prev, funnelLoading: true }));
    setErrors((prev) => ({ ...prev, funnelError: null }));

    try {
      const response = await fetchHiringFunnel(period);
      if (isSuccessfulResponse(response)) {
        setData((prev) => ({ ...prev, hiringFunnel: response.data }));
      } else {
        throw new Error(response.error || "Failed to load funnel data");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load funnel data";
      setErrors((prev) => ({ ...prev, funnelError: errorMessage }));
    } finally {
      setLoading((prev) => ({ ...prev, funnelLoading: false }));
    }
  }, []);

  const loadGoals = useCallback(async () => {
    setLoading((prev) => ({ ...prev, goalsLoading: true }));
    setErrors((prev) => ({ ...prev, goalsError: null }));

    try {
      const response = await fetchWeeklyGoals();
      if (isSuccessfulResponse(response)) {
        setData((prev) => ({ ...prev, weeklyGoals: response.data }));
      } else {
        throw new Error(response.error || "Failed to load goals");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load goals";
      setErrors((prev) => ({ ...prev, goalsError: errorMessage }));
    } finally {
      setLoading((prev) => ({ ...prev, goalsLoading: false }));
    }
  }, []);

  const loadInsights = useCallback(async (limit: number = 5) => {
    setLoading((prev) => ({ ...prev, insightsLoading: true }));
    setErrors((prev) => ({ ...prev, insightsError: null }));

    try {
      const response = await fetchAIInsights(limit);
      if (isSuccessfulResponse(response)) {
        setData((prev) => ({ ...prev, aiInsights: response.data }));
      } else {
        throw new Error(response.error || "Failed to load insights");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load insights";
      setErrors((prev) => ({ ...prev, insightsError: errorMessage }));
    } finally {
      setLoading((prev) => ({ ...prev, insightsLoading: false }));
    }
  }, []);

  // Section-by-section loading
  const loadDataSections = useCallback(async () => {
    if (loadingStrategy === "sections") {
      // Load critical data first
      const criticalPromises = [loadMetrics(filters.period), loadInterviews()];

      // Start critical data loading
      await Promise.allSettled(criticalPromises);

      // Load secondary data with slight delay
      setTimeout(() => {
        Promise.allSettled([loadCandidates(), loadJobs(), loadActivity()]);
      }, 100);

      // Load tertiary data with more delay
      setTimeout(() => {
        Promise.allSettled([
          loadFunnel(filters.period),
          loadGoals(),
          loadInsights(),
        ]);
      }, 300);
    }
  }, [
    loadingStrategy,
    filters.period,
    loadMetrics,
    loadInterviews,
    loadCandidates,
    loadJobs,
    loadActivity,
    loadFunnel,
    loadGoals,
    loadInsights,
  ]);

  // Main load function
  const loadDashboard = useCallback(async () => {
    if (loadingStrategy === "single") {
      await loadAllData();
    } else {
      await loadDataSections();
    }
  }, [loadingStrategy, loadAllData, loadDataSections]);

  // Refresh specific sections
  const refreshMetrics = useCallback(
    () => loadMetrics(filters.period),
    [loadMetrics, filters.period],
  );
  const refreshCandidates = useCallback(
    () => loadCandidates(),
    [loadCandidates],
  );
  const refreshInterviews = useCallback(
    () => loadInterviews(),
    [loadInterviews],
  );
  const refreshJobs = useCallback(() => loadJobs(), [loadJobs]);
  const refreshActivity = useCallback(() => loadActivity(), [loadActivity]);
  const refreshFunnel = useCallback(
    () => loadFunnel(filters.period),
    [loadFunnel, filters.period],
  );
  const refreshGoals = useCallback(() => loadGoals(), [loadGoals]);
  const refreshInsights = useCallback(() => loadInsights(), [loadInsights]);

  // Initial load
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Transform metrics for display
  const transformedMetrics = data.metrics
    ? transformMetricsData(data.metrics)
    : [];

  // Computed values
  const totalApplicationsCount = data.topCandidates.length;
  const todaysInterviewsCount = data.upcomingInterviews.filter(
    (interview) => interview.date === "Today",
  ).length;
  const activeJobsCount = data.activeJobs.length;

  return {
    // Data
    data,
    transformedMetrics,

    // Computed values
    totalApplicationsCount,
    todaysInterviewsCount,
    activeJobsCount,

    // Loading states
    loading,
    isLoading: loading.isLoading || Object.values(loading).some(Boolean),

    // Error states
    errors,
    hasErrors: Object.values(errors).some(Boolean),

    // Main actions
    loadDashboard,

    // Refresh actions
    refreshMetrics,
    refreshCandidates,
    refreshInterviews,
    refreshJobs,
    refreshActivity,
    refreshFunnel,
    refreshGoals,
    refreshInsights,

    // Individual loaders (for section-by-section approach)
    loadMetrics,
    loadCandidates,
    loadInterviews,
    loadJobs,
    loadActivity,
    loadFunnel,
    loadGoals,
    loadInsights,

    // Utility functions
    refetchAll: loadDashboard,
    clearErrors: useCallback(() => {
      setErrors({
        error: null,
        metricsError: null,
        candidatesError: null,
        interviewsError: null,
        jobsError: null,
        activityError: null,
        funnelError: null,
        goalsError: null,
        insightsError: null,
      });
    }, []),

    // Data manipulation functions
    updateCandidate: useCallback(
      (candidateId: number, updates: Partial<DashboardCandidate>) => {
        setData((prev) => ({
          ...prev,
          topCandidates: prev.topCandidates.map((candidate) =>
            candidate.id === candidateId
              ? { ...candidate, ...updates }
              : candidate,
          ),
        }));
      },
      [],
    ),

    updateInterview: useCallback(
      (interviewId: number, updates: Partial<DashboardInterview>) => {
        setData((prev) => ({
          ...prev,
          upcomingInterviews: prev.upcomingInterviews.map((interview) =>
            interview.id === interviewId
              ? { ...interview, ...updates }
              : interview,
          ),
        }));
      },
      [],
    ),

    updateJob: useCallback(
      (jobId: number, updates: Partial<DashboardJobPosting>) => {
        setData((prev) => ({
          ...prev,
          activeJobs: prev.activeJobs.map((job) =>
            job.id === jobId ? { ...job, ...updates } : job,
          ),
        }));
      },
      [],
    ),

    addActivity: useCallback((activity: ActivityFeedItem) => {
      setData((prev) => ({
        ...prev,
        recentActivity: [activity, ...prev.recentActivity.slice(0, 9)], // Keep only latest 10
      }));
    }, []),
  };
};
