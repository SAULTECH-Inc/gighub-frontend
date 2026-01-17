import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { toast } from "react-toastify";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiLoader,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiDownload,
  FiBookmark,
  FiRefreshCw,
  FiX,
  FiHeart,
} from "react-icons/fi";

import Company from "../../components/company list/Company";
import CompanyNavbar from "../../components/company list/CompanyNavbar";
import TopNavBar from "../../components/layouts/TopNavBar";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
} from "../../utils/constants";
import { APIResponse, EmployerData } from "../../utils/types";
import {
  fetchCompanies,
  followCompany,
  unfollowCompany,
} from "../../services/api";

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy: {
    companyName?: string;
    industry?: string;
    location?: string;
    employeeCount?: string;
    foundedYear?: string;
    rating?: string;
    openPositions?: string;
  };
  sortDirection: "ASC" | "DESC";
  filters: {
    industry?: string[];
    location?: string[];
    companySize?: string[];
    hasOpenings?: boolean;
    isRemoteFriendly?: boolean;
    companyType?: string[];
    minRating?: number;
    foundedAfter?: number;
    minEmployees?: number;
    maxEmployees?: number;
  };
  searchQuery?: string;
}

interface ApiResponse {
  data: EmployerData[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  aggregations?: {
    industries: Array<{ name: string; count: number }>;
    locations: Array<{ name: string; count: number }>;
    companySizes: Array<{ size: string; count: number }>;
  };
}

type ViewMode = "grid" | "list";

// Custom hook for stable pagination params
const usePaginationParams = () => {
  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    limit: 20,
    sortBy: {
      companyName: "",
      industry: "",
      location: "",
      employeeCount: "",
      foundedYear: "",
      rating: "",
      openPositions: "",
    },
    sortDirection: "DESC",
    filters: {
      industry: [],
      location: [],
      companySize: [],
      hasOpenings: false,
      isRemoteFriendly: false,
      companyType: [],
      minRating: 0,
      foundedAfter: 0,
      minEmployees: 0,
      maxEmployees: 0,
    },
    searchQuery: "",
  });

  const stableParams = useMemo(() => {
    return {
      page: params.page,
      limit: params.limit,
      sortDirection: params.sortDirection,
      searchQuery: params.searchQuery || "",
      sortBy: JSON.stringify(params.sortBy),
      filters: JSON.stringify(params.filters),
    };
  }, [params]);

  return { params, setParams, stableParams };
};

