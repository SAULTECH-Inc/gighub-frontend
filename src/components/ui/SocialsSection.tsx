import React, {useState} from "react";
import {useSectionEditable} from "../../store/useEditable.ts";
import {useEmployerProfile} from "../../store/useEmployerProfile.ts";
import {ApplicantData, Socials} from "../../utils/types";
import {useAuth} from "../../store/useAuth.ts";
import {USER_TYPE} from "../../utils/helpers.ts";
import {UserType} from "../../utils/enums.ts";

const SocialsSection: React.FC = ()=>{

    const{applicant,updateApplicantSocial, setApplicantData} = useAuth();
    const {socials,updateSocials, setSocials} = useEmployerProfile();
    const {isEditable, toggleEdit} = useSectionEditable("socials-and-security");
    const [socialData, setSocialData] = useState({
        linkedInProfile: USER_TYPE === UserType.APPLICANT ? applicant?.linkedInProfile : socials?.linkedInProfile,
        twitterProfile: USER_TYPE === UserType.APPLICANT ? applicant?.twitterProfile : socials?.twitterProfile,
        facebookProfile: USER_TYPE === UserType.APPLICANT ? applicant?.facebookProfile : socials?.facebookProfile,
        instagramProfile: USER_TYPE === UserType.APPLICANT ? applicant?.instagramProfile : socials?.instagramProfile,
        githubProfile: USER_TYPE === UserType.APPLICANT && applicant?.githubProfile,
    });
    const handleChange = async (e: { target: HTMLInputElement | HTMLTextAreaElement }) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value } = target;
        setSocialData({...socialData, [name]: value });
    };



    const handleToggleEdit = () => {
        toggleEdit();
    };
    const handleSaveSocials = async()=>{
         const response = USER_TYPE === UserType.APPLICANT ? await updateApplicantSocial(socialData as Socials) : await updateSocials(socialData as Socials);
        if(response) {
            setSocialData(response);
            if(USER_TYPE === UserType.APPLICANT){
                setApplicantData(response as ApplicantData);
            }else{
                setSocials(response);
            }
        }
    }
    return (<section id="work-sample" className="relative mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] ">
        <div
            className="absolute top-2 right-1 flex justify-evenly items-center text-xs gap-x-2 z-10">
            <button type="button" onClick={handleToggleEdit}
                    className="bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1">Edit
            </button>
            <button type="button"
                    onClick={handleSaveSocials}
                    className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1`}>Save
            </button>
        </div>
        <h3 className="font-lato text-[20px] text-gray-700 mb-4">
            Social and Professional Links
        </h3>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10">
            <div className="flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">LinkedIn Profile</label>
                <input
                    name="linkedInProfile"
                    value={socialData?.linkedInProfile || ""}
                    disabled={!isEditable}
                    onChange={handleChange}
                    type="url"
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            {
                USER_TYPE === UserType.EMPLOYER && (<div className="flex flex-col">
                    <label className="text-[16px] text-gray-600 mb-1">Facebook</label>
                    <input
                        type="url"
                        name="facebookProfile"
                        value={socialData?.facebookProfile || ""}
                        disabled={!isEditable}
                        onChange={handleChange}
                        className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>)
            }
            <div className="flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Twitter</label>
                <input
                    type="url"
                    name="twitterProfile"
                    value={socialData?.twitterProfile || ""}
                    disabled={!isEditable}
                    onChange={handleChange}
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Instagram</label>
                <input
                    type="url"
                    name="instagramProfile"
                    value={socialData?.instagramProfile ||""}
                    disabled={!isEditable}
                    onChange={handleChange}
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            {
                USER_TYPE === UserType.APPLICANT && (<div className="flex flex-col">
                    <label className="text-[16px] text-gray-600 mb-1">Github</label>
                    <input
                        type="url"
                        name="instagramProfile"
                        value={socialData?.githubProfile || ""}
                        disabled={!isEditable}
                        onChange={handleChange}
                        className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>)
            }
        </div>

    </section>);
}
export default SocialsSection;
