import React from "react";
import {useAuth} from "../../../../store/useAuth.ts";
import {useSectionEditable} from "../../../../store/useEditable.ts";
import {toast} from "react-toastify";

const ComplianceAndVerification: React.FC = ()=>{
    const {applicant,applicantPersonalInfo, setApplicantPersonalInfo, updateApplicantPersonalInfo} = useAuth();
    const {isEditable, toggleEdit} = useSectionEditable("socials-and-security");
    const handleChange = async(e: { target: HTMLInputElement | HTMLTextAreaElement; })=>{
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value } = target;
        const response = await updateApplicantPersonalInfo({
            ...applicantPersonalInfo,
            [name]: value
        });
        if(response){
            setApplicantPersonalInfo(response);
        }
    }

    const handleToggleEdit = () => {
        toggleEdit();
    };
    const handleSaveVerification = async()=>{
        const response = await updateApplicantPersonalInfo(applicantPersonalInfo);
        if(response) {
            toast.success("Socials updated successfully");
        }
    }
    return (<section id="company-socials" className="relative mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
        <div
            className="absolute top-2 right-1 flex justify-evenly items-center text-xs gap-x-2 z-10">
            <button type="button" onClick={handleToggleEdit}
                    className="bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1">Edit
            </button>
            <button type="button"
                    onClick={handleSaveVerification}
                    className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1`}>Save
            </button>
        </div>
        <h3 className="font-lato text-[20px] mb-4">
            Verification
        </h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-600 mb-1">Government ID</label>
                <input
                    type="url"
                    name="governmentIdentificationNumber"
                    value={applicant?.governmentIdentificationNumber || ""}
                    disabled={!isEditable}
                    onChange={handleChange}
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </div>
    </section>);
}

export default ComplianceAndVerification;
