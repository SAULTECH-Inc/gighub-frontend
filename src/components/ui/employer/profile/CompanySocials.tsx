import React from "react";
import {useAuth} from "../../../../store/useAuth.ts";
import {ApplicantData} from "../../../../utils/types";

const CompanySocials: React.FC = ()=>{
    const {applicant, setProfileData} = useAuth();
    const handleChange = async(e: { target: HTMLInputElement | HTMLTextAreaElement; })=>{
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value } = target;
        const updatedApplicant: Partial<ApplicantData> = {...applicant as ApplicantData, [name]: value};
        await setProfileData(updatedApplicant);
    }
    return (<section id="work-sample" className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] ">

        <h3 className="font-lato text-[20px] text-gray-700 mb-4">
            Social and Professional Links
        </h3>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10">
            <div className="flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">LinkedIn Profile</label>
                <input
                    name="linkedInProfile"
                    value={applicant?.linkedInProfile || ""}
                    onChange={handleChange}
                    type="url"
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">GitHub</label>
                <input
                    type="url"
                    name="githubProfile"
                    value={applicant?.githubProfile || ""}
                    onChange={handleChange}
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Twitter</label>
                <input
                    type="url"
                    name="twitterProfile"
                    value={applicant?.twitterProfile || ""}
                    onChange={handleChange}
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Youtube</label>
                <input
                    type="url"
                    name="youtubeProfile"
                    value={applicant?.youtubeProfile || ""}
                    onChange={handleChange}
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </div>

    </section>);
}
export default CompanySocials;