import React, {useEffect, useState} from "react";
import TextEditor from "../../../common/TextEditor.tsx";
import {useEmployerProfile} from "../../../../store/useEmployerProfile.ts";
import {useSectionEditable} from "../../../../store/useEditable.ts";
import {AboutCompany} from "../../../../utils/types";
import {useAuth} from "../../../../store/useAuth.ts";

const CompanyOverview: React.FC = ()=>{
    const{employer} = useAuth();
    const {aboutCompany,setAboutCompany,updateAboutCompany} = useEmployerProfile();
    const [value, setValue] = useState<string>(employer?.companyDescription || "");
    const {isEditable, toggleEdit} = useSectionEditable("companyOverview");
    useEffect(()=>{
        setAboutCompany({
            companyDescription: value
        });
    },[value]);
    const handleSaveCompanyOverview = async () => {
        const response = await updateAboutCompany(aboutCompany as AboutCompany);
        if (response) {
            toggleEdit();
        }
    }
    return (<section className="relative mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
        <div className="absolute top-2 right-1 flex justify-evenly items-center text-xs gap-x-2">
            <button onClick={toggleEdit} type="button"
                    className="bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1">Edit
            </button>
            <button onClick={handleSaveCompanyOverview} disabled={!isEditable} type="button"
                    className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1`}>Save
            </button>
        </div>
        <h5 className="font-lato text-[20px] mb-4">
            Company Overview
        </h5>
        <div className="flex flex-col">
            <label className="text-[16px] text-gray-600 mb-5">About the company</label>

            {/* Textarea */}
            <TextEditor disabled={!isEditable} value={aboutCompany?.companyDescription || ""} onChange={setValue}/>
        </div>
    </section>);
}

export default CompanyOverview;
