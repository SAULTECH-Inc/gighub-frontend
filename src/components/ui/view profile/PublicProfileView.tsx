import React, { useRef, useState } from "react";
import { ASAbubakar, Bagged, Ellipse115, Ellipse116, Ellipse117 } from "../../../assets/images";
import { useParams } from "react-router-dom";
import { handleDownload, NetworkDetails, Review } from "../../../utils/types";
import { applicantNavBarItemMap, applicantNavItems, applicantNavItemsMobile } from "../../../utils/constants";
import TopNavBar from "../../layouts/TopNavBar";
import {
  FaBookmark,
  FaCalendar,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaComment,
  FaDownload,
  FaEnvelope,
  FaEye,
  FaFacebook,
  FaGithub,
  FaHeart,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaPrint,
  FaShare,
  FaStar,
  FaTimes,
  FaTwitter
} from "react-icons/fa";
import { useChatStore } from "../../../store/useChatStore.ts";
import DOMPurify from "dompurify";
import moment from "moment";
import { useApplicant } from "../../../hooks/useApplicant.ts";
import { useReviews } from "../../../hooks/useReviews.ts";
import { connectUser } from "../../../services/api";

interface SkillTagProps {
  skill: string;
  level?: string;
}

const SkillTag: React.FC<SkillTagProps> = ({ skill, level }) => (
  <span className="inline-flex items-center rounded-full border border-purple-200 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 text-xs font-medium text-purple-800 transition-shadow duration-200 hover:shadow-md">
    {skill}
    {level && <span className="ml-1 text-purple-600">• {level}</span>}
  </span>
);

const ExperienceCard: React.FC<{ experience: any; index: number }> = ({
                                                                        experience,
                                                                        index,
                                                                      }) => (
  <div
    key={index}
    className="group relative mb-4 rounded-xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-purple-200 hover:shadow-lg"
  >
    <div className="flex items-start gap-4">
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-md">
          <img src={Bagged} alt="Company" className="h-6 w-6" />
        </div>
        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-purple-600">
              {experience?.position}
            </h3>
            <p className="mb-2 text-sm font-medium text-gray-600">
              {experience?.company}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FaCalendar />
                {experience?.startDate
                  ? moment(experience.startDate).format("MMM YYYY")
                  : ""}{" "}
                -
                {experience?.endDate
                  ? moment(experience.endDate).format("MMM YYYY")
                  : "Present"}
              </span>
              <span className="font-medium text-green-600">
                {experience?.endDate
                  ? moment(experience.endDate).diff(
                  moment(experience.startDate),
                  "months"
                ) + " months"
                  : "Current"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-purple-600">
              <FaBookmark size={14} />
            </button>
            <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-purple-600">
              <FaShare size={14} />
            </button>
          </div>
        </div>

        {experience?.description && (
          <div
            className="prose prose-sm mt-3 max-w-none text-sm leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(experience.description),
            }}
          />
        )}
      </div>
    </div>
  </div>
);

const EducationCard: React.FC<{ education: any; index: number }> = ({
                                                                      education,
                                                                      index,
                                                                    }) => (
  <div
    key={index}
    className="group relative mb-4 rounded-xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-blue-200 hover:shadow-lg"
  >
    <div className="flex items-start gap-4">
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md">
          <img src={Bagged} alt="Institution" className="h-6 w-6" />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
              {education?.degree}
            </h3>
            <p className="mb-1 text-sm font-medium text-blue-600">
              {education?.fieldOfStudy}
            </p>
            <p className="mb-2 text-sm font-medium text-gray-600">
              {education?.institution}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FaCalendar />
                {education?.startDate
                  ? moment(education.startDate).format("YYYY")
                  : ""}{" "}
                -
                {education?.endDate
                  ? moment(education.endDate).format("YYYY")
                  : "Present"}
              </span>
              {education?.gpa && (
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  GPA: {education.gpa}
                </span>
              )}
            </div>
          </div>
        </div>

        {education?.description && (
          <div
            className="prose prose-sm mt-3 max-w-none text-sm leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(education.description),
            }}
          />
        )}
      </div>
    </div>
  </div>
);

