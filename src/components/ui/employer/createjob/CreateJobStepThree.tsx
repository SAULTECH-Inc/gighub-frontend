import React, { useState } from "react";
import { useJobFormStore } from "../../../../store/useJobFormStore";
import { skills as skillsOptions } from "../../../../utils/dumm.ts";
import MultiSelect from "../../../common/MultiSelect.tsx";
import { Crown } from "../../../../assets/images.ts";
import CustomCheckbox from "../../../common/CustomCheckbox.tsx";
import { useSubscriptionStore } from "../../../../store/useSubscriptionStore.ts";
import { useCountries } from "../../../../hooks/useCountries.ts";

const CreateJobStepThree: React.FC = () => {
  const { isSubscribed } = useSubscriptionStore();
  const {countries} = useCountries();
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

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex min-h-[400px] w-[96%] max-w-[900px] flex-col items-center rounded-[10px] bg-white py-4">
        <div className="flex w-[95%] flex-col gap-3">
          <div className="flex flex-col gap-2">
            <MultiSelect
              label="Skill Set"
              requiredAsterisk={true}
              placeholder="Select or add a skill"
              options={skillsOptions}
              selectedItems={(job?.skillSet || []).map((skill) => ({
                label: skill.skill,
                value: skill.skill,
              }))}
              setSelectedItems={(items) => {
                setJobData({
                  ...job,
                  skillSet: items.map((item) => ({ skill: item.value })),
                });
                // Clear error when skills are selected
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
              <p className="text-xs text-red-500">{errors.skillSet}</p>
            )}
          </div>
          {!isSubscribed && (
            <div className="flex w-fit gap-1 rounded-[7px] bg-[#6438C2] px-[6px] py-[3px]">
              <img src={Crown} alt="premium crown" className="w-4" />
              <p className="text-sm text-white">Premium</p>
            </div>
          )}
          <MultiSelect
            label="Preferred Candidate Country"
            placeholder="Select or add a country"
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
            <div className="flex w-fit gap-1 rounded-[7px] bg-[#6438C2] px-[6px] py-[3px]">
              <img src={Crown} alt="premium crown" className="w-4" />
              <p className="text-sm text-white">Premium</p>
            </div>
          )}
          <div className="w-full self-start rounded-[16px] bg-[#F7F8FA] p-6">
            <h5 className="mb-4 text-lg font-semibold text-gray-800">
              Application Method
            </h5>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <CustomCheckbox
                checked={job?.applicationMethod?.byCv ?? false}
                size={20}
                disabled={!isSubscribed}
                checkColor="#6438C2"
                label="Apply With CV"
                onChange={(e) => {
                  setJobData({
                    ...job,
                    applicationMethod: {
                      ...job?.applicationMethod,
                      byCv: e.target.checked,
                    },
                  });
                }}
              />
              <CustomCheckbox
                checked={job?.applicationMethod?.byProfile ?? false}
                size={20}
                disabled={!isSubscribed}
                checkColor="#6438C2"
                label="Apply With Profile"
                onChange={(e) => {
                  setJobData({
                    ...job,
                    applicationMethod: {
                      ...job?.applicationMethod,
                      byProfile: e.target.checked,
                    },
                  });
                }}
              />
              <CustomCheckbox
                checked={job?.applicationMethod?.byPortfolio ?? false}
                size={20}
                checkColor="#6438C2"
                disabled={!isSubscribed}
                label="Apply With Portfolio"
                onChange={(e) => {
                  setJobData({
                    ...job,
                    applicationMethod: {
                      ...job?.applicationMethod,
                      byPortfolio: e.target.checked,
                    },
                  });
                }}
              />
              <CustomCheckbox
                checked={job?.applicationMethod?.byCoverLetter ?? false}
                size={20}
                checkColor="#6438C2"
                label="Apply With Cover Letter"
                disabled={!isSubscribed}
                onChange={(e) => {
                  setJobData({
                    ...job,
                    applicationMethod: {
                      ...job?.applicationMethod,
                      byCoverLetter: e.target.checked,
                    },
                  });
                }}
              />
              <CustomCheckbox
                checked={job?.applicationMethod?.byVideo ?? false}
                size={20}
                checkColor="#6438C2"
                label="Apply With Video"
                disabled={!isSubscribed}
                onChange={(e) => {
                  setJobData({
                    ...job,
                    applicationMethod: {
                      ...job?.applicationMethod,
                      byVideo: e.target.checked,
                    },
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-2 my-2 flex w-[96%] max-w-[900px] justify-end gap-1 sm:gap-6">
        <button
          className="w-[35%] self-end rounded-[15px] border border-[#E6E6E6] bg-[#F7F7F7] py-[8px] sm:w-[29%]"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          className="w-[35%] rounded-[15px] bg-[#6438C2] py-[8px] text-white sm:w-[29%]"
          onClick={handleNextStep}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepThree;
