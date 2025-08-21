import React, { useEffect, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopNavBar from "../../components/layouts/TopNavBar";
import ApplicantSchedules from "../../components/ui/ApplicantSchedules";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
} from "../../utils/constants";
import ShortlistedJobs from "../job/ShortlistedJobs";
import ApplicationCard from "./ApplicationCard";
import ApplicationSearch from "./ApplicationSearch";
import { Search, X, AlertCircle, FileText } from "lucide-react";
import { Pagination } from "antd";
import { ApplicationResponse, SortBy } from "../../utils/types";
import { getMyApplications } from "../../services/api";
import useModalStore from "../../store/modalStateStores.ts";
import ViewApplicationMethodModal from "../../components/ui/ViewApplicationMethodModal.tsx";
import { showErrorToast } from "../../utils/toastConfig.tsx";

const MyApplications: React.FC = memo(() => {
  const [applicationToView, setApplicationToView] = useState<ApplicationResponse | null>(null);
  const { isModalOpen, openModal } = useModalStore();
  const [allApplications, setAllApplications] = useState<ApplicationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const [sort, setSort] = useState<SortBy>({
    sortDirection: "desc",
    orderBy: "createdAt",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState({
    jobTitle: "",
    companyName: "",
  });

  // Fetch applications with loading and error handling
  const fetchApplications = useCallback(async (
    page = currentPage,
    size = pageSize,
    jobTitle = "",
    companyName = ""
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMyApplications(
        applicationStatus,
        sort,
        page,
        size,
        jobTitle || undefined,
        companyName || undefined
      );
      setAllApplications(response.data || []);
      setTotalCount(response.total || response.data?.length || 0);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to load applications";
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [applicationStatus, sort, currentPage, pageSize]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handlePageChange = useCallback((page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when changing page size
    }
  }, [pageSize]);

  const handleSearchApplications = useCallback(async () => {
    setCurrentPage(1); // Reset to first page for new search
    await fetchApplications(1, pageSize, searchQuery.jobTitle, searchQuery.companyName);
  }, [searchQuery, pageSize, fetchApplications]);

  const clearSearch = useCallback(() => {
    setSearchQuery({ jobTitle: "", companyName: "" });
    setCurrentPage(1);
    fetchApplications(1, pageSize);
  }, [pageSize, fetchApplications]);

  const handleViewApplication = useCallback((application: ApplicationResponse) => {
    setApplicationToView(application);
    openModal("application-method");
  }, [openModal]);

  // Loading skeleton component
  const ApplicationSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="animate-pulse rounded-xl bg-slate-100 p-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-lg bg-slate-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
            </div>
            <div className="h-6 w-16 bg-slate-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <TopNavBar
        navItems={applicantNavItems}
        navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 xl:flex-row">
          {/* Main Content */}
          <div className="flex-1 xl:w-[70%]">
            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  {/* Search Fields */}
                  <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                    {/* Job Title Field */}
                    <div className="relative flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Job Title
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search by job title..."
                          value={searchQuery.jobTitle}
                          onChange={(e) => setSearchQuery({ ...searchQuery, jobTitle: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-10 text-sm placeholder-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        {searchQuery.jobTitle && (
                          <button
                            onClick={() => setSearchQuery({ ...searchQuery, jobTitle: "" })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Company Name Field */}
                    <div className="relative flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Company Name
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search by company..."
                          value={searchQuery.companyName}
                          onChange={(e) => setSearchQuery({ ...searchQuery, companyName: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-10 text-sm placeholder-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        {searchQuery.companyName && (
                          <button
                            onClick={() => setSearchQuery({ ...searchQuery, companyName: "" })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 sm:gap-2">
                    <button
                      onClick={handleSearchApplications}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none sm:w-32 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-6 text-sm font-medium text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {isLoading ? "..." : "Search"}
                    </button>

                    {(searchQuery.jobTitle || searchQuery.companyName) && (
                      <button
                        onClick={clearSearch}
                        className="rounded-lg border border-slate-300 bg-white py-3 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Applications Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200"
            >
              <div className="p-4 sm:p-6">
                {/* Filter and Sort */}
                <ApplicationSearch
                  setApplicationStatus={setApplicationStatus}
                  setSort={setSort}
                  sort={sort}
                />

                {/* Content */}
                <div className="mt-6">
                  {isLoading ? (
                    <ApplicationSkeleton />
                  ) : error ? (
                    <div className="text-center py-12">
                      <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Applications</h3>
                      <p className="text-slate-600 mb-4">{error}</p>
                      <button
                        onClick={() => fetchApplications()}
                        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : allApplications.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-600 mb-2">No Applications Found</h3>
                      <p className="text-slate-500">
                        {searchQuery.jobTitle || searchQuery.companyName
                          ? "Try adjusting your search criteria"
                          : "You haven't applied to any jobs yet"}
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      <div className="space-y-4">
                        {allApplications.map((application, index) => (
                          <motion.div
                            key={application.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <ApplicationCard
                              application={application}
                              onView={() => handleViewApplication(application)}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </AnimatePresence>
                  )}
                </div>

                {/* Pagination */}
                {!isLoading && !error && allApplications.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={totalCount}
                      showSizeChanger
                      onChange={handlePageChange}
                      pageSizeOptions={["10", "20", "50", "100"]}
                      showQuickJumper
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} applications`
                      }
                      className="[&_.ant-pagination-item-active]:bg-indigo-600 [&_.ant-pagination-item-active]:border-indigo-600"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:w-[30%] space-y-6"
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
              <ApplicantSchedules />
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
              <ShortlistedJobs />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen("application-method") && applicationToView && (
        <ViewApplicationMethodModal
          modalId="application-method"
          application={applicationToView}
        />
      )}
    </div>
  );
});

MyApplications.displayName = 'MyApplications';

export default MyApplications;