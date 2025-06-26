import CustomDropdown from "../../../common/CustomDropdown.tsx";
import RichTextEditor from "../../../common/RichTextEditor.tsx";
import React, { useEffect, useState } from "react";
import useModalStore from "../../../../store/modalStateStores.ts";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import {
  CvResponseDto,
  ExperienceResponseDto,
  Option,
} from "../../../../utils/types";
import CustomSelect from "../../../common/CustomSelect.tsx";
import { toast } from "react-toastify";
import CustomCheckbox from "../../../common/CustomCheckbox.tsx";
import { jobLocation } from "../../../../utils/constants.ts";
import { JobRoles } from "../../../../utils/dumm.ts";
import { useCities } from "../../../../hooks/useCities.ts";

interface AddExperienceModalProp {
  modalId: string;
}

const AddExperienceModal: React.FC<AddExperienceModalProp> = ({ modalId }) => {
  const {cities} = useCities();
  const {
    experience,
    setCvDetails,
    cvDetails,
    setExperience,
    addExperience,
    setExperiences,
    experiences,
    resetExperience,
  } = useApplicantJobProfile();
  const [description, setDescription] = useState(experience?.description ?? "");
  const { modals, closeModal } = useModalStore();
  const isOpen = modals[modalId];
  const [currentlyEnrolled, setCurrentEnrolled] = useState<boolean>(false);

  useEffect(() => {
    setExperience({
      ...experience,
      description: description,
    });
    if (currentlyEnrolled) {
      setExperience({ ...experience, endDate: new Date() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExperience({
      ...experience,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await addExperience(experience);
    if (response) {
      toast.success("Experience added successfully");
      setTimeout(() => {
        closeModal(modalId);
        resetExperience();
      }, 1000);
      const exp: ExperienceResponseDto[] = [...(experiences || [])];
      exp.push(response);
      setExperience(response);
      setExperiences(exp);
      setCvDetails({
        ...cvDetails,
        experiences: exp,
      } as CvResponseDto);
    }
  };
  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExperience({
      ...experience,
      [name]: new Date(value),
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="bg-opacity-50 fixed inset-0 -top-4 z-50 flex items-center justify-center bg-black"
      onClick={() => closeModal(modalId)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[95vh] w-[100%] flex-col gap-y-5 overflow-y-auto rounded-[16px] bg-white p-4 shadow-sm md:mr-6 md:w-[690px] md:p-8 lg:w-[820px] lg:p-10"
      >
        <div className="mg:gap-x-6 flex w-full flex-row gap-x-2 gap-y-3">
          <div className="flex w-full flex-col gap-y-2">
            <label>Company name</label>
            <input
              type="text"
              name="company"
              value={experience.company}
              onChange={handleChange}
              className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
            />
          </div>
          <div className="flex w-full flex-col gap-y-2">
            <label>Your Role</label>
            <CustomDropdown
              placeholder="Enter your role"
              options={JobRoles}
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
        <div className="flex w-full flex-row gap-x-2 gap-y-3 md:flex-row md:gap-x-6">
          <div className="flex w-full flex-col gap-y-2">
            <label>Location</label>
            <CustomSelect
              placeholder="Location"
              options={jobLocation}
              onChange={(option: Option) => {
                setExperience({
                  ...experience,
                  location: option.value,
                });
              }}
              className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-start text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
            />
          </div>
          <div className="flex w-full flex-col gap-y-2">
            <label>City</label>
            <CustomDropdown
              placeholder="Enter city"
              options={cities}
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
        <div className="flex w-full flex-row gap-x-2 gap-y-3 md:grid md:grid-cols-2 md:gap-x-6">
          <div className="flex w-full flex-col gap-y-2 md:col-span-1">
            <label>Start</label>
            <input
              type="date"
              name="startDate"
              onChange={handleChangeDate}
              value={
                experience?.startDate
                  ? new Date(experience.startDate).toISOString().split("T")[0]
                  : ""
              }
              className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
            />
          </div>
          {!currentlyEnrolled && (
            <div className="flex w-full flex-col gap-y-2 md:col-span-1">
              <label>End</label>
              <input
                type="date"
                name="endDate"
                onChange={handleChangeDate}
                value={
                  experience?.endDate
                    ? new Date(experience.endDate).toISOString().split("T")[0]
                    : ""
                }
                className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-2 text-sm focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
              />
            </div>
          )}
        </div>
        <div className="flex justify-start lg:justify-end">
          <span>
            <CustomCheckbox
              label="Currently there"
              checked={currentlyEnrolled}
              onChange={(e) => {
                setCurrentEnrolled(e.target.checked);
              }}
            />
          </span>
        </div>

        <div className="mb-0 flex w-full flex-col gap-y-2 py-0">
          <label>Description</label>
          <RichTextEditor value={description || ""} onChange={setDescription} />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            type="button"
            className="w-[197px] rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#FFFFFF] px-4 py-2 font-medium text-purple-600"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => closeModal(modalId)}
            className="ml-4 w-[197px] rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#FFFFFF] px-4 py-2 font-medium text-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExperienceModal;
