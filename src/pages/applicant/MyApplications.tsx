import { useEffect, useState } from "react";
import { Cancel, Search } from "../../assets/icons";
import TopNavBar from "../../components/layouts/TopNavBar";
import ApplicantSchedules from "../../components/ui/ApplicantSchedules";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
} from "../../utils/constants";

import { Pagination, Select, Input, Button, Spin, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ShortlistedJobs from "../job/ShortlistedJobs";

enum ApplicationStatus {
  PENDING = "Pending",
  HIRED = "Hired",
  INTERVIEW = "Interview Scheduled",
  REJECTED = "Rejected",
  SHORTLISTED = "Shortlisted",
  WITHDRAW = "Withdraw",
}

interface Application {
  id: number;
  jobTitle: string;
  jobLocation: string;
  location: string;
  status: ApplicationStatus;
  position: string;
  appliedDate: string;
}

interface PaginationParams {
  current: number;
  pageSize: number;
  total: number;
}

const statusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "#FFD900",
  [ApplicationStatus.HIRED]: "#56E5A1",
  [ApplicationStatus.INTERVIEW]: "#65FF81",
  [ApplicationStatus.REJECTED]: "#FA4E09",
  [ApplicationStatus.SHORTLISTED]: "#56E5A1",
  [ApplicationStatus.WITHDRAW]: "#FF5733", // Added missing status
};

type SortOption = "companyAsc" | "companyDesc" | "dateAsc" | "dateDesc";

