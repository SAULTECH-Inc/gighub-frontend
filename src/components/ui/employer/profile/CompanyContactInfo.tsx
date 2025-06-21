import React, { useEffect } from "react";
import { useEmployerProfile } from "../../../../store/useEmployerProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import { ContactInfo, EmployerData } from "../../../../utils/types";
import { useAuth } from "../../../../store/useAuth.ts";

const CompanyContactInfo: React.FC = () => {
  const { employer, setEmployerData } = useAuth();
  const { contactInfo, setContactInfo, updateContactInfo } =
    useEmployerProfile();
  const { isEditable, toggleEdit } = useSectionEditable("companyContactInfo");
  useEffect(() => {
    if (employer) {
      setContactInfo({
        managerEmail: employer.managerEmail || "",
        managerPhoneNumber: employer.managerPhoneNumber || "",
        companyPhone: employer.companyPhone || "",
        email: employer.email || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value,
    } as ContactInfo);
    setEmployerData({
      ...employer,
      [e.target.name]: e.target.value,
    } as EmployerData);
  };
  const handleSaveCompanyContactInfo = async () => {
    const response = await updateContactInfo(contactInfo as ContactInfo);
    if (response) {
      console.log("Company Contact Info updated successfully");
      setContactInfo(response);
      toggleEdit();
    }
  };
  return (
    <section className="relative mt-4 border-t-[2px] border-t-[#E6E6E6] pt-5">
      <div className="absolute right-1 top-2 flex items-center justify-evenly gap-x-2 text-xs">
        <button
          onClick={toggleEdit}
          type="button"
          className="w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1"
        >
          Edit
        </button>
        <button
          onClick={handleSaveCompanyContactInfo}
          disabled={!isEditable}
          type="button"
          className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1`}
        >
          Save
        </button>
      </div>
      <h3 className="text-gray-700 mb-4 font-lato text-[20px]">
        Contact Information
      </h3>
      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-10">
        <div className="flex w-full flex-col">
          <label className="text-gray-600 mb-1 text-[16px]">
            Email Address
          </label>
          <input
            type="email"
            value={contactInfo?.email}
            name="email"
            onChange={handleChange}
            disabled={true}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
          />
        </div>
        <div className="flex w-full flex-col">
          <label className="text-gray-600 mb-1 text-[16px]">Phone Number</label>
          <input
            type="tel"
            value={contactInfo?.companyPhone}
            name="companyPhone"
            onChange={handleChange}
            disabled={!isEditable}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
          />
        </div>
        <div className="flex w-full flex-col">
          <label className="text-gray-600 mb-1 text-[16px]">
            Manager Email
          </label>
          <input
            type="email"
            value={contactInfo?.managerEmail}
            name="managerEmail"
            onChange={handleChange}
            disabled={!isEditable}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
          />
        </div>
        <div className="flex w-full flex-col">
          <label className="text-gray-600 mb-1 text-[16px]">
            Manager Phone Number
          </label>
          <input
            type="tel"
            value={contactInfo?.managerPhoneNumber}
            name="managerPhoneNumber"
            onChange={handleChange}
            disabled={!isEditable}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
          />
        </div>
      </div>
    </section>
  );
};

export default CompanyContactInfo;
