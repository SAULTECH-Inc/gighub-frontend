import React from 'react'
import CustomSelect from './CustomSelect';

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

const GenericSkill:React.FC<SkillsProps> = ({ label, placeholder, options, skills, addSkill, removeSkill, isEditable=true }) => {    // Handle dropdown change
    const handleDropdownChange = (option: Option) => {
        if (!skills.includes(option.value)) {
            addSkill(option.value);
        }
    };


  return (
    <div className="flex-1 w-full flex flex-col justify-start p-0 space-y-2 mt-5">
    <label className="text-lg font-medium">{label}</label>
    <div className="w-full bg-[#F7F8FA] rounded-[16px]">
        {/* Selected Items Box */}
        <div className="w-full flex flex-wrap space-y-2 gap-2 p-3 md:p-4 border border-[#E6E6E6] rounded-[16px]">
            <div className="w-full">
                <CustomSelect
                    options={options}
                    onChange={handleDropdownChange}
                    placeholder={placeholder || "+ Add Skill"}
                    disabled={isEditable}
                    className="text-left w-full p-2 border border-[#E6E6E6] rounded-[10px] bg-white"
                />
            </div>
            <div className='flex flex-wrap gap-2 h-[130px] overflow-y-auto'>
            {skills.map((skill) => (
                <div
                    key={skill}
                    className="max-h-[30px] px-4 py-2 bg-[#FA4E09] text-white rounded-[10px] flex items-center space-x-2"
                >
                    <span className=''>{skill}</span>
                    <button
                        type="button"
                        disabled={!isEditable}
                        onClick={() => removeSkill(skill)}
                        className="text-white font-semibold cursor-pointer rounded-full"
                    >
                        &times;
                    </button>
                </div>
            ))}
            </div>
        </div>
    </div>
</div>
  )
}

export default GenericSkill