const MyApplications: React.FC = () => {
  const allApplications: Application[] = Array.from(
    { length: 35 },
    (_, index) => ({
      id: 1000 + index,
      jobTitle: `${["Software Engineer", "Product Manager", "UI/UX Designer", "Data Scientist", "DevOps Engineer"][index % 5]} ${Math.floor(index / 5) + 1}`,
      companyName: `${["TechCorp", "DataSystems", "InnovateCo", "DevHouse", "FutureTech", "CodeWorks", "ByteForge"][index % 7]}`,
      location: `${["San Francisco", "New York", "Seattle", "Austin", "Remote", "Chicago", "Boston"][index % 7]}`,
      jobLocation: `${["Remote", "Hybrid", "Onsite"][index % 3]}`,
      status: Object.values(ApplicationStatus)[index % 5],
      position: `${["Junior", "Mid-level", "Senior", "Lead", "Principal"][index % 5]}`,
      appliedDate: new Date(Date.now() - index * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    }),
  );

  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationParams>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [activeFilter, setActiveFilter] = useState<ApplicationStatus | null>(
    null,
  );
  const [sortBy, setSortBy] = useState<SortOption | null>(null);

  // Initialize data
  useEffect(() => {
    setFilteredApps(allApplications);
    setPagination({
      ...pagination,
      total: allApplications.length,
    });
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...allApplications];

    // Apply status filter
    if (activeFilter) {
      filtered = filtered.filter((app) => app.status === activeFilter);
    }

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "companyAsc":
            return a.jobTitle.localeCompare(b.jobTitle);
          case "companyDesc":
            return b.jobTitle.localeCompare(a.jobTitle);
          case "dateAsc":
            return (
              new Date(a.appliedDate).getTime() -
              new Date(b.appliedDate).getTime()
            );
          case "dateDesc":
            return (
              new Date(b.appliedDate).getTime() -
              new Date(a.appliedDate).getTime()
            );
          default:
            return 0;
        }
      });
    }

    setFilteredApps(filtered);
    setPagination({
      ...pagination,
      current: 1,
      total: filtered.length,
    });
  }, [activeFilter, sortBy]);

  // Calculate current page data
  useEffect(() => {
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    setApplications(filteredApps.slice(startIndex, endIndex));
  }, [filteredApps, pagination.current, pagination.pageSize]);

  // Handle page change
  const handlePageChange = (page: number): void => {
    setPagination({
      ...pagination,
      current: page,
    });
  };

  // Handle filter click
  const handleFilterClick = (status: ApplicationStatus): void => {
    setActiveFilter((prev) => (prev === status ? null : status));
  };

  // Handle sort change
  const toggleSort = (option: SortOption): void => {
    setSortBy((prev) => (prev === option ? null : option));
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex h-screen w-full flex-col items-center bg-[#F7F8FA]">
      <div className="w-full">
        <TopNavBar
          navItems={applicantNavItems}
          navItemsMobile={applicantNavItemsMobile}
          navbarItemsMap={applicantNavBarItemMap}
        />
      </div>
      <div className="flex w-full justify-center">
        <div className="flex w-[70%] flex-col items-center justify-center">
          <div className="my-4 flex h-[64px] w-[96%] max-w-[960px] items-center justify-between rounded-[16px] bg-white px-4">
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex w-[80%] items-center">
                <img src={Search} alt="search icon" className="fill-black" />
                <div className="flex w-full items-center justify-between">
                  <input
                    type="text"
                    placeholder="Job Title"
                    className="border-none bg-transparent outline-none placeholder:font-bold placeholder:text-[#000000] focus:ring-0"
                  />
                  <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F7F7F7]">
                    <img src={Cancel} alt="cancel" />
                  </div>
                </div>
                <div className="mx-4 h-[29px] border-l border-[#7F7F7F]"></div>
                <div className="flex w-full items-center justify-between">
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="border-none bg-transparent outline-none placeholder:font-bold placeholder:text-[#000000] focus:ring-0"
                  />
                  <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F7F7F7]">
                    <img src={Cancel} alt="cancel" />
                  </div>
                </div>
              </div>
              <div className="flex w-[30%] items-center justify-end">
                <button className="h-[42px] w-[60%] rounded-[10px] bg-[#6B5AED] text-white">
                  Find Job
                </button>
              </div>
            </div>
          </div>
          <div className="mb-4 flex w-[96%] max-w-[960px] flex-col justify-between rounded-[16px] bg-white px-4 py-4">
            <div className="mb-6 flex w-full items-center justify-between gap-2 rounded-[16px] bg-[#F7F7F7] px-4 py-2">
              <p className="font-bold">Filter By:</p>
              <button
                className={`rounded-[10px] border border-[#E6E6E6] px-[42px] py-[9px] transition-colors ${activeFilter === ApplicationStatus.PENDING ? "bg-blue-500 text-white" : "bg-white"}`}
                onClick={() => handleFilterClick(ApplicationStatus.PENDING)}
              >
                Pending
              </button>
              <button
                className={`rounded-[10px] border border-[#E6E6E6] px-[42px] py-[9px] transition-colors ${activeFilter === ApplicationStatus.HIRED ? "bg-blue-500 text-white" : "bg-white"}`}
                onClick={() => handleFilterClick(ApplicationStatus.HIRED)}
              >
                Hired
              </button>
              <button
                className={`rounded-[10px] border border-[#E6E6E6] px-[42px] py-[9px] transition-colors ${activeFilter === ApplicationStatus.REJECTED ? "bg-blue-500 text-white" : "bg-white"}`}
                onClick={() => handleFilterClick(ApplicationStatus.REJECTED)}
              >
                Rejected
              </button>
              <button
                className={`rounded-[10px] border border-[#E6E6E6] px-[42px] py-[9px] transition-colors ${activeFilter === ApplicationStatus.SHORTLISTED ? "bg-blue-500 text-white" : "bg-white"}`}
                onClick={() => handleFilterClick(ApplicationStatus.SHORTLISTED)}
              >
                Shortlisted
              </button>
            </div>

            {/* Sort Options */}
            <div className="mb-6 flex items-center gap-4">
              <span className="font-bold">Sort By:</span>
              <div className="flex gap-2">
                <button
                  className={`border-gray-300 flex items-center gap-1 rounded-lg border px-4 py-2 ${sortBy === "companyAsc" || sortBy === "companyDesc" ? "bg-blue-50" : "bg-white"}`}
                  onClick={() =>
                    toggleSort(
                      sortBy === "companyAsc" ? "companyDesc" : "companyAsc",
                    )
                  }
                >
                  Company
                  {sortBy === "companyAsc" && <span>↑</span>}
                  {sortBy === "companyDesc" && <span>↓</span>}
                </button>
                <button
                  className={`border-gray-300 flex items-center gap-1 rounded-lg border px-4 py-2 ${sortBy === "dateAsc" || sortBy === "dateDesc" ? "bg-blue-50" : "bg-white"}`}
                  onClick={() =>
                    toggleSort(sortBy === "dateAsc" ? "dateDesc" : "dateAsc")
                  }
                >
                  Date
                  {sortBy === "dateAsc" && <span>↑</span>}
                  {sortBy === "dateDesc" && <span>↓</span>}
                </button>
              </div>
            </div>

            <div className="w-full">
              {/* Applications list */}
              {loading ? (
                <div
                  className="loading-container"
                  style={{ textAlign: "center", padding: "40px 0" }}
                >
                  <Spin size="large" />
                </div>
              ) : (
                <div className="mt-5 flex w-full flex-col">
                  {applications.length > 0 ? (
                    applications.map((app: Application) => (
                      <div key={app.id} className="my-2 flex w-full">
                        <div className="flex h-[63px] items-center rounded-[16px] bg-[#F7F7F7] px-2">
                          <div className="flex w-[300px] items-center gap-2">
                            <div className="h-[46px] w-[51px] rounded-[10px] bg-[#D9D9D9]"></div>
                            <div>
                              <p className="font-bold">{app.jobTitle}</p>
                              <p className="text-[13px] font-bold text-[#7F7F7F]">
                                {app.location}
                              </p>
                            </div>
                          </div>
                          <div className="flex w-[80px] justify-center text-[13px]">
                            {formatDate(app.appliedDate)}
                          </div>
                          <div className="flex w-[180px] justify-center text-[13px]">
                            {app.jobTitle}
                          </div>
                          <div className="flex w-[120px] justify-center text-[13px]">
                            {app.jobLocation}
                          </div>
                          <div
                            className="flex w-[180px] gap-2 text-[13px]"
                            style={{ color: statusColors[app.status] }}
                          >
                            <div
                              className="h-[16px] w-[16px] rounded-full"
                              style={{
                                backgroundColor: statusColors[app.status],
                              }}
                            ></div>
                            {app.status}
                          </div>
                          <div className="ml-2 flex h-[41px] w-[41px] rounded-full bg-[#6B5AED4F]"></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">
                      <p>No applications found matching your criteria.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex w-full justify-center">
                <Pagination
                  current={pagination.current}
                  total={pagination.total}
                  pageSize={pagination.pageSize}
                  onChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  disabled={loading}
                  className="pagination-controls self-center"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-2 my-4 flex w-[30%] max-w-[396px] flex-col items-center gap-5 bg-red-500">
          <div className="flex w-full items-center">
            <div className="flex w-full">
              <ApplicantSchedules />
            </div>
          </div>
          <ShortlistedJobs />
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
