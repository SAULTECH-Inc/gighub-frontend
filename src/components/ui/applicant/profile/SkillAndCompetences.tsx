import React, { memo } from "react";
import Certifications from "./Certifications.tsx";
import Skills from "./Skills.tsx";
import {
  CertificationResponseDto,
  CvResponseDto,
  SkillsResponseDto,
} from "../../../../utils/types";
import {
  SkillsAndCompetency,
  useApplicantJobProfile,
} from "../../../../store/useApplicantJobProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import { toast } from "react-toastify";
import { jobSkills } from "../../../../utils/JobType.ts";

export interface CertParams {
  id?: number;
  certName: string;
  institution: string;
  year: string;
}
const SkillsAndCompetences: React.FC = () => {
  const { cvDetails, setCvDetails, updateSkillsAndCompetencies } =
    useApplicantJobProfile();
  const { isEditable, toggleEdit } = useSectionEditable(
    "skills-and-competences",
  );

  const addSkill = async (skill: string) => {
    if (!cvDetails?.skills?.map((s) => s?.skill)?.includes(skill)) {
      const newSkill: SkillsResponseDto = { skill };
      const updatedSkills = [...(cvDetails?.skills || []), newSkill];
      setCvDetails({
        ...cvDetails,
        skills: updatedSkills,
      } as CvResponseDto);
    }
  };

  const removeSkill = async (skill: string) => {
    setCvDetails({
      ...cvDetails,
      skills: cvDetails?.skills?.filter((item) => item?.skill !== skill),
    } as CvResponseDto);
  };

  // Handle certification addition
  const addCertification = async (certification: CertificationResponseDto) => {
    if (
      !cvDetails?.certifications
        ?.map((certification) => certification?.certification)
        .includes(certification.certification)
    ) {
      setCvDetails({
        ...cvDetails,
        certifications: [
          ...(cvDetails?.certifications || []),
          certification as CertificationResponseDto,
        ],
      } as CvResponseDto);
    }
  };

  // Handle certification removal
  const handleCertificationRemove = async (
    certification: CertificationResponseDto,
  ) => {
    setCvDetails({
      ...cvDetails,
      certifications: cvDetails?.certifications?.filter(
        (item) => item?.certification !== certification.certification,
      ),
    } as CvResponseDto);
  };

  const handleToggleEdit = () => {
    // Implement toggleEdit logic
    toggleEdit();
  };

  const handleUpdateSkillsAndCompetences = async () => {
    const response = await updateSkillsAndCompetencies({
      skills: cvDetails?.skills,
      certifications: cvDetails?.certifications,
    } as SkillsAndCompetency);
    if (response) {
      toast.success("Update successful");
      setCvDetails({
        ...cvDetails,
        skills: response.skills,
        certifications: response.certifications,
      } as CvResponseDto);
      toggleEdit();
    }
  };

  return (
    <section
      id="skills-competences"
      className="relative w-full space-y-3 border-t-[2px] border-t-[#E6E6E6] pt-5"
    >
      <div className="absolute top-2 right-1 z-10 flex items-center justify-evenly gap-x-2 text-xs">
        <button
          type="button"
          onClick={handleToggleEdit}
          className="w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleUpdateSkillsAndCompetences}
          className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1`}
        >
          Save
        </button>
      </div>
      <div className="w-full space-y-6">
        <h3 className="text-xl">Skills and Competences</h3>
        <div className="flex w-full flex-col space-y-4 md:flex-row md:items-start md:justify-evenly md:space-y-0 md:gap-x-8">
          {/* Skills Section */}
          <Skills
            isEditable={!isEditable}
            options={jobSkills.map((skill) => {
              return {
                value: skill,
                label: skill,
              };
            })}
            skills={cvDetails?.skills?.map((s) => s?.skill) as string[]}
            addSkill={addSkill}
            removeSkill={removeSkill}
          />

          {/* Certification Section */}
          <Certifications
            isEditable={isEditable}
            handleCertificationRemove={handleCertificationRemove}
            certifications={
              cvDetails?.certifications as CertificationResponseDto[]
            }
            addCertification={addCertification}
          />
        </div>
      </div>
    </section>
  );
};

export default memo(SkillsAndCompetences);
