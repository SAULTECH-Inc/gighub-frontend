import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApplicantSignupSuccessModal from "../../../ui/ApplicantSignupSuccessModal.tsx";
import useModalStore from "../../../../store/modalStateStores.ts";
import { useAuth } from "../../../../store/useAuth.ts";
import { toast } from "react-toastify";
import { EmployerSignupRequest } from "../../../../utils/types";
import { UserType } from "../../../../utils/enums.ts";
import {
  ArrowLeft,
  Building2,
  FileText,
  Check,
  AlertCircle,
  Sparkles
} from "lucide-react";

interface StepFourProp {
  handlePrev: () => void;
}

const EmployerSignupStepFour: React.FC<StepFourProp> = ({ handlePrev }) => {
  const {
    employerSignupRequest,
    setEmployerSignupRequest,
    resetSignupRequest,
    signup,
  } = useAuth();
  const { openModal, isModalOpen } = useModalStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(
    employerSignupRequest?.companyDescription?.length || 0
  );
  const [validationError, setValidationError] = useState("");

  const maxCharCount = 500;
  const minCharCount = 50;

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (value.length <= maxCharCount) {
      setEmployerSignupRequest({
        ...employerSignupRequest,
        [name]: value,
      } as EmployerSignupRequest);

      setCharCount(value.length);

      // Clear validation error when user starts typing
      if (validationError) {
        setValidationError("");
      }
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const requiredFieldsCompleted =
      employerSignupRequest?.companyName &&
      employerSignupRequest?.email &&
      employerSignupRequest?.companyPhone &&
      employerSignupRequest?.password &&
      employerSignupRequest?.confirmPassword;

    if (!requiredFieldsCompleted) {
      setValidationError("Please complete all required fields from previous steps.");
      return false;
    }

    const description = employerSignupRequest?.companyDescription?.trim();
    if (!description || description.length < minCharCount) {
      setValidationError(`Company description must be at least ${minCharCount} characters.`);
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await signup(UserType.EMPLOYER, employerSignupRequest);

      if (success) {
        openModal("employer-signup-success-modal");
        resetSignupRequest();
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCharCountColor = () => {
    if (charCount < minCharCount) return "text-red-500";
    if (charCount > maxCharCount * 0.9) return "text-orange-500";
    return "text-green-500";
  };

  const getProgressPercentage = () => {
    return Math.min((charCount / minCharCount) * 100, 100);
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Building2 className="w-8 h-8 text-[#6438C2]" />
        </motion.div>

        <motion.h2
          className="text-2xl sm:text-3xl font-semibold text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Complete Your Profile
        </motion.h2>

        <motion.p
          className="text-gray-600 text-sm sm:text-base max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Tell us about your company to help job seekers understand what makes you unique
        </motion.p>
      </div>

      {/* Form Section */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {/* Company Description */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            <FileText className="inline w-4 h-4 mr-2" />
            Company Description
            <span className="text-red-500 ml-1">*</span>
          </label>

          <div className="relative">
            <textarea
              name="companyDescription"
              value={employerSignupRequest?.companyDescription || ""}
              onChange={handleChange}
              placeholder="Describe your company's mission, values, culture, and what makes it a great place to work. This helps candidates understand your organization better..."
              className={`w-full min-h-[160px] px-4 py-3 border rounded-lg resize-none transition-colors focus:ring-2 focus:ring-[#6438C2] focus:border-transparent ${
                validationError && charCount < minCharCount
                  ? "border-red-500 bg-red-50"
                  : charCount >= minCharCount
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
              }`}
              disabled={isSubmitting}
            />

            {/* Character count and progress */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              {charCount >= minCharCount && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-1 bg-green-100 rounded-full"
                >
                  <Check className="w-3 h-3 text-green-600" />
                </motion.div>
              )}
              <span className={`text-xs font-medium ${getCharCountColor()}`}>
                {charCount}/{maxCharCount}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">
                {charCount < minCharCount
                  ? `${minCharCount - charCount} more characters needed`
                  : "Minimum requirement met"
                }
              </span>
              <span className={getCharCountColor()}>
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full transition-all duration-300 ${
                  charCount >= minCharCount ? "bg-green-500" : "bg-[#6438C2]"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          {/* Validation Error */}
          <AnimatePresence>
            {validationError && (
              <motion.div
                className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {validationError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Writing Tips */}
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">💡 Writing tips:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Highlight your company culture and values</li>
                  <li>Mention growth opportunities and benefits</li>
                  <li>Describe your work environment and team</li>
                  <li>Include your company's mission and vision</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 sm:justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <button
          type="button"
          onClick={handlePrev}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || charCount < minCharCount}
          className={`w-full sm:w-auto px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
            isSubmitting || charCount < minCharCount
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#6438C2] hover:bg-[#5931A9] active:transform active:scale-[0.98]"
          } focus:ring-2 focus:ring-purple-100 focus:ring-offset-2`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating Account...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Complete Registration
            </div>
          )}
        </button>
      </motion.div>

      {/* Progress Summary */}
      <motion.div
        className="text-center text-sm text-gray-500 border-t pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p>Step 4 of 4 - You're almost done! 🎉</p>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {isModalOpen("employer-signup-success-modal") && (
          <ApplicantSignupSuccessModal
            modelId="employer-signup-success-modal"
            route="/employer/profile"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EmployerSignupStepFour;