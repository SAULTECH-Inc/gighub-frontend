import { useEffect, useState } from "react";
import { Cancel, Search } from "../../assets/icons";
import TopNavBar from "../../components/layouts/TopNavBar";
import ApplicantSchedules from "../../components/ui/ApplicantSchedules";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
} from "../../utils/constants";

import { Pagination, Tag, Select, Input, Button, Spin, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

enum ApplicationStatus {
  PENDING = "PENDING",
  HIRED = "Hired",
  INTERVIEW = "Interview Scheduled",
  REJECTED = "Rejected",
  SHORTLISTED = "Shortlisted",
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

interface FilterParams {
  status?: ApplicationStatus;
  position?: string;
  searchText?: string;
}

const statusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "#FFD900",
  [ApplicationStatus.HIRED]: "#56E5A1",
  [ApplicationStatus.INTERVIEW]: "#65FF81",
  [ApplicationStatus.REJECTED]: "#FA4E09",
  [ApplicationStatus.SHORTLISTED]: "#56E5A1",
};

const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationParams>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<FilterParams>({});

  // Mock API call - replace with your actual API
  const fetchApplications = async (
    page: number,
    pageSize: number,
    filters: FilterParams,
  ): Promise<void> => {
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // In a real app, this would be your API call
      // const response = await fetch(`/api/applications?page=${page}&pageSize=${pageSize}&status=${filters.status || ''}&position=${filters.position || ''}&search=${filters.searchText || ''}`);
      // const data = await response.json();

      // For this example, we'll just filter mock data locally
      let filteredData = getMockApplications();

      if (filters.status) {
        filteredData = filteredData.filter(
          (app) => app.status === filters.status,
        );
      }

      if (filters.position) {
        filteredData = filteredData.filter(
          (app) => app.position === filters.position,
        );
      }

      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        filteredData = filteredData.filter(
          (app) =>
            app.jobTitle.toLowerCase().includes(searchLower) ||
            app.location.toLowerCase().includes(searchLower),
        );
      }

      // Apply pagination
      const total = filteredData.length;
      const start = (page - 1) * pageSize;
      const paginatedData = filteredData.slice(start, start + pageSize);

      setApplications(paginatedData);
      setPagination({
        ...pagination,
        current: page,
        total,
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data generator
  const getMockApplications = (): Application[] => {
    return Array.from({ length: 78 }, (_, index) => ({
      id: 1000 + index,
      jobTitle: `${["Software Engineer", "Product Manager", "UI/UX Designer", "Data Scientist", "DevOps Engineer"][index % 5]} ${Math.floor(index / 5) + 1}`,
      jobLocation: "Remote",
      location: `${["San Francisco", "New York", "Seattle", "Austin", "Remote", "Chicago", "Boston"][index % 7]}`,
      status: Object.values(ApplicationStatus)[index % 6],
      position: `${["Junior", "Mid-level", "Senior", "Lead", "Principal"][index % 5]}`,
      appliedDate: new Date(Date.now() - index * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    }));
  };

  // Initial fetch
  useEffect(() => {
    fetchApplications(pagination.current, pagination.pageSize, filters);
  }, []);

  // Handle page change
  const handlePageChange = (page: number, pageSize?: number): void => {
    const newPageSize = pageSize || pagination.pageSize;
    fetchApplications(page, newPageSize, filters);
  };

  // Handle filter changes
  const handleFilterChange = (): void => {
    // Reset to first page when filters change
    fetchApplications(1, pagination.pageSize, filters);
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
      <div className="flex w-full justify-center ">
        <div className="flex w-[70%] flex-col items-center">
          <div className="my-4 flex h-[64px] w-[96%] items-center justify-between rounded-[16px] bg-white px-4">
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
          <div className="flex w-[96%] justify-between rounded-[16px] bg-white px-4 py-4 mb-4">
            {/* <div className="my-2 flex items-center"><p className="font-bold text-[20px]">My Application</p>
          </div>
          <div className="w-[80%] flex gap-2 bg-[#F7F7F7] items-center pl-4 rounded-[16px] py-2">
              <p className="font-bold">Filter By:</p>
              <div className="border border-[#E6E6E6] py-[9px] px-[42px] bg-white rounded-[10px]">Pending</div>
              <div className="border border-[#E6E6E6] py-[9px] px-[42px] bg-white rounded-[10px]">Accepted</div>
              <div className="border border-[#E6E6E6] py-[9px] px-[42px] bg-white rounded-[10px]">Rejected</div>
              <div className="border border-[#E6E6E6] py-[9px] px-[42px] bg-white rounded-[10px]">Shortlisted</div>
            </div>
            <div>

            </div> */}

            <div className="w-full">
              <h2>Job Applications</h2>

              {/* Filters */}
              <div className="filters-container">
                <Space style={{ marginBottom: 16 }}>
                  <Select
                    placeholder="Filter by Status"
                    style={{ width: 150 }}
                    allowClear
                    onChange={(value: ApplicationStatus | undefined) => {
                      setFilters({ ...filters, status: value });
                    }}
                  >
                    {Object.values(ApplicationStatus).map((status) => (
                      <Option key={status} value={status}>
                        {status}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    placeholder="Filter by Position"
                    style={{ width: 150 }}
                    allowClear
                    onChange={(value: string | undefined) => {
                      setFilters({ ...filters, position: value });
                    }}
                  >
                    {["Junior", "Mid-level", "Senior", "Lead", "Principal"].map(
                      (pos) => (
                        <Option key={pos} value={pos}>
                          {pos}
                        </Option>
                      ),
                    )}
                  </Select>

                  <Input
                    placeholder="Search job title or location"
                    style={{ width: 220 }}
                    allowClear
                    onChange={(e) =>
                      setFilters({ ...filters, searchText: e.target.value })
                    }
                  />

                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleFilterChange}
                  >
                    Search
                  </Button>
                </Space>
              </div>

              {/* Applications list */}
              {loading ? (
                <div
                  className="loading-container"
                  style={{ textAlign: "center", padding: "40px 0" }}
                >
                  <Spin size="large" />
                </div>
              ) : (
                <div className="flex w-full flex-col">
                  {applications.length > 0 ? (
                    applications.map((app: Application) => (
                      <div key={app.id} className="my-2 flex w-full">
                        <div className="flex h-[63px] w-full items-center rounded-[16px] bg-[#F7F7F7] px-2">
                          <div className="flex w-[300px] items-center gap-2">
                            <div className="h-[46px] w-[51px] rounded-[10px] bg-[#D9D9D9]"></div>
                            <div>
                              <p className="font-bold">{app.jobTitle}</p>
                              <p className="text-[13px] text-[#7F7F7F] font-bold">
                                {app.location}
                              </p>
                            </div>
                          </div>
                          <div className="flex w-[80px] justify-center text-[13px]">
                            {formatDate(app.appliedDate)}
                          </div>
                          <div className="flex w-[180px]  justify-center text-[13px]">
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
                          <div className="flex w-[41px] h-[41px] rounded-full bg-[#6B5AED4F] ml-2">
                          </div>
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

             <div className="w-full flex justify-center">
               {/* Pagination */}
               <Pagination
                current={pagination.current}
                total={pagination.total}
                pageSize={pagination.pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                disabled={loading}
                className="pagination-controls self-center"
              />
             </div>
            </div>
          </div>
        </div>
        <div className="mx-2 my-4 flex w-[30%] flex-col items-center justify-center">
          <div className="flex w-full items-center">
            <div className="flex w-full">
              <ApplicantSchedules />
            </div>
          </div>
          <h1 className="mt-6 text-2xl font-bold">My Applications</h1>
          <p className="text-gray-600 mb-4">
            You have not applied for any jobs yet.
          </p>
          <p className="text-gray-600">
            Start applying for jobs to see them here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
