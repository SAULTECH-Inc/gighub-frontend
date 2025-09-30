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
  Clock
} from 'lucide-react';

import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../../utils/constants.ts";
import { useFetchMyJobs, useSearchJobs } from "../../hooks/useJobQuery.ts";
import {ApplicantData, JobPostResponse, JobStatus } from "../../utils/types";
import useModalStore from "../../store/modalStateStores.ts";
import EmployerJobMultistepForm from "../employer/EmployerJobMultistepForm.tsx";

type Section = "open" | "draft";

const JobSelection: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>("open");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('appliedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const {openModal, isModalOpen} = useModalStore();
  const itemsPerPage = 10;

  // Jobs page state
  const [jobSearchTerm, setJobSearchTerm] = useState('');
  const [jobSortBy, setJobSortBy] = useState('posted');
  const [jobSortOrder, setJobSortOrder] = useState<'asc' | 'desc'>('desc');
  const [jobStatusFilter, setJobStatusFilter] = useState('all');
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

  const fetchJobApplicants = async(jobId: number, page: number=1,limit: number=10)=>{

  }

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
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800';
      case 'interviewed':
        return 'bg-orange-100 text-orange-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
      job.employmentType?.toLowerCase().includes(jobSearchTerm.toLowerCase());
    const matchesStatus = jobStatusFilter === 'all' || job.jobStatus === jobStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let aValue: any = a[jobSortBy as keyof JobPostResponse];
    let bValue: any = b[jobSortBy as keyof JobPostResponse];

    if (jobSortBy === 'createdAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (jobSortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    let aValue: any = a[sortBy as keyof typeof a];
    let bValue: any = b[sortBy as keyof typeof b];

    if (sortBy === 'appliedDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const totalPages = Math.ceil(sortedApplicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = sortedApplicants.slice(startIndex, endIndex);

  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <th
      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{children}</span>
        {sortBy === field && (
          <span className="text-purple-600">
            {sortOrder === 'asc' ? '↑' : '↓'}
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
        <div className="flex items-center justify-center min-h-64 mt-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Jobs</h3>
            <p className="text-gray-600">
              {error?.message || SearchError?.message || "Something went wrong. Please try again."}
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
        <div className="max-w-7xl mx-auto p-4 lg:p-8 pt-24">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
            <div className="flex items-center mb-4 lg:mb-0">
              <button
                onClick={() => setSelectedJob(null)}
                className="mr-4 p-2 rounded-lg hover:bg-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {jobs.find(job => job.id === selectedJob)?.title || 'Job Details'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {sortedApplicants.length} applicant{sortedApplicants.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or skills..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <SortHeader field="name">Candidate</SortHeader>
                  <SortHeader field="experience">Experience</SortHeader>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <SortHeader field="rating">Rating</SortHeader>
                  <SortHeader field="status">Status</SortHeader>
                  <SortHeader field="appliedDate">Applied</SortHeader>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {currentApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {applicant.name}
                        </div>
                        <div className="text-sm text-gray-500 mb-1">
                          {applicant.email}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {applicant.location}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <a
                            href={applicant.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                            title="GitHub Profile"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <a
                            href={applicant.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                            title="LinkedIn Profile"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {applicant.experience} years
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {applicant.skills.slice(0, 3).map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                              {skill}
                            </span>
                        ))}
                        {applicant.skills.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              +{applicant.skills.length - 3}
                            </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">
                            {applicant.rating}
                          </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
                          {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(applicant.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1">
                          <button
                            onClick={() => viewApplicantProfile(applicant)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-all"
                            title="View Profile"
                          >
                            <Eye className="w-3 h-3" />
                            Profile
                          </button>
                          <button
                            onClick={() => viewCV(applicant)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                            title="View CV"
                          >
                            <Eye className="w-3 h-3" />
                            CV
                          </button>
                          <button
                            onClick={() => downloadResume(applicant.resume)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-all"
                            title="Download CV"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateApplicantStatus(applicant.id, 'shortlisted')}
                            className="inline-flex items-center justify-center w-6 h-6 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                            title="Shortlist"
                          >
                            <Star className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => updateApplicantStatus(applicant.id, 'hired')}
                            className="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            title="Accept"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => updateApplicantStatus(applicant.id, 'rejected')}
                            className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            title="Reject"
                          >
                            <X className="w-3 h-3" />
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
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(endIndex, sortedApplicants.length)}</span> of{' '}
                    <span className="font-medium">{sortedApplicants.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (pageNumber > totalPages) return null;

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNumber === currentPage
                              ? 'z-10 bg-blue-600 border-blue-500 text-white'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {currentApplicants.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}

          {/* Profile Modal */}
          {showProfileModal && selectedApplicant && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Applicant Profile</h2>
                    <button
                      onClick={closeModals}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {selectedApplicant.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplicant.status)}`}>
                            {selectedApplicant.status.charAt(0).toUpperCase() + selectedApplicant.status.slice(1)}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-900">{selectedApplicant.rating}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{selectedApplicant.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{selectedApplicant.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{selectedApplicant.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{selectedApplicant.experience} years experience</span>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{selectedApplicant.bio}</p>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-2">Education</h4>
                          <p className="text-gray-600 text-sm">{selectedApplicant.education}</p>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-2">Previous Companies</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedApplicant.previousCompanies?.map((company: string, index: number) => (
                              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                {company}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-2">Key Achievements</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {selectedApplicant.achievements?.map((achievement: string, index: number) => (
                              <li key={index} className="text-gray-600 text-sm">{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplicant.skills.map((skill: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">Links</h4>
                        <div className="space-y-2">
                          <a
                            href={selectedApplicant.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            GitHub Profile
                          </a>
                          <a
                            href={selectedApplicant.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
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
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View CV
                        </button>
                        <button
                          onClick={() => downloadResume(selectedApplicant.resume)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Download CV
                        </button>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => updateApplicantStatus(selectedApplicant.id, 'shortlisted')}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                          >
                            <Star className="w-4 h-4" />
                            <span className="text-xs">Shortlist</span>
                          </button>
                          <button
                            onClick={() => updateApplicantStatus(selectedApplicant.id, 'hired')}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            <span className="text-xs">Accept</span>
                          </button>
                          <button
                            onClick={() => updateApplicantStatus(selectedApplicant.id, 'rejected')}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">CV Preview - {selectedApplicant.name}</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadResume(selectedApplicant.resume)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={closeModals}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-6 h-6 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="bg-gray-50 min-h-[600px] rounded-lg p-8">
                    <div className="max-w-2xl mx-auto bg-white p-8 shadow-sm">
                      <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedApplicant.name}</h1>
                        <p className="text-gray-600 mb-2">{selectedApplicant.email} | {selectedApplicant.phone}</p>
                        <p className="text-gray-600">{selectedApplicant.location}</p>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-300 pb-2 mb-4">Professional Summary</h2>
                        <p className="text-gray-700 leading-relaxed">{selectedApplicant.bio}</p>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-300 pb-2 mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplicant.skills.map((skill: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-300 pb-2 mb-4">Experience</h2>
                        <div className="space-y-4">
                          {selectedApplicant.previousCompanies?.map((company: string, index: number) => (
                            <div key={index}>
                              <h3 className="font-medium text-gray-900">Senior Developer at {company}</h3>
                              <p className="text-gray-600 text-sm mb-2">2020 - 2023</p>
                              <p className="text-gray-700 text-sm">Led development of key features and mentored junior developers.</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-300 pb-2 mb-4">Education</h2>
                        <p className="text-gray-700">{selectedApplicant.education}</p>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-300 pb-2 mb-4">Key Achievements</h2>
                        <ul className="list-disc list-inside space-y-2">
                          {selectedApplicant.achievements?.map((achievement: string, index: number) => (
                            <li key={index} className="text-gray-700">{achievement}</li>
                          ))}
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
      <div className="max-w-7xl mx-auto p-4 lg:p-8 pt-24">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Job Management Dashboard
            </h1>
            <p className="text-gray-600">Manage your job postings and review applicants</p>
          </div>
          <div className="mt-4 lg:mt-0">
            <button
              onClick={()=>{
                openModal("post-job-modal");
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
              Post New Job
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Jobs</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {jobs.filter(job => job.jobStatus === JobStatus.NEW).length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Applicants</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {jobs.reduce((total, job) => total + (job.applicantsCount || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Draft Jobs</h3>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {jobs.filter(job => job.jobStatus === JobStatus.DRAFT).length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <UserCheck className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter for Jobs */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs by title, location, or type..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value as Section)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="open">Active Jobs</option>
                <option value="draft">Draft Jobs</option>
              </select>
              <select
                value={`${jobSortBy}-${jobSortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setJobSortBy(field);
                  setJobSortOrder(order as 'asc' | 'desc');
                }}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Job Postings</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {sortedJobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{job.employmentType || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salaryRange.maximumAmount > 0 || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-blue-600 font-medium">
                            <Users className="w-4 h-4" />
                            {job.applicantsCount || 0} applicants
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            job.jobStatus === JobStatus.NEW
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {job.jobStatus === JobStatus.NEW ? 'Active' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-3 lg:ml-6">
                    <button
                      onClick={() => {
                        fetchJobApplicants(job.id);
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
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
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>

        {sortedJobs.length === 0 && searchKeyword && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )}

        {jobs.length === 0 && !searchKeyword && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 mb-6">Start by posting your first job to attract top talent.</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
              Post Your First Job
            </button>
          </div>
        )}
      </div>
      {
        isModalOpen("post-job-modal") && <EmployerJobMultistepForm modalId="post-job-modal"/>
      }
    </div>
  );
};

export default JobSelection;