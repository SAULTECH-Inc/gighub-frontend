import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import { applicantNavBarItemMap, AVATAR_API_URL } from "../../utils/constants.ts";
import JobSearchSidebar from "../../components/ui/JobSearchSidebar.tsx";
import ApplicantSchedules from "../../components/ui/ApplicantSchedules.tsx";
import TopHiringCompanies from "./TopHiringCompanies.tsx";
import JobSearchTopBar from "../../components/ui/JobSearchTopBar.tsx";
import { AnimatePresence, motion } from "framer-motion";
import { useJobSearchSettings } from "../../store/useJobSearchSettings.ts";
import { JobPostResponse, TopHiringCompanyDto } from "../../utils/types";
import { useFetchJobs } from "../../hooks/useJobQuery.ts";
import { getTopHiringCompanies } from "../../services/api";
import { calculateDaysLeft } from "../../utils/helpers.ts";
import MainFooter from "../../components/layouts/MainFooter.tsx";
import { useBulkJobSearch } from "../../hooks/useBulkJobSearch.ts";
import { JobAndCompanyDetails } from "../../components/ui/job/JobAndCompanyDetails.tsx";
import {
  X,
  SlidersHorizontal,
  Building2,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  Share2,
  ExternalLink,
  Calendar,
  AlertCircle,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowLeft
} from "lucide-react";
import DOMPurify from "dompurify";
import { RateeType } from "../../utils/enums.ts";
import { useJobActions } from "../../store/useJobActions.ts";
import { showErrorToast, showSuccessToast } from "../../utils/toastConfig.tsx";
import { bookmarkJob, removeJobBookmark } from "../../services/api";
import Rating from "../../components/common/Rating.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import ShareModal from "../../components/ui/ShareModal.tsx";
import ApplicationModal from "../../components/ui/ApplicationModal.tsx";
import ApplicationSuccessModal from "../../components/ui/ApplicationSuccessModal.tsx";
import PaymentSuccessModal from "../../components/ui/PaymentSuccessModal.tsx";
import ReferModal from "../../components/ui/ReferModal.tsx";
import { FRONTEND_BASE_URL } from "../../utils/constants.ts";
import {useNavigate } from "react-router-dom";

