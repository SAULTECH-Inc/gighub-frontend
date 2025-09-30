// services/dashboardApi.ts - Rewritten to use existing API pattern

import {
  DashboardFilters,
  DashboardMetrics,
  DashboardCandidate,
  DashboardInterview,
  DashboardJobPosting,
  ActivityFeedItem,
  HiringFunnelData,
  WeeklyGoals,
  AIInsight,
  transformApplicantToCandidate,
  transformInterviewToDashboard,
  transformJobToDashboard
} from '../../utils/types/dashboard.ts';
import {
  APIResponse,
  ApplicationResponse,
  JobPostResponse,
  InterviewScheduleDetailsResponse,
  JobStatus,
  ApplicationMetrics,
} from '../../utils/types';
import { privateApiClient } from "../../client/axios.ts";
import { API_BASE_URL } from "../../utils/constants.ts";
import { ApplicationStatus } from "../../utils/enums.ts";

// Dashboard API functions using the existing API pattern

/**
 * Fetch all dashboard data in a single call
 */
export const fetchDashboardData = async (
  filters: DashboardFilters = {}
): Promise<APIResponse<any>> => {
  console.log('Fetching complete dashboard data with filters:', filters);

  const response = await privateApiClient.get<APIResponse<any>>(
    `${API_BASE_URL}/employer/dashboard`,
    { params: filters }
  );

  console.log('Dashboard API Response:', response.data);

  return response.data;
};

/**
 * Fetch dashboard metrics only
 */
export const fetchDashboardMetrics = async (
  period: string = 'month'
): Promise<APIResponse<DashboardMetrics>> => {
  console.log(`Fetching dashboard metrics for period: ${period}`);

  const response = await privateApiClient.get<APIResponse<DashboardMetrics>>(
    `${API_BASE_URL}/employer/dashboard/metrics`,
    { params: { period } }
  );

  return response.data;
};

/**
 * Fetch top candidates using existing application system
 */
export const fetchTopCandidates = async (
  limit: number = 10,
  status?: string
): Promise<APIResponse<DashboardCandidate[]>> => {
  console.log(`Fetching top candidates with limit: ${limit}, status: ${status}`);

  const response = await privateApiClient.get<APIResponse<DashboardCandidate[]>>(
    `${API_BASE_URL}/employer/dashboard/candidates`,
    { params: { limit, status } }
  );

  return response.data;
};

/**
 * Fetch upcoming interviews
 */
export const fetchUpcomingInterviews = async (
  days: number = 7
): Promise<APIResponse<DashboardInterview[]>> => {
  console.log(`Fetching upcoming interviews for next ${days} days`);

  const response = await privateApiClient.get<APIResponse<DashboardInterview[]>>(
    `${API_BASE_URL}/employer/dashboard/interviews`,
    { params: { days } }
  );

  return response.data;
};

/**
 * Fetch active job postings
 */
export const fetchActiveJobs = async (
  limit: number = 10
): Promise<APIResponse<DashboardJobPosting[]>> => {
  console.log(`Fetching active jobs with limit: ${limit}`);

  const response = await privateApiClient.get<APIResponse<DashboardJobPosting[]>>(
    `${API_BASE_URL}/employer/dashboard/jobs`,
    { params: { limit } }
  );

  return response.data;
};

/**
 * Fetch recent activity feed
 */
export const fetchRecentActivity = async (
  limit: number = 10
): Promise<APIResponse<ActivityFeedItem[]>> => {
  console.log(`Fetching recent activity with limit: ${limit}`);

  const response = await privateApiClient.get<APIResponse<ActivityFeedItem[]>>(
    `${API_BASE_URL}/employer/dashboard/activity`,
    { params: { limit } }
  );

  return response.data;
};

/**
 * Fetch hiring funnel data
 */
export const fetchHiringFunnel = async (
  period: string = 'month'
): Promise<APIResponse<HiringFunnelData>> => {
  console.log(`Fetching hiring funnel data for period: ${period}`);

  const response = await privateApiClient.get<APIResponse<HiringFunnelData>>(
    `${API_BASE_URL}/employer/dashboard/funnel`,
    { params: { period } }
  );

  return response.data;
};

