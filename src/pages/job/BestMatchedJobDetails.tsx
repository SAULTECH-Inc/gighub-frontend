import React, { useCallback, useMemo, useState, useRef, useEffect } from "react";
import {
  EllipsisVertical,
  MapPin,
  Clock,
  Users,
  Briefcase,
  ExternalLink,
  Star,
  Share2,
  Heart,
  Check
} from "lucide-react";
import { JobPostResponse } from "../../utils/types";
import { applyForJob } from "../../services/api";
import { useAuth } from "../../store/useAuth.ts";

// Constants
const FRONTEND_BASE_URL = "https://yourapp.com";
const MAX_VISIBLE_TAGS = 3;
const RESPONSIVE_BREAKPOINT = 1024;

interface JobMatchCardProps {
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
}

// Enhanced Rating Component
const Rating: React.FC<{
  value: number;
  onRate: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}> = ({ value, onRate, readonly = false, size = 'sm' }) => {
  const [hoverValue, setHoverValue] = useState(0);
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  const handleKeyDown = useCallback((event: React.KeyboardEvent, star: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!readonly) onRate(star);
    }
  }, [onRate, readonly]);

  return (
    <div className="flex items-center space-x-1" role="group" aria-label={`Rating: ${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRate(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(0)}
          onKeyDown={(e) => handleKeyDown(e, star)}
          className={`transition-all duration-200 ${
            readonly
              ? 'cursor-default'
              : 'cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 rounded'
          }`}
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            className={`${iconSize} transition-colors ${
              star <= (hoverValue || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 hover:text-gray-400'
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-xs text-gray-500 font-medium">
        ({value.toFixed(1)})
      </span>
    </div>
  );
};

// Enhanced Action Menu Component
const ActionMenu: React.FC<{
  onShare: () => void;
  onBookmark: () => void;
  onRate: (rating: number) => void;
  rating: number;
  isBookmarked: boolean;
}> = ({ onShare, onBookmark, onRate, rating, isBookmarked }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowMenu(false);
      buttonRef.current?.focus();
    }
  }, []);

  const handleMenuAction = useCallback((action: () => void) => {
    action();
    setShowMenu(false);
    buttonRef.current?.focus();
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
        aria-label="More actions"
        aria-expanded={showMenu}
        aria-haspopup="menu"
      >
        <EllipsisVertical size={16} className="text-gray-500" />
      </button>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full z-30 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
          role="menu"
          onKeyDown={handleKeyDown}
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3">Rate this job</p>
            <Rating value={rating} onRate={onRate} size="md" />
          </div>

          <button
            onClick={() => handleMenuAction(onShare)}
            className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
            role="menuitem"
          >
            <Share2 className="mr-3 h-4 w-4 flex-shrink-0" />
            Share Job
          </button>

          <button
            onClick={() => handleMenuAction(onBookmark)}
            className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
            role="menuitem"
          >
            <Heart className={`mr-3 h-4 w-4 flex-shrink-0 transition-colors ${
              isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`} />
            {isBookmarked ? 'Remove from Bookmarks' : 'Add to Bookmarks'}
          </button>
        </div>
      )}
    </div>
  );
};

// Job Detail Item Component
const JobDetailItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  colorClass?: string;
}> = ({ icon, label, value, colorClass = 'text-gray-700' }) => (
  <div className="flex items-center gap-2">
    <div className="p-1.5 bg-gray-50 rounded-lg flex-shrink-0">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] text-gray-500 font-medium">{label}</p>
      <p className={`text-[11px] font-semibold truncate ${colorClass}`}>
        {typeof value === 'number' && label === 'Days left' ? `${value}d` : value}
      </p>
    </div>
  </div>
);

