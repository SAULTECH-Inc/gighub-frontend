import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LuMessageCircleMore,
  LuMapPin,
  LuUsers,
  LuBriefcase,
  LuStar,
  LuTrendingUp,
  LuGlobe,
  LuUserPlus,
  LuUserCheck,
  LuExternalLink,
  LuCalendar,
  LuDollarSign,
  LuAward,
  LuEye,
  LuShare2,
} from "react-icons/lu";

import { EmployerData } from "../../utils/types";
import { useChatStore } from "../../store/useChatStore";
import { FiMoreVertical } from "react-icons/fi";

interface CompanyCardProps {
  company: EmployerData;
  viewMode?: "grid" | "list";
  variant?: "default" | "featured" | "compact";
  isFollowing?: boolean;
  isProcessing?: boolean;
  isViewed?: boolean;
  onFollow?: () => void;
  showActions?: boolean;
  showStats?: boolean;
}

const Company: React.FC<CompanyCardProps> = ({
  company,
  viewMode = "grid",
  variant = "default",
  isFollowing = false,
  isViewed = false,
  onFollow,
  showActions = true,
  showStats = true,
}) => {
  const { setIsClosed, setRecipient, setIsMinimized } = useChatStore();
  const [showMore, setShowMore] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const companyDescription = useMemo(() => {
    return company?.companyDescription || company?.aboutCompany || "";
  }, [company?.companyDescription, company?.aboutCompany]);

  const profileUrl = useMemo(() => {
    const safeName = encodeURIComponent(company?.companyName || "");
    return `/employers/${company?.id}/${safeName}/profile`;
  }, [company?.id, company?.companyName]);

  const handleChatClick = () => {
    if (!company?.email) {
      console.warn("Company email not available for chat");
      return;
    }
    setRecipient(company.email);
    setIsClosed(false);
    setIsMinimized(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: company.companyName,
          text: `Check out ${company.companyName} - ${company.industry}`,
          url: window.location.origin + profileUrl,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.origin + profileUrl);
    }
    setShowDropdown(false);
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const getPlainTextDescription = (htmlString: string) => {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || "";
  };

  const displayDescription = useMemo(() => {
    if (!companyDescription) return "No description available";
    const plainText = getPlainTextDescription(companyDescription);
    const maxLength =
      viewMode === "list" ? 200 : variant === "compact" ? 80 : 120;
    return showMore ? plainText : truncateText(plainText, maxLength);
  }, [companyDescription, viewMode, variant, showMore]);

  const getCompanyInitial = () => {
    return company?.companyName?.charAt(0)?.toUpperCase() || "?";
  };

  const formatSalaryRange = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max)
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };

  const getTimeAgo = (date?: string) => {
    if (!date) return null;
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  if (!company) return null;

  // Compact variant for sidebar or small spaces
  if (variant === "compact") {
    return (
      <div
        className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-purple-200 hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 text-sm font-bold text-purple-600 transition-transform group-hover:scale-110">
              {getCompanyInitial()}
            </div>
            {company.isHiring && (
              <div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-500"></div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
              {company.companyName}
            </h4>
            <p className="truncate text-xs text-gray-500">{company.industry}</p>
            {company.openPositions && company.openPositions > 0 && (
              <p className="flex items-center text-xs font-medium text-green-600">
                <LuBriefcase className="mr-1 h-3 w-3" />
                {company.openPositions} open
              </p>
            )}
          </div>
          <div
            className={`flex items-center space-x-1 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            <button
              onClick={onFollow}
              className={`rounded-lg p-1.5 transition-all ${
                isFollowing
                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  : "bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600"
              }`}
              title={isFollowing ? "Unfollow company" : "Follow company"}
            >
              {isFollowing ? (
                <LuUserCheck className="h-3 w-3" />
              ) : (
                <LuUserPlus className="h-3 w-3" />
              )}
            </button>
            <Link
              to={profileUrl}
              className="rounded-lg bg-gray-100 p-1.5 text-gray-500 transition-all hover:bg-purple-100 hover:text-purple-600"
            >
              <LuExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Featured variant for hero sections
  if (variant === "featured") {
    return (
      <div
        className="group relative block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:border-purple-200 hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

        <div className="relative p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-xl font-bold text-purple-600 shadow-lg transition-transform group-hover:scale-110">
                  {getCompanyInitial()}
                </div>
                {company.isHiring && (
                  <div className="absolute -top-2 -right-2 h-4 w-4 animate-pulse rounded-full border-2 border-white bg-green-500"></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 text-xl font-bold text-gray-900 transition-colors group-hover:text-purple-600">
                  {company.companyName}
                </h3>
                <p className="mb-2 text-sm text-gray-500">{company.industry}</p>
                {company.companyAddress && (
                  <p className="flex items-center text-xs text-gray-400">
                    <LuMapPin className="mr-1 h-3 w-3" />
                    {company.companyAddress}
                  </p>
                )}
              </div>
            </div>

            <div
              className={`flex flex-col space-y-2 transition-opacity ${isHovered ? "opacity-100" : "opacity-70"}`}
            >
              <button
                onClick={onFollow}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  isFollowing
                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-3">
            {company.openPositions && (
              <div className="rounded-lg bg-green-50 p-3 text-center transition-colors hover:bg-green-100">
                <p className="text-lg font-bold text-green-600">
                  {company.openPositions}
                </p>
                <p className="text-xs text-green-600">Open Jobs</p>
              </div>
            )}
            {company.rating && (
              <div className="rounded-lg bg-yellow-50 p-3 text-center transition-colors hover:bg-yellow-100">
                <div className="flex items-center justify-center space-x-1">
                  <LuStar className="h-4 w-4 fill-current text-yellow-400" />
                  <span className="font-bold text-yellow-600">
                    {company.rating}
                  </span>
                </div>
                <p className="text-xs text-yellow-600">Rating</p>
              </div>
            )}
            <div className="rounded-lg bg-blue-50 p-3 text-center transition-colors hover:bg-blue-100">
              <p className="text-lg font-bold text-blue-600">
                {Math.floor(Math.random() * 1000) + 100}
              </p>
              <p className="text-xs text-blue-600">Followers</p>
            </div>
          </div>

          <Link
            to={profileUrl}
            className="block w-full rounded-lg bg-purple-600 py-2 text-center font-medium text-white transition-colors hover:bg-purple-700"
          >
            View Full Profile
          </Link>
        </div>
      </div>
    );
  }

  // List view
  if (viewMode === "list") {
    return (
      <article
        className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-purple-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Subtle animated border */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

        <div className="relative p-6">
          <div className="flex items-start space-x-4">
            {/* Company Logo with enhanced interactions */}
            <div className="relative flex-shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-2xl font-bold text-purple-600 shadow-lg transition-transform group-hover:scale-110">
                {getCompanyInitial()}
              </div>
              {/* Status indicators */}
              <div className="absolute -right-1 -bottom-1 flex space-x-1">
                {isViewed && (
                  <div className="h-3 w-3 rounded-full border-2 border-white bg-blue-500"></div>
                )}
                {company.isHiring && (
                  <div className="h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-500"></div>
                )}
                {isFollowing && (
                  <div className="h-3 w-3 rounded-full border-2 border-white bg-purple-500"></div>
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-purple-600">
                      {company.companyName}
                    </h3>

                    {/* Enhanced badges with animations */}
                    <div className="flex space-x-2">
                      {company.isVerified && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 transition-colors hover:bg-green-200">
                          <LuAward className="mr-1 h-3 w-3" />
                          Verified
                        </span>
                      )}
                      {company.isTrending && (
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-800 transition-colors hover:bg-orange-200">
                          <LuTrendingUp className="mr-1 h-3 w-3" />
                          Trending
                        </span>
                      )}
                      {company.isHiring && (
                        <span className="inline-flex animate-pulse items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200">
                          We're hiring!
                        </span>
                      )}
                    </div>
                  </div>

                  {company.industry && (
                    <span className="mb-3 inline-block rounded-full bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-600 transition-colors hover:bg-purple-100">
                      {company.industry}
                    </span>
                  )}
                </div>
              </div>

              <p className="mb-4 leading-relaxed text-gray-600">
                {displayDescription}
                {companyDescription &&
                  getPlainTextDescription(companyDescription).length > 200 && (
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="ml-2 text-sm font-medium text-purple-600 transition-all hover:text-purple-700 hover:underline"
                    >
                      {showMore ? "Show less" : "Show more"}
                    </button>
                  )}
              </p>

              {/* Enhanced Company Details Grid */}
              <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {company.companyAddress && (
                  <div className="flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700">
                    <LuMapPin className="mr-2 h-4 w-4 text-green-500" />
                    <span className="truncate">{company.companyAddress}</span>
                  </div>
                )}

                {company.companySize && (
                  <div className="flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700">
                    <LuUsers className="mr-2 h-4 w-4 text-blue-500" />
                    <span>{company.companySize}</span>
                  </div>
                )}

                {company.foundedYear && (
                  <div className="flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700">
                    <LuCalendar className="mr-2 h-4 w-4 text-purple-500" />
                    <span>Founded {company.foundedYear}</span>
                  </div>
                )}

                {company.companyWebsite && (
                  <div className="flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700">
                    <LuGlobe className="mr-2 h-4 w-4 text-orange-500" />
                    <a
                      href={company.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-purple-600 transition-all hover:text-purple-700 hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>

              {/* Enhanced Stats Row */}
              <div className="mb-4 flex flex-wrap items-center gap-4">
                {company.openPositions && company.openPositions > 0 && (
                  <div className="flex items-center rounded-lg bg-green-50 px-2 py-1 text-green-600 transition-colors hover:bg-green-100">
                    <LuBriefcase className="mr-1 h-4 w-4" />
                    <span className="font-medium">
                      {company.openPositions} open positions
                    </span>
                  </div>
                )}

                {company.rating && (
                  <div className="flex items-center rounded-lg bg-yellow-50 px-2 py-1 transition-colors hover:bg-yellow-100">
                    <div className="mr-2 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <LuStar
                          key={i}
                          className={`h-4 w-4 transition-colors ${
                            i < Math.floor(company.rating!)
                              ? "fill-current text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-gray-700">
                      {company.rating}
                    </span>
                    {company.reviewCount && (
                      <span className="ml-1 text-gray-500">
                        ({company.reviewCount})
                      </span>
                    )}
                  </div>
                )}

                {company.salaryRange && (
                  <div className="flex items-center rounded-lg bg-gray-50 px-2 py-1 text-gray-600 transition-colors hover:bg-gray-100">
                    <LuDollarSign className="mr-1 h-4 w-4" />
                    <span>
                      {formatSalaryRange(
                        company.salaryRange.min,
                        company.salaryRange.max,
                      )}
                    </span>
                  </div>
                )}

                {company.isRemote && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs text-blue-800 transition-colors hover:bg-blue-200">
                    <LuGlobe className="mr-1 h-3 w-3" />
                    Remote OK
                  </span>
                )}
              </div>
            </div>

            {/* Enhanced Actions */}
            {showActions && (
              <div className="ml-4 flex flex-col items-center space-y-3">
                <button
                  onClick={onFollow}
                  className={`flex h-10 w-10 transform items-center justify-center rounded-full border-2 transition-all hover:scale-110 ${
                    isFollowing
                      ? "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
                      : "border-gray-200 text-gray-400 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  title={isFollowing ? "Unfollow company" : "Follow company"}
                >
                  {isFollowing ? (
                    <LuUserCheck className="h-5 w-5" />
                  ) : (
                    <LuUserPlus className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={handleChatClick}
                  disabled={!company?.email}
                  className="flex h-10 w-10 transform items-center justify-center rounded-full bg-purple-600 text-white transition-all hover:scale-110 hover:bg-purple-700 disabled:bg-gray-400"
                  title="Start conversation"
                >
                  <LuMessageCircleMore className="h-5 w-5" />
                </button>

                {/* Dropdown menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all hover:border-gray-300 hover:text-gray-600"
                  >
                    <FiMoreVertical className="h-4 w-4" />
                  </button>

                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-50"
                        onClick={() => setShowDropdown(false)}
                      />
                      <div className="absolute right-0 bottom-full z-50 mb-2 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-xl">
                        <Link
                          to={profileUrl}
                          className="block flex w-full items-center px-3 py-2 text-left text-sm hover:bg-gray-50"
                          onClick={() => setShowDropdown(false)}
                        >
                          <LuEye className="mr-2 h-4 w-4" />
                          View Profile
                        </Link>
                        <button
                          onClick={handleShare}
                          className="block flex w-full items-center px-3 py-2 text-left text-sm hover:bg-gray-50"
                        >
                          <LuShare2 className="mr-2 h-4 w-4" />
                          Share
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Grid view (default) - Enhanced
  return (
    <article
      className="group relative max-w-sm transform overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/5 to-blue-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

      {/* Status indicators */}
      <div className="absolute top-3 left-3 z-10 flex space-x-1">
        {isViewed && (
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500"></div>
        )}
        {isFollowing && (
          <div className="h-2.5 w-2.5 rounded-full bg-purple-500"></div>
        )}
      </div>

      {/* Follow Button */}
      {showActions && (
        <button
          onClick={onFollow}
          className={`absolute top-3 right-3 z-10 flex h-8 w-8 transform items-center justify-center rounded-full border-2 bg-white/90 backdrop-blur transition-all hover:scale-110 ${
            isFollowing
              ? "border-blue-200 text-blue-600 hover:bg-blue-50"
              : "border-gray-200 text-gray-400 hover:border-blue-200 hover:text-blue-600"
          }`}
          title={isFollowing ? "Unfollow company" : "Follow company"}
        >
          {isFollowing ? (
            <LuUserCheck className="h-4 w-4" />
          ) : (
            <LuUserPlus className="h-4 w-4" />
          )}
        </button>
      )}

      <div className="relative">
        {/* Enhanced Company Logo Section */}
        <div className="relative flex h-28 items-center justify-center overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 transition-all duration-500 group-hover:from-purple-500/10 group-hover:to-blue-500/10"></div>
          <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-gray-100 bg-white text-2xl font-bold text-purple-600 shadow-lg transition-transform group-hover:scale-110">
            {getCompanyInitial()}
          </div>

          {/* Enhanced Status Badges */}
          <div className="absolute bottom-2 left-3 flex space-x-1">
            {company.isVerified && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 transition-colors hover:bg-green-200">
                <LuAward className="h-3 w-3" />
              </span>
            )}
            {company.isTrending && (
              <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 transition-colors hover:bg-orange-200">
                <LuTrendingUp className="h-3 w-3" />
              </span>
            )}
            {company.isHiring && (
              <span className="inline-flex animate-pulse items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200">
                Hiring
              </span>
            )}
          </div>

          {/* Hiring pulse indicator */}
          {company.isHiring && (
            <div className="absolute top-2 right-2 h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
          )}
        </div>

        {/* Enhanced Company Details */}
        <div className="relative p-5">
          <div className="mb-3">
            <h4 className="mb-2 line-clamp-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-purple-600">
              {company.companyName || "Unknown Company"}
            </h4>

            {company.industry && (
              <span className="mb-2 inline-block rounded-full bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-600 transition-colors hover:bg-purple-100">
                {company.industry}
              </span>
            )}
          </div>

          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
            {displayDescription}
          </p>

          {/* Enhanced Company Info */}
          <div className="mb-4 space-y-2 text-sm">
            {company.companyAddress && (
              <div className="flex items-center text-gray-500 transition-colors hover:text-gray-700">
                <LuMapPin className="mr-2 h-4 w-4 text-green-500" />
                <span className="truncate">{company.companyAddress}</span>
              </div>
            )}

            {company.companySize && (
              <div className="flex items-center text-gray-500 transition-colors hover:text-gray-700">
                <LuUsers className="mr-2 h-4 w-4 text-blue-500" />
                <span>{company.companySize}</span>
              </div>
            )}

            {company.openPositions && company.openPositions > 0 && (
              <div className="flex items-center">
                <LuBriefcase className="mr-2 h-4 w-4 text-orange-500" />
                <span className="font-medium text-green-600">
                  {company.openPositions} open positions
                </span>
              </div>
            )}

            {company.isRemote && (
              <div className="flex items-center">
                <LuGlobe className="mr-2 h-4 w-4 text-purple-500" />
                <span className="text-blue-600">Remote friendly</span>
              </div>
            )}
          </div>

          {/* Enhanced Rating */}
          {company.rating && (
            <div className="mb-4 flex items-center rounded-lg bg-yellow-50 p-2 transition-colors hover:bg-yellow-100">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <LuStar
                    key={i}
                    className={`h-4 w-4 transition-all ${
                      i < Math.floor(company.rating!)
                        ? "fill-current text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {company.rating}
              </span>
              {company.reviewCount && (
                <span className="ml-1 text-sm text-gray-500">
                  ({company.reviewCount})
                </span>
              )}
            </div>
          )}

          {/* Salary Range */}
          {company.salaryRange && (
            <div className="mb-4 flex items-center rounded-lg bg-green-50 p-2 text-sm text-gray-600 transition-colors hover:bg-green-100">
              <LuDollarSign className="mr-2 h-4 w-4 text-green-500" />
              <span>
                {formatSalaryRange(
                  company.salaryRange.min,
                  company.salaryRange.max,
                )}
              </span>
            </div>
          )}

          {/* Enhanced Action Buttons */}
          {showActions && (
            <div className="mb-4 flex items-center justify-between space-x-3">
              <Link
                to={profileUrl}
                className="flex-1 transform rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition-all hover:scale-105 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 focus:outline-none"
                aria-label={`View ${company?.companyName} profile`}
              >
                View Profile
              </Link>

              <button
                onClick={handleChatClick}
                disabled={!company?.email}
                className="flex h-10 w-10 transform items-center justify-center rounded-lg bg-purple-600 text-white transition-all hover:scale-110 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
                aria-label={`Start chat with ${company?.companyName}`}
                title={
                  company?.email ? "Start conversation" : "Email not available"
                }
              >
                <LuMessageCircleMore className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Enhanced Footer Stats */}
          {showStats && (
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  {company.foundedYear ? (
                    <>
                      <LuCalendar className="mr-1 h-3 w-3" />
                      Est. {company.foundedYear}
                    </>
                  ) : (
                    "New company"
                  )}
                </span>

                <div className="flex items-center space-x-3">
                  {/* Followers count (simulated) */}
                  {company.noMutualConnections &&
                  company.noMutualConnections > 0 ? (
                    <span className="flex items-center text-purple-600">
                      <LuUsers className="mr-1 h-3 w-3" />
                      {company.noMutualConnections} followers
                    </span>
                  ) : (
                    <span></span>
                  )}

                  {company.lastUpdated && (
                    <span className="flex items-center">
                      <div className="mr-1 h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                      Updated {getTimeAgo(company.lastUpdated)}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar for engagement (simulated) */}
              {/*<div className="mt-2">*/}
              {/*  <div className="flex justify-between text-xs text-gray-500 mb-1">*/}
              {/*    <span>Engagement</span>*/}
              {/*    <span>{Math.floor(Math.random() * 40) + 60}%</span>*/}
              {/*  </div>*/}
              {/*  <div className="w-full bg-gray-200 rounded-full h-1">*/}
              {/*    <div*/}
              {/*      className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full transition-all duration-1000"*/}
              {/*      style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}*/}
              {/*    ></div>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default Company;
