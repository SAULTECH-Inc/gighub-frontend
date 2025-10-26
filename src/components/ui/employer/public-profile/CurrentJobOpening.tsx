import React, { memo, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ApplicationMethod, JobPostResponse } from "../../../../utils/types";
import { fetchJobsByEmployer } from "../../../../services/api";
import { showErrorToast } from "../../../../utils/toastConfig.tsx";
import logger from "../../../../log-config";
import { Link } from "react-router-dom";
import ApplicationModal from "../../ApplicationModal.tsx";
import { useJobSearchSettings } from "../../../../store/useJobSearchSettings.ts";
import useModalStore from "../../../../store/modalStateStores.ts";
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Eye,
  Send,
  ChevronRight,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

interface JobOpeningProp {
  employerId: number;
}

const JobOpening: React.FC<JobOpeningProp> = memo(({ employerId }) => {
  const [jobs, setJobs] = useState<JobPostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { jobToApply, setJobToApply } = useJobSearchSettings();
  const { openModal, isModalOpen } = useModalStore();

  const pagination = {
    page: 1,
    limit: 6,
  };

  const fetchJobs = useCallback(async () => {
    if (!employerId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchJobsByEmployer(
        employerId,
        pagination.page,
        pagination.limit,
      );
      setJobs(res?.data || []);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to load job openings";
      setError(errorMessage);
      logger.error(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [employerId, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleApplyClick = useCallback(
    (job: JobPostResponse) => {
      setJobToApply(job);
      openModal("application-modal");
    },
    [setJobToApply, openModal],
  );

  const formatDate = useCallback((dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  }, []);

  const stripHtml = useCallback((html: string) => {
    return html.replace(/<[^>]*>/g, "").substring(0, 120);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 sm:p-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Current Job Openings
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-xl bg-slate-100 p-6"
            >
              <div className="mb-4 space-y-2">
                <div className="h-6 rounded bg-slate-200"></div>
                <div className="h-4 w-2/3 rounded bg-slate-200"></div>
              </div>
              <div className="mb-4 space-y-2">
                <div className="h-4 w-1/2 rounded bg-slate-200"></div>
                <div className="h-4 w-3/4 rounded bg-slate-200"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-20 rounded bg-slate-200"></div>
                <div className="h-10 w-24 rounded bg-slate-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 sm:p-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Current Job Openings
        </h2>
        <div className="rounded-xl bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-lg font-semibold text-red-800">
            Error Loading Jobs
          </h3>
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={fetchJobs}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Current Job Openings
          </h2>
          {jobs.length > 0 && (
            <p className="text-sm text-slate-500">
              {jobs.length} {jobs.length === 1 ? "position" : "positions"}{" "}
              available
            </p>
          )}
        </div>

        {jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-slate-50 p-12 text-center"
          >
            <Briefcase className="mx-auto mb-4 h-12 w-12 text-slate-400" />
            <h3 className="mb-2 text-lg font-semibold text-slate-600">
              No Open Positions
            </h3>
            <p className="text-slate-500">
              This company currently has no job openings available.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(index * 0.1, 0.5),
                }}
                className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md hover:ring-slate-300"
              >
                {/* Job Header */}
                <div className="mb-4">
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                    {job.title}
                  </h3>

                  {/* Location */}
                  {job.location && (
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                  )}
                </div>

                {/* Job Details */}
                <div className="mb-4 flex flex-wrap items-center justify-between space-y-2 text-sm text-slate-500 transition-colors group-hover:text-indigo-600">
                  {job.employmentType && (
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{job.employmentType}</span>
                    </div>
                  )}

                  {job?.salaryRange !== null &&
                    job?.salaryRange?.maximumAmount > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <DollarSign className="h-4 w-4 shrink-0" />
                        <span>{job?.salaryRange?.maximumAmount}</span>
                      </div>
                    )}

                  {job?.createdAt && (
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <CalendarDays className="h-4 w-4 shrink-0" />
                      <span>
                        Posted {formatDate(job?.createdAt?.toString())}
                      </span>
                    </div>
                  )}
                </div>

                {/* Job Description Preview */}
                {job.description && (
                  <div className="mb-6">
                    <p className="line-clamp-3 text-sm text-slate-600">
                      {stripHtml(job.description)}...
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApplyClick(job)}
                    className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                  >
                    <Send className="h-4 w-4" />
                    <span>Apply</span>
                  </button>

                  <Link
                    to={`/jobs/${job.id}/details`}
                    className="flex items-center justify-center space-x-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:outline-none"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Details</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Hover Effect Overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Application Modal */}
      {isModalOpen("application-modal") && jobToApply && (
        <ApplicationModal
          modalId="application-modal"
          applicationMethod={jobToApply.applicationMethod as ApplicationMethod}
        />
      )}
    </div>
  );
});

JobOpening.displayName = "JobOpening";

export default JobOpening;
