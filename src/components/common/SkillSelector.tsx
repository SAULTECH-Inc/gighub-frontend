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
  const [skillsList, setSkillsList] = useState<{ skill: string; years: string }[]>([]);

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
      <div className="w-full flex gap-1 sm:gap-3">
        {/* Skill Input */}
        <input
          type="text"
          className="min-w-[50%] border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-0"
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
          className="border border-gray-300 rounded-lg px-3 py-2 min-w-14 sm:w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholderYears}
          value={years}
          onChange={(e) => setYears(e.target.value)}
          min={0}
        />

        {/* Add Button */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
          onClick={handleAddSkill}
          disabled={!selectedSkill}
        >
          <AiOutlinePlus className="w-5 h-5" />
          Add
        </button>
      </div>

      {/* Selected Skills Display */}
      <div className="mt-3 max-h-40 overflow-y-auto flex flex-wrap gap-2">
        {skillsList.map(({ skill, years }) => (
          <div
            key={skill}
            className="bg-gray-100 px-3 py-1 flex items-center gap-2 rounded-lg border border-zinc-400 bg-[#e3dfe2]"
          >
            <span className="text-gray-700">{skill} {years && `/ ${years}yrs`}</span>
            <AiOutlineCloseCircle
              className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-600 transition"
              onClick={() => handleRemoveSkill(skill)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillSelector;
