import React from "react";
import { useEmployerProfile } from "../../../../store/useEmployerProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import {
  ComplianceAndVerifications,
  EmployerData,
} from "../../../../utils/types";
import { useAuth } from "../../../../store/useAuth.ts";

const ComplianceAndVerification: React.FC = () => {
  const { employer, setEmployerData } = useAuth();
  const {
    complianceAndVerification,
    setComplianceAndVerification,
    updateComplianceAndVerification,
  } = useEmployerProfile();
  const { isEditable, toggleEdit } = useSectionEditable(
    "complianceAndVerification",
  );
  const handleToggleEdit = () => {
    toggleEdit();
  };
  const handleSaveComplianceVerification = async () => {
    const response = await updateComplianceAndVerification(
      complianceAndVerification as ComplianceAndVerifications,
    );
    if (response) {
      setComplianceAndVerification(response);
      toggleEdit();
    }
  };
  return (
    <section className="relative mt-4 border-t-[2px] border-t-[#E6E6E6] pt-5">
      <div className="absolute right-1 top-2 z-10 flex items-center justify-evenly gap-x-2 text-xs">
        <button
          type="button"
          onClick={handleToggleEdit}
          className="w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleSaveComplianceVerification}
          className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1`}
        >
          Save
        </button>
      </div>
      <h3 className="mb-4 font-lato text-[20px]">
        Compliance and Verifications
      </h3>
      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-10">
        <div className="flex flex-col">
          <label className="mb-1 text-[16px] text-gray-600">
            Business Registration Number
          </label>
          <input
            type="text"
            value={complianceAndVerification?.registrationNumber}
            disabled={!isEditable}
            onChange={(event) => {
              setComplianceAndVerification({
                ...complianceAndVerification,
                registrationNumber: event.target.value,
              });
              setEmployerData({
                ...employer,
                registrationNumber: event.target.value,
              } as EmployerData);
            }}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-[16px] text-gray-600">
            Tax Identification number
          </label>
          <input
            type="text"
            value={complianceAndVerification?.taxIdentificationNumber}
            disabled={!isEditable}
            onChange={(event) => {
              setComplianceAndVerification({
                ...complianceAndVerification,
                taxIdentificationNumber: event.target.value,
              });
              setEmployerData({
                ...employer,
                taxIdentificationNumber: event.target.value,
              } as EmployerData);
            }}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
          />
        </div>
      </div>
    </section>
  );
};

export default ComplianceAndVerification;
