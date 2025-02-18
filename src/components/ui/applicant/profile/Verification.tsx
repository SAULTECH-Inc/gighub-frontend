import React from "react";
import {ApplicantData} from "../../../../utils/types";
import {useAuth} from "../../../../store/useAuth.ts";

const ComplianceAndVerification: React.FC = ()=>{
    const {applicant,setProfileData} = useAuth();
    const handleChange = async(e: { target: HTMLInputElement | HTMLTextAreaElement; })=>{
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value } = target;
        const updatedApplicant: Partial<ApplicantData> = {...applicant as ApplicantData, [name]: value};
        await setProfileData(updatedApplicant);
    }
    return (<section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
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
                    onChange={handleChange}
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </div>
    </section>);
}

export default ComplianceAndVerification;