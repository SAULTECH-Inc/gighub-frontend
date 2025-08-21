import React, { useEffect, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Building2,
  Users,
  ChevronRight,
  Briefcase,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { fetchShortlistedJobs } from "../../services/api";
import { JobPostResponse } from "../../utils/types";

const ShortlistedJobs: React.FC = memo(() => {
  const [jobs, setJobs] = useState<JobPostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pagination] = useState({
    page: 1,
    limit: 5,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchShortlistedJobs(pagination);
        setJobs(response?.data || []);
      } catch (err: any) {
        setError(err?.message || "Failed to load shortlisted jobs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [pagination.page, pagination.limit]);

  const JobSkeleton = () => (
    <div className="flex items-center space-x-3 py-4">
      <div className="h-14 w-14 animate-pulse rounded-xl bg-slate-200"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200"></div>
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200"></div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <div className="h-full rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-pink-100 p-2">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Shortlisted Jobs</h2>
          </div>

          <Link
            to="/shortlisted-jobs"
            className="flex items-center space-x-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
          >
            <span>See all</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {/* Content */}
        <div className="space-y-1">
          {loading ? (
            // Loading State
            <>
              {[...Array(3)].map((_, index) => (
                <JobSkeleton key={index} />
              ))}
            </>
          ) : error ? (
            // Error State
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="mb-3 h-10 w-10 text-red-400" />
              <h3 className="mb-1 text-sm font-medium text-slate-900">Error Loading Jobs</h3>
              <p className="text-xs text-slate-500">{error}</p>
            </div>
          ) : jobs.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 rounded-full bg-slate-100 p-6">
                <Briefcase className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mb-2 text-sm font-medium text-slate-900">No Shortlisted Jobs</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Jobs you shortlist will appear here for easy access
              </p>
              <Link
                to="/jobs"
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            // Jobs List
            <AnimatePresence>
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group relative"
                >
                  <Link
                    to={`/jobs/${job.id}/details`}
                    className="flex items-center space-x-3 rounded-lg p-3 transition-all hover:bg-slate-50 hover:shadow-sm"
                  >
                    {/* Company Logo */}
                    <div className="relative h-14 w-14 shrink-0">
                      <div className="h-full w-full overflow-hidden rounded-xl bg-slate-100">
                        {job.employer?.companyLogo ? (
                          <img
                            src={job.employer.companyLogo}
                            alt={`${job.company} logo`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                            <Building2 className="h-6 w-6 text-slate-400" />
                          </div>
                        )}
                      </div>

                      {/* Heart indicator */}
                      <div className="absolute -top-1 -right-1 rounded-full bg-pink-500 p-1.5 shadow-sm">
                        <Heart className="h-2.5 w-2.5 fill-white text-white" />
                      </div>
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors truncate">
                            {job.title}
                          </h3>
                          <p className="text-xs text-slate-600 truncate mt-0.5">
                            {job.company}
                          </p>

                          {/* Additional Info */}
                          <div className="mt-2 flex items-center space-x-3 text-xs text-slate-500">
                            {job.location && (
                              <span className="truncate">{job.location}</span>
                            )}
                            {job.jobType && (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">
                                {job.jobType}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-indigo-600 shrink-0 ml-2" />
                      </div>
                    </div>
                  </Link>

                  {/* Network info overlay on hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute left-16 top-full z-10 hidden group-hover:block"
                  >
                    <div className="mt-1 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3" />
                        <span>2 people in your network work here</span>
                      </div>
                      {/* Arrow */}
                      <div className="absolute -top-1 left-4 h-2 w-2 rotate-45 bg-slate-800"></div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <Link
              to="/shortlisted-jobs"
              className="inline-flex items-center space-x-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-200 hover:text-slate-900"
            >
              <span>View All Shortlisted</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

ShortlistedJobs.displayName = 'ShortlistedJobs';

export default ShortlistedJobs;