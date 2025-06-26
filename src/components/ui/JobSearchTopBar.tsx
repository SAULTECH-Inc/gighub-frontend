import React, { useEffect, useState } from "react";
import microscope from "../../assets/icons/microscope.svg";
import certificate from "../../assets/icons/certificate.svg";
import location from "../../assets/icons/locations.svg";
import filter from "../../assets/icons/filter.svg";
import {
  getJobsPostedCount,
  getMostUsedKeywords,
  searchJobs,
} from "../../services/api";
import { FetchMyJobParam, JobPostResponse } from "../../utils/types";
import numeral from "numeral";
import MostSearchedKeywords from "./MostSearchedKeywords.tsx";

interface JobSearchTopBarProps {
  toggleSidebar: () => void;
  setJobs: React.Dispatch<React.SetStateAction<JobPostResponse[]>>;
  setTotalPages?: React.Dispatch<React.SetStateAction<number>>;
}

const PAGE_LIMIT = 20;

const JobSearchTopBar: React.FC<JobSearchTopBarProps> = ({
  toggleSidebar,
  setJobs,
  setTotalPages,
}) => {
  const [mostSearchedKeywords, setMostSearchedKeywords] = useState<string[]>();
  const [searchParams, setSearchParams] = useState<FetchMyJobParam>({
    page: 1,
    limit: PAGE_LIMIT,
    title: "",
    companyName: "",
    location: "",
  });
  useEffect(() => {
    // Fetch total jobs posted when the component mounts
    const fetchTotalJobsPosted = async () => {
      const response = await getJobsPostedCount();
      if (response.statusCode === 200) {
        setTotalJobsPosted(response?.data || 0);
      }
    };
    fetchTotalJobsPosted();
  }, []);
  const [totalJobsPosted, setTotalJobsPosted] = useState(0);
  const handleSearch = async () => {
    const response = await searchJobs(searchParams);
    if (response.statusCode === 200) {
      setJobs(response?.data);
      if (setTotalPages) {
        setTotalPages(response?.meta?.totalPages || 1);
      }
    }
  };

  useEffect(() => {
    const doFetchMostSearchedKeywords = async () => {
      return await getMostUsedKeywords(3);
    };

    doFetchMostSearchedKeywords().then((res) =>
      setMostSearchedKeywords(res?.data),
    );
  }, []);
  return (
    <div className="mx-auto mt-0 flex w-full flex-col justify-center gap-y-8 bg-white p-6 md:mt-6">
      <div className="grid w-full grid-cols-1 items-center gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex h-[43px] w-full items-center rounded-[16px] border-[#F9F9F9] bg-[#F9F9F9]">
          <img src={microscope} alt="microscope" className="m-2" />
          <input
            type="text"
            placeholder="Job title"
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                title: e.target.value,
              });
            }}
            className="h-full w-full border-none bg-transparent px-4 py-2 focus:ring-0 focus:outline-none"
          />
        </div>
        <div className="flex h-[43px] w-full items-center rounded-[16px] border-[#F9F9F9] bg-[#F9F9F9]">
          <img src={certificate} alt="certificate" className="m-2" />
          <input
            type="text"
            placeholder="Company"
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                companyName: e.target.value,
              });
            }}
            className="h-full w-full border-none bg-transparent px-4 py-2 focus:ring-0 focus:outline-none"
          />
        </div>
        <div className="flex h-[43px] w-full items-center rounded-[16px] border-[#F9F9F9] bg-[#F9F9F9]">
          <img src={location} alt="location" className="m-2" />
          <input
            type="text"
            placeholder="Location"
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                location: e.target.value,
              });
            }}
            className="h-full w-full border-none bg-transparent px-4 py-2 focus:ring-0 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleSearch()}
            className="h-[43px] w-full rounded-[16px] bg-[#6438C2] text-center text-white lg:w-[60%]"
          >
            Find Job
          </button>
          <div
            onClick={toggleSidebar}
            className="flex h-[43px] w-[30%] cursor-pointer items-center justify-center rounded-[10px] border-[2px] border-[#F6F6F6] bg-white md:hidden"
          >
            <img src={filter} alt="filter icon" />
          </div>
        </div>
      </div>

      <div className="hidden w-full flex-wrap md:flex md:justify-between">
        <div className="flex items-center gap-x-1 md:gap-x-8">
          <h2 className="text-[16px] font-bold text-[#141B34]">
            Popular Search:
          </h2>
          <MostSearchedKeywords
            mostSearchedKeywords={mostSearchedKeywords || []}
          />
        </div>
        {totalJobsPosted > 0 && (
          <div className="flex items-center gap-x-2">
            <p className="text-[16px] font-bold text-[#141B34]">
              Total Jobs Posted:
            </p>
            <p className="text-[16px] font-bold text-[#141B34]">
              {numeral(totalJobsPosted).format("0,0")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearchTopBar;
