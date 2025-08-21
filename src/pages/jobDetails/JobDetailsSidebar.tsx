import React from "react";
import { JobPostResponse } from "../../utils/types";
import moment from "moment";
import numeral from "numeral";
import { capitalizeEachCase, USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import useModalStore from "../../store/modalStateStores.ts";
import { useJobSearchSettings } from "../../store/useJobSearchSettings.ts";
import {
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Users,
  Briefcase,
  GraduationCap,
  Home,
  Send,
  Bookmark,
  Share2,
  Edit3,
  AlertCircle
} from "lucide-react";

interface SidebarProp {
  job: JobPostResponse;
  handleEditJob: () => void;
  handleBookmark?: () => void;
}

const JobDetailsSidebar: React.FC<SidebarProp> = ({
                                                    job,
                                                    handleEditJob,
                                                    handleBookmark,
                                                  }) => {
  const { openModal } = useModalStore();
  const { setJobToApply } = useJobSearchSettings();
  const start = moment(job.startDate);
  const end = moment(job.endDate);
  const now = moment();

  // Calculate progress percentage
  let percentage = 0;
  if (end.isAfter(start)) {
    const totalDuration = end.diff(start);
    const elapsed = now.diff(start);
    percentage = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  }

  // Determine urgency colors
  let urgencyColor = "text-green-600";
  let urgencyBg = "bg-green-50";
  let urgencyBorder = "border-green-200";

  if (percentage >= 70) {
    urgencyColor = "text-red-600";
    urgencyBg = "bg-red-50";
    urgencyBorder = "border-red-200";
  } else if (percentage >= 40) {
    urgencyColor = "text-amber-600";
    urgencyBg = "bg-amber-50";
    urgencyBorder = "border-amber-200";
  }

  const InfoItem = ({
                      icon: Icon,
                      label,
                      value,
                      className = "",
                      highlight = false
                    }: {
    icon: React.ElementType;
    label: string;
    value: string | React.ReactNode;
    className?: string;
    highlight?: boolean;
  }) => (
    <div className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
      highlight ? `${urgencyBg} ${urgencyBorder} border` : 'hover:bg-slate-50'
    } ${className}`}>
      <div className={`flex-shrink-0 w-5 h-5 mt-0.5 ${highlight ? urgencyColor : 'text-slate-500'}`}>
        <Icon className="w-full h-full" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className={`text-sm font-semibold ${highlight ? urgencyColor : 'text-slate-900'} break-words`}>
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 p-4 sm:p-6 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          <span>Job Details</span>
        </h2>
      </div>

      {/* Job Information */}
      <div className="p-4 sm:p-6 space-y-4">
        <InfoItem
          icon={Home}
          label="Work Type"
          value={job.jobType}
        />

        <InfoItem
          icon={Clock}
          label="Employment"
          value={job.employmentType}
        />

        {job?.salaryRange?.maximumAmount > 0 && (
          <InfoItem
            icon={DollarSign}
            label="Salary Range"
            value={
              <span>
                {job.salaryRange.currency}
                {numeral(job.salaryRange.minimumAmount).format("0,0a")} - {" "}
                {job.salaryRange.currency}
                {numeral(job.salaryRange.maximumAmount).format("0,0a")}
                <span className="text-xs text-slate-500">/{job.salaryRange.frequency}</span>
              </span>
            }
          />
        )}

        <InfoItem
          icon={GraduationCap}
          label="Experience Level"
          value={job.level}
        />

        <InfoItem
          icon={Clock}
          label="Experience Required"
          value={`${job.experienceYears}+ years`}
        />

        <InfoItem
          icon={MapPin}
          label="Location"
          value={job.location}
        />

        <InfoItem
          icon={Calendar}
          label="Application Deadline"
          value={moment(job.endDate).format("MMM D, YYYY - HH:mm")}
        />

        <InfoItem
          icon={AlertCircle}
          label="Time Left"
          value={`${capitalizeEachCase(moment(job.endDate).fromNow(true))} left to apply`}
          highlight={true}
        />

        <InfoItem
          icon={Users}
          label="Total Applicants"
          value={`${job.applicantsCount || 0} applied`}
        />
      </div>

      {/* Progress Bar */}
      <div className="px-4 sm:px-6 pb-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-600">Application Progress</span>
            <span className={urgencyColor}>{Math.round(percentage)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                percentage >= 70 ? 'bg-red-500' :
                  percentage >= 40 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-slate-200 p-4 sm:p-6 bg-slate-50">
        {USER_TYPE === UserType.EMPLOYER ? (
          <button
            onClick={handleEditJob}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Job</span>
          </button>
        ) : (
          <div className="space-y-3">
            {/* Primary Apply Button */}
            <button
              onClick={() => {
                setJobToApply(job);
                openModal("application-modal");
              }}
              type="button"
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Send className="w-4 h-4" />
              <span>Apply Now</span>
            </button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleBookmark}
                type="button"
                className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1"
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </button>

              <button
                onClick={() => openModal("refer-modal")}
                type="button"
                className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-1"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Refer</span>
              </button>
            </div>

            {/* Quick Info */}
            <div className="text-center">
              <p className="text-xs text-slate-500">
                Join {job.applicantsCount || 0} other applicants
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsSidebar;