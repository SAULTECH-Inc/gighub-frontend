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
  AlertCircle,
  Check,
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
    highlight = false,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | React.ReactNode;
    className?: string;
    highlight?: boolean;
  }) => (
    <div
      className={`flex items-start space-x-3 rounded-lg p-3 transition-colors ${
        highlight ? `${urgencyBg} ${urgencyBorder} border` : "hover:bg-slate-50"
      } ${className}`}
    >
      <div
        className={`mt-0.5 h-5 w-5 flex-shrink-0 ${highlight ? urgencyColor : "text-slate-500"}`}
      >
        <Icon className="h-full w-full" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium tracking-wide text-slate-500 uppercase">
          {label}
        </p>
        <p
          className={`text-sm font-semibold ${highlight ? urgencyColor : "text-slate-900"} break-words`}
        >
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30 p-4 sm:p-6">
        <h2 className="flex items-center space-x-2 text-lg font-bold text-slate-800">
          <Briefcase className="h-5 w-5 text-indigo-600" />
          <span>Job Details</span>
        </h2>
      </div>

      {/* Job Information */}
      <div className="space-y-4 p-4 sm:p-6">
        <InfoItem icon={Home} label="Work Type" value={job.jobType} />

        <InfoItem icon={Clock} label="Employment" value={job.employmentType} />

        {job?.salaryRange?.maximumAmount > 0 && (
          <InfoItem
            icon={DollarSign}
            label="Salary Range"
            value={
              <span>
                {job.salaryRange.currency}
                {numeral(job.salaryRange.minimumAmount).format("0,0a")} -{" "}
                {job.salaryRange.currency}
                {numeral(job.salaryRange.maximumAmount).format("0,0a")}
                <span className="text-xs text-slate-500">
                  /{job.salaryRange.frequency}
                </span>
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

        <InfoItem icon={MapPin} label="Location" value={job.location} />

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
      <div className="px-4 pb-4 sm:px-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-600">Application Progress</span>
            <span className={urgencyColor}>{Math.round(percentage)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                percentage >= 70
                  ? "bg-red-500"
                  : percentage >= 40
                    ? "bg-amber-500"
                    : "bg-green-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6">
        {USER_TYPE === UserType.EMPLOYER ? (
          <button
            onClick={handleEditJob}
            className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-bold text-white transition-all duration-200 hover:scale-105 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            <Edit3 className="h-4 w-4" />
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
              disabled={job?.isBookmarked}
              type="button"
              className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-bold text-white transition-all duration-200 hover:scale-105 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              {job?.applied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Applied</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Apply Now</span>
                </>
              )}
            </button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleBookmark}
                type="button"
                disabled={job?.isBookmarked}
                className="flex items-center justify-center space-x-2 rounded-lg border-2 border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 focus:outline-none"
              >
                {job?.isBookmarked ? (
                  <>
                    <Bookmark className="h-4 w-4 text-indigo-600" />
                    <span className="hidden text-indigo-600 sm:inline">
                      Bookmarked
                    </span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    <span className="hidden sm:inline">Bookmark</span>
                  </>
                )}
              </button>

              <button
                onClick={() => openModal("refer-modal")}
                type="button"
                className="flex transform items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2.5 font-medium text-white transition-all duration-200 hover:scale-105 hover:from-pink-600 hover:to-rose-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-1 focus:outline-none"
              >
                <Share2 className="h-4 w-4" />
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
