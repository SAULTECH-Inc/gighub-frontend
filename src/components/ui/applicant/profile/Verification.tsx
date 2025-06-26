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
      className="relative mt-4 w-full border-t-[2px] border-t-[#E6E6E6] pt-5"
    >
      <div className="absolute top-2 right-1 z-10 flex items-center justify-evenly gap-x-2 text-xs">
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
      <h3 className="font-lato mb-4 text-[20px]">Verification</h3>
      <div className="w-full gap-4">
        <div className="flex w-full flex-col space-y-2">
          <label className="mb-1 text-sm text-gray-600">Government ID</label>
          <input
            type="url"
            name="governmentIdentificationNumber"
            value={applicant?.governmentIdentificationNumber || ""}
            disabled={!isEditable}
            onChange={handleChange}
            className="w-[100%] rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
          />
        </div>
      </div>
    </section>
  );
};

export default ComplianceAndVerification;
