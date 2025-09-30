import React, { useEffect, useState, useRef } from "react";
import {
  ASAbubakar,
  Bagged,
  Ellipse115,
  Ellipse116,
  Ellipse117,
} from "../../../assets/images";
import { useParams } from "react-router-dom";
import { privateApiClient } from "../../../client/axios";
import {
  APIResponse,
  ApplicantData,
  NetworkDetails,
} from "../../../utils/types";
import {
  API_BASE_URL,
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
} from "../../../utils/constants";
import TopNavBar from "../../layouts/TopNavBar";
import {
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaDownload,
  FaShare,
  FaBookmark,
  FaEye,
  FaCalendar,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaPrint,
  FaCheck,
  FaHeart,
  FaComment,
} from "react-icons/fa";
import { useChatStore } from "../../../store/useChatStore.ts";
import DOMPurify from "dompurify";
import moment from "moment";

interface SkillTagProps {
  skill: string;
  level?: string;
}

const SkillTag: React.FC<SkillTagProps> = ({ skill, level }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200 hover:shadow-md transition-shadow duration-200">
    {skill}
    {level && <span className="ml-1 text-purple-600">• {level}</span>}
  </span>
);

const ExperienceCard: React.FC<{ experience: any; index: number }> = ({ experience, index }) => (
  <div key={index} className="group relative bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 p-6 mb-4">
    <div className="flex items-start gap-4">
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-md">
          <img src={Bagged} alt="Company" className="w-6 h-6" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
              {experience?.position}
            </h3>
            <p className="text-sm font-medium text-gray-600 mb-2">
              {experience?.company}
            </p>
            <div className="flex items-center text-xs text-gray-500 gap-4">
              <span className="flex items-center gap-1">
                <FaCalendar />
                {experience?.startDate ? moment(experience.startDate).format("MMM YYYY") : ""} -
                {experience?.endDate ? moment(experience.endDate).format("MMM YYYY") : "Present"}
              </span>
              <span className="text-green-600 font-medium">
                {experience?.endDate ?
                  moment(experience.endDate).diff(moment(experience.startDate), 'months') + ' months' :
                  'Current'
                }
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-purple-600">
              <FaBookmark size={14} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-purple-600">
              <FaShare size={14} />
            </button>
          </div>
        </div>

        <div
          className="mt-3 text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(experience?.description || ""),
          }}
        />
      </div>
    </div>
  </div>
);

const EducationCard: React.FC<{ education: any; index: number }> = ({ education, index }) => (
  <div key={index} className="group relative bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 p-6 mb-4">
    <div className="flex items-start gap-4">
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md">
          <img src={Bagged} alt="Institution" className="w-6 h-6" />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {education?.degree}
            </h3>
            <p className="text-sm font-medium text-blue-600 mb-1">
              {education?.fieldOfStudy}
            </p>
            <p className="text-sm font-medium text-gray-600 mb-2">
              {education?.institution}
            </p>
            <div className="flex items-center text-xs text-gray-500 gap-4">
              <span className="flex items-center gap-1">
                <FaCalendar />
                {education?.startDate ? moment(education.startDate).format("YYYY") : ""} -
                {education?.endDate ? moment(education.endDate).format("YYYY") : "Present"}
              </span>
              {education?.gpa && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  GPA: {education.gpa}
                </span>
              )}
            </div>
          </div>
        </div>

        {education?.description && (
          <div
            className="mt-3 text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(education?.description || ""),
            }}
          />
        )}
      </div>
    </div>
  </div>
);

