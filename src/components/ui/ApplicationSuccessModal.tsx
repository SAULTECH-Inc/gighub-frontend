import React from "react";
import useModalStore from "../../store/modalStateStores.ts";
import { X, CheckCircle, Calendar, Mail, Bell, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import Modal from "../common/Modal.tsx";

interface SuccessModalProps {
  modalId: string;
}

const ApplicationSuccessModal: React.FC<SuccessModalProps> = ({ modalId }) => {
  const { modals, closeModal } = useModalStore();
  const isOpen = modals[modalId];

  const handleCloseModal = () => {
    if (isOpen) {
      closeModal(modalId);
    }
  };

  return (
    <Modal modalId={modalId} backdropClassName="bg-black/20">
      <div className="relative max-h-[95vh] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 z-10 rounded-full p-2 transition-colors hover:bg-slate-100"
        >
          <X className="h-5 w-5 text-slate-600" />
        </button>

        {/* Content */}
        <div className="p-6 text-center sm:p-8">
          {/* Success Animation Container */}
          <div className="relative mb-6">
            {/* Animated Background Circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 animate-pulse rounded-full bg-green-100 opacity-20"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 animate-ping rounded-full bg-green-200 opacity-30"></div>
            </div>

            {/* Main Success Icon */}
            <div className="relative flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                <CheckCircle className="h-10 w-10 fill-current text-white" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-8">
            <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              🎉 Congratulations!
            </h2>
            <h3 className="mb-4 text-lg font-semibold text-green-600">
              Application Submitted Successfully
            </h3>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-600 sm:text-base">
              Your application has been successfully submitted and all your
              details have been received by the recruiter. You can monitor your
              application status on your dashboard.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-6 space-y-4">
            {/* Primary Action */}
            <Link
              to="/applicant/my-applications"
              className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Check Application Status</span>
            </Link>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/applicant/dashboard"
                className="flex items-center justify-center space-x-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                <Calendar className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/settings"
                className="flex items-center justify-center space-x-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                <Bell className="h-4 w-4" />
                <span>Set Alerts</span>
              </Link>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="mb-6 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
            <h4 className="mb-3 flex items-center justify-center space-x-2 text-sm font-semibold text-slate-800">
              <Mail className="h-4 w-4 text-blue-600" />
              <span>What happens next?</span>
            </h4>

            <div className="space-y-2 text-left">
              <div className="flex items-start space-x-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                <p className="text-xs text-slate-600">
                  You'll receive an email confirmation shortly
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                <p className="text-xs text-slate-600">
                  The recruiter will review your application
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                <p className="text-xs text-slate-600">
                  We'll notify you of any status updates
                </p>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h4 className="mb-2 text-sm font-semibold text-amber-800">
              💡 Pro Tip
            </h4>
            <p className="text-xs text-amber-700">
              While you wait, consider applying to similar positions or updating
              your profile to attract more opportunities.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
            <span>Application ID: #APL-{Date.now().toString().slice(-6)}</span>
            <span>•</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ApplicationSuccessModal;
