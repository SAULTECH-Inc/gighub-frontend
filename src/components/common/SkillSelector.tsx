import React, { useState } from "react";
import { AiOutlineCloseCircle, AiOutlinePlus } from "react-icons/ai";

interface SkillSelectorProps {
  placeholderSkill?: string;
  placeholderYears?: string;
  availableSkills?: string[];
}

const SkillSelector: React.FC<SkillSelectorProps> = ({
  placeholderSkill = "Select or Add a Skill",
  placeholderYears = "Years of Experience",
  availableSkills = ["JavaScript", "React", "Figma", "Node.js"],
}) => {
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [years, setYears] = useState<string>("");
  const [skillsList, setSkillsList] = useState<
    { skill: string; years: string }[]
  >([]);

  const handleAddSkill = () => {
    if (selectedSkill) {
      setSkillsList([...skillsList, { skill: selectedSkill, years }]);
      setSelectedSkill("");
      setYears("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(({ skill }) => skill !== skillToRemove));
  };

  return (
    <div className="w-full">
      <div className="flex w-full gap-1 sm:gap-3">
        {/* Skill Input */}
        <input
          type="text"
          className="min-w-[50%] rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-0"
          placeholder={placeholderSkill}
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          list="skills-list"
        />
        <datalist id="skills-list">
          {availableSkills.map((skill) => (
            <option key={skill} value={skill} />
          ))}
        </datalist>

        {/* Years of Experience Input */}
        <input
          type="number"
          className="min-w-14 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-24"
          placeholder={placeholderYears}
          value={years}
          onChange={(e) => setYears(e.target.value)}
          min={0}
        />

        {/* Add Button */}
        <button
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
          onClick={handleAddSkill}
          disabled={!selectedSkill}
        >
          <AiOutlinePlus className="h-5 w-5" />
          Add
        </button>
      </div>

      {/* Selected Skills Display */}
      <div className="mt-3 flex max-h-40 flex-wrap gap-2 overflow-y-auto">
        {skillsList.map(({ skill, years }) => (
          <div
            key={skill}
            className="flex items-center gap-2 rounded-lg border border-zinc-400 bg-[#e3dfe2] bg-gray-100 px-3 py-1"
          >
            <span className="text-gray-700">
              {skill} {years && `/ ${years}yrs`}
            </span>
            <AiOutlineCloseCircle
              className="h-5 w-5 cursor-pointer text-red-500 transition hover:text-red-600"
              onClick={() => handleRemoveSkill(skill)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillSelector;
