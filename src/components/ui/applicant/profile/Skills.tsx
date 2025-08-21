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
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
      />

      {/* Selected Skills */}
      {skills && skills.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Your skills:</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 border border-blue-200 rounded-lg text-sm font-medium text-blue-800"
              >
                <Code className="w-3 h-3" />
                <span>{skill}</span>
                <button
                  type="button"
                  disabled={isEditable}
                  onClick={() => removeSkill(skill)}
                  className="p-1 text-blue-600 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!skills || skills.length === 0) && !isEditable && (
        <div className="text-center py-6 text-gray-500">
          <Code className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No skills added yet</p>
        </div>
      )}

      {/* Helper Text */}
      {isEditable && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-600">
            💡 Add skills that are relevant to your target job roles. Include both technical and soft skills.
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(Skills);