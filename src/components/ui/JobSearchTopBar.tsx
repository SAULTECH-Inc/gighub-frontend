import React, { useEffect, useState } from "react";
import {
  Search,
  Building2,
  MapPin,
  Filter,
  TrendingUp,
  Briefcase,
} from "lucide-react";
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
  const [totalJobsPosted, setTotalJobsPosted] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchTotalJobsPosted = async () => {
      const response = await getJobsPostedCount();
      if (response.statusCode === 200) {
        setTotalJobsPosted(response?.data || 0);
      }
    };
    fetchTotalJobsPosted();
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const response = await searchJobs(searchParams);
      if (response.statusCode === 200) {
        setJobs(response?.data);
        if (setTotalPages) {
          setTotalPages(response?.meta?.totalPages || 1);
        }
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
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
    <div className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        {/* Search Form */}
        <div className="space-y-4">
          {/* Mobile: Stacked Layout */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {/* Job Title Input */}
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-indigo-500 sm:h-5 sm:w-5" />
              </div>
              <input
                type="text"
                placeholder="Job title or keywords"
                value={searchParams.title}
                onChange={(e) => {
                  setSearchParams({
                    ...searchParams,
                    title: e.target.value,
                  });
                }}
                onKeyPress={handleKeyPress}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm placeholder-slate-500 transition-all duration-200 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:py-3 sm:text-base"
              />
            </div>

            {/* Company Input */}
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Building2 className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-indigo-500 sm:h-5 sm:w-5" />
              </div>
              <input
                type="text"
                placeholder="Company name"
                value={searchParams.companyName}
                onChange={(e) => {
                  setSearchParams({
                    ...searchParams,
                    companyName: e.target.value,
                  });
                }}
                onKeyPress={handleKeyPress}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm placeholder-slate-500 transition-all duration-200 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:py-3 sm:text-base"
              />
            </div>

            {/* Location Input */}
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MapPin className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-indigo-500 sm:h-5 sm:w-5" />
              </div>
              <input
                type="text"
                placeholder="City or remote"
                value={searchParams.location}
                onChange={(e) => {
                  setSearchParams({
                    ...searchParams,
                    location: e.target.value,
                  });
                }}
                onKeyPress={handleKeyPress}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm placeholder-slate-500 transition-all duration-200 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:py-3 sm:text-base"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleSearch}
                disabled={isSearching}
                className="flex flex-1 transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:from-slate-400 disabled:to-slate-500 disabled:hover:scale-100 disabled:hover:shadow-none sm:px-6 sm:py-3 sm:text-base lg:min-w-[120px] lg:flex-none"
              >
                {isSearching ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span className="hidden sm:inline">Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Find Jobs</span>
                  </>
                )}
              </button>

              {/* Mobile Filter Button */}
              <button
                onClick={toggleSidebar}
                className="group flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-200 bg-white transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 sm:w-auto sm:px-4 lg:hidden"
              >
                <Filter className="h-5 w-5 text-slate-600 transition-colors group-hover:text-indigo-600" />
                <span className="hidden text-sm font-medium text-slate-600 group-hover:text-indigo-600 sm:ml-2 sm:inline">
                  Filter
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Popular Searches and Stats */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Popular Searches */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600 sm:h-5 sm:w-5" />
                <h3 className="text-sm font-semibold text-slate-800 sm:text-base">
                  Popular Searches:
                </h3>
              </div>
              <div className="flex-1">
                <MostSearchedKeywords
                  mostSearchedKeywords={mostSearchedKeywords || []}
                />
              </div>
            </div>

            {/* Job Count Stats */}
            {totalJobsPosted > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2">
                <Briefcase className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                <span className="text-sm font-medium text-slate-700 sm:text-base">
                  Total Jobs:
                </span>
                <span className="text-sm font-bold text-blue-600 sm:text-base">
                  {numeral(totalJobsPosted).format("0,0")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Filters - Mobile */}
        <div className="mt-4 lg:hidden">
          <div className="flex flex-wrap gap-2">
            {["Remote", "Full-time", "Part-time", "Contract", "Internship"].map(
              (filter) => (
                <button
                  key={filter}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                >
                  {filter}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchTopBar;
