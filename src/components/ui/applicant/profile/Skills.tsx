import React, { memo } from "react";
import CustomSelect from "../../../common/CustomSelect.tsx";
import { X, Code } from "lucide-react";

export interface Option {
  label: string;
  value: string;
}

interface SkillsProps {
  options: Option[];
  skills: string[];
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  isEditable?: boolean;
}

const Skills: React.FC<SkillsProps> = ({
  options,
  skills,
  addSkill,
  removeSkill,
  isEditable,
}) => {
  // Handle dropdown change
  const handleDropdownChange = (option: Option) => {
    if (!skills.includes(option.value)) {
      addSkill(option.value);
    }
  };

  return (
    <div className="space-y-4">
      <CustomSelect
        options={options}
        onChange={handleDropdownChange}
        placeholder="Select a skill to add"
        disabled={isEditable}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* Selected Skills */}
      {skills && skills.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Your skills:</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-100 px-3 py-2 text-sm font-medium text-blue-800"
              >
                <Code className="h-3 w-3" />
                <span>{skill}</span>
                <button
                  type="button"
                  disabled={isEditable}
                  onClick={() => removeSkill(skill)}
                  className="p-1 text-blue-600 transition-colors duration-200 hover:text-red-600 disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!skills || skills.length === 0) && !isEditable && (
        <div className="py-6 text-center text-gray-500">
          <Code className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm">No skills added yet</p>
        </div>
      )}

      {/* Helper Text */}
      {isEditable && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <p className="text-xs text-blue-600">
            💡 Add skills that are relevant to your target job roles. Include
            both technical and soft skills.
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(Skills);
