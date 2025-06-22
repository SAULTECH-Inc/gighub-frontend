import React from "react";
import { useAuth } from "../../../../store/useAuth.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import { toast } from "react-toastify";

const ComplianceAndVerification: React.FC = () => {
  const {
    applicant,
    applicantPersonalInfo,
    setApplicantData,
    setApplicantPersonalInfo,
    updateApplicantPersonalInfo,
  } = useAuth();
  const { isEditable, toggleEdit } = useSectionEditable("socials-and-security");
  const handleChange = async (e: {
    target: HTMLInputElement | HTMLTextAreaElement;
  }) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    setApplicantPersonalInfo({
      ...applicantPersonalInfo,
      [name]: value,
    });
    setApplicantData({
      ...applicant,
      [name]: value,
    });
  };

  const handleToggleEdit = () => {
    toggleEdit();
  };
  const handleSaveVerification = async () => {
    const response = await updateApplicantPersonalInfo(applicantPersonalInfo);
    if (response) {
      toast.success("Socials updated successfully");
    }
  };
  return (
    <section
      id="company-socials"
      className="w-full relative mt-4 border-t-[2px] border-t-[#E6E6E6] pt-5"
    >
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
          onClick={handleSaveVerification}
          className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1`}
        >
          Save
        </button>
      </div>
      <h3 className="mb-4 font-lato text-[20px]">Verification</h3>
      <div className="w-full gap-4">
        <div className="w-full flex flex-col space-y-2">
          <label className="text-gray-600 mb-1 text-sm">Government ID</label>
          <input
            type="url"
            name="governmentIdentificationNumber"
            value={applicant?.governmentIdentificationNumber || ""}
            disabled={!isEditable}
            onChange={handleChange}
            className="w-[100%] rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
          />
        </div>
      </div>
    </section>
  );
};

export default ComplianceAndVerification;
