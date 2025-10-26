// Fixed JobDetails.tsx - Individual job view state
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect
} from "react";
import {
  MapPin,
  Users,
  Clock,
  Briefcase,
  Share2,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  TrendingUp,
  Building2,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Check,
  AlertCircle
} from "lucide-react";
import Rating from "../common/Rating.tsx";
import ShareModal from "../ui/ShareModal.tsx";
import ApplicationModal from "../ui/ApplicationModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import ApplicationSuccessModal from "../ui/ApplicationSuccessModal.tsx";
import PaymentSuccessModal from "../ui/PaymentSuccessModal.tsx";
import { useJobSearchSettings } from "../../store/useJobSearchSettings.ts";
import { ApplicationMethod, JobPostResponse } from "../../utils/types";
import { RateeType } from "../../utils/enums.ts";
import DOMPurify from "dompurify";
import ReferModal from "../ui/ReferModal.tsx";
import { FRONTEND_BASE_URL } from "../../utils/constants.ts";
import { useJobActions } from "../../store/useJobActions.ts";
import { showErrorToast, showSuccessToast } from "../../utils/toastConfig.tsx";
import JobDetailsMegaModal from "../ui/JobDetailsMegaModal.tsx";
import { bookmarkJob, removeJobBookmark } from "../../services/api";

export interface JobRatingRequest {
  score: number;
  comment?: string;
  rateeId: number;
  rateeType: RateeType;
}

export interface JobMatchCardProps {
  updateJobRating: (jobId: number, ratingValue: number) => void;
  job?: JobPostResponse;
  setJobId: React.Dispatch<React.SetStateAction<number | null>>;
  setViewingJob: React.Dispatch<React.SetStateAction<boolean>>;
  viewingJob: boolean;
  viewingJobId: number | null; // Add this to track which specific job is being viewed
  title: string;
  company: string;
  tags: string[];
  description: string;
  location: string;
  type: string;
  applicants: number;
  daysLeft: number;
  companyLogo?: string;
  dashboard?: boolean;
  index?: number;
}

// SkillTag component remains the same
const SkillTag = React.memo(({ skill }: { skill: string }) => (
  <div
    className="inline-flex flex-shrink-0 items-center justify-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-purple-700">
    {skill}
  </div>
));

SkillTag.displayName = "SkillTag";

