import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import SearchIcon from "../../components/common/SearchIcon.tsx";
import {
  FilterIcon,
  EmailIcon,
  Teams,
  Calendar,
  Work,
} from "../../assets/icons.ts";
import {
  Person7,
  Referrer1,
  Referrer2,
  Referrer3,
} from "../../assets/images.ts";
import { FaCheck } from "react-icons/fa";
import { FC, useEffect, useState } from "react";
import ManageApplicantModal from "../../components/ui/ManageApplicantModal.tsx";
import MatchDetailsModal from "../../components/ui/MatchDetailsModal.tsx";
import {
  employerNavBarItemMap,
} from "../../utils/constants.ts";
import {
  ApplicantData,
  ApplicationResponse,
  NetworkDetails
} from "../../utils/types";
import {
  fetchMyJobsApplications,
  setViewedApplication,
} from "../../services/api";
import moment from "moment";
import { Link } from "react-router-dom";
import { useApplicationView } from "../../store/useApplicationView..ts";
import InterviewScheduleMultiStepForm from "./interview/InterviewScheduleMultiStepForm.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import InterviewScheduleSuccessModal from "../../components/ui/InterviewScheduleSuccessModal.tsx";
import { useScheduleInterview } from "../../store/useScheduleInterview.ts";
import { useChatStore } from "../../store/useChatStore.ts";
import { ApplicationStatus } from "../../utils/enums.ts";
import { useFetchJobMatchResult } from "../../hooks/useFetchJobMatchResult.tsx";
import { X } from "lucide-react";
import { FileActionButtons } from "../../components/ui/FileActionButtons.tsx";



