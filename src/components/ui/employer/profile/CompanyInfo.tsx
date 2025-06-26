import React from "react";
import { useEmployerProfile } from "../../../../store/useEmployerProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import CustomDropdown from "../../../common/CustomDropdown.tsx";
import {
  CompanyInfos,
  EmployerData,
  Option,
} from "../../../../utils/types";
import CustomSelect from "../../../common/CustomSelect.tsx";
import { Industries } from "../../../../utils/industries.ts";
import { CompanySizes } from "../../../../utils/constants.ts";
import { useAuth } from "../../../../store/useAuth.ts";
import { useCountries } from "../../../../hooks/useCountries.ts";

const CompanyInfo: React.FC = () => {
  const { employer, setEmployerData } = useAuth();
  const {countries} = useCountries();
  const { companyInfo, setCompanyInfo, updateCompanyInfo } =
    useEmployerProfile();
  const { isEditable, toggleEdit } = useSectionEditable("companyInfo");
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setCompanyInfo({
      ...companyInfo,
      [e.target.name]: e.target.value,
    } as CompanyInfos);
    setEmployerData({
      ...employer,
      [e.target.name]: e.target.value,
    } as EmployerData);
  };
  const handleSaveCompanyInfo = async () => {
    const response = await updateCompanyInfo(companyInfo as CompanyInfos);
    if (response) {
      console.log("Company Info updated successfully");
      setCompanyInfo(response);
      toggleEdit();
    }
  };
  return (
    <section className="relative mt-4 border-t-[2px] border-t-[#E6E6E6] pt-5">
      <div className="absolute top-2 right-1 flex items-center justify-evenly gap-x-2 text-xs">
        <button
          onClick={toggleEdit}
          type="button"
          className="w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1"
        >
          Edit
        </button>
        <button
          onClick={handleSaveCompanyInfo}
          disabled={!isEditable}
          type="button"
          className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1`}
        >
          Save
        </button>
      </div>
      <h3 className="font-lato mb-4 text-[20px]">Company Information</h3>
      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-10">
        <div className="flex flex-col">
          <label className="mb-1 text-[16px] text-gray-600">Company Name</label>
          <input
            type="text"
            value={companyInfo?.companyName as string}
            name="companyName"
            onChange={handleChange}
            disabled={!isEditable}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
          />
        </div>
        <div className="flex w-full flex-col">
          <label className="mb-1 text-[16px] text-gray-600">Industry</label>
          <CustomDropdown
            placeholder={companyInfo?.industry as string}
            handleSelect={(option: Option) => {
              setCompanyInfo({
                ...companyInfo,
                industry: option.value,
              } as CompanyInfos);
              setEmployerData({
                ...employer,
                industry: option.value,
              } as EmployerData);
            }}
            options={Industries}
            disabled={!isEditable}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 text-left focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
          />
        </div>
        <div className="flex w-full flex-col">
          <label className="mb-1 text-[16px] text-gray-600">Company Size</label>
          <CustomSelect
            options={CompanySizes}
            placeholder={companyInfo?.companySize}
            onChange={(option: Option) => {
              setCompanyInfo({
                ...companyInfo,
                companySize: option.label,
              } as CompanyInfos);
              setEmployerData({
                ...employer,
                companySize: option.label,
              } as EmployerData);
            }}
            disabled={!isEditable}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 text-left focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
          />
        </div>
        <div className="flex w-full flex-col">
          <label className="mb-1 text-[16px] text-gray-600">Country</label>
          <CustomSelect
            options={countries}
            placeholder={companyInfo?.country}
            onChange={(option: Option) => {
              setCompanyInfo({
                ...companyInfo,
                country: option.value,
              } as CompanyInfos);
              setEmployerData({
                ...employer,
                country: option.value,
              } as EmployerData);
            }}
            disabled={!isEditable}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 text-left focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-[16px] text-gray-600">City</label>
          <input
            type="text"
            value={companyInfo?.city}
            name="city"
            onChange={handleChange}
            disabled={!isEditable}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex w-full flex-col">
          <label className="mb-1 text-[16px] text-gray-600">Address</label>
          <input
            value={companyInfo?.companyAddress}
            name="companyAddress"
            onChange={handleChange}
            type="text"
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
          />
        </div>
      </div>
    </section>
  );
};

export default CompanyInfo;
