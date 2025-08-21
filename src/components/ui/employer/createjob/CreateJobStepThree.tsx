import React, { useState } from "react";
import { useJobFormStore } from "../../../../store/useJobFormStore";
import MultiSelect from "../../../common/MultiSelect.tsx";
import { Crown } from "../../../../assets/images.ts";
import CustomCheckbox from "../../../common/CustomCheckbox.tsx";
import { useSubscriptionStore } from "../../../../store/useSubscriptionStore.ts";
import { useCountries } from "../../../../hooks/useCountries.ts";
import { useSkills } from "../../../../hooks/useSkills.ts";
import {
  RiArrowRightLine,
  RiArrowLeftLine,
  RiToolsLine,
  RiGlobalLine,
  RiFileTextLine,
  RiUser3Line,
  RiFolderLine,
  RiMailLine,
  RiStarLine, RiCamera3Line
} from "react-icons/ri";

const CreateJobStepThree: React.FC = () => {
  const skills = useSkills();
  const { isSubscribed } = useSubscriptionStore();
  const { countries } = useCountries();
  const { nextStep, prevStep, job, setJobData } = useJobFormStore();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!job.skillSet || job.skillSet.length === 0) {
      newErrors.skillSet = "Please select at least one skill";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateFields()) {
      nextStep();
    }
  };

  const applicationMethods = [
    {
      id: 'byCv',
      label: 'Apply With CV',
      icon: RiFileTextLine,
      description: 'Allow candidates to apply with their resume'
    },
    {
      id: 'byProfile',
      label: 'Apply With Profile',
      icon: RiUser3Line,
      description: 'Let candidates use their platform profile'
    },
    {
      id: 'byPortfolio',
      label: 'Apply With Portfolio',
      icon: RiFolderLine,
      description: 'Request work samples and portfolio'
    },
    {
      id: 'byCoverLetter',
      label: 'Apply With Cover Letter',
      icon: RiMailLine,
      description: 'Require a personalized cover letter'
    },
    {
      id: 'byVideo',
      label: 'Apply With Video',
      icon: RiCamera3Line,
      description: 'Request video introduction or pitch'
    }
  ];

  return (
    <div className="flex w-full flex-col items-center p-6">
      {/* Main Card */}
      <div className="w-full max-w-[880px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills & Preferences</h2>
          <p className="text-sm text-gray-600">Define required skills and candidate preferences</p>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-8">
          {/* Required Skills Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <RiToolsLine className="h-5 w-5 text-gray-500" />
              <h3 className="text-base font-medium text-gray-900">Required Skills</h3>
            </div>

            <MultiSelect
              label="Skill Set"
              requiredAsterisk={true}
              placeholder="Select or add skills (e.g. JavaScript, React, Node.js)"
              options={skills}
              selectedItems={(job?.skillSet || []).map((skill) => ({
                label: skill.skill,
                value: skill.skill,
              }))}
              setSelectedItems={(items) => {
                setJobData({
                  ...job,
                  skillSet: items.map((item) => ({ skill: item.value })),
                });
                if (items.length > 0) {
                  setErrors({ ...errors, skillSet: "" });
                } else {
                  setErrors({
                    ...errors,
                    skillSet: "Please select at least one skill",
                  });
                }
              }}
            />
            {errors.skillSet && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="text-sm font-medium">{errors.skillSet}</span>
              </div>
            )}
          </div>

          {/* Premium Features Section */}
          <div className="space-y-6">
            {/* Preferred Countries */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RiGlobalLine className="h-5 w-5 text-gray-500" />
                  <h3 className="text-base font-medium text-gray-900">Candidate Location Preferences</h3>
                </div>
                {!isSubscribed && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                    <img src={Crown} alt="premium crown" className="w-3 h-3" />
                    <span>Premium</span>
                  </div>
                )}
              </div>

              <MultiSelect
                label="Preferred Candidate Country"
                placeholder="Select countries for preferred candidates"
                options={countries}
                disabled={!isSubscribed}
                selectedItems={(job.preferredCandidateCountry || []).map(
                  (country) => ({ label: country, value: country }),
                )}
                setSelectedItems={(items) =>
                  setJobData({
                    ...job,
                    preferredCandidateCountry: items.map((item) => item.value),
                  })
                }
              />

              {!isSubscribed && (
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <img src={Crown} alt="premium crown" className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Upgrade to Premium</p>
                    <p className="text-gray-600">Target candidates from specific countries to find the best talent for your role.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Application Methods */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RiStarLine className="h-5 w-5 text-gray-500" />
                  <h3 className="text-base font-medium text-gray-900">Application Methods</h3>
                </div>
                {!isSubscribed && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                    <img src={Crown} alt="premium crown" className="w-3 h-3" />
                    <span>Premium</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-sm text-gray-600 mb-4">Choose how candidates can apply for this position</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {applicationMethods.map((method) => {
                    const Icon = method.icon;
                    const isChecked = job?.applicationMethod?.[method.id as keyof typeof job.applicationMethod] ?? false;

                    return (
                      <div
                        key={method.id}
                        className={`
                          relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                          ${isChecked && isSubscribed
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                        }
                          ${!isSubscribed ? 'opacity-60' : ''}
                        `}
                        onClick={() => {
                          if (isSubscribed) {
                            setJobData({
                              ...job,
                              applicationMethod: {
                                ...job?.applicationMethod,
                                [method.id]: !isChecked,
                              },
                            });
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`
                            flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                            ${isChecked && isSubscribed ? 'bg-blue-100' : 'bg-gray-100'}
                          `}>
                            <Icon className={`h-4 w-4 ${isChecked && isSubscribed ? 'text-blue-600' : 'text-gray-500'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <CustomCheckbox
                                checked={isChecked}
                                size={16}
                                disabled={!isSubscribed}
                                checkColor="#6438C2"
                                label=""
                                onChange={(e) => {
                                  if (isSubscribed) {
                                    setJobData({
                                      ...job,
                                      applicationMethod: {
                                        ...job?.applicationMethod,
                                        [method.id]: e.target.checked,
                                      },
                                    });
                                  }
                                }}
                              />
                              <h4 className="text-sm font-medium text-gray-900">{method.label}</h4>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!isSubscribed && (
                  <div className="mt-4 flex items-center gap-3 text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <img src={Crown} alt="premium crown" className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Customize Application Process</p>
                      <p className="text-gray-600">With Premium, you can choose exactly how candidates apply and what materials they submit.</p>
                    </div>
                  </div>
                )}
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
          onClick={handleNextStep}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <span>Continue</span>
          <RiArrowRightLine className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepThree;