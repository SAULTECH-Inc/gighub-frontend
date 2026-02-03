import React, { useState } from "react";
import {
    Briefcase,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    Clock,
    Download,
    Eye,
    FileText,
    Globe,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Search,
    Star,
    Target,
    TrendingUp,
    Users,
    X,
    XCircle,
    Award,
    GraduationCap,
    Code,
    Loader2,
    AlertCircle,
} from "lucide-react";
import {
    useApplications,
    useApplication,
    useUpdateApplicationStatus,
    useDownloadResume,
    useMatchDetails,
    usePrefetchApplication,
    useApplicationStats,
    type Application,
} from "../../hooks/useApplications.ts";

// Full Profile Modal Component
const FullProfileModal: React.FC<{
    applicationId: number;
    onClose: () => void;
}> = ({ applicationId, onClose }) => {
    const { data: application, isLoading, error } = useApplication(applicationId);

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
                <div className="rounded-3xl bg-white p-8 shadow-2xl">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
                <div className="rounded-3xl bg-white p-8 shadow-2xl text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
                    <p className="mt-4 text-lg font-semibold text-gray-900">Failed to load profile</p>
                    <button
                        onClick={onClose}
                        className="mt-4 rounded-xl bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="rounded-xl bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Full Profile</h2>
                            <p className="text-blue-100">{application.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-8" style={{ maxHeight: "calc(90vh - 100px)" }}>
                    {/* Profile Header */}
                    <div className="mb-8 flex items-start gap-6">
                        <img
                            src={
                                application.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(application.name)}&background=random&size=120`
                            }
                            alt={application.name}
                            className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                        />
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900">{application.name}</h3>
                            <p className="mt-1 text-lg text-gray-600">{application.position}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    <a href={`mailto:${application.email}`} className="hover:text-blue-600">
                                        {application.email}
                                    </a>
                                </div>
                                {application.phone && (
                                    <div className="flex items-center gap-1">
                                        <Phone className="h-4 w-4" />
                                        <a href={`tel:${application.phone}`} className="hover:text-blue-600">
                                            {application.phone}
                                        </a>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{application.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Briefcase className="h-4 w-4" />
                                    <span>{application.experience}</span>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                {application.linkedin && (
                                    <a
                                        href={application.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                    >
                                        <Linkedin className="h-4 w-4" />
                                        LinkedIn
                                    </a>
                                )}
                                {application.portfolio && (
                                    <a
                                        href={application.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
                                    >
                                        <Globe className="h-4 w-4" />
                                        Portfolio
                                    </a>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2">
                                <Star className="h-5 w-5 fill-current text-white" />
                                <span className="text-xl font-bold text-white">{application?.matchScore}%</span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">Match Score</p>
                        </div>
                    </div>

                    {/* Summary */}
                    {application?.summary && (
                        <div className="mb-8 rounded-2xl bg-gray-50 p-6">
                            <h4 className="mb-3 text-lg font-semibold text-gray-900">Professional Summary</h4>
                            <p className="leading-relaxed text-gray-700">{application?.summary}</p>
                        </div>
                    )}

                    {/* Skills */}
                    <div className="mb-8">
                        <div className="mb-4 flex items-center gap-2">
                            <Code className="h-5 w-5 text-purple-600" />
                            <h4 className="text-lg font-semibold text-gray-900">Skills</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {application?.skills?.map((skill, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center rounded-xl bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700"
                                >
                  {skill}
                </span>
                            ))}
                        </div>
                    </div>

                    {/* Work History */}
                    {application.workHistory && application.workHistory.length > 0 && (
                        <div className="mb-8">
                            <div className="mb-4 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                                <h4 className="text-lg font-semibold text-gray-900">Work Experience</h4>
                            </div>
                            <div className="space-y-4">
                                {application.workHistory.map((job, index) => (
                                    <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h5 className="text-lg font-semibold text-gray-900">{job.title}</h5>
                                                <p className="text-md text-gray-600">{job.company}</p>
                                            </div>
                                            <span className="text-sm text-gray-500">{job.duration}</span>
                                        </div>
                                        <p className="mt-3 text-gray-700">{job.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {application.education && application.education.length > 0 && (
                        <div className="mb-8">
                            <div className="mb-4 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-green-600" />
                                <h4 className="text-lg font-semibold text-gray-900">Education</h4>
                            </div>
                            <div className="space-y-3">
                                {application.education.map((edu, index) => (
                                    <div key={index} className="rounded-xl border border-gray-200 bg-white p-4">
                                        <h5 className="font-semibold text-gray-900">{edu.degree}</h5>
                                        <p className="text-sm text-gray-600">{edu.institution}</p>
                                        <p className="text-sm text-gray-500">{edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    {application.certifications && application.certifications.length > 0 && (
                        <div className="mb-8">
                            <div className="mb-4 flex items-center gap-2">
                                <Award className="h-5 w-5 text-orange-600" />
                                <h4 className="text-lg font-semibold text-gray-900">Certifications</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {application.certifications.map((cert, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center rounded-xl bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700"
                                    >
                    {cert}
                  </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {application.languages && application.languages.length > 0 && (
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <Globe className="h-5 w-5 text-teal-600" />
                                <h4 className="text-lg font-semibold text-gray-900">Languages</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {application.languages.map((lang, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center rounded-xl bg-teal-100 px-4 py-2 text-sm font-medium text-teal-700"
                                    >
                    {lang}
                  </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Resume Viewer Modal Component
const ResumeViewerModal: React.FC<{
    application: Application;
    onClose: () => void;
}> = ({ application, onClose }) => {
    const downloadResume = useDownloadResume();

    const handleDownload = () => {
        downloadResume.mutate(application.id);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-indigo-600 px-8 py-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="rounded-xl bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Resume</h2>
                            <p className="text-indigo-100">{application.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            disabled={downloadResume.isPending}
                            className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30 disabled:opacity-50"
                        >
                            {downloadResume.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            Download
                        </button>
                        <button
                            onClick={onClose}
                            className="rounded-xl bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Resume Content */}
                <div className="overflow-y-auto bg-gray-100 p-8" style={{ maxHeight: "calc(90vh - 100px)" }}>
                    {application.resumeUrl ? (
                        <div className="rounded-2xl bg-white shadow-lg">
                            <iframe
                                src={application.resumeUrl}
                                className="h-[700px] w-full rounded-2xl"
                                title={`${application.name} Resume`}
                            />
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
                            <FileText className="mx-auto h-16 w-16 text-gray-400" />
                            <h3 className="mt-4 text-xl font-semibold text-gray-900">Resume Preview</h3>
                            <p className="mt-2 text-gray-600">
                                Resume file for {application.name} would be displayed here.
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                In a production environment, this would show a PDF viewer or document preview.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Match Details Modal Component
const MatchDetailsModal: React.FC<{
    applicationId: number;
    matchScore: number;
    candidateName: string;
    onClose: () => void;
}> = ({ applicationId, matchScore, candidateName, onClose }) => {
    const { data: matchDetails, isLoading, error } = useMatchDetails(applicationId);

    const matchCategories = matchDetails
        ? [
            { name: "Skills", score: matchDetails.skillsMatch, icon: Code, color: "purple" },
            { name: "Experience", score: matchDetails.experienceMatch, icon: Briefcase, color: "blue" },
            { name: "Location", score: matchDetails.locationMatch, icon: MapPin, color: "green" },
            { name: "Education", score: matchDetails.educationMatch, icon: GraduationCap, color: "orange" },
        ]
        : [];

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-green-600 bg-green-100";
        if (score >= 75) return "text-blue-600 bg-blue-100";
        if (score >= 60) return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="rounded-xl bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Match Analysis</h2>
                            <p className="text-purple-100">{candidateName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white">{matchScore}%</div>
                            <div className="text-sm text-purple-100">Overall Match</div>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-xl bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-8" style={{ maxHeight: "calc(90vh - 120px)" }}>
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-12">
                            <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
                            <p className="mt-4 text-lg font-semibold text-gray-900">Failed to load match details</p>
                        </div>
                    )}

                    {matchDetails && (
                        <>
                            {/* Match Categories */}
                            <div className="mb-8">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Category Breakdown</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {matchCategories.map((category, index) => {
                                        const Icon = category.icon;
                                        return (
                                            <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`h-5 w-5 text-${category.color}-600`} />
                                                        <span className="font-medium text-gray-900">{category.name}</span>
                                                    </div>
                                                    <span className={`rounded-lg px-3 py-1 text-sm font-bold ${getScoreColor(category.score)}`}>
                            {category.score}%
                          </span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                                    <div
                                                        className={`h-full rounded-full bg-${category.color}-600 transition-all duration-500`}
                                                        style={{ width: `${category.score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Matching Skills */}
                            {matchDetails.matchingSkills.length > 0 && (
                                <div className="mb-8">
                                    <div className="mb-4 flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">Matching Skills</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {matchDetails.matchingSkills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 rounded-xl bg-green-100 px-4 py-2 text-sm font-medium text-green-700"
                                            >
                        <CheckCircle className="h-3 w-3" />
                                                {skill}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Missing Skills */}
                            {matchDetails.missingSkills.length > 0 && (
                                <div className="mb-8">
                                    <div className="mb-4 flex items-center gap-2">
                                        <Target className="h-5 w-5 text-orange-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">Skills to Develop</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {matchDetails.missingSkills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 rounded-xl bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700"
                                            >
                        <Target className="h-3 w-3" />
                                                {skill}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Strengths */}
                            {matchDetails.strengths.length > 0 && (
                                <div className="mb-8">
                                    <div className="mb-4 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-blue-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">Key Strengths</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {matchDetails.strengths.map((strength, index) => (
                                            <div key={index} className="flex items-start gap-3 rounded-xl bg-blue-50 p-4">
                                                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                                                <p className="text-gray-700">{strength}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Concerns */}
                            {matchDetails.concerns.length > 0 && (
                                <div>
                                    <div className="mb-4 flex items-center gap-2">
                                        <XCircle className="h-5 w-5 text-yellow-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">Areas for Discussion</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {matchDetails.concerns.map((concern, index) => (
                                            <div key={index} className="flex items-start gap-3 rounded-xl bg-yellow-50 p-4">
                                                <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                                                <p className="text-gray-700">{concern}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Main Applications Review Modal Component
export const ApplicationsReviewModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
                                                                                                isOpen,
                                                                                                onClose,
                                                                                            }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedPosition, setSelectedPosition] = useState<string>("all");
    const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
    const [activeModal, setActiveModal] = useState<"profile" | "resume" | "match" | null>(null);
    const [resumeApplication, setResumeApplication] = useState<Application | null>(null);
    const [matchApplication, setMatchApplication] = useState<{
        id: number;
        name: string;
        score: number;
    } | null>(null);

    // React Query hooks
    const { data: applications = [], isLoading, error, refetch } = useApplications({
        searchQuery,
        status: selectedStatus,
        position: selectedPosition,
    });

    const updateStatus = useUpdateApplicationStatus();
    const prefetchApplication = usePrefetchApplication();
    const stats = useApplicationStats();

    if (!isOpen) return null;

    const getStatusColor = (status: string) => {
        const colors = {
            new: "bg-blue-100 text-blue-700 border-blue-200",
            reviewing: "bg-yellow-100 text-yellow-700 border-yellow-200",
            interviewing: "bg-purple-100 text-purple-700 border-purple-200",
            hired: "bg-green-100 text-green-700 border-green-200",
            rejected: "bg-red-100 text-red-700 border-red-200",
        };
        return colors[status as keyof typeof colors] || colors.new;
    };

    const handleOpenModal = (
        application: Application,
        modalType: "profile" | "resume" | "match"
    ) => {
        if (modalType === "profile") {
            setSelectedApplicationId(application.id);
        } else if (modalType === "resume") {
            setResumeApplication(application);
        } else if (modalType === "match") {
            setMatchApplication({
                id: application.id,
                name: application.name,
                score: application.matchScore,
            });
        }
        setActiveModal(modalType);
    };

    const handleCloseModal = () => {
        setActiveModal(null);
        setSelectedApplicationId(null);
        setResumeApplication(null);
        setMatchApplication(null);
    };

    const handleStatusChange = (applicationId: number, newStatus: "hired" | "rejected") => {
        updateStatus.mutate(
            { applicationId, status: newStatus },
            {
                onSuccess: () => {
                    // Optional: Show success toast notification
                    console.log(`Application ${applicationId} status updated to ${newStatus}`);
                },
                onError: (error) => {
                    // Optional: Show error toast notification
                    console.error("Failed to update status:", error);
                },
            }
        );
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="relative w-full max-w-7xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Review Applications</h2>
                            <p className="mt-1 text-purple-100">
                                {isLoading
                                    ? "Loading..."
                                    : `${applications.length} application${applications.length !== 1 ? "s" : ""} to review`}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-xl bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="border-b border-gray-200 bg-gray-50 px-8 py-4">
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Search */}
                            <div className="relative flex-1 min-w-[250px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="new">New ({stats.new})</option>
                                    <option value="reviewing">Reviewing ({stats.reviewing})</option>
                                    <option value="interviewing">Interviewing ({stats.interviewing})</option>
                                    <option value="hired">Hired ({stats.hired})</option>
                                    <option value="rejected">Rejected ({stats.rejected})</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>

                            {/* Position Filter */}
                            <div className="relative">
                                <select
                                    value={selectedPosition}
                                    onChange={(e) => setSelectedPosition(e.target.value)}
                                    className="appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                                >
                                    <option value="all">All Positions</option>
                                    <option value="Senior Software Engineer">Senior Software Engineer</option>
                                    <option value="Product Manager">Product Manager</option>
                                    <option value="UX Designer">UX Designer</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={() => refetch()}
                                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto p-8" style={{ maxHeight: "calc(90vh - 180px)" }}>
                        {isLoading && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                                <span className="ml-3 text-gray-600">Loading applications...</span>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-12">
                                <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
                                <p className="mt-4 text-lg font-semibold text-gray-900">Failed to load applications</p>
                                <button
                                    onClick={() => refetch()}
                                    className="mt-4 rounded-xl bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {!isLoading && !error && (
                            <div className="space-y-4">
                                {applications.map((application) => (
                                    <div
                                        key={application.id}
                                        className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-purple-200 hover:shadow-lg"
                                        onMouseEnter={() => prefetchApplication(application.id)}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Avatar */}
                                            <img
                                                src={
                                                    application.avatar ||
                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(application.name)}&background=random`
                                                }
                                                alt={application.name}
                                                className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow-md"
                                            />

                                            {/* Details */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                                                            {application.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">{application.position}</p>
                                                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                                            <Mail className="h-3 w-3" />
                                                            <span>{application.email}</span>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusColor(application.status)}`}
                                                    >
                            {application.status}
                          </span>
                                                </div>

                                                <div className="mt-3 flex items-center gap-6 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{application.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Briefcase className="h-4 w-4" />
                                                        <span>{application.experience}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        <span>Applied {application.appliedDate}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between">
                                                    <button
                                                        onClick={() => handleOpenModal(application, "match")}
                                                        className="group/match flex items-center gap-2 transition-all"
                                                    >
                                                        <Star className="h-5 w-5 fill-current text-yellow-400" />
                                                        <span className="text-sm font-semibold text-gray-900 group-hover/match:text-purple-600">
                              {application?.matchScore}% match
                            </span>
                                                    </button>
                                                    <div className="flex flex-wrap gap-2">
                                                        {application?.skills?.slice(0, 3).map((skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700"
                                                            >
                                {skill}
                              </span>
                                                        ))}
                                                        {application?.skills?.length > 3 && (
                                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                +{application.skills.length - 3} more
                              </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                                    <button
                                                        onClick={() => handleStatusChange(application.id, "hired")}
                                                        disabled={updateStatus.isPending}
                                                        className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 hover:shadow-lg disabled:opacity-50"
                                                    >
                                                        {updateStatus.isPending ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="h-4 w-4" />
                                                        )}
                                                        <span>Accept</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(application.id, "rejected")}
                                                        disabled={updateStatus.isPending}
                                                        className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 hover:shadow-lg disabled:opacity-50"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                        <span>Reject</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenModal(application, "profile")}
                                                        className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-purple-300 hover:text-purple-600"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        <span>View Profile</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenModal(application, "resume")}
                                                        className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                        <span>Resume</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {!isLoading && applications.length === 0 && (
                                    <div className="py-16 text-center">
                                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-4 text-lg font-medium text-gray-900">No applications found</p>
                                        <p className="mt-1 text-sm text-gray-600">Try adjusting your filters or search criteria</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Nested Modals */}
            {activeModal === "profile" && selectedApplicationId && (
                <FullProfileModal applicationId={selectedApplicationId} onClose={handleCloseModal} />
            )}
            {activeModal === "resume" && resumeApplication && (
                <ResumeViewerModal application={resumeApplication} onClose={handleCloseModal} />
            )}
            {activeModal === "match" && matchApplication && (
                <MatchDetailsModal
                    applicationId={matchApplication.id}
                    matchScore={matchApplication.score}
                    candidateName={matchApplication.name}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};
