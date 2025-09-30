import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Check,
  Clock,
  DollarSign,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  Mail,
  MapPin,
  MoreVertical,
  Pause,
  Phone,
  Play,
  Search,
  Star,
  StopCircle,
  Trash2, TrendingUp,
  UserCheck,
  Users,
  X
} from "lucide-react";

import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import { employerNavBarItemMap, employerNavItems, employerNavItemsMobile } from "../../utils/constants.ts";
import { useFetchJobApplications, useFetchMyJobs, useSearchJobs } from "../../hooks/useJobQuery.ts";
import {
  ApplicationResponse,
  AwardResponseDto,
  EducationResponseDto,
  ExperienceResponseDto,
  JobPostResponse,
  JobStatus,
  SkillsResponseDto
} from "../../utils/types";
import useModalStore from "../../store/modalStateStores.ts";
import EmployerJobMultistepForm from "../employer/EmployerJobMultistepForm.tsx";
import moment from "moment";
import { updateApplicationStatus, updateJob, updateJobStatus } from "../../services/api";
import { ApplicationStatus, EmploymentType } from "../../utils/enums.ts";
import ConfirmationDialog from "../../components/ui/Prompts.tsx";
import MatchDetailsModal from "../../components/ui/MatchDetailsModal.tsx";

type Section = "open" | "draft";
type ViewMode = "jobs" | "applications" | "jobDetail";
type JobEditModalProps = {
  job: JobPostResponse;
  isOpen: boolean;
  onClose: () => void;
  onSave:  (updatedJob: Partial<JobPostResponse>) => Promise<void>;
};
// Job Edit Modal Component
const JobEditModal: React.FC<JobEditModalProps> = ({ job, isOpen, onClose, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<JobPostResponse>>({
    title: '',
    description: '',
    requirements: '',
    responsibility: '',
    location: '',
    employmentType: EmploymentType.REMOTE,
    salaryRange: {
      minimumAmount: 0,
      maximumAmount: 0,
      currency: '$',
      frequency: 'per month'
    }
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        requirements: job.requirements || '',
        responsibility: job.responsibility || '',
        location: job.location || '',
        employmentType: job.employmentType || '',
        salaryRange: {
          minimumAmount: job.salaryRange?.minimumAmount || 0,
          maximumAmount: job.salaryRange?.maximumAmount || 0,
          currency: job.salaryRange?.currency || 'USD',
          frequency: job.salaryRange?.frequency || 'per month'
        }
      });
    }
  }, [job]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to update job:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string|number) => {
    if (field.startsWith('salaryRange.')) {
      const salaryField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          [salaryField]: value
        }
      } as Partial<JobPostResponse>));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Job Post</h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter job title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
              <select
                value={formData.employmentType}
                onChange={(e) => handleChange('employmentType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select employment type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={formData?.salaryRange?.currency}
                  onChange={(e) => handleChange('salaryRange.currency', e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="NGN">NGN</option>
                </select>
                <input
                  type="number"
                  placeholder="Minimum amount"
                  value={formData?.salaryRange?.minimumAmount || 0}
                  onChange={(e) => handleChange('salaryRange.minimumAmount', parseInt(e.target.value) || 0)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Maximum amount"
                  value={formData?.salaryRange?.maximumAmount || 0}
                  onChange={(e) => handleChange('salaryRange.maximumAmount', parseInt(e.target.value) || 0)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Describe the job role..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements *</label>
              <textarea
                required
                rows={4}
                value={formData.requirements}
                onChange={(e) => handleChange('requirements', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="List required skills and qualifications..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
              <textarea
                rows={4}
                value={formData.responsibility}
                onChange={(e) => handleChange('responsibility', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Describe key responsibilities..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Updating...' : 'Update Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Define sorting options
const JOB_SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Latest Posted' },
  { value: 'createdAt-asc', label: 'Oldest Posted' },
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' },
  { value: 'applicantsCount-desc', label: 'Most Applicants' },
  { value: 'applicantsCount-asc', label: 'Least Applicants' }
];

const APPLICATION_SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Latest Applied' },
  { value: 'createdAt-asc', label: 'Oldest Applied' },
  { value: 'applicant.firstName-asc', label: 'Name A-Z' },
  { value: 'applicant.firstName-desc', label: 'Name Z-A' },
  { value: 'cv.yearsOfExperience-desc', label: 'Most Experience' },
  { value: 'cv.yearsOfExperience-asc', label: 'Least Experience' },
  { value: 'applicant.rating-desc', label: 'Highest Rated' },
  { value: 'applicant.rating-asc', label: 'Lowest Rated' }
];

const applicationStatuses: Record<string, ApplicationStatus> = {
  all: ApplicationStatus.ALL,
  applied: ApplicationStatus.PENDING,
  shortlisted: ApplicationStatus.SHORTLISTED,
  interviewed: ApplicationStatus.INTERVIEWED,
  hired: ApplicationStatus.HIRED,
  rejected: ApplicationStatus.REJECTED
}

const ManageJobsAndApplicants: React.FC = () => {
  // Core state
  const [viewMode, setViewMode] = useState<ViewMode>("jobs");
  const [activeSection, setActiveSection] = useState<Section>("open");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<JobPostResponse | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPostResponse | null>(null);

  // Application filters and search
  const [applicationSearchTerm, setApplicationSearchTerm] = useState('');
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('all');
  const [applicationSortBy, setApplicationSortBy] = useState('createdAt');
  const [applicationSortOrder, setApplicationSortOrder] = useState<'asc' | 'desc'>('desc');

  // Job filters and search
  const [jobSortBy, setJobSortBy] = useState('createdAt');
  const [jobSortOrder, setJobSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [jobPagination, setJobPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [applicationPagination, setApplicationPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Modal states
  const [selectedApplication, setSelectedApplication] = useState<ApplicationResponse | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [showJobActionsDropdown, setShowJobActionsDropdown] = useState<number | null>(null);
  const { openModal, isModalOpen } = useModalStore();

  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedMatchApplicant, setSelectedMatchApplicant] = useState<{
    id: number;
    jobId: number;
    name: string;
  } | null>(null);

  const [openPromptModals, setOpenPromptModals] = useState<{
    deleteJob: boolean;
    closeJob: boolean;
    pauseJob: boolean;
    resumeJob: boolean;
    job: JobPostResponse | null;
  }>({
    deleteJob: false,
    closeJob: false,
    pauseJob: false,
    resumeJob: false,
    job: null,
  });

  // Check URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');
    const mode = urlParams.get('mode');

    if (jobId) {
      setSelectedJobId(parseInt(jobId));
      if (mode === 'view') {
        setViewMode('jobDetail');
      } else if (mode === 'applications') {
        setViewMode('applications');
      }
    }
  }, []);

  // Debounce hook
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const viewMatchDetails = useCallback((application: ApplicationResponse) => {
    setShowProfileModal(false);
    setShowCVModal(false);
    setSelectedApplication(null);
    setSelectedMatchApplicant({
      id: application.applicant.id,
      jobId: application.job.id,
      name: `${application.applicant.firstName} ${application.applicant.lastName}`
    });
    setShowMatchModal(true);
  }, []);

  // Then use it for search terms
  const debouncedJobSearch = useDebounce(searchKeyword, 500);
  const debouncedApplicationSearch = useDebounce(applicationSearchTerm, 500);

  const { data: jobsData, isLoading: jobsLoading, isError: jobsError, error: jobsErrorMessage, refetch: refetchJobs } = useFetchMyJobs({
    page: jobPagination.page,
    limit: jobPagination.limit,
    jobStatus: activeSection === "draft" ? JobStatus.DRAFT : JobStatus.ALL,
    sortBy: jobSortBy,
    sortOrder: jobSortOrder,
    search: debouncedJobSearch
  });

  const { data: searchJobsData, isLoading: searchLoading, isError: searchError, error: searchErrorMessage } = useSearchJobs({
    page: jobPagination.page,
    limit: jobPagination.limit,
    search: debouncedJobSearch,
    sortBy: jobSortBy,
    sortOrder: jobSortOrder,
  });

  const shouldFetchApplications = selectedJobId !== null && viewMode === 'applications';

  const { data: applicationsData, refetch: fetchJobApplications } = useFetchJobApplications(
    shouldFetchApplications ? selectedJobId : 0,
    applicationPagination.page,
    applicationPagination.limit,
    {
      search: debouncedApplicationSearch,
      status: applicationStatusFilter,
      sortBy: applicationSortBy,
      sortOrder: applicationSortOrder
    },
    shouldFetchApplications
  );

  const currentJobsData = searchKeyword.trim() !== "" ? searchJobsData : jobsData;
  const jobs = useMemo(
    () => currentJobsData?.data || [],
    [currentJobsData?.data]
  );
  const isCurrentlyLoading = searchKeyword.trim() !== "" ? searchLoading : jobsLoading;

  // Refetch jobs when job filters change
  useEffect(() => {
    if (jobSortBy || jobSortOrder || searchKeyword || activeSection) {
      refetchJobs().then(r => r);
    }
  }, [jobSortBy, jobSortOrder, searchKeyword, activeSection, refetchJobs]);

  // Refetch applications when application filters change
  useEffect(() => {
    if (selectedJobId && (applicationSortBy || applicationSortOrder || applicationSearchTerm || applicationStatusFilter)) {
      fetchJobApplications().then(r => r);
    }
  }, [selectedJobId, applicationSortBy, applicationSortOrder, applicationSearchTerm, applicationStatusFilter, fetchJobApplications]);

  // Update pagination when data changes
  useEffect(() => {
    if (currentJobsData?.meta) {
      setJobPagination(prev => ({
        ...prev,
        total: currentJobsData?.meta?.total || 0,
        totalPages: currentJobsData?.meta?.totalPages || 0,
      }));
    }
  }, [currentJobsData]);

  useEffect(() => {
    if (applicationsData?.meta) {
      setApplicationPagination(prev => ({
        ...prev,
        total: applicationsData?.meta?.total || 0,
        totalPages: applicationsData?.meta?.totalPages || 0,
      }));
    }
  }, [applicationsData]);

  // Navigation handlers
  const handleViewJob = useCallback((job: JobPostResponse) => {
    setSelectedJob(job);
    setSelectedJobId(job.id);
    setViewMode('jobDetail');

    const url = new URL(window.location.href);
    url.searchParams.set('jobId', job.id.toString());
    url.searchParams.set('mode', 'view');
    window.history.pushState({}, '', url.toString());
  }, []);

  const handleViewApplications = useCallback(async (job: JobPostResponse) => {
    setSelectedJob(job);
    setSelectedJobId(job.id);
    setViewMode('applications');

    const url = new URL(window.location.href);
    url.searchParams.set('jobId', job.id.toString());
    url.searchParams.set('mode', 'applications');
    window.history.pushState({}, '', url.toString());

    fetchJobApplications().then(r => r);
  }, [fetchJobApplications]);

  const handleBackToJobs = useCallback(() => {
    setSelectedJob(null);
    setSelectedJobId(null);
    setViewMode('jobs');

    const url = new URL(window.location.href);
    url.searchParams.delete('jobId');
    url.searchParams.delete('mode');
    window.history.pushState({}, '', url.toString());
  }, []);

  // Load job details when jobId is available
  useEffect(() => {
    if (selectedJobId && jobs.length > 0 && !selectedJob) {
      const job = jobs.find(j => j.id === selectedJobId);
      if (job) {
        setSelectedJob(job);
        if (viewMode === 'applications') {
          fetchJobApplications().then(r => r);
        }
      }
    }
  }, [selectedJobId, jobs, selectedJob, viewMode, fetchJobApplications]);

  // Pagination handlers
  const handleJobPageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= jobPagination.totalPages) {
      setJobPagination(prev => ({ ...prev, page: newPage }));
    }
  }, [jobPagination.totalPages]);

  const handleApplicationPageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= applicationPagination.totalPages) {
      setApplicationPagination(prev => ({ ...prev, page: newPage }));
    }
  }, [applicationPagination.totalPages]);

  // Sort handlers
  const handleJobSortChange = useCallback((value: string) => {
    const [field, order] = value.split('-');
    setJobSortBy(field);
    setJobSortOrder(order as 'asc' | 'desc');
    setJobPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleApplicationSortChange = useCallback((value: string) => {
    const [field, order] = value.split('-');
    setApplicationSortBy(field);
    setApplicationSortOrder(order as 'asc' | 'desc');
    setApplicationPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Application actions
  const updateApplicantStatus = useCallback(async (applicationId: number, newStatus: string) => {
    try {
      const response = await updateApplicationStatus(applicationId, newStatus);
      if (response.statusCode === 200) {
        setSelectedApplication(prev => prev ? {
          ...prev,
          status: newStatus as ApplicationStatus
        } : null);
        fetchJobApplications().then(r => r);
      }
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  }, [fetchJobApplications]);

  const downloadResume = useCallback(async (id: number, resumeFile: string) => {
    console.log(`Downloading resume: ${resumeFile}`);
    await updateApplicantStatus(id, "cv_downloaded");
  }, [updateApplicantStatus]);

  // Job action handlers
  const handleEditJob = useCallback((job: JobPostResponse) => {
    setEditingJob(job);
    setShowEditModal(true);
  }, []);

  const handleSaveJob = useCallback(async (updatedJob: Partial<JobPostResponse>) => {
    if (!editingJob) return;

    try {
      const response = await updateJob(editingJob.id, updatedJob);
      if (response.statusCode === 200) {
        await refetchJobs();
        setShowEditModal(false);
        setEditingJob(null);
      }
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  }, [editingJob, refetchJobs]);

  const handleJobStatusUpdate = useCallback(async (job: JobPostResponse | null, status: JobStatus, reason: string) => {
    if (!job) return;

    try {
      const response = await updateJobStatus(job.id, { status, reason });
      if (response.statusCode === 200) {
        refetchJobs().then(r => r);
        setOpenPromptModals(prev => ({
          ...prev,
          pauseJob: false,
          resumeJob: false,
          closeJob: false,
          deleteJob: false
        }));
      }
    } catch (error) {
      console.error('Failed to update job status:', error);
    }
  }, [refetchJobs]);

  // Modal handlers
  const viewApplicantProfile = useCallback(async (application: ApplicationResponse) => {
    setSelectedApplication(application);
    setShowProfileModal(true);
    await updateApplicantStatus(application.id, "Viewed");
  }, [updateApplicantStatus]);

  const viewCV = useCallback((applicant: ApplicationResponse) => {
    setSelectedApplication(applicant);
    setShowCVModal(true);
  }, []);

  const closeModals = useCallback(() => {
    setShowProfileModal(false);
    setShowCVModal(false);
    setSelectedApplication(null);
  }, []);

  // Utility functions
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-purple-100 text-purple-800';
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
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowJobActionsDropdown(null);
    };

    if (showJobActionsDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showJobActionsDropdown]);

  // Job Actions Dropdown Component
  const JobActionsDropdown = React.memo(({ job }: { job: JobPostResponse }) => (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowJobActionsDropdown(showJobActionsDropdown === job.id ? null : job.id);
        }}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-gray-600" />
      </button>

      {showJobActionsDropdown === job.id && (
        <div className="absolute right-10 -top-28 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            <button
              onClick={() => {
                handleViewJob(job);
                setShowJobActionsDropdown(null);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Eye className="w-4 h-4" />
              View Job Details
            </button>

            <button
              onClick={() => {
                handleEditJob(job);
                setShowJobActionsDropdown(null);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Edit className="w-4 h-4" />
              Edit Job Post
            </button>

            {job.jobStatus === JobStatus.NEW ? (
              <button
                onClick={() => {
                  setOpenPromptModals(prev => ({ ...prev, pauseJob: true, job }));
                  setShowJobActionsDropdown(null);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Pause className="w-4 h-4" />
                Pause Recruitment
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpenPromptModals(prev => ({ ...prev, resumeJob: true, job }));
                  setShowJobActionsDropdown(null);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Play className="w-4 h-4" />
                Resume Recruitment
              </button>
            )}

            <button
              onClick={() => {
                setOpenPromptModals(prev => ({ ...prev, closeJob: true, job }));
                setShowJobActionsDropdown(null);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <StopCircle className="w-4 h-4" />
              Close Recruitment
            </button>

            <div className="border-t border-gray-200 my-1"></div>

            <button
              onClick={() => {
                setOpenPromptModals(prev => ({ ...prev, deleteJob: true, job }));
                setShowJobActionsDropdown(null);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete Job Post
            </button>
          </div>
        </div>
      )}
    </div>
  ));

  // Job Detail View Component
  const JobDetailView = React.memo(() => {
    if (!selectedJob) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleViewApplications(selectedJob)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Users className="w-4 h-4" />
                View Applications ({selectedJob.applicantsCount || 0})
              </button>
              <JobActionsDropdown job={selectedJob} />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedJob?.description || ""}}
                />

                <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Requirements</h3>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedJob?.requirements || "" }}
                />

                {selectedJob.responsibility && (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Responsibilities</h3>
                    <div
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedJob.responsibility }}
                    />
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">{selectedJob.location || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Employment Type</p>
                      <p className="text-sm text-gray-600">{selectedJob.employmentType || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Salary Range</p>
                      <p className="text-sm text-gray-600">
                        {selectedJob.salaryRange?.maximumAmount > 0 ? (
                          `${selectedJob.salaryRange.currency} ${selectedJob.salaryRange.minimumAmount} - ${selectedJob.salaryRange.maximumAmount}`
                        ) : (
                          'Not specified'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Posted</p>
                      <p className="text-sm text-gray-600">{moment(selectedJob.createdAt).format('MMM DD, YYYY')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Applications</p>
                      <p className="text-sm text-gray-600">{selectedJob.applicantsCount || 0} applicants</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedJob.jobStatus === JobStatus.NEW
                        ? 'bg-green-100 text-green-800'
                        : selectedJob.jobStatus === JobStatus.DRAFT
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedJob.jobStatus === JobStatus.PAUSED
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedJob.jobStatus === JobStatus.NEW ? 'Active' : selectedJob.jobStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  // Error handling
  if (jobsError || searchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
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
              {jobsErrorMessage?.message || searchErrorMessage?.message || "Something went wrong. Please try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Job Detail View
  if (viewMode === 'jobDetail') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
        <TopNavBar
          navItems={employerNavItems}
          navItemsMobile={employerNavItemsMobile}
          navbarItemsMap={employerNavBarItemMap}
        />
        <div className="max-w-7xl mx-auto p-4 lg:p-8 pt-24">
          <div className="flex items-center mb-8">
            <button
              onClick={handleBackToJobs}
              className="mr-4 p-2 rounded-lg hover:bg-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Job Details</h1>
              <p className="text-gray-600 mt-1">View and manage job posting</p>
            </div>
          </div>

          <JobDetailView />
        </div>
      </div>
    );
  }

  // Applications View (existing implementation with backend sorting)
  if (viewMode === 'applications') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
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
                onClick={handleBackToJobs}
                className="mr-4 p-2 rounded-lg hover:bg-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {selectedJob?.title}
                </h1>
                <p className="text-gray-600 mt-1">
                  {applicationsData?.data?.length || 0} applicant{(applicationsData?.data?.length || 0) !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleViewJob(selectedJob!)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Job Details
            </button>
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
                    value={applicationSearchTerm}
                    onChange={(e) => {
                      setApplicationSearchTerm(e.target.value);
                      setApplicationPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                {/* STATUS FILTER */}
                <select
                  value={applicationStatusFilter}
                  onChange={(e) => {
                    setApplicationStatusFilter(applicationStatuses[e.target.value]);
                    setApplicationPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>

                {/* SORT DROPDOWN */}
                <select
                  value={`${applicationSortBy}-${applicationSortOrder}`}
                  onChange={(e) => handleApplicationSortChange(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {APPLICATION_SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Match Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {applicationsData?.data?.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {application?.applicant?.firstName} {application?.applicant?.middleName} {application?.applicant?.lastName}
                        </div>
                        <div className="text-sm text-gray-500 mb-1">
                          {application?.applicant?.email}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {application?.applicant?.city}, {application?.applicant?.country}
                        </div>
                        <div className="flex gap-2 mt-2">
                          {application?.applicant?.githubProfile && (
                            <a
                              href={application.applicant.githubProfile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-800"
                              title="GitHub Profile"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {application?.applicant?.linkedInProfile && (
                            <a
                              href={application.applicant.linkedInProfile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-800"
                              title="LinkedIn Profile"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {application?.cv?.yearsOfExperience} years
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {application?.cv?.skills?.slice(0, 3)?.map((skill: Partial<SkillsResponseDto>, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                              {skill.skill}
                            </span>
                        ))}
                        {application?.cv?.skills?.length > 3 && (
                          <span
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              +{application?.cv?.skills?.length - 3}
                            </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">
                            {application?.applicant?.rating}
                          </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application?.status || "")}`}>
                          {(application?.status || "").charAt(0)?.toUpperCase() + application?.status?.slice(1)}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {moment(application?.createdAt).format("MMM DD, YYYY - h:mm A")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            viewMatchDetails(application);
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium"
                          title="View detailed match analysis"
                        >
                          <TrendingUp className="w-4 h-4" />
                          View Match
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1">
                          <button
                            onClick={() => viewApplicantProfile(application)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-all"
                            title="View Profile"
                          >
                            <Eye className="w-3 h-3" />
                            Profile
                          </button>
                          <button
                            onClick={() => viewCV(application)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-all"
                            title="View CV"
                          >
                            <Eye className="w-3 h-3" />
                            CV
                          </button>
                          <button
                            onClick={() => downloadResume(application.id, (application?.cv?.cvLink || ""))}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-all"
                            title="Download CV"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex gap-1">
                          {/* NEW: Match Details Button */}
                          <button
                            onClick={() => viewMatchDetails(application)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                            title="View Match Details"
                          >
                            <TrendingUp className="w-3 h-3" />
                            Match
                          </button>
                          <button
                            onClick={() => updateApplicantStatus(application.id, "Shortlisted")}
                            className="inline-flex items-center justify-center w-6 h-6 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                            title="Shortlist"
                          >
                            <Star className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => updateApplicantStatus(application.id, "Hired")}
                            className="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            title="Accept"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => updateApplicantStatus(application.id, "Rejected")}
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

            {/* Application Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handleApplicationPageChange(applicationPagination.page - 1)}
                  disabled={applicationPagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handleApplicationPageChange(applicationPagination.page + 1)}
                  disabled={applicationPagination.page === applicationPagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page {applicationPagination.page} of {applicationPagination.totalPages}
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handleApplicationPageChange(applicationPagination.page - 1)}
                      disabled={applicationPagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handleApplicationPageChange(applicationPagination.page + 1)}
                      disabled={applicationPagination.page === applicationPagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {(!applicationsData?.data || applicationsData.data.length === 0) && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}

          {/* Profile and CV Modals */}
          {showProfileModal && selectedApplication && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
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
                          {selectedApplication.applicant.firstName} {selectedApplication.applicant.middleName || ""} {selectedApplication.applicant.lastName}
                        </h3>
                        <div className="flex items-center gap-2 mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplication?.status || "")}`}>
                            {(selectedApplication?.status || "")?.charAt(0)?.toUpperCase() + selectedApplication?.status?.slice(1)}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star
                              className={`w-4 h-4 ${selectedApplication.applicant.rating > 0 ? "text-yellow-400" : "text-gray-400"} fill-current`} />
                            <span
                              className="text-sm font-medium text-gray-900">{selectedApplication.applicant.rating}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{selectedApplication.applicant.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{selectedApplication.applicant.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span
                              className="text-sm text-gray-600">{selectedApplication.applicant.city || ""}, {selectedApplication.applicant.country || ""}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{selectedApplication?.cv?.yearsOfExperience} years experience</span>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                          <div className="text-gray-600 text-sm leading-relaxed"
                               dangerouslySetInnerHTML={{ __html: selectedApplication?.cv?.professionalSummary || "" }}></div>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-2">Education</h4>
                          {selectedApplication?.cv?.educations?.map((education: Partial<EducationResponseDto>, index: number) => (
                            <div key={index} className="mb-4">
                              <h3
                                className="font-medium text-gray-900">{education.degree} {education.fieldOfStudy} at {education.institution}</h3>
                              <p
                                className="text-gray-600 text-sm mb-2">{education?.startDate?.toString()?.split("T")[0]} - {education?.endDate?.toString()?.split("T")[0]}</p>
                              <div className="text-gray-700 text-sm"
                                   dangerouslySetInnerHTML={{ __html: education?.description || "" }}></div>
                            </div>
                          ))}
                        </div>

                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                          <div className="space-y-4">
                            {selectedApplication?.cv?.experiences?.map((experience: Partial<ExperienceResponseDto>, index: number) => (
                              <div key={index} className="mb-4">
                                <h3
                                  className="font-medium text-gray-900">{experience.position} at {experience.company}</h3>
                                <p
                                  className="text-gray-600 text-sm mb-2">{experience?.startDate?.toString()?.split("T")[0]} - {experience?.endDate?.toString()?.split("T")[0]}</p>
                                <div className="text-gray-700 text-sm"
                                     dangerouslySetInnerHTML={{ __html: experience?.description || "" }}></div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-2">Key Achievements</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {selectedApplication?.cv?.awards?.map((achievement: Partial<AwardResponseDto>, index: number) => (
                              <li key={index} className="text-gray-700">{achievement?.title}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication?.cv?.skills?.map((skill: Partial<SkillsResponseDto>, index: number) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {skill.skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">Links</h4>
                        <div className="space-y-2">
                          {selectedApplication.applicant?.githubProfile && (
                            <a
                              href={selectedApplication.applicant.githubProfile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 text-sm"
                            >
                              <ExternalLink className="w-4 h-4" />
                              GitHub Profile
                            </a>
                          )}
                          {selectedApplication.applicant?.linkedInProfile && (
                            <a
                              href={selectedApplication.applicant.linkedInProfile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 text-sm"
                            >
                              <ExternalLink className="w-4 h-4" />
                              LinkedIn Profile
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            closeModals();
                            viewCV(selectedApplication);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View CV
                        </button>
                        <button
                          onClick={() => downloadResume(selectedApplication.id, (selectedApplication.cv?.cvLink || ""))}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Download CV
                        </button>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => updateApplicantStatus(selectedApplication.id, "shortlisted")}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                          >
                            <Star className="w-4 h-4" />
                            <span className="text-xs">Shortlist</span>
                          </button>
                          <button
                            onClick={() => updateApplicantStatus(selectedApplication.id, "hired")}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            <span className="text-xs">Accept</span>
                          </button>
                          <button
                            onClick={() => updateApplicantStatus(selectedApplication.id, "rejected")}
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

          {showCVModal && selectedApplication && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      CV
                      - {selectedApplication.applicant.firstName} {selectedApplication.applicant?.middleName || ""} {selectedApplication.applicant.lastName}
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadResume(selectedApplication.id, (selectedApplication?.cv?.cvLink || ""))}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download CV
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
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience</h3>
                          <p className="text-gray-700">{selectedApplication?.cv?.yearsOfExperience} years of professional
                            experience</p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedApplication.cv.skills?.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                              >
                                {skill.skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Current Status</label>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication?.status || "")}`}>
                              {(selectedApplication?.status || "").charAt(0)?.toUpperCase() + selectedApplication?.status?.slice(1)}
                            </span>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Applied On</label>
                            <p
                              className="text-gray-900">{moment(selectedApplication?.createdAt).format("MMM DD, YYYY - h:mm A")}</p>
                          </div>
                          <div className="pt-4 space-y-2">
                            <button
                              onClick={() => updateApplicantStatus(selectedApplication.id, "Shortlisted")}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                              <Star className="w-4 h-4" />
                              Shortlist
                            </button>
                            <button
                              onClick={() => updateApplicantStatus(selectedApplication.id, "Hired")}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              Hire
                            </button>
                            <button
                              onClick={() => updateApplicantStatus(selectedApplication.id, "Rejected")}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Match Details Modal */}
          {showMatchModal && selectedMatchApplicant && (
            <MatchDetailsModal
              isOpen={showMatchModal}
              onClose={() => {
                setShowMatchModal(false);
                setSelectedMatchApplicant(null);
              }}
              applicantId={selectedMatchApplicant.id}
              jobId={selectedMatchApplicant.jobId}
              applicantName={selectedMatchApplicant.name}
            />
          )}
        </div>
      </div>
    );
  }

  // Main Jobs List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
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
              onClick={() => openModal("post-job-modal")}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
            >
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
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {jobs.filter(job => job.jobStatus === JobStatus.NEW).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Briefcase className="w-8 h-8 text-purple-600" />
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
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                    setJobPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={activeSection}
                onChange={(e) => {
                  setActiveSection(e.target.value as Section);
                  setJobPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="open">Active Jobs</option>
                <option value="draft">Draft Jobs</option>
              </select>
              <select
                value={`${jobSortBy}-${jobSortOrder}`}
                onChange={(e) => handleJobSortChange(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {JOB_SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {jobs.length} of {jobPagination.total} jobs
            </div>
            {isCurrentlyLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading jobs...</span>
              </div>
            )}
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Job Postings</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {jobs.map((job, index) => (
              <div key={`${job.id}-${index}`} className="p-6 hover:bg-gray-50 transition-colors">
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
                            {job.salaryRange?.maximumAmount > 0 ? (
                              <span>
                                {job.salaryRange.currency} {job.salaryRange.minimumAmount} - {job.salaryRange.maximumAmount}
                              </span>
                            ) : (
                              <span>Not specified</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-purple-600 font-medium">
                            <Users className="w-4 h-4" />
                            {job.applicantsCount || 0} applicants
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            job.jobStatus === JobStatus.NEW
                              ? 'bg-green-100 text-green-800'
                              : job.jobStatus === JobStatus.DRAFT
                                ? 'bg-yellow-100 text-yellow-800'
                                : job.jobStatus === JobStatus.PAUSED
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}>
                            {job.jobStatus === JobStatus.NEW ? 'Active' : job.jobStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 lg:ml-6">
                    <button
                      onClick={() => handleViewJob(job)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Job</span>
                    </button>

                    <button
                      onClick={() => handleViewApplications(job)}
                      disabled={isCurrentlyLoading}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      {isCurrentlyLoading && selectedJobId === job.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Users className="w-4 h-4" />
                      )}
                      <span>Applications</span>
                    </button>

                    <JobActionsDropdown job={job} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {jobPagination.page} of {jobPagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleJobPageChange(jobPagination.page - 1)}
              disabled={jobPagination.page === 1 || isCurrentlyLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2"
            >
              {isCurrentlyLoading && jobPagination.page > 1 && <Loader2 className="w-4 h-4 animate-spin" />}
              Previous
            </button>
            <button
              onClick={() => handleJobPageChange(jobPagination.page + 1)}
              disabled={jobPagination.page === jobPagination.totalPages || isCurrentlyLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2"
            >
              Next
              {isCurrentlyLoading && jobPagination.page < jobPagination.totalPages && <Loader2 className="w-4 h-4 animate-spin" />}
            </button>
          </div>
        </div>

        {/* Empty States */}
        {jobs.length === 0 && searchKeyword && !isCurrentlyLoading && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )}

        {jobs.length === 0 && !searchKeyword && !isCurrentlyLoading && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 mb-6">Start by posting your first job to attract top talent.</p>
            <button
              onClick={() => openModal("post-job-modal")}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            >
              Post Your First Job
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <JobEditModal
          job={editingJob as JobPostResponse}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingJob(null);
          }}
          onSave={handleSaveJob}
        />
      )}

      {/* Modals */}
      {isModalOpen("post-job-modal") && <EmployerJobMultistepForm modalId="post-job-modal" />}


      {/* Confirmation Dialogs */}
      {openPromptModals.closeJob && (
        <ConfirmationDialog
          message="Are you sure you want to close this job"
          onConfirm={() => handleJobStatusUpdate(openPromptModals.job, JobStatus.CLOSED, "Closed by employer")}
          isOpen={openPromptModals.closeJob}
          title="Close recruitment"
          onClose={() => setOpenPromptModals(prev => ({...prev, closeJob: false}))}
          confirmationText="Are you sure you want to close this job"
          confirmText="Yes"
        />
      )}

      {openPromptModals.deleteJob && (
        <ConfirmationDialog
          message="This action cannot be undone. This will permanently delete the job and remove all associated applications."
          onConfirm={() => handleJobStatusUpdate(openPromptModals.job, JobStatus.DELETED, "Deleted by employer")}
          isOpen={openPromptModals.deleteJob}
          title="Delete Job"
          onClose={() => setOpenPromptModals(prev => ({...prev, deleteJob: false}))}
          confirmationText="delete job"
          confirmText="Delete"
          requiresTyping
          type="danger"
        />
      )}

      {openPromptModals.resumeJob && (
        <ConfirmationDialog
          message="Are you sure you want to publish this job"
          onConfirm={() => handleJobStatusUpdate(openPromptModals.job, JobStatus.NEW, "Resumed by employer")}
          isOpen={openPromptModals.resumeJob}
          title="Publish Job"
          onClose={() => setOpenPromptModals(prev => ({...prev, resumeJob: false}))}
          confirmationText="Are you sure you want to publish this job"
          confirmText="Yes"
        />
      )}

      {openPromptModals.pauseJob && (
        <ConfirmationDialog
          message="Are you sure you want to pause this job"
          onConfirm={() => handleJobStatusUpdate(openPromptModals.job, JobStatus.PAUSED, "Paused by employer")}
          isOpen={openPromptModals.pauseJob}
          title="Pause Recruitment"
          onClose={() => setOpenPromptModals(prev => ({...prev, pauseJob: false}))}
          confirmationText="Are you sure you want to pause this job"
          confirmText="Yes"
        />
      )}
    </div>
  );
};

export default ManageJobsAndApplicants;
