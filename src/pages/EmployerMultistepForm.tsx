import React from "react";
import gighubLogo from "../assets/icons/gighubLogoSmall.svg";
import employerSignupStep1 from "../assets/icons/employerSignupStep1.svg";

const EmployerMultistepForm: React.FC = ()=>{


    return (
        <div className="relative flex justify-around items-center py-2 gap-x-0">
            <img className="absolute top-5 left-8" src={gighubLogo} alt="logo"/>
            <div className="absolute top-5 right-0 left-0 w-full flex flex-col items-baseline gap-y-2 border-2">
                <span className="block border-2 ">1 of 6</span>
                <div className="flex justify-evenly gap-x-2">
                    <div className="w-[41px] h-[9px] bg-[#6438C2] rounded-[16px]"></div>
                    <div className="w-[41px] h-[9px] bg-[#F9F9F9] rounded-[16px]"></div>
                    <div className="w-[41px] h-[9px] bg-[#F9F9F9] rounded-[16px]"></div>
                    <div className="w-[41px] h-[9px] bg-[#F9F9F9] rounded-[16px]"></div>
                    <div className="w-[41px] h-[9px] bg-[#F9F9F9] rounded-[16px]"></div>
                    <div className="w-[41px] h-[9px] bg-[#F9F9F9] rounded-[16px]"></div>
                </div>
            </div>
            {/* Left Section */}
            <div className="w-1/2 flex flex-col items-start">

            </div>
            {/* Right Section */}
            <img className="h-auto max-h-screen" src={employerSignupStep1} alt="user type selection right side"/>
        </div>
    );
}

export default EmployerMultistepForm;