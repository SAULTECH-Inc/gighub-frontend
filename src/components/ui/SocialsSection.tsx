import React, { useState } from "react";
import { useSectionEditable } from "../../store/useEditable.ts";
import { useEmployerProfile } from "../../store/useEmployerProfile.ts";
import { ApplicantData, EmployerData, Socials } from "../../utils/types";
import { useAuth } from "../../store/useAuth.ts";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";

const SocialsSection: React.FC = () => {
  const {
    applicant,
    employer,
    updateApplicantSocial,
    setApplicantData,
    setEmployerData,
  } = useAuth();
  const { socials, updateSocials, setSocials } = useEmployerProfile();
  const { isEditable, toggleEdit } = useSectionEditable("socials-and-security");
  const [socialData, setSocialData] = useState({
    linkedInProfile:
      USER_TYPE === UserType.APPLICANT
        ? applicant?.linkedInProfile
        : socials?.linkedInProfile,
    twitterProfile:
      USER_TYPE === UserType.APPLICANT
        ? applicant?.twitterProfile
        : socials?.twitterProfile,
    facebookProfile:
      USER_TYPE === UserType.APPLICANT
        ? applicant?.facebookProfile
        : socials?.facebookProfile,
    instagramProfile:
      USER_TYPE === UserType.APPLICANT
        ? applicant?.instagramProfile
        : socials?.instagramProfile,
    githubProfile:
      USER_TYPE === UserType.APPLICANT ? applicant?.githubProfile : "",
  });
  const handleChange = async (e: {
    target: HTMLInputElement | HTMLTextAreaElement;
  }) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    setSocialData({ ...socialData, [name]: value });
    if (USER_TYPE === UserType.APPLICANT) {
      setApplicantData({
        ...applicant,
        [name]: value,
      } as ApplicantData);
    } else {
      setSocials({
        ...socials,
        [name]: value,
      } as Socials);
      setEmployerData({
        ...employer,
        [name]: value,
      } as EmployerData);
    }
  };

  const handleToggleEdit = () => {
    toggleEdit();
  };
  const handleSaveSocials = async () => {
    const response =
      USER_TYPE === UserType.APPLICANT
        ? await updateApplicantSocial(socialData as Socials)
        : await updateSocials(socialData as Socials);
    if (response) {
      setSocialData(response);
      if (USER_TYPE === UserType.APPLICANT) {
        setApplicantData(response as ApplicantData);
      } else {
        setSocials(response);
        setEmployerData({
          ...employer,
          linkedInProfile: response.linkedInProfile,
          twitterProfile: response.twitterProfile,
          facebookProfile: response.facebookProfile,
          instagramProfile: response.instagramProfile,
          githubProfile: response.githubProfile,
        } as EmployerData);
      }
    }
  };
  return (
    <section
      id="work-sample"
      className="relative mt-4 border-t-[2px] border-t-[#E6E6E6] pt-5"
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
          onClick={handleSaveSocials}
          className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1`}
        >
          Save
        </button>
      </div>
      <h3 className="text-gray-700 mb-4 mt-4 font-lato text-[20px]">
        Social and Professional Links
      </h3>
      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-10">
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1 text-[16px]">
            LinkedIn Profile
          </label>
          <input
            name="linkedInProfile"
            value={socialData?.linkedInProfile || ""}
            disabled={!isEditable}
            onChange={handleChange}
            type="url"
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
          />
        </div>
        {USER_TYPE === UserType.EMPLOYER && (
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 text-[16px]">Facebook</label>
            <input
              type="url"
              name="facebookProfile"
              value={socialData?.facebookProfile || ""}
              disabled={!isEditable}
              onChange={handleChange}
              className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
            />
          </div>
        )}
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1 text-[16px]">Twitter</label>
          <input
            type="url"
            name="twitterProfile"
            value={socialData?.twitterProfile || ""}
            disabled={!isEditable}
            onChange={handleChange}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1 text-[16px]">Instagram</label>
          <input
            type="url"
            name="instagramProfile"
            value={socialData?.instagramProfile || ""}
            disabled={!isEditable}
            onChange={handleChange}
            className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
          />
        </div>
        {USER_TYPE === UserType.APPLICANT && (
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 text-[16px]">Github</label>
            <input
              type="url"
              name="githubProfile"
              value={socialData?.githubProfile || ""}
              disabled={!isEditable}
              onChange={handleChange}
              className="w-full rounded-[10px] border-[1px] border-[#E3E6F3] bg-[#F7F8FA] p-3 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
            />
          </div>
        )}
      </div>
    </section>
  );
};
export default SocialsSection;
