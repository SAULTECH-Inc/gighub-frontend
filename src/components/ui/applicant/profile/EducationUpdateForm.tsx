import React, { useEffect, useState } from "react";
import RichTextEditor from "../../../common/RichTextEditor.tsx";
import CustomDropdown from "../../../common/CustomDropdown.tsx";
import {
  classOfDegrees,
  EducationResponseDto,
  fieldsOfStudies,
  institutions,
  Option,
} from "../../../../utils/types";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import { useCities } from "../../../../hooks/useCities.ts";
import { useCountries } from "../../../../hooks/useCountries.ts";

interface EductionUpdateFormProps {
  educationData: EducationResponseDto;
  isEditable: boolean;
}

const EducationUpdateForm: React.FC<EductionUpdateFormProps> = ({
  educationData,
  isEditable,
}) => {
  const { cities } = useCities();
  const { countries } = useCountries();
  const { applicantEducation, setApplicantEducation } =
    useApplicantJobProfile();
  const [description, setDescription] = useState<string>(
    educationData?.description || "",
  );

  useEffect(() => {
    if (
      description != null ||
      description !== undefined ||
      description === ""
    ) {
      setApplicantEducation({
        ...applicantEducation,
        description: description,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, educationData]);

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplicantEducation({
      ...applicantEducation,
      [name]: new Date(value),
    });
  };

  return (
    <div className="flex w-full flex-col gap-y-5">
      <div className="flex w-full flex-col gap-x-2 gap-y-3 md:flex-row md:gap-x-6">
        <div className="flex w-full flex-col gap-y-2">
          <label>Degree</label>
          <CustomDropdown
            placeholder={applicantEducation?.degree || "Select a degree..."}
            options={classOfDegrees}
            disabled={!isEditable}
            handleSelect={(selected: Option) => {
              setApplicantEducation({
                ...applicantEducation,
                institution: selected.value,
              });
            }}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
          />
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <label>Field of Study</label>
          <CustomDropdown
            placeholder={
              applicantEducation?.fieldOfStudy || "Select a field of study..."
            }
            options={fieldsOfStudies}
            disabled={!isEditable}
            handleSelect={(selected: Option) => {
              setApplicantEducation({
                ...applicantEducation,
                fieldOfStudy: selected.value,
              });
            }}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-x-2 gap-y-3 md:flex-row md:gap-x-6">
        <div className="flex w-full flex-col gap-y-2">
          <label>Institution</label>
          <CustomDropdown
            options={institutions}
            disabled={!isEditable}
            placeholder={
              applicantEducation?.institution || "Select an institution..."
            }
            handleSelect={(selected: Option) => {
              setApplicantEducation({
                ...applicantEducation,
                institution: selected.value,
              });
            }}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
          />
        </div>

        <div className="flex w-full flex-col gap-y-2">
          <label>Degree</label>
          <CustomDropdown
            placeholder={
              applicantEducation?.institution || "Select a institution..."
            }
            options={institutions}
            disabled={!isEditable}
            handleSelect={(selected: Option) => {
              setApplicantEducation({
                ...applicantEducation,
                institution: selected.value,
              });
            }}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-x-2 gap-y-3 md:flex-row md:gap-x-6">
        <div className="flex w-full flex-col gap-y-2">
          <label>Country</label>
          <CustomDropdown
            placeholder={applicantEducation?.country || "Select a country..."}
            options={countries}
            disabled={!isEditable}
            handleSelect={(selected: Option) => {
              setApplicantEducation({
                ...applicantEducation,
                country: selected.value,
              });
            }}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
          />
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <label>City</label>
          <CustomDropdown
            placeholder={applicantEducation?.city || "Select a city..."}
            options={cities}
            disabled={!isEditable}
            handleSelect={(selected: Option) => {
              setApplicantEducation({
                ...applicantEducation,
                city: selected.value,
              });
            }}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-x-2 gap-y-3 md:flex-row md:gap-x-6">
        <div className="flex gap-x-2 px-2 md:w-1/2 md:gap-x-6 md:px-0">
          <div className="flex w-1/2 flex-col gap-y-2">
            <label>Start</label>
            <input
              type="date"
              name="startDate"
              disabled={!isEditable}
              value={
                applicantEducation?.startDate
                  ? new Date(applicantEducation.startDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={handleChangeDate}
              className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
            />
          </div>
          <div className="flex w-1/2 flex-col gap-y-2">
            <label>End</label>
            <input
              type="date"
              name="endDate"
              disabled={!isEditable}
              value={
                applicantEducation?.endDate
                  ? new Date(applicantEducation.endDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={handleChangeDate}
              className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
            />
          </div>
        </div>
      </div>

      <div className="mb-0 flex w-full flex-col gap-y-2 py-0">
        <label>Description</label>
        <RichTextEditor
          disabled={!isEditable}
          value={applicantEducation?.description || ""}
          onChange={setDescription}
        />
      </div>
    </div>
  );
};

export default EducationUpdateForm;
