import React, { useState, useEffect } from "react";
import { JobAiSettings, useJobFormStore } from "../../../../store/useJobFormStore";
import { Crown } from "../../../../assets/images";
import { useSubscriptionStore } from "../../../../store/useSubscriptionStore";
import CustomCheckbox from "../../../common/CustomCheckbox";
import CustomRadioButton from "../../../common/CustomRadioButton";
import MultiSelect from "../../../common/MultiSelect";
import { useSkills } from "../../../../hooks/useSkills";
import {
  RiArrowLeftLine,
  RiRobotLine,
  RiShieldCheckLine,
  RiTentLine,
  RiBrainLine,
  RiCheckLine,
  RiTriangleLine,
  RiQuestionLine,
  RiAddLine,
  RiDeleteBin6Line,
  RiEyeLine,
} from "react-icons/ri";
import { Option } from "../../../../utils/types";

const DEFAULT_AI_SETTINGS = {
  minimumMatchPercentage: 60,
  enableAiScreening: false,
  autoRejectThreshold: 30,
  autoAcceptApplications: false,
  strictSkillMatching: false,
  criticalSkills: [],
  minimumExperienceStrict: undefined,
  requiredEducationLevels: [],
  matchPriority: ["skills", "experience"],
  autoRejectSettings: {
    enableAutoReject: false,
    rejectReasons: [],
    sendRejectionEmail: true,
    customRejectionMessage: "",
  },
  resumeAnalysis: {
    checkEmploymentGaps: false,
    analyzeCareerProgression: false,
  },
};

