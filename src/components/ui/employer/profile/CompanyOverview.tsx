import React, { useEffect, useState } from "react";
import TextEditor from "../../../common/TextEditor.tsx";
import { useEmployerProfile } from "../../../../store/useEmployerProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import { AboutCompany } from "../../../../utils/types";
import { useAuth } from "../../../../store/useAuth.ts";

const CompanyOverview: React.FC = () => {
  const { employer } = useAuth();
  const { aboutCompany, setAboutCompany, updateAboutCompany } =
    useEmployerProfile();
  const [value, setValue] = useState<string>(
    employer?.companyDescription || "",
  );
  const { isEditable, toggleEdit } = useSectionEditable("companyOverview");
  useEffect(() => {
    setAboutCompany({
      companyDescription: value,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  const handleSaveCompanyOverview = async () => {
    const response = await updateAboutCompany(aboutCompany as AboutCompany);
    if (response) {
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
          onClick={handleSaveCompanyOverview}
          disabled={!isEditable}
          type="button"
          className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1`}
        >
          Save
        </button>
      </div>
      <h5 className="mb-4 font-lato text-[20px]">Company Overview</h5>
      <div className="flex flex-col">
        <label className="text-gray-600 mb-5 text-[16px]">
          About the company
        </label>

        {/* Textarea */}
        <TextEditor
          disabled={!isEditable}
          value={aboutCompany?.companyDescription || ""}
          onChange={setValue}
        />
      </div>
    </section>
  );
};

export default CompanyOverview;