const JobSearch: React.FC = () => {
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [jobs, setJobs] = useState<JobPostResponse[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [topHiringCompanies, setTopHiringCompanies] = useState<TopHiringCompanyDto[]>([]);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);

  const { settings } = useJobSearchSettings();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const detailsPanelRef = useRef<HTMLDivElement>(null);

  const { data: defaultJobsData, isLoading: defaultLoading } = useFetchJobs(
      pagination.page,
      pagination.limit
  );

  const searchParams = useMemo(
      () => ({
        ...settings,
        page: pagination.page,
        limit: pagination.limit,
      }),
      [settings, pagination]
  );

  const shouldSearch =
      settings.jobType.length > 0 ||
      settings.experienceLevel.length > 0 ||
      settings.sortBy.trim() !== "" ||
      settings.location.trim() !== "" ||
      settings.sortOrder.trim() !== "" ||
      settings.salaryRange.max > 0;

  const { data: bulkData, isLoading: bulkLoading } = useBulkJobSearch(searchParams, shouldSearch);

  useEffect(() => {
    if (shouldSearch && bulkData) {
      setJobs(bulkData.data ?? []);
      setTotalPages(bulkData.meta?.totalPages || 1);
    } else if (!shouldSearch && defaultJobsData) {
      setJobs(defaultJobsData.data ?? []);
      setTotalPages(defaultJobsData.meta?.totalPages || 1);
    }
  }, [shouldSearch, bulkData, defaultJobsData]);

  useEffect(() => {
    const fetchTopHiringCompanies = async () => {
      const response = await getTopHiringCompanies();
      setTopHiringCompanies(response?.data || []);
    };
    fetchTopHiringCompanies();
  }, []);

  const updateJobRating = (jobId: number, newRating: number) => {
    const updated = jobs.map((job) =>
        job.id === jobId
            ? { ...job, rating: { ...job.rating, averageScore: newRating } } as JobPostResponse
            : job
    );
    setJobs(updated);
  };

  const handleToggleFilterSidebar = () => setShowFilterSidebar((prev) => !prev);

  const handleViewJobDetails = (jobId: number) => {
    setSelectedJobId(jobId);
    setShowJobDetails(true);
  };

  const handleCloseJobDetails = () => {
    setShowJobDetails(false);
    setTimeout(() => setSelectedJobId(null), 300);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFilterSidebar && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setShowFilterSidebar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilterSidebar]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (settings.jobType.length > 0) count += settings.jobType.length;
    if (settings.experienceLevel.length > 0) count += settings.experienceLevel.length;
    if (settings.sortBy.trim() !== "") count++;
    if (settings.location.trim() !== "") count++;
    if (settings.employmentType) count++;
    if (settings.salaryRange.max > 0) count++;
    return count;
  }, [settings]);

  return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <TopNavBar navbarItemsMap={applicantNavBarItemMap} userType="applicant" />
        </div>

        {/* Filter Sidebar */}
        <AnimatePresence>
          {showFilterSidebar && (
              <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowFilterSidebar(false)}
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                />
                <motion.div
                    ref={sidebarRef}
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-0 left-0 z-50 h-full w-80 overflow-y-auto bg-white shadow-2xl"
                >
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                        <SlidersHorizontal className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                        {activeFiltersCount > 0 && (
                            <p className="text-xs text-gray-500">{activeFiltersCount} active</p>
                        )}
                      </div>
                    </div>
                    <button
                        onClick={() => setShowFilterSidebar(false)}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-6">
                    <JobSearchSidebar
                        jobType={settings?.jobType || []}
                        experience={settings?.experienceLevel || []}
                        sortBy={settings?.sortBy || ""}
                        location={settings?.location || ""}
                        employmentType={settings?.employmentType}
                    />
                  </div>
                </motion.div>
              </>
          )}
        </AnimatePresence>

        {/* Job Details Panel */}
        <AnimatePresence>
          {showJobDetails && selectedJobId && (
              <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleCloseJobDetails}
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                />
                <motion.div
                    ref={detailsPanelRef}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-0 right-0 z-50 h-full w-full overflow-y-auto bg-white shadow-2xl md:w-[600px] lg:w-[700px]"
                >
                  <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-4">
                    <button
                        onClick={handleCloseJobDetails}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900">Job Details</h2>
                  </div>
                  <div className="p-6">
                    <JobAndCompanyDetails jobId={selectedJobId} />
                  </div>
                </motion.div>
              </>
          )}
        </AnimatePresence>

        <div className="sticky top-[64px] z-30 bg-white">
          <JobSearchTopBar
              setTotalPages={setTotalPages}
              setJobs={setJobs}
              toggleSidebar={handleToggleFilterSidebar}
              activeFiltersCount={activeFiltersCount}
          />
        </div>

        <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 lg:px-6">
          <div className="flex gap-6">
            <main className="min-w-0 flex-1">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {shouldSearch ? "Search Results" : "All Jobs"}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">{jobs.length} positions available</p>
                </div>
                <button
                    onClick={handleToggleFilterSidebar}
                    className="relative flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                    {activeFiltersCount}
                  </span>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {(bulkLoading || defaultLoading) && (
                    <div className="flex items-center justify-center rounded-xl bg-white py-16">
                      <div className="text-center">
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                        <p className="text-gray-600">Loading amazing opportunities...</p>
                      </div>
                    </div>
                )}

                {!bulkLoading && !defaultLoading && jobs.length === 0 && (
                    <div className="rounded-xl bg-white p-16 text-center">
                      <AlertCircle className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                      <p className="text-lg font-medium text-gray-900">No jobs found</p>
                      <p className="mt-2 text-sm text-gray-600">Try adjusting your filters</p>
                    </div>
                )}

                {jobs.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        updateJobRating={updateJobRating}
                        onViewDetails={handleViewJobDetails}
                    />
                ))}

                {jobs.length > 0 && (
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-white p-6 shadow-sm">
                      <button
                          disabled={pagination.page === 1}
                          onClick={() =>
                              setPagination((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))
                          }
                          className="rounded-lg bg-gray-100 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <div className="flex items-center gap-2 px-4">
                        <span className="font-medium text-gray-900">Page {pagination.page}</span>
                        <span className="text-gray-400">of</span>
                        <span className="font-medium text-gray-600">{totalPages}</span>
                      </div>
                      <button
                          disabled={pagination.page >= totalPages}
                          onClick={() =>
                              setPagination((prev) => ({
                                ...prev,
                                page: Math.min(prev.page + 1, totalPages),
                              }))
                          }
                          className="rounded-lg bg-purple-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                )}
              </div>
            </main>

            <aside className="hidden w-[380px] flex-shrink-0 lg:block">
              <div className="sticky top-[180px] space-y-6">
                <ApplicantSchedules />
                <TopHiringCompanies topHiringCompanies={topHiringCompanies} />
              </div>
            </aside>
          </div>
        </div>

        <MainFooter />
      </div>
  );
};

