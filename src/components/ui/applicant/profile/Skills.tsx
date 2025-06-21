import React, { memo } from "react";
import CustomSelect from "../../../common/CustomSelect.tsx";

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
    <div className="flex w-full flex-1 flex-col justify-start space-y-2 p-0 md:w-1/2">
      <label className="text-lg font-medium">Skills</label>
      <div className="w-full bg-white">
        {/* Selected Items Box */}
        <div className="flex w-full flex-wrap gap-2 space-y-2 rounded-[16px] border border-[#E6E6E6] p-3 md:p-4">
          <div className="w-full">
            <CustomSelect
              options={options}
              onChange={handleDropdownChange}
              placeholder="+ Add Skill"
              disabled={isEditable}
              className="w-full rounded-[10px] border border-[#E6E6E6] bg-[#F7F8FA] p-2 text-left"
            />
          </div>
          {skills?.map((skill: string, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 rounded-[10px] bg-[#FA4E09] px-4 py-2 text-white ${!isEditable ? "cursor-pointer" : "cursor-not-allowed"}`}
            >
              <span>{skill}</span>
              <button
                type="button"
                disabled={isEditable}
                onClick={() => removeSkill(skill)}
                className={`rounded-full font-semibold text-white ${!isEditable ? "cursor-pointer" : "cursor-not-allowed"}`}
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

export default memo(Skills);
