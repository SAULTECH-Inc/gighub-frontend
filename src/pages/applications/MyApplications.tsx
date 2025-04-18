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
import { getApplications } from "../../utils/dummyApplications";
import { Cancel, Search } from "../../assets/icons";
import { Pagination } from "antd";
import React, { useState } from "react";

const MyApplications: React.FC = () => {
  const allApplications = getApplications();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const paginatedApplications = allApplications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="min:h-screen flex w-full flex-col items-center bg-[#F7F8FA]">
      <div className="w-full">
        <TopNavBar
          navItems={applicantNavItems}
          navItemsMobile={applicantNavItemsMobile}
          navbarItemsMap={applicantNavBarItemMap}
        />
      </div>
      <div className="flex w-[96%] flex-col items-center justify-center lg:items-start xl:flex-row">
        <div className="flex w-full flex-col xl:w-[70%]">
          <div className="my-4 flex h-[64px] w-full items-center justify-between rounded-[16px] bg-white px-1 md:px-4">
            <div className="flex w-full items-center justify-between gap-1 md:gap-2">
              <div className="flex w-[30%] items-center sm:w-full">
                <img src={Search} alt="search icon" className="fill-black" />
                <div className="flex w-full items-center justify-between">
                  <input
                    type="text"
                    placeholder="Job Title"
                    className="border-none outline-none placeholder:text-[13px] placeholder:font-bold placeholder:text-[#000000] focus:ring-0 md:placeholder:text-[16px]"
                  />
                  <div className="md::w-[30px] hidden h-[30px] items-center justify-center rounded-full bg-[#F7F7F7] sm:flex">
                    <img src={Cancel} alt="cancel" />
                  </div>
                </div>
                <div className="mx-4 hidden h-[29px] border-l border-[#7F7F7F] md:block"></div>
                <div className="flex w-full items-center justify-between">
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="border-none outline-none placeholder:text-[13px] placeholder:font-bold placeholder:text-[#000000] focus:ring-0 md:placeholder:text-[16px]"
                  />
                  <div className="hidden h-[30px] items-center justify-center rounded-full bg-[#F7F7F7] sm:flex md:w-[30px]">
                    <img src={Cancel} alt="cancel" />
                  </div>
                </div>
              </div>
              <div className="hidden items-center justify-end sm:flex">
                <button className="h-[42px] rounded-[10px] bg-[#6B5AED] text-white sm:w-[90px] md:w-[175px]">
                  Find Job
                </button>
              </div>
              <div className="flex items-center justify-end sm:hidden">
                <button className="h-[24px] w-full rounded-[10px] bg-[#6B5AED] px-2 text-white">
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="my-2 flex w-full flex-col justify-between overflow-hidden rounded-[16px] bg-white px-2">
            <div className="mb-4">
              <ApplicationSearch />
            </div>
            <div className="flex w-full flex-col gap-4">
              {paginatedApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                />
              ))}
            </div>
            <div className="mb-4 mt-6 flex w-full justify-center">
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
          <div className="my-3 w-full overflow-y-auto scrollbar-hide md:w-[50%] xl:w-full">
            <ShortlistedJobs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
