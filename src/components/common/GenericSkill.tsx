import React from "react";
import CustomSelect from "./CustomSelect";

export interface Option {
  label: string;
  value: string;
}

interface SkillsProps {
  label: string;
  placeholder: string;
  options: Option[];
  skills: string[];
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  isEditable?: boolean;
}

const GenericSkill: React.FC<SkillsProps> = ({
  label,
  placeholder,
  options,
  skills,
  addSkill,
  removeSkill,
  isEditable = true,
}) => {
  // Handle dropdown change
  const handleDropdownChange = (option: Option) => {
    if (!skills.includes(option.value)) {
      addSkill(option.value);
    }
  };

  return (
    <div className="mt-5 flex w-full flex-1 flex-col justify-start space-y-2 p-0">
      <label className="text-lg font-medium">{label}</label>
      <div className="w-full rounded-[16px] bg-[#F7F8FA]">
        {/* Selected Items Box */}
        <div className="flex w-full flex-wrap gap-2 space-y-2 rounded-[16px] border border-[#E6E6E6] p-3 md:p-4">
          <div className="w-full">
            <CustomSelect
              options={options}
              onChange={handleDropdownChange}
              placeholder={placeholder || "+ Add Skill"}
              disabled={isEditable}
              className="w-full rounded-[10px] border border-[#E6E6E6] bg-white p-2 text-left"
            />
          </div>
          <div className="flex h-[130px] flex-wrap gap-2 overflow-y-auto">
            {skills.map((skill) => (
              <div
                key={skill}
                className="flex max-h-[30px] items-center space-x-2 rounded-[10px] bg-[#FA4E09] px-4 py-2 text-white"
              >
                <span className="">{skill}</span>
                <button
                  type="button"
                  disabled={!isEditable}
                  onClick={() => removeSkill(skill)}
                  className="cursor-pointer rounded-full font-semibold text-white"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericSkill;
