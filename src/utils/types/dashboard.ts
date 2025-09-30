// types/dashboard.ts - Updated to use existing app types

import {
  JobStatus,
  JobType,
  ApplicantData,
  JobPostResponse,
  InterviewScheduleDetailsResponse
} from './index';
import { ApplicationStatus, InterviewStatus, InterviewType, Priority } from "../enums.ts"; // Adjust import path as needed

export interface DashboardMetrics {
  totalApplications: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  };
  activePositions: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  };
  interviewsScheduled: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  };
  offersSent: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  };
  hireRate: {
    value: number; // percentage
    change: number;
    trend: 'up' | 'down' | 'neutral';
  };
  avgTimeToHire: {
    value: number; // in days
    change: number;
    trend: 'up' | 'down' | 'neutral';
  };
}

// Extended candidate interface for dashboard display
export interface DashboardCandidate extends ApplicantData {
  position: string; // Applied position
  matchScore: number;
  appliedDate: string;
  salaryExpectation?: string;
  availability: string;
  applicationStatus: ApplicationStatus;
}

// Extended interview interface for dashboard display
export interface DashboardInterview {
  id: number;
  candidateId: number;
  candidateName: string;
  candidateAvatar: string | null;
  position: string;
  jobId: number;
  jobTitle: string;
  date: string; // ISO date string
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  interviewType: InterviewType;
  interviewPlatform: string;
  status: InterviewStatus;
  interviewer: string;
  interviewerId: number;
  meetingLink?: string;
  notes?: string;
  location?: string; // for in-person interviews
  timeZone: string;
}

// Extended job posting interface for dashboard display
export interface DashboardJobPosting extends JobPostResponse {
  applications: number;
  views: number;
  posted: string; // Formatted relative date
  urgency: Priority;
  remote: boolean;
  hybrid: boolean;
}

export interface HiringFunnelData {
  applications: number;
  screening: number;
  interviews: number;
  offers: number;
  hired: number;
}

export interface ActivityFeedItem {
  id: string;
  type: 'hire' | 'interview_scheduled' | 'application_received' | 'job_posted' | 'offer_sent' | 'candidate_rejected';
  title: string;
  description: string;
  timestamp: string; // ISO date string
  userId: number;
  userName: string;
  candidateId?: number;
  candidateName?: string;
  jobId?: number;
  jobTitle?: string;
  metadata?: Record<string, any>;
}

export interface WeeklyGoals {
  interviewsTarget: number;
  interviewsCompleted: number;
  offersTarget: number;
  offersCompleted: number;
  applicationsReviewTarget: number;
  applicationsReviewCompleted: number;
}

export interface AIInsight {
  id: string;
  type: 'optimization' | 'performance' | 'alert' | 'recommendation';
  title: string;
  description: string;
  priority: Priority;
  actionUrl?: string;
  timestamp: string;
}

// API Response types
export interface DashboardAPIResponse {
  success: boolean;
  data: {
    metrics: DashboardMetrics;
    topCandidates: DashboardCandidate[];
    upcomingInterviews: DashboardInterview[];
    activeJobs: DashboardJobPosting[];
    hiringFunnel: HiringFunnelData;
    recentActivity: ActivityFeedItem[];
    weeklyGoals: WeeklyGoals;
    aiInsights: AIInsight[];
  };
  message?: string;
}

// API Query Parameters
export interface DashboardFilters {
  period?: 'week' | 'month' | 'quarter' | 'year';
  departmentId?: string;
  jobId?: number;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
  jobStatus?: JobStatus;
  jobType?: JobType;
  applicationStatus?: ApplicationStatus;
  interviewStatus?: InterviewStatus;
}

// Separate endpoint response types (if using multiple endpoints)
export interface MetricsResponse {
  success: boolean;
  data: DashboardMetrics;
  message?: string;
}

export interface CandidatesResponse {
  success: boolean;
  data: {
    candidates: DashboardCandidate[];
    total: number;
    hasMore: boolean;
  };
  message?: string;
}

export interface InterviewsResponse {
  success: boolean;
  data: {
    interviews: DashboardInterview[];
    total: number;
  };
  message?: string;
}

export interface JobsResponse {
  success: boolean;
  data: {
    jobs: DashboardJobPosting[];
    total: number;
  };
  message?: string;
}

export interface ActivityResponse {
  success: boolean;
  data: {
    activities: ActivityFeedItem[];
    hasMore: boolean;
  };
  message?: string;
}

// Transform functions for existing types to dashboard types
export function transformApplicantToCandidate(
  applicant: ApplicantData,
  jobTitle: string,
  applicationStatus: ApplicationStatus,
  matchScore: number = 0,
  appliedDate: string,
  salaryExpectation?: string,
  availability: string = 'Available'
): DashboardCandidate {
  return {
    ...applicant,
    position: jobTitle,
    matchScore,
    appliedDate,
    salaryExpectation,
    availability,
    applicationStatus,
  };
}

export function transformInterviewToDashboard(
  interview: InterviewScheduleDetailsResponse
): DashboardInterview {
  return {
    id: interview.id,
    candidateId: interview.applicants[0]?.id || 0,
    candidateName: `${interview.applicants[0]?.firstName} ${interview.applicants[0]?.lastName}`,
    candidateAvatar: interview.applicants[0]?.profilePicture || null,
    position: interview.job.title,
    jobId: interview.job.id,
    jobTitle: interview.job.title,
    date: interview.date,
    startTime: interview.startTime,
    endTime: interview.endTime,
    duration: interview.duration,
    interviewType: interview.interviewType,
    interviewPlatform: interview.interviewPlatform,
    status: interview.status,
    interviewer: interview.interviewer,
    interviewerId: 0, // You may need to add this to your InterviewScheduleDetailsResponse
    meetingLink: interview.interviewLink,
    notes: interview.notes,
    location: interview.interviewType === InterviewType.IN_PERSON
      ? `${interview.interviewCity}, ${interview.interviewState}`
      : undefined,
    timeZone: interview.timeZone,
  };
}

export function transformJobToDashboard(job: JobPostResponse): DashboardJobPosting {
  return {
    ...job,
    applications: job.applicantsCount || 0,
    views: 0, // You may need to add this field to JobPostResponse
    posted: formatRelativeDate(job.createdAt.toString()),
    urgency: job.priority as Priority,
    remote: job.employmentType?.toString().toLowerCase().includes('remote') || false,
    hybrid: job.employmentType?.toString().toLowerCase().includes('hybrid') || false,
  };
}

// Utility function for date formatting
function formatRelativeDate(dateString: string): string {
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
}
