import React, { useState } from "react";
import { useJobFormStore } from "../../../../store/useJobFormStore";
import { skills as skillsOptions } from "../../../../utils/dumm.ts";
import { countries } from "../../../../utils/Countries.ts";
import MultiSelect from "../../../common/MultiSelect.tsx";
import { Crown } from "../../../../assets/images.ts";

const CreateJobStepThree: React.FC = () => {
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
    <div className="w-full flex flex-col items-center">
      <div className="w-[96%] max-w-[900px] min-h-[400px] bg-white flex flex-col items-center rounded-[10px] py-4">
        <div className="w-[95%] flex flex-col gap-3">
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
              <p className="text-red-500 text-xs">{errors.skillSet}</p>
            )}
          </div>
          <div className="w-fit flex gap-1 bg-[#6438C2] py-[3px] px-[6px] rounded-[7px]">
            <img src={Crown} alt="premium crown" className="w-4" />
            <p className="text-white text-sm">Premium</p>
          </div>
          <MultiSelect
            label="Preferred Candidate Country"
            placeholder="Select or add a country"
            options={countries}
            selectedItems={(job.preferredCandidateCountry || []).map(
              (country) => ({ label: country, value: country })
            )}
            setSelectedItems={(items) =>
              setJobData({
                ...job,
                preferredCandidateCountry: items.map((item) => item.value),
              })
            }
          />
        </div>
      </div>
      <div className="w-[96%]  my-2 max-w-[900px] flex justify-end gap-1 sm:gap-6 mx-2">
        <button
          className="w-[35%] sm:w-[29%] py-[8px] bg-[#F7F7F7] border border-[#E6E6E6] rounded-[15px] self-end"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          className="w-[35%] sm:w-[29%] py-[8px] bg-[#6438C2] text-white rounded-[15px]"
          onClick={handleNextStep}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepThree;
