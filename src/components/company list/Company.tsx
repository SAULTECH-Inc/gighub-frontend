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
                                               showStats = true
                                             }) => {
  const { setIsClosed, setRecipient,setIsMinimized } = useChatStore();
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
    const maxLength = viewMode === "list" ? 200 : variant === "compact" ? 80 : 120;
    return showMore ? plainText : truncateText(plainText, maxLength);
  }, [companyDescription, viewMode, variant, showMore]);

  const getCompanyInitial = () => {
    return company?.companyName?.charAt(0)?.toUpperCase() || "?";
  };

  const formatSalaryRange = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };

  const getTimeAgo = (date?: string) => {
    if (!date) return null;
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));

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
        className="group p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 text-sm font-bold text-purple-600 flex-shrink-0 group-hover:scale-110 transition-transform">
              {getCompanyInitial()}
            </div>
            {company.isHiring && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
              {company.companyName}
            </h4>
            <p className="text-xs text-gray-500 truncate">{company.industry}</p>
            {company.openPositions && company.openPositions > 0 && (
              <p className="text-xs text-green-600 font-medium flex items-center">
                <LuBriefcase className="h-3 w-3 mr-1" />
                {company.openPositions} open
              </p>
            )}
          </div>
          <div className={`flex items-center space-x-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={onFollow}
              className={`p-1.5 rounded-lg transition-all ${
                isFollowing
                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  : "bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600"
              }`}
              title={isFollowing ? "Unfollow company" : "Follow company"}
            >
              {isFollowing ? <LuUserCheck className="h-3 w-3" /> : <LuUserPlus className="h-3 w-3" />}
            </button>
            <Link
              to={profileUrl}
              className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-purple-100 hover:text-purple-600 transition-all"
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
        className="group block relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-xl font-bold text-purple-600 group-hover:scale-110 transition-transform shadow-lg">
                  {getCompanyInitial()}
                </div>
                {company.isHiring && (
                  <div className="absolute -top-2 -right-2 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                  {company.companyName}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{company.industry}</p>
                {company.companyAddress && (
                  <p className="text-xs text-gray-400 flex items-center">
                    <LuMapPin className="h-3 w-3 mr-1" />
                    {company.companyAddress}
                  </p>
                )}
              </div>
            </div>

            <div className={`flex flex-col space-y-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
              <button
                onClick={onFollow}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isFollowing
                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {company.openPositions && (
              <div className="p-3 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors">
                <p className="text-lg font-bold text-green-600">{company.openPositions}</p>
                <p className="text-xs text-green-600">Open Jobs</p>
              </div>
            )}
            {company.rating && (
              <div className="p-3 bg-yellow-50 rounded-lg text-center hover:bg-yellow-100 transition-colors">
                <div className="flex items-center justify-center space-x-1">
                  <LuStar className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-bold text-yellow-600">{company.rating}</span>
                </div>
                <p className="text-xs text-yellow-600">Rating</p>
              </div>
            )}
            <div className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors">
              <p className="text-lg font-bold text-blue-600">{Math.floor(Math.random() * 1000) + 100}</p>
              <p className="text-xs text-blue-600">Followers</p>
            </div>
          </div>

          <Link to={profileUrl} className="block w-full text-center py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
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
        className="group overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-purple-200 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Subtle animated border */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div className="relative p-6">
          <div className="flex items-start space-x-4">
            {/* Company Logo with enhanced interactions */}
            <div className="relative flex-shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-2xl font-bold text-purple-600 group-hover:scale-110 transition-transform shadow-lg">
                {getCompanyInitial()}
              </div>
              {/* Status indicators */}
              <div className="absolute -bottom-1 -right-1 flex space-x-1">
                {isViewed && <div className="h-3 w-3 bg-blue-500 rounded-full border-2 border-white"></div>}
                {company.isHiring && <div className="h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>}
                {isFollowing && <div className="h-3 w-3 bg-purple-500 rounded-full border-2 border-white"></div>}
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {company.companyName}
                    </h3>

                    {/* Enhanced badges with animations */}
                    <div className="flex space-x-2">
                      {company.isVerified && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 hover:bg-green-200 transition-colors">
                          <LuAward className="mr-1 h-3 w-3" />
                          Verified
                        </span>
                      )}
                      {company.isTrending && (
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-800 hover:bg-orange-200 transition-colors">
                          <LuTrendingUp className="mr-1 h-3 w-3" />
                          Trending
                        </span>
                      )}
                      {company.isHiring && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200 transition-colors animate-pulse">
                          We're hiring!
                        </span>
                      )}
                    </div>
                  </div>

                  {company.industry && (
                    <span className="inline-block rounded-full bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-600 mb-3 hover:bg-purple-100 transition-colors">
                      {company.industry}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {displayDescription}
                {companyDescription && getPlainTextDescription(companyDescription).length > 200 && (
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="ml-2 text-purple-600 hover:text-purple-700 text-sm font-medium hover:underline transition-all"
                  >
                    {showMore ? "Show less" : "Show more"}
                  </button>
                )}
              </p>

              {/* Enhanced Company Details Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {company.companyAddress && (
                  <div className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    <LuMapPin className="mr-2 h-4 w-4 text-green-500" />
                    <span className="truncate">{company.companyAddress}</span>
                  </div>
                )}

                {company.companySize && (
                  <div className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    <LuUsers className="mr-2 h-4 w-4 text-blue-500" />
                    <span>{company.companySize}</span>
                  </div>
                )}

                {company.foundedYear && (
                  <div className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    <LuCalendar className="mr-2 h-4 w-4 text-purple-500" />
                    <span>Founded {company.foundedYear}</span>
                  </div>
                )}

                {company.companyWebsite && (
                  <div className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    <LuGlobe className="mr-2 h-4 w-4 text-orange-500" />
                    <a
                      href={company.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 truncate hover:underline transition-all"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>

              {/* Enhanced Stats Row */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {company.openPositions && company.openPositions > 0 && (
                  <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-lg hover:bg-green-100 transition-colors">
                    <LuBriefcase className="mr-1 h-4 w-4" />
                    <span className="font-medium">{company.openPositions} open positions</span>
                  </div>
                )}

                {company.rating && (
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg hover:bg-yellow-100 transition-colors">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <LuStar
                          key={i}
                          className={`h-4 w-4 transition-colors ${
                            i < Math.floor(company.rating!)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-gray-700">{company.rating}</span>
                    {company.reviewCount && (
                      <span className="ml-1 text-gray-500">({company.reviewCount})</span>
                    )}
                  </div>
                )}

                {company.salaryRange && (
                  <div className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                    <LuDollarSign className="mr-1 h-4 w-4" />
                    <span>{formatSalaryRange(company.salaryRange.min, company.salaryRange.max)}</span>
                  </div>
                )}

                {company.isRemote && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs text-blue-800 hover:bg-blue-200 transition-colors">
                    <LuGlobe className="mr-1 h-3 w-3" />
                    Remote OK
                  </span>
                )}
              </div>
            </div>

            {/* Enhanced Actions */}
            {showActions && (
              <div className="flex flex-col items-center space-y-3 ml-4">
                <button
                  onClick={onFollow}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all transform hover:scale-110 ${
                    isFollowing
                      ? "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
                      : "border-gray-200 text-gray-400 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                  title={isFollowing ? "Unfollow company" : "Follow company"}
                >
                  {isFollowing ? <LuUserCheck className="h-5 w-5" /> : <LuUserPlus className="h-5 w-5" />}
                </button>

                <button
                  onClick={handleChatClick}
                  disabled={!company?.email}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 transition-all transform hover:scale-110"
                  title="Start conversation"
                >
                  <LuMessageCircleMore className="h-5 w-5" />
                </button>

                {/* Dropdown menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all"
                  >
                    <FiMoreVertical className="h-4 w-4" />
                  </button>

                  {showDropdown && (
                    <>
                      <div className="fixed inset-0 z-50" onClick={() => setShowDropdown(false)} />
                      <div className="absolute right-0 bottom-full z-50 mb-2 w-36 bg-white rounded-lg shadow-xl border border-gray-200 py-1">
                        <Link
                          to={profileUrl}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center"
                          onClick={() => setShowDropdown(false)}
                        >
                          <LuEye className="h-4 w-4 mr-2" />
                          View Profile
                        </Link>
                        <button
                          onClick={handleShare}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center"
                        >
                          <LuShare2 className="h-4 w-4 mr-2" />
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
      className="group max-w-sm overflow-hidden rounded-xl bg-white border border-gray-200 hover:shadow-lg hover:border-purple-200 transition-all duration-300 relative transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Status indicators */}
      <div className="absolute top-3 left-3 flex space-x-1 z-10">
        {isViewed && <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-pulse"></div>}
        {isFollowing && <div className="h-2.5 w-2.5 bg-purple-500 rounded-full"></div>}
      </div>

      {/* Follow Button */}
      {showActions && (
        <button
          onClick={onFollow}
          className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white/90 backdrop-blur transition-all transform hover:scale-110 ${
            isFollowing
              ? "border-blue-200 text-blue-600 hover:bg-blue-50"
              : "border-gray-200 text-gray-400 hover:border-blue-200 hover:text-blue-600"
          }`}
          title={isFollowing ? "Unfollow company" : "Follow company"}
        >
          {isFollowing ? <LuUserCheck className="h-4 w-4" /> : <LuUserPlus className="h-4 w-4" />}
        </button>
      )}

      <div className="relative">
        {/* Enhanced Company Logo Section */}
        <div className="flex h-28 items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-500"></div>
          <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-lg border border-gray-100 text-2xl font-bold text-purple-600 group-hover:scale-110 transition-transform">
            {getCompanyInitial()}
          </div>

          {/* Enhanced Status Badges */}
          <div className="absolute bottom-2 left-3 flex space-x-1">
            {company.isVerified && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 hover:bg-green-200 transition-colors">
                <LuAward className="h-3 w-3" />
              </span>
            )}
            {company.isTrending && (
              <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 hover:bg-orange-200 transition-colors">
                <LuTrendingUp className="h-3 w-3" />
              </span>
            )}
            {company.isHiring && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200 transition-colors animate-pulse">
                Hiring
              </span>
            )}
          </div>

          {/* Hiring pulse indicator */}
          {company.isHiring && (
            <div className="absolute top-2 right-2 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Enhanced Company Details */}
        <div className="relative p-5">
          <div className="mb-3">
            <h4 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1 mb-2">
              {company.companyName || "Unknown Company"}
            </h4>

            {company.industry && (
              <span className="inline-block rounded-full bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-600 mb-2 hover:bg-purple-100 transition-colors">
                {company.industry}
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-gray-600 mb-4 line-clamp-3">
            {displayDescription}
          </p>

          {/* Enhanced Company Info */}
          <div className="space-y-2 mb-4 text-sm">
            {company.companyAddress && (
              <div className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                <LuMapPin className="mr-2 h-4 w-4 text-green-500" />
                <span className="truncate">{company.companyAddress}</span>
              </div>
            )}

            {company.companySize && (
              <div className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                <LuUsers className="mr-2 h-4 w-4 text-blue-500" />
                <span>{company.companySize}</span>
              </div>
            )}

            {company.openPositions && company.openPositions > 0 && (
              <div className="flex items-center">
                <LuBriefcase className="mr-2 h-4 w-4 text-orange-500" />
                <span className="font-medium text-green-600">{company.openPositions} open positions</span>
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
            <div className="flex items-center mb-4 bg-yellow-50 p-2 rounded-lg hover:bg-yellow-100 transition-colors">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <LuStar
                    key={i}
                    className={`h-4 w-4 transition-all ${
                      i < Math.floor(company.rating!)
                        ? "text-yellow-400 fill-current"
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
            <div className="flex items-center mb-4 text-sm text-gray-600 bg-green-50 p-2 rounded-lg hover:bg-green-100 transition-colors">
              <LuDollarSign className="mr-2 h-4 w-4 text-green-500" />
              <span>{formatSalaryRange(company.salaryRange.min, company.salaryRange.max)}</span>
            </div>
          )}

          {/* Enhanced Action Buttons */}
          {showActions && (
            <div className="flex items-center justify-between space-x-3 mb-4">
              <Link
                to={profileUrl}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 transform hover:scale-105"
                aria-label={`View ${company?.companyName} profile`}
              >
                View Profile
              </Link>

              <button
                onClick={handleChatClick}
                disabled={!company?.email}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-110"
                aria-label={`Start chat with ${company?.companyName}`}
                title={company?.email ? "Start conversation" : "Email not available"}
              >
                <LuMessageCircleMore className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Enhanced Footer Stats */}
          {showStats && (
            <div className="pt-4 border-t border-gray-100">
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
                  {
                    company.noMutualConnections && company.noMutualConnections > 0 ?(<span
                      className="flex items-center text-purple-600">
                    <LuUsers className="mr-1 h-3 w-3" />
                      {company.noMutualConnections} followers
                  </span>) : (<span></span>)
                  }

                  {company.lastUpdated && (
                    <span className="flex items-center">
                      <div className="mr-1 h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
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
