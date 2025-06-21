import React, { useEffect, useState } from "react";
import { FilterIcon } from "../../assets/icons";
import JobListing from "../job/JobListing.tsx";
import JobPosting from "../job/JobPosting.tsx";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../../utils/constants.ts";
import { useFetchMyJobs, useSearchJobs } from "../../hooks/useJobQuery.ts";
import { JobPostResponse, JobStatus } from "../../utils/types";

type Section = "open" | "draft";

const JobSelection: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>("open");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const { data, isError, error } = useFetchMyJobs({
    page: pagination.page,
    limit: pagination.limit,
    jobStatus: activeSection === "draft" ? JobStatus.DRAFT : JobStatus.NEW,
  });
  const {
    data: SearchResponse,
    isError: searchErrorHappened,
    error: SearchError,
  } = useSearchJobs({
    page: pagination.page,
    limit: pagination.limit,
    search: searchKeyword,
  });
  const [jobs, setJobs] = useState<JobPostResponse[]>([]);
  useEffect(() => {
    if (searchKeyword.trim() !== "") {
      if (SearchResponse) {
        setJobs(SearchResponse.data);
        setPagination((prev) => ({
          ...prev,
          total: SearchResponse.meta?.total || 0,
          totalPages: SearchResponse.meta?.totalPages || 0,
        }));
      }
    } else if (data) {
      setJobs(data.data);
      setPagination((prev) => ({
        ...prev,
        total: data.meta?.total || 0,
        totalPages: data.meta?.totalPages || 0,
      }));
    }
  }, [searchKeyword, SearchResponse, data]);

  const handleOpenFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (isError) {
    console.error("Error fetching job data:", error);
    return <div>Error fetching job data: {error?.message}</div>;
  }
  if (searchErrorHappened) {
    console.error("Error searching jobs:", SearchError);
    return <div>Error searching jobs: {SearchError?.message}</div>;
  }

  return (
    <div className="flex flex-col gap-y-12">
      <TopNavBar
        navItems={employerNavItems}
        navItemsMobile={employerNavItemsMobile}
        navbarItemsMap={employerNavBarItemMap}
      />

      <div className="flex min-h-screen w-full justify-center bg-[#F7F8FA] py-8">
        <div className="flex w-[96%] flex-col gap-5 sm:w-[90%]">
          <div className="w-[96%]sm:w-[90%] flex justify-between gap-1 rounded-[16px] px-2 py-2 sm:gap-4 sm:px-4 sm:py-4 md:bg-white">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search Job"
              className="h-full w-3/4 rounded-[10px] border border-[#E6E6E6] bg-transparent bg-white px-4 py-3 text-sm outline-none placeholder:text-[#000000] focus:border-[#E6E6E6] focus:outline-none focus:ring-0 md:w-[381px] md:bg-[#F7F7F7]"
            />
            <div>
              {/*Filter button for mobile*/}
              <div className="relative flex justify-between gap-4 md:hidden">
                <button
                  onClick={handleOpenFilter}
                  className="flex min-w-[59px] cursor-pointer items-center justify-center rounded-[10px] border border-[#E6E6E6] bg-[#FFFFFF] px-4 py-3 md:hidden"
                >
                  <img src={FilterIcon} alt="filter icon" />
                </button>
                {isFilterOpen && (
                  <div className="absolute right-0 top-12 flex flex-col gap-y-4 rounded-lg bg-white p-4 shadow-lg">
                    <button
                      className={`rounded-[10px] px-12 py-3 ${
                        activeSection === "open"
                          ? "bg-[#6438C2] text-white"
                          : "bg-[#F7F7F7]"
                      } `}
                      onClick={() => {
                        setActiveSection("open");
                        setIsFilterOpen(false);
                      }}
                    >
                      Open
                    </button>
                    <button
                      className={`rounded-[10px] px-12 py-3 ${
                        activeSection === "draft"
                          ? "bg-[#6438C2] text-white"
                          : "bg-[#F7F7F7]"
                      } `}
                      onClick={() => {
                        setActiveSection("draft");
                        setIsFilterOpen(false);
                      }}
                    >
                      Draft
                    </button>
                  </div>
                )}
              </div>
              {/*Filter button for desktop*/}
              <div className="hidden justify-between gap-4 md:flex">
                <button
                  className={`hidden rounded-[10px] px-12 py-3 sm:flex ${
                    activeSection === "open"
                      ? "bg-[#6438C2] text-white"
                      : "bg-[#F7F7F7]"
                  } `}
                  onClick={() => {
                    setActiveSection("open");
                  }}
                >
                  Open
                </button>
                <button
                  className={`hidden rounded-[10px] px-12 py-3 sm:flex ${
                    activeSection === "draft"
                      ? "bg-[#6438C2] text-white"
                      : "bg-[#F7F7F7]"
                  } `}
                  onClick={() => {
                    setActiveSection("draft");
                  }}
                >
                  Draft
                </button>
              </div>
            </div>
          </div>
          <div className="w-[100%] self-center sm:w-[100%]">
            {activeSection === "open" && (
              <div className="flex flex-wrap justify-center gap-3 rounded-[10px] bg-white px-4 pb-[100px] pt-4">
                <div className="hidden w-full justify-between rounded-[10px] bg-[#6438C2] p-2 px-4 text-white md:flex">
                  <div className="flex w-[75%] justify-between text-white">
                    <p className="sm:text-[12px] lg:w-[150px]">Job Title</p>
                    <p className="text-[12px] lg:w-[150px]">Employment Type</p>
                    <p className="text-[12px] lg:w-[150px]">
                      Number of applicants
                    </p>
                    <p className="text-[12px] lg:w-[150px]">Application Date</p>
                  </div>
                  <p className="text-center text-[12px] text-white lg:w-[150px]">
                    Action
                  </p>
                </div>
                <div className="w-full">
                  <JobListing listings={jobs} />
                </div>
              </div>
            )}
            {activeSection === "draft" && (
              <div className="flex flex-wrap justify-center gap-3 rounded-[10px] bg-white px-4 pb-[100px] pt-4">
                <div className="hidden w-full justify-between rounded-[10px] bg-[#6438C2] p-2 px-4 text-white md:flex">
                  <div className="flex w-[75%] justify-between text-white">
                    <p className="sm:text-[12px] lg:w-[150px]">Job Title</p>
                    <p className="text-[12px] lg:w-[150px]">Employment Type</p>
                    <p className="text-[12px] lg:w-[150px]">Progress</p>
                    <p className="text-[12px] lg:w-[150px]">Saved Date</p>
                  </div>
                  <p className="text-center text-[12px] text-white lg:w-[150px]">
                    Action
                  </p>
                </div>
                <div className="w-full">
                  <JobPosting listings={jobs} />
                </div>
              </div>
            )}
            {/*      Pagination */}
            <div className="mt-6 flex w-full items-center justify-center gap-4 md:justify-end">
              <button
                onClick={() => {
                  if (pagination.page > 1) {
                    setPagination((prev) => ({
                      ...prev,
                      page: pagination.page - 1,
                    }));
                  }
                }}
                className="w-[10rem] rounded-[10px] bg-white px-4 py-2 text-black"
              >
                Previous
              </button>
              <div className="flex gap-2">
                <input
                  value={pagination.page}
                  min={1}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 1 && value <= pagination.totalPages) {
                      setPagination((prev) => ({
                        ...prev,
                        page: value,
                      }));
                    }
                  }}
                  type="number"
                  placeholder="1"
                  className="h-full w-12 rounded-[10px] border border-[#E6E6E6] bg-transparent bg-white px-4 py-3 text-sm outline-none placeholder:text-[#000000] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
                />
              </div>
              <button
                onClick={() => {
                  if (pagination.page < pagination.totalPages) {
                    setPagination((prev) => ({
                      ...prev,
                      page: pagination.page + 1,
                    }));
                  }
                }}
                className="w-[10rem] rounded-[10px] bg-[#6438C2] px-4 py-2 text-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSelection;
