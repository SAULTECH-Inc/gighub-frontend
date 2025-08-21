import React, { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  MapPin,
  FileText,
  Video,
  User,
  Briefcase,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";
import useModalStore from "../../store/modalStateStores.ts";
import { ApplicationResponse } from "../../utils/types";
import { withdrawApplication } from "../../services/api";
import { ApplicationStatus } from "../../utils/dummyApplications.ts";
import { UserType } from "../../utils/enums.ts";
import { USER_TYPE } from "../../utils/helpers.ts";

interface ModalProps {
  modalId: string;
  application: ApplicationResponse;
}

const ViewApplicationMethodModal: React.FC<ModalProps> = memo(({
                                                                 modalId,
                                                                 application,
                                                               }) => {
  const { modals, closeModal } = useModalStore();
  const isOpen = modals[modalId];

  const handleWithdrawApplication = useCallback(async (jobId: number) => {
    try {
      const response = await withdrawApplication(jobId);
      if (response) {
        closeModal(modalId);
        // Optionally trigger a refresh of the applications list
      }
    } catch (error) {
      console.error("Failed to withdraw application:", error);
    }
  }, [closeModal, modalId]);

  const handleClose = useCallback(() => {
    closeModal(modalId);
  }, [closeModal, modalId]);

  const profilePath = USER_TYPE === UserType.EMPLOYER
    ? `/applicant/public-profile-view/${application?.applicant?.id}`
    : `/employers/${application?.job?.employer?.id}/${application?.job?.employer?.companyName}/profile`;

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

  const applicationMethods = [
    {
      key: 'byCv' as keyof typeof application.job.applicationMethod,
      icon: FileText,
      label: 'CV/Resume',
      filename: 'Aliyu_CV.pdf',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      key: 'byVideo' as keyof typeof application.job.applicationMethod,
      icon: Video,
      label: 'Video Interview',
      filename: 'Video Response',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      key: 'byProfile' as keyof typeof application.job.applicationMethod,
      icon: User,
      label: 'Profile',
      filename: 'Complete Profile',
      color: 'bg-green-100 text-green-600'
    },
    {
      key: 'byCoverLetter' as keyof typeof application.job.applicationMethod,
      icon: FileText,
      label: 'Cover Letter',
      filename: 'Cover Letter',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      key: 'byPortfolio' as keyof typeof application.job.applicationMethod,
      icon: Briefcase,
      label: 'Portfolio',
      filename: 'Portfolio Submission',
      color: 'bg-pink-100 text-pink-600'
    },
  ] as const;

  const activeApplicationMethods = applicationMethods.filter(
    method => application?.job?.applicationMethod?.[method.key] === true
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient background */}
          <div className="relative h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-colors hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <X className="h-5 w-5" />
            </motion.button>

            {/* Company Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-end space-x-4">
                {/* Company Logo */}
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-white p-1 shadow-lg">
                  {application?.job?.employer?.companyLogo ? (
                    <img
                      src={application.job.employer.companyLogo}
                      alt={`${application.job.company} logo`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 rounded-lg">
                      <Building2 className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Company Details */}
                <div className="flex-1 text-white">
                  <h2 className="text-lg font-bold truncate">
                    {application?.job?.employer?.companyName || application?.job?.company}
                  </h2>
                  <div className="flex items-center space-x-1 text-sm text-white/80">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{application?.job?.location}</span>
                  </div>
                </div>

                {/* Job Type Badge */}
                {application?.job?.jobType && (
                  <div className="rounded-lg bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white">
                    {application.job.jobType}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Status and Profile Link */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className={`inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium ${statusStyles[statusVariant]}`}>
                <div className={`mr-2 h-2 w-2 rounded-full ${statusVariant === 'warning' ? 'bg-amber-500' : statusVariant === 'success' ? 'bg-emerald-500' : statusVariant === 'error' ? 'bg-red-500' : statusVariant === 'info' ? 'bg-blue-500' : 'bg-slate-500'}`} />
                {application?.status}
              </div>

              <Link
                to={profilePath}
                className="inline-flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span>View Profile</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            {/* Job Title */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                {application?.job?.title}
              </h3>
              <p className="text-sm text-slate-600">
                Application submitted on{" "}
                {new Date(application?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Application Methods */}
            <div className="mb-6">
              <h4 className="mb-4 text-sm font-medium text-slate-700">
                Application submitted with:
              </h4>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="space-y-3">
                  {activeApplicationMethods.length > 0 ? (
                    activeApplicationMethods.map((method, index) => {
                      const IconComponent = method.icon;
                      return (
                        <motion.div
                          key={method.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3 rounded-lg bg-white p-3 shadow-sm"
                        >
                          <div className={`rounded-lg p-2 ${method.color}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              {method.label}
                            </p>
                            <p className="text-xs text-slate-500">
                              {method.filename}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4">
                      <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">
                        No application methods specified
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              {USER_TYPE === UserType.EMPLOYER ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleWithdrawApplication(application.job.id)}
                  className="flex items-center justify-center space-x-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Reject Application</span>
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="flex-1 sm:flex-none rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  >
                    Close
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleWithdrawApplication(application.job.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      {application?.status === ApplicationStatus.WITHDRAW
                        ? "Re-Apply"
                        : "Withdraw Application"}
                    </span>
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

ViewApplicationMethodModal.displayName = 'ViewApplicationMethodModal';

export default ViewApplicationMethodModal;