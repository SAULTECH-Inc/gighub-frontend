import React from "react";
import { useAuth } from "../../../../store/useAuth.ts";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import CustomSelect from "../../../common/CustomSelect.tsx";
import { Option } from "../../../../utils/types";
import { X } from "lucide-react";
import { JobTypes } from "../../../../utils/constants.ts";

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
    <div className="space-y-4">
      <CustomSelect
        options={JobTypes}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
        placeholder="Select Job Type"
        disabled={!isEditable}
        onChange={(option: Option) => {
          handleJobTypeSelect(option.value).then((r) => r);
        }}
      />

      {/* Selected Job Types */}
      {preferences?.jobTypes && preferences.jobTypes.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Selected job types:</p>
          <div className="flex flex-wrap gap-2">
            {preferences.jobTypes.map((type, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-purple-100 border border-purple-200 rounded-lg text-sm font-medium text-purple-800"
              >
                <span>{type}</span>
                <button
                  type="button"
                  disabled={!isEditable}
                  onClick={() => removeJobType(index)}
                  className="p-1 text-purple-600 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!preferences?.jobTypes || preferences.jobTypes.length === 0) && !isEditable && (
        <div className="text-center py-6 text-gray-500">
          <p className="text-sm">No job types selected</p>
        </div>
      )}
    </div>
  );
};
