import JobDescription from "../applicant/job/JobDescription.tsx";
import CompanyInfo from "../applicant/job/CompanyInfo.tsx";
import React from "react";
import { motion } from "framer-motion";
import { useFetchJobDetailsRelativeToMe } from "../../../hooks/useFetchJobDetailsRelativeToMe.ts";
import { AlertCircle, Briefcase, RefreshCw, Search } from "lucide-react";

interface JobAndCompanyDetailsProps {
  jobId: number;
}

// Professional Loading Skeleton
const JobDetailsLoadingSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
  >
    <div className="flex w-full flex-col lg:grid lg:min-h-[600px] lg:grid-cols-[2fr_1fr]">
      {/* Job Description Skeleton */}
      <div className="flex-1 space-y-6 p-8">
        <div className="mb-6 flex items-center space-x-3">
          <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200" />
          <div className="flex-1">
            <div className="mb-2 h-6 w-3/4 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-4 w-1/2 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200" />
          <div className="h-4 w-5/6 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-4 w-4/5 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-4 w-3/4 animate-pulse rounded-lg bg-gray-200" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 animate-pulse rounded bg-gray-200" />
              <div className="h-4 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>

      {/* Company Info Skeleton */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50/30 p-6 lg:border-t-0 lg:border-l">
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-gray-200" />
            <div className="mx-auto mb-2 h-5 w-3/4 animate-pulse rounded-lg bg-gray-200" />
            <div className="mx-auto h-4 w-1/2 animate-pulse rounded-lg bg-gray-200" />
          </div>

          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 flex-1 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Loading indicator */}
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">
            Loading job details
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Please wait while we fetch the information
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

// Professional Error State
const JobDetailsErrorState: React.FC<{
  error: any;
  onRetry?: () => void;
}> = ({ error, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="w-full overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm"
  >
    <div className="flex min-h-[600px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        Unable to Load Job Details
      </h3>

      <p className="mb-6 max-w-md text-sm text-gray-600">
        {error?.message ||
          "We encountered an issue while loading the job information. This might be due to a network problem or the job may no longer be available."}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </button>
        )}

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
        >
          Go Back
        </button>
      </div>

      <p className="mt-6 text-xs text-gray-500">
        If the problem persists, please contact our support team.
      </p>
    </div>
  </motion.div>
);

// Professional Empty/Not Found State
const JobNotFoundState: React.FC<{
  onBrowseJobs?: () => void;
}> = ({ onBrowseJobs }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
  >
    <div className="flex min-h-[600px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Search className="h-8 w-8 text-gray-400" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        Job Not Found
      </h3>

      <p className="mb-6 max-w-md text-sm text-gray-600">
        The job you're looking for might have been removed, expired, or the link
        may be incorrect. The position may no longer be available.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        {onBrowseJobs && (
          <button
            onClick={onBrowseJobs}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Browse All Jobs
          </button>
        )}

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
        >
          Go Back
        </button>
      </div>

      <div className="mt-8 max-w-md rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="mb-1 text-xs font-medium text-blue-800">Suggestion</p>
        <p className="text-xs text-blue-700">
          Try searching for similar positions or browse our latest job openings
          to find opportunities that match your interests.
        </p>
      </div>
    </div>
  </motion.div>
);

export const JobAndCompanyDetails: React.FC<JobAndCompanyDetailsProps> = ({
  jobId,
}) => {
  const {
    data: job,
    isLoading,
    error,
    isError,
    refetch,
  } = useFetchJobDetailsRelativeToMe(jobId);

  // Loading state
  if (isLoading) {
    return <JobDetailsLoadingSkeleton />;
  }

  // Error state
  if (isError) {
    return <JobDetailsErrorState error={error} onRetry={() => refetch?.()} />;
  }

  // Job not found state
  if (!job) {
    return (
      <JobNotFoundState onBrowseJobs={() => (window.location.href = "/jobs")} />
    );
  }

  // Success state - render actual content
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="flex w-full flex-col lg:grid lg:min-h-[600px] lg:grid-cols-[2fr_1fr]">
        <div className="flex-1 overflow-y-auto">
          <JobDescription jobCurrentlyViewed={job} />
        </div>
        <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50/30 lg:border-t-0 lg:border-l">
          <CompanyInfo jobCurrentlyViewed={job} />
        </div>
      </div>
    </motion.div>
  );
};
