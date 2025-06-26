import React, { useEffect, useRef, useState } from "react";
import searchIcon from "../../../assets/icons/microscope.svg";
import removeIcon from "../../../assets/icons/tinyCancel.svg";
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

  const [applicants, setApplicants] = useState<ApplicantData[]>([]);
  const [jobs, setJobs] = useState<JobPostResponse[]>([]);
  const [candidateSearchQuery, setCandidateSearchQuery] = useState("");
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [, setErrors] = useState<{ [key: string]: string }>({});
  const [showCandidateDropdown, setShowCandidateDropdown] = useState(false);
  const [showJobDropdown, setShowJobDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [pagination] = useState({
    page: 1,
    limit: 10,
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCandidateDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchApplicantsData = async () => {
      try {
        const resp = await fetchCandidates(
          candidateSearchQuery,
          pagination.page,
          pagination.limit,
        );
        setApplicants(resp.data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    if (candidateSearchQuery.trim()) {
      fetchApplicantsData().then((r) => r);
    }
  }, [candidateSearchQuery, pagination.limit, pagination.page]);
  //search for jobs
  useEffect(() => {
    const fetchJobsData = async () => {
      try {
        return await searchForMyJobPosts(
          jobSearchQuery,
          pagination.page,
          pagination.limit,
        );
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    if (jobSearchQuery.trim()) {
      fetchJobsData()
        .then((resp) => {
          setJobs(resp?.data as JobPostResponse[]);
        })
        .catch((error) => {
          console.error("Error fetching jobs:", error);
        });
    }
  }, [jobSearchQuery, pagination.limit, pagination.page]);

  const handleNextStep = () => {
    const selected = interviewDetails?.applicantId || [];
    if (selected.length === 0) {
      setErrors({ applicantId: "Please select at least one candidate." });
      return;
    } else {
      setErrors({ applicantId: "" });
    }

    nextStep();
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex h-auto min-h-[400px] w-full max-w-[900px] flex-col items-center justify-center rounded-[10px] bg-white px-2">
        <div className="flex w-full flex-col items-center gap-2 sm:w-[95%]">
          <div className="mt-4 flex w-full flex-col gap-2">
            <h4 className="text-[13px] font-bold text-[#000000] sm:text-lg">
              Candidates
            </h4>
            <p className="text-[14px] text-[#000000] sm:text-[16px]">
              Please select the candidates you would like to interview. You can
              select multiple candidates.
            </p>
          </div>
          <div className="h-auto w-full rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#F7F7F7]">
            <div className="flex w-[95%] flex-col gap-2 p-6">
              <div className="flex w-full justify-between">
                <h5 className="text-[16px]">Select Candidate</h5>
                <h5 className="text-[16px] text-[#6438C2]">
                  {selectedCandidates.length} Candidate(s) Selected
                </h5>
              </div>

              <div className="relative w-full">
                <div className="flex w-full gap-2 rounded-[10px] border-[1px] border-[#E6E6E6] bg-white px-4">
                  <input
                    value={candidateSearchQuery}
                    onFocus={() => setShowCandidateDropdown(true)}
                    onChange={(e) => setCandidateSearchQuery(e.target.value)}
                    placeholder="Search by name, email, phone number"
                    className="w-full rounded-[10px] border-none px-4 py-2 text-[14px] focus:border-none focus:ring-0 focus:outline-none"
                  />
                  <img src={searchIcon} alt="search icon" />
                </div>

                {showCandidateDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-[50px] left-0 z-10 w-full rounded-[10px] border-[1px] border-[#E6E6E6] bg-white shadow-lg"
                  >
                    {applicants?.map((candidate, index) => {
                      const isSelected = selectedCandidates.some(
                        (c) => c.id === candidate.id,
                      );
                      return (
                        <div
                          key={index}
                          className="flex w-full cursor-pointer items-center gap-2 p-4 hover:bg-[#F7F7F7]"
                          onClick={() => {
                            const updated = isSelected
                              ? selectedCandidates.filter(
                                  (c) => c.id !== candidate.id,
                                )
                              : [...selectedCandidates, candidate];

                            setSelectedCandidates(updated);
                            setShowCandidateDropdown(false);
                          }}
                        >
                          <img
                            src={candidate.profilePicture || candidateImage}
                            alt="candidate"
                            className="h-[40px] w-[40px] rounded-full"
                          />
                          <div>
                            <p className="text-[14px]">
                              {candidate.firstName} {candidate.lastName}
                            </p>
                            <p className="text-[12px] text-[#A0A0A0]">
                              {candidate.email}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected candidate chips */}
              <div className="mt-4 flex w-full flex-wrap gap-2">
                {selectedCandidates.map((applicant, index) => (
                  <div
                    key={index}
                    className="flex h-[34px] w-[180px] flex-nowrap items-center justify-between gap-x-2 rounded-[10px] bg-[#56E5A1] px-4 py-2"
                  >
                    <img
                      className="h-[27px] w-[27px] rounded-full"
                      src={applicant.profilePicture || candidateImage}
                      alt="candidate"
                    />
                    <p className="text-[13px] text-[#FFFFFF]">
                      {applicant.firstName} {applicant.lastName}
                    </p>
                    <button
                      onClick={() => {
                        const updated = selectedCandidates.filter(
                          (c) => c.id !== applicant.id,
                        );
                        setSelectedCandidates(updated);
                      }}
                      className="ml-2 text-red-500"
                    >
                      <img
                        className="h-[9px] w-[9px]"
                        src={removeIcon}
                        alt="remove icon"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex w-full flex-col gap-2">
            <h4 className="text-[13px] font-bold text-[#000000] sm:text-lg">
              Job
            </h4>
            <p className="text-[14px] text-[#000000] sm:text-[16px]">
              Please select the job for which you are scheduling the interview.
            </p>
            <div className="relative w-full">
              <div className="flex w-full gap-2 rounded-[10px] border-[1px] border-[#E6E6E6] bg-white px-4">
                <input
                  value={jobSearchQuery}
                  onFocus={() => setShowJobDropdown(true)}
                  onChange={(e) => setJobSearchQuery(e.target.value)}
                  placeholder="Search job by title, department, or company"
                  className="w-full rounded-[10px] border-none px-4 py-2 text-[14px] focus:border-none focus:ring-0 focus:outline-none"
                />
                <img src={searchIcon} alt="search icon" />
              </div>

              {showJobDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute top-[50px] left-0 z-10 max-h-[300px] w-full overflow-y-auto rounded-[10px] border-[1px] border-[#E6E6E6] bg-white shadow-lg"
                >
                  {jobs?.map((job, index) => (
                    <div
                      key={index}
                      className="flex w-full cursor-pointer flex-col p-4 hover:bg-[#F7F7F7]"
                      onClick={() => {
                        setSelectedJob(job);
                        setShowJobDropdown(false);
                        setInterviewDetails({
                          ...interviewDetails,
                          jobId: job.id,
                          title: job.title,
                        } as InterviewScheduleDetails);
                      }}
                    >
                      <p className="text-[14px] font-medium">{job.title}</p>
                      <p className="text-[12px] text-[#A0A0A0]">
                        {job.company} • {job.department}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedJob && (
              <div className="mt-2 rounded border border-[#C1D3EC] bg-[#E8F0FE] px-4 py-2 text-sm">
                <strong>Selected Job:</strong> {selectedJob.title} @{" "}
                {selectedJob.company}
              </div>
            )}
          </div>

          <div className="mt-4 mb-20 flex w-full flex-col gap-2">
            <h4 className="text-[13px] font-bold text-[#000000] sm:text-lg">
              Interview Title
            </h4>
            <p className="text-[14px] text-[#000000] sm:text-[16px]">
              Describe the title of the interview
            </p>

            <CustomSelect
              options={InterviewNatures}
              placeholder="Select Interview title"
              onChange={(option) => {
                setInterviewDetails({
                  ...interviewDetails,
                  title: option.label,
                } as InterviewScheduleDetails);
              }}
              className="flex w-full gap-2 rounded-[10px] border-[1px] border-[#E6E6E6] bg-white px-4"
            />
          </div>
        </div>

        <div className="my-2 flex w-[96%] max-w-[900px] justify-end">
          <button
            className="w-[25%] rounded-[15px] bg-[#6438C2] py-[8px] text-white"
            onClick={handleNextStep}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewStepOne;
