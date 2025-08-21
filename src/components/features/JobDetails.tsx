// Completely redesigned JobDetails.tsx - Mobile-first with guaranteed horizontal skills
import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
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

export interface JobRatingRequest {
  score: number;
  comment?: string;
  rateeId: number;
  rateeType: RateeType;
}

export interface JobMatchCardProps {
  updateJobRating: (jobId: number, ratingValue: number) => void;
  job?: JobPostResponse;
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

//
const SkillTag = React.memo(({ skill }: { skill: string }) => (
  <div className="inline-flex items-center justify-center bg-purple-50 text-purple-700 rounded-full px-2.5 py-1.5 text-xs font-medium border border-purple-200 whitespace-nowrap flex-shrink-0">
    {skill}
  </div>
));

SkillTag.displayName = 'SkillTag';

// Redesigned expandable skills section
const SkillsSection = React.memo(({ tags }: { tags: string[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxVisibleSkills = 2; // Reduced for mobile

  const visibleSkills = isExpanded ? tags : tags.slice(0, maxVisibleSkills);
  const hasMoreSkills = tags.length > maxVisibleSkills;

  return (
    <div className="w-full">
      {/* Skills container with guaranteed horizontal layout */}
      <div className="flex flex-wrap items-center gap-1.5 w-full">
        {visibleSkills.map((skill, index) => (
          <SkillTag key={index} skill={skill} />
        ))}

        {/* More/Less button */}
        {hasMoreSkills && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full px-2.5 py-1.5 text-xs font-medium border border-gray-300 hover:border-gray-400 transition-all duration-200 whitespace-nowrap flex-shrink-0"
          >
            {isExpanded ? (
              <>
                Less <ChevronUp size={12} className="ml-1" />
              </>
            ) : (
              <>
                +{tags.length - maxVisibleSkills} <ChevronDown size={12} className="ml-1" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
});

SkillsSection.displayName = 'SkillsSection';

// Compact info badge
const InfoBadge = React.memo(({
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
  <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
    urgent ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-50 text-gray-700'
  }`}>
    <Icon size={12} className={urgent ? "text-red-500" : color} />
    <span className="whitespace-nowrap">{text}</span>
    {urgent && <AlertCircle size={10} className="text-red-500 animate-pulse" />}
  </div>
));

InfoBadge.displayName = 'InfoBadge';

// Main redesigned component
export const JobDetails: React.FC<JobMatchCardProps> = React.memo(({
                                                                     job = {} as JobPostResponse,
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
                                                                     companyLogo,
                                                                   }) => {
  const { openModal, isModalOpen } = useModalStore();
  const { rateSomeone } = useJobActions();
  const {
    viewingJob,
    jobCurrentlyViewed,
    setCurrentlyViewed,
    setViewingJob,
    setJobToApply,
    jobToApply,
  } = useJobSearchSettings();

  // States
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isRatingLoading, setIsRatingLoading] = useState(false);
  const [optimisticRating, setOptimisticRating] = useState(job?.rating?.averageScore || 0);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const rating = optimisticRating;
  const url = useMemo(() => `${FRONTEND_BASE_URL}/jobs/${job?.id}/details`, [job?.id]);
  const postedDaysAgo = useMemo(() => (job?.id || 1) % 7 + 1, [job?.id]);

  const { truncatedDescription, shouldShowReadMore } = useMemo(() => {
    const cleanText = DOMPurify.sanitize(description?.trim() || "", { ALLOWED_TAGS: [] });
    return {
      truncatedDescription: cleanText.length > 120 ? cleanText.substring(0, 120) + "..." : cleanText,
      shouldShowReadMore: cleanText.length > 120
    };
  }, [description]);

  const isUrgent = daysLeft <= 3;
  const salaryRange = job?.salaryRange;
  const hasSalary: boolean = (salaryRange?.minimumAmount && salaryRange?.maximumAmount) != null && salaryRange?.maximumAmount > 0;

  // Event handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowMoreActions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplication = useCallback(() => {
    setJobToApply(job);
    openModal("application");
  }, [job, setJobToApply, openModal]);

  const handleRating = useCallback(async (value: number) => {
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
  }, [isRatingLoading, job?.id, job?.rating?.averageScore, rateSomeone, updateJobRating]);

  const handleRefer = useCallback(() => openModal("refer-modal"), [openModal]);
  const handleBookmark = useCallback(() => {
    setIsBookmarked(!isBookmarked);
    showSuccessToast(isBookmarked ? "Removed from bookmarks" : "Bookmarked!");
  }, [isBookmarked]);

  const handleViewToggle = useCallback(() => {
    if (dashboard || window.innerWidth < 1024) {
      setCurrentlyViewed(job);
      setJobToApply(job);
      openModal("job-mega-modal");
    } else {
      setCurrentlyViewed(job);
      setJobToApply(job);
      setViewingJob(!viewingJob);
    }
  }, [dashboard, job, setCurrentlyViewed, setJobToApply, openModal, setViewingJob, viewingJob]);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Mobile-optimized header */}
      <div className="p-4 pb-3">
        <div className="flex items-start gap-3">
          {/* Company logo */}
          <div className="flex-shrink-0">
            <img
              src={companyLogo}
              alt={company}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md"
            />
          </div>

          {/* Job info */}
          <div className="flex-1 min-w-0">
            {/* Title and company */}
            <div className="mb-2">
              <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">
                {title}
              </h3>
              <div className="flex items-center gap-1.5">
                <Building2 size={12} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600 font-medium">{company}</span>
              </div>
            </div>

            {/* Salary badge */}
            {hasSalary && (
              <div className="mb-2">
                <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold border border-green-200">
                  <DollarSign size={12} />
                  {salaryRange.currency}{salaryRange.minimumAmount?.toLocaleString()} - {salaryRange.currency}{salaryRange.maximumAmount?.toLocaleString()}
                </div>
              </div>
            )}

            {/* Skills - GUARANTEED HORIZONTAL */}
            <SkillsSection tags={tags} />
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {/* Urgent badge */}
            {isUrgent && (
              <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                <Clock size={10} />
                {daysLeft <= 1 ? 'Urgent' : 'Closing'}
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center">
              <Rating rate={handleRating} value={rating} readOnly={isRatingLoading} />
            </div>

            {/* More menu */}
            <div className="relative">
              <button
                onClick={() => setShowMoreActions(!showMoreActions)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal size={16} />
              </button>

              {showMoreActions && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMoreActions(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <button
                      onClick={() => { handleViewToggle(); setShowMoreActions(false); }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      {viewingJob ? <EyeOff size={14} /> : <Eye size={14} />}
                      {viewingJob ? "Hide details" : "View details"}
                    </button>
                    <button
                      onClick={() => { openModal("share"); setShowMoreActions(false); }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Share2 size={14} />
                      Share job
                    </button>
                    <button
                      onClick={() => { handleBookmark(); setShowMoreActions(false); }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
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
        <div className="text-sm text-gray-700 leading-relaxed">
          {isDescriptionExpanded ? (
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description?.trim() || "") }} />
          ) : (
            <p>{truncatedDescription}</p>
          )}

          {shouldShowReadMore && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm mt-1 inline-flex items-center gap-1"
            >
              {isDescriptionExpanded ? (
                <>Show less <ChevronUp size={14} /></>
              ) : (
                <>Read more <ChevronDown size={14} /></>
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
          <InfoBadge icon={Users} text={`${applicants} applied`} color="text-orange-600" />
          <InfoBadge icon={Clock} text={`${daysLeft}d left`} color="text-red-600" urgent={isUrgent} />
        </div>
      </div>

      {/* Actions bar */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleRefer}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Refer
            </button>

            <button
              onClick={handleApplication}
              disabled={jobToApply?.applied}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                jobToApply?.applied
                  ? 'bg-green-500 text-white cursor-default'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {jobToApply?.applied ? (
                <span className="flex items-center gap-1">
                  <Check size={14} /> Applied
                </span>
              ) : (
                'Apply Now'
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
          applicationMethod={jobToApply?.applicationMethod as ApplicationMethod}
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
        <JobDetailsMegaModal
          job={jobCurrentlyViewed as JobPostResponse}
          modalId="job-mega-modal"
        />
      )}
    </div>
  );
});

JobDetails.displayName = 'JobDetails';