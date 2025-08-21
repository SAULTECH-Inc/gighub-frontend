import React, { useMemo, memo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  Clock
} from "lucide-react";
import { ApplicationResponse } from "../../utils/types";
import moment from "moment";
import { getStatusColor } from "../../utils/helpers.ts";

interface ApplicationCardProps {
  application: ApplicationResponse;
  onView: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = memo(({ application, onView }) => {
  const statusColor = useMemo(
    () => getStatusColor(application.status),
    [application.status]
  );

  const formatDate = useMemo(
    () => moment(application.createdAt).format("MMM DD, YYYY"),
    [application.createdAt]
  );

  const getStatusVariant = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('pending')) return 'warning';
    if (statusLower.includes('hired') || statusLower.includes('accepted')) return 'success';
    if (statusLower.includes('rejected')) return 'error';
    if (statusLower.includes('shortlisted')) return 'info';
    return 'default';
  };

  const statusVariant = getStatusVariant(application.status);

  const statusStyles = {
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    default: 'bg-slate-50 text-slate-700 border-slate-200'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
    >
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="flex items-start justify-between mb-3">
          {/* Company Logo and Basic Info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
              {application?.job?.employer?.companyLogo ? (
                <img
                  src={application.job.employer.companyLogo}
                  alt={`${application.job.company} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                  <Building2 className="h-6 w-6 text-slate-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate text-base">
                {application.job.title}
              </h3>
              <p className="text-sm text-slate-600 truncate">
                {application.job.company}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`rounded-full border px-3 py-1 text-xs font-medium shrink-0 ml-2 ${statusStyles[statusVariant]}`}>
            {application.status}
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{application.job.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate}</span>
            </div>
          </div>

          {application.job.jobType && (
            <div className="flex items-center space-x-1 shrink-0">
              <Clock className="h-3 w-3" />
              <span>{application.job.jobType}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onView}
          className="w-full flex items-center justify-center space-x-2 rounded-lg bg-slate-100 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-700"
        >
          <span>View Details</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:items-center lg:gap-4">
        {/* Company Info - 4 cols */}
        <div className="col-span-4 flex items-center space-x-3">
          <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
            {application?.job?.employer?.companyLogo ? (
              <img
                src={application.job.employer.companyLogo}
                alt={`${application.job.company} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                <Building2 className="h-6 w-6 text-slate-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">
              {application.job.company}
            </h3>
            <div className="flex items-center space-x-1 text-sm text-slate-500">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{application.job.location}</span>
            </div>
          </div>
        </div>

        {/* Job Title - 3 cols */}
        <div className="col-span-3">
          <p className="font-medium text-slate-900 truncate" title={application.job.title}>
            {application.job.title}
          </p>
          {application.job.jobType && (
            <div className="flex items-center space-x-1 text-sm text-slate-500 mt-1">
              <Briefcase className="h-3 w-3" />
              <span>{application.job.jobType}</span>
            </div>
          )}
        </div>

        {/* Date Applied - 2 cols */}
        <div className="col-span-2">
          <div className="flex items-center space-x-1 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate}</span>
          </div>
        </div>

        {/* Status - 2 cols */}
        <div className="col-span-2">
          <div className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusStyles[statusVariant]}`}>
            <div
              className="mr-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: statusColor }}
            />
            {application.status}
          </div>
        </div>

        {/* Action - 1 col */}
        <div className="col-span-1 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onView}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-indigo-100 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="View application details"
          >
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
    </motion.div>
  );
});

ApplicationCard.displayName = 'ApplicationCard';

export default ApplicationCard;