// Main Component
export const BestMatchedJobDetails: React.FC<JobMatchCardProps> = ({
                                                                     job,
                                                                     updateJobRating,
                                                                     title,
                                                                     company,
                                                                     tags = [],
                                                                     description,
                                                                     location,
                                                                     type,
                                                                     applicants,
                                                                     daysLeft,
                                                                     dashboard = false,
                                                                     companyLogo,
                                                                   }) => {
  const { applicant } = useAuth();

  // Fix 1: Initialize state properly from job props
  const [isBookmarked, setIsBookmarked] = useState(job?.isBookmarked || false);
  const [isApplied, setIsApplied] = useState(job?.applied || false);
  const [isApplying, setIsApplying] = useState(false);

  // Fix 2: Update state when job prop changes
  useEffect(() => {
    if (job) {
      setIsBookmarked(job.isBookmarked || false);
      setIsApplied(job.applied || false);
    }
  }, [job]);

  // Memoized values
  const rating = useMemo(() => job?.rating?.averageScore || 0, [job?.rating?.averageScore]);
  const shareUrl = useMemo(() => `${FRONTEND_BASE_URL}/jobs/${job?.id}/details`, [job?.id]);
  const visibleTags = useMemo(() => tags.slice(0, MAX_VISIBLE_TAGS), [tags]);
  const hiddenTagsCount = useMemo(() => Math.max(0, tags.length - MAX_VISIBLE_TAGS), [tags.length]);

  const companyLogoUrl = useMemo(() =>
      companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=6366f1&color=fff&size=40`,
    [companyLogo, company]
  );

  const isMobileOrTablet = useMemo(() =>
      typeof window !== 'undefined' && window.innerWidth < RESPONSIVE_BREAKPOINT,
    []
  );

  // Event handlers
  const handleJobView = useCallback(() => {
    if (dashboard || isMobileOrTablet) {
      console.log('Open job details modal');
    } else {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  }, [dashboard, isMobileOrTablet, shareUrl]);

  const handleApplication = useCallback(async () => {
    if (isApplied || isApplying || !job?.id) return;

    setIsApplying(true);
    try {
      await applyForJob({
        jobId: job.id,
        applicationMethod: {
          byCv: applicant?.cv !== null,
          byPortfolio: applicant?.cv?.portfolioLink !== null,
          byVideo: applicant?.cv?.videoCv !== null,
          byProfile: applicant?.cv?.professionalTitle !== null,
          byCoverLetter: applicant?.cv?.coverLetterLink !== null,
        },
      });
      setIsApplied(true);
      console.log('Applied to job successfully');
    } catch (error) {
      console.error('Application failed:', error);
    } finally {
      setIsApplying(false);
    }
  }, [isApplied, isApplying, job?.id, applicant]);

  const handleRating = useCallback(async (value: number) => {
    if (!job?.id) return;

    try {
      console.log('Rating job with value:', value);
      updateJobRating(job.id, value);
    } catch (error) {
      console.error('Rating failed:', error);
    }
  }, [job?.id, updateJobRating]);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${title} at ${company}`,
          text: `Check out this job opportunity: ${title} at ${company}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        console.log('Job URL copied to clipboard');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  }, [shareUrl, title, company]);

  const handleBookmark = useCallback(() => {
    setIsBookmarked(prev => !prev);
    console.log(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  }, [isBookmarked]);

  // Get urgency styling for days left
  const getDaysLeftStyling = useCallback((days: number) => {
    if (days <= 3) return 'text-red-600 bg-red-50';
    if (days <= 7) return 'text-orange-600 bg-orange-50';
    return 'text-gray-700 bg-gray-50';
  }, []);

  const daysLeftStyling = useMemo(() => getDaysLeftStyling(daysLeft), [daysLeft, getDaysLeftStyling]);

  // Fix 3: Add safeguard for missing job data
  if (!job) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No job data available</p>
      </div>
    );
  }

  return (
    <article className="relative mx-auto flex w-full h-full min-w-[320px] max-w-full flex-col gap-y-5 rounded-xl bg-gray-100 border border-gray-100 p-2">
      {/* Header Section */}
      <header className="relative flex items-start justify-between gap-3">
        <div className="flex w-full items-start space-x-3">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={companyLogoUrl}
                alt={`${company} logo`}
                className="h-12 w-12 rounded-xl object-cover ring-2 ring-gray-100 bg-white"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=6366f1&color=fff&size=48`;
                }}
              />
              {rating >= 4.5 && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-1 shadow-sm">
                  <Star className="h-3 w-3 fill-white text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Job Info */}
          <div className="flex min-w-0 flex-1 flex-col gap-y-3">
            {/* Title and Company */}
            <div className="flex flex-col gap-y-1">
              <h2 className="text-base font-bold text-gray-900 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors leading-tight">
                {title}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">
                  {company}
                </span>
                {rating > 0 && (
                  <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded-full">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {visibleTags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}

              {hiddenTagsCount > 0 && (
                <span
                  className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                  title={`${hiddenTagsCount} more tags: ${tags.slice(MAX_VISIBLE_TAGS).join(', ')}`}
                >
                  +{hiddenTagsCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Menu */}
        <ActionMenu
          onShare={handleShare}
          onBookmark={handleBookmark}
          onRate={handleRating}
          rating={rating}
          isBookmarked={isBookmarked}
        />
      </header>

      {/* Job Description */}
      <section className="flex flex-col">
        <div className="text-sm leading-relaxed text-gray-600">
          <div
            className="line-clamp-4"
            dangerouslySetInnerHTML={{
              __html: description?.trim() || 'No description available'
            }}
          />
        </div>
      </section>

      {/* Job Details Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <JobDetailItem
          icon={<Briefcase className="h-4 w-4 text-blue-600" />}
          label="Type"
          value={type}
        />

        <JobDetailItem
          icon={<MapPin className="h-4 w-4 text-green-600" />}
          label="Location"
          value={location}
        />

        <JobDetailItem
          icon={<Users className="h-4 w-4 text-purple-600" />}
          label="Applicants"
          value={applicants}
        />

        <JobDetailItem
          icon={<Clock className="h-4 w-4 text-orange-600" />}
          label="Days left"
          value={daysLeft}
          colorClass={daysLeftStyling.split(' ')[0]}
        />
      </div>

      {/* Action Buttons */}
      <footer className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={handleJobView}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          type="button"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="hidden sm:inline">View Details</span>
          <span className="sm:hidden">View</span>
        </button>

        <button
          onClick={handleApplication}
          disabled={isApplied || isApplying}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 border-2 border-transparent rounded-xl hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:from-indigo-600 disabled:hover:to-purple-600 group"
          type="button"
        >
          {isApplying ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              <span>Applying...</span>
            </>
          ) : isApplied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Applied</span>
            </>
          ) : (
            <>
              <span>Apply Now</span>
            </>
          )}
        </button>
      </footer>
    </article>
  );
};
