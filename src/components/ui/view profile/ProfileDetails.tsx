import React from "react";
import { ASAbubakar } from "../../../assets/images";
import { ApplicantData } from "../../../utils/types";


const ProfileDetails: React.FC<{ person: ApplicantData }> = ({
  person
}) => {
  
  const {
    firstName,
    lastName,
    middleName,
    email,
    phoneNumber,
    professionalTitle,
    city,
    country,
    profilePicture,
    address,
    cv: { skills = [], headline = "" },
  } = person;

  return (
    <div className="flex flex-col items-center text-[#000000]">
      <div className="flex flex-col items-center py-[22px] w-[100%] max-w-[328px] bg-white rounded-[16px]">
        <div className="w-[90%]">
          <div className="relative flex flex-col h-[94px]">
            <div className="w-full h-[64px] bg-gradient-to-r from-[#6438C2] via-[#6438C2] to-white via-50% rounded-tr-[16px] rounded-tl-[16px]"></div>
            <img
              src={profilePicture || ASAbubakar}
              alt="ASAbubakar"
              className="absolute w-[60px] h-[60px] bottom-0 left-5"
            />
          </div>
          <div>
            <p className="font-bold text-20px]">
              {lastName ? lastName[0]: ""}.{middleName ? middleName[0] : ""} {firstName}
            </p>
          </div>
          <div className="flex flex-col gap-2 my-4">
            <p className="font-bold">{professionalTitle}</p>
            <p className="text-[#8E8E8E]">
              {city}, {country} . {300}k Connections
            </p>
          </div>
          <hr className="border-[#E6E6E6]" />
          <div className="flex flex-col gap-2 my-4">
            <p className="font-medium">Email Address</p>
            <p className="text-[#8E8E8E] text-[13px]">{email}</p>
          </div>
          <hr className="border-[#E6E6E6]" />
          <div className="flex flex-col gap-2 my-4">
            <p className="font-medium">Home Address</p>
            <p className="text-[#8E8E8E] text-[13px]">{address}</p>
          </div>
          <hr className="border-[#E6E6E6]" />
          <div className="flex flex-col gap-2 my-4">
            <p className="font-bold">Phone number</p>
            <p className="text-[#8E8E8E] text-[13px]">{phoneNumber}</p>
          </div>
          <hr className="border-[#E6E6E6]" />
          <div className="flex flex-col gap-2 my-4">
            <p>Portfolio website</p>
            <p className="text-[#6438C2] text-[13px]">{"provide portfolio"}</p>
          </div>
          <hr className="border-[#E6E6E6]" />
          <div className="flex flex-col gap-2 my-4">
            <p className="font-medium">About me</p>
            <p className="text-[#8E8E8E] text-[13px]">{headline}</p>
          </div>
          <hr className="border-[#E6E6E6]" />
          <div className="flex flex-col gap-2 my-4">
            <p className="font-medium">Software Skills</p>
            <div className="text-[#8E8E8E] flex flex-wrap">
              {skills.length > 0
                ? skills
                    .map((skil) => `${skil.skill} (${skil.yearsOfExperience} yrs)`)
                    .join(", ")
                : "No skills available"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
