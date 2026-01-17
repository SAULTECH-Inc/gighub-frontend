import React, { useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ArrowUpDown, ChevronDown, Check } from "lucide-react";
import { SortBy } from "../../utils/types";

interface ApplicationSearchProps {
  setApplicationStatus: React.Dispatch<React.SetStateAction<string | null>>;
  setSort: React.Dispatch<React.SetStateAction<SortBy>>;
  sort: SortBy;
}

const statuses = [
  { label: "All", value: null, color: "bg-slate-100 text-slate-700" },
  { label: "Pending", value: "Pending", color: "bg-amber-100 text-amber-700" },
  { label: "Hired", value: "Hired", color: "bg-emerald-100 text-emerald-700" },
  { label: "Rejected", value: "Rejected", color: "bg-red-100 text-red-700" },
  {
    label: "Shortlisted",
    value: "Shortlisted",
    color: "bg-blue-100 text-blue-700",
  },
];

const sortOptions = [
  { label: "Date Applied", value: "createdAt", icon: "📅" },
  { label: "Company Name", value: "company", icon: "🏢" },
  { label: "Job Title", value: "title", icon: "💼" },
  { label: "Status", value: "status", icon: "📊" },
];

const ApplicationSearch: React.FC<ApplicationSearchProps> = memo(
  ({ setApplicationStatus, setSort, sort }) => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    const handleStatusChange = useCallback(
      (status: string | null) => {
        setSelectedStatus(status);
        setApplicationStatus(status);
        setFilterOpen(false);
      },
      [setApplicationStatus],
    );

    const handleSortChange = useCallback(
      (orderBy: string) => {
        setSort((prev) => ({
          ...prev,
          orderBy,
          sortDirection:
            prev.orderBy === orderBy && prev.sortDirection === "asc"
              ? "desc"
              : "asc",
        }));
        setSortOpen(false);
      },
      [setSort],
    );

    const toggleSortDirection = useCallback(() => {
      setSort((prev) => ({
        ...prev,
        sortDirection: prev.sortDirection === "asc" ? "desc" : "asc",
      }));
    }, [setSort]);

    const closeDropdowns = useCallback(() => {
      setFilterOpen(false);
      setSortOpen(false);
    }, []);

    const selectedStatusData =
      statuses.find((s) => s.value === selectedStatus) || statuses[0];
    const selectedSortData =
      sortOptions.find((s) => s.value === sort.orderBy) || sortOptions[0];

    return (
      <>
        {/* Backdrop to close dropdowns */}
        {(filterOpen || sortOpen) && (
          <div
            className="fixed inset-0 z-10 bg-transparent"
            onClick={closeDropdowns}
          />
        )}

        <div className="flex flex-col space-y-4">
          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold text-slate-900 sm:text-2xl"
          >
            My Applications
          </motion.h1>

          {/* Desktop Filters - Stack vertically on smaller screens */}
          <div className="hidden xl:block">
            <div className="space-y-4">
              {/* Status Filter Row */}
              <div className="flex items-center space-x-3">
                <span className="min-w-fit text-sm font-medium text-slate-700">
                  Filter by status:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {statuses.map((status) => {
                    const isActive = selectedStatus === status.value;
                    return (
                      <motion.button
                        key={status.label}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusChange(status.value)}
                        className={`relative rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                          isActive
                            ? "border-indigo-300 bg-indigo-50 text-indigo-700 shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {status.label}
                        {isActive && (
                          <motion.div
                            layoutId="activeFilter"
                            className="absolute inset-0 rounded-lg border-2 border-indigo-500"
                            transition={{ type: "spring", duration: 0.3 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Options Row */}
              <div className="flex items-center space-x-3">
                <span className="min-w-fit text-sm font-medium text-slate-700">
                  Sort by:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {sortOptions.map((sortOption) => {
                    const isActive = sort.orderBy === sortOption.value;
                    return (
                      <motion.button
                        key={sortOption.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSortChange(sortOption.value)}
                        className={`relative flex items-center space-x-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                          isActive
                            ? "border-indigo-300 bg-indigo-50 text-indigo-700 shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span>{sortOption.icon}</span>
                        <span>{sortOption.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeSort"
                            className="absolute inset-0 rounded-lg border-2 border-indigo-500"
                            transition={{ type: "spring", duration: 0.3 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}

                  {/* Sort Direction Toggle */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleSortDirection}
                    className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                    title={`Sort ${sort.sortDirection === "asc" ? "ascending" : "descending"}`}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    <span>{sort.sortDirection === "asc" ? "↑" : "↓"}</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Medium screens - Simplified layout */}
          <div className="hidden items-center justify-between lg:flex xl:hidden">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-700">
                Filter:
              </span>
              <div className="flex items-center space-x-2">
                {statuses.slice(0, 3).map((status) => {
                  const isActive = selectedStatus === status.value;
                  return (
                    <button
                      key={status.label}
                      onClick={() => handleStatusChange(status.value)}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                        isActive
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {status.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700">Sort:</span>
              <select
                value={sort.orderBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              >
                {sortOptions.map((sortOption) => (
                  <option key={sortOption.value} value={sortOption.value}>
                    {sortOption.label}
                  </option>
                ))}
              </select>
              <button
                onClick={toggleSortDirection}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm hover:bg-slate-50"
                title={`Sort ${sort.sortDirection === "asc" ? "ascending" : "descending"}`}
              >
                {sort.sortDirection === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Filters */}
          <div className="flex items-center justify-end space-x-3 lg:hidden">
            {/* Filter Dropdown */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setFilterOpen(!filterOpen);
                  setSortOpen(false);
                }}
                className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
              >
                <Filter className="h-4 w-4" />
                <span className={selectedStatusData.color.split(" ")[1]}>
                  {selectedStatusData.label}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${filterOpen ? "rotate-180" : ""}`}
                />
              </motion.button>

              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg"
                  >
                    <div className="py-2">
                      {statuses.map((status) => {
                        const isActive = selectedStatus === status.value;
                        return (
                          <button
                            key={status.label}
                            onClick={() => handleStatusChange(status.value)}
                            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                              isActive
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span
                              className={`inline-flex items-center space-x-2`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${status.color.split(" ")[0]}`}
                              />
                              <span>{status.label}</span>
                            </span>
                            {isActive && (
                              <Check className="h-4 w-4 text-indigo-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSortOpen(!sortOpen);
                  setFilterOpen(false);
                }}
                className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span>{selectedSortData.label}</span>
                <span className="text-xs text-slate-500">
                  {sort.sortDirection === "asc" ? "↑" : "↓"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${sortOpen ? "rotate-180" : ""}`}
                />
              </motion.button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg"
                  >
                    <div className="py-2">
                      {sortOptions.map((sortOption) => {
                        const isActive = sort.orderBy === sortOption.value;
                        return (
                          <button
                            key={sortOption.value}
                            onClick={() => handleSortChange(sortOption.value)}
                            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                              isActive
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span className="flex items-center space-x-2">
                              <span>{sortOption.icon}</span>
                              <span>{sortOption.label}</span>
                            </span>
                            {isActive && (
                              <Check className="h-4 w-4 text-indigo-600" />
                            )}
                          </button>
                        );
                      })}

                      {/* Sort Direction Toggle */}
                      <div className="mt-2 border-t border-slate-100 pt-2">
                        <button
                          onClick={toggleSortDirection}
                          className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          <span>Direction</span>
                          <span className="flex items-center space-x-1">
                            <ArrowUpDown className="h-4 w-4" />
                            <span>
                              {sort.sortDirection === "asc"
                                ? "Ascending"
                                : "Descending"}
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </>
    );
  },
);

ApplicationSearch.displayName = "ApplicationSearch";

export default ApplicationSearch;
