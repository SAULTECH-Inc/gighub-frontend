import useModalStore from "../../store/modalStateStores.ts";
import {
  X,
  MapPin,
  Clock,
  Calendar,
  Monitor,
  ExternalLink,
  Download,
  Share2,
  Bell,
  Copy,
  CheckCircle,
  Users,
  MessageCircle,
  FileText,
  Phone,
  Video,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  Star,
  Loader2,
} from "lucide-react";
import profilepics from "../../assets/images/profilepics.png";
import React, { useState, useEffect } from "react";
import { InterviewScheduleDetailsResponse } from "../../utils/types";
import moment from "moment";
import {
  capitalizeEachCase,
  formatTime,
  USER_TYPE,
} from "../../utils/helpers.ts";
import { Link } from "react-router-dom";
import {
  cancelInterview,
  rescheduleInterview,
  setInterviewReminder,
  withdrawApplication,
} from "../../services/api";
import { useAuth } from "../../store/useAuth.ts";
import { UserType } from "../../utils/enums.ts";
import { createPortal } from "react-dom";
import { useChatStore } from "../../store/useChatStore.ts";

interface ModalProps {
  modalId: string;
  selectedEvent: InterviewScheduleDetailsResponse;
}

const ApplicantScheduleModal: React.FC<ModalProps> = ({
  modalId,
  selectedEvent,
}) => {
  const { modals, closeModal } = useModalStore();
  const { userType } = useAuth();
  const { setIsClosed, setIsMinimized, setRecipient } = useChatStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [reminder, setReminder] = useState("15_MIN_BEFORE");
  const [checklist, setChecklist] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [notes, setNotes] = useState("");
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "cancel" | "withdraw" | "reschedule";
    message: string;
  } | null>(null);

  // Loading states
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isSettingReminder, setIsSettingReminder] = useState(false);

  // Feedback states
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load saved data on mount
  useEffect(() => {
    const savedChecklist = localStorage.getItem(
      `checklist-${selectedEvent?.id}`,
    );
    const savedNotes = localStorage.getItem(`notes-${selectedEvent?.id}`);

    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    }
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [selectedEvent?.id]);

  // Show feedback messages
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  const handleWithdrawApplication = (jobId: number) => {
    setIsWithdrawing(true);
    setErrorMessage("");

    withdrawApplication(jobId)
      .then((response) => {
        if (response) {
          showSuccess("Application withdrawn successfully");
          setTimeout(() => {
            closeModal(modalId);
            setShowConfirmModal(false);
          }, 1500);
        } else {
          showError("Failed to withdraw application. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Withdraw application error:", err);
        showError(
          err.message || "Failed to withdraw application. Please try again.",
        );
      })
      .finally(() => {
        setIsWithdrawing(false);
      });
  };

  const handleCancelInterview = (interviewId: number) => {
    console.log("Cancelling interview with ID:", interviewId);
    setIsCancelling(true);
    setErrorMessage("");

    cancelInterview(interviewId)
      .then((response) => {
        if (response) {
          showSuccess("Interview cancelled successfully");
          setTimeout(() => {
            closeModal(modalId);
            setShowConfirmModal(false);
          }, 1500);
        } else {
          showError("Failed to cancel interview. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Cancel interview error:", err);
        showError(
          err.message || "Failed to cancel interview. Please try again.",
        );
      })
      .finally(() => {
        setIsCancelling(false);
      });
  };

  const handleUpdateInterview = (interviewId: number) => {
    console.log("Rescheduling interview with ID:", interviewId);
    setIsRescheduling(true);
    setErrorMessage("");

    rescheduleInterview(interviewId)
      .then((response) => {
        if (response) {
          showSuccess("Interview rescheduled successfully");
          setTimeout(() => {
            closeModal(modalId);
            setShowConfirmModal(false);
          }, 1500);
        } else {
          showError("Failed to reschedule interview. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Reschedule interview error:", err);
        showError(
          err.message || "Failed to reschedule interview. Please try again.",
        );
      })
      .finally(() => {
        setIsRescheduling(false);
      });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        showSuccess("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        showError("Failed to copy. Please try again.");
      });
  };

  const generateCalendarFile = () => {
    const startDate = moment(
      `${selectedEvent.date} ${selectedEvent.startTime}`,
    ).format();
    const endDate = moment(
      `${selectedEvent.date} ${selectedEvent.endTime}`,
    ).format();

    const icsContent = `BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//Job Portal//Interview Scheduler//EN
    BEGIN:VEVENT
    UID:${selectedEvent.id}@jobportal.com
    DTSTAMP:${moment().format("YYYYMMDDTHHmmss")}Z
    DTSTART:${moment(startDate).format("YYYYMMDDTHHmmss")}Z
    DTEND:${moment(endDate).format("YYYYMMDDTHHmmss")}Z
    SUMMARY:${selectedEvent.title} - ${selectedEvent.job?.title}
    DESCRIPTION:Interview with ${selectedEvent.job?.company}
    LOCATION:${selectedEvent.interviewPlatform}
    URL:${selectedEvent.interviewLink || ""}
    END:VEVENT
    END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `interview-${selectedEvent.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    showSuccess("Calendar file downloaded!");
  };

  const handleShareEvent = () => {
    const shareText = `Interview: ${selectedEvent.title} with ${selectedEvent.job?.company}
Date: ${moment(selectedEvent.date).format("MMM Do, YYYY")}
Time: ${formatTime(selectedEvent.startTime)} - ${formatTime(selectedEvent.endTime)}
Platform: ${capitalizeEachCase(selectedEvent.interviewPlatform)}
${selectedEvent.interviewLink ? `Link: ${selectedEvent.interviewLink}` : ""}`;

    if (navigator.share) {
      navigator
        .share({
          title: `Interview - ${selectedEvent.title}`,
          text: shareText,
          url: selectedEvent.interviewLink || window.location.href,
        })
        .then(() => showSuccess("Shared successfully!"))
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Share failed:", err);
            copyToClipboard(shareText);
          }
        });
    } else {
      copyToClipboard(shareText);
    }
  };

  const handleSendMessage = () => {
      setIsClosed(false);
      setIsMinimized(false);
      setRecipient(selectedEvent?.job?.employer?.email);
  };

  const handleAddNotes = () => {
    setShowNotesModal(true);
  };

  const handleSaveNotes = () => {
    localStorage.setItem(`notes-${selectedEvent.id}`, notes);
    setShowNotesModal(false);
    showSuccess("Notes saved successfully!");
  };

  const handleSetReminder = () => {
    setIsSettingReminder(true);
    setInterviewReminder(selectedEvent.id, reminder)
      .then(() => {
        localStorage.setItem(`reminder-${selectedEvent.id}`, reminder);
        showSuccess(
          `Reminder set for ${reminder.replace("min", " minutes").replace("hour", " hour").replace("day", " day")} before`,
        );
      })
      .catch((err: any) => {
        console.log(err);
        showError("Failed to set reminder. Please try again.");
      })
      .finally(() => {
        setIsSettingReminder(false);
      });
  };

  const toggleChecklistItem = (index: number) => {
    const newChecklist = [...checklist];
    newChecklist[index] = !newChecklist[index];
    setChecklist(newChecklist);
    localStorage.setItem(
      `checklist-${selectedEvent.id}`,
      JSON.stringify(newChecklist),
    );
  };

  const showConfirmDialog = (
    type: "cancel" | "withdraw" | "reschedule",
    message: string,
  ) => {
    setConfirmAction({ type, message });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    switch (confirmAction.type) {
      case "withdraw":
        handleWithdrawApplication(selectedEvent.job.id);
        break;
      case "cancel":
        handleCancelInterview(selectedEvent.id);
        break;
      case "reschedule":
        handleUpdateInterview(selectedEvent.id);
        break;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      case "in-person":
        return <Users className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "video":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "phone":
        return "bg-green-100 text-green-700 border-green-200";
      case "in-person":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const isOpen = modals[modalId];
  const isEmployer = USER_TYPE === UserType.EMPLOYER;
  const profilePath = isEmployer
    ? `/applicant/public-profile-view/${selectedEvent?.job?.employer?.id}`
    : `/employers/${selectedEvent?.job?.employer?.id}/${encodeURIComponent(selectedEvent?.job?.employer?.companyName || "")}/profile`;

  const profilePicUrl = isEmployer
    ? selectedEvent?.job?.employer?.companyLogo
    : selectedEvent?.job?.employer?.companyLogo;

  const timeUntilEvent = moment(
    `${selectedEvent?.date} ${selectedEvent?.startTime}`,
  ).diff(moment(), "minutes");
  const isUpcoming = timeUntilEvent > 0;
  const isToday = moment(selectedEvent?.date).isSame(moment(), "day");

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-2 backdrop-blur-sm sm:p-4">
        <div className="relative flex max-h-[98vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="absolute top-4 left-1/2 z-50 -translate-x-1/2 transform">
              <div className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm text-white shadow-lg">
                <CheckCircle className="h-4 w-4" />
                {successMessage}
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="absolute top-4 left-1/2 z-50 -translate-x-1/2 transform">
              <div className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm text-white shadow-lg">
                <AlertCircle className="h-4 w-4" />
                {errorMessage}
              </div>
            </div>
          )}

          {/* Header with Enhanced Gradient */}
          <div className="relative flex-shrink-0 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-3xl sm:h-64 sm:w-64"></div>
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/5 blur-2xl sm:h-48 sm:w-48"></div>

            {/* Close Button */}
            <button
              onClick={() => closeModal(modalId)}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:rotate-90 hover:bg-white/30 sm:top-6 sm:right-6 sm:h-10 sm:w-10"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* Event Type Badge */}
            <div className="absolute top-3 left-3 z-10 sm:top-6 sm:left-6">
              <div
                className={`inline-flex items-center space-x-1.5 rounded-full border px-2 py-1 sm:space-x-2 sm:px-3 sm:py-1.5 ${getEventTypeColor(selectedEvent?.interviewType)} backdrop-blur-sm`}
              >
                {getEventTypeIcon(selectedEvent?.interviewType)}
                <span className="text-xs font-medium sm:text-sm">
                  {capitalizeEachCase(selectedEvent?.interviewType)} Interview
                </span>
              </div>
            </div>

            {/* Profile Section - Compact */}
            <div className="relative p-4 pt-12 sm:p-6 sm:pt-20">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end sm:gap-4">
                {/* Profile Image */}
                <div className="relative">
                  <img
                    src={profilePicUrl || profilepics}
                    className="h-16 w-16 rounded-xl border-3 border-white/30 object-cover shadow-2xl sm:h-20 sm:w-20 sm:rounded-2xl"
                    alt="Company Profile"
                  />
                  <div className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-green-400 shadow-lg sm:h-6 sm:w-6">
                    <CheckCircle className="h-2.5 w-2.5 text-white sm:h-3 sm:w-3" />
                  </div>
                </div>

                {/* Company Info */}
                <div className="flex-1 text-center text-white sm:text-left">
                  <h1 className="mb-1 text-lg font-bold sm:mb-2 sm:text-xl lg:text-2xl">
                    {selectedEvent?.job?.company}
                  </h1>
                  <div className="mb-2 flex flex-col items-center gap-2 sm:mb-3 sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex items-center text-sm text-white/90">
                      <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{selectedEvent?.job?.location}</span>
                    </div>
                    <div className="hidden h-4 border-l border-white/30 sm:block"></div>
                    <div className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium backdrop-blur-sm sm:px-3 sm:py-1 sm:text-sm">
                      {selectedEvent?.job?.jobType}
                    </div>
                  </div>

                  {/* Time Until Event */}
                  {isUpcoming && (
                    <div className="inline-flex items-center space-x-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>
                        {timeUntilEvent < 60
                          ? `${timeUntilEvent} minutes`
                          : timeUntilEvent < 1440
                            ? `${Math.floor(timeUntilEvent / 60)} hours`
                            : `${Math.floor(timeUntilEvent / 1440)} days`}{" "}
                        to go
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-row gap-2 sm:flex-col sm:gap-3">
                  <Link
                    to={profilePath}
                    className="flex items-center space-x-1.5 rounded-lg border border-white/20 bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
                  >
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Profile</span>
                  </Link>
                  {selectedEvent?.interviewLink && (
                    <a
                      href={selectedEvent.interviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-all duration-200 hover:bg-green-600 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
                    >
                      <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Join</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50">
            <div className="flex overflow-x-auto">
              {[
                { id: "overview", label: "Overview", icon: FileText },
                { id: "details", label: "Details", icon: Calendar },
                { id: "preparation", label: "Prep", icon: Star },
                { id: "actions", label: "Actions", icon: Edit },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 border-b-2 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors sm:px-6 sm:py-4 sm:text-sm ${
                    activeTab === tab.id
                      ? "border-purple-500 bg-white text-purple-600"
                      : "border-transparent text-slate-600 hover:bg-white/50 hover:text-slate-900"
                  }`}
                >
                  <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {activeTab === "overview" && (
              <div className="space-y-4 sm:space-y-6">
                {/* Event Status */}
                <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:flex-row sm:items-center sm:p-4">
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-slate-900 sm:text-base">
                      {selectedEvent?.title}
                    </h3>
                    <p className="text-xs text-slate-600 sm:text-sm">
                      {selectedEvent?.job?.title}
                    </p>
                  </div>
                  <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700 sm:px-3 sm:py-1.5 sm:text-sm">
                    {selectedEvent?.status}
                  </div>
                </div>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div className="rounded-xl border bg-slate-50 p-3 sm:p-4">
                    <div className="mb-2 flex items-center space-x-2 sm:mb-3 sm:space-x-3">
                      <Calendar className="h-4 w-4 text-purple-600 sm:h-5 sm:w-5" />
                      <h4 className="text-sm font-semibold text-slate-900 sm:text-base">
                        When
                      </h4>
                    </div>
                    <p className="text-sm font-medium text-slate-700 sm:text-base">
                      {moment(selectedEvent?.date).format("ddd, MMM Do")}
                    </p>
                    <p className="text-xs text-slate-600 sm:text-sm">
                      {formatTime(selectedEvent?.startTime)} -{" "}
                      {formatTime(selectedEvent?.endTime)}
                    </p>
                    {isToday && (
                      <div className="mt-1.5 inline-flex items-center space-x-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 sm:mt-2 sm:py-1">
                        <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        <span>Today</span>
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border bg-slate-50 p-3 sm:p-4">
                    <div className="mb-2 flex items-center space-x-2 sm:mb-3 sm:space-x-3">
                      <Monitor className="h-4 w-4 text-purple-600 sm:h-5 sm:w-5" />
                      <h4 className="text-sm font-semibold text-slate-900 sm:text-base">
                        How
                      </h4>
                    </div>
                    <p className="text-sm font-medium text-slate-700 sm:text-base">
                      {capitalizeEachCase(selectedEvent?.interviewPlatform)}
                    </p>
                    <p className="text-xs text-slate-600 sm:text-sm">
                      {capitalizeEachCase(selectedEvent?.interviewType)}{" "}
                      Interview
                    </p>
                  </div>
                </div>

                {/* Interview Link */}
                {selectedEvent?.interviewLink && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-3 sm:p-4">
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        <h4 className="mb-1 text-sm font-semibold text-green-900 sm:text-base">
                          Join Interview
                        </h4>
                        <p className="text-xs break-all text-green-700 sm:text-sm">
                          {selectedEvent.interviewLink}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(selectedEvent.interviewLink || "")
                        }
                        className="flex flex-shrink-0 items-center space-x-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs text-white transition-colors hover:bg-green-700 sm:py-2 sm:text-sm"
                      >
                        {copied ? (
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                        <span>{copied ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "details" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="flex items-center space-x-2 text-base font-semibold text-slate-900 sm:text-lg">
                      <Calendar className="h-4 w-4 text-purple-600 sm:h-5 sm:w-5" />
                      <span>Schedule Details</span>
                    </h3>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between border-b border-slate-100 py-1.5 text-sm sm:py-2">
                        <span className="text-slate-600">Date</span>
                        <span className="font-medium">
                          {moment(selectedEvent?.date).format("MMM Do, YYYY")}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 py-1.5 text-sm sm:py-2">
                        <span className="text-slate-600">Start Time</span>
                        <span className="font-medium">
                          {formatTime(selectedEvent?.startTime)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 py-1.5 text-sm sm:py-2">
                        <span className="text-slate-600">End Time</span>
                        <span className="font-medium">
                          {formatTime(selectedEvent?.endTime)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 py-1.5 text-sm sm:py-2">
                        <span className="text-slate-600">Duration</span>
                        <span className="font-medium">
                          {moment(
                            `${selectedEvent?.date} ${selectedEvent?.endTime}`,
                          ).diff(
                            moment(
                              `${selectedEvent?.date} ${selectedEvent?.startTime}`,
                            ),
                            "minutes",
                          )}{" "}
                          minutes
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 text-sm sm:py-2">
                        <span className="text-slate-600">Time Zone</span>
                        <span className="font-medium">
                          {selectedEvent?.timeZone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="flex items-center space-x-2 text-base font-semibold text-slate-900 sm:text-lg">
                      <Users className="h-4 w-4 text-purple-600 sm:h-5 sm:w-5" />
                      <span>Participants</span>
                    </h3>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-3 rounded-lg bg-slate-50 p-2.5 sm:p-3">
                        <img
                          src={profilePicUrl || profilepics}
                          className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
                          alt="Interviewer"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-900 sm:text-base">
                            {selectedEvent?.job?.company}
                          </p>
                          <p className="text-xs text-slate-600 sm:text-sm">
                            Interviewer
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preparation" && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="flex items-center space-x-2 text-base font-semibold text-slate-900 sm:text-lg">
                  <Star className="h-4 w-4 text-purple-600 sm:h-5 sm:w-5" />
                  <span>Interview Preparation</span>
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-sm font-medium text-slate-900 sm:text-base">
                      Checklist
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        "Test camera and microphone",
                        "Prepare role questions",
                        "Review resume/portfolio",
                        "Research company",
                        "Plan appearance",
                      ].map((item, index) => (
                        <label
                          key={index}
                          className="flex cursor-pointer items-center space-x-2 sm:space-x-3"
                        >
                          <input
                            type="checkbox"
                            checked={checklist[index]}
                            onChange={() => toggleChecklistItem(index)}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span
                            className={`text-xs sm:text-sm ${
                              checklist[index]
                                ? "text-slate-400 line-through"
                                : "text-slate-700"
                            }`}
                          >
                            {item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-sm font-medium text-slate-900 sm:text-base">
                      Reminders
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      <select
                        value={reminder}
                        onChange={(e) => setReminder(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="5_MIN_BEFORE">5 minutes before</option>
                        <option value="15_MIN_BEFORE">15 minutes before</option>
                        <option value="30_MIN_BEFORE">30 minutes before</option>
                        <option value="1_HOUR_BEFORE">1 hour before</option>
                        <option value="1_DAY_BEFORE">1 day before</option>
                      </select>
                      <button
                        onClick={handleSetReminder}
                        disabled={isSettingReminder}
                        className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSettingReminder ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Setting...</span>
                          </>
                        ) : (
                          <>
                            <Bell className="h-4 w-4" />
                            <span>Set Reminder</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "actions" && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="flex items-center space-x-2 text-base font-semibold text-slate-900 sm:text-lg">
                  <Edit className="h-4 w-4 text-purple-600 sm:h-5 sm:w-5" />
                  <span>Quick Actions</span>
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <button
                    onClick={generateCalendarFile}
                    className="flex items-center space-x-2 rounded-xl border border-slate-200 p-3 transition-colors hover:bg-slate-50 sm:space-x-3 sm:p-4"
                  >
                    <Download className="h-4 w-4 text-slate-600 sm:h-5 sm:w-5" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-900 sm:text-base">
                        Add to Calendar
                      </p>
                      <p className="text-xs text-slate-600 sm:text-sm">
                        Download .ics file
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={handleShareEvent}
                    className="flex items-center space-x-2 rounded-xl border border-slate-200 p-3 transition-colors hover:bg-slate-50 sm:space-x-3 sm:p-4"
                  >
                    <Share2 className="h-4 w-4 text-slate-600 sm:h-5 sm:w-5" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-900 sm:text-base">
                        Share Event
                      </p>
                      <p className="text-xs text-slate-600 sm:text-sm">
                        Share details
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={handleSendMessage}
                    className="flex items-center space-x-2 rounded-xl border border-slate-200 p-3 transition-colors hover:bg-slate-50 sm:space-x-3 sm:p-4"
                  >
                    <MessageCircle className="h-4 w-4 text-slate-600 sm:h-5 sm:w-5" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-900 sm:text-base">
                        Send Message
                      </p>
                      <p className="text-xs text-slate-600 sm:text-sm">
                        Contact interviewer
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={handleAddNotes}
                    className="flex items-center space-x-2 rounded-xl border border-slate-200 p-3 transition-colors hover:bg-slate-50 sm:space-x-3 sm:p-4"
                  >
                    <Plus className="h-4 w-4 text-slate-600 sm:h-5 sm:w-5" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-900 sm:text-base">
                        Add Notes
                      </p>
                      <p className="text-xs text-slate-600 sm:text-sm">
                        Personal reminders
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex-shrink-0 border-t border-slate-200 bg-slate-50 p-4 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <button
                onClick={() => closeModal(modalId)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-white sm:flex-none sm:px-6 sm:py-3 sm:text-base"
              >
                Close
              </button>

              <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row sm:gap-3">
                {userType === UserType.EMPLOYER && (
                  <button
                    onClick={() =>
                      showConfirmDialog(
                        "cancel",
                        "Are you sure you want to cancel this interview? This action cannot be undone.",
                      )
                    }
                    disabled={isCancelling}
                    className="flex items-center justify-center space-x-2 rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3 sm:text-base"
                  >
                    {isCancelling ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
                        <span>Cancelling...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Cancel Interview</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (userType === UserType.APPLICANT) {
                      showConfirmDialog(
                        "withdraw",
                        "Are you sure you want to withdraw your application? This will also cancel any scheduled interviews.",
                      );
                    } else {
                      showConfirmDialog(
                        "reschedule",
                        "Would you like to reschedule this interview?",
                      );
                    }
                  }}
                  disabled={isWithdrawing || isRescheduling}
                  className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3 sm:text-base"
                >
                  {isWithdrawing || isRescheduling ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>
                        {userType === UserType.APPLICANT
                          ? "Withdraw Application"
                          : "Modify Interview"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal &&
        createPortal(
          <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Interview Notes
                </h3>
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="rounded-full p-1 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your personal notes and reminders here..."
                className="mb-4 min-h-[200px] w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Confirmation Modal */}
      {showConfirmModal &&
        confirmAction &&
        createPortal(
          <div className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Confirm Action
                </h3>
              </div>
              <p className="mb-6 text-sm text-slate-600">
                {confirmAction.message}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setConfirmAction(null);
                  }}
                  disabled={isWithdrawing || isCancelling || isRescheduling}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={isWithdrawing || isCancelling || isRescheduling}
                  className="flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {(isWithdrawing || isCancelling || isRescheduling) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <span>
                    {isWithdrawing || isCancelling || isRescheduling
                      ? "Processing..."
                      : "Confirm"}
                  </span>
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>,
    document.body,
  );
};

export default ApplicantScheduleModal;
