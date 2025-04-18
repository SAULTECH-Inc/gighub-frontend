import React from "react";
import linkedin from "../../assets/icons/linkedin-round.svg";
import twitter from "../../assets/icons/twitter-rounded.svg";
import chatIcon from "../../assets/icons/chat-icon.svg";
import {ApplicantData} from "../../utils/types";

interface NetworkCardProps {
    userDetails: ApplicantData;
}
const UserCard: React.FC<NetworkCardProps> = ({
                                                  userDetails
                                              })=>{
    return <>
        <div
            className="w-full sm:w-[45%] md:w-full mdl:w-[45%] lg:w-[310px] h-[440px] rounded-[16px] border-[1px] p-[18px] border-[#E6E6E6] space-y-4">
            <div className="w-[60px] h-[60px] rounded-full bg-[#D9D9D9] "></div>
            <div className="flex flex-col">
                <h3 className="text-[20px] text-[#000000] font-semibold">{userDetails?.firstName} {userDetails?.lastName}</h3>
                <p>{userDetails?.city}, {userDetails?.city}</p>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex gap-x-2">
                    <div
                        className=" cursor-pointer w-[50px] h-[50px] rounded-full flex justify-center items-center border-[#E6E6E6] border-[1px]">
                        <img src={linkedin} alt="linkedin-icon"/>
                    </div>
                    <div
                        className="cursor-pointer w-[50px] h-[50px] rounded-full flex justify-center items-center border-[#E6E6E6] border-[1px]">
                        <img src={twitter} alt="twitter icon"/>
                    </div>
                </div>
                <div>
                    <div
                        className="cursor-pointer bg-[#6438C2] w-[60px] h-[60px] rounded-full flex justify-center items-center border-[#E6E6E6] border-[1px]">
                        <img src={chatIcon} alt="chat icon"/>
                    </div>
                </div>
            </div>
            <hr className="w-full border-[#AFAFAF] border-[1px]"/>
            <div className="flex justify-between items-center font-bold text-[#6438C2] text-[16px]">
                <p>Product Designer</p>
                <p>Senior level</p>
            </div>
            <div className="flex justify-between items-center font-bold text-[#6438C2] text-[16px]">
                <p className="w-[50%] font-medium text-[#8E8E8E]">
                    500 mutual friends
                </p>
                <div
                    className="border border-[#E6E6E6] rounded-[10px] py-[6px] px-[16px] md:py-[4px] md:px-[10px] lg:py-[6px] lg:px-[16px]">
                    <button className="font-medium text-[#000000] text-[16px] md:text-[14px] lg:text-[16px]">
                        View Profile
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 self-center font-bold">
                <button className="rounded-[10px] bg-[#E6E6E6] px-10 py-[6px] text-[#000000]">
                    Block
                </button>
                <button className="rounded-[10px] bg-[#6438C2] px-10 py-[7px] text-[#FFFFFF]">
                    Connect
                </button>
            </div>

        </div>
    </>
}


export default UserCard;
