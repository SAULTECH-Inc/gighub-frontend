import React, { useState, useCallback, useMemo } from "react";
import moment from "moment";
import {
  FiSearch,
  FiMapPin,
  FiBriefcase,
  FiX,
  FiStar,
  FiCalendar,
  FiTrendingUp,
  FiSliders,
  FiRefreshCw,
} from "react-icons/fi";

import microscope from "../../assets/icons/microscope.svg";
import certificate from "../../assets/icons/certificate.svg";
import location from "../../assets/icons/locations.svg";
import { PaginationParams } from "../../pages/company list/CompanyList";

interface CompanyNavbarProps {
  onChange: React.Dispatch<React.SetStateAction<PaginationParams>>;
  pagination: PaginationParams;
  totalResults?: number;
  isLoading?: boolean;
  showFilters?: boolean;
  layout?: "default" | "sidebar";
  aggregations?: {
    industries: Array<{ name: string; count: number }>;
    locations: Array<{ name: string; count: number }>;
    companySizes: Array<{ size: string; count: number }>;
  };
}

const CompanyNavbar: React.FC<CompanyNavbarProps> = ({
  onChange,
  pagination,
  totalResults = 0,
  isLoading = false,
  showFilters = false,
  layout = "default",
  aggregations,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    companyName: pagination.sortBy.companyName || "",
    industry: pagination.sortBy.industry || "",
    location: pagination.sortBy.location || "",
  });

  // Debounce filter updates
  const debounceUpdate = useCallback(
    (field: string, value: string) => {
      const timer = setTimeout(() => {
        onChange((prev) => ({
          ...prev,
          page: 1, // Reset to first page when filtering
          sortBy: {
            ...prev.sortBy,
            [field]: value,
          },
        }));
      }, 300);
      return () => clearTimeout(timer);
    },
    [onChange],
  );

  const handleInputChange = (field: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
    debounceUpdate(field, value);
  };

  const clearFilters = () => {
    setLocalFilters({
      companyName: "",
      industry: "",
      location: "",
    });
    onChange((prev) => ({
      ...prev,
      page: 1,
      sortBy: {
        companyName: "",
        industry: "",
        location: "",
        employeeCount: "",
        foundedYear: "",
        rating: "",
        openPositions: "",
      },
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
    }));
  };

  const handleFilterChange = (filterType: string, value: any) => {
    onChange((prev) => ({
      ...prev,
      page: 1,
      filters: {
        ...prev.filters,
        [filterType]: value,
      },
    }));
  };

  const toggleArrayFilter = (
    filterType: keyof PaginationParams["filters"],
    value: string,
  ) => {
    onChange((prev) => {
      const currentArray = (prev.filters[filterType] as string[]) || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      return {
        ...prev,
        page: 1,
        filters: {
          ...prev.filters,
          [filterType]: newArray,
        },
      };
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (localFilters.companyName) count++;
    if (localFilters.industry) count++;
    if (localFilters.location) count++;
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
    return count;
  }, [localFilters, pagination.filters]);

  // Sidebar layout for mobile/filters panel
  if (layout === "sidebar") {
    return (
      <div className="space-y-6">
        {/* Quick Search */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Quick Search</h4>

          <div className="space-y-3">
            <div className="relative">
              <FiSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Company name..."
                value={localFilters.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              />
            </div>

            <div className="relative">
              <FiBriefcase className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Industry..."
                value={localFilters.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              />
            </div>

            <div className="relative">
              <FiMapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Location..."
                value={localFilters.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Filters</h4>

          {/* Company Size */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Company Size
            </label>
            <div className="space-y-2">
              {["startup", "small", "medium", "large"].map((size) => (
                <label key={size} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      pagination.filters.companySize?.includes(size) || false
                    }
                    onChange={() => toggleArrayFilter("companySize", size)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 capitalize">
                    {size}
                  </span>
                  {aggregations?.companySizes.find(
                    (cs) => cs.size === size,
                  ) && (
                    <span className="ml-auto text-xs text-gray-500">
                      (
                      {
                        aggregations.companySizes.find((cs) => cs.size === size)
                          ?.count
                      }
                      )
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Popular Industries */}
          {aggregations?.industries && aggregations.industries.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Popular Industries
              </label>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {aggregations.industries.slice(0, 10).map((industry) => (
                  <label key={industry.name} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        pagination.filters.industry?.includes(industry.name) ||
                        false
                      }
                      onChange={() =>
                        toggleArrayFilter("industry", industry.name)
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {industry.name}
                    </span>
                    <span className="ml-auto text-xs text-gray-500">
                      ({industry.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Popular Locations */}
          {aggregations?.locations && aggregations.locations.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Popular Locations
              </label>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {aggregations.locations.slice(0, 10).map((loc) => (
                  <label key={loc.name} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        pagination.filters.location?.includes(loc.name) || false
                      }
                      onChange={() => toggleArrayFilter("location", loc.name)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {loc.name}
                    </span>
                    <span className="ml-auto text-xs text-gray-500">
                      ({loc.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Rating Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Minimum Rating
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={pagination.filters.minRating || 0}
                onChange={(e) =>
                  handleFilterChange("minRating", parseFloat(e.target.value))
                }
                className="flex-1"
              />
              <span className="w-8 text-sm text-gray-600">
                {pagination.filters.minRating || 0}+
              </span>
              <FiStar className="h-4 w-4 text-yellow-400" />
            </div>
          </div>

          {/* Employee Count Range */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Employee Count
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={pagination.filters.minEmployees || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "minEmployees",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={pagination.filters.maxEmployees || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "maxEmployees",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Founded Year */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Founded After
            </label>
            <input
              type="number"
              placeholder="e.g., 2010"
              min="1800"
              max={new Date().getFullYear()}
              value={pagination.filters.foundedAfter || ""}
              onChange={(e) =>
                handleFilterChange(
                  "foundedAfter",
                  parseInt(e.target.value) || 0,
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
            />
          </div>

          {/* Quick Filters */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={pagination.filters.hasOpenings || false}
                onChange={(e) =>
                  handleFilterChange("hasOpenings", e.target.checked)
                }
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-3 text-sm text-gray-700">
                Has open positions
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={pagination.filters.isRemoteFriendly || false}
                onChange={(e) =>
                  handleFilterChange("isRemoteFriendly", e.target.checked)
                }
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-3 text-sm text-gray-700">
                Remote-friendly
              </span>
            </label>
          </div>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="w-full py-2 text-center text-sm font-medium text-purple-600 hover:text-purple-700"
          >
            Clear all filters ({activeFiltersCount})
          </button>
        )}
      </div>
    );
  }

  // Default layout
  return (
    <header className="space-y-4">
      {/* Main Header */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <nav className="hidden items-center justify-between p-6 lg:flex">
          <div className="flex w-[30%] flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Find Companies Easily
            </h2>
            <div className="mt-1 flex items-center space-x-2">
              <FiCalendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-600">
                {moment().format("dddd, MMMM D, YYYY")}
              </span>
            </div>
            {totalResults > 0 && (
              <div className="mt-2 flex items-center space-x-2">
                <FiTrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">
                  {totalResults.toLocaleString()} companies found
                </span>
              </div>
            )}
          </div>

          <div className="flex w-[70%] items-end justify-evenly gap-4">
            {/* Company Name Search */}
            <div className="flex w-full items-center rounded-xl border border-gray-200 bg-gray-50 transition-all focus-within:border-purple-500 focus-within:bg-white">
              <div className="p-3">
                <img
                  src={microscope}
                  alt="search"
                  className="h-5 w-5 opacity-70"
                />
              </div>
              <input
                type="text"
                placeholder="Company Name"
                value={localFilters.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                className="h-12 w-full border-none bg-transparent px-2 py-2 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none"
                disabled={isLoading}
              />
              {localFilters.companyName && (
                <button
                  onClick={() => handleInputChange("companyName", "")}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Industry Search */}
            <div className="flex w-full items-center rounded-xl border border-gray-200 bg-gray-50 transition-all focus-within:border-purple-500 focus-within:bg-white">
              <div className="p-3">
                <img
                  src={certificate}
                  alt="industry"
                  className="h-5 w-5 opacity-70"
                />
              </div>
              <input
                type="text"
                placeholder="Industry"
                value={localFilters.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
                className="h-12 w-full border-none bg-transparent px-2 py-2 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none"
                disabled={isLoading}
              />
              {localFilters.industry && (
                <button
                  onClick={() => handleInputChange("industry", "")}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Location Search */}
            <div className="flex w-full items-center rounded-xl border border-gray-200 bg-gray-50 transition-all focus-within:border-purple-500 focus-within:bg-white">
              <div className="p-3">
                <img
                  src={location}
                  alt="location"
                  className="h-5 w-5 opacity-70"
                />
              </div>
              <input
                type="text"
                placeholder="Location"
                value={localFilters.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="h-12 w-full border-none bg-transparent px-2 py-2 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none"
                disabled={isLoading}
              />
              {localFilters.location && (
                <button
                  onClick={() => handleInputChange("location", "")}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center space-x-2 rounded-xl border px-4 py-3 transition-all ${
                showAdvancedFilters || activeFiltersCount > 0
                  ? "border-purple-600 bg-purple-600 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
              disabled={isLoading}
            >
              <FiSliders className="h-5 w-5" />
              <span className="hidden xl:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="min-w-[20px] rounded-full bg-white/20 px-2 py-1 text-center text-xs">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Header */}
        <div className="space-y-4 p-4 lg:hidden">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">Find Companies</h2>
            <span className="text-sm text-gray-600">
              {moment().format("MMM D, YYYY")}
            </span>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <FiSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={localFilters.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <FiBriefcase className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Industry"
                  value={localFilters.industry}
                  onChange={(e) =>
                    handleInputChange("industry", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                />
              </div>

              <div className="relative">
                <FiMapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  value={localFilters.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Advanced Filters
            </h3>
            <button
              onClick={() => setShowAdvancedFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Company Size Filter */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Company Size
              </label>
              <div className="space-y-2">
                {[
                  { value: "startup", label: "Startup (1-50)" },
                  { value: "small", label: "Small (51-200)" },
                  { value: "medium", label: "Medium (201-1000)" },
                  { value: "large", label: "Large (1000+)" },
                ].map((size) => (
                  <label key={size.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        pagination.filters.companySize?.includes(size.value) ||
                        false
                      }
                      onChange={() =>
                        toggleArrayFilter("companySize", size.value)
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {size.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Minimum Rating
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={pagination.filters.minRating || 0}
                    onChange={(e) =>
                      handleFilterChange(
                        "minRating",
                        parseFloat(e.target.value),
                      )
                    }
                    className="flex-1"
                  />
                  <div className="flex items-center space-x-1">
                    <span className="w-8 text-sm text-gray-600">
                      {pagination.filters.minRating || 0}
                    </span>
                    <FiStar className="h-4 w-4 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Quick Filters
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={pagination.filters.hasOpenings || false}
                    onChange={(e) =>
                      handleFilterChange("hasOpenings", e.target.checked)
                    }
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Has open positions
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={pagination.filters.isRemoteFriendly || false}
                    onChange={(e) =>
                      handleFilterChange("isRemoteFriendly", e.target.checked)
                    }
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Remote-friendly
                  </span>
                </label>
              </div>
            </div>

            {/* Employee Range */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Employee Count
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={pagination.filters.minEmployees || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "minEmployees",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={pagination.filters.maxEmployees || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxEmployees",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
            <span className="text-sm text-gray-600">
              {activeFiltersCount}{" "}
              {activeFiltersCount === 1 ? "filter" : "filters"} active
            </span>

            <div className="flex items-center space-x-3">
              <button
                onClick={clearFilters}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                disabled={activeFiltersCount === 0}
              >
                Clear All
              </button>

              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <FiRefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm">Searching companies...</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default CompanyNavbar;
