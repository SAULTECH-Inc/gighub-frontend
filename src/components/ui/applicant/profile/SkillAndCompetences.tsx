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
import { Zap, Edit3, Save, CheckCircle2 } from "lucide-react";
import { jobSkills } from "../../../../utils/constants.ts";

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
    <section id="skills-competences" className="relative">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <Zap className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Skills and Competences
            </h3>
            <p className="text-sm text-gray-500">
              Showcase your technical skills and professional certifications
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleEdit}
            type="button"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isEditable
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            <Edit3 className="h-4 w-4" />
            {isEditable ? "Cancel" : "Edit"}
          </button>

          {isEditable && (
            <button
              onClick={handleUpdateSkillsAndCompetences}
              type="button"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="rounded-xl bg-gray-50 p-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Skills Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              Technical Skills
            </h4>
            <Skills
              isEditable={!isEditable}
              options={jobSkills.map((skill) => ({
                value: skill,
                label: skill,
              }))}
              skills={cvDetails?.skills?.map((s) => s?.skill) as string[]}
              addSkill={addSkill}
              removeSkill={removeSkill}
            />
          </div>

          {/* Certification Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Professional Certifications
            </h4>
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

        {/* Tips Section */}
        {isEditable && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-blue-800">
              💡 Tips for skills and certifications:
            </h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>
                • Include both technical and soft skills relevant to your target
                roles
              </li>
              <li>
                • Add industry-recognized certifications to strengthen your
                profile
              </li>
              <li>• Keep skills current and remove outdated technologies</li>
              <li>• Include the institution and year for certifications</li>
            </ul>
          </div>
        )}

        {/* Status Indicator */}
        {!isEditable && (
          <div className="mt-6 flex items-center gap-2 border-t border-gray-200 pt-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              Skills and competences saved successfully
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(SkillsAndCompetences);
