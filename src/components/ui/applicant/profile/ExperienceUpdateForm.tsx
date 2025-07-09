import React, { useEffect, useState } from "react";
import RichTextEditor from "../../../common/RichTextEditor.tsx";
import CustomDropdown from "../../../common/CustomDropdown.tsx";
import { ExperienceResponseDto, Option } from "../../../../utils/types";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import CustomSelect from "../../../common/CustomSelect.tsx";
import { jobLocation } from "../../../../utils/constants.ts";
import { useCities } from "../../../../hooks/useCities.ts";
import { useJobRoles } from "../../../../hooks/useJobRoles.ts";

interface ExperienceUpdateFormProps {
  experienceData: ExperienceResponseDto;
  isEditable: boolean;
}

const ExperienceUpdateForm: React.FC<ExperienceUpdateFormProps> = ({
  experienceData,
  isEditable,
}) => {
  const {cities} = useCities();
  const jobRoles = useJobRoles();
  const { experience, setExperience } = useApplicantJobProfile();
  const [description, setDescription] = useState(
    experienceData?.description ?? "",
  );

  useEffect(() => {
    if (
      description != null ||
      description !== undefined ||
      description === ""
    ) {
      setExperience({
        ...experience,
        description: description,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExperience({
      ...experience,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExperience({
      ...experience,
      [name]: new Date(value),
    });
  };
  return (
    <div className="flex w-full flex-col gap-y-5">
      <div className="mg:gap-x-6 flex w-full flex-col gap-x-2 gap-y-3 md:flex-row">
        <div className="flex w-full flex-col gap-y-2">
          <label>Company name</label>
          <input
            type="text"
            name="company"
            value={experienceData.company}
            disabled={!isEditable}
            onChange={handleChange}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] p-2 text-start text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
          />
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <label>Your Role</label>
          <CustomDropdown
            placeholder={experienceData.position}
            options={jobRoles}
            disabled={!isEditable}
            handleSelect={(option: Option) => {
              setExperience({
                ...experience,
                position: option.value,
              });
            }}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-x-2 gap-y-3 md:flex-row md:gap-x-6">
        <div className="flex w-full flex-col gap-y-2">
          <label>Employment Type</label>
          <CustomSelect
            placeholder={experienceData.location}
            options={jobLocation}
            disabled={!isEditable}
            onChange={(option: Option) => {
              setExperience({
                ...experience,
                location: option.value,
              });
            }}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] bg-transparent p-2 text-start text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
          />
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <label>City</label>
          <CustomDropdown
            placeholder={experienceData.city}
            options={cities}
            disabled={!isEditable}
            handleSelect={(option: Option) => {
              setExperience({
                ...experience,
                city: option.value,
              });
            }}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-x-2 gap-y-3 md:flex-row md:gap-x-6">
        <div className="flex w-full flex-col gap-y-2">
          <label>Start</label>
          <input
            type="date"
            name="startDate"
            disabled={!isEditable}
            onChange={handleChangeDate}
            value={
              experienceData?.startDate
                ? new Date(experienceData.startDate).toISOString().split("T")[0]
                : ""
            }
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
          />
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <label>End</label>
          <input
            type="date"
            name="endDate"
            disabled={!isEditable}
            onChange={handleChangeDate}
            value={
              experienceData?.endDate
                ? new Date(experienceData.endDate).toISOString().split("T")[0]
                : ""
            }
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
          />
        </div>
      </div>

      <div className="mb-0 flex w-full flex-col gap-y-2 py-0">
        <label>Description</label>
        <RichTextEditor
          value={description}
          disabled={!isEditable}
          onChange={setDescription}
        />
      </div>
    </div>
  );
};

export default ExperienceUpdateForm;
