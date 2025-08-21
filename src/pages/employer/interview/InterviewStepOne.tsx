import React, { useCallback, useEffect, useRef, useState } from "react";
import { Search, X, Users, Briefcase, Check } from "lucide-react";
import candidateImage from "../../../assets/images/tinyAvatar.png";
import { useScheduleInterview } from "../../../store/useScheduleInterview.ts";
import {
  ApplicantData,
  InterviewScheduleDetails,
  JobPostResponse,
} from "../../../utils/types";
import { fetchCandidates, searchForMyJobPosts } from "../../../services/api";
import CustomSelect from "../../../components/common/CustomSelect.tsx";
import { InterviewNatures } from "../../../utils/constants.ts";

// Debounce hook for search optimization
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

// Loading skeleton component
const SearchSkeleton: React.FC = () => (
  <div className="animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-4">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="mb-2 h-4 w-32 rounded bg-gray-200" />
          <div className="h-3 w-48 rounded bg-gray-200" />
        </div>
      </div>
    ))}
  </div>
);

const InterviewStepOne: React.FC = () => {
  const {
    interviewDetails,
    nextStep,
    setSelectedCandidates,
    selectedCandidates,
    selectedJob,
    setSelectedJob,
    setInterviewDetails,
  } = useScheduleInterview();

  // State management
  const [applicants, setApplicants] = useState<ApplicantData[]>([]);
  const [jobs, setJobs] = useState<JobPostResponse[]>([]);
  const [candidateSearchQuery, setCandidateSearchQuery] = useState("");
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showCandidateDropdown, setShowCandidateDropdown] = useState(false);
  const [showJobDropdown, setShowJobDropdown] = useState(false);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  // Refs
  const candidateDropdownRef = useRef<HTMLDivElement>(null);
  const jobDropdownRef = useRef<HTMLDivElement>(null);
  const candidateInputRef = useRef<HTMLInputElement>(null);
  const jobInputRef = useRef<HTMLInputElement>(null);

  // Debounced search values
  const debouncedCandidateQuery = useDebounce(candidateSearchQuery, 300);
  const debouncedJobQuery = useDebounce(jobSearchQuery, 300);

  const [pagination] = useState({
    page: 1,
    limit: 10,
  });

  // Enhanced click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (candidateDropdownRef.current && !candidateDropdownRef.current.contains(target)) {
        setShowCandidateDropdown(false);
      }

      if (jobDropdownRef.current && !jobDropdownRef.current.contains(target)) {
        setShowJobDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Enhanced candidate search with loading states
  useEffect(() => {
    const fetchApplicantsData = async () => {
      if (!debouncedCandidateQuery.trim()) {
        setApplicants([]);
        return;
      }

      setIsLoadingCandidates(true);
      try {
        const resp = await fetchCandidates(
          debouncedCandidateQuery,
          pagination.page,
          pagination.limit,
        );
        setApplicants(resp.data || []);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        setApplicants([]);
      } finally {
        setIsLoadingCandidates(false);
      }
    };

    fetchApplicantsData();
  }, [debouncedCandidateQuery, pagination.page, pagination.limit]);

  // Enhanced job search with loading states
  useEffect(() => {
    const fetchJobsData = async () => {
      if (!debouncedJobQuery.trim()) {
        setJobs([]);
        return;
      }

      setIsLoadingJobs(true);
      try {
        const resp = await searchForMyJobPosts(
          debouncedJobQuery,
          pagination.page,
          pagination.limit,
        );
        setJobs(resp?.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchJobsData();
  }, [debouncedJobQuery, pagination.page, pagination.limit]);

  // Enhanced candidate selection handler
  const handleCandidateSelection = useCallback((candidate: ApplicantData) => {
    const isSelected = selectedCandidates.some(c => c.id === candidate.id);

    const updated = isSelected
      ? selectedCandidates.filter(c => c.id !== candidate.id)
      : [...selectedCandidates, candidate];

    setSelectedCandidates(updated);

    // Update interview details with selected candidate IDs
    setInterviewDetails({
      ...interviewDetails,
      applicantId: updated.map(c => c.id),
    } as InterviewScheduleDetails);

    // Clear search and close dropdown after selection
    setCandidateSearchQuery("");
    setShowCandidateDropdown(false);

    // Clear any previous errors
    if (errors.applicantId) {
      setErrors(prev => ({ ...prev, applicantId: "" }));
    }
  }, [selectedCandidates, setSelectedCandidates, interviewDetails, setInterviewDetails, errors.applicantId]);

  // Enhanced candidate removal handler
  const handleCandidateRemoval = useCallback((candidateId: string | number) => {
    const updated = selectedCandidates.filter(c => c.id !== candidateId);
    setSelectedCandidates(updated);

    setInterviewDetails({
      ...interviewDetails,
      applicantId: updated.map(c => c.id),
    } as InterviewScheduleDetails);
  }, [selectedCandidates, setSelectedCandidates, interviewDetails, setInterviewDetails]);

  // Enhanced job selection handler
  const handleJobSelection = useCallback((job: JobPostResponse) => {
    setSelectedJob(job);
    setJobSearchQuery("");
    setShowJobDropdown(false);

    setInterviewDetails({
      ...interviewDetails,
      jobId: job.id,
      title: job.title,
    } as InterviewScheduleDetails);

    // Clear any previous errors
    if (errors.jobId) {
      setErrors(prev => ({ ...prev, jobId: "" }));
    }
  }, [setSelectedJob, interviewDetails, setInterviewDetails, errors.jobId]);

  // Enhanced validation and next step handler
  const handleNextStep = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    // Validate candidates
    if (selectedCandidates.length === 0) {
      newErrors.applicantId = "Please select at least one candidate.";
    }

    // Validate job selection
    if (!selectedJob) {
      newErrors.jobId = "Please select a job for the interview.";
    }

    // Validate interview title
    if (!interviewDetails?.title) {
      newErrors.title = "Please select an interview title.";
    }

    setErrors(newErrors);

    // Proceed only if no errors
    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  }, [selectedCandidates, selectedJob, interviewDetails?.title, nextStep]);

  // Keyboard navigation for dropdowns
  const handleKeyDown = (event: React.KeyboardEvent, type: 'candidate' | 'job') => {
    if (event.key === 'Escape') {
      if (type === 'candidate') {
        setShowCandidateDropdown(false);
        candidateInputRef.current?.blur();
      } else {
        setShowJobDropdown(false);
        jobInputRef.current?.blur();
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex h-auto min-h-[400px] w-full max-w-[900px] flex-col items-center justify-start rounded-[10px] bg-white px-4 py-6">
        <div className="flex w-full flex-col gap-6 sm:w-[95%]">

          {/* Candidates Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#6438C2]" />
              <h4 className="text-lg font-bold text-[#000000] sm:text-xl">
                Select Candidates
              </h4>
            </div>

            <p className="text-sm text-gray-600 sm:text-base">
              Choose the candidates you would like to interview. You can select multiple candidates.
            </p>

            <div className="rounded-[10px] border border-[#E6E6E6] bg-[#F7F7F7] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h5 className="font-medium text-gray-900">Candidate Search</h5>
                <span className="text-sm font-medium text-[#6438C2]">
                  {selectedCandidates.length} Selected
                </span>
              </div>

              {/* Search Input */}
              <div className="relative mb-4">
                <div className="relative">
                  <input
                    ref={candidateInputRef}
                    value={candidateSearchQuery}
                    onFocus={() => setShowCandidateDropdown(true)}
                    onChange={(e) => setCandidateSearchQuery(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'candidate')}
                    placeholder="Search by name, email, or phone number"
                    className="w-full rounded-[10px] border border-[#E6E6E6] bg-white py-3 pl-4 pr-10 text-sm transition-colors focus:border-[#6438C2] focus:outline-none focus:ring-2 focus:ring-[#6438C2]/20"
                    aria-label="Search candidates"
                  />
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>

                {/* Candidates Dropdown */}
                {showCandidateDropdown && (
                  <div
                    ref={candidateDropdownRef}
                    className="absolute top-full left-0 z-20 mt-1 w-full rounded-[10px] border border-[#E6E6E6] bg-white shadow-lg"
                    role="listbox"
                    aria-label="Candidate options"
                  >
                    {isLoadingCandidates ? (
                      <SearchSkeleton />
                    ) : applicants.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto">
                        {applicants.map((candidate) => {
                          const isSelected = selectedCandidates.some(c => c.id === candidate.id);
                          return (
                            <div
                              key={candidate.id}
                              className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-[#F7F7F7]"
                              onClick={() => handleCandidateSelection(candidate)}
                              role="option"
                              aria-selected={isSelected}
                            >
                              <div className="relative">
                                <img
                                  src={candidate.profilePicture || candidateImage}
                                  alt=""
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                                {isSelected && (
                                  <div className="absolute -bottom-1 -right-1 rounded-full bg-[#56E5A1] p-1">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {candidate.firstName} {candidate.lastName}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  {candidate.email}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : candidateSearchQuery.trim() ? (
                      <div className="p-4 text-center text-gray-500">
                        No candidates found for "{candidateSearchQuery}"
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Selected Candidates */}
              {selectedCandidates.length > 0 && (
                <div className="space-y-2">
                  <h6 className="text-sm font-medium text-gray-700">Selected Candidates:</h6>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="flex items-center gap-2 rounded-[10px] bg-[#56E5A1] px-3 py-2 text-white"
                      >
                        <img
                          src={candidate.profilePicture || candidateImage}
                          alt=""
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium">
                          {candidate.firstName} {candidate.lastName}
                        </span>
                        <button
                          onClick={() => handleCandidateRemoval(candidate.id)}
                          className="rounded-full p-1 transition-colors hover:bg-white/20"
                          aria-label={`Remove ${candidate.firstName} ${candidate.lastName}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.applicantId && (
                <p className="mt-2 text-sm text-red-500" role="alert">
                  {errors.applicantId}
                </p>
              )}
            </div>
          </section>

          {/* Job Selection Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#6438C2]" />
              <h4 className="text-lg font-bold text-[#000000] sm:text-xl">
                Select Job
              </h4>
            </div>

            <p className="text-sm text-gray-600 sm:text-base">
              Choose the job position for which you are scheduling the interview.
            </p>

            <div className="relative">
              <div className="relative">
                <input
                  ref={jobInputRef}
                  value={jobSearchQuery}
                  onFocus={() => setShowJobDropdown(true)}
                  onChange={(e) => setJobSearchQuery(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'job')}
                  placeholder="Search job by title, department, or company"
                  className="w-full rounded-[10px] border border-[#E6E6E6] bg-white py-3 pl-4 pr-10 text-sm transition-colors focus:border-[#6438C2] focus:outline-none focus:ring-2 focus:ring-[#6438C2]/20"
                  aria-label="Search jobs"
                />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              {/* Jobs Dropdown */}
              {showJobDropdown && (
                <div
                  ref={jobDropdownRef}
                  className="absolute top-full left-0 z-20 mt-1 w-full rounded-[10px] border border-[#E6E6E6] bg-white shadow-lg"
                  role="listbox"
                  aria-label="Job options"
                >
                  {isLoadingJobs ? (
                    <SearchSkeleton />
                  ) : jobs.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto">
                      {jobs.map((job) => (
                        <div
                          key={job.id}
                          className="cursor-pointer p-4 transition-colors hover:bg-[#F7F7F7]"
                          onClick={() => handleJobSelection(job)}
                          role="option"
                        >
                          <p className="font-medium text-gray-900">{job.title}</p>
                          <p className="text-sm text-gray-500">
                            {job.company} • {job.department}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : jobSearchQuery.trim() ? (
                    <div className="p-4 text-center text-gray-500">
                      No jobs found for "{jobSearchQuery}"
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {selectedJob && (
              <div className="rounded-[10px] border border-[#C1D3EC] bg-[#E8F0FE] p-4">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#6438C2]" />
                  <span className="font-medium text-[#6438C2]">Selected Job:</span>
                </div>
                <p className="mt-1 text-sm text-gray-700">
                  {selectedJob.title} @ {selectedJob.company}
                </p>
              </div>
            )}

            {errors.jobId && (
              <p className="text-sm text-red-500" role="alert">
                {errors.jobId}
              </p>
            )}
          </section>

          {/* Interview Title Section */}
          <section className="space-y-4">
            <h4 className="text-lg font-bold text-[#000000] sm:text-xl">
              Interview Title
            </h4>
            <p className="text-sm text-gray-600 sm:text-base">
              Select the type/nature of the interview you want to conduct.
            </p>

            <CustomSelect
              options={InterviewNatures}
              placeholder="Select Interview Nature"
              onChange={(option) => {
                setInterviewDetails({
                  ...interviewDetails,
                  title: option.label,
                } as InterviewScheduleDetails);

                // Clear any previous errors
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: "" }));
                }
              }}
              className="w-full rounded-[10px] border border-[#E6E6E6] bg-white px-4 py-3 text-sm transition-colors focus:border-[#6438C2]"
            />

            {errors.title && (
              <p className="text-sm text-red-500" role="alert">
                {errors.title}
              </p>
            )}
          </section>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex w-full justify-end sm:w-[95%]">
          <button
            onClick={handleNextStep}
            className="rounded-[15px] bg-[#6438C2] px-8 py-3 font-medium text-white transition-colors hover:bg-[#5329a8] focus:outline-none focus:ring-2 focus:ring-[#6438C2] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={selectedCandidates.length === 0 || !selectedJob}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewStepOne;