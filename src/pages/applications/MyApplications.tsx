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
import { Cancel, Search } from "../../assets/icons";
import { Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { ApplicationResponse, SortBy } from "../../utils/types";
import { getMyApplications } from "../../services/api";
import useModalStore from "../../store/modalStateStores.ts";
import ViewApplicationMethodModal from "../../components/ui/ViewApplicationMethodModal.tsx";
import { showErrorToast } from "../../utils/toastConfig.tsx";

const MyApplications: React.FC = () => {
  const [applicationToView, setApplicationToView] =
    useState<ApplicationResponse | null>(null);
  const { isModalOpen, openModal } = useModalStore();
  const [allApplications, setAllApplications] = useState<ApplicationResponse[]>(
    [],
  );
  const [sort, setSort] = useState<SortBy>({
    sortDirection: "desc",
    orderBy: "createdAt",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(
    null,
  );
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState({
    jobTitle: "",
    companyName: "",
  });
  useEffect(() => {
    const doFetchApplications = async () => {
      return await getMyApplications(
        applicationStatus,
        sort,
        currentPage,
        pageSize,
      );
    };
    doFetchApplications()
      .then((response) => {
        setAllApplications(response.data);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
        showErrorToast(error?.response?.data?.message);
      });
  }, [currentPage, pageSize, applicationStatus, sort]);

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const handleSearchApplications = async () => {
    await getMyApplications(
      applicationStatus,
      sort,
      currentPage,
      pageSize,
      searchQuery.jobTitle,
      searchQuery.companyName,
    )
      .then((res) => {
        setAllApplications(res?.data);
      })
      .catch((err) => {
        console.error(err);
        showErrorToast(err?.response?.data?.message);
      });
  };

  return (
    <div className="min:h-screen flex w-full flex-col items-center bg-[#F7F8FA]">
      <div className="w-full">
        <TopNavBar
          navItems={applicantNavItems}
          navItemsMobile={applicantNavItemsMobile}
          navbarItemsMap={applicantNavBarItemMap}
        />
      </div>
      <div className="flex w-[96%] flex-col items-center justify-center gap-6 lg:items-start xl:flex-row">
        <div className="flex w-full flex-col xl:w-[70%]">
          {/*Search Bar*/}
          <div className="my-4 w-full rounded-2xl bg-white p-2 md:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search fields container */}
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-0">
                {/* Job Title Field */}
                <div className="flex flex-1 items-center rounded-lg bg-gray-50 py-2 pr-2 pl-3 sm:rounded-r-none">
                  <img
                    src={Search}
                    alt="search"
                    className="h-5 w-5 shrink-0 text-gray-400"
                  />
                  <div className="flex w-full items-center justify-between">
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={searchQuery?.jobTitle}
                      onChange={(e) =>
                        setSearchQuery({
                          ...searchQuery,
                          jobTitle: e.target.value,
                        })
                      }
                      className="ml-2 w-full border-none bg-transparent text-sm font-bold text-black placeholder-black outline-none focus:ring-0 md:text-base"
                    />
                    <div
                      onClick={() =>
                        setSearchQuery({ ...searchQuery, jobTitle: "" })
                      }
                      className="hidden h-7 w-7 items-center justify-center rounded-full bg-gray-100 sm:flex"
                    >
                      <img src={Cancel} alt="clear" className="h-3 w-3" />
                    </div>
                  </div>
                </div>

                {/* Divider - Hidden on mobile */}
                <div className="hidden h-px bg-gray-300 sm:block sm:h-auto sm:w-px"></div>

                {/* Company Name Field */}
                <div className="flex flex-1 items-center rounded-lg bg-gray-50 py-2 pr-2 pl-3 sm:rounded-l-none sm:pl-4">
                  <img
                    src={Search}
                    alt="search"
                    className="h-5 w-5 shrink-0 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={searchQuery?.companyName}
                    onChange={(e) =>
                      setSearchQuery({
                        ...searchQuery,
                        companyName: e.target.value,
                      })
                    }
                    className="w-full border-none bg-transparent text-sm font-bold text-black placeholder-black outline-none focus:ring-0 md:text-base"
                  />
                  <div
                    onClick={() =>
                      setSearchQuery({ ...searchQuery, companyName: "" })
                    }
                    className="hidden h-7 w-7 items-center justify-center rounded-full bg-gray-100 sm:flex"
                  >
                    <img src={Cancel} alt="clear" className="h-3 w-3" />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearchApplications}
                className="h-12 rounded-xl bg-[#6B5AED] px-4 font-medium text-white transition-colors hover:bg-[#5849d2] sm:h-11 sm:w-32 md:w-40"
              >
                <span className="hidden sm:inline">Find Job</span>
                <span className="sm:hidden">Search</span>
              </button>
            </div>
          </div>

          {/*Main*/}
          <div className="my-2 flex w-full flex-col justify-between gap-4 overflow-hidden rounded-[16px] bg-white p-4">
            <div className="mb-4">
              <ApplicationSearch
                setApplicationStatus={setApplicationStatus}
                setSort={setSort}
                sort={sort}
              />
            </div>
            <div className="flex w-full flex-col gap-4">
              {allApplications.map((application, index) => (
                <ApplicationCard
                  key={index}
                  application={application}
                  onView={() => {
                    setApplicationToView(application);
                    openModal("application-method");
                  }}
                />
              ))}
            </div>
            <div className="mt-6 mb-4 flex w-full justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={allApplications.length}
                showSizeChanger
                onChange={handlePageChange}
                pageSizeOptions={["5", "10", "20", "50"]}
                showQuickJumper
              />
            </div>
          </div>
        </div>

        <div className="my-4 flex w-full flex-col justify-center gap-5 md:flex-row xl:w-[30%] xl:flex-col">
          <div className="flex w-full items-center md:w-[50%] xl:w-full">
            <div className="flex w-full">
              <ApplicantSchedules />
            </div>
          </div>
          <div className="scrollbar-hide my-3 w-full overflow-y-auto md:w-[50%] xl:w-full">
            <div className="flex w-full">
              <ShortlistedJobs />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen("application-method") && applicationToView && (
        <ViewApplicationMethodModal
          modalId="application-method"
          application={applicationToView}
        />
      )}
    </div>
  );
};

export default MyApplications;
