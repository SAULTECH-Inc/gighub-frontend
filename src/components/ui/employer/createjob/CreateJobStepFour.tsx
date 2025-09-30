import React from "react";
import { useJobFormStore } from "../../../../store/useJobFormStore";
import MultiSelect from "../../../common/MultiSelect";
import { Crown } from "../../../../assets/images";
import { useSubscriptionStore } from "../../../../store/useSubscriptionStore.ts";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiBuilding2Line,
  RiSchoolLine,
  RiCheckLine,
  RiStarLine,
  RiRobotLine
} from "react-icons/ri";
import { PreferredCompanies, universities } from "../../../../utils/constants.ts";

const CreateJobStepFour: React.FC = () => {
  const { isSubscribed } = useSubscriptionStore();
  const { prevStep, nextStep, job, setJobData } = useJobFormStore();

  const premiumFeatures = [
    "Advanced candidate filtering",
    "Priority job placement",
    "Enhanced application methods",
    "Detailed analytics",
    "Priority support"
  ];

  return (
    <div className="flex w-full flex-col items-center p-6">
      {/* Main Card */}
      <div className="w-full max-w-[880px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Company Preferences</h2>
          <p className="text-sm text-gray-600">Set advanced candidate preferences to find the perfect match</p>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-8">
          {/* Premium Features Overview */}
          {!isSubscribed && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <img src={Crown} alt="premium crown" className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlock Premium Features</h3>
                  <p className="text-gray-600 mb-4">Get access to advanced targeting and better candidate matches with our premium features.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {premiumFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <RiCheckLine className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
                    <RiStarLine className="h-4 w-4" />
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Previous Company Preferences */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiBuilding2Line className="h-5 w-5 text-gray-500" />
                <h3 className="text-base font-medium text-gray-900">Preferred Previous Companies</h3>
              </div>
              {!isSubscribed && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  <img src={Crown} alt="premium crown" className="w-3 h-3" />
                  <span>Premium</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <MultiSelect
                label="Preferred Candidate Previous Company"
                placeholder="Search or add companies (e.g. Google, Microsoft, Apple)"
                options={PreferredCompanies}
                disabled={!isSubscribed}
                selectedItems={(job?.preferredCandidatePreviousCompany || []).map(
                  (company) => ({
                    label: company,
                    value: company,
                  }),
                )}
                setSelectedItems={(items) =>
                  setJobData({
                    ...job,
                    preferredCandidatePreviousCompany: items.map(
                      (item) => item.value,
                    ),
                  })
                }
              />

              {!isSubscribed && (
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <RiBuilding2Line className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Target Experienced Professionals</p>
                    <p className="text-gray-600">Find candidates with experience from top companies in your industry.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* University Preferences */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiSchoolLine className="h-5 w-5 text-gray-500" />
                <h3 className="text-base font-medium text-gray-900">Preferred Universities</h3>
              </div>
              {!isSubscribed && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  <img src={Crown} alt="premium crown" className="w-3 h-3" />
                  <span>Premium</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <MultiSelect
                label="Preferred Candidate University"
                placeholder="Search or add universities (e.g. MIT, Stanford, Harvard)"
                options={universities}
                disabled={!isSubscribed}
                selectedItems={(job?.preferredCandidateUniversity || []).map(
                  (university) => ({
                    label: university,
                    value: university,
                  }),
                )}
                setSelectedItems={(items) =>
                  setJobData({
                    ...job,
                    preferredCandidateUniversity: items.map((item) => item.value),
                  })
                }
              />

              {!isSubscribed && (
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <RiSchoolLine className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Target Top Graduates</p>
                    <p className="text-gray-600">Find candidates from prestigious universities and educational institutions.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Summary Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <RiCheckLine className="h-5 w-5 text-green-500" />
              Job Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p><span className="font-medium text-gray-700">Title:</span> {job.title || "Not specified"}</p>
                <p><span className="font-medium text-gray-700">Department:</span> {job.department || "Not specified"}</p>
                <p><span className="font-medium text-gray-700">Location:</span> {job.location || "Not specified"}</p>
                <p><span className="font-medium text-gray-700">Experience:</span> {job.experienceYears ? `${job.experienceYears} years` : "Not specified"}</p>
              </div>
              <div className="space-y-2">
                <p><span className="font-medium text-gray-700">Job Type:</span> {job.jobType || "Not specified"}</p>
                <p><span className="font-medium text-gray-700">Employment:</span> {job.employmentType || "Not specified"}</p>
                <p><span className="font-medium text-gray-700">Priority:</span> {job.priority || "Not specified"}</p>
                <p><span className="font-medium text-gray-700">Skills:</span> {job.skillSet?.length ? `${job.skillSet.length} selected` : "None selected"}</p>
              </div>
            </div>
          </div>

          {/* Next Step Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <RiRobotLine className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Next: AI Screening & Custom Questions</h3>
                <p className="text-gray-600 mb-4">Configure intelligent candidate screening, set up custom application questions, and let AI help you find the perfect candidates automatically.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <RiCheckLine className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span>AI-powered resume analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <RiCheckLine className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span>Custom screening questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <RiCheckLine className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span>Automated candidate scoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <RiCheckLine className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span>Smart filtering & matching</span>
                  </div>
                </div>
              </div>
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
        <button
          onClick={nextStep}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <span>Continue to AI Setup</span>
          <RiArrowRightLine className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepFour;
