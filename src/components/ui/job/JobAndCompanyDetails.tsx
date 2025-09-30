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
    className="w-full overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200"
  >
    <div className="flex w-full flex-col lg:grid lg:grid-cols-[2fr_1fr] lg:min-h-[600px]">
      {/* Job Description Skeleton */}
      <div className="flex-1 p-8 space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse" />
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded-lg w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded-lg w-4/5 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <div className="h-10 bg-gray-200 rounded-lg flex-1 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-lg flex-1 animate-pulse" />
        </div>
      </div>

      {/* Company Info Skeleton */}
      <div className="flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50/30 p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded-lg w-3/4 mx-auto mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse" />
          </div>

          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
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
          <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">Loading job details</p>
          <p className="text-xs text-gray-500 mt-1">Please wait while we fetch the information</p>
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
    className="w-full overflow-hidden rounded-2xl bg-white shadow-sm border border-red-200"
  >
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Unable to Load Job Details
      </h3>

      <p className="text-sm text-gray-600 mb-6 max-w-md">
        {error?.message || "We encountered an issue while loading the job information. This might be due to a network problem or the job may no longer be available."}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        )}

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Go Back
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-6">
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
    className="w-full overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200"
  >
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
        <Search className="h-8 w-8 text-gray-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Job Not Found
      </h3>

      <p className="text-sm text-gray-600 mb-6 max-w-md">
        The job you're looking for might have been removed, expired, or the link may be incorrect.
        The position may no longer be available.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {onBrowseJobs && (
          <button
            onClick={onBrowseJobs}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Browse All Jobs
          </button>
        )}

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Go Back
        </button>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md">
        <p className="text-xs text-blue-800 font-medium mb-1">Suggestion</p>
        <p className="text-xs text-blue-700">
          Try searching for similar positions or browse our latest job openings to find opportunities that match your interests.
        </p>
      </div>
    </div>
  </motion.div>
);

export const JobAndCompanyDetails: React.FC<JobAndCompanyDetailsProps> = ({ jobId }) => {
  const { data: job, isLoading, error, isError, refetch } = useFetchJobDetailsRelativeToMe(jobId);

  // Loading state
  if (isLoading) {
    return <JobDetailsLoadingSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <JobDetailsErrorState
        error={error}
        onRetry={() => refetch?.()}
      />
    );
  }

  // Job not found state
  if (!job) {
    return (
      <JobNotFoundState
        onBrowseJobs={() => window.location.href = '/jobs'}
      />
    );
  }

  // Success state - render actual content
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex w-full flex-col lg:grid lg:grid-cols-[2fr_1fr] lg:min-h-[600px]">
        <div className="flex-1 overflow-y-auto">
          <JobDescription jobCurrentlyViewed={job} />
        </div>
        <div className="flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50/30">
          <CompanyInfo jobCurrentlyViewed={job} />
        </div>
      </div>
    </motion.div>
  );
};
