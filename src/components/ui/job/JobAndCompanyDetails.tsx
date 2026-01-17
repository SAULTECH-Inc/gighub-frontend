import React, { useState } from "react";
import { motion } from "framer-motion";
import { useFetchJobDetailsRelativeToMe } from "../../../hooks/useFetchJobDetailsRelativeToMe.ts";
import {
  AlertCircle,
  Briefcase,
  RefreshCw,
  Search,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Globe,
  Mail,
  Share2,
  Bookmark,
  Award,
  TrendingUp,
  Zap,
  BookmarkCheck,
  Link as LinkIcon,
} from "lucide-react";
import DOMPurify from "dompurify";
import {normalizeUrl} from "../../../utils/types";

interface JobAndCompanyDetailsProps {
  jobId: number;
}

const JobDetailsLoadingSkeleton: React.FC = () => (
  <div className="h-full w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
    <div className="flex min-h-[600px] animate-pulse flex-col">
      <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6">
        <div className="mb-4 flex gap-4">
          <div className="h-16 w-16 rounded-xl bg-gray-200" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-white" />
          ))}
        </div>
      </div>
      <div className="flex-1 p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 rounded bg-gray-200" />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-3 h-8 w-8 animate-spin text-purple-600" />
          <p className="text-sm font-medium text-gray-900">Loading job details...</p>
        </div>
      </div>
    </div>
  </div>
);

const JobDetailsErrorState: React.FC<{
  error: any;
  onRetry?: () => void;
}> = ({ error, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex h-full min-h-[600px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm"
  >
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
      <AlertCircle className="h-8 w-8 text-red-600" />
    </div>
    <h3 className="mb-2 text-lg font-semibold text-gray-900">Unable to Load Job Details</h3>
    <p className="mb-6 max-w-md text-sm text-gray-600">
      {error?.message || "We encountered an issue loading this job. Please try again."}
    </p>
    <div className="flex gap-3">
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
      <button
        onClick={() => window.history.back()}
        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
      >
        Go Back
      </button>
    </div>
  </motion.div>
);

const JobNotFoundState: React.FC<{
  onBrowseJobs?: () => void;
}> = ({ onBrowseJobs }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex h-full min-h-[600px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm"
  >
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
      <Search className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="mb-2 text-lg font-semibold text-gray-900">Job Not Found</h3>
    <p className="mb-6 max-w-md text-sm text-gray-600">
      This job may have been removed or expired.
    </p>
    <div className="flex gap-3">
      {onBrowseJobs && (
        <button
          onClick={onBrowseJobs}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
        >
          <Briefcase className="h-4 w-4" />
          Browse All Jobs
        </button>
      )}
      <button
        onClick={() => window.history.back()}
        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
      >
        Go Back
      </button>
    </div>
  </motion.div>
);

export const JobAndCompanyDetails: React.FC<JobAndCompanyDetailsProps> = ({
                                                                            jobId,
                                                                          }) => {
  const [activeTab, setActiveTab] = useState<"description" | "company">("description");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const {
    data: job,
    isLoading,
    error,
    isError,
    refetch,
  } = useFetchJobDetailsRelativeToMe(jobId);

  if (isLoading) {
    return <JobDetailsLoadingSkeleton />;
  }

  if (isError) {
    return <JobDetailsErrorState error={error} onRetry={() => refetch?.()} />;
  }

  if (!job) {
    return (
      <JobNotFoundState onBrowseJobs={() => (window.location.href = "/jobs")} />
    );
  }

  const daysLeft = Math.ceil((new Date(job.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Header Section */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex gap-4">
            <img
              src={job?.employer?.companyLogo || "#"}
              alt={"logo"}
              className="h-16 w-16 rounded-xl border-2 border-white object-cover shadow-md"
            />
            <div>
              <h1 className="mb-1 text-xl font-bold text-gray-900 lg:text-2xl">
                {job?.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4" />
                <span className="font-medium">{job?.company}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-300 bg-white p-2 transition-colors hover:bg-gray-50">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="rounded-lg border border-gray-300 bg-white p-2 transition-colors hover:bg-gray-50"
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-5 w-5 text-purple-600" />
              ) : (
                <Bookmark className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Key Stats */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-xs font-medium">Location</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-900">{job?.location}</p>
          </div>

          <div className="rounded-lg bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="h-4 w-4" />
              <span className="text-xs font-medium">Job Type</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-900">{job?.jobType}</p>
          </div>

          {job?.salaryRange?.maximumAmount > 0 && (
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs font-medium">Salary</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {job?.salaryRange?.currency}
                {job?.salaryRange?.minimumAmount?.toLocaleString()} - {job?.salaryRange?.maximumAmount?.toLocaleString()}
              </p>
            </div>
          )}

          <div className="rounded-lg bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Deadline</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700">
            Apply Now
          </button>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="rounded-lg border-2 border-purple-600 bg-white px-6 py-3 text-sm font-semibold text-purple-600 transition-colors hover:bg-purple-50"
          >
            {isBookmarked ? 'Saved' : 'Save Job'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex">
          <button
            onClick={() => setActiveTab("description")}
            className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
              activeTab === "description"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Job Description
          </button>
          <button
            onClick={() => setActiveTab("company")}
            className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
              activeTab === "company"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Company Info
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "description" ? (
          <div className="space-y-6">
            {/* Overview */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Zap className="h-5 w-5 text-purple-600" />
                Job Overview
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job?.description || '') }}
              />
            </div>

            {/* Skills Required */}
            {job?.skillSet?.length > 0 && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Award className="h-5 w-5 text-purple-600" />
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skillSet.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Details */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                <AlertCircle className="h-5 w-5 text-purple-600" />
                Additional Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                  <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Applicants</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {job?.applicantsCount || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                  <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Posted</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {new Date(job?.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {job?.level && (
                  <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                    <TrendingUp className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Experience</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {job?.level} ({job?.experienceYears} years)
                      </p>
                    </div>
                  </div>
                )}

                {job?.employmentType && (
                  <div className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                    <Briefcase className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Work Mode</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {job?.employmentType}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Company Overview */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Building2 className="h-5 w-5 text-purple-600" />
                About {job?.company}
              </h2>
              <p className="text-sm text-gray-700">
                {job?.employer?.companyDescription || "Company description not available."}
              </p>
            </div>

            {/* Company Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              {job?.employer?.companySize && (
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-3">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Company Size</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {job?.employer?.companySize}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {job?.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                <LinkIcon className="h-5 w-5 text-purple-600" />
                Connect with Us
              </h2>
              <div className="space-y-2">
                {job?.employer?.companyWebsite && (
                    <a
                        href={normalizeUrl(job?.employer?.companyWebsite)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                    >
                      <Globe className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
    Visit Website
  </span>
                    </a>

                )}

                {job?.employer?.email && (
                  <a
                    href={`mailto:${job.employer.email}`}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                  >
                    <Mail className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {job.employer.email}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};