/**
 * Fetch weekly goals
 */
export const fetchWeeklyGoals = async (): Promise<APIResponse<WeeklyGoals>> => {
  console.log('Fetching weekly goals');

  const response = await privateApiClient.get<APIResponse<WeeklyGoals>>(
    `${API_BASE_URL}/employer/dashboard/goals`
  );

  return response.data;
};

/**
 * Fetch AI insights
 */
export const fetchAIInsights = async (
  limit: number = 5
): Promise<APIResponse<AIInsight[]>> => {
  console.log(`Fetching AI insights with limit: ${limit}`);

  const response = await privateApiClient.get<APIResponse<AIInsight[]>>(
    `${API_BASE_URL}/employer/dashboard/insights`,
    { params: { limit } }
  );

  return response.data;
};

// Utility functions for backward compatibility with existing API endpoints

/**
 * Get applications count by status for an employer
 */
export const getApplicationsByStatus = async (
  status: ApplicationStatus,
  period: string = 'month'
): Promise<APIResponse<{ count: number }>> => {
  console.log(`Fetching applications count for status: ${status}, period: ${period}`);

  const response = await privateApiClient.post<APIResponse<{ count: number }>>(
    `${API_BASE_URL}/applications/count`,
    { status, period }
  );

  return response.data;
};

/**
 * Get job views count for employer's active jobs
 */
export const getJobViewsCount = async (jobId?: number): Promise<APIResponse<{ views: number }>> => {
  console.log(`Fetching job views count for jobId: ${jobId || 'all jobs'}`);

  const endpoint = jobId
    ? `${API_BASE_URL}/jobs/${jobId}/views`
    : `${API_BASE_URL}/jobs/total-views`;

  const response = await privateApiClient.get<APIResponse<{ views: number }>>(endpoint);

  return response.data;
};

/**
 * Calculate hiring funnel from application statuses
 */
export const calculateHiringFunnel = async (period: string = 'month'): Promise<HiringFunnelData> => {
  console.log(`Calculating hiring funnel for period: ${period}`);

  try {
    // Use your existing fetchMyJobsApplications endpoint to get all applications
    const allApplicationsResponse = await privateApiClient.post<APIResponse<ApplicationResponse[]>>(
      `${API_BASE_URL}/jobs/applicants`,
      {
        status: '', // Empty status to get all applications
        page: 1,
        limit: 1000,
      }
    );

    const applications = allApplicationsResponse.data.data;

    // Count applications by status
    const statusCounts = applications.reduce((counts, app) => {
      const status = app.status;
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    return {
      applications: statusCounts[ApplicationStatus.PENDING] || 0,
      screening: statusCounts[ApplicationStatus.SHORTLISTED] || 0,
      interviews: statusCounts[ApplicationStatus.INTERVIEWED] || 0,
      offers: statusCounts[ApplicationStatus.OFFER_EXTENDED] || 0,
      hired: statusCounts[ApplicationStatus.HIRED] || 0
    };
  } catch (error) {
    console.error('Error calculating hiring funnel:', error);
    // Return empty funnel data on error
    return {
      applications: 0,
      screening: 0,
      interviews: 0,
      offers: 0,
      hired: 0
    };
  }
};

/**
 * Transform existing metrics to dashboard format
 */
export const transformExistingMetrics = async (
  existingMetrics: ApplicationMetrics
): Promise<DashboardMetrics> => {
  console.log('Transforming existing metrics to dashboard format');

  // Get additional data needed for dashboard metrics
  const [activeJobsResponse, offersSentResponse] = await Promise.all([
    privateApiClient.get<APIResponse<{ count: number }>>(`${API_BASE_URL}/jobs/count?status=${JobStatus.POSTED}`),
    getApplicationsByStatus(ApplicationStatus.OFFER_EXTENDED)
  ]);

  return {
    totalApplications: {
      value: existingMetrics.applied || 0,
      change: 0, // Calculate from historical data if available
      trend: 'neutral' as const
    },
    activePositions: {
      value: activeJobsResponse.data.data.count || 0,
      change: 0,
      trend: 'neutral' as const
    },
    interviewsScheduled: {
      value: existingMetrics.interviewed || 0,
      change: 0,
      trend: 'neutral' as const
    },
    offersSent: {
      value: offersSentResponse.data.count || 0,
      change: 0,
      trend: 'neutral' as const
    },
    hireRate: {
      value: existingMetrics.applied > 0
        ? Math.round((existingMetrics.hired / existingMetrics.applied) * 100)
        : 0,
      change: 0,
      trend: 'neutral' as const
    },
    avgTimeToHire: {
      value: 18, // Calculate from actual hire dates
      change: 0,
      trend: 'neutral' as const
    }
  };
};

/**
 * Transform applications to dashboard candidates format
 */
export const transformApplicationsToCandidates = (
  applications: ApplicationResponse[]
): DashboardCandidate[] => {
  return applications.map(app =>
    transformApplicantToCandidate(
      app.applicant,
      app.job.title,
      app.status,
      85 + Math.floor(Math.random() * 15), // Mock match score for now
      app.createdAt.toString(),
      `${app.job.salaryRange.currency}${app.job.salaryRange.minimumAmount}k-${app.job.salaryRange.maximumAmount}k`,
      'Available' // Mock availability
    )
  );
};

/**
 * Transform interviews to dashboard format
 */
export const transformInterviewsToDashboard = (
  interviews: InterviewScheduleDetailsResponse[]
): DashboardInterview[] => {
  return interviews.map(interview => transformInterviewToDashboard(interview));
};

/**
 * Transform jobs to dashboard format
 */
export const transformJobsToDashboard = (
  jobs: JobPostResponse[]
): DashboardJobPosting[] => {
  return jobs.map(job => transformJobToDashboard(job));
};

// Utility date formatting functions
export const formatInterviewDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  }
};

