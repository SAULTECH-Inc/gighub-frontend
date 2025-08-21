import useModalStore from "../../store/modalStateStores.ts";
import {
  X, MapPin, Clock, Calendar, Monitor, ExternalLink,
  Download, Share2, Bell, Copy, CheckCircle, Users,
  MessageCircle, FileText, Phone, Video,
  AlertCircle, Edit, Trash2, Plus, Star
} from "lucide-react";
import profilepics from "../../assets/images/profilepics.png";
import React, { useState } from "react";
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
  withdrawApplication,
} from "../../services/api";
import { useAuth } from "../../store/useAuth.ts";
import { UserType } from "../../utils/enums.ts";

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
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [reminder, setReminder] = useState('15min');

  const handleWithdrawApplication = async (jobId: number) => {
    const response = await withdrawApplication(jobId);
    if (response) {
      closeModal(modalId);
    }
  };

  const handleCancelInterview = async (interviewId: number) => {
    console.log("Cancelling interview with ID:", interviewId);
    const response = await cancelInterview(interviewId);
    if (response) {
      closeModal(modalId);
    }
  };

  const handleUpdateInterview = async (interviewId: number) => {
    console.log("Rescheduling interview with ID:", interviewId);
    const response = await rescheduleInterview(interviewId);
    if (response) {
      closeModal(modalId);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const generateCalendarFile = () => {
    const startDate = moment(`${selectedEvent.date} ${selectedEvent.startTime}`).format();
    const endDate = moment(`${selectedEvent.date} ${selectedEvent.endTime}`).format();

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Job Portal//Interview Scheduler//EN
BEGIN:VEVENT
UID:${selectedEvent.id}@jobportal.com
DTSTAMP:${moment().format('YYYYMMDDTHHmmss')}Z
DTSTART:${moment(startDate).format('YYYYMMDDTHHmmss')}Z
DTEND:${moment(endDate).format('YYYYMMDDTHHmmss')}Z
SUMMARY:${selectedEvent.title} - ${selectedEvent.job?.title}
DESCRIPTION:Interview with ${selectedEvent.job?.company}
LOCATION:${selectedEvent.interviewPlatform}
URL:${selectedEvent.interviewLink || ''}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-${selectedEvent.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getEventTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in-person': return <Users className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'phone': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-person': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const isOpen = modals[modalId];
  const isEmployer = USER_TYPE === UserType.EMPLOYER;
  const profilePath = isEmployer
    ? `/applicant/public-profile-view/${selectedEvent?.job?.employer?.id}`
    : `/employers/${selectedEvent?.job?.employer?.id}/${selectedEvent?.job?.employer?.companyName}/profile`;

  const profilePicUrl = isEmployer
    ? selectedEvent?.job?.employer?.companyLogo
    : selectedEvent?.job?.employer?.companyLogo;

  const timeUntilEvent = moment(`${selectedEvent?.date} ${selectedEvent?.startTime}`).diff(moment(), 'minutes');
  const isUpcoming = timeUntilEvent > 0;
  const isToday = moment(selectedEvent?.date).isSame(moment(), 'day');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="relative w-full max-w-4xl max-h-[98vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl flex flex-col">
        {/* Header with Enhanced Gradient */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/5 rounded-full blur-2xl"></div>

          {/* Close Button */}
          <button
            onClick={() => closeModal(modalId)}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 hover:rotate-90"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Event Type Badge */}
          <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-10">
            <div className={`inline-flex items-center space-x-1.5 sm:space-x-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border ${getEventTypeColor(selectedEvent?.interviewType)} backdrop-blur-sm`}>
              {getEventTypeIcon(selectedEvent?.interviewType)}
              <span className="text-xs sm:text-sm font-medium">{capitalizeEachCase(selectedEvent?.interviewType)} Interview</span>
            </div>
          </div>

          {/* Profile Section - Compact */}
          <div className="relative p-4 sm:p-6 pt-12 sm:pt-20">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-4">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={profilePicUrl || profilepics}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl border-3 border-white/30 shadow-2xl object-cover"
                  alt="Company Profile"
                />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 bg-green-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                </div>
              </div>

              {/* Company Info */}
              <div className="flex-1 text-center sm:text-left text-white">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2">
                  {selectedEvent?.job?.company}
                </h1>
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="flex items-center text-white/90 text-sm">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span>{selectedEvent?.job?.location}</span>
                  </div>
                  <div className="hidden sm:block h-4 border-l border-white/30"></div>
                  <div className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
                    {selectedEvent?.job?.jobType}
                  </div>
                </div>

                {/* Time Until Event */}
                {isUpcoming && (
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>
                      {timeUntilEvent < 60 ? `${timeUntilEvent} minutes` :
                        timeUntilEvent < 1440 ? `${Math.floor(timeUntilEvent / 60)} hours` :
                          `${Math.floor(timeUntilEvent / 1440)} days`} to go
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-row sm:flex-col gap-2 sm:gap-3">
                <Link
                  to={profilePath}
                  className="flex items-center space-x-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 border border-white/20 text-xs sm:text-sm"
                >
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Profile</span>
                </Link>
                {selectedEvent?.interviewLink && (
                  <Link
                    to={selectedEvent.interviewLink}
                    className="flex items-center space-x-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 shadow-lg text-xs sm:text-sm"
                  >
                    <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Join</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'details', label: 'Details', icon: Calendar },
              { id: 'preparation', label: 'Prep', icon: Star },
              { id: 'actions', label: 'Actions', icon: Edit }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-4 py-3 sm:px-6 sm:py-4 font-medium text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Event Status */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">{selectedEvent?.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm">{selectedEvent?.job?.title}</p>
                </div>
                <div className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 bg-orange-100 border border-orange-200 rounded-full text-orange-700 font-medium text-xs sm:text-sm">
                  {selectedEvent?.status}
                </div>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    <h4 className="font-semibold text-slate-900 text-sm sm:text-base">When</h4>
                  </div>
                  <p className="text-slate-700 font-medium text-sm sm:text-base">
                    {moment(selectedEvent?.date).format("ddd, MMM Do")}
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm">
                    {formatTime(selectedEvent?.startTime)} - {formatTime(selectedEvent?.endTime)}
                  </p>
                  {isToday && (
                    <div className="inline-flex items-center space-x-1 mt-1.5 sm:mt-2 px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span>Today</span>
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                    <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    <h4 className="font-semibold text-slate-900 text-sm sm:text-base">How</h4>
                  </div>
                  <p className="text-slate-700 font-medium text-sm sm:text-base">
                    {capitalizeEachCase(selectedEvent?.interviewPlatform)}
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm">
                    {capitalizeEachCase(selectedEvent?.interviewType)} Interview
                  </p>
                </div>
              </div>

              {/* Interview Link */}
              {selectedEvent?.interviewLink && (
                <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-green-900 mb-1 text-sm sm:text-base">Join Interview</h4>
                      <p className="text-green-700 text-xs sm:text-sm break-all">{selectedEvent.interviewLink}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedEvent.interviewLink || '')}
                      className="flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm flex-shrink-0"
                    >
                      {copied ? <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center space-x-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    <span>Schedule Details</span>
                  </h3>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-slate-100 text-sm">
                      <span className="text-slate-600">Date</span>
                      <span className="font-medium">{moment(selectedEvent?.date).format("MMM Do, YYYY")}</span>
                    </div>
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-slate-100 text-sm">
                      <span className="text-slate-600">Start Time</span>
                      <span className="font-medium">{formatTime(selectedEvent?.startTime)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-slate-100 text-sm">
                      <span className="text-slate-600">End Time</span>
                      <span className="font-medium">{formatTime(selectedEvent?.endTime)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-slate-100 text-sm">
                      <span className="text-slate-600">Duration</span>
                      <span className="font-medium">
                        {moment(`${selectedEvent?.date} ${selectedEvent?.endTime}`).diff(
                          moment(`${selectedEvent?.date} ${selectedEvent?.startTime}`), 'minutes'
                        )} minutes
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 sm:py-2 text-sm">
                      <span className="text-slate-600">Time Zone</span>
                      <span className="font-medium">{selectedEvent?.timeZone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center space-x-2">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    <span>Participants</span>
                  </h3>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-3 p-2.5 sm:p-3 bg-slate-50 rounded-lg">
                      <img
                        src={profilePicUrl || profilepics}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                        alt="Interviewer"
                      />
                      <div>
                        <p className="font-medium text-slate-900 text-sm sm:text-base">{selectedEvent?.job?.company}</p>
                        <p className="text-xs sm:text-sm text-slate-600">Interviewer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preparation' && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center space-x-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <span>Interview Preparation</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="font-medium text-slate-900 text-sm sm:text-base">Checklist</h4>
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      'Test camera and microphone',
                      'Prepare role questions',
                      'Review resume/portfolio',
                      'Research company',
                      'Plan appearance'
                    ].map((item, index) => (
                      <label key={index} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                        <span className="text-slate-700 text-xs sm:text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h4 className="font-medium text-slate-900 text-sm sm:text-base">Reminders</h4>
                  <div className="space-y-2 sm:space-y-3">
                    <select
                      value={reminder}
                      onChange={(e) => setReminder(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    >
                      <option value="5min">5 minutes before</option>
                      <option value="15min">15 minutes before</option>
                      <option value="30min">30 minutes before</option>
                      <option value="1hour">1 hour before</option>
                      <option value="1day">1 day before</option>
                    </select>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <Bell className="h-4 w-4" />
                      <span>Set Reminder</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center space-x-2">
                <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <span>Quick Actions</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={generateCalendarFile}
                  className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Download className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                  <div className="text-left">
                    <p className="font-medium text-slate-900 text-sm sm:text-base">Add to Calendar</p>
                    <p className="text-xs sm:text-sm text-slate-600">Download .ics file</p>
                  </div>
                </button>

                <button
                  onClick={() => copyToClipboard(window.location.href)}
                  className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                  <div className="text-left">
                    <p className="font-medium text-slate-900 text-sm sm:text-base">Share Event</p>
                    <p className="text-xs sm:text-sm text-slate-600">Copy link to clipboard</p>
                  </div>
                </button>

                <button className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                  <div className="text-left">
                    <p className="font-medium text-slate-900 text-sm sm:text-base">Send Message</p>
                    <p className="text-xs sm:text-sm text-slate-600">Contact interviewer</p>
                  </div>
                </button>

                <button className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                  <div className="text-left">
                    <p className="font-medium text-slate-900 text-sm sm:text-base">Add Notes</p>
                    <p className="text-xs sm:text-sm text-slate-600">Personal reminders</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 p-4 sm:p-6 bg-slate-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => closeModal(modalId)}
              className="flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-white transition-colors text-sm sm:text-base"
            >
              Close
            </button>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:ml-auto">
              {userType === UserType.EMPLOYER && (
                <button
                  onClick={() => handleCancelInterview(selectedEvent.id)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 border border-red-300 text-red-700 bg-red-50 rounded-xl font-medium hover:bg-red-100 transition-colors text-sm sm:text-base"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Cancel Interview</span>
                </button>
              )}
              <button
                onClick={async () => {
                  if (userType === UserType.APPLICANT) {
                    await handleWithdrawApplication(selectedEvent.job.id);
                  } else {
                    await handleUpdateInterview(selectedEvent.id);
                  }
                }}
                className="flex items-center justify-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg text-sm sm:text-base"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>
                  {userType === UserType.APPLICANT
                    ? "Withdraw Application"
                    : "Modify Interview"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantScheduleModal;