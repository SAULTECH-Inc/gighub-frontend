import React from "react";
import gighubLogo from "../assets/icons/gighubLogoSmall.svg";
import jobSeekerUser from "../assets/icons/jobSeekerUser.svg";
import employerUser from "../assets/icons/employerUser.svg";
import userSelection from "../assets/icons/userSelectionLeftSide.svg";

const ApplicantMultistepForm: React.FC = ()=>{


    return (
        <div className="flex justify-around items-center py-2 gap-x-0">
            {/* Left Section */}
            <div className="w-1/2 flex flex-col items-start">
                <div className="w-full flex justify-start">
                    <img src={gighubLogo} alt="logo"/>
                </div>
                <div className="w-full h-[824px] flex flex-col justify-evenly mx-auto">
                    <div className="w-full text-center">
                        <h1 className="text-[24px] font-bold text-gray-600">How are You Planning To Use Gighub</h1>
                        <p className="text-[13px] text-gray-600">We will streamline your setup experience
                            accordingly</p>
                    </div>
                    <div className="w-full flex justify-center gap-x-8">
                        <div
                            className="cursor-pointer w-[137px] h-[145px] flex flex-col items-center justify-evenly border-[1px] border-[#E6E6E6] rounded-[16px]">
                            <img className="mx-auto" src={jobSeekerUser} alt="job seeker"/>
                            <p>As a Job Seeker</p>
                        </div>
                        <div
                            className="cursor-pointer w-[137px] h-[145px] flex flex-col items-center justify-evenly border-[1px] border-[#E6E6E6] rounded-[16px]">
                            <img className="mx-auto" src={employerUser} alt="employer"/>
                            <p>As an Employer</p>
                        </div>
                    </div>
                    <div className="w-full flex justify-end text-right space-x-4">
                        <button
                            className="w-[131px] h-[43px] border-[1px] border-[#E6E6E6] bg-white text-black font-semibold text-[16px] rounded-[10px]">Back
                        </button>
                        <button
                            className="w-[131px] h-[43px] bg-[#6438C2] text-white font-semibold text-[16px] rounded-[10px]">Proceed
                        </button>
                    </div>
                </div>
            </div>
            {/* Right Section */}
            <img className="h-auto max-h-screen" src={userSelection} alt="user type selection right side"/>
        </div>
    );
}

export default ApplicantMultistepForm;