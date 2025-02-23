import React from "react";
import {Link} from "react-router-dom";
import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import loginRight from "../../assets/icons/loginRight.png";
import passwordResetIcon from "../../assets/icons/passwordResetIcon.svg";

const PasswordResetSuccess: React.FC = ()=>{

    return (
        <>
            <form
                className="relative h-screen flex flex-row justify-evenly space-x-0 items-center mx-auto my-auto">
                <img className="absolute left-5 top-5 h-30 w-30 mx-auto" src={gighubLogo} alt="right"/>

                <div
                    className="relative flex flex-col gap-y-6 justify-center items-center w-full px-5 md:px-10 lg:w-1/2  xl:w-1/3 h-[890px]">
                    <Link to="/user-type-selection" className="absolute top-2 right-5 text-[#6438C2]">Create an Account</Link>
                    <div className="flex flex-col w-full gap-y-5">
                        <img className="h-10 w-10 mx-auto" src={passwordResetIcon} alt="right"/>
                        <div className="mx-auto mb-5 text-center">
                            <h1 className="text-[20px] sm:text-[25px] md:text-[32px]">Well Done</h1>
                            <p className="text-[12px] sm:text-[13px] md:text-[16px] text-[#AFAFAF]">Your Password has been reset</p>
                        </div>
                        <Link
                            to="/login"
                            className="w-full bg-[#6438C2] text-white text-center hover:bg-[#542F9E] py-3 md:py-4 md:px-4 rounded-[16px] mb-5">Try Login now
                        </Link>
                    </div>
                </div>
                <img className="hidden lg:flex h-[890px]" src={loginRight} alt="right"/>
            </form>
        </>
    );
}

export default PasswordResetSuccess;