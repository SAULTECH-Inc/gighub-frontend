import React, { useEffect, useState } from "react";
import { Search, Building2, MapPin, Filter, TrendingUp, Briefcase } from "lucide-react";
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
    if (e.key === 'Enter') {
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
    <div className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Search Form */}
        <div className="space-y-4">
          {/* Mobile: Stacked Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Job Title Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
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
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm sm:text-base placeholder-slate-500"
              />
            </div>

            {/* Company Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
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
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm sm:text-base placeholder-slate-500"
              />
            </div>

            {/* Location Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
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
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm sm:text-base placeholder-slate-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleSearch}
                disabled={isSearching}
                className="flex-1 lg:flex-none lg:min-w-[120px] flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Find Jobs</span>
                  </>
                )}
              </button>

              {/* Mobile Filter Button */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden flex items-center justify-center w-12 h-12 sm:w-auto sm:px-4 bg-white border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl transition-all duration-200 group"
              >
                <Filter className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                <span className="hidden sm:inline sm:ml-2 text-sm font-medium text-slate-600 group-hover:text-indigo-600">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Popular Searches and Stats */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Popular Searches */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                <h3 className="text-sm sm:text-base font-semibold text-slate-800">
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
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-sm sm:text-base font-medium text-slate-700">
                  Total Jobs:
                </span>
                <span className="text-sm sm:text-base font-bold text-blue-600">
                  {numeral(totalJobsPosted).format("0,0")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Filters - Mobile */}
        <div className="mt-4 lg:hidden">
          <div className="flex flex-wrap gap-2">
            {['Remote', 'Full-time', 'Part-time', 'Contract', 'Internship'].map((filter) => (
              <button
                key={filter}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchTopBar;