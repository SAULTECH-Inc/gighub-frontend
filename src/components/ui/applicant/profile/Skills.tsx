import React from "react";
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

const Skills: React.FC<SkillsProps> = ({ options, skills, addSkill, removeSkill, isEditable }) => {

    // Handle dropdown change
    const handleDropdownChange = (option: Option) => {
        if (!skills.includes(option.value)) {
            addSkill(option.value);
        }
    };

    return (
        <div className="flex-1 w-full md:w-1/2 flex flex-col justify-start p-0 space-y-2">
            <label className="text-lg font-medium">Skills</label>
            <div className="w-full bg-white">
                {/* Selected Items Box */}
                <div className="w-full flex flex-wrap space-y-2 gap-2 p-3 md:p-4 border border-[#E6E6E6] rounded-[16px]">
                    <div className="w-full">
                        <CustomSelect
                            options={options}
                            onChange={handleDropdownChange}
                            placeholder="+ Add Skill"
                            disabled={isEditable}
                            className="text-left w-full p-2 border border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA]"
                        />
                    </div>
                    {skills.map((skill) => (
                        <div
                            key={skill}
                            className="px-4 py-2 bg-[#FA4E09] text-white rounded-[10px] flex items-center space-x-2"
                        >
                            <span>{skill}</span>
                            <button
                                type="button"
                                disabled={!isEditable}
                                onClick={() => removeSkill(skill)}
                                className="text-white font-semibold hover:bg-red-600 rounded-full"
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

export default Skills;