// SkillsSection component remains the same
const SkillsSection = React.memo(({ tags }: { tags: string[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxVisibleSkills = 2;

  const visibleSkills = isExpanded ? tags : tags.slice(0, maxVisibleSkills);
  const hasMoreSkills = tags.length > maxVisibleSkills;

  return (
    <div className="w-full">
      <div className="flex w-full flex-wrap items-center gap-1.5">
        {visibleSkills.map((skill, index) => (
          <SkillTag key={index} skill={skill} />
        ))}

        {hasMoreSkills && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex flex-shrink-0 items-center justify-center rounded-full border border-gray-300 bg-gray-100 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-gray-600 transition-all duration-200 hover:border-gray-400 hover:bg-gray-200 hover:text-gray-800"
          >
            {isExpanded ? (
              <>
                Less <ChevronUp size={12} className="ml-1" />
              </>
            ) : (
              <>
                +{tags.length - maxVisibleSkills}{" "}
                <ChevronDown size={12} className="ml-1" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
});

SkillsSection.displayName = "SkillsSection";

// InfoBadge component remains the same
const InfoBadge = React.memo(
  ({
     icon: Icon,
     text,
     color = "text-gray-600",
     urgent = false
   }: {
    icon: React.ComponentType<any>;
    text: string;
    color?: string;
    urgent?: boolean;
  }) => (
    <div
      className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
        urgent
          ? "border border-red-200 bg-red-50 text-red-700"
          : "bg-gray-50 text-gray-700"
      }`}
    >
      <Icon size={12} className={urgent ? "text-red-500" : color} />
      <span className="whitespace-nowrap">{text}</span>
      {urgent && (
        <AlertCircle size={10} className="animate-pulse text-red-500" />
      )}
    </div>
  )
);

InfoBadge.displayName = "InfoBadge";

// Main component with the fix
export const JobDetails: React.FC<JobMatchCardProps> = React.memo(
  ({
     job = {} as JobPostResponse,
     setJobId,

     setViewingJob,
     viewingJobId, // Add this prop
     updateJobRating,
     title,
     company,
     tags,
     description,
     location,
     type,
     applicants,
     daysLeft,
     dashboard = false,
     companyLogo
   }) => {
    const { openModal, isModalOpen } = useModalStore();
    const { rateSomeone } = useJobActions();
    const { setJobToApply, jobToApply } = useJobSearchSettings();

    // States
    const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked || false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isRatingLoading, setIsRatingLoading] = useState(false);
    const [optimisticRating, setOptimisticRating] = useState(
      job?.rating?.averageScore || 0
    );
    const [showMoreActions, setShowMoreActions] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const rating = optimisticRating;
    const url = useMemo(
      () => `${FRONTEND_BASE_URL}/jobs/${job?.id}/details`,
      [job?.id]
    );
    const postedDaysAgo = useMemo(() => ((job?.id || 1) % 7) + 1, [job?.id]);

    // Check if THIS specific job is being viewed
    const isThisJobViewing = viewingJobId === job?.id;

    const { truncatedDescription, shouldShowReadMore } = useMemo(() => {
      const cleanText = DOMPurify.sanitize(description?.trim() || "", {
        ALLOWED_TAGS: []
      });
      return {
        truncatedDescription:
          cleanText.length > 120
            ? cleanText.substring(0, 120) + "..."
            : cleanText,
        shouldShowReadMore: cleanText.length > 120
      };
    }, [description]);

    const isUrgent = daysLeft <= 3;
    const salaryRange = job?.salaryRange;
    const hasSalary: boolean =
      (salaryRange?.minimumAmount && salaryRange?.maximumAmount) != null &&
      salaryRange?.maximumAmount > 0;

    // Event handlers
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          cardRef.current &&
          !cardRef.current.contains(event.target as Node)
        ) {
          setShowMoreActions(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleApplication = useCallback(() => {
      setJobToApply(job);
      openModal("application");
    }, [job, setJobToApply, openModal]);

    const handleRating = useCallback(
      async (value: number) => {
        if (isRatingLoading) return;

        setIsRatingLoading(true);
        setOptimisticRating(value);

        try {
          const response = await rateSomeone(value, job?.id, RateeType.JOB, "");
          if (response.statusCode === 201 && response.data) {
            const updatedScore = response.data.score;
            updateJobRating(job?.id, updatedScore);
            setOptimisticRating(updatedScore);
            showSuccessToast("Rating submitted!");
          }
        } catch (error: any) {
          console.log(error);
          setOptimisticRating(job?.rating?.averageScore || 0);
          showErrorToast("Rating failed");
        } finally {
          setIsRatingLoading(false);
        }
      },
      [
        isRatingLoading,
        job?.id,
        job?.rating?.averageScore,
        rateSomeone,
        updateJobRating
      ]
    );

    const handleRefer = useCallback(
      () => openModal("refer-modal"),
      [openModal]
    );

    const handleBookmark = useCallback(
      async (isBookmarked: boolean) => {
        if (isBookmarked) {
          const response = await removeJobBookmark(job?.id);
          if (response.statusCode === 200) {
            setIsBookmarked((prev) => !prev);
            showSuccessToast(
              isBookmarked ? "Removed from bookmarks" : "Bookmarked!"
            );
          }
        } else {
          const response = await bookmarkJob(job?.id);
          if (response.statusCode === 201) {
            setIsBookmarked((prev) => !prev);
            showSuccessToast(
              isBookmarked ? "Removed from bookmarks" : "Bookmarked!"
            );
          } else {
            showErrorToast("Failed to update bookmark");
          }
        }
      },
      [isBookmarked]
    );

    const handleViewToggle = useCallback(() => {
      if (dashboard || window.innerWidth < 1024) {
        setJobId(job.id);
        setJobToApply(job);
        openModal("job-mega-modal");
      } else {
        if (isThisJobViewing) {
          // If this job is currently being viewed, hide it
          setJobId(null);
          setViewingJob(false);
        } else {
          // If this job is not being viewed, show it (and hide any other job)
          setJobId(job.id);
          setJobToApply(job);
          setViewingJob(true);
        }
      }
    }, [
      dashboard,
      job,
      setJobToApply,
      openModal,
      setJobId,
      setViewingJob,
      isThisJobViewing
    ]);

    return (
      <div
        ref={cardRef}
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
      >
        {/* Mobile-optimized header */}
        <div className="p-4 pb-3">
          <div className="flex items-start gap-3">
            {/* Company logo */}
            <div className="flex-shrink-0">
              <img
                src={companyLogo}
                alt={company}
                className="h-12 w-12 rounded-xl border-2 border-white object-cover shadow-md"
              />
            </div>

            {/* Job info */}
            <div className="min-w-0 flex-1">
              {/* Title and company */}
              <div className="mb-2">
                <h3 className="mb-1 text-base leading-tight font-bold text-gray-900">
                  {title}
                </h3>
                <div className="flex items-center gap-x-6">
                  <div className="flex items-center gap-x-2">
                    <Building2
                      size={12}
                      className="flex-shrink-0 text-gray-400"
                    />
                    <span className="text-sm font-medium text-gray-600">
                    {company}
                  </span>
                  </div>
                  {hasSalary && (
                    <div
                      className="inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                      <DollarSign size={12} />
                      {salaryRange.currency}
                      {salaryRange.minimumAmount?.toLocaleString()} -{" "}
                      {salaryRange.currency}
                      {salaryRange.maximumAmount?.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Salary badge */}


              {/* Skills - GUARANTEED HORIZONTAL */}
              <SkillsSection tags={tags} />
            </div>

            {/* Actions */}
            <div className="flex flex-shrink-0 flex-col items-end gap-2">
              {/* Urgent badge */}
              {isUrgent && (
                <div className="flex items-center gap-1 rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white">
                  <Clock size={10} />
                  {daysLeft <= 1 ? "Urgent" : "Closing"}
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center">
                <Rating
                  rate={handleRating}
                  value={rating}
                  readOnly={isRatingLoading}
                />
              </div>

              {/* More menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <MoreHorizontal size={16} />
                </button>

                {showMoreActions && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMoreActions(false)}
                    />
                    <div
                      className="absolute top-full right-0 z-20 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                      <button
                        onClick={() => {
                          handleViewToggle();
                          setShowMoreActions(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        {/* Use isThisJobViewing instead of viewingJob */}
                        {isThisJobViewing ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                        {isThisJobViewing ? "Hide details" : "View details"}
                      </button>
                      <button
                        onClick={() => {
                          openModal("share");
                          setShowMoreActions(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        <Share2 size={14} />
                        Share job
                      </button>
                      <button
                        onClick={async () => {
                          await handleBookmark(isBookmarked).then((r) => r);
                          setShowMoreActions(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        {isBookmarked ? (
                          <BookmarkCheck size={14} />
                        ) : (
                          <Bookmark size={14} />
                        )}
                        {isBookmarked ? "Remove bookmark" : "Bookmark"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 pb-3">
          <div className="text-sm leading-relaxed text-gray-700">
            {isDescriptionExpanded ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(description?.trim() || "")
                }}
              />
            ) : (
              <p>{truncatedDescription}</p>
            )}

            {shouldShowReadMore && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                {isDescriptionExpanded ? (
                  <>
                    Show less <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown size={14} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Job stats */}
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-1.5">
            <InfoBadge icon={Briefcase} text={type} color="text-blue-600" />
            <InfoBadge icon={MapPin} text={location} color="text-green-600" />
            <InfoBadge
              icon={Users}
              text={`${applicants} applied`}
              color="text-orange-600"
            />
            <InfoBadge
              icon={Clock}
              text={`${daysLeft}d left`}
              color="text-red-600"
              urgent={isUrgent}
            />
          </div>
        </div>

        {/* Actions bar */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={handleRefer}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Refer
              </button>

              <button
                onClick={handleApplication}
                disabled={job?.applied || false}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  job?.applied
                    ? "cursor-default bg-green-500 text-white"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {job?.applied ? (
                  <span className="flex items-center gap-1">
                    <Check size={14} /> Applied
                  </span>
                ) : (
                  "Apply Now"
                )}
              </button>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {rating > 0 && (
                <span className="flex items-center gap-1">
                  <TrendingUp size={12} />
                  {rating.toFixed(1)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {postedDaysAgo}d ago
              </span>
            </div>
          </div>
        </div>

        {/* Modals */}
        {isModalOpen("share") && <ShareModal url={url} modalId="share" />}
        {isModalOpen("application") && (
          <ApplicationModal
            applicationMethod={
              jobToApply?.applicationMethod as ApplicationMethod
            }
            modalId="application"
          />
        )}
        {isModalOpen("application-success") && (
          <ApplicationSuccessModal modalId="application-success" />
        )}
        {isModalOpen("payment-success-modal") && (
          <PaymentSuccessModal modalId="payment-success-modal" />
        )}
        {isModalOpen("refer-modal") && (
          <ReferModal handleRefer={handleRefer} modalId="refer-modal" />
        )}
        {isModalOpen("job-mega-modal") && (
          <JobDetailsMegaModal job={job} modalId="job-mega-modal" />
        )}
      </div>
    );
  }
);

JobDetails.displayName = "JobDetails";
