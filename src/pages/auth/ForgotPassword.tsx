import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import {Link, useNavigate} from "react-router-dom";
import loginRight from "../../assets/icons/loginRight.png";
import React from "react";
import {useAuth} from "../../store/useAuth.ts";

const ForgotPassword: React.FC = ()=>{
    const {setEmail,email, sendVerificationOtp} = useAuth();
    const navigate = useNavigate();
    let inputComplete = true
    const handleValidateEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if(!inputComplete) {
            return
        }
        const success = await sendVerificationOtp(email as string, "RESET_PASSWORD");
        if(success) {
            navigate('/verify-otp-to-reset-password');
        }
    }
    return (
        <>
            <form
                className="relative h-screen flex flex-row justify-evenly space-x-0 items-center mx-auto my-auto">
                <img className="absolute left-5 top-5 h-30 w-30 mx-auto" src={gighubLogo} alt="right"/>
                <div
                    className="relative flex flex-col gap-y-6 justify-center items-center w-full px-5 md:px-10 lg:w-1/2  xl:w-1/3 h-[890px]">
                    <Link to="/user-type-selection" className="absolute top-2 right-5 text-[#6438C2]">Create an Account</Link>
                    <div className="flex flex-col w-full gap-y-2">
                        <img className="h-40 w-40 mx-auto" src={gighubLogo} alt="right"/>
                        <div className="mx-auto mb-5 text-center">
                            <h1 className="text-[20px] sm:text-[25px] md:text-[32px]">Forgot Password?</h1>
                            <p className="text-[12px] sm:text-[13px] md:text-[16px] text-[#AFAFAF]">No worries, we will
                                send you reset instruction</p>
                        </div>
                        <div className="gap-y-3 flex flex-col mb-10">
                            <label className="text-[#8E8E8E] text-[13px] font-medium">Email</label>
                            <input
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    inputComplete = !!e.target.value;
                                }}
                                className="border-[#E6E6E6] border p-3 md:p-3 w-full rounded-[16px] focus:ring-0 focus:border-[#E6E6E6] focus:outline-none"
                                type="email" required/>
                        </div>
                        <button
                            onClick={handleValidateEmail}
                            type="button"
                            className="w-full bg-[#6438C2] text-white hover:bg-[#542F9E] py-3 md:py-4 md:px-4 rounded-[16px] mb-5">Send
                            Reset Instructions
                        </button>
                        <Link to="/login"
                              className="w-full text-center text-[#8E8E8E] hover:bg-white py-3 md:py-4 md:px-4 rounded-[16px]">←
                            Back to sign-in</Link>
                    </div>
                </div>
                <img className="hidden lg:flex h-[890px]" src={loginRight} alt="right"/>
            </form>
        </>
    );
};

export default ForgotPassword;
