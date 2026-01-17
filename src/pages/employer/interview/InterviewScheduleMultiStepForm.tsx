import React, { useCallback, useEffect, useRef } from "react";
import { Gighub } from "../../../assets/icons.ts";
import cancel from "../../../assets/icons/cancelMedium.svg";
import useModalStore from "../../../store/modalStateStores.ts";
import InterviewStepOne from "./InterviewStepOne.tsx";
import InterviewStepTwo from "./InterviewStepTwo.tsx";
import InterviewStepThree from "./InterviewStepThree.tsx";
import InterviewStepFour from "./InterviewStepFour.tsx";
import { useScheduleInterview } from "../../../store/useScheduleInterview.ts";

interface InterviewScheduleMultiStepFormProps {
  modalId: string;
}

// Step configuration for better maintainability
const STEPS_CONFIG = [
  { id: 1, title: "Select Candidates & Job", component: InterviewStepOne },
  { id: 2, title: "Interview Type & Details", component: InterviewStepTwo },
  { id: 3, title: "Date & Time", component: InterviewStepThree },
  { id: 4, title: "Review & Submit", component: InterviewStepFour },
] as const;

const TOTAL_STEPS = STEPS_CONFIG.length;

const InterviewScheduleMultiStepForm: React.FC<
  InterviewScheduleMultiStepFormProps
> = ({ modalId }) => {
  const { step } = useScheduleInterview();
  const { modals, closeModal } = useModalStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const isOpen = modals[modalId];

  // Get current step configuration
  const currentStepConfig = STEPS_CONFIG.find((s) => s.id === step);
  const CurrentStepComponent = currentStepConfig?.component || InterviewStepOne;
  const currentStepTitle = currentStepConfig?.title || "";

  // Handle modal close with cleanup
  const handleClose = useCallback(() => {
    closeModal(modalId);
    // Optional: Reset form state when closing
    // reset();
  }, [closeModal, modalId]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose]);

  // Handle click outside modal
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        handleClose();
      }
    },
    [handleClose],
  );

  // Calculate progress percentage
  const progressPercentage = (step / TOTAL_STEPS) * 100;

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-2"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className="flex h-[80vh] w-full max-w-[900px] flex-col items-center overflow-y-auto rounded-lg bg-[#F7F7F7] py-4 shadow-xl transition-all duration-300 ease-in-out md:h-[90vh] md:max-h-[900px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="flex w-[92%] max-w-[900px] flex-col gap-4 py-2">
          {/* Title and Close Button */}
          <div className="flex items-center justify-between">
            <h1
              id="modal-title"
              className="text-lg font-bold text-[#000000] sm:text-2xl"
            >
              Schedule Interview
            </h1>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-200 focus:bg-gray-200 focus:ring-2 focus:ring-[#6438C2] focus:ring-offset-2 focus:outline-none"
              aria-label="Close modal"
              type="button"
            >
              <img
                src={cancel}
                alt=""
                className="h-3 w-3 sm:h-4 sm:w-4"
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Logo and Progress Section */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src={Gighub} alt="GigHub logo" className="h-6 w-6" />
              <p className="font-black text-[#FA4E09]">GigHub</p>
            </div>

            {/* Progress Indicator */}
            <div className="flex flex-wrap items-center gap-4 font-bold">
              {/* Progress Bar */}
              <div className="relative flex h-[10px] w-[100px] overflow-hidden rounded-[10px] bg-white sm:w-[247px]">
                <div
                  className="h-full bg-[#6438C2] transition-all duration-300 ease-in-out"
                  style={{ width: `${progressPercentage}%` }}
                  role="progressbar"
                  aria-valuenow={step}
                  aria-valuemin={1}
                  aria-valuemax={TOTAL_STEPS}
                  aria-label={`Step ${step} of ${TOTAL_STEPS}`}
                />
              </div>

              {/* Step Counter */}
              <span className="text-sm sm:text-base" aria-live="polite">
                {step} / {TOTAL_STEPS}
              </span>
            </div>
          </div>

          {/* Step Title */}
          <div className="border-b border-gray-200 pb-2">
            <h2
              id="modal-description"
              className="text-sm font-medium text-gray-600 sm:text-base"
            >
              {currentStepTitle}
            </h2>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex w-full flex-1 flex-col items-center justify-start overflow-y-auto rounded-[10px] px-4">
          <div className="w-full transition-opacity duration-200">
            <CurrentStepComponent />
          </div>
        </div>

        {/* Step Navigation Dots (Optional) */}
        <div className="mt-4 flex space-x-2">
          {STEPS_CONFIG.map((stepConfig) => (
            <div
              key={stepConfig.id}
              className={`h-2 w-2 rounded-full transition-colors ${
                stepConfig.id === step
                  ? "bg-[#6438C2]"
                  : stepConfig.id < step
                    ? "bg-[#56E5A1]"
                    : "bg-gray-300"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduleMultiStepForm;
