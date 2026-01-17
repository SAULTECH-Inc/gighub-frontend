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
  Sparkles,
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
    employerSignupRequest?.companyDescription?.length || 0,
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
      setValidationError(
        "Please complete all required fields from previous steps.",
      );
      return false;
    }

    const description = employerSignupRequest?.companyDescription?.trim();
    if (!description || description.length < minCharCount) {
      setValidationError(
        `Company description must be at least ${minCharCount} characters.`,
      );
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
      className="mx-auto w-full max-w-2xl space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="space-y-4 text-center">
        <motion.div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Building2 className="h-8 w-8 text-[#6438C2]" />
        </motion.div>

        <motion.h2
          className="text-2xl font-semibold text-gray-900 sm:text-3xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Complete Your Profile
        </motion.h2>

        <motion.p
          className="mx-auto max-w-md text-sm text-gray-600 sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Tell us about your company to help job seekers understand what makes
          you unique
        </motion.p>
      </div>

      {/* Form Section */}
      <motion.div
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {/* Company Description */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            <FileText className="mr-2 inline h-4 w-4" />
            Company Description
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="relative">
            <textarea
              name="companyDescription"
              value={employerSignupRequest?.companyDescription || ""}
              onChange={handleChange}
              placeholder="Describe your company's mission, values, culture, and what makes it a great place to work. This helps candidates understand your organization better..."
              className={`min-h-[160px] w-full resize-none rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#6438C2] ${
                validationError && charCount < minCharCount
                  ? "border-red-500 bg-red-50"
                  : charCount >= minCharCount
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
              }`}
              disabled={isSubmitting}
            />

            {/* Character count and progress */}
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              {charCount >= minCharCount && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="rounded-full bg-green-100 p-1"
                >
                  <Check className="h-3 w-3 text-green-600" />
                </motion.div>
              )}
              <span className={`text-xs font-medium ${getCharCountColor()}`}>
                {charCount}/{maxCharCount}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                {charCount < minCharCount
                  ? `${minCharCount - charCount} more characters needed`
                  : "Minimum requirement met"}
              </span>
              <span className={getCharCountColor()}>
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
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
                className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {validationError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Writing Tips */}
          <motion.div
            className="rounded-lg border border-blue-200 bg-blue-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
              <div className="text-sm text-blue-700">
                <p className="mb-1 font-medium">💡 Writing tips:</p>
                <ul className="list-inside list-disc space-y-1 text-xs">
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
        className="flex flex-col gap-3 sm:flex-row sm:justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <button
          type="button"
          onClick={handlePrev}
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || charCount < minCharCount}
          className={`w-full rounded-lg px-8 py-3 font-medium text-white transition-all duration-200 sm:w-auto ${
            isSubmitting || charCount < minCharCount
              ? "cursor-not-allowed bg-gray-400"
              : "bg-[#6438C2] hover:bg-[#5931A9] active:scale-[0.98] active:transform"
          } focus:ring-2 focus:ring-purple-100 focus:ring-offset-2`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating Account...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Complete Registration
            </div>
          )}
        </button>
      </motion.div>

      {/* Progress Summary */}
      <motion.div
        className="border-t pt-4 text-center text-sm text-gray-500"
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
