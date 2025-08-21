import React from "react";
import useModalStore from "../../store/modalStateStores.ts";
import {
  X,
  CheckCircle,
  Calendar,
  Mail,
  Bell,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8 text-center">
          {/* Success Animation Container */}
          <div className="relative mb-6">
            {/* Animated Background Circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-green-100 rounded-full animate-pulse opacity-20"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-green-200 rounded-full animate-ping opacity-30"></div>
            </div>

            {/* Main Success Icon */}
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-10 h-10 text-white fill-current" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              🎉 Congratulations!
            </h2>
            <h3 className="text-lg font-semibold text-green-600 mb-4">
              Application Submitted Successfully
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-sm mx-auto">
              Your application has been successfully submitted and all your details
              have been received by the recruiter. You can monitor your application
              status on your dashboard.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 mb-6">
            {/* Primary Action */}
            <Link
              to="/applications"
              onClick={handleCloseModal}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Check Application Status</span>
            </Link>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/dashboard"
                onClick={handleCloseModal}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <button
                onClick={handleCloseModal}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-sm"
              >
                <Bell className="w-4 h-4" />
                <span>Set Alerts</span>
              </button>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
            <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>What happens next?</span>
            </h4>

            <div className="space-y-2 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-xs text-slate-600">
                  You'll receive an email confirmation shortly
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-xs text-slate-600">
                  The recruiter will review your application
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-xs text-slate-600">
                  We'll notify you of any status updates
                </p>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-800 mb-2">
              💡 Pro Tip
            </h4>
            <p className="text-xs text-amber-700">
              While you wait, consider applying to similar positions or
              updating your profile to attract more opportunities.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
            <span>Application ID: #APL-{Date.now().toString().slice(-6)}</span>
            <span>•</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuccessModal;