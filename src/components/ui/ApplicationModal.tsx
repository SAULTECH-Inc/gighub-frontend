import React, { useEffect, useState } from "react";
import ApplicationSuccessModal from "./ApplicationSuccessModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import {
  ApplicationMethod,
  ScreeningAnswer,
  ScreeningQuestion,
} from "../../utils/types";
import { useJobSearchSettings } from "../../store/useJobSearchSettings.ts";
import { showErrorToast } from "../../utils/toastConfig.tsx";
import { useJobActions } from "../../store/useJobActions.ts";
import { useScreeningQuestions } from "../../hooks/useScreeningQuestions.ts";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ExternalLink,
  FileText,
  HelpCircle,
  Info,
  Loader2,
  Mail,
  Send,
  User,
  Video,
  X,
} from "lucide-react";
import { ScreeningQuestionType } from "../../utils/enums.ts";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [screeningAnswers, setScreeningAnswers] = useState<
    Record<number, ScreeningAnswer>
  >({});
  const { jobToApply } = useJobSearchSettings();
  const { applyToJob } = useJobActions();

  // Fetch screening questions using custom hook
  const {
    data: screeningQuestions = [],
    isLoading: isLoadingQuestions
  } = useScreeningQuestions({
    jobId: jobToApply?.id,
    enabled: isOpen,
  });

  const hasScreeningQuestions = screeningQuestions.length > 0;
  const totalSteps = hasScreeningQuestions ? 2 : 1;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedOptions([]);
      setScreeningAnswers({});
    }
  }, [isOpen]);

  // Separate effect for closing modal to avoid recursion
  const handleCloseApplicationModal = () => {
    setSelectedOptions([]);
    setScreeningAnswers([]);
    setCurrentStep(1);
    closeModal(modalId);
  };

  const handleSelection = (option: string) => {
    setSelectedOptions((prevState) =>
      prevState.includes(option)
        ? prevState.filter((item) => item !== option)
        : [...prevState, option],
    );
  };

  const handleScreeningAnswer = (
    questionIndex: number,
    answer: ScreeningAnswer,
  ) => {
    setScreeningAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const validateScreeningStep = (): boolean => {
    if (!screeningQuestions.length) return true;

    const requiredQuestions = screeningQuestions.filter((q) => q.required);

    for (const question of requiredQuestions) {
      const questionIndex = screeningQuestions.indexOf(question);
      const answer = screeningAnswers[questionIndex];

      if (!answer) return false;

      if (
        question.type === ScreeningQuestionType.YES_NO &&
        answer.answerBoolean === undefined
      )
        return false;
      if (
        question.type === ScreeningQuestionType.LONG_TEXT &&
        !answer.answerText?.trim()
      )
        return false;
      if (
        question.type === ScreeningQuestionType.OPTIONS &&
        !answer.answerOptions?.length
      )
        return false;
      if (
        question.type === ScreeningQuestionType.DROPDOWN &&
        !answer.answerOptions?.length
      )
        return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && hasScreeningQuestions && !validateScreeningStep()) {
      showErrorToast("Please answer all required screening questions");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleApplyNow = async () => {
    if (selectedOptions.length === 0) {
      showErrorToast("Please select at least one application method");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedAnswers: ScreeningAnswer[] = Object.entries(
        screeningAnswers,
      ).map(([questionIndex, answer]) => {
        const q = (screeningQuestions || []);
        return ({
          ...answer,
          questionId: q[parseInt(questionIndex)].id as number
        });
      });

      const response = await applyToJob(
        jobToApply?.id as number,
        jobToApply?.applicationMethod as ApplicationMethod,
        formattedAnswers,
      );

      if (response.statusCode === 201) {
        handleCloseApplicationModal();
        openModal("application-success");
      }
    } catch (err: any) {
      console.log(err?.response?.data?.message);
      showErrorToast(
        err?.response?.data?.message || "Application failed. Please try again.",
      );
      handleCloseApplicationModal();
    } finally {
      setIsSubmitting(false);
    }
  };



  const renderScreeningQuestion = (
    question: ScreeningQuestion,
    index: number,
  ) => {
    const answer = screeningAnswers[index] || {};

    switch (question.type) {
      case ScreeningQuestionType.YES_NO:
        return (
          <div className="space-y-3">
            <div className="flex gap-3">
              <button
                onClick={() =>
                  handleScreeningAnswer(index, {
                    ...answer,
                    questionId: index,
                    answerBoolean: true,
                  })
                }
                className={`flex-1 rounded-lg border-2 p-3 transition-all duration-200 ${
                  answer.answerBoolean === true
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-slate-200 text-slate-600 hover:border-green-300"
                }`}
              >
                <CheckCircle className="mx-auto mb-1 h-5 w-5" />
                Yes
              </button>
              <button
                onClick={() =>
                  handleScreeningAnswer(index, {
                    ...answer,
                    questionId: index,
                    answerBoolean: false,
                  })
                }
                className={`flex-1 rounded-lg border-2 p-3 transition-all duration-200 ${
                  answer.answerBoolean === false
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-slate-200 text-slate-600 hover:border-red-300"
                }`}
              >
                <X className="mx-auto mb-1 h-5 w-5" />
                No
              </button>
            </div>
          </div>
        );

      case ScreeningQuestionType.LONG_TEXT:
        return (
          <textarea
            value={answer.answerText || ""}
            onChange={(e) =>
              handleScreeningAnswer(index, {
                ...answer,
                questionId: index,
                answerText: e.target.value,
              })
            }
            placeholder="Enter your answer..."
            className="w-full resize-none rounded-lg border-2 border-slate-200 p-3 focus:border-indigo-500 focus:outline-none"
            rows={4}
          />
        );

      case ScreeningQuestionType.SHORT_TEXT:
        return (
          <input
            value={answer.answerText || ""}
            onChange={(e) =>
              handleScreeningAnswer(index, {
                ...answer,
                questionId: index,
                answerText: e.target.value,
              })
            }
            placeholder="Enter your answer..."
            className="w-full resize-none rounded-lg border-2 border-slate-200 p-3 focus:border-indigo-500 focus:outline-none"
          />
        );

      case ScreeningQuestionType.OPTIONS:
        return (
          <div className="relative">
            <select
              value={answer.answerOptions?.[0] || ""}
              onChange={(e) =>
                handleScreeningAnswer(index, {
                  ...answer,
                  questionId: index,
                  answerOptions: e.target.value ? [e.target.value] : [],
                })
              }
              className="w-full appearance-none rounded-lg border-2 border-slate-200 bg-white p-3 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Select an option...</option>
              {question.options?.map((option, optIndex) => (
                <option key={optIndex} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
          </div>
        );

      case ScreeningQuestionType.DROPDOWN:
        return (
          <div className="max-h-40 space-y-2 overflow-y-auto">
            {question.options?.map((option, optIndex) => {
              const isSelected =
                answer.answerOptions?.includes(option) || false;
              return (
                <label
                  key={optIndex}
                  className="flex cursor-pointer items-center space-x-3 rounded p-2 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const currentOptions = answer.answerOptions || [];
                      const newOptions = e.target.checked
                        ? [...currentOptions, option]
                        : currentOptions.filter((item) => item !== option);
                      handleScreeningAnswer(index, {
                        ...answer,
                        questionId: index,
                        answerOptions: newOptions,
                      });
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">{option}</span>
                </label>
              );
            })}
          </div>
        );

      default:
        return null;
    }
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

  const availableMethods = Object.entries(methodMap).filter(
    ([, key]) => applicationMethod[key],
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
      {/* FIXED: Added backdrop-blur-sm and darker overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-xs">
        {/* FIXED: Added fixed height h-[90vh] max-h-[700px] */}
        <div className="relative flex h-[90vh] max-h-[700px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header - FIXED */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30 p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-2 text-white">
                {hasScreeningQuestions && currentStep === 1 ? (
                  <HelpCircle className="h-5 w-5" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  {hasScreeningQuestions && currentStep === 1
                    ? "Screening Questions"
                    : "Apply to Position"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {hasScreeningQuestions && currentStep === 1
                    ? "Answer these questions to proceed with your application"
                    : "Choose how you'd like to apply"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {totalSteps > 1 && (
                <div className="flex items-center space-x-2 rounded-full border bg-white px-3 py-1">
                  <span className="w-full text-xs md:text-sm font-medium text-slate-600">
                    {currentStep}/{totalSteps}
                  </span>
                </div>
              )}
              <button
                onClick={handleCloseApplicationModal}
                className="rounded-full p-2 transition-colors hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Progress Bar - FIXED */}
          {totalSteps > 1 && (
            <div className="bg-slate-50 px-6 py-2">
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Content - SCROLLABLE - FIXED: Added scroll-smooth */}
          <div className="flex-1 overflow-y-auto scroll-smooth">
            {/* Job Info - Always visible */}
            <div className="border-b border-slate-100 p-4 sm:p-6">
              <div className="mb-3 flex items-center space-x-3">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-slate-800">
                  Position Details
                </h3>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h4 className="mb-1 font-semibold text-slate-900">
                  {jobToApply?.title}
                </h4>
                <p className="text-sm text-slate-600">
                  {jobToApply?.company} • {jobToApply?.location}
                </p>
              </div>
            </div>

            {/* Step 1: Screening Questions - FIXED: Using direct condition check */}
            {hasScreeningQuestions && currentStep === 1 && (
              <div className="p-4 sm:p-6">
                {isLoadingQuestions ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    <p className="mt-4 text-sm text-slate-600">Loading screening questions...</p>
                  </div>
                ) : (
                  <>
                    {/* ADDED: Informative banner */}
                    <div className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                      <p className="flex items-start space-x-2 text-sm text-indigo-900">
                        <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span>
                          Please answer the following questions to proceed with your application.
                          Questions marked with * are required.
                        </span>
                      </p>
                    </div>

                    <div className="space-y-6">
                      {screeningQuestions.map((question, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="mb-3 flex items-start space-x-2">
                            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <h4 className="mb-1 font-medium text-slate-900">
                                {question.question}
                                {question.required && (
                                  <span className="ml-1 text-red-500">*</span>
                                )}
                              </h4>
                              {!question.required && (
                                <p className="mb-2 text-xs text-slate-500">
                                  Optional
                                </p>
                              )}
                            </div>
                          </div>
                          {renderScreeningQuestion(question, index)}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 2: Application Methods - FIXED: Using direct condition check */}
            {((!hasScreeningQuestions && currentStep === 1) || (hasScreeningQuestions && currentStep === 2)) && (
              <>
                {requiredMethods.length > 0 && (
                  <div className="border-b border-slate-100 p-4 sm:p-6">
                    <h3 className="mb-3 flex items-center space-x-2 font-semibold text-slate-800">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Recruiter Requirements</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {requiredMethods.map(({ label, key }) => {
                        const isSelected = selectedOptions.includes(label);
                        return (
                          <button
                            key={key}
                            onClick={() => handleSelection(label)}
                            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                              isSelected
                                ? "border-2 border-indigo-600 bg-indigo-600 text-white"
                                : "border-2 border-indigo-200 bg-indigo-50 text-indigo-700 hover:border-indigo-300 hover:bg-indigo-100"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-3 flex items-start space-x-2 text-xs text-slate-500 sm:text-sm">
                      <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                      <span>
                        Select your preferred application methods. We'll
                        automatically send your application to the recruiter.
                      </span>
                    </p>
                  </div>
                )}

                <div className="p-4 sm:p-6">
                  <h3 className="mb-4 flex items-center space-x-2 font-semibold text-slate-800">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                    <span>Application Methods</span>
                  </h3>

                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                    {availableMethods.map(([label, key]) => {
                      const isSelected = selectedOptions.includes(label);
                      const IconComponent =
                        iconMapping[label]?.icon || FileText;
                      const iconColor =
                        iconMapping[label]?.color || "text-slate-600";

                      return (
                        <div
                          key={key}
                          onClick={() => handleSelection(label)}
                          className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                            isSelected
                              ? "scale-105 transform border-indigo-500 bg-indigo-50 shadow-lg"
                              : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="absolute top-3 right-3">
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                                isSelected
                                  ? "border-indigo-500 bg-indigo-500"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && (
                                <CheckCircle className="h-4 w-4 fill-current text-white" />
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-center space-y-3 text-center">
                            <div
                              className={`rounded-xl border border-slate-200 bg-white p-3 ${iconColor}`}
                            >
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-slate-900">
                                {label
                                  .replace("Applied with ", "")
                                  .replace("Apply with ", "")}
                              </h4>
                              <p className="mt-1 text-xs text-slate-500">
                                {label.includes("Profile") &&
                                  "Use your profile information"}
                                {label.includes("CV") &&
                                  "Upload your resume/CV"}
                                {label.includes("Video") &&
                                  "Record a video introduction"}
                                {label.includes("work sample") &&
                                  "Show your portfolio"}
                                {label.includes("Cover Letter") &&
                                  "Write a personalized letter"}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedOptions.length === 0 && (
                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <p className="flex items-center space-x-2 text-sm text-amber-800">
                        <Info className="h-4 w-4" />
                        <span>
                          Please select at least one application method to
                          proceed.
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer - FIXED (stays at bottom) */}
          <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="flex flex-1 gap-3">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center justify-center space-x-2 rounded-lg border-2 border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                )}

                <Link
                  to={`/employers/${jobToApply?.employer?.id}/${jobToApply?.employer?.companyName}/profile`}
                  className="flex flex-1 items-center justify-center space-x-2 rounded-lg border-2 border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Recruiter Profile</span>
                </Link>
              </div>

              {currentStep < totalSteps ? (
                <button
                  onClick={handleNextStep}
                  className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 sm:min-w-[140px] sm:flex-none"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleApplyNow}
                  disabled={selectedOptions.length === 0 || isSubmitting}
                  className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500 sm:min-w-[140px] sm:flex-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Applying...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {currentStep === 2 && selectedOptions.length > 0 && (
              <div className="mt-3 text-center">
                <p className="text-xs text-slate-600">
                  Selected: {selectedOptions.join(", ")} (
                  {selectedOptions.length} method
                  {selectedOptions.length > 1 ? "s" : ""})
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
