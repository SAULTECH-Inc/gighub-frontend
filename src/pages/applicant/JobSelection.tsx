import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  Eye,
  Download,
  Check,
  X,
  Star,
  UserCheck,
  MapPin,
  Calendar,
  DollarSign,
  Search,
  ArrowLeft,
  Mail,
  Phone,
  ExternalLink,
  Clock,
} from "lucide-react";

import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../../utils/constants.ts";
import { useFetchMyJobs, useSearchJobs } from "../../hooks/useJobQuery.ts";
import { ApplicantData, JobPostResponse, JobStatus } from "../../utils/types";
import useModalStore from "../../store/modalStateStores.ts";
import EmployerJobMultistepForm from "../employer/EmployerJobMultistepForm.tsx";

type Section = "open" | "draft";

const JobSelection: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>("open");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("appliedDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const { openModal, isModalOpen } = useModalStore();
  const itemsPerPage = 10;

  // Jobs page state
  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const [jobSortBy, setJobSortBy] = useState("posted");
  const [jobSortOrder, setJobSortOrder] = useState<"asc" | "desc">("desc");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");
  const [applicants, setApplicants] = useState<ApplicantData[]>([]);

  // Modal states
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const { data, isError, error } = useFetchMyJobs({
    page: pagination.page,
    limit: pagination.limit,
    jobStatus: activeSection === "draft" ? JobStatus.DRAFT : JobStatus.NEW,
  });

  const {
    data: SearchResponse,
    isError: searchErrorHappened,
    error: SearchError,
  } = useSearchJobs({
    page: pagination.page,
    limit: pagination.limit,
    search: searchKeyword,
  });

  const [jobs, setJobs] = useState<JobPostResponse[]>([]);

  const fetchJobApplicants = async (
    jobId: number,
    page: number = 1,
    limit: number = 10,
  ) => {};

  useEffect(() => {
    if (searchKeyword.trim() !== "") {
      if (SearchResponse) {
        setJobs(SearchResponse.data);
        setPagination((prev) => ({
          ...prev,
          total: SearchResponse.meta?.total || 0,
          totalPages: SearchResponse.meta?.totalPages || 0,
        }));
      }
    } else if (data) {
      setJobs(data.data);
      setPagination((prev) => ({
        ...prev,
        total: data.meta?.total || 0,
        totalPages: data.meta?.totalPages || 0,
      }));
    }
  }, [searchKeyword, SearchResponse, data]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const updateApplicantStatus = (applicantId: number, newStatus: string) => {
    console.log(`Updated applicant ${applicantId} to status: ${newStatus}`);
    // TODO: Implement actual API call to update applicant status
  };

  const downloadResume = (resumeFile: string) => {
    console.log(`Downloading resume: ${resumeFile}`);
    // TODO: Implement actual file download logic
  };

  const viewApplicantProfile = (applicant: any) => {
    setSelectedApplicant(applicant);
    setShowProfileModal(true);
  };

  const viewCV = (applicant: any) => {
    setSelectedApplicant(applicant);
    setShowCVModal(true);
  };

  const closeModals = () => {
    setShowProfileModal(false);
    setShowCVModal(false);
    setSelectedApplicant(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-purple-100 text-purple-800";
      case "interviewed":
        return "bg-orange-100 text-orange-800";
      case "hired":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesStatus =
      statusFilter === "all" || applicant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
      job.employmentType?.toLowerCase().includes(jobSearchTerm.toLowerCase());
    const matchesStatus =
      jobStatusFilter === "all" || job.jobStatus === jobStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let aValue: any = a[jobSortBy as keyof JobPostResponse];
    let bValue: any = b[jobSortBy as keyof JobPostResponse];

    if (jobSortBy === "createdAt") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (jobSortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    let aValue: any = a[sortBy as keyof typeof a];
    let bValue: any = b[sortBy as keyof typeof b];

    if (sortBy === "appliedDate") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const totalPages = Math.ceil(sortedApplicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = sortedApplicants.slice(startIndex, endIndex);

  const SortHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <th
      className="cursor-pointer px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{children}</span>
        {sortBy === field && (
          <span className="text-purple-600">
            {sortOrder === "asc" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </th>
  );

  if (isError || searchErrorHappened) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <TopNavBar
          navItems={employerNavItems}
          navItemsMobile={employerNavItemsMobile}
          navbarItemsMap={employerNavBarItemMap}
        />
        <div className="mt-20 flex min-h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Briefcase className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Error Loading Jobs
            </h3>
            <p className="text-gray-600">
              {error?.message ||
                SearchError?.message ||
                "Something went wrong. Please try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <TopNavBar
          navItems={employerNavItems}
          navItemsMobile={employerNavItemsMobile}
          navbarItemsMap={employerNavBarItemMap}
        />
        <div className="mx-auto max-w-7xl p-4 pt-24 lg:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between lg:flex-row lg:items-center">
            <div className="mb-4 flex items-center lg:mb-0">
              <button
                onClick={() => setSelectedJob(null)}
                className="mr-4 rounded-lg p-2 transition-colors hover:bg-white"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                  {jobs.find((job) => job.id === selectedJob)?.title ||
                    "Job Details"}
                </h1>
                <p className="mt-1 text-gray-600">
                  {sortedApplicants.length} applicant
                  {sortedApplicants.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center gap-4 lg:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or skills..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field);
                    setSortOrder(order as "asc" | "desc");
                  }}
                  className="rounded-lg border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="appliedDate-desc">Latest Applied</option>
                  <option value="appliedDate-asc">Oldest Applied</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="experience-desc">Most Experience</option>
                  <option value="experience-asc">Least Experience</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="rating-asc">Lowest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applicants Table */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <SortHeader field="name">Candidate</SortHeader>
                    <SortHeader field="experience">Experience</SortHeader>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Skills
                    </th>
                    <SortHeader field="rating">Rating</SortHeader>
                    <SortHeader field="status">Status</SortHeader>
                    <SortHeader field="appliedDate">Applied</SortHeader>
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentApplicants.map((applicant) => (
                    <tr
                      key={applicant.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="mb-1 text-sm font-medium text-gray-900">
                            {applicant.name}
                          </div>
                          <div className="mb-1 text-sm text-gray-500">
                            {applicant.email}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin className="h-3 w-3" />
                            {applicant.location}
                          </div>
                          <div className="mt-2 flex gap-2">
                            <a
                              href={applicant.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                              title="GitHub Profile"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <a
                              href={applicant.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                              title="LinkedIn Profile"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {applicant.experience} years
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex max-w-xs flex-wrap gap-1">
                          {applicant.skills
                            .slice(0, 3)
                            .map((skill: string, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                              >
                                {skill}
                              </span>
                            ))}
                          {applicant.skills.length > 3 && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                              +{applicant.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {applicant.rating}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(applicant.status)}`}
                        >
                          {applicant.status.charAt(0).toUpperCase() +
                            applicant.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {new Date(applicant.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-1">
                            <button
                              onClick={() => viewApplicantProfile(applicant)}
                              className="inline-flex items-center gap-1 rounded bg-gray-600 px-2 py-1 text-xs text-white transition-all hover:bg-gray-700"
                              title="View Profile"
                            >
                              <Eye className="h-3 w-3" />
                              Profile
                            </button>
                            <button
                              onClick={() => viewCV(applicant)}
                              className="inline-flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs text-white transition-all hover:bg-blue-700"
                              title="View CV"
                            >
                              <Eye className="h-3 w-3" />
                              CV
                            </button>
                            <button
                              onClick={() => downloadResume(applicant.resume)}
                              className="inline-flex items-center gap-1 rounded bg-green-600 px-2 py-1 text-xs text-white transition-all hover:bg-green-700"
                              title="Download CV"
                            >
                              <Download className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() =>
                                updateApplicantStatus(
                                  applicant.id,
                                  "shortlisted",
                                )
                              }
                              className="inline-flex h-6 w-6 items-center justify-center rounded bg-yellow-500 text-white transition-colors hover:bg-yellow-600"
                              title="Shortlist"
                            >
                              <Star className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() =>
                                updateApplicantStatus(applicant.id, "hired")
                              }
                              className="inline-flex h-6 w-6 items-center justify-center rounded bg-green-500 text-white transition-colors hover:bg-green-600"
                              title="Accept"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() =>
                                updateApplicantStatus(applicant.id, "rejected")
                              }
                              className="inline-flex h-6 w-6 items-center justify-center rounded bg-red-500 text-white transition-colors hover:bg-red-600"
                              title="Reject"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(endIndex, sortedApplicants.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {sortedApplicants.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber =
                        currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (pageNumber > totalPages) return null;

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                            pageNumber === currentPage
                              ? "z-10 border-blue-500 bg-blue-600 text-white"
                              : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {currentApplicants.length === 0 && (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No applicants found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}

          {/* Profile Modal */}
          {showProfileModal && selectedApplicant && (
            <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
              <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Applicant Profile
                    </h2>
                    <button
                      onClick={closeModals}
                      className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                    >
                      <X className="h-6 w-6 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                      <div className="mb-6">
                        <h3 className="mb-2 text-xl font-semibold text-gray-900">
                          {selectedApplicant.name}
                        </h3>
                        <div className="mb-4 flex items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(selectedApplicant.status)}`}
                          >
                            {selectedApplicant.status.charAt(0).toUpperCase() +
                              selectedApplicant.status.slice(1)}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {selectedApplicant.rating}
                            </span>
                          </div>
                        </div>

                        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {selectedApplicant.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {selectedApplicant.phone}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {selectedApplicant.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {selectedApplicant.experience} years experience
                            </span>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="mb-2 font-medium text-gray-900">
                            Bio
                          </h4>
                          <p className="text-sm leading-relaxed text-gray-600">
                            {selectedApplicant.bio}
                          </p>
                        </div>

                        <div className="mb-6">
                          <h4 className="mb-2 font-medium text-gray-900">
                            Education
                          </h4>
                          <p className="text-sm text-gray-600">
                            {selectedApplicant.education}
                          </p>
                        </div>

                        <div className="mb-6">
                          <h4 className="mb-2 font-medium text-gray-900">
                            Previous Companies
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedApplicant.previousCompanies?.map(
                              (company: string, index: number) => (
                                <span
                                  key={index}
                                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
                                >
                                  {company}
                                </span>
                              ),
                            )}
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="mb-2 font-medium text-gray-900">
                            Key Achievements
                          </h4>
                          <ul className="list-inside list-disc space-y-1">
                            {selectedApplicant.achievements?.map(
                              (achievement: string, index: number) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-600"
                                >
                                  {achievement}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-6">
                        <h4 className="mb-3 font-medium text-gray-900">
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplicant.skills.map(
                            (skill: string, index: number) => (
                              <span
                                key={index}
                                className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                              >
                                {skill}
                              </span>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="mb-3 font-medium text-gray-900">
                          Links
                        </h4>
                        <div className="space-y-2">
                          <a
                            href={selectedApplicant.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-4 w-4" />
                            GitHub Profile
                          </a>
                          <a
                            href={selectedApplicant.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-4 w-4" />
                            LinkedIn Profile
                          </a>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            closeModals();
                            viewCV(selectedApplicant);
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4" />
                          View CV
                        </button>
                        <button
                          onClick={() =>
                            downloadResume(selectedApplicant.resume)
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-all hover:bg-green-700"
                        >
                          <Download className="h-4 w-4" />
                          Download CV
                        </button>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() =>
                              updateApplicantStatus(
                                selectedApplicant.id,
                                "shortlisted",
                              )
                            }
                            className="flex items-center justify-center gap-1 rounded-lg bg-yellow-500 px-3 py-2 text-white transition-colors hover:bg-yellow-600"
                          >
                            <Star className="h-4 w-4" />
                            <span className="text-xs">Shortlist</span>
                          </button>
                          <button
                            onClick={() =>
                              updateApplicantStatus(
                                selectedApplicant.id,
                                "hired",
                              )
                            }
                            className="flex items-center justify-center gap-1 rounded-lg bg-green-500 px-3 py-2 text-white transition-colors hover:bg-green-600"
                          >
                            <Check className="h-4 w-4" />
                            <span className="text-xs">Accept</span>
                          </button>
                          <button
                            onClick={() =>
                              updateApplicantStatus(
                                selectedApplicant.id,
                                "rejected",
                              )
                            }
                            className="flex items-center justify-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-white transition-colors hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                            <span className="text-xs">Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CV Modal */}
          {showCVModal && selectedApplicant && (
            <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
              <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      CV Preview - {selectedApplicant.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadResume(selectedApplicant.resume)}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-all hover:bg-green-700"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                      <button
                        onClick={closeModals}
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                      >
                        <X className="h-6 w-6 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="min-h-[600px] rounded-lg bg-gray-50 p-8">
                    <div className="mx-auto max-w-2xl bg-white p-8 shadow-sm">
                      <div className="mb-8 text-center">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                          {selectedApplicant.name}
                        </h1>
                        <p className="mb-2 text-gray-600">
                          {selectedApplicant.email} | {selectedApplicant.phone}
                        </p>
                        <p className="text-gray-600">
                          {selectedApplicant.location}
                        </p>
                      </div>

                      <div className="mb-6">
                        <h2 className="mb-4 border-b border-gray-300 pb-2 text-xl font-semibold text-gray-900">
                          Professional Summary
                        </h2>
                        <p className="leading-relaxed text-gray-700">
                          {selectedApplicant.bio}
                        </p>
                      </div>

                      <div className="mb-6">
                        <h2 className="mb-4 border-b border-gray-300 pb-2 text-xl font-semibold text-gray-900">
                          Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplicant.skills.map(
                            (skill: string, index: number) => (
                              <span
                                key={index}
                                className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-800"
                              >
                                {skill}
                              </span>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h2 className="mb-4 border-b border-gray-300 pb-2 text-xl font-semibold text-gray-900">
                          Experience
                        </h2>
                        <div className="space-y-4">
                          {selectedApplicant.previousCompanies?.map(
                            (company: string, index: number) => (
                              <div key={index}>
                                <h3 className="font-medium text-gray-900">
                                  Senior Developer at {company}
                                </h3>
                                <p className="mb-2 text-sm text-gray-600">
                                  2020 - 2023
                                </p>
                                <p className="text-sm text-gray-700">
                                  Led development of key features and mentored
                                  junior developers.
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h2 className="mb-4 border-b border-gray-300 pb-2 text-xl font-semibold text-gray-900">
                          Education
                        </h2>
                        <p className="text-gray-700">
                          {selectedApplicant.education}
                        </p>
                      </div>

                      <div>
                        <h2 className="mb-4 border-b border-gray-300 pb-2 text-xl font-semibold text-gray-900">
                          Key Achievements
                        </h2>
                        <ul className="list-inside list-disc space-y-2">
                          {selectedApplicant.achievements?.map(
                            (achievement: string, index: number) => (
                              <li key={index} className="text-gray-700">
                                {achievement}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <TopNavBar
        navItems={employerNavItems}
        navItemsMobile={employerNavItemsMobile}
        navbarItemsMap={employerNavBarItemMap}
      />
      <div className="mx-auto max-w-7xl p-4 pt-24 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between lg:flex-row lg:items-center">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 lg:text-4xl">
              Job Management Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your job postings and review applicants
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <button
              onClick={() => {
                openModal("post-job-modal");
              }}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              Post New Job
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Active Jobs
                </h3>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {jobs.filter((job) => job.jobStatus === JobStatus.NEW).length}
                </p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Total Applicants
                </h3>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {jobs.reduce(
                    (total, job) => total + (job.applicantsCount || 0),
                    0,
                  )}
                </p>
              </div>
              <div className="rounded-lg bg-green-100 p-3">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Draft Jobs
                </h3>
                <p className="mt-2 text-3xl font-bold text-orange-600">
                  {
                    jobs.filter((job) => job.jobStatus === JobStatus.DRAFT)
                      .length
                  }
                </p>
              </div>
              <div className="rounded-lg bg-orange-100 p-3">
                <UserCheck className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter for Jobs */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4 lg:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, location, or type..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value as Section)}
                className="rounded-lg border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="open">Active Jobs</option>
                <option value="draft">Draft Jobs</option>
              </select>
              <select
                value={`${jobSortBy}-${jobSortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setJobSortBy(field);
                  setJobSortOrder(order as "asc" | "desc");
                }}
                className="rounded-lg border border-gray-200 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt-desc">Latest Posted</option>
                <option value="createdAt-asc">Oldest Posted</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="applicationsCount-desc">Most Applicants</option>
                <option value="applicationsCount-asc">Least Applicants</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {sortedJobs.length} of {jobs.length} jobs
          </div>
        </div>

        {/* Jobs List */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Job Postings
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {sortedJobs.map((job) => (
              <div
                key={job.id}
                className="p-6 transition-colors hover:bg-gray-50"
              >
                <div className="flex flex-col justify-between lg:flex-row lg:items-center">
                  <div className="mb-4 flex-1 lg:mb-0">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <div className="flex-1">
                        <h3 className="mb-2 text-xl font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location || "Not specified"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{job.employmentType || "Not specified"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>
                              {job.salaryRange.maximumAmount > 0 ||
                                "Not specified"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Posted{" "}
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 font-medium text-blue-600">
                            <Users className="h-4 w-4" />
                            {job.applicantsCount || 0} applicants
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                              job.jobStatus === JobStatus.NEW
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {job.jobStatus === JobStatus.NEW
                              ? "Active"
                              : "Draft"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:ml-6 lg:flex-row">
                    <button
                      onClick={() => {
                        fetchJobApplicants(job.id);
                      }}
                      className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white shadow-md transition-all hover:bg-purple-700 hover:shadow-lg"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Applicants</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination for jobs */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {sortedJobs.length === 0 && searchKeyword && (
          <div className="py-12 text-center">
            <Search className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No jobs found
            </h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )}

        {jobs.length === 0 && !searchKeyword && (
          <div className="py-12 text-center">
            <Briefcase className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No jobs posted yet
            </h3>
            <p className="mb-6 text-gray-500">
              Start by posting your first job to attract top talent.
            </p>
            <button className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-all hover:bg-blue-700">
              Post Your First Job
            </button>
          </div>
        )}
      </div>
      {isModalOpen("post-job-modal") && (
        <EmployerJobMultistepForm modalId="post-job-modal" />
      )}
    </div>
  );
};

export default JobSelection;