export const formatInterviewTime = (timeString: string): string => {
  // If timeString is already formatted, return as is
  if (timeString.includes('AM') || timeString.includes('PM')) {
    return timeString;
  }

  // If it's in 24-hour format (HH:MM), convert to 12-hour
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minutes} ${ampm}`;
};

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return '1 day ago';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 14) {
    return '1 week ago';
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} weeks ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
};

/**
 * Transform metrics data for display
 */
export const transformMetricsData = (apiMetrics: DashboardMetrics) => {
  return [
    {
      id: 'total-applications',
      title: 'Total Applications',
      value: apiMetrics.totalApplications.value.toLocaleString(),
      change: apiMetrics.totalApplications.change,
      trend: apiMetrics.totalApplications.trend,
      icon: 'Users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'vs last period'
    },
    {
      id: 'active-positions',
      title: 'Active Positions',
      value: apiMetrics.activePositions.value,
      change: apiMetrics.activePositions.change,
      trend: apiMetrics.activePositions.trend,
      icon: 'Briefcase',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'currently hiring'
    },
    {
      id: 'interviews-scheduled',
      title: 'Interviews Scheduled',
      value: apiMetrics.interviewsScheduled.value,
      change: apiMetrics.interviewsScheduled.change,
      trend: apiMetrics.interviewsScheduled.trend,
      icon: 'Calendar',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'this period'
    },
    {
      id: 'offers-sent',
      title: 'Offers Sent',
      value: apiMetrics.offersSent.value,
      change: apiMetrics.offersSent.change,
      trend: apiMetrics.offersSent.trend,
      icon: 'UserCheck',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'pending response'
    },
    {
      id: 'hire-rate',
      title: 'Hire Rate',
      value: `${apiMetrics.hireRate.value}%`,
      change: apiMetrics.hireRate.change,
      trend: apiMetrics.hireRate.trend,
      icon: 'Target',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'vs last period'
    },
    {
      id: 'avg-time-to-hire',
      title: 'Avg. Time to Hire',
      value: `${apiMetrics.avgTimeToHire.value} days`,
      change: apiMetrics.avgTimeToHire.change,
      trend: apiMetrics.avgTimeToHire.trend,
      icon: 'Timer',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      description: apiMetrics.avgTimeToHire.trend === 'down' ? 'improvement' : 'vs last period'
    }
  ];
};