// Job Card Component
const JobCard: React.FC<{
  job: JobPostResponse;
  updateJobRating: (jobId: number, rating: number) => void;
  onViewDetails: (jobId: number) => void;
}> = memo(({ job, updateJobRating, onViewDetails }) => {
  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked || false);
  const [rating, setRating] = useState(job?.rating?.averageScore || 0);
  const [isRatingLoading, setIsRatingLoading] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  const { rateSomeone } = useJobActions();
  const { openModal, isModalOpen } = useModalStore();
  const { setJobToApply } = useJobSearchSettings();
  const navigate = useNavigate();

  const daysLeft = calculateDaysLeft(job.endDate);
  const isUrgent = daysLeft <= 3;
  const postedDaysAgo = useMemo(() => ((job?.id || 1) % 7) + 1, [job?.id]);
  const url = useMemo(() => `${FRONTEND_BASE_URL}/jobs/${job?.id}/details`, [job?.id]);

  const visibleSkills = showAllSkills ? job.skillSet : job.skillSet?.slice(0, 4);
  const hasMoreSkills = job.skillSet?.length > 4;

  const handleRating = async (value: number) => {
    if (isRatingLoading) return;
    setIsRatingLoading(true);
    setRating(value);
    try {
      const response = await rateSomeone(value, job?.id, RateeType.JOB, "");
      if (response.statusCode === 201 && response.data) {
        updateJobRating(job?.id, response.data.score);
        showSuccessToast("Rating submitted!");
      }
    } catch (error: any) {
      console.error(error.message);
      setRating(job?.rating?.averageScore || 0);
      showErrorToast("Rating failed");
    } finally {
      setIsRatingLoading(false);
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await removeJobBookmark(job?.id);
        showSuccessToast("Removed from bookmarks");
      } else {
        await bookmarkJob(job?.id);
        showSuccessToast("Bookmarked!");
      }
      setIsBookmarked(!isBookmarked);
    } catch {
      showErrorToast("Failed to update bookmark");
    }
  };

  const handleViewCompany = () => {
    navigate(`/employers/${job?.employer?.id}/${job?.employer?.companyName}/profile`);
  };

  const handleApply = () => {
    setJobToApply(job);
    openModal("application");
  };

  const handleRefer = () => {
    openModal("refer-modal");
  };

  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative overflow-x-auto sm:overflow-x-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-purple-200 hover:shadow-md"
      >
        <div className="flex">
          {/* Left: Company Logo */}
          <div className="flex w-32 flex-shrink-0 items-start justify-center border-r border-gray-100 bg-gray-50 p-6">
            <button onClick={handleViewCompany} className="transition-transform hover:scale-105">
              <img
                  src={job?.employer?.companyLogo || AVATAR_API_URL.concat(job.company)}
                  alt={job.company}
                  className="h-20 w-20 rounded-lg border border-gray-200 object-cover shadow-sm"
              />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 flex-col p-6">
            {/* Header with Rating and Actions */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Rating - Far Left */}
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Rating rate={handleRating} value={rating} readOnly={isRatingLoading} />
                  {rating > 0 && (
                      <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
                  )}
                </div>
              </div>

              {/* Quick Actions - Far Right */}
              <div className="flex items-center gap-2">
                {isUrgent && (
                    <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
                  <Clock className="h-3 w-3" />
                      {daysLeft}d left
                </span>
                )}
                <button
                    onClick={handleBookmark}
                    className="rounded-lg border border-gray-200 p-2 transition-all hover:border-purple-300 hover:bg-purple-50"
                    title={isBookmarked ? "Remove bookmark" : "Bookmark job"}
                >
                  {isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4 text-purple-600" />
                  ) : (
                      <Bookmark className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                <button
                    onClick={() => openModal("share")}
                    className="rounded-lg border border-gray-200 p-2 transition-all hover:border-purple-300 hover:bg-purple-50"
                    title="Share job"
                >
                  <Share2 className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Title and Company */}
            <div className="mb-3">
              <h3 className="mb-1 text-xl font-bold text-gray-900 line-clamp-1">
                {job.title}
              </h3>

              <div className="flex items-center gap-3">
                <button
                    onClick={handleViewCompany}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-purple-600"
                >
                  <Building2 className="h-4 w-4" />
                  {job.company}
                </button>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Posted {postedDaysAgo} days ago</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-2">
              {DOMPurify.sanitize(job.description?.trim() || "", { ALLOWED_TAGS: [] })}
            </p>

            {/* Skills */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {visibleSkills?.map((skill, idx) => (
                  <span
                      key={idx}
                      className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"
                  >
                {skill}
              </span>
              ))}
              {hasMoreSkills && (
                  <button
                      onClick={() => setShowAllSkills(!showAllSkills)}
                      className="flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    {showAllSkills ? (
                        <>Show less <ChevronUp className="h-3 w-3" /></>
                    ) : (
                        <>+{job.skillSet.length - 4} <ChevronDown className="h-3 w-3" /></>
                    )}
                  </button>
              )}
            </div>

            {/* Job Details */}
            <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-1.5 text-gray-700">
                <MapPin className="h-4 w-4 text-green-600" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <span>{job.jobType}</span>
              </div>
              {job.salaryRange?.maximumAmount > 0 && (
                  <div className="flex items-center gap-1.5 font-medium text-green-700">
                    <DollarSign className="h-4 w-4" />
                    <span>
                  {job.salaryRange.currency}{job.salaryRange.minimumAmount?.toLocaleString()} - {job.salaryRange.maximumAmount?.toLocaleString()}
                </span>
                  </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 border-t border-gray-100 pt-4">
              <button
                  onClick={handleRefer}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
              >
                Refer
              </button>
              <button
                  onClick={handleViewCompany}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700"
              >
                <Info className="h-4 w-4" />
                Company
              </button>
              <button
                  onClick={handleApply}
                  disabled={job?.applied}
                  className={`flex-1 rounded-lg px-4 py-1.5 text-sm font-semibold transition-all ${
                      job?.applied
                          ? "bg-green-500 text-white cursor-default"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
              >
                {job?.applied ? (
                    <span className="flex items-center justify-center gap-1.5">
                  <Check className="h-4 w-4" /> Applied
                </span>
                ) : (
                    "Apply Now"
                )}
              </button>
              <button
                  onClick={() => onViewDetails(job.id)}
                  className="flex items-center gap-1.5 rounded-lg border-2 border-purple-600 bg-white px-4 py-1.5 text-sm font-semibold text-purple-600 transition-all hover:bg-purple-50"
              >
                <ExternalLink className="h-4 w-4" />
                Details
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        {isModalOpen("share") && <ShareModal url={url} modalId="share" />}
        {isModalOpen("application") && <ApplicationModal applicationMethod={job?.applicationMethod as any} modalId="application" />}
        {isModalOpen("application-success") && <ApplicationSuccessModal modalId="application-success" />}
        {isModalOpen("payment-success-modal") && <PaymentSuccessModal modalId="payment-success-modal" />}
        {isModalOpen("refer-modal") && <ReferModal handleRefer={handleRefer} modalId="refer-modal" />}
      </motion.div>
  );
});

JobCard.displayName = "JobCard";

export default memo(JobSearch);