const CreateJobStepFive: React.FC = () => {
  const skills = useSkills();
  const { isSubscribed } = useSubscriptionStore();
  const { prevStep, job, setJobData, postJob, resetFormData } = useJobFormStore();

  // Use LOCAL state for immediate updates
  const [aiSettings, setAiSettings] = useState<any>(job.aiSettings || DEFAULT_AI_SETTINGS);
  const [screeningQuestions, setScreeningQuestions] = useState(job.screeningQuestions || []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync local state to store whenever it changes
  useEffect(() => {
    setJobData({ aiSettings });
  }, [aiSettings]);

  useEffect(() => {
    setJobData({ screeningQuestions });
  }, [screeningQuestions]);

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (aiSettings.enableAiScreening && aiSettings.minimumMatchPercentage < 1) {
      newErrors.minimumMatchPercentage = "Minimum match percentage must be at least 1%";
    }

    if (aiSettings.strictSkillMatching && aiSettings.criticalSkills.length === 0) {
      newErrors.criticalSkills = "Please select critical skills for strict matching";
    }

    screeningQuestions.forEach((question, index) => {
      if (!question.question.trim()) {
        newErrors[`question_${index}`] = "Question text is required";
      }

      const validOptions = question.options?.filter(opt => opt.trim()) || [];
      if ((question.type === "options" || question.type === "dropdown") && validOptions.length < 2) {
        newErrors[`options_${index}`] = "At least 2 valid options are required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAiSettingsChange = (updates: any) => {
    setAiSettings((prev: JobAiSettings) => ({ ...prev, ...updates }));
  };

  const addScreeningQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      question: "",
      type: "short_text" as const,
      required: true,
      options: [],
    };
    setScreeningQuestions(prev => [...prev, newQuestion]);
  };

  const updateScreeningQuestion = (index: number, updates: any) => {
    setScreeningQuestions(prev =>
      prev.map((q, i) => i === index ? { ...q, ...updates } : q)
    );
  };

  const removeScreeningQuestion = (index: number) => {
    setScreeningQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const submitJob = async () => {
    if (!validateFields()) return;

    setIsSubmitting(true);
    try {
      const response = await postJob({
        ...job,
        aiSettings,
        screeningQuestions,
      });
      if (response.statusCode === 201) {
        console.log("Job created successfully:", response.data);
        resetFormData();
      }
    } catch (error) {
      console.error("Error creating job:", error);
      setErrors({ submit: "Failed to create job. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center p-6">
      <div className="w-full max-w-[880px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            AI Screening & Questions
          </h2>
          <p className="text-sm text-gray-600">
            Configure intelligent candidate screening and custom questions
          </p>
        </div>

        <div className="max-h-[70vh] space-y-8 overflow-y-auto p-6">
          {!isSubscribed && (
            <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600">
                    <RiRobotLine className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    AI-Powered Candidate Screening
                  </h3>
                  <p className="mb-4 text-gray-600">
                    Let our AI analyze resumes, match candidates, and automate initial screening to save you hours of manual review.
                  </p>
                  <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700">
                    <img src={Crown} alt="premium crown" className="h-4 w-4" />
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiRobotLine className="h-5 w-5 text-gray-500" />
                <h3 className="text-base font-medium text-gray-900">AI Screening Settings</h3>
              </div>
              {!isSubscribed && (
                <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1.5 text-xs font-medium text-white">
                  <img src={Crown} alt="premium crown" className="h-3 w-3" />
                  <span>Premium</span>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="mb-1 text-sm font-medium text-gray-900">Enable AI Screening</h4>
                    <p className="text-xs text-gray-600">
                      Use AI to automatically analyze and score candidate applications
                    </p>
                  </div>
                  <CustomCheckbox
                    checked={aiSettings.enableAiScreening}
                    disabled={!isSubscribed}
                    onChange={(e) => handleAiSettingsChange({ enableAiScreening: e.target.checked })}
                    size={20}
                    checkColor="#6438C2"
                    label=""
                  />
                </div>

                {aiSettings.enableAiScreening && (
                  <div className="space-y-6 border-t border-gray-200 pt-4">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <RiTentLine className="h-4 w-4 text-gray-500" />
                        Minimum Match Percentage
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={aiSettings.minimumMatchPercentage}
                          onChange={(e) => {
                            handleAiSettingsChange({ minimumMatchPercentage: parseInt(e.target.value) });
                          }}
                          className="h-2 flex-1 cursor-pointer rounded-lg"
                          style={{
                            background: `linear-gradient(to right, #6438C2 0%, #6438C2 ${aiSettings.minimumMatchPercentage}%, #e5e7eb ${aiSettings.minimumMatchPercentage}%, #e5e7eb 100%)`
                          }}
                        />
                        <span className="min-w-[3rem] rounded bg-purple-100 px-2 py-1 text-sm font-bold text-purple-700">
                          {aiSettings.minimumMatchPercentage}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Only show candidates with at least this match percentage
                      </p>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
                      <div className="flex-1">
                        <h4 className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                          <RiCheckLine className="h-4 w-4 text-green-600" />
                          Auto-Accept High Matches
                        </h4>
                        <p className="text-xs text-gray-600">
                          Automatically move candidates with 90%+ match to interview stage
                        </p>
                      </div>
                      <CustomCheckbox
                        checked={aiSettings.autoAcceptApplications}
                        onChange={(e) => handleAiSettingsChange({ autoAcceptApplications: e.target.checked })}
                        size={18}
                        checkColor="#059669"
                        label=""
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-4">
                        <div className="flex-1">
                          <h4 className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                            <RiShieldCheckLine className="h-4 w-4 text-orange-600" />
                            Strict Skill Matching
                          </h4>
                          <p className="text-xs text-gray-600">
                            Require candidates to have ALL critical skills
                          </p>
                        </div>
                        <CustomCheckbox
                          checked={aiSettings.strictSkillMatching}
                          onChange={(e) => handleAiSettingsChange({ strictSkillMatching: e.target.checked })}
                          size={18}
                          checkColor="#D97706"
                          label=""
                        />
                      </div>

                      {aiSettings.strictSkillMatching && (
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">
                            Critical Skills (Required)
                          </label>
                          <MultiSelect
                            placeholder="Select critical skills that candidates MUST have"
                            options={skills}
                            label={"Strict Skill Matching"}
                            selectedItems={aiSettings.criticalSkills.map(
                              (skill: Option) => ({ label: skill, value: skill })
                            )}
                            setSelectedItems={(items) =>
                              handleAiSettingsChange({ criticalSkills: items.map((item) => item.value) })
                            }
                          />
                          {errors.criticalSkills && (
                            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2 text-red-600">
                              <div className="h-2 w-2 rounded-full bg-red-600"></div>
                              <span className="text-xs font-medium">{errors.criticalSkills}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="flex-1">
                          <h4 className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                            <RiTriangleLine className="h-4 w-4 text-red-600" />
                            Auto-Reject Low Matches
                          </h4>
                          <p className="text-xs text-gray-600">
                            Automatically reject candidates below threshold
                          </p>
                        </div>
                        <CustomCheckbox
                          checked={aiSettings.autoRejectSettings?.enableAutoReject || false}
                          onChange={(e) =>
                            handleAiSettingsChange({
                              autoRejectSettings: {
                                ...(aiSettings.autoRejectSettings || {}),
                                enableAutoReject: e.target.checked,
                              },
                            })
                          }
                          size={18}
                          checkColor="#DC2626"
                          label=""
                        />
                      </div>

                      {aiSettings.autoRejectSettings?.enableAutoReject && (
                        <div className="space-y-4 border-l-2 border-red-200 pl-4">
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">
                              Auto-Reject Threshold
                            </label>
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                min="1"
                                max="50"
                                value={aiSettings.autoRejectThreshold}
                                onChange={(e) => {
                                  handleAiSettingsChange({ autoRejectThreshold: parseInt(e.target.value) });
                                }}
                                className="h-2 flex-1 cursor-pointer rounded-lg"
                                style={{
                                  background: `linear-gradient(to right, #DC2626 0%, #DC2626 ${aiSettings.autoRejectThreshold * 2}%, #e5e7eb ${aiSettings.autoRejectThreshold * 2}%, #e5e7eb 100%)`
                                }}
                              />
                              <span className="min-w-[3rem] rounded bg-red-100 px-2 py-1 text-sm font-bold text-red-700">
                                {aiSettings.autoRejectThreshold}%
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <CustomCheckbox
                              checked={aiSettings.autoRejectSettings?.sendRejectionEmail ?? true}
                              onChange={(e) =>
                                handleAiSettingsChange({
                                  autoRejectSettings: {
                                    ...(aiSettings.autoRejectSettings || {}),
                                    sendRejectionEmail: e.target.checked,
                                  },
                                })
                              }
                              size={16}
                              checkColor="#DC2626"
                              label="Send rejection email to candidates"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <RiBrainLine className="h-4 w-4 text-gray-500" />
                        Resume Analysis Features
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                          <CustomCheckbox
                            checked={aiSettings.resumeAnalysis?.checkEmploymentGaps || false}
                            onChange={(e) =>
                              handleAiSettingsChange({
                                resumeAnalysis: {
                                  ...(aiSettings.resumeAnalysis || {}),
                                  checkEmploymentGaps: e.target.checked,
                                },
                              })
                            }
                            size={16}
                            checkColor="#6438C2"
                            label="Check employment gaps"
                          />
                        </div>
                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                          <CustomCheckbox
                            checked={aiSettings.resumeAnalysis?.analyzeCareerProgression || false}
                            onChange={(e) =>
                              handleAiSettingsChange({
                                resumeAnalysis: {
                                  ...(aiSettings.resumeAnalysis || {}),
                                  analyzeCareerProgression: e.target.checked,
                                },
                              })
                            }
                            size={16}
                            checkColor="#6438C2"
                            label="Analyze career progression"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiQuestionLine className="h-5 w-5 text-gray-500" />
                <h3 className="text-base font-medium text-gray-900">Screening Questions</h3>
              </div>
              <button
                onClick={addScreeningQuestion}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700"
              >
                <RiAddLine className="h-4 w-4" />
                Add Question
              </button>
            </div>

            <div className="space-y-4">
              {screeningQuestions.map((question, index) => (
                <div key={question.id} className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Question {index + 1}</h4>
                      <button
                        onClick={() => removeScreeningQuestion(index)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <RiDeleteBin6Line className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Question Text</label>
                      <textarea
                        value={question.question}
                        onChange={(e) => updateScreeningQuestion(index, { question: e.target.value })}
                        placeholder="Enter your screening question..."
                        className="h-20 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                      {errors[`question_${index}`] && (
                        <div className="flex items-center gap-2 text-xs text-red-600">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-600"></div>
                          <span>{errors[`question_${index}`]}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Answer Type</label>
                        <select
                          value={question.type}
                          onChange={(e) =>
                            updateScreeningQuestion(index, {
                              type: e.target.value,
                              options: e.target.value === "options" || e.target.value === "dropdown" ? ["", ""] : [],
                              expectedAnswer: "",
                            })
                          }
                          className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                        >
                          <option value="short_text">Short Text</option>
                          <option value="long_text">Long Text</option>
                          <option value="yes_no">Yes/No</option>
                          <option value="options">Multiple Choice</option>
                          <option value="dropdown">Dropdown</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">AI Weight (1-10)</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={question.aiWeight || 5}
                          onChange={(e) => updateScreeningQuestion(index, { aiWeight: parseInt(e.target.value) || 5 })}
                          className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                          placeholder="5"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-6">
                        <CustomCheckbox
                          checked={question.required}
                          onChange={(e) => updateScreeningQuestion(index, { required: e.target.checked })}
                          size={16}
                          checkColor="#6438C2"
                          label="Required"
                        />
                      </div>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <h5 className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-900">
                        <RiBrainLine className="h-4 w-4" />
                        AI Scoring Configuration
                      </h5>

                      {question.type === "yes_no" && (
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Expected Answer</label>
                          <div className="flex gap-4">
                            <CustomRadioButton
                              name={`expected_${question.id}`}
                              value="yes"
                              checked={question.expectedAnswer === "yes"}
                              onChange={() => updateScreeningQuestion(index, { expectedAnswer: "yes" })}
                              label="Yes"
                              size={16}
                              color="#6438C2"
                            />
                            <CustomRadioButton
                              name={`expected_${question.id}`}
                              value="no"
                              checked={question.expectedAnswer === "no"}
                              onChange={() => updateScreeningQuestion(index, { expectedAnswer: "no" })}
                              label="No"
                              size={16}
                              color="#6438C2"
                            />
                          </div>
                        </div>
                      )}

                      {(question.type === "options" || question.type === "dropdown") &&
                        question.options &&
                        question.options.length > 0 && (
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">Expected Answer(s)</label>
                            <div className="space-y-2">
                              {question.options.map(
                                (option, optionIndex) =>
                                  option.trim() && (
                                    <div key={optionIndex} className="flex items-center gap-2">
                                      <CustomCheckbox
                                        checked={
                                          Array.isArray(question.expectedAnswer)
                                            ? question.expectedAnswer.includes(option)
                                            : question.expectedAnswer === option
                                        }
                                        onChange={(e) => {
                                          const current = Array.isArray(question.expectedAnswer)
                                            ? question.expectedAnswer
                                            : [];
                                          const updated = e.target.checked
                                            ? [...current, option]
                                            : current.filter((a) => a !== option);
                                          updateScreeningQuestion(index, { expectedAnswer: updated });
                                        }}
                                        size={16}
                                        checkColor="#6438C2"
                                        label={option}
                                      />
                                    </div>
                                  )
                              )}
                            </div>
                          </div>
                        )}

                      {(question.type === "short_text" || question.type === "long_text") && (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Expected Keywords/Phrases</label>
                            <input
                              type="text"
                              value={typeof question.expectedAnswer === "string" ? question.expectedAnswer : ""}
                              onChange={(e) => updateScreeningQuestion(index, { expectedAnswer: e.target.value })}
                              placeholder="e.g. React, JavaScript, 5+ years experience (comma separated)"
                              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Scoring Criteria</label>
                            <textarea
                              value={question.scoringCriteria || ""}
                              onChange={(e) => updateScreeningQuestion(index, { scoringCriteria: e.target.value })}
                              placeholder="Describe how AI should evaluate this answer (e.g., 'Look for specific technologies mentioned, years of experience, leadership examples')"
                              className="h-16 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {(question.type === "options" || question.type === "dropdown") && (
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Answer Options</label>
                        <div className="space-y-2">
                          {(question.options || []).map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(question.options || [])];
                                  newOptions[optionIndex] = e.target.value;
                                  updateScreeningQuestion(index, { options: newOptions });
                                }}
                                placeholder={`Option ${optionIndex + 1}`}
                                className="h-10 flex-1 rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                              />
                              <button
                                onClick={() => {
                                  const newOptions = (question.options || []).filter((_, i) => i !== optionIndex);
                                  updateScreeningQuestion(index, { options: newOptions });
                                }}
                                className="p-2 text-red-600 hover:text-red-700"
                              >
                                <RiDeleteBin6Line className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newOptions = [...(question.options || []), ""];
                              updateScreeningQuestion(index, { options: newOptions });
                            }}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                          >
                            <RiAddLine className="h-4 w-4" />
                            Add Option
                          </button>
                        </div>
                        {errors[`options_${index}`] && (
                          <div className="flex items-center gap-2 text-xs text-red-600">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-600"></div>
                            <span>{errors[`options_${index}`]}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {screeningQuestions.length === 0 && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 py-12 text-center">
                  <RiQuestionLine className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">No Screening Questions</h3>
                  <p className="mb-4 text-gray-600">
                    Add custom questions to screen candidates before they apply
                  </p>
                  <button
                    onClick={addScreeningQuestion}
                    className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-all duration-200 hover:bg-blue-700"
                  >
                    Add Your First Question
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {errors.submit && (
        <div className="mt-4 w-full max-w-[880px] rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <div className="mt-6 flex w-full max-w-[880px] justify-between">
        <button
          onClick={prevStep}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-gray-100 px-8 py-3 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RiArrowLeftLine className="h-4 w-4" />
          <span>Back</span>
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-blue-100 px-6 py-3 font-medium text-blue-700 transition-all duration-200 hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RiEyeLine className="h-4 w-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={submitJob}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RiRobotLine className="h-4 w-4" />
            <span>{isSubmitting ? "Publishing..." : "Publish Job"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateJobStepFive;
