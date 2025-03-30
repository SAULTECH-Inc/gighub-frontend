import React from "react";
import { ASAbubakar } from "../../../assets/images";
import { ApplicantData } from "../../../utils/types";

const ProfileDetails: React.FC<{ person: ApplicantData }> = ({ person }) => {
  return (
    <div className="flex w-full flex-col items-center text-[#000000]">
      <div className="flex w-[100%] max-w-[328px] flex-col items-center rounded-[16px] bg-white py-[22px]">
        <div className="w-[90%]">
          <div className="relative flex h-[94px] flex-col">
            <div className="h-[64px] w-full rounded-tl-[16px] rounded-tr-[16px] bg-gradient-to-r from-[#6438C2] via-[#6438C2] via-50% to-white"></div>
            <img
              src={person.profilePicture || ASAbubakar}
              alt="ASAbubakar"
              className="absolute bottom-0 left-5 h-[60px] w-[60px]"
            />
          </div>
          <div>
            <p className="text-20px] font-bold">
              {person.lastName ? person.lastName[0] : ""}.
              {person.middleName ? person.middleName[0] : ""} {person.firstName}
            </p>
          </div>
          <div className="my-4 flex flex-col gap-2">
            <p className="font-bold">{person?.professionalTitle}</p>
            <p className="text-[13px] text-[#8E8E8E]">
              {person.city && person.city}
              {person.city && person.country && ", "}
              {person.country && person.country}
              {(person.city || person.country) && " . "}
              {400}k Connections
            </p>
          </div>
          <hr className="border-[#E6E6E6]" />
          <div className="my-4 flex flex-col gap-2">
            <p className="font-medium">Email Address</p>
            <p className="text-[13px] text-[#8E8E8E]">{person.email}</p>
          </div>
          <hr className="border-[#E6E6E6]" />
          <div className="my-4 flex flex-col gap-2">
            <p className="font-medium">Home Address</p>
            <p className="text-[13px] text-[#8E8E8E]">{person.address}</p>
          </div>
          <hr className="border-[#E6E6E6]" />
          <div className="my-4 flex flex-col gap-2">
            <p className="font-bold">Phone number</p>
            <p className="text-[13px] text-[#8E8E8E]">{person.phoneNumber}</p>
          </div>
          <hr className="border-[#E6E6E6]" />
          <div className="my-4 flex flex-col gap-2">
            <p>Portfolio website</p>
            <p className="text-[13px] text-[#6438C2]">{"provide portfolio"}</p>
          </div>
          <hr className="border-[#E6E6E6]" />
          <div className="my-4 flex flex-col gap-2">
            <p className="font-medium">About me</p>
            <p className="text-[13px] text-[#8E8E8E]">{person.cv?.headline}</p>
          </div>
          <hr className="border-[#E6E6E6]" />
          <div className="my-4 flex flex-col gap-2">
            <p className="font-medium">Software Skills</p>
            {/* <div className="flex flex-wrap text-[#8E8E8E]">
              {person.cv?.skills.length > 0
                ? person.cv?.skills
                    .map(
                      (skil) =>
                        `${skil?.skill} (${skil.yearsOfExperience} yrs)`,
                    )
                    .join(", ")
                : "No skills available"}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
