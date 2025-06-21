import React from "react";
import { useAuth } from "../../../../store/useAuth.ts";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import CustomSelect from "../../../common/CustomSelect.tsx";
import { Option } from "../../../../utils/types";
import { JobTypes } from "../../../../utils/employmentTypes.ts";

export const PreferredJobType: React.FC = () => {
  const { applicant } = useAuth();
  const { preferences, setPreference } = useApplicantJobProfile();
  const { isEditable } = useSectionEditable("job-preference");

  const removeJobType = async (index: number) => {
    setPreference({
      applicantId: Number(applicant?.id) || 0,
      ...preferences,
      jobTypes: preferences?.jobTypes?.filter((_, i) => i !== index),
    });
  };

  const handleJobTypeSelect = async (type: string) => {
    if (type && !preferences?.jobTypes?.includes(type)) {
      setPreference({
        ...preferences,
        applicantId: Number(applicant?.id) || 0,
        jobTypes: [...(preferences?.jobTypes as string[]), type],
      });
    }
  };
  return (
    <div>
      <label className="text-gray-700 block font-lato text-lg">
        Preferred Job Type
      </label>
      <div className="border-gray-300 w-full rounded-[16px] border border-[#E6E6E6] bg-white p-4">
        <CustomSelect
          options={JobTypes}
          className="w-full rounded-[10px] border-[#E6E6E6] bg-[#F7F8FA] p-2 text-left"
          placeholder="Select Job Type"
          disabled={!isEditable}
          onChange={(option: Option) => {
            handleJobTypeSelect(option.value).then((r) => r);
          }}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {preferences?.jobTypes?.map((type, index) => (
            <div
              key={index}
              className="flex h-[38px] w-[168px] items-center justify-between rounded-[10px] bg-[#56E5A1] px-4 text-sm font-medium text-white"
            >
              <span>{type}</span>
              <button
                type="button"
                disabled={!isEditable}
                onClick={() => removeJobType(index)}
                className="text-lg font-bold text-white"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
