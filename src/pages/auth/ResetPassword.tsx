import React, {useEffect, useState} from "react";
import {useAuth} from "../../store/useAuth.ts";
import {Link, useNavigate} from "react-router-dom";
import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import loginRight from "../../assets/icons/loginRight.png";
import {motion} from "framer-motion";
import {calculatePasswordStrength} from "../../utils/helpers.ts";
import passwordResetIcon from "../../assets/icons/passwordResetIcon.svg";
import {PasswordResetRequest} from "../../utils/types";
import {toast} from "react-toastify";

const ResetPassword: React.FC = () => {
    const {passwordResetRequest, setPasswordResetRequest, email, resetPassword} = useAuth();
    const navigate = useNavigate();
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);

    useEffect(() => {
        if(passwordResetRequest?.confirmPassword) {
            setPasswordMatch(passwordResetRequest?.confirmPassword === passwordResetRequest?.password);
        }
    },[passwordResetRequest])


    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordResetRequest({
            ...passwordResetRequest,
            confirmPassword: e.target.value,
            email: email as string,
        });
    };
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setPasswordResetRequest({
            ...passwordResetRequest,
            [name]: value,
            email: email as string,
        });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleChange(e);
        const strength = calculatePasswordStrength(e.target.value);
        setPasswordStrength(strength);
    };
    const handleResetPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const success = await resetPassword(passwordResetRequest as PasswordResetRequest);
        if(success) {
            toast.success("Password reset successfully!");
            navigate('/password-reset-success');
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
                        <img className="h-10 w-10 mx-auto" src={passwordResetIcon} alt="right"/>
                        <div className="mx-auto mb-5 text-center">
                            <h1 className="text-[20px] sm:text-[25px] md:text-[32px]">Set new password</h1>
                            <p className="text-[12px] sm:text-[13px] md:text-[16px] text-[#AFAFAF]">Must be atleast 8
                                characters</p>
                        </div>
                        <div>
                            <div className="gap-y-3 flex flex-col mb-2">
                                <label className="text-[#8E8E8E] text-[13px] font-medium">New Password</label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        onChange={handlePasswordChange}
                                        name="password"
                                        className="border-[#E6E6E6] text-[16px] border p-3 md:p-3 w-full rounded-[16px] focus:ring-0 focus:border-[#E6E6E6] focus:outline-none"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute top-[12px] right-[10px] text-[#6E4AED] focus:outline-none"
                                    >
                                        {passwordVisible ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {/* Password Strength Indicator */}
                                <motion.div
                                    className="mt-0 mb-[10px]"
                                    initial={{y: 50}}
                                    animate={{y: 0}}
                                    transition={{duration: 0.5}}
                                >
                                    <div className="flex justify-evenly gap-x-2">
                                        {[1, 2, 3, 4, 5].map((index) => (
                                            <div
                                                key={index}
                                                className={`w-[71px] h-[12px] rounded-[16px] ${
                                                    index <= passwordStrength ? "bg-[#51FF00]" : "bg-[#E6E6E6]"
                                                }`}
                                            ></div>
                                        ))}
                                    </div>
                                    <p className="text-[12px] text-end mt-2">
                                        {passwordStrength < 3 ? "Weak" : passwordStrength < 5 ? "Medium" : "Strong"}
                                    </p>
                                </motion.div>
                            </div>

                            <div className="gap-y-3 flex flex-col mb-10">
                                <label className="text-[#8E8E8E] text-[13px] font-medium">Confirm Password</label>
                                <input
                                    onChange={handleConfirmPasswordChange}
                                    className="border-[#E6E6E6] text-[16px] border p-3 md:p-3 w-full rounded-[16px] focus:ring-0 focus:border-[#E6E6E6] focus:outline-none"
                                    type="password" required/>
                                {!passwordMatch && (
                                    <span className="text-red-500 text-xs mt-1">Passwords do not match</span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleResetPassword}
                            type="button"
                            className="w-full bg-[#6438C2] text-white hover:bg-[#542F9E] py-3 md:py-4 md:px-4 rounded-[16px] mb-5">Reset
                            Password
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
}

export default ResetPassword;