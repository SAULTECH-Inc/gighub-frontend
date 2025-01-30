import React, { useState } from "react";

const SkillsAndCompetences: React.FC = () => {
    const [skills, setSkills] = useState<string[]>([]);
    const [certifications, setCertifications] = useState<string[]>([]);

    const handleSkillRemove = (skill: string) => {
        setSkills((prevSkills) => prevSkills.filter((item) => item !== skill));
    };

    const handleCertificationRemove = (certification: string) => {
        setCertifications((prevCertifications) =>
            prevCertifications.filter((item) => item !== certification)
        );
    };

    const addSkill = (skill: string) => {
        if (!skills.includes(skill)) {
            setSkills((prevSkills) => [...prevSkills, skill]);
        }
    };

    const addCertification = (certification: string) => {
        if (!certifications.includes(certification)) {
            setCertifications((prevCertifications) => [...prevCertifications, certification]);
        }
    };

    const categoryOptions = ["Blender/Msc", "Photoshop", "Illustrator", "UI/UX Design"];
    const certificationOptions = ["MSc", "BSc", "PhD"];

    return (
        <section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] ">
        <div className="p-6 space-y-6">
            <div>
                <h3 className="text-xl font-semibold">Skills and Competences</h3>
            </div>

            <div className="flex space-x-6">
                {/* Skills Section */}
                <div className="flex-1">
                    <h4 className="text-lg font-medium">Skills</h4>
                    <div className="mt-2">
                        {/* Dropdown Button Inside Box */}
                        <div className=" w-[400px] bg-white p-4">
                            <select
                                className="w-[427px] p-2 border border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA]"
                                onChange={(e) => addSkill(e.target.value)}
                                value=""
                            >
                                <option value="" disabled></option>
                                {categoryOptions.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Selected Items Box */}
                    <div className="mt-2 flex flex-wrap gap-2 p-4 border border-[#E6E6E6] rounded-[16px]">
                        {skills.map((skill) => (
                            <div
                                key={skill}
                                className="px-4 py-2 bg-[#FA4E09] text-white rounded-[10px] flex items-center space-x-2"
                            >
                                <span>{skill}</span>
                                <button
                                    onClick={() => handleSkillRemove(skill)}
                                    className="text-white font-semibold hover:bg-red-600 rounded-full"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certification Section */}
                <div className="flex-1">
                    <h4 className="text-lg font-medium">Certification</h4>
                    <div className="mt-2">
                        {/* Dropdown Button Inside Box */}
                        <div className="w-[400px] bg-white p-4">
                            <select
                                className="p-2 w-[427px] border border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA]"
                                onChange={(e) => addCertification(e.target.value)}
                                value=""
                            >
                                <option value="" disabled></option>
                                {certificationOptions.map((certification) => (
                                    <option key={certification} value={certification}>
                                        {certification}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Selected Items Box */}
                    <div className="mt-2 flex flex-wrap gap-2 w-[427px] p-4 border border-[#E6E6E6] rounded-[16px]">
                        {certifications.map((certification) => (
                            <div
                                key={certification}
                                className="px-4 py-2 bg-[#FA4E09] text-white rounded-[10px] flex items-center space-x-2"
                            >
                                <span>{certification}</span>
                                <button
                                    onClick={() => handleCertificationRemove(certification)}
                                    className="text-white font-semibold hover:bg-red-600 rounded-full"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </section>
    );
};

export default SkillsAndCompetences;
