import React, { useState } from "react";
import ApplicationSuccessModal from "./ApplicationSuccessModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import { ApplicationMethod } from "../../utils/types";
import { useJobSearchSettings } from "../../store/useJobSearchSettings.ts";
import { showErrorToast } from "../../utils/toastConfig.tsx";
import { useJobActions } from "../../store/useJobActions.ts";
import { Link } from "react-router-dom";
import {
  X,
  FileText,
  Video,
  User,
  Briefcase,
  Mail,
  CheckCircle,
  ExternalLink,
  Send,
  Loader2,
  Info
} from "lucide-react";

interface ApplicationModalProps {
  modalId: string;
  applicationMethod: ApplicationMethod;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
                                                             modalId,
                                                             applicationMethod,
                                                           }) => {
  const { modals, closeModal, openModal } = useModalStore();
  const isOpen = modals[modalId];
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { jobToApply } = useJobSearchSettings();
  const { applyToJob } = useJobActions();

  const handleSelection = (option: string) => {
    setSelectedOptions((prevState) =>
      prevState.includes(option)
        ? prevState.filter((item) => item !== option)
        : [...prevState, option],
    );
  };

  const handleApplyNow = async () => {
    if (selectedOptions.length === 0) {
      showErrorToast("Please select at least one application method");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await applyToJob(
        jobToApply?.id as number,
        jobToApply?.applicationMethod as ApplicationMethod,
      );

      if (response.statusCode === 201) {
        closeModal(modalId);
        openModal("application-success");
      }
    } catch (err: any) {
      console.log(err?.response?.data?.message);
      showErrorToast(err?.response?.data?.message || "Application failed. Please try again.");
      closeModal(modalId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseApplicationModal = () => {
    closeModal(modalId);
    setSelectedOptions([]);
  };

  const iconMapping: Record<string, any> = {
    "Applied with Profile": { icon: User, color: "text-blue-600" },
    "Apply with Video": { icon: Video, color: "text-red-600" },
    "Apply with CV": { icon: FileText, color: "text-green-600" },
    "Apply with work sample": { icon: Briefcase, color: "text-purple-600" },
    "Apply with Cover Letter": { icon: Mail, color: "text-indigo-600" },
  };

  const methodMap: Record<string, keyof ApplicationMethod> = {
    "Applied with Profile": "byProfile",
    "Apply with CV": "byCv",
    "Apply with Video": "byVideo",
    "Apply with work sample": "byPortfolio",
    "Apply with Cover Letter": "byCoverLetter",
  };

  // Get available methods
  const availableMethods = Object.entries(methodMap).filter(
    ([, key]) => applicationMethod[key]
  );

  const requiredMethods = [
    { label: "CV", key: "byCv" },
    { label: "Portfolio", key: "byPortfolio" },
    { label: "Profile", key: "byProfile" },
    { label: "Video", key: "byVideo" },
    { label: "Cover Letter", key: "byCoverLetter" },
  ].filter(({ key }) => applicationMethod[key as keyof ApplicationMethod]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-2xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Apply to Position
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Choose your application method
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseApplicationModal}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Job Info */}
            <div className="p-4 sm:p-6 border-b border-slate-100">
              <div className="flex items-center space-x-3 mb-3">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-800">Position Details</h3>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-slate-900 mb-1">
                  {jobToApply?.title}
                </h4>
                <p className="text-sm text-slate-600">
                  {jobToApply?.company} • {jobToApply?.location}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {requiredMethods.length > 0 && (
              <div className="p-4 sm:p-6 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Recruiter Requirements</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {requiredMethods.map(({ label, key }) => {
                    const isSelected = selectedOptions.includes(label);
                    return (
                      <button
                        key={key}
                        onClick={() => handleSelection(label)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? "bg-indigo-600 text-white border-2 border-indigo-600"
                            : "bg-indigo-50 text-indigo-700 border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-100"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-3 flex items-start space-x-2">
                  <Info className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                  <span>
                    Select your preferred application methods. We'll automatically send your application to the recruiter.
                  </span>
                </p>
              </div>
            )}

            {/* Application Methods */}
            <div className="p-4 sm:p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <span>Application Methods</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {availableMethods.map(([label, key]) => {
                  const isSelected = selectedOptions.includes(label);
                  const IconComponent = iconMapping[label]?.icon || FileText;
                  const iconColor = iconMapping[label]?.color || "text-slate-600";

                  return (
                    <div
                      key={key}
                      onClick={() => handleSelection(label)}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 shadow-lg transform scale-105"
                          : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                      }`}
                    >
                      {/* Selection Indicator */}
                      <div className="absolute top-3 right-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-500"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 text-white fill-current" />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`p-3 rounded-xl bg-white border border-slate-200 ${iconColor}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 text-sm">
                            {label.replace("Applied with ", "").replace("Apply with ", "")}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            {label.includes("Profile") && "Use your profile information"}
                            {label.includes("CV") && "Upload your resume/CV"}
                            {label.includes("Video") && "Record a video introduction"}
                            {label.includes("work sample") && "Show your portfolio"}
                            {label.includes("Cover Letter") && "Write a personalized letter"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedOptions.length === 0 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 flex items-center space-x-2">
                    <Info className="w-4 h-4" />
                    <span>Please select at least one application method to proceed.</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-4 sm:p-6 bg-slate-50">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to={`/employers/${jobToApply?.employer?.id}/${jobToApply?.employer?.companyName}/profile`}
                className="flex items-center justify-center space-x-2 flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-white hover:border-slate-400 transition-all duration-200 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Recruiter Profile</span>
              </Link>

              <button
                onClick={handleApplyNow}
                disabled={selectedOptions.length === 0 || isSubmitting}
                className="flex items-center justify-center space-x-2 flex-1 sm:flex-none sm:min-w-[140px] px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Applying...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Apply Now</span>
                  </>
                )}
              </button>
            </div>

            {/* Selected Summary */}
            {selectedOptions.length > 0 && (
              <div className="mt-3 text-center">
                <p className="text-xs text-slate-600">
                  Selected: {selectedOptions.join(", ")} ({selectedOptions.length} method{selectedOptions.length > 1 ? 's' : ''})
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ApplicationSuccessModal modalId="application-success" />
    </>
  );
};

export default ApplicationModal;