const TestimonyCard: React.FC<{ testimony?: any; index: number }> = ({index }) => {
  const [liked, setLiked] = useState(false);
  const images = [Ellipse115, Ellipse116, Ellipse117];

  return (
    <div key={index} className="group bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-300 p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={images[index % images.length]}
              alt={`Testimonial ${index + 1}`}
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Bashir Umar</p>
            <p className="text-xs text-gray-500">Senior Developer at TechCorp</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={12} />
            ))}
          </div>
          <span className="text-xs text-gray-500">2:20 AM</span>
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        "I really love his work ethic and attention to detail. He's that smart, reliable developer you may be searching for. His problem-solving skills are exceptional!"
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button
            className={`flex items-center gap-2 text-xs transition-colors ${
              liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
            onClick={() => setLiked(!liked)}
          >
            <FaHeart className={liked ? 'fill-current' : ''} />
            {liked ? '24' : '23'} likes
          </button>
          <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-500 transition-colors">
            <FaComment />
            3 replies
          </button>
        </div>

        <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">
          View full testimonial
        </button>
      </div>
    </div>
  );
};

const PublicProfileView: React.FC = () => {
  const { setIsClosed, setRecipient, setRecipientDetails } = useChatStore();
  const { id } = useParams<{ id: string }>();
  const numericId = id ? parseInt(id, 10) : null;
  const [applicant, setApplicant] = useState<ApplicantData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const [showAllEducations, setShowAllEducations] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewCount, setViewCount] = useState(847);
  const [connectionsSent, setConnectionsSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const response = await privateApiClient.get<APIResponse<ApplicantData>>(
          `${API_BASE_URL}/users/${numericId}`,
        );
        const userData: ApplicantData = response?.data?.data;
        setApplicant(userData);
        // Increment view count
        setViewCount(prev => prev + 1);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApplicant().then((r) => r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleConnect = () => {
    setConnectionsSent(true);
    // Here you would typically make an API call
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically make an API call
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
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-600">⚠</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-gray-400">👤</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Profile Found</h2>
          <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  let location = "";
  if (applicant?.city) location += `${applicant.city}`;
  if (applicant?.country) location += `${applicant.city ? ', ' : ''}${applicant.country}`;

  const tabs = [
    { id: 'overview', label: 'Overview', count: null },
    { id: 'experience', label: 'Experience', count: applicant?.cv?.experiences?.length || 0 },
    { id: 'education', label: 'Education', count: applicant?.cv?.educations?.length || 0 },
    { id: 'testimonials', label: 'Testimonials', count: 3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar
        navItems={applicantNavItems}
        navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div ref={profileRef} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="relative">
            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-4 right-4 flex gap-3">
                <button
                  onClick={handleBookmark}
                  className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                    isBookmarked
                      ? 'bg-yellow-500 text-white shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FaBookmark />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
                >
                  {copied ? <FaCheck /> : <FaShare />}
                </button>
                <button
                  onClick={handlePrint}
                  className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
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
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 mb-8">
                <button
                  onClick={handleConnect}
                  disabled={connectionsSent}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    connectionsSent
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {connectionsSent ? 'Request Sent' : 'Connect'}
                </button>
                <button
                  onClick={() => {
                    setRecipient(applicant?.email || "");
                    setRecipientDetails(applicant as NetworkDetails);
                    setIsClosed(false);
                  }}
                  className="px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all shadow-lg"
                >
                  Send Message
                </button>
              </div>

              {/* Profile Info */}
              <div className="ml-40 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {applicant?.firstName} {applicant?.middleName} {applicant?.lastName}
                  </h1>
                  <p className="text-xl text-purple-600 font-semibold mb-2">
                    {applicant?.professionalTitle}
                  </p>
                  <div className="flex items-center gap-6 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt />
                      <span>{location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEye />
                      <span>{viewCount.toLocaleString()} profile views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
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
                      className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all hover:scale-110"
                    >
                      <FaFacebook size={20} />
                    </a>
                  )}
                  {applicant.twitterProfile && (
                    <a
                      href={applicant.twitterProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-600 transition-all hover:scale-110"
                    >
                      <FaTwitter size={20} />
                    </a>
                  )}
                  {applicant.linkedInProfile && (
                    <a
                      href={applicant.linkedInProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-all hover:scale-110"
                    >
                      <FaLinkedin size={20} />
                    </a>
                  )}
                  {applicant.githubProfile && (
                    <a
                      href={applicant.githubProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all hover:scale-110"
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
                  className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">
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
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Contact Info Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 rounded-full bg-blue-100">
                        <FaEnvelope className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Email</h3>
                        <p className="text-sm text-gray-600">Reach out directly</p>
                      </div>
                    </div>
                    <p className="text-blue-600 font-medium">{applicant.email}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 rounded-full bg-green-100">
                        <FaPhone className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Phone</h3>
                        <p className="text-sm text-gray-600">Call anytime</p>
                      </div>
                    </div>
                    <p className="text-green-600 font-medium">{applicant.phoneNumber}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 rounded-full bg-purple-100">
                        <FaMapMarkerAlt className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Location</h3>
                        <p className="text-sm text-gray-600">Based in</p>
                      </div>
                    </div>
                    <p className="text-purple-600 font-medium">{applicant.address}</p>
                  </div>
                </div>

                {/* About Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                  <div
                    className="text-gray-700 leading-relaxed prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(applicant.cv?.professionalSummary || ""),
                    }}
                  />
                </div>

                {/* Skills Section */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Skills & Technologies</h2>
                    {applicant?.cv?.skills && applicant.cv.skills.length > 8 && (
                      <button
                        onClick={() => setShowAllSkills(!showAllSkills)}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                      >
                        {showAllSkills ? 'Show Less' : 'Show All'}
                        {showAllSkills ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {(showAllSkills
                        ? applicant?.cv?.skills
                        : applicant?.cv?.skills?.slice(0, 8)
                    )?.map((skill: any, idx: number) => (
                      <SkillTag
                        key={idx}
                        skill={skill.skill || skill}
                        level={skill.level}
                      />
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">
                      {applicant?.cv?.experiences?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      {applicant?.cv?.educations?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Education</div>
                  </div>
                  <div className="text-center p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">
                      {applicant?.cv?.skills?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Skills</div>
                  </div>
                  <div className="text-center p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">98%</div>
                    <div className="text-sm text-gray-600">Match Score</div>
                  </div>
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Professional Experience</h2>
                  {applicant?.cv?.experiences && applicant.cv.experiences.length > 2 && (
                    <button
                      onClick={() => setShowAllExperiences(!showAllExperiences)}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      {showAllExperiences ? 'Show Less' : `Show All (${applicant.cv.experiences.length})`}
                      {showAllExperiences ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {(showAllExperiences
                      ? applicant?.cv?.experiences
                      : applicant?.cv?.experiences?.slice(0, 2)
                  )?.map((experience, idx) => (
                    <ExperienceCard key={idx} experience={experience} index={idx} />
                  ))}
                </div>

                {!applicant?.cv?.experiences?.length && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-gray-400">💼</span>
                    </div>
                    <p className="text-gray-500">No work experience added yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                  {applicant?.cv?.educations && applicant.cv.educations.length > 2 && (
                    <button
                      onClick={() => setShowAllEducations(!showAllEducations)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {showAllEducations ? 'Show Less' : `Show All (${applicant.cv.educations.length})`}
                      {showAllEducations ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {(showAllEducations
                      ? applicant?.cv?.educations
                      : applicant?.cv?.educations?.slice(0, 2)
                  )?.map((education, idx) => (
                    <EducationCard key={idx} education={education} index={idx} />
                  ))}
                </div>

                {!applicant?.cv?.educations?.length && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-gray-400">🎓</span>
                    </div>
                    <p className="text-gray-500">No education history added yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === 'testimonials' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Testimonials & Reviews</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} size={16} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">4.9 (12 reviews)</span>
                    </div>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                      Write a Review
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {[...Array(3)].map((_, idx) => (
                    <TestimonyCard key={idx} index={idx} />
                  ))}
                </div>

                <div className="text-center mt-8">
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Load More Testimonials
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Floating Action Button */}
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => {
                setRecipient(applicant?.email || "");
                setRecipientDetails(applicant as NetworkDetails);
                setIsClosed(false);
              }}
              className="w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
            >
              <FaEnvelope className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Download CV Button */}
          <div className="fixed bottom-6 left-6 z-50">
            <button
              onClick={() => {
                // Handle CV download logic here
                console.log('Downloading CV...');
              }}
              className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200"
            >
              <FaDownload />
              <span className="hidden sm:inline">Download CV</span>
            </button>
          </div>
        </div>

        {/* Suggested Profiles */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">People You May Know</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={[Ellipse115, Ellipse116, Ellipse117][idx]}
                    alt={`Suggested ${idx + 1}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">John Developer</h4>
                    <p className="text-sm text-gray-600">Full Stack Developer</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    Connect
                  </button>
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 w-12 h-12 bg-gray-800 hover:bg-gray-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100"
          style={{
            opacity: typeof window !== 'undefined' && window.scrollY > 300 ? 1 : 0
          }}
        >
          <FaChevronUp />
        </button>
      </div>

      {/* Toast Notification */}
      {copied && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <FaCheck />
          <span>Profile link copied to clipboard!</span>
        </div>
      )}

      {connectionsSent && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <FaCheck />
          <span>Connection request sent!</span>
        </div>
      )}
    </div>
  );
};

export default PublicProfileView;
