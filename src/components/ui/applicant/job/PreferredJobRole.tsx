import React from "react";
import CustomSelect from "../../../common/CustomSelect.tsx";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import { useAuth } from "../../../../store/useAuth.ts";
import { Option } from "../../../../utils/types";
import { useJobRoles } from "../../../../hooks/useJobRoles.ts";
import { X, Briefcase } from "lucide-react";
import { useProfileCompletionDetails } from "../../../../hooks/useProfileCompletionDetails.ts";

export const PreferredJobRole: React.FC = () => {
  const jobRoles = useJobRoles();
  const { applicant } = useAuth();
  const { preferences, setPreference } = useApplicantJobProfile();
  const { isEditable } = useSectionEditable("job-preference");
  const {refetch} = useProfileCompletionDetails();

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
      refetch().then(r=>r);
    }
  };

  return (
    <div className="space-y-4">
      <CustomSelect
        options={jobRoles}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
        placeholder="Select Job Roles"
        disabled={!isEditable}
        onChange={(option: Option) => {
          handleRoleSelect(option.value).then((r) => r);
        }}
      />

      {/* Selected Job Roles */}
      {preferences?.roles && preferences.roles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Selected job roles:</p>
          <div className="space-y-2">
            {preferences.roles.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    {category}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={!isEditable}
                  onClick={() => removeRole(index)}
                  className="p-1 text-blue-600 transition-colors duration-200 hover:text-red-600 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!preferences?.roles || preferences.roles.length === 0) &&
        !isEditable && (
          <div className="py-6 text-center text-gray-500">
            <Briefcase className="mx-auto mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm">No job roles selected</p>
          </div>
        )}

      {/* Helper Text */}
      {isEditable && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <p className="text-xs text-blue-600">
            💡 Select roles that match your skills and career interests for
            better job matches.
          </p>
        </div>
      )}
    </div>
  );
};
