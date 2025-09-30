import React, { useState } from "react";
import { useJobFormStore } from "../../../../store/useJobFormStore";
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
  RiEyeLine
} from "react-icons/ri";

const CreateJobStepFive: React.FC = () => {
  const skills = useSkills();
  const { isSubscribed } = useSubscriptionStore();
  const { prevStep, job, setJobData, postJob, resetFormData } = useJobFormStore();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPreview, setShowPreview] = useState(false);

  // Initialize AI settings if they don't exist
  const aiSettings = job.aiSettings || {
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
      customRejectionMessage: ""
    },
    resumeAnalysis: {
      checkEmploymentGaps: false,
      analyzeCareerProgression: false
    }
  };

  // Screening questions state
  const [screeningQuestions, setScreeningQuestions] = useState(
    job.screeningQuestions || []
  );

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (aiSettings.enableAiScreening && aiSettings.minimumMatchPercentage < 1) {
      newErrors.minimumMatchPercentage = "Minimum match percentage must be at least 1%";
    }

    if (aiSettings.strictSkillMatching && aiSettings.criticalSkills.length === 0) {
      newErrors.criticalSkills = "Please select critical skills for strict matching";
    }

    // Validate screening questions
    screeningQuestions.forEach((question, index) => {
      if (!question.question.trim()) {
        newErrors[`question_${index}`] = "Question text is required";
      }
      if (question.type === "options" && question.options && question.options.length < 2) {
        newErrors[`options_${index}`] = "At least 2 options are required for multiple choice questions";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAiSettingsChange = (updates: any) => {
    const updatedSettings = { ...aiSettings, ...updates };
    setJobData({ aiSettings: updatedSettings });
  };

  const addScreeningQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      question: "",
      type: "short_text" as const,
      required: true,
      options: []
    };
    const updated = [...screeningQuestions, newQuestion];
    setScreeningQuestions(updated);
    setJobData({ screeningQuestions: updated });
  };

  const updateScreeningQuestion = (index: number, updates: any) => {
    const updated = screeningQuestions.map((q, i) =>
      i === index ? { ...q, ...updates } : q
    );
    setScreeningQuestions(updated);
    setJobData({ screeningQuestions: updated });
  };

  const removeScreeningQuestion = (index: number) => {
    const updated = screeningQuestions.filter((_, i) => i !== index);
    setScreeningQuestions(updated);
    setJobData({ screeningQuestions: updated });
  };

  const submitJob = async () => {
    if (validateFields()) {
      try {
        const response = await postJob({
          ...job,
          aiSettings,
          screeningQuestions
        });
        if (response.statusCode === 201) {
          console.log("Job created successfully:", response.data);
          resetFormData();
        }
      } catch (error) {
        console.error("Error creating job:", error);
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-center p-6">
      {/* Main Card */}
      <div className="w-full max-w-[880px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">AI Screening & Questions</h2>
          <p className="text-sm text-gray-600">Configure intelligent candidate screening and custom questions</p>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Premium AI Features */}
          {!isSubscribed && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <RiRobotLine className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Candidate Screening</h3>
                  <p className="text-gray-600 mb-4">Let our AI analyze resumes, match candidates, and automate initial screening to save you hours of manual review.</p>
                  <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
                    <img src={Crown} alt="premium crown" className="w-4 h-4" />
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Screening Settings */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiRobotLine className="h-5 w-5 text-gray-500" />
                <h3 className="text-base font-medium text-gray-900">AI Screening Settings</h3>
              </div>
              {!isSubscribed && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  <img src={Crown} alt="premium crown" className="w-3 h-3" />
                  <span>Premium</span>
                </div>
              )}
            </div>

            {/* Enable AI Screening */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Enable AI Screening</h4>
                    <p className="text-xs text-gray-600">Use AI to automatically analyze and score candidate applications</p>
                  </div>
                  <CustomCheckbox
                    checked={aiSettings.enableAiScreening}
                    disabled={false}
                    onChange={(e) => handleAiSettingsChange({ enableAiScreening: e.target.checked })}
                    size={20}
                    checkColor="#6438C2"
                    label=""
                  />
                </div>

                {aiSettings.enableAiScreening && (
                  <div className="space-y-6 pt-4 border-t border-gray-200">
                    {/* Minimum Match Percentage */}
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
                          onChange={(e) => handleAiSettingsChange({ minimumMatchPercentage: parseInt(e.target.value) })}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                          {aiSettings.minimumMatchPercentage}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Only show candidates with at least this match percentage</p>
                    </div>

                    {/* Auto Accept Applications */}
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
                          <RiCheckLine className="h-4 w-4 text-green-600" />
                          Auto-Accept High Matches
                        </h4>
                        <p className="text-xs text-gray-600">Automatically move candidates with 90%+ match to interview stage</p>
                      </div>
                      <CustomCheckbox
                        checked={aiSettings.autoAcceptApplications}
                        onChange={(e) => handleAiSettingsChange({ autoAcceptApplications: e.target.checked })}
                        size={18}
                        checkColor="#059669"
                        label=""
                      />
                    </div>

                    {/* Strict Skill Matching */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
                            <RiShieldCheckLine className="h-4 w-4 text-orange-600" />
                            Strict Skill Matching
                          </h4>
                          <p className="text-xs text-gray-600">Require candidates to have ALL critical skills</p>
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
                          <label className="text-sm font-medium text-gray-700">Critical Skills (Required)</label>
                          <MultiSelect
                            placeholder="Select critical skills that candidates MUST have"
                            options={skills}
                            label={"Strict Skill Matching"}
                            selectedItems={aiSettings.criticalSkills.map(skill => ({ label: skill, value: skill }))}
                            setSelectedItems={(items) =>
                              handleAiSettingsChange({ criticalSkills: items.map(item => item.value) })
                            }
                          />
                          {errors.criticalSkills && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-lg">
                              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                              <span className="text-xs font-medium">{errors.criticalSkills}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Auto Reject Settings */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
                            <RiTriangleLine className="h-4 w-4 text-red-600" />
                            Auto-Reject Low Matches
                          </h4>
                          <p className="text-xs text-gray-600">Automatically reject candidates below threshold</p>
                        </div>
                        <CustomCheckbox
                          checked={aiSettings.autoRejectSettings.enableAutoReject}
                          onChange={(e) => handleAiSettingsChange({
                            autoRejectSettings: {
                              ...aiSettings.autoRejectSettings,
                              enableAutoReject: e.target.checked
                            }
                          })}
                          size={18}
                          checkColor="#DC2626"
                          label=""
                        />
                      </div>

                      {aiSettings.autoRejectSettings.enableAutoReject && (
                        <div className="space-y-4 pl-4 border-l-2 border-red-200">
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">Auto-Reject Threshold</label>
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                min="1"
                                max="50"
                                value={aiSettings.autoRejectThreshold || 30}
                                onChange={(e) => handleAiSettingsChange({ autoRejectThreshold: parseInt(e.target.value) })}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                                {aiSettings.autoRejectThreshold || 30}%
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <CustomCheckbox
                              checked={aiSettings.autoRejectSettings.sendRejectionEmail}
                              onChange={(e) => handleAiSettingsChange({
                                autoRejectSettings: {
                                  ...aiSettings.autoRejectSettings,
                                  sendRejectionEmail: e.target.checked
                                }
                              })}
                              size={16}
                              checkColor="#DC2626"
                              label="Send rejection email to candidates"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Resume Analysis */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <RiBrainLine className="h-4 w-4 text-gray-500" />
                        Resume Analysis Features
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <CustomCheckbox
                            checked={aiSettings.resumeAnalysis.checkEmploymentGaps}
                            onChange={(e) => handleAiSettingsChange({
                              resumeAnalysis: {
                                ...aiSettings.resumeAnalysis,
                                checkEmploymentGaps: e.target.checked
                              }
                            })}
                            size={16}
                            checkColor="#6438C2"
                            label="Check employment gaps"
                          />
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <CustomCheckbox
                            checked={aiSettings.resumeAnalysis.analyzeCareerProgression}
                            onChange={(e) => handleAiSettingsChange({
                              resumeAnalysis: {
                                ...aiSettings.resumeAnalysis,
                                analyzeCareerProgression: e.target.checked
                              }
                            })}
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

          {/* Screening Questions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiQuestionLine className="h-5 w-5 text-gray-500" />
                <h3 className="text-base font-medium text-gray-900">Screening Questions</h3>
              </div>
              <button
                onClick={addScreeningQuestion}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <RiAddLine className="h-4 w-4" />
                Add Question
              </button>
            </div>

            <div className="space-y-4">
              {screeningQuestions.map((question, index) => (
                <div key={question.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="space-y-4">
                    {/* Question Header */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Question {index + 1}</h4>
                      <button
                        onClick={() => removeScreeningQuestion(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <RiDeleteBin6Line className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Question Text */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Question Text</label>
                      <textarea
                        value={question.question}
                        onChange={(e) => updateScreeningQuestion(index, { question: e.target.value })}
                        placeholder="Enter your screening question..."
                        className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-sm"
                      />
                      {errors[`question_${index}`] && (
                        <div className="flex items-center gap-2 text-red-600 text-xs">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                          <span>{errors[`question_${index}`]}</span>
                        </div>
                      )}
                    </div>

                    {/* Question Type and Settings */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Answer Type</label>
                        <select
                          value={question.type}
                          onChange={(e) => updateScreeningQuestion(index, {
                            type: e.target.value,
                            options: e.target.value === "options" || e.target.value === "dropdown" ? ["", ""] : [],
                            expectedAnswer: ""
                          })}
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
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
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
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

                    {/* Expected Answer Section */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h5 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
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

                      {(question.type === "options" || question.type === "dropdown") && question.options && question.options.length > 0 && (
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-gray-700">Expected Answer(s)</label>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              option.trim() && (
                                <div key={optionIndex} className="flex items-center gap-2">
                                  <CustomCheckbox
                                    checked={Array.isArray(question.expectedAnswer)
                                      ? question.expectedAnswer.includes(option)
                                      : question.expectedAnswer === option
                                    }
                                    onChange={(e) => {
                                      const current = Array.isArray(question.expectedAnswer) ? question.expectedAnswer : [];
                                      const updated = e.target.checked
                                        ? [...current, option]
                                        : current.filter(a => a !== option);
                                      updateScreeningQuestion(index, { expectedAnswer: updated });
                                    }}
                                    size={16}
                                    checkColor="#6438C2"
                                    label={option}
                                  />
                                </div>
                              )
                            ))}
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
                              className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Scoring Criteria</label>
                            <textarea
                              value={question.scoringCriteria || ""}
                              onChange={(e) => updateScreeningQuestion(index, { scoringCriteria: e.target.value })}
                              placeholder="Describe how AI should evaluate this answer (e.g., 'Look for specific technologies mentioned, years of experience, leadership examples')"
                              className="w-full h-16 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Options for Multiple Choice/Dropdown */}
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
                                className="flex-1 h-10 px-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                              />
                              <button
                                onClick={() => {
                                  const newOptions = (question.options || []).filter((_, i) => i !== optionIndex);
                                  updateScreeningQuestion(index, { options: newOptions });
                                }}
                                className="text-red-600 hover:text-red-700 p-2"
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
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <RiAddLine className="h-4 w-4" />
                            Add Option
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {screeningQuestions.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                  <RiQuestionLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Screening Questions</h3>
                  <p className="text-gray-600 mb-4">Add custom questions to screen candidates before they apply</p>
                  <button
                    onClick={addScreeningQuestion}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                  >
                    Add Your First Question
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-[880px] flex justify-between mt-6">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium transition-all duration-200"
        >
          <RiArrowLeftLine className="h-4 w-4" />
          <span>Back</span>
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-xl font-medium transition-all duration-200"
          >
            <RiEyeLine className="h-4 w-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={submitJob}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <RiRobotLine className="h-4 w-4" />
            <span>Publish Job</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateJobStepFive;
