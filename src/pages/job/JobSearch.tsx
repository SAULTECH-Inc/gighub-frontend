import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
  AVATAR_API_URL,
} from "../../utils/constants.ts";
import { JobDetails } from "../../components/features/JobDetails.tsx";
import JobSearchSidebar from "../../components/ui/JobSearchSidebar.tsx";
import ApplicantSchedules from "../../components/ui/ApplicantSchedules.tsx";
import TopHiringCompanies from "./TopHiringCompanies.tsx";
import JobSearchSidebarMobile from "../../components/ui/JobSearchSidebarMobile.tsx";
import JobSearchTopBar from "../../components/ui/JobSearchTopBar.tsx";
import { AnimatePresence, motion } from "framer-motion";
import { useJobSearchSettings } from "../../store/useJobSearchSettings.ts";
import { JobPostResponse, TopHiringCompanyDto } from "../../utils/types";
import { useFetchJobs } from "../../hooks/useJobQuery.ts";
import {  getTopHiringCompanies } from "../../services/api";
import { calculateDaysLeft } from "../../utils/helpers.ts";
import MainFooter from "../../components/layouts/MainFooter.tsx";
import { useBulkJobSearch } from "../../hooks/useBulkJobSearch.ts";
import { JobAndCompanyDetails } from "../../components/ui/job/JobAndCompanyDetails.tsx";

const JobSearch: React.FC = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
  });
  const [jobId, setJobId] = useState<number | null>(null);
  const [viewingJob, setViewingJob] = useState<boolean>(false);
  const [jobs, setJobs] = useState<JobPostResponse[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [topHiringCompanies, setTopHiringCompanies] = useState<TopHiringCompanyDto[]>([]);
  const [showSideBarMenu, setShowSideBarMenu] = useState(false);

  const { settings } = useJobSearchSettings();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // ✅ Default fetch (no filters)
  const { data: defaultJobsData, isLoading: defaultLoading } = useFetchJobs(
    pagination.page,
    pagination.limit
  );

  // ✅ Build bulk search params
  const searchParams = useMemo(
    () => ({
      ...settings,
      page: pagination.page,
      limit: pagination.limit,
    }),
    [settings, pagination]
  );

  // ✅ Determine if we should run bulk search
  const shouldSearch =
    settings.jobType.length > 0 ||
    settings.experienceLevel.length > 0 ||
    settings.sortBy.trim() !== "" ||
    settings.location.trim() !== "" ||
    settings.sortOrder.trim() !== "" ||
    settings.salaryRange.max > 0;

  // ✅ Bulk search (only runs if filters applied)
  const {
    data: bulkData,
    isLoading: bulkLoading,
  } = useBulkJobSearch(searchParams, shouldSearch);

  // ✅ Update job list depending on mode
  useEffect(() => {
    if (shouldSearch && bulkData) {
      setJobs(bulkData.data ?? []);
      setTotalPages(bulkData.meta?.totalPages || 1);
    } else if (!shouldSearch && defaultJobsData) {
      setJobs(defaultJobsData.data ?? []);
      setTotalPages(defaultJobsData.meta?.totalPages || 1);
    }
  }, [shouldSearch, bulkData, defaultJobsData]);

  // ✅ Top hiring companies
  useEffect(() => {
    const fetchTopHiringCompanies = async () => {
      const response = await getTopHiringCompanies();
      setTopHiringCompanies(response?.data || []);
    };
    fetchTopHiringCompanies().then(r=>r);
  }, []);

  const updateJobRating = (jobId: number, newRating: number) => {
    const updated = jobs.map((job) =>
      job.id === jobId
        ? { ...job, rating: { ...job.rating, averageScore: newRating } } as JobPostResponse
        : job
    );
    setJobs(updated);
  };


  const handleToggleSidebar = () => setShowSideBarMenu((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSideBarMenu &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setShowSideBarMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSideBarMenu]);

  return (
    <div className="relative min-h-screen">
      <TopNavBar
        navItems={applicantNavItems}
        navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap}
      />

      <AnimatePresence>
        {showSideBarMenu && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50"
          >
            <JobSearchSidebarMobile
              toggleSidebar={handleToggleSidebar}
              isOpened={showSideBarMenu}
              ref={sidebarRef}
              jobType={settings?.jobType || []}
              experience={settings?.experienceLevel || []}
              sortBy={settings?.sortBy || ""}
              location={settings?.location || ""}
              employmentType={settings?.employmentType}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <JobSearchTopBar
        setTotalPages={setTotalPages}
        setJobs={setJobs}
        toggleSidebar={handleToggleSidebar}
      />

      <div
        className={`grid w-full grid-cols-1 gap-y-6 overflow-y-auto lg:grid-cols-[30%_70%] ${
          !viewingJob && "xl:grid-cols-[20%_45%_30%]"
        } justify-evenly gap-x-4 bg-[#F7F8FA] md:p-4`}
      >
        {!viewingJob && (
          <div className={`hidden h-auto w-full overflow-y-auto md:w-full lg:flex`}>
            <JobSearchSidebar
              jobType={settings?.jobType || []}
              experience={settings?.experienceLevel || []}
              sortBy={settings?.sortBy || ""}
              location={settings?.location || ""}
              employmentType={settings?.employmentType}
            />
          </div>
        )}

        <div className="flex h-auto w-full flex-col gap-y-8 overflow-y-auto rounded-[16px] md:gap-y-4 py-4">
          {(bulkLoading || defaultLoading) && <p className="text-center py-6">Loading jobs...</p>}

          {jobs.map((job) => (
            <JobDetails
              key={job.id}
              updateJobRating={updateJobRating}
              job={job}
              setJobId={setJobId}
              viewingJob={viewingJob}
              setViewingJob={setViewingJob}
              viewingJobId={jobId}
              title={job.title}
              company={job.company}
              tags={job.skillSet}
              description={job.description}
              location={job.location}
              type={job.jobType}
              applicants={job.applicantsCount as number}
              daysLeft={calculateDaysLeft(job.endDate)}
              companyLogo={
                job?.employer?.companyLogo || AVATAR_API_URL.concat(job.company)
              }
            />
          ))}

          {/* Pagination Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              disabled={pagination.page === 1}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))
              }
              className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-medium">Page {pagination.page}</span>
            <button
              disabled={pagination.page >= totalPages}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.min(prev.page + 1, totalPages),
                }))
              }
              className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {viewingJob && jobId && <JobAndCompanyDetails jobId={jobId} />}

        {!viewingJob && (
          <div className="col-span-2 flex h-screen w-full flex-col gap-y-4 md:flex md:flex-row lg:w-full lg:overflow-y-auto xl:col-span-1 xl:flex-col">
            <ApplicantSchedules />
            <TopHiringCompanies topHiringCompanies={topHiringCompanies} />
          </div>
        )}
      </div>

      <MainFooter />
    </div>
  );
};

export default memo(JobSearch);
