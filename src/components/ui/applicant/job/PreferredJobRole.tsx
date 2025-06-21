import React from "react";
import CustomSelect from "../../../common/CustomSelect.tsx";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import { useAuth } from "../../../../store/useAuth.ts";
import { JobRoles } from "../../../../utils/dumm.ts";
import { Option } from "../../../../utils/types";

export const PreferredJobRole: React.FC = () => {
  const { applicant } = useAuth();
  const { preferences, setPreference } = useApplicantJobProfile();
  const { isEditable } = useSectionEditable("job-preference");
  const removeRole = async (index: number) => {
    setPreference({
      applicantId: Number(applicant?.id) || 0,
      ...preferences,
      roles: preferences?.roles?.filter((_, i) => i !== index),
    });
  };

  const handleRoleSelect = async (category: string) => {
    if (category && !preferences?.roles?.includes(category)) {
      setPreference({
        ...preferences,
        applicantId: Number(applicant?.id) || 0,
        roles: [...(preferences?.roles as string[]), category],
      });
    }
  };
  return (
    <div>
      <label className="mb-2 block font-lato text-lg text-gray-700">
        Preferred Job Roles
      </label>
      <div className="w-full rounded-[16px] border-[1px] border-[#E6E6E6] bg-white p-4">
        <CustomSelect
          options={JobRoles}
          className="w-full rounded-[10px] border border-[#E6E6E6] bg-[#F7F8FA] p-2 text-left"
          placeholder="Select Roles"
          disabled={!isEditable}
          onChange={(option: Option) => {
            handleRoleSelect(option.value).then((r) => r);
          }}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {preferences?.roles?.map((category, index) => (
            <div
              key={index}
              className="flex h-[38px] w-[168px] items-center justify-between rounded-[10px] bg-[#56E5A1] px-4 text-sm font-medium text-white"
            >
              <span>{category}</span>
              <button
                type="button"
                disabled={!isEditable}
                onClick={() => removeRole(index)}
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