// Match percentage component for applicant list
const MatchPercentage: FC<{
  applicantId: number;
  jobId: number;
  compact?: boolean;
}> = ({ applicantId, jobId, compact = false }) => {
  const { data: matchResponse, isLoading } = useFetchJobMatchResult(
    applicantId,
    jobId,
  );

  const getMatchScore = () => {
    if (!matchResponse?.data?.breakdown) return 0;

    const aiScore =
      matchResponse.data.breakdown.ai_enhancements?.ai_decision?.adjusted_score;
    if (aiScore) return aiScore;

    // Fallback: calculate from component scores
    const scores = matchResponse.data.breakdown.component_scores;
    const weights = matchResponse.data.breakdown.weights_used;

    if (scores && weights) {
      return (
        (scores.skills * weights.skills +
          scores.experience * weights.experience +
          scores.title_intelligence * weights.title_intelligence +
          scores.location * weights.location +
          scores.education * weights.education +
          scores.requirements_analysis * weights.requirements_analysis +
          scores.job_preferences * weights.job_preferences +
          scores.semantic * weights.semantic +
          scores.certifications * weights.certifications) *
        100
      );
    }

    return 0;
  };

  const score = getMatchScore();
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <div
        className={`${compact ? "h-4 w-8" : "h-6 w-12"} animate-pulse rounded bg-gray-200`}
      />
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <div className={`h-2 w-2 rounded-full ${getScoreColor(score)}`} />
        <span className={`text-xs font-medium ${getScoreTextColor(score)}`}>
          {score.toFixed(0)}%
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <div className={`h-3 w-3 rounded-full ${getScoreColor(score)}`} />
        <span className={`text-sm font-medium ${getScoreTextColor(score)}`}>
          {score.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

// Match summary component for the main profile
const MatchSummary: FC<{ applicantId: number; jobId: number }> = ({
  applicantId,
  jobId,
}) => {
  const { data: matchResponse, isLoading } = useFetchJobMatchResult(
    applicantId,
    jobId,
  );

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="animate-pulse">
          <div className="mb-2 h-4 w-1/4 rounded bg-gray-200"></div>
          <div className="mb-3 h-8 w-1/2 rounded bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-gray-200"></div>
            <div className="h-3 w-3/4 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!matchResponse?.data?.breakdown) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-2 text-sm font-medium text-gray-500">
          Job Match Analysis
        </h3>
        <p className="text-sm text-gray-400">Match data not available</p>
      </div>
    );
  }

  const breakdown = matchResponse.data.breakdown;
  const getOverallScore = () => {
    const aiScore = breakdown.ai_enhancements?.ai_decision?.adjusted_score;
    if (aiScore) return aiScore;

    const scores = breakdown.component_scores;
    const weights = breakdown.weights_used;

    return (
      (scores.skills * weights.skills +
        scores.experience * weights.experience +
        scores.title_intelligence * weights.title_intelligence +
        scores.location * weights.location +
        scores.education * weights.education +
        scores.requirements_analysis * weights.requirements_analysis +
        scores.job_preferences * weights.job_preferences +
        scores.semantic * weights.semantic +
        scores.certifications * weights.certifications) *
      100
    );
  };

  const overallScore = getOverallScore();
  const topSkills =
    breakdown.detailed_analysis?.skills?.matched_skills?.slice(0, 3) || [];
  const missingSkills =
    breakdown.detailed_analysis?.skills?.missing_skills?.slice(0, 2) || [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (score >= 40) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className={`rounded-lg border p-4 ${getScoreColor(overallScore)}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">Job Match Analysis</h3>
        <span className="text-xl font-bold">{overallScore.toFixed(1)}%</span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <span className="font-medium">Key Matches:</span>
          <div className="mt-1 space-y-1">
            <div>
              Skills: {Math.round(breakdown.component_scores.skills * 100)}%
            </div>
            <div>
              Experience:{" "}
              {Math.round(breakdown.component_scores.experience * 100)}%
            </div>
          </div>
        </div>
        <div>
          <span className="font-medium">Requirements:</span>
          <div className="mt-1 space-y-1">
            <div>
              Education:{" "}
              {Math.round(breakdown.component_scores.education * 100)}%
            </div>
            <div>
              Location: {Math.round(breakdown.component_scores.location * 100)}%
            </div>
          </div>
        </div>
      </div>

      {topSkills.length > 0 && (
        <div className="mt-3">
          <span className="text-xs font-medium">Top Skills Match:</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {topSkills.map((skill, index) => (
              <span
                key={index}
                className="rounded bg-green-100 px-2 py-1 text-xs text-green-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {missingSkills.length > 0 && (
        <div className="mt-2">
          <span className="text-xs font-medium">Missing Skills:</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="rounded bg-red-100 px-2 py-1 text-xs text-red-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {breakdown.ai_enhancements?.ai_available && (
        <div className="mt-3 border-t pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">AI Recommendation:</span>
            <span
              className={`rounded px-2 py-1 ${
                breakdown.ai_enhancements.ai_decision.decision === "AUTO_ACCEPT"
                  ? "bg-green-100 text-green-800"
                  : breakdown.ai_enhancements.ai_decision.decision ===
                      "AUTO_REJECT"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {breakdown.ai_enhancements.ai_decision.decision.replace("_", " ")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const ManageApplicant: FC = () => {
  const { openModal } = useModalStore();
  const { setRecipient, setRecipientDetails, setIsClosed, messages } =
    useChatStore();
  const {
    selectedApplication,
    setSelectedApplication,
    applicationStatus,
    setApplicationStatus,
  } = useApplicationView();
  const { interviewId, setSelectedCandidates, selectedCandidates } =
    useScheduleInterview();
  const [applications, setApplications] = useState<ApplicationResponse[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [page] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // State for match details modal
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [selectedMatchApplicant, setSelectedMatchApplicant] = useState<{
    applicantId: number;
    jobId: number;
    applicantName: string;
  } | null>(null);

  // State for additional functionality
  const [isJobClosed, setIsJobClosed] = useState(false);
  const [isJobListed, setIsJobListed] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showReferrerModal, setShowReferrerModal] = useState(false);
  const [filters, setFilters] = useState({
    matchScore: "",
    experience: "",
    skills: "",
    location: "",
    applicationDate: "",
  });

  // Filter menu component
  const FilterMenu: FC = () => (
    <div className="absolute top-12 right-0 z-50 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Filter Applications
        </h3>
        <button
          onClick={() => setShowFilterMenu(false)}
          className="rounded p-1 hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Match Score Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Match Score
          </label>
          <select
            value={filters.matchScore}
            onChange={(e) => handleFilterChange("matchScore", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="">All Scores</option>
            <option value="80+">Excellent (80%+)</option>
            <option value="60-79">Good (60-79%)</option>
            <option value="40-59">Fair (40-59%)</option>
            <option value="0-39">Poor (Below 40%)</option>
          </select>
        </div>

        {/* Experience Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Experience Level
          </label>
          <select
            value={filters.experience}
            onChange={(e) => handleFilterChange("experience", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="">All Levels</option>
            <option value="entry">Entry Level (0-2 years)</option>
            <option value="mid">Mid Level (3-5 years)</option>
            <option value="senior">Senior Level (6-10 years)</option>
            <option value="expert">Expert Level (10+ years)</option>
          </select>
        </div>

        {/* Application Date Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Application Date
          </label>
          <select
            value={filters.applicationDate}
            onChange={(e) =>
              handleFilterChange("applicationDate", e.target.value)
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Location Preference
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="">All Locations</option>
            <option value="remote">Remote Only</option>
            <option value="onsite">On-site Only</option>
            <option value="hybrid">Hybrid</option>
            <option value="local">Local Candidates</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={clearFilters}
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
        >
          Clear All
        </button>
        <button
          onClick={() => setShowFilterMenu(false)}
          className="flex-1 rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  // Referrer modal component
  const ReferrerModal: FC = () => {
    const referrers = [
      {
        id: 1,
        name: "John Smith",
        image: Referrer1,
        role: "Senior Developer",
        company: "Tech Corp",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        image: Referrer2,
        role: "Product Manager",
        company: "StartupXYZ",
      },
      {
        id: 3,
        name: "Mike Chen",
        image: Referrer3,
        role: "Designer",
        company: "Creative Agency",
      },
      {
        id: 4,
        name: "Emma Wilson",
        image: Referrer1,
        role: "HR Director",
        company: "Big Tech",
      },
      {
        id: 5,
        name: "David Brown",
        image: Referrer2,
        role: "Engineering Manager",
        company: "Scale Inc",
      },
      {
        id: 6,
        name: "Lisa Garcia",
        image: Referrer3,
        role: "Recruiter",
        company: "Talent Solutions",
      },
      {
        id: 7,
        name: "Alex Taylor",
        image: Referrer1,
        role: "Team Lead",
        company: "Innovation Labs",
      },
      {
        id: 8,
        name: "Rachel Davis",
        image: Referrer2,
        role: "VP Engineering",
        company: "Growth Co",
      },
      {
        id: 9,
        name: "Tom Anderson",
        image: Referrer3,
        role: "CTO",
        company: "Future Tech",
      },
      {
        id: 10,
        name: "Maria Rodriguez",
        image: Referrer1,
        role: "Senior Recruiter",
        company: "Elite Hiring",
      },
    ];

    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
        style={{ zIndex: 99998 }}
      >
        <div className="max-h-[80vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Referrers</h2>
                <p className="mt-1 text-gray-600">
                  People who referred this candidate
                </p>
              </div>
              <button
                onClick={() => setShowReferrerModal(false)}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {referrers.map((referrer) => (
                <div
                  key={referrer.id}
                  className="rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <img
                      src={referrer.image}
                      alt={referrer.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {referrer.name}
                      </h3>
                      <p className="text-sm text-gray-600">{referrer.role}</p>
                    </div>
                  </div>
                  <div className="mb-3 text-sm text-gray-500">
                    <p className="font-medium">{referrer.company}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 rounded bg-purple-100 px-3 py-1 text-xs text-purple-700 transition-colors hover:bg-purple-200">
                      View Profile
                    </button>
                    <button className="flex-1 rounded bg-gray-200 px-3 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-300">
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const doFetchApplications = async () => {
      return await fetchMyJobsApplications(applicationStatus, page, limit);
    };
    doFetchApplications()
      .then((response) => {
        setApplications(response.data);
        setTotalPages(response?.meta?.totalPages || 0);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  }, [page, limit, applicationStatus, totalPages]);

  const handleOpenApplicantDetails = async (
    application: ApplicationResponse,
  ) => {
    setSelectedApplication(application);
    const response = await setViewedApplication(application.id);
    if (response.statusCode === 200) {
      console.log("Application marked as viewed");
      const updatedApplications = applications?.map((app) =>
        app.id === application.id ? response.data : app,
      );
      setApplications(updatedApplications);
    } else {
      console.error("Error marking application as viewed");
    }
  };

  const handleOpenMatchDetails = (application: ApplicationResponse) => {
    setSelectedMatchApplicant({
      applicantId: application.applicant.id,
      jobId: application.job.id,
      applicantName: `${application.applicant.firstName} ${application.applicant.lastName}`,
    });
    setIsMatchModalOpen(true);
  };

  const handleCloseJob = async () => {
    try {
      setIsJobClosed(!isJobClosed);
      console.log(`Job ${isJobClosed ? "opened" : "closed"} successfully`);
    } catch (error) {
      console.error("Error toggling job status:", error);
    }
  };

  const handleListJob = async () => {
    try {
      setIsJobListed(!isJobListed);
      console.log(`Job ${isJobListed ? "unlisted" : "listed"} successfully`);
    } catch (error) {
      console.error("Error toggling job listing:", error);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      matchScore: "",
      experience: "",
      skills: "",
      location: "",
      applicationDate: "",
    });
  };

  const applyFilters = (applicationsList: ApplicationResponse[]) => {
    return applicationsList?.filter((application) => {
      const nameMatch =
        `${application.applicant.firstName} ${application.applicant.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      if (!nameMatch) return false;
      return true;
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F8FA]">
      <TopNavBar
        navbarItemsMap={employerNavBarItemMap}
        userType="employer"
      />

      <div className="flex w-full flex-col items-center">
        <div className="mt-5 flex w-[95%] flex-col rounded-[16px] bg-white md:flex-row md:justify-between">
          <div className="flex flex-col px-5 py-3">
            <div className="flex w-full flex-col">
              <h1 className="text-[32px] leading-[28.8px] font-bold text-[#000000]">
                {selectedApplication?.job.title || ""}
              </h1>
              <p className="text-[#8E8E8E]">
                Open Hiring / Product Designer / Applied
              </p>
            </div>
            <div className="flex gap-4 py-5">
              <button
                onClick={() => {
                  setApplicationStatus("all");
                }}
                className={`${applicationStatus === "all" ? "bg-[#6438C2] text-white" : "border border-[#E6E6E6] text-[#8E8E8E]"} rounded-[10px] px-5 py-[9px]`}
              >
                All Applied
              </button>
              <button
                onClick={() => {
                  setApplicationStatus("Interview Scheduled");
                }}
                className={`text-[#8E8E8E] ${applicationStatus === "Interview Scheduled" ? "bg-[#6438C2] text-white" : "text-[#8E8E8E]"} rounded-[10px] border border-[#E6E6E6] px-5 py-[9px]`}
              >
                Schedule Interview
              </button>
            </div>
          </div>
          <div className="hidden items-center justify-between sm:flex md:flex-col md:items-end md:py-4">
            <div className="flex items-center justify-between gap-4 p-5">
              <button
                onClick={handleCloseJob}
                className={`rounded-[10px] px-5 py-[9px] text-white transition-all duration-300 ease-out active:scale-95 ${
                  isJobClosed
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isJobClosed ? "Reopen job" : "Close job"}
              </button>
              <button
                onClick={handleListJob}
                className={`rounded-[10px] px-5 py-[9px] text-white transition-all duration-300 ease-out active:scale-95 ${
                  isJobListed
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-[#6438C2] hover:bg-[#5429a8]"
                }`}
              >
                {isJobListed ? "Unlist job" : "List job"}
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="mr-3 flex min-w-[78px] items-center gap-2 rounded-[10px] border border-[#E6E6E6] px-9 py-3 transition-colors hover:bg-gray-50"
              >
                <img src={FilterIcon} alt="FilterIcon" />
                <p className="hidden font-extrabold text-[#8E8E8E] md:block">
                  Filter
                </p>
                {(filters.matchScore ||
                  filters.experience ||
                  filters.applicationDate ||
                  filters.location) && (
                  <div className="absolute -top-2 -right-2 h-3 w-3 rounded-full bg-red-500"></div>
                )}
              </button>
              {showFilterMenu && <FilterMenu />}
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between sm:hidden">
          <div className="flex items-center justify-between gap-4 p-5">
            <button
              onClick={handleCloseJob}
              className={`rounded-[10px] px-5 py-[9px] text-[14px] text-white transition-all duration-300 ease-out active:scale-95 sm:text-base ${
                isJobClosed
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isJobClosed ? "Reopen job" : "Close job"}
            </button>
            <button
              onClick={handleListJob}
              className={`rounded-[10px] px-5 py-[9px] text-[14px] text-white transition-all duration-300 ease-out active:scale-95 sm:text-base ${
                isJobListed
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-[#6438C2] hover:bg-[#5429a8]"
              }`}
            >
              {isJobListed ? "Unlist job" : "List job"}
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="mr-3 flex min-w-[78px] items-center gap-2 rounded-[10px] border border-[#E6E6E6] px-9 py-3 transition-colors hover:bg-gray-50"
            >
              <img src={FilterIcon} alt="FilterIcon" />
              <p className="hidden font-extrabold text-[#8E8E8E] md:block">
                Filter
              </p>
              {(filters.matchScore ||
                filters.experience ||
                filters.applicationDate ||
                filters.location) && (
                <div className="absolute -top-2 -right-2 h-3 w-3 rounded-full bg-red-500"></div>
              )}
            </button>
            {showFilterMenu && <FilterMenu />}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center">
        <div className="my-5 flex w-[95%] flex-col justify-between md:flex-row">
          <div className="mdl:w-[25%] rounded-[16px] bg-white p-4">
            <div className="flex w-full flex-col gap-4">
              <p className="text-[20px] font-extrabold text-[#000000]">
                Application
              </p>
              <div className="flex w-full items-center gap-1 rounded-[10px] border border-[#E6E6E6] px-2 py-[6px]">
                <SearchIcon />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search applicant here"
                  className="placeholder-text-[11px] placeholder-text-[#8E8E8E] border-none bg-transparent focus:ring-transparent focus:outline-none"
                />
              </div>
              <div className="flex w-full items-center gap-4 md:gap-12">
                <div className="flex items-center gap-2">
                  <div className="h-[10px] w-[10px] rounded-full bg-[#FA4E09]"></div>
                  <p className="text-[13px] text-[#8E8E8E]">Viewed</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-[10px] w-[10px] rounded-full bg-[#6438C2]"></div>
                  <p className="text-[13px] text-[#8E8E8E]">Incoming message</p>
                </div>
              </div>
              {/*Applicant list*/}
              <div className="flex w-full flex-col gap-4">
                {applyFilters(applications || [])?.map((application) => {
                  return (
                    <div
                      key={application.id}
                      className={`group relative cursor-pointer ${
                        application.id === selectedApplication?.id
                          ? "bg-[#6438C2]"
                          : "bg-[#F7F8FA]"
                      } flex flex-col rounded-[10px] p-3 transition-all duration-300 ease-out hover:bg-[#6438C2] active:scale-95`}
                    >
                      {/* Main applicant info */}
                      <div
                        onClick={() => handleOpenApplicantDetails(application)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            {application.status ===
                              ApplicationStatus.VIEWED && (
                              <div className="absolute right-0 h-[10px] w-[10px] rounded-full bg-[#FA4E09]"></div>
                            )}
                            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full">
                              <img
                                className="h-full w-full rounded-full"
                                src={
                                  application.applicant.profilePicture ||
                                  Person7
                                }
                                alt="Person Profile Picture"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col items-start">
                            <p
                              className={`text-[13px] ${
                                application.id === selectedApplication?.id
                                  ? "text-white"
                                  : "text-[#000000] group-hover:text-white"
                              }`}
                            >
                              {application.applicant.firstName}{" "}
                              {application.applicant.lastName}
                            </p>
                            <p
                              className={`text-[11px] ${
                                application.id === selectedApplication?.id
                                  ? "text-white"
                                  : "text-[#8E8E8E] group-hover:text-white"
                              }`}
                            >
                              {moment(application.createdAt).format("lll")}
                            </p>
                          </div>
                        </div>

                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecipient(application?.applicant?.email || "");
                            setRecipientDetails({
                              ...application.applicant,
                            } as NetworkDetails);
                            setIsClosed(false);
                          }}
                          className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E6E6E6] shadow-sm transition-all duration-300 ${
                            application.id === selectedApplication?.id
                              ? "bg-white shadow-md"
                              : "bg-[#F7F8FA] group-hover:bg-white group-hover:shadow-md"
                          }`}
                        >
                          {/* Message Icon */}
                          <img
                            src={EmailIcon}
                            alt="Mailbox Icon"
                            className="h-5 w-5"
                          />

                          {/* Purple Notification Badge */}
                          {messages?.filter(
                            (message) =>
                              message.sender === application.applicant.email &&
                              !message.read,
                          ).length > 0 && (
                            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-purple-600"></span>
                          )}
                        </div>
                      </div>

                      {/* Match percentage row */}
                      <div className="border-opacity-20 mt-2 flex items-center justify-between border-t border-gray-200 pt-2">
                        <div className="flex items-center gap-2">
                          <MatchPercentage
                            applicantId={application.applicant.id}
                            jobId={application.job.id}
                            compact={true}
                          />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenMatchDetails(application);
                          }}
                          className={`rounded px-2 py-1 text-xs transition-all ${
                            application.id === selectedApplication?.id
                              ? "bg-opacity-20 hover:bg-opacity-30 bg-white text-white"
                              : "group-hover:bg-opacity-20 bg-gray-200 text-gray-600 group-hover:bg-white group-hover:text-white"
                          }`}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mb-5 ml-[18px] flex flex-col overflow-hidden rounded-[16px] bg-white pb-5 md:w-[75%]">
            <div className="relative h-[108px] w-full bg-gradient-to-r from-[#6438C2] to-[#D9D9D9]">
              <div className="bg-opacity-50 absolute bottom-[-40%] left-5 h-[100px] w-[100px]">
                <img
                  src={
                    selectedApplication?.applicant?.profilePicture || Person7
                  }
                  alt="Person7"
                  className="h-full w-full rounded-full"
                />
              </div>
            </div>
            <div className="mx-auto mt-[50px] flex w-[95%] flex-col lg:mt-4">
              <div className="flex flex-row flex-wrap gap-4 md:mb-[35px] md:justify-between lg:flex-col-reverse">
                <div className="flex flex-wrap justify-between gap-3 mt-14">
                  <div className="flex min-w-[247px] flex-col">
                    <div className="relative text-2xl font-extrabold text-[#000000]">
                      {selectedApplication?.applicant?.firstName}{" "}
                      {selectedApplication?.applicant?.lastName}
                      <div className="absolute top-0 left-[150px] h-[10px] w-[10px] rounded-full bg-[#FA4E09]"></div>
                    </div>
                    <p
                      className="text-[13px] text-[#8E8E8E]"
                      dangerouslySetInnerHTML={{
                        __html: selectedApplication?.cv?.headline || "",
                      }}
                    ></p>
                  </div>
                  <div className="flex gap-2 md:justify-between md:gap-[200px]">
                    <Link
                      to={selectedApplication?.cv?.videoCv || ""}
                      className="flex max-w-[200px] items-center rounded-[10px] border border-[#6438C2] px-5 text-center text-sm font-medium text-[#6438C2] md:text-[16px]"
                    >
                      Watch my video Pitch
                    </Link>
                    {applicationStatus === "all" ? (
                      <button
                        onClick={() => {
                          openModal("interview-schedule");
                          const updatedSelectedCandidates = [
                            ...selectedCandidates,
                            selectedApplication?.applicant,
                          ];
                          setSelectedCandidates(
                            updatedSelectedCandidates as ApplicantData[],
                          );
                        }}
                        className="max-w-[194px] rounded-[10px] bg-[#6438C2] px-5 py-[9px] text-sm font-bold text-white md:text-[16px]"
                      >
                        Schedule Interview
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setRecipient(
                            selectedApplication?.applicant?.email || "",
                          );
                          setRecipientDetails(
                            selectedApplication?.applicant as NetworkDetails,
                          );
                          setIsClosed(false);
                        }}
                        className="max-w-[194px] rounded-[10px] bg-[#6438C2] px-5 py-[9px] text-sm font-bold text-white md:text-[16px]"
                      >
                        Send Message
                      </button>
                    )}
                  </div>
                </div>
                {/*<div className="mb-4 flex flex-wrap items-center gap-4 rounded-[10px] bg-[#F4F7FA] px-4 py-1 md:min-w-[364px] lg:self-end">*/}
                {/*  <p className="font-extrabold text-[#000000]">Referrer</p>*/}
                {/*  <div className="flex gap-2">*/}
                {/*    <img*/}
                {/*      src={Referrer1}*/}
                {/*      alt="Referrer1"*/}
                {/*      className="h-8 w-8 cursor-pointer rounded-full transition-all hover:ring-2 hover:ring-purple-300"*/}
                {/*    />*/}
                {/*    <img*/}
                {/*      src={Referrer2}*/}
                {/*      alt="Referrer2"*/}
                {/*      className="h-8 w-8 cursor-pointer rounded-full transition-all hover:ring-2 hover:ring-purple-300"*/}
                {/*    />*/}
                {/*    <img*/}
                {/*      src={Referrer2}*/}
                {/*      alt="Referrer3"*/}
                {/*      className="h-8 w-8 cursor-pointer rounded-full transition-all hover:ring-2 hover:ring-purple-300"*/}
                {/*    />*/}
                {/*    <img*/}
                {/*      src={Referrer3}*/}
                {/*      alt="Referrer4"*/}
                {/*      className="h-8 w-8 cursor-pointer rounded-full transition-all hover:ring-2 hover:ring-purple-300"*/}
                {/*    />*/}
                {/*    <img*/}
                {/*      src={Referrer1}*/}
                {/*      alt="Referrer5"*/}
                {/*      className="h-8 w-8 cursor-pointer rounded-full transition-all hover:ring-2 hover:ring-purple-300"*/}
                {/*    />*/}
                {/*    <button*/}
                {/*      onClick={() => setShowReferrerModal(true)}*/}
                {/*      className="cursor-pointer font-extrabold text-[#6438C2] transition-colors hover:text-[#5429a8]"*/}
                {/*    >*/}
                {/*      +5*/}
                {/*    </button>*/}
                {/*    <button*/}
                {/*      onClick={() => setShowReferrerModal(true)}*/}
                {/*      className="hidden cursor-pointer font-extrabold text-[#6438C2] transition-colors hover:text-[#5429a8] md:block"*/}
                {/*    >*/}
                {/*      more*/}
                {/*    </button>*/}
                {/*  </div>*/}
                {/*</div>*/}
              </div>
              <hr className="border-[#E6E6E6]" />
              <div className="mt-4 flex flex-wrap gap-4 lg:flex-nowrap lg:justify-between">
                <div className="lg:w-[60%]">
                  <div>
                    <h2 className="text-[20px] font-medium text-[#000000]">
                      About Me
                    </h2>
                    <div
                      className="text-[13px] font-medium text-[#8E8E8E]"
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedApplication?.cv?.professionalSummary || "",
                      }}
                    ></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[20px] font-medium text-[#000000]">
                      Experiences
                    </h2>

                    {selectedApplication?.cv?.experiences?.map(
                      (experience, index) => {
                        return (
                          <div
                            key={index}
                            className="flex items-start gap-2 pl-4"
                          >
                            <div className="pt-[10px]">
                              <div className="flex h-[13px] w-[13px] flex-col items-center justify-center rounded-full bg-[#6438C2]">
                                <FaCheck className="h-[5px] w-[5px] fill-white" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="">
                                <h3 className="flex items-center text-[20px] font-medium text-[#000000]">
                                  {experience.position} - {experience.company}
                                </h3>
                                <p className="text-[13px] font-medium text-[#8E8E8E]">
                                  {moment(experience.startDate).format(
                                    "MMM YYYY",
                                  ) +
                                    " - " +
                                    (experience.endDate
                                      ? moment(experience.endDate).format(
                                          "MMM YYYY",
                                        )
                                      : "Present")}
                                </p>
                              </div>
                              <div
                                className="text-[13px] font-medium text-[#8E8E8E]"
                                dangerouslySetInnerHTML={{
                                  __html: experience.description || "",
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <h2 className="text-[20px] font-medium text-[#000000]">
                      Education
                    </h2>
                    {selectedApplication?.cv?.educations?.map(
                      (education, index) => {
                        return (
                          <div
                            key={index}
                            className="flex items-start gap-2 pl-4"
                          >
                            <div className="pt-[10px]">
                              <div className="flex h-[13px] w-[13px] flex-col items-center justify-center rounded-full bg-[#6438C2]">
                                <FaCheck className="h-[5px] w-[5px] fill-white" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="">
                                <h3 className="flex items-center text-[20px] font-medium text-[#000000]">
                                  {education.degree} - {education.institution}
                                </h3>
                                <p className="text-[13px] font-medium text-[#8E8E8E]">
                                  {moment(education.startDate).format(
                                    "MMM YYYY",
                                  ) +
                                    " - " +
                                    (education.endDate
                                      ? moment(education.endDate).format(
                                          "MMM YYYY",
                                        )
                                      : "Present")}
                                </p>
                              </div>
                              <div
                                className="text-[13px] font-medium text-[#8E8E8E]"
                                dangerouslySetInnerHTML={{
                                  __html: education.description || "",
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                  {/*  Skills*/}
                  <div className="mt-4 flex flex-col gap-2">
                    <h2 className="text-[20px] font-medium text-[#000000]">
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication?.cv?.skills?.map((skill, index) => {
                        return (
                          <button
                            key={index}
                            className="rounded-[10px] bg-[#F7F8FA] px-4 py-1 text-[13px] font-medium text-[#8E8E8E]"
                          >
                            {skill.skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/*  Certifications*/}
                  <div className="mt-4 flex flex-col gap-2">
                    <h2 className="text-[20px] font-medium text-[#000000]">
                      Certifications
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication?.cv?.certifications?.map(
                        (certification, index) => {
                          return (
                            <button
                              key={index}
                              className="rounded-[10px] bg-[#F7F8FA] px-4 py-1 text-[13px] font-medium text-[#8E8E8E]"
                            >
                              {certification.certification} -{" "}
                              {certification.institution}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex h-fit w-[100%] flex-col gap-4 rounded-[16px] bg-[#F7F8FA] p-4 lg:max-w-[319px]">
                  {/* Add Match Summary at the top of the sidebar */}
                  {selectedApplication && (
                    <div className="mb-4">
                      <MatchSummary
                        applicantId={selectedApplication.applicant.id}
                        jobId={selectedApplication.job.id}
                      />
                      <button
                        onClick={() =>
                          handleOpenMatchDetails(selectedApplication)
                        }
                        className="mt-3 w-full rounded-lg bg-[#6438C2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5429a8]"
                      >
                        View Detailed Match Analysis
                      </button>
                    </div>
                  )}

                  <h2 className="text-[20px] font-medium text-[#000000]">
                    Application Overview
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6E6E6]">
                      <img src={Teams} alt="Teams" />
                    </div>
                    <div>
                      <h3 className="text-[13px] text-[#000000]">
                        Applied For
                      </h3>
                      <p className="text-[#8E8E8E]">
                        {selectedApplication?.job?.title || ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6E6E6]">
                      <img src={Calendar} alt="Calendar" />
                    </div>
                    <div>
                      <h3 className="text-[13px] text-[#000000]">
                        Application date
                      </h3>
                      <p className="text-[#8E8E8E]">
                        {moment(selectedApplication?.createdAt).format("lll")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6E6E6]">
                      <img src={Work} alt="Work" />
                    </div>
                    <div>
                      <h3 className="text-[13px] text-[#000000]">Experience</h3>
                      <p className="text-[#8E8E8E]">
                        {selectedApplication?.job?.experienceYears} years
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h2 className="text-[18px] font-medium text-[#000000]">
                      File Attachment
                    </h2>
                    {!selectedApplication?.cv?.cvLink && !selectedApplication?.cv?.coverLetterLink && (
                        <p className="self-center rounded-sm p-5 text-gray-500">No File Uploaded</p>
                    )}

                    {selectedApplication?.cv?.cvLink && (
                        <div className="flex justify-between rounded-[10px] bg-white px-4 py-2">
                          <div>
                            <p className="text-[13px] font-medium text-[#000000]">CV File</p>
                            <p className="text-[11px] text-[#8E8E8E]">
                              {selectedApplication?.applicant?.firstName} {selectedApplication?.applicant?.lastName}
                            </p>
                          </div>
                          <FileActionButtons
                              fileUrl={selectedApplication.cv.cvLink}
                              fileName={`${selectedApplication.applicant.firstName}_${selectedApplication.applicant.lastName}_CV.pdf`}
                              fileType="pdf"
                          />
                        </div>
                    )}

                    {selectedApplication?.cv?.coverLetterLink && (
                        <div className="flex justify-between rounded-[10px] bg-white px-4 py-2">
                          <div>
                            <p className="text-[13px] font-medium text-[#000000]">Cover Letter</p>
                            <p className="text-[11px] text-[#8E8E8E]">
                              {selectedApplication?.applicant?.firstName} {selectedApplication?.applicant?.lastName}
                            </p>
                          </div>
                          <FileActionButtons
                              fileUrl={selectedApplication.cv.coverLetterLink}
                              fileName={`${selectedApplication.applicant.firstName}_${selectedApplication.applicant.lastName}_CoverLetter.pdf`}
                              fileType="pdf"
                          />
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ManageApplicantModal modalId="manage-applicant-modal" />
      <InterviewScheduleMultiStepForm modalId="interview-schedule" />
      <InterviewScheduleSuccessModal
        modalId="success-modal"
        interviewId={interviewId as number}
      />

      {/* Match Details Modal */}
      {selectedMatchApplicant && (
        <MatchDetailsModal
          isOpen={isMatchModalOpen}
          onClose={() => setIsMatchModalOpen(false)}
          applicantId={selectedMatchApplicant.applicantId}
          jobId={selectedMatchApplicant.jobId}
          applicantName={selectedMatchApplicant.applicantName}
        />
      )}

      {/* Referrer Modal */}
      {showReferrerModal && <ReferrerModal />}
    </div>
  );
};

export default ManageApplicant;
