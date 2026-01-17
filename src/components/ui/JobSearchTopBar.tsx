import React, { useEffect, useState } from "react";
import {
    Search,
    Building2,
    MapPin,
    SlidersHorizontal,
    Briefcase,
    TrendingUp,
    X,
    ChevronDown,
} from "lucide-react";
import {
    getJobsPostedCount,
    getMostUsedKeywords,
    searchJobs,
} from "../../services/api";
import { FetchMyJobParam, JobPostResponse } from "../../utils/types";
import numeral from "numeral";
import { AnimatePresence, motion } from "framer-motion";

interface JobSearchTopBarProps {
    toggleSidebar: () => void;
    setJobs: React.Dispatch<React.SetStateAction<JobPostResponse[]>>;
    setTotalPages?: React.Dispatch<React.SetStateAction<number>>;
    activeFiltersCount?: number;
}

const PAGE_LIMIT = 20;

const JobSearchTopBar: React.FC<JobSearchTopBarProps> = ({
                                                             toggleSidebar,
                                                             setJobs,
                                                             setTotalPages,
                                                             activeFiltersCount = 0,
                                                         }) => {
    const [mostSearchedKeywords, setMostSearchedKeywords] = useState<string[]>([]);
    const [searchParams, setSearchParams] = useState<FetchMyJobParam>({
        page: 1,
        limit: PAGE_LIMIT,
        title: "",
        companyName: "",
        location: "",
    });
    const [totalJobsPosted, setTotalJobsPosted] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

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

    const handleClearSearch = () => {
        setSearchParams({
            page: 1,
            limit: PAGE_LIMIT,
            title: "",
            companyName: "",
            location: "",
        });
    };

    const hasActiveSearch = searchParams.title || searchParams.companyName || searchParams.location;

    useEffect(() => {
        const doFetchMostSearchedKeywords = async () => {
            return await getMostUsedKeywords(3);
        };

        doFetchMostSearchedKeywords().then((res) =>
            setMostSearchedKeywords(res?.data || []),
        );
    }, []);

    return (
        <div className="w-full border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-3">
                {/* Main Search Bar */}
                <div className="flex gap-2">
                    {/* Primary Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search jobs, companies, or locations..."
                            value={searchParams.title}
                            onChange={(e) =>
                                setSearchParams({ ...searchParams, title: e.target.value })
                            }
                            onKeyPress={handleKeyPress}
                            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-10 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                        />
                        {hasActiveSearch && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Advanced Search Toggle - Desktop */}
                    <button
                        onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                        className="hidden items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 md:flex"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span>Advanced</span>
                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${showAdvancedSearch ? "rotate-180" : ""}`}
                        />
                    </button>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:bg-gray-400"
                    >
                        {isSearching ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        ) : (
                            <>
                                <Search className="h-4 w-4" />
                                <span className="hidden sm:inline">Search</span>
                            </>
                        )}
                    </button>

                    {/* Filter Button - Mobile */}
                    <button
                        onClick={toggleSidebar}
                        className="relative flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white p-2.5 text-gray-700 transition-all hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700 md:hidden"
                    >
                        <SlidersHorizontal className="h-5 w-5" />
                        {activeFiltersCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                {activeFiltersCount}
              </span>
                        )}
                    </button>
                </div>

                {/* Advanced Search Fields - Collapsible */}
                <AnimatePresence>
                    {showAdvancedSearch && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                <div className="relative">
                                    <Building2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Company name"
                                        value={searchParams.companyName}
                                        onChange={(e) =>
                                            setSearchParams({ ...searchParams, companyName: e.target.value })
                                        }
                                        onKeyPress={handleKeyPress}
                                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-9 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                                    />
                                </div>

                                <div className="relative">
                                    <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Location"
                                        value={searchParams.location}
                                        onChange={(e) =>
                                            setSearchParams({ ...searchParams, location: e.target.value })
                                        }
                                        onKeyPress={handleKeyPress}
                                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-9 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom Info Bar - Compact */}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                    {/* Total Jobs Count */}
                    {totalJobsPosted > 0 && (
                        <div className="flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1">
                            <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                            <span className="font-medium text-blue-900">
                {numeral(totalJobsPosted).format("0,0")}
              </span>
                        </div>
                    )}

                    {/* Popular Keywords */}
                    {mostSearchedKeywords?.length > 0 && (
                        <>
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <TrendingUp className="h-3.5 w-3.5" />
                                <span className="font-medium">Trending:</span>
                            </div>
                            {mostSearchedKeywords.slice(0, 3).map((keyword, idx) => (
                                <button
                                    key={idx}
                                    onClick={() =>
                                        setSearchParams({ ...searchParams, title: keyword })
                                    }
                                    className="rounded-full bg-purple-50 px-2.5 py-1 font-medium text-purple-700 transition-colors hover:bg-purple-100"
                                >
                                    {keyword}
                                </button>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobSearchTopBar;