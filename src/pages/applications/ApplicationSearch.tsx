import React, { useState } from "react";
import { FilterIcon } from "../../assets/icons";
import { BiSortAlt2 } from "react-icons/bi";
import { SortBy } from "../../utils/types";
import { FiChevronDown } from "react-icons/fi";

interface ApplicationSearchProps {
  setApplicationStatus: React.Dispatch<React.SetStateAction<string | null>>;
  setSort: React.Dispatch<React.SetStateAction<SortBy>>;
  sort: SortBy;
}

const statuses = ["All", "Pending", "Hired", "Rejected", "Shortlisted"];
const sortOptions = [
  { label: "Company", value: "company" },
  { label: "Date", value: "createdAt" },
];

const ApplicationSearch: React.FC<ApplicationSearchProps> = ({
  setApplicationStatus,
  setSort,
  sort,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  return (
    <div className="w-full">
      <div className="my-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xl font-bold">My Applications</p>

        {/* Desktop: Filter + Sort */}
        <div className="hidden items-center gap-4 lg:flex">
          {/* Filter By */}
          <div className="flex items-center gap-2">
            <span className="font-bold">Filter:</span>
            {statuses.map((status) => {
              const isActive =
                (status === "All" && !selectedStatus) ||
                selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => {
                    const actual = status === "All" ? null : status;
                    setSelectedStatus(actual);
                    setApplicationStatus(actual);
                  }}
                  className={`rounded-md border px-3 py-1 text-sm ${
                    isActive
                      ? "border-[#A78BFA] bg-[#EDE9FE] text-[#5B21B6]"
                      : "border-gray-300 bg-white text-gray-600"
                  } hover:bg-gray-100`}
                >
                  {status}
                </button>
              );
            })}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="font-bold">Sort:</span>
            {sortOptions.map((opt) => {
              const isActive = sort.orderBy === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSort({ ...sort, orderBy: opt.value })}
                  className={`rounded-md border px-3 py-1 text-sm ${
                    isActive
                      ? "border-[#A78BFA] bg-[#EDE9FE] text-[#5B21B6]"
                      : "border-gray-300 bg-white text-gray-600"
                  } hover:bg-gray-100`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile: Filter + Sort Dropdowns */}
        <div className="flex gap-2 self-end lg:hidden">
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setFilterOpen(!filterOpen);
                setSortOpen(false);
              }}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2"
            >
              <img src={FilterIcon} alt="filter" className="h-4 w-4" />
              <span className="text-sm font-bold text-gray-600">Filter</span>
              <FiChevronDown />
            </button>
            {filterOpen && (
              <div className="absolute z-10 mt-2 w-40 rounded-md bg-white shadow-md">
                {statuses.map((status) => {
                  const isActive =
                    (status === "All" && !selectedStatus) ||
                    selectedStatus === status;
                  return (
                    <button
                      key={status}
                      onClick={() => {
                        const actual = status === "All" ? null : status;
                        setSelectedStatus(actual);
                        setApplicationStatus(actual);
                        setFilterOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm ${
                        isActive
                          ? "bg-[#EDE9FE] text-[#5B21B6]"
                          : "text-gray-600"
                      } hover:bg-gray-100`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setSortOpen(!sortOpen);
                setFilterOpen(false);
              }}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2"
            >
              <BiSortAlt2 className="text-gray-600" />
              <span className="text-sm font-bold text-gray-600">Sort</span>
              <FiChevronDown />
            </button>
            {sortOpen && (
              <div className="absolute z-10 mt-2 w-40 rounded-md bg-white shadow-md">
                {sortOptions.map((opt) => {
                  const isActive = sort.orderBy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSort({ ...sort, orderBy: opt.value });
                        setSortOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm ${
                        isActive
                          ? "bg-[#EDE9FE] text-[#5B21B6]"
                          : "text-gray-600"
                      } hover:bg-gray-100`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSearch;