const ReviewCard: React.FC<{ review: Review; index: number }> = ({
                                                                            review,
                                                                            index,
                                                                          }) => {
  const [liked, setLiked] = useState(review.liked);
  const images = [Ellipse115, Ellipse116, Ellipse117];

  return (
    <div
      key={index}
      className="group mb-4 rounded-xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-purple-200 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={review.authorImage || images[index % images.length]}
              alt={`${review.authorName}'s avatar`}
              className="h-10 w-10 rounded-full border-2 border-purple-200 object-cover"
            />
            <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              {review.authorName}
            </p>
            <p className="text-xs text-gray-500">{review.authorTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={12}
                className={
                  i < review.rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">{moment(review.time).fromNow()}</span>
        </div>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-gray-700">
        {review.content}
      </p>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-4">
          <button
            className={`flex items-center gap-2 text-xs transition-colors ${
              liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
            onClick={() => setLiked(!liked)}
          >
            <FaHeart className={liked ? "fill-current" : ""} />
            {liked ? review.likes + 1 : review.likes} likes
          </button>
          <button className="flex items-center gap-2 text-xs text-gray-500 transition-colors hover:text-blue-500">
            <FaComment />
            {review.replies} replies
          </button>
        </div>

        <button className="text-xs font-medium text-purple-600 hover:text-purple-700">
          View full testimonial
        </button>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600"></div>
      <p className="text-gray-600">Loading profile...</p>
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <span className="text-2xl text-red-600">⚠</span>
      </div>
      <h2 className="mb-2 text-xl font-bold text-gray-900">
        Profile Not Found
      </h2>
      <p className="mb-4 text-red-500">{error}</p>
      <button
        onClick={() => window.history.back()}
        className="rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors hover:bg-purple-700"
      >
        Go Back
      </button>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <span className="text-2xl text-gray-400">👤</span>
      </div>
      <h2 className="mb-2 text-xl font-bold text-gray-900">No Profile Found</h2>
      <p className="mb-4 text-gray-600">
        The profile you're looking for doesn't exist.
      </p>
      <button
        onClick={() => window.history.back()}
        className="rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors hover:bg-purple-700"
      >
        Go Back
      </button>
    </div>
  </div>
);

const PublicProfileView: React.FC = () => {
  const { setIsClosed, setRecipient, setRecipientDetails } = useChatStore();
  const { id } = useParams<{ id: string }>();
  const numericId = id ? parseInt(id, 10) : null;

  // Use the useUser hook directly - only runs if numericId is valid
  const { data: applicant, isLoading, error } = useApplicant(numericId as number);

  console.log("Debug Info:", {
    id,
    numericId,
    applicant,
    isLoading,
    error,
    hasData: !!applicant
  });

  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const [showAllEducations, setShowAllEducations] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewCount] = useState(847);
  const [connectionsSent, setConnectionsSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const {createReview, isCreating,    isCreateSuccess, reviews} = useReviews(numericId);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, t) => sum + t.rating, 0) / reviews.length
      : 0;
  const totalReviews = reviews.length;

  // Handle loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Handle error state
  if (error) {
    return <ErrorState error={error.message || "Failed to load profile"} />;
  }

  // Handle empty state
  if (!applicant) {
    return <EmptyState />;
  }

  const handleConnect = async() => {
    const res = await connectUser(applicant?.id || 0);
    if(res.statusCode === 200){
      setConnectionsSent(true);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Make API call to bookmark profile
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${applicant?.firstName} ${applicant?.lastName}'s Profile`,
          text: `Check out ${applicant?.firstName}'s professional profile`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmitReview = async() => {
    if (currentRating === 0 || !reviewText.trim()) {
      alert("Please provide a rating and review.");
      return;
    }

    const newTestimony = {
      content: reviewText,
      rating: currentRating,
      userId: applicant.id
    };
   createReview(newTestimony);
    if(isCreateSuccess){
      setShowReviewModal(false);
      setCurrentRating(0);
      setReviewText("");
    }
  };

  const location = [applicant?.city, applicant?.country]
    .filter(Boolean)
    .join(", ");

  const tabs = [
    { id: "overview", label: "Overview", count: null },
    {
      id: "experience",
      label: "Experience",
      count: applicant?.cv?.experiences?.length || 0,
    },
    {
      id: "education",
      label: "Education",
      count: applicant?.cv?.educations?.length || 0,
    },
    { id: "testimonials", label: "Testimonials", count: reviews.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar
        navItems={applicantNavItems}
        navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap}
      />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div
          ref={profileRef}
          className="overflow-hidden rounded-2xl bg-white shadow-xl"
        >
          {/* Hero Section */}
          <div className="relative">
            {/* Cover Image */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-4 right-4 flex gap-3">
                <button
                  onClick={handleBookmark}
                  className={`rounded-full p-3 backdrop-blur-sm transition-all ${
                    isBookmarked
                      ? "bg-yellow-500 text-white shadow-lg"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark profile"}
                >
                  <FaBookmark />
                </button>
                <button
                  onClick={handleShare}
                  className="rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30"
                  aria-label="Share profile"
                >
                  {copied ? <FaCheck /> : <FaShare />}
                </button>
                <button
                  onClick={handlePrint}
                  className="rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30"
                  aria-label="Print profile"
                >
                  <FaPrint />
                </button>
              </div>
            </div>

            {/* Profile Header */}
            <div className="relative px-8 pb-8">
              {/* Profile Image */}
              <div className="absolute -top-16 left-8">
                <div className="relative">
                  <img
                    src={ASAbubakar}
                    alt={`${applicant?.firstName} ${applicant?.lastName}`}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl"
                  />
                  <div className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full border-4 border-white bg-green-500"></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mb-8 flex justify-end gap-3 pt-4">
                <button
                  onClick={handleConnect}
                  disabled={connectionsSent}
                  className={`rounded-full px-6 py-3 font-semibold transition-all ${
                    connectionsSent
                      ? "cursor-not-allowed bg-gray-100 text-gray-500"
                      : "border-2 border-purple-600 bg-white text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  {connectionsSent ? "Request Sent" : "Connect"}
                </button>
                <button
                  onClick={() => {
                    setRecipient(applicant?.email || "");
                    setRecipientDetails(applicant as NetworkDetails);
                    setIsClosed(false);
                  }}
                  className="rounded-full bg-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-purple-700"
                >
                  Send Message
                </button>
              </div>

              {/* Profile Info */}
              <div className="ml-40 space-y-4">
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    {[
                      applicant?.firstName,
                      applicant?.middleName,
                      applicant?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </h1>
                  {applicant?.professionalTitle && (
                    <p className="mb-2 text-xl font-semibold text-purple-600">
                      {applicant.professionalTitle}
                    </p>
                  )}
                  <div className="mb-4 flex items-center gap-6 text-gray-600">
                    {location && (
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt />
                        <span>{location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FaEye />
                      <span>{viewCount.toLocaleString()} profile views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      <span>Available for opportunities</span>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-4">
                  {applicant.facebookProfile && (
                    <a
                      href={applicant.facebookProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-blue-100 p-3 text-blue-600 transition-all hover:scale-110 hover:bg-blue-200"
                      aria-label="Facebook profile"
                    >
                      <FaFacebook size={20} />
                    </a>
                  )}
                  {applicant.twitterProfile && (
                    <a
                      href={applicant.twitterProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-sky-100 p-3 text-sky-600 transition-all hover:scale-110 hover:bg-sky-200"
                      aria-label="Twitter profile"
                    >
                      <FaTwitter size={20} />
                    </a>
                  )}
                  {applicant.linkedInProfile && (
                    <a
                      href={applicant.linkedInProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-blue-100 p-3 text-blue-700 transition-all hover:scale-110 hover:bg-blue-200"
                      aria-label="LinkedIn profile"
                    >
                      <FaLinkedin size={20} />
                    </a>
                  )}
                  {applicant.githubProfile && (
                    <a
                      href={applicant.githubProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-gray-100 p-3 text-gray-700 transition-all hover:scale-110 hover:bg-gray-200"
                      aria-label="GitHub profile"
                    >
                      <FaGithub size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Contact Info Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                  {applicant.email && (
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-full bg-blue-100 p-3">
                          <FaEnvelope className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Email</h3>
                          <p className="text-sm text-gray-600">
                            Reach out directly
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-blue-600 break-all">
                        {applicant.email}
                      </p>
                    </div>
                  )}

                  {applicant.phoneNumber && (
                    <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-full bg-green-100 p-3">
                          <FaPhone className="text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Phone</h3>
                          <p className="text-sm text-gray-600">Call anytime</p>
                        </div>
                      </div>
                      <p className="font-medium text-green-600">
                        {applicant.phoneNumber}
                      </p>
                    </div>
                  )}

                  {applicant.address && (
                    <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-full bg-purple-100 p-3">
                          <FaMapMarkerAlt className="text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Location
                          </h3>
                          <p className="text-sm text-gray-600">Based in</p>
                        </div>
                      </div>
                      <p className="font-medium text-purple-600">
                        {applicant.address}
                      </p>
                    </div>
                  )}
                </div>

                {/* About Section */}
                {applicant.cv?.professionalSummary && (
                  <div className="rounded-xl bg-gray-50 p-6">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900">
                      About
                    </h2>
                    <div
                      className="prose prose-gray max-w-none leading-relaxed text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          applicant.cv.professionalSummary
                        ),
                      }}
                    />
                  </div>
                )}

                {/* Skills Section */}
                {applicant?.cv?.skills && applicant.cv.skills.length > 0 && (
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Skills & Technologies
                      </h2>
                      {applicant.cv.skills.length > 8 && (
                        <button
                          onClick={() => setShowAllSkills(!showAllSkills)}
                          className="flex items-center gap-2 font-medium text-purple-600 hover:text-purple-700"
                        >
                          {showAllSkills ? "Show Less" : "Show All"}
                          {showAllSkills ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {(showAllSkills
                          ? applicant.cv.skills
                          : applicant.cv.skills.slice(0, 8)
                      )?.map((skill: any, idx: number) => (
                        <SkillTag
                          key={idx}
                          skill={skill.skill || skill}
                          level={skill.level}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {applicant?.cv?.experiences?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      Years Experience
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {applicant?.cv?.educations?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Education</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {applicant?.cv?.skills?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Skills</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      98%
                    </div>
                    <div className="text-sm text-gray-600">Match Score</div>
                  </div>
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Professional Experience
                  </h2>
                  {applicant?.cv?.experiences &&
                    applicant.cv.experiences.length > 2 && (
                      <button
                        onClick={() =>
                          setShowAllExperiences(!showAllExperiences)
                        }
                        className="flex items-center gap-2 font-medium text-purple-600 hover:text-purple-700"
                      >
                        {showAllExperiences
                          ? "Show Less"
                          : `Show All (${applicant.cv.experiences.length})`}
                        {showAllExperiences ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </button>
                    )}
                </div>

                <div className="space-y-4">
                  {(showAllExperiences
                      ? applicant?.cv?.experiences
                      : applicant?.cv?.experiences?.slice(0, 2)
                  )?.map((experience, idx) => (
                    <ExperienceCard
                      key={idx}
                      experience={experience}
                      index={idx}
                    />
                  ))}
                </div>

                {!applicant?.cv?.experiences?.length && (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <span className="text-2xl text-gray-400">💼</span>
                    </div>
                    <p className="text-gray-500">
                      No work experience added yet
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === "education" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Education
                  </h2>
                  {applicant?.cv?.educations &&
                    applicant.cv.educations.length > 2 && (
                      <button
                        onClick={() => setShowAllEducations(!showAllEducations)}
                        className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
                      >
                        {showAllEducations
                          ? "Show Less"
                          : `Show All (${applicant.cv.educations.length})`}
                        {showAllEducations ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </button>
                    )}
                </div>

                <div className="space-y-4">
                  {(showAllEducations
                      ? applicant?.cv?.educations
                      : applicant?.cv?.educations?.slice(0, 2)
                  )?.map((education, idx) => (
                    <EducationCard
                      key={idx}
                      education={education}
                      index={idx}
                    />
                  ))}
                </div>

                {!applicant?.cv?.educations?.length && (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <span className="text-2xl text-gray-400">🎓</span>
                    </div>
                    <p className="text-gray-500">
                      No education history added yet
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === "testimonials" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Testimonials & Reviews
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => {
                          const starValue = i + 1;
                          if (starValue <= Math.floor(averageRating)) {
                            return (
                              <FaStar
                                key={i}
                                size={16}
                                className="text-yellow-400 fill-current"
                              />
                            );
                          } else if (
                            starValue === Math.ceil(averageRating) &&
                            averageRating % 1 >= 0.5
                          ) {
                            return (
                              <FaStar
                                key={i}
                                size={16}
                                className="text-yellow-400 fill-current"
                                style={{ width: "8px", overflow: "hidden" }}
                              />
                            );
                          } else {
                            return (
                              <FaStar
                                key={i}
                                size={16}
                                className="text-gray-300"
                              />
                            );
                          }
                        })}
                      </div>
                      <span className="text-sm text-gray-600">
                        {averageRating.toFixed(1)} ({totalReviews} reviews)
                      </span>
                    </div>
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700"
                    >
                      Write a Review
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review, idx) => (
                    <ReviewCard
                      key={idx}
                      review={review}
                      index={idx}
                    />
                  ))}
                </div>

                {reviews.length > 0 && (
                  <div className="mt-8 text-center">
                    <button className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50">
                      Load More Testimonials
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Floating Action Button */}
          <div className="fixed right-28 bottom-6 z-50">
            <button
              onClick={() => {
                setRecipient(applicant?.email || "");
                setRecipientDetails(applicant as NetworkDetails);
                setIsClosed(false);
              }}
              className="group flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-all hover:bg-purple-700 hover:shadow-xl"
              aria-label="Send message"
            >
              <FaEnvelope className="transition-transform group-hover:scale-110" />
            </button>
          </div>

          {/* Download CV Button */}
          {applicant?.cv?.cvLink && (
            <div className="fixed bottom-6 left-6 z-50">
              <button
                onClick={() =>
                  handleDownload({
                    fileUrl: applicant.cv.cvLink || "#",
                    fileName: `${applicant.firstName}_${applicant.lastName}_CV.pdf`,
                  })
                }
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
              >
                <FaDownload />
                <span className="hidden sm:inline">Download CV</span>
              </button>
            </div>
          )}
        </div>

        {/* Suggested Profiles */}
        {/*<div className="mt-8 rounded-2xl bg-white p-8 shadow-xl">*/}
        {/*  <h3 className="mb-6 text-xl font-bold text-gray-900">*/}
        {/*    People You May Know*/}
        {/*  </h3>*/}
        {/*  <div className="grid gap-6 md:grid-cols-3">*/}
        {/*    {[...Array(3)].map((_, idx) => (*/}
        {/*      <div*/}
        {/*        key={idx}*/}
        {/*        className="group cursor-pointer rounded-xl bg-gray-50 p-6 transition-colors hover:bg-gray-100"*/}
        {/*      >*/}
        {/*        <div className="mb-4 flex items-center gap-4">*/}
        {/*          <img*/}
        {/*            src={[Ellipse115, Ellipse116, Ellipse117][idx]}*/}
        {/*            alt={`Suggested ${idx + 1}`}*/}
        {/*            className="h-12 w-12 rounded-full object-cover"*/}
        {/*          />*/}
        {/*          <div>*/}
        {/*            <h4 className="font-semibold text-gray-900">*/}
        {/*              John Developer*/}
        {/*            </h4>*/}
        {/*            <p className="text-sm text-gray-600">*/}
        {/*              Full Stack Developer*/}
        {/*            </p>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*        <div className="flex gap-2">*/}
        {/*          <button className="flex-1 rounded-lg bg-purple-600 py-2 text-sm text-white transition-colors hover:bg-purple-700">*/}
        {/*            Connect*/}
        {/*          </button>*/}
        {/*          <button className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 transition-colors hover:bg-gray-50">*/}
        {/*            <FaEye />*/}
        {/*          </button>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed right-6 bottom-24 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white opacity-0 shadow-lg transition-all hover:bg-gray-900 hover:opacity-100 hover:shadow-xl focus:opacity-100"
          style={{
            opacity:
              typeof window !== "undefined" && window.scrollY > 300 ? 1 : 0,
          }}
          aria-label="Back to top"
        >
          <FaChevronUp />
        </button>
      </div>

      {/* Toast Notifications */}
      {copied && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-white shadow-lg animate-fade-in">
          <FaCheck />
          <span>Profile link copied to clipboard!</span>
        </div>
      )}

      {connectionsSent && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-white shadow-lg animate-fade-in">
          <FaCheck />
          <span>Connection request sent!</span>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Write a Review
              </h2>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setCurrentRating(0);
                  setReviewText("");
                }}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="space-y-4 py-4">
              <div>
                <p className="mb-2 font-medium text-gray-700">
                  Rate this candidate (1-5 stars)
                </p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={24}
                      className={`cursor-pointer transition-colors ${
                        i < currentRating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      } hover:text-yellow-400`}
                      onClick={() => setCurrentRating(i + 1)}
                    />
                  ))}
                </div>
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this candidate..."
                className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setCurrentRating(0);
                  setReviewText("");
                }}
                className="rounded-lg px-4 py-2 text-gray-600 transition-colors hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={currentRating === 0 || !reviewText.trim()}
                className="rounded-lg bg-purple-600 px-6 py-2 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 disabled:hover:bg-gray-300 transition-colors"
              >
                {
                  isCreating && "Submitting..."
                }
                {
                  isCreateSuccess && "Submitted"
                }
                {
                  !isCreating && !isCreateSuccess &&  "Submit"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProfileView;