const CompanyList = () => {
  const {
    params: pagination,
    setParams: setPagination,
    stableParams,
  } = usePaginationParams();
  const [companies, setCompanies] = useState<EmployerData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [viewedCompanies, setViewedCompanies] = useState<Set<number>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [aggregations] = useState<ApiResponse["aggregations"]>();
  const [processingFollow, setProcessingFollow] = useState<Set<number>>(
    new Set(),
  );

  const isInitialMount = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination((prev) => ({
        ...prev,
        searchQuery: searchQuery,
        page: 1,
      }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, setPagination]);

  // Stable fetch function
  const fetchCompaniesData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const response: APIResponse<EmployerData[]> =
        await fetchCompanies(pagination);

      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setCompanies(response.data || []);
      setTotalCompanies(response?.meta?.total || 0);
      setTotalPages(response?.meta?.totalPages || 0);
      setHasNextPage((response?.meta?.totalPages || 0) > pagination.page);
      setHasPrevPage(pagination.page > 1);

      if (response.data?.length > 0) {
        setViewedCompanies((prev) => {
          const newViewed = new Set(prev);
          response.data.forEach((company) => {
            if (company.id) newViewed.add(company.id);
          });
          return newViewed;
        });
      }
    } catch (err: any) {
      if (
        err.name === "AbortError" ||
        abortControllerRef.current?.signal.aborted
      ) {
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch companies";
      setError(errorMessage);
      console.error("Error fetching companies:", err);
      toast.error(errorMessage);
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [
    stableParams.page,
    stableParams.limit,
    stableParams.sortDirection,
    stableParams.searchQuery,
    stableParams.sortBy,
    stableParams.filters,
  ]);

  // Main effect for fetching data
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    fetchCompaniesData().then((r) => r);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCompaniesData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Navigation functions
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (
        newPage >= 1 &&
        newPage <= totalPages &&
        newPage !== pagination.page
      ) {
        setPagination((prev) => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [pagination.page, totalPages, setPagination],
  );

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      handlePageChange(pagination.page + 1);
    }
  }, [hasNextPage, pagination.page, handlePageChange]);

  const goToPrevPage = useCallback(() => {
    if (hasPrevPage) {
      handlePageChange(pagination.page - 1);
    }
  }, [hasPrevPage, pagination.page, handlePageChange]);

  const goToFirstPage = useCallback(() => {
    handlePageChange(1);
  }, [handlePageChange]);

  const goToLastPage = useCallback(() => {
    handlePageChange(totalPages);
  }, [totalPages, handlePageChange]);

  // Filter functions
  const handleLimitChange = useCallback(
    (newLimit: number) => {
      setPagination((prev) => ({
        ...prev,
        limit: newLimit,
        page: 1,
      }));
    },
    [setPagination],
  );

  const clearAllFilters = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
      filters: {
        industry: [],
        location: [],
        companySize: [],
        hasOpenings: false,
        isRemoteFriendly: false,
        companyType: [],
        minRating: 0,
        foundedAfter: 0,
        minEmployees: 0,
        maxEmployees: 0,
      },
      sortBy: {
        companyName: "",
        industry: "",
        location: "",
        employeeCount: "",
        foundedYear: "",
        rating: "",
        openPositions: "",
      },
    }));
    setSearchQuery("");
  }, [setPagination]);

  // SIMPLIFIED: Toggle follow company - updates local state optimistically
  const toggleFollowCompany = useCallback(
    async (companyId: number) => {
      if (processingFollow.has(companyId)) {
        return;
      }

      setProcessingFollow((prev) => new Set(prev).add(companyId));

      const company = companies.find((c) => c.id === companyId);
      if (!company) {
        setProcessingFollow((prev) => {
          const newState = new Set(prev);
          newState.delete(companyId);
          return newState;
        });
        return;
      }

      const wasFollowing = company.isFollowed;

      // Optimistic update
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyId ? { ...c, isFollowed: !wasFollowing } : c,
        ),
      );

      try {
        let response;
        if (wasFollowing) {
          response = await unfollowCompany(companyId);
        } else {
          response = await followCompany(companyId);
        }

        if (response.statusCode === 200) {
          toast.success(
            wasFollowing
              ? "Company unfollowed successfully"
              : "Company followed successfully",
          );
        } else {
          // Revert optimistic update on failure
          setCompanies((prev) =>
            prev.map((c) =>
              c.id === companyId ? { ...c, isFollowed: wasFollowing } : c,
            ),
          );
          toast.error(
            response.message ||
              `Failed to ${wasFollowing ? "unfollow" : "follow"} company`,
          );
        }
      } catch (error: any) {
        // Revert optimistic update on error
        setCompanies((prev) =>
          prev.map((c) =>
            c.id === companyId ? { ...c, isFollowed: wasFollowing } : c,
          ),
        );
        console.error("Error toggling follow status:", error);
        toast.error(error.message || "An error occurred. Please try again.");
      } finally {
        setProcessingFollow((prev) => {
          const newState = new Set(prev);
          newState.delete(companyId);
          return newState;
        });
      }
    },
    [companies, processingFollow],
  );

  // Export function
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const exportData = companies.map((company) => ({
        name: company.companyName,
        industry: company.industry,
        location: company.companyAddress,
        employees: company.companySize,
        openPositions: company.openPositions,
        rating: company.rating,
        isFollowed: company.isFollowed,
      }));

      const csv = [
        Object.keys(exportData[0] || {}).join(","),
        ...exportData.map((row) => Object.values(row).join(",")),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `companies-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Companies exported successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to export companies");
    } finally {
      setIsExporting(false);
    }
  }, [companies]);

  // Memoized calculations
  const followedCompaniesCount = useMemo(() => {
    return companies.filter((company) => company.isFollowed).length;
  }, [companies]);

  const getVisiblePageNumbers = useMemo(() => {
    const current = pagination.page;
    const total = totalPages;
    const delta = 2;

    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);

    if (current <= delta) {
      end = Math.min(total, 2 * delta + 1);
    }
    if (current >= total - delta) {
      start = Math.max(1, total - 2 * delta);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [pagination.page, totalPages]);

  const getCurrentDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const getStartIndex = useMemo(() => {
    return (pagination.page - 1) * pagination.limit + 1;
  }, [pagination.page, pagination.limit]);

  const getEndIndex = useMemo(() => {
    return Math.min(pagination.page * pagination.limit, totalCompanies);
  }, [pagination.page, pagination.limit, totalCompanies]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (pagination.filters.industry?.length)
      count += pagination.filters.industry.length;
    if (pagination.filters.location?.length)
      count += pagination.filters.location.length;
    if (pagination.filters.companySize?.length)
      count += pagination.filters.companySize.length;
    if (pagination.filters.hasOpenings) count++;
    if (pagination.filters.isRemoteFriendly) count++;
    if (pagination.filters.minRating && pagination.filters.minRating > 0)
      count++;
    if (searchQuery) count++;
    return count;
  }, [pagination.filters, searchQuery]);

  const PaginationButton = ({
    onClick,
    disabled,
    children,
    isActive = false,
    className = "",
    title,
  }: {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    isActive?: boolean;
    className?: string;
    title?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center justify-center border border-gray-300 px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive ? "border-purple-600 bg-purple-600 text-white shadow-sm" : "bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"} ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-400 opacity-50" : "cursor-pointer"} ${className} `}
    >
      {children}
    </button>
  );

  const LoadingSkeleton = () => (
    <div
      className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
    >
      {[...Array(pagination.limit)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="h-24 bg-gray-200"></div>
            <div className="space-y-3 p-5">
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-3 w-1/2 rounded bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-3 rounded bg-gray-200"></div>
                <div className="h-3 w-5/6 rounded bg-gray-200"></div>
              </div>
              <div className="flex space-x-2 pt-2">
                <div className="h-8 flex-1 rounded bg-gray-200"></div>
                <div className="h-8 w-8 rounded bg-gray-200"></div>
                <div className="h-8 w-8 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar
                navbarItemsMap={applicantNavBarItemMap}
                userType="applicant"
      />

      <div className="bg-[#F7F8FA] p-4">
        {/* Enhanced Search Bar */}
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies by name, industry, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-12 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center space-x-2 rounded-lg border px-4 py-3 transition-all ${showFilters || activeFiltersCount > 0 ? "border-purple-600 bg-purple-600 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
                disabled={isLoading}
              >
                <FiFilter className="h-4 w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="rounded-full bg-white/20 px-2 py-1 text-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleExport}
                disabled={isExporting || companies.length === 0}
                className="inline-flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isExporting ? (
                  <FiLoader className="h-4 w-4 animate-spin" />
                ) : (
                  <FiDownload className="h-4 w-4" />
                )}
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation and Filters */}
        <CompanyNavbar
          pagination={pagination}
          onChange={setPagination}
          totalResults={totalCompanies}
          isLoading={isLoading}
          showFilters={showFilters}
          aggregations={aggregations}
        />

        <div className="mt-5 flex items-start gap-x-6 max-lg:flex-col-reverse">
          <div className="flex w-full flex-col justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
            {/* Header Section */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between lg:hidden">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Find Companies Easily
                  </h2>
                  <span className="text-sm font-medium text-gray-600">
                    {getCurrentDate}
                  </span>
                </div>
              </div>

              {/* Enhanced Toolbar */}
              <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <span className="text-sm text-gray-600">
                    {isLoading ? (
                      <span className="flex items-center">
                        <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                        Loading companies...
                      </span>
                    ) : (
                      <>
                        Showing{" "}
                        <span className="font-semibold">
                          {getStartIndex}-{getEndIndex}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold">
                          {totalCompanies.toLocaleString()}
                        </span>{" "}
                        companies
                      </>
                    )}
                  </span>

                  {followedCompaniesCount > 0 && (
                    <span className="inline-flex items-center space-x-1 text-sm text-purple-600">
                      <FiBookmark className="h-4 w-4" />
                      <span>{followedCompaniesCount} followed</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex rounded-lg border border-gray-300 bg-white p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`rounded p-2 transition-all ${viewMode === "grid" ? "bg-purple-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
                      title="Grid view"
                    >
                      <FiGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`rounded p-2 transition-all ${viewMode === "list" ? "bg-purple-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
                      title="List view"
                    >
                      <FiList className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Items per page */}
                  <div className="flex items-center space-x-2">
                    <label htmlFor="limit" className="text-sm text-gray-600">
                      Show:
                    </label>
                    <select
                      id="limit"
                      value={pagination.limit}
                      onChange={(e) =>
                        handleLimitChange(Number(e.target.value))
                      }
                      className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      disabled={isLoading}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={fetchCompaniesData}
                    disabled={isLoading}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
                    title="Refresh data"
                  >
                    <FiRefreshCw
                      className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {searchQuery && (
                    <span className="inline-flex items-center space-x-1 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">
                      <span>Search: "{searchQuery}"</span>
                      <button onClick={() => setSearchQuery("")}>
                        <FiX className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading && <LoadingSkeleton />}

            {/* Error State */}
            {error && !isLoading && (
              <div className="py-12 text-center">
                <FiAlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Failed to load companies
                </h3>
                <p className="mb-4 text-gray-600">{error}</p>
                <button
                  onClick={fetchCompaniesData}
                  className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                >
                  <FiRefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && companies.length === 0 && (
              <div className="py-12 text-center">
                <FiSearch className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No companies found
                </h3>
                <p className="mb-4 text-gray-600">
                  Try adjusting your search criteria or filters to find more
                  companies.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Companies Grid/List */}
            {!isLoading && !error && companies.length > 0 && (
              <>
                <div
                  className={`mb-8 grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
                >
                  {companies.map((company, index) => (
                    <Company
                      key={company.id || `company-${pagination.page}-${index}`}
                      company={company}
                      viewMode={viewMode}
                      isViewed={viewedCompanies.has(company.id || 0)}
                      isFollowing={company.isFollowed}
                      onFollow={() => toggleFollowCompany(company.id || 0)}
                      showActions={true}
                      showStats={true}
                    />
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
                      {/* Page Info & Navigation Summary */}
                      <div className="flex flex-col items-center gap-4 sm:flex-row">
                        <div className="text-sm text-gray-600">
                          Page{" "}
                          <span className="font-medium">{pagination.page}</span>{" "}
                          of <span className="font-medium">{totalPages}</span>
                        </div>

                        {/* Quick Navigation */}
                        <div className="flex items-center space-x-2">
                          <PaginationButton
                            onClick={goToPrevPage}
                            disabled={!hasPrevPage}
                            title="Previous page"
                            className="px-4"
                          >
                            <FiChevronLeft className="mr-1 h-4 w-4" />
                            Previous
                          </PaginationButton>

                          <PaginationButton
                            onClick={goToNextPage}
                            disabled={!hasNextPage}
                            title="Next page"
                            className="px-4"
                          >
                            Next
                            <FiChevronRight className="ml-1 h-4 w-4" />
                          </PaginationButton>
                        </div>
                      </div>

                      {/* Detailed Pagination Controls */}
                      <div className="flex items-center space-x-1">
                        <PaginationButton
                          onClick={goToFirstPage}
                          disabled={!hasPrevPage}
                          className="rounded-l-md"
                          title="First page"
                        >
                          <FiChevronsLeft className="h-4 w-4" />
                        </PaginationButton>

                        <PaginationButton
                          onClick={goToPrevPage}
                          disabled={!hasPrevPage}
                          title="Previous page"
                        >
                          <FiChevronLeft className="h-4 w-4" />
                        </PaginationButton>

                        {getVisiblePageNumbers.map((pageNum) => (
                          <PaginationButton
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            isActive={pageNum === pagination.page}
                            title={`Go to page ${pageNum}`}
                          >
                            {pageNum}
                          </PaginationButton>
                        ))}

                        {pagination.page < totalPages - 2 && totalPages > 5 && (
                          <span className="px-3 py-2 text-gray-500">...</span>
                        )}

                        {pagination.page < totalPages - 2 && totalPages > 5 && (
                          <PaginationButton
                            onClick={() => handlePageChange(totalPages)}
                            title={`Go to page ${totalPages}`}
                          >
                            {totalPages}
                          </PaginationButton>
                        )}

                        <PaginationButton
                          onClick={goToNextPage}
                          disabled={!hasNextPage}
                          title="Next page"
                        >
                          <FiChevronRight className="h-4 w-4" />
                        </PaginationButton>

                        <PaginationButton
                          onClick={goToLastPage}
                          disabled={!hasNextPage}
                          className="rounded-r-md"
                          title="Last page"
                        >
                          <FiChevronsRight className="h-4 w-4" />
                        </PaginationButton>
                      </div>

                      {/* Jump to Page */}
                      <div className="flex items-center space-x-2">
                        <label
                          htmlFor="goto-page"
                          className="text-sm text-gray-600"
                        >
                          Go to:
                        </label>
                        <input
                          id="goto-page"
                          type="number"
                          min={1}
                          max={totalPages}
                          placeholder="Page"
                          className="w-20 rounded-md border border-gray-300 px-3 py-2 text-center text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              const target = e.target as HTMLInputElement;
                              const pageNum = parseInt(target.value);
                              if (pageNum >= 1 && pageNum <= totalPages) {
                                handlePageChange(pageNum);
                                target.value = "";
                              } else {
                                toast.error(
                                  `Please enter a page number between 1 and ${totalPages}`,
                                );
                              }
                            }
                          }}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Pagination Statistics */}
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <div className="flex flex-col gap-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4">
                          <span>
                            {viewedCompanies.size} companies viewed this session
                          </span>
                          {followedCompaniesCount > 0 && (
                            <span className="flex items-center space-x-1">
                              <FiHeart className="h-4 w-4 text-red-400" />
                              <span>
                                {followedCompaniesCount} companies following
                              </span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-4">
                          <span>
                            Last updated: {new Date().toLocaleTimeString()}
                          </span>
                          <button
                            onClick={fetchCompaniesData}
                            className="font-medium text-purple-600 hover:text-purple-700"
                          >
                            Refresh
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Floating Action Buttons (Mobile) */}
        <div className="fixed right-6 bottom-6 flex flex-col space-y-3 lg:hidden">
          {followedCompaniesCount > 0 && (
            <button
              onClick={() => {
                /* Navigate to saved companies */
              }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-all hover:bg-red-700"
              title="View followed companies"
            >
              <FiHeart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-red-600">
                {followedCompaniesCount}
              </span>
            </button>
          )}

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all ${showFilters || activeFiltersCount > 0 ? "bg-purple-600 text-white" : "border border-gray-300 bg-white text-gray-700"}`}
            title="Toggle filters"
          >
            <FiFilter className="h-6 w-6" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
