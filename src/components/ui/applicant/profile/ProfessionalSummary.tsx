import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../store/useAuth.ts";
import {
  CvResponseDto,
  ProfessionalSummaryData,
} from "../../../../utils/types";
import TextEditor from "../../../common/TextEditor.tsx";
import { useSectionEditable } from "../../../../store/useEditable.ts";

const ProfessionalSummary: React.FC = () => {
  const {
    applicant,
    setProfileData,
    professionalSummaryData,
    setProfessionalSummaryData,
    updateProfessionalSummaryData,
  } = useAuth();
  const { isEditable, toggleEdit } = useSectionEditable("professional-summary");
  const [value, setValue] = useState<string>(
    professionalSummaryData?.professionalSummary
      ? professionalSummaryData?.professionalSummary
      : "",
  );
  // In ProfessionalSummary.tsx
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfessionalSummaryData({
      ...professionalSummaryData,
      [name]: value,
    } as ProfessionalSummaryData);
  };

  useEffect(() => {
    if (value) {
      setProfessionalSummaryData({
        ...professionalSummaryData,
        professionalSummary: value,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleUpdateProfessionalSummary = async () => {
    const response = await updateProfessionalSummaryData(
      professionalSummaryData,
    );
    if (response) {
      setProfileData({
        ...applicant,
        cv: {
          ...applicant.cv,
          professionalSummary: response.professionalSummary,
        } as CvResponseDto,
      });
      toggleEdit();
    }
  };

  const handleEditorChange = (content: React.SetStateAction<string>) => {
    setProfessionalSummaryData({
      ...professionalSummaryData,
      professionalSummary: content as string,
    });
  };

  return (
    <section
      id="professional-summary"
      className="relative mt-4 space-y-3 border-t-[2px] border-t-[#E6E6E6] pt-5"
    >
      <div className="absolute right-1 top-2 flex items-center justify-evenly gap-x-2 text-xs">
        <button
          onClick={toggleEdit}
          type="button"
          className="w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1"
        >
          Edit
        </button>
        <button
          disabled={!isEditable}
          type="button"
          onClick={handleUpdateProfessionalSummary}
          className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1`}
        >
          Save
        </button>
      </div>
      <h3 className="mb-4 font-lato text-[20px]">Professional Summary</h3>
      <div className="flex w-full flex-col">
        <label
          htmlFor="professionalTitle"
          className="mb-1 text-sm text-gray-600"
        >
          Professional Title
        </label>
        <input
          type="text"
          name="professionalTitle"
          value={professionalSummaryData?.professionalTitle || ""}
          onChange={handleChange}
          disabled={!isEditable}
          className="h-12 w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
        />
      </div>
      <div className="mt-4 flex flex-col">
        <label className="mb-5 text-[16px] text-gray-600">Short bio</label>

        {/* Textarea */}
        <TextEditor
          value={value}
          onChange={(content) => {
            setValue(content);
            handleEditorChange(content);
          }}
          disabled={!isEditable}
        />
      </div>
    </section>
  );
};

export default ProfessionalSummary;
