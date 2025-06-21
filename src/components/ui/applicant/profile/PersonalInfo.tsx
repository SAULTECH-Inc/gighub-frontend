import React from "react";
import CustomDropdown from "../../../common/CustomDropdown.tsx";
import { useAuth } from "../../../../store/useAuth.ts";
import {
  ApplicantPersonalInfo,
  countries,
  Option,
} from "../../../../utils/types";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import DatePicker from "../../../common/DatePicker.tsx";

const cities: Option[] = [
  { label: "New York", value: "NY" },
  { label: "Los Angeles", value: "LA" },
  { label: "Chicago", value: "CHI" },
  { label: "Houston", value: "HOU" },
  { label: "Philadelphia", value: "PHL" },
  { label: "San Francisco", value: "SF" },
  { label: "Seattle", value: "SEA" },
  { label: "Boston", value: "BOS" },
  { label: "Washington D.C.", value: "WASH" },
  { label: "Atlanta", value: "ATL" },
  { label: "Dallas", value: "DAL" },
  { label: "San Diego", value: "SAN" },
  { label: "San Jose", value: "SJC" },
];
const PersonalInfo: React.FC = () => {
  const {
    applicant,
    applicantPersonalInfo,
    setProfileData,
    setApplicantPersonalInfo,
    updateApplicantPersonalInfo,
  } = useAuth();
  const { isEditable, toggleEdit } = useSectionEditable("personal-info");

  const handleChange = async (e: {
    target: HTMLInputElement | HTMLTextAreaElement;
  }) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    const data = {
      ...applicant,
      [name]: value,
    } as ApplicantPersonalInfo;
    setApplicantPersonalInfo(data);
  };
  const handleSavePersonalInfo = async () => {
    const response = await updateApplicantPersonalInfo(
      applicantPersonalInfo as ApplicantPersonalInfo,
    );
    if (response) {
      setProfileData({
        ...applicant,
        ...response,
      });
      toggleEdit();
    }
  };
  return (
    <section
      id="personal-info"
      className="relative mt-4 border-t-[2px] border-t-[#E6E6E6] pt-5"
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
          onClick={handleSavePersonalInfo}
          disabled={!isEditable}
          type="button"
          className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1`}
        >
          Save
        </button>
      </div>
      <h3 className="mb-4 font-lato text-[20px]">Personal Information</h3>
      <div className="flex w-full flex-col gap-y-5">
        <div className="grid w-full grid-cols-1 items-center gap-x-8 lg:flex">
          <div className="flex w-full flex-col">
            <label className="mb-1 text-sm text-gray-600">First Name</label>
            <input
              type="text"
              onChange={handleChange}
              disabled={!isEditable}
              name="firstName"
              value={applicantPersonalInfo?.firstName || ""}
              className="flex h-12 w-full items-start rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 text-left focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex w-full flex-col">
            <label className="mb-1 text-sm text-gray-600">Middle Name</label>
            <input
              type="text"
              onChange={handleChange}
              name="middleName"
              disabled={!isEditable}
              value={applicantPersonalInfo?.middleName || ""}
              className="flex h-12 w-full items-start rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 text-left focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex w-full flex-col">
            <label className="mb-1 text-sm text-gray-600">Last Name</label>
            <input
              type="text"
              onChange={handleChange}
              name="lastName"
              disabled={!isEditable}
              value={applicantPersonalInfo?.lastName || ""}
              className="flex h-12 w-full items-start rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 text-left focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex w-full flex-col">
            <label className="mb-1 text-sm text-gray-600">Email address</label>
            <input
              type="text"
              onChange={handleChange}
              name="email"
              disabled={!isEditable}
              value={applicantPersonalInfo?.email || ""}
              className="h-12 w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-1 items-center gap-x-8 lg:flex">
          <div className="flex w-full flex-col">
            <label className="mb-1 text-sm text-gray-600">Phone number</label>
            <input
              type="text"
              name="phoneNumber"
              onChange={handleChange}
              disabled={!isEditable}
              value={applicantPersonalInfo?.phoneNumber || ""}
              className="h-12 w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex w-full flex-col">
            <label className="mb-1 text-sm text-gray-600">Date of birth</label>
            <DatePicker
              selectedDate={
                new Date(applicantPersonalInfo?.dateOfBirth || "2025-01-10")
              }
              disabled={!isEditable}
              onDateChange={(date) => {
                const data = {
                  ...applicant,
                  dateOfBirth: date,
                } as ApplicantPersonalInfo;
                setApplicantPersonalInfo(data);
              }}
              className="h-12 w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-1 items-center gap-x-8 lg:flex">
          <div className="flex w-full flex-col">
            <label className="mb-1 text-sm text-gray-600">Country</label>
            <CustomDropdown
              options={countries}
              handleSelect={(country) => {
                const data = {
                  ...applicantPersonalInfo,
                  country: country?.value || "",
                };
                setApplicantPersonalInfo(data);
              }}
              placeholder={applicantPersonalInfo?.country || ""}
              disabled={!isEditable}
              className="h-12 w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 text-start focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex w-full flex-col gap-x-8">
            <label className="mb-1 text-sm text-gray-600">City</label>
            <CustomDropdown
              options={cities}
              handleSelect={(city) => {
                const data = {
                  ...applicantPersonalInfo,
                  city: city?.value || "",
                };
                setApplicantPersonalInfo(data);
              }}
              placeholder={applicantPersonalInfo?.city || ""}
              disabled={!isEditable}
              className="h-12 w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 text-start focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        <div className="flex w-full flex-col">
          <label className="mb-1 text-sm text-gray-600">Address</label>
          <input
            type="text"
            onChange={handleChange}
            name="address"
            value={applicantPersonalInfo?.address || ""}
            disabled={!isEditable}
            className="h-12 w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
          />
        </div>
      </div>
    </section>
  );
};

export default PersonalInfo;
