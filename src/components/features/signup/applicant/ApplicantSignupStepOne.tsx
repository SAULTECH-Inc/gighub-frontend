import React, { useState } from "react";
import { motion } from "framer-motion";
import googleLogo from "../../../../assets/icons/googleLogo.svg";
import microsoftLogo from "../../../../assets/icons/microsoftLogo.svg";
import linkedinLogo from "../../../../assets/icons/linkedinLogo.svg";
import { calculatePasswordStrength } from "../../../../utils/helpers.ts";
import {useFormStore} from "../../../../store/useFormStore.ts";

interface StepOneProp {
    handleNext: () => void;
}

const ApplicantSignupStepOne: React.FC<StepOneProp> = ({handleNext }) => {
    const { applicant, setApplicantData } = useFormStore();
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordVisible, setPasswordVisible] = useState(false); // for toggling password visibility
    const [confirmPassword, setConfirmPassword] = useState(""); // for confirm password
    const [passwordMatch, setPasswordMatch] = useState(true); // for password match validation


    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setPasswordMatch(e.target.value === applicant.password); // validate password match
    };
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setApplicantData({
            ...applicant,
            [name]: value,
        });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleChange(e);
        const strength = calculatePasswordStrength(e.target.value);
        setPasswordStrength(strength);
    };





    return (
        <motion.div
            className="w-[310px] md:w-[680px] lg:w-[500px] mt-5 md:mr-28 md:mt-32 px-[10px] lg:px-0"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
        >
            {/* Form Fields */}
            <motion.div
                className="w-full mx-auto flex flex-col text-center mb-[30px]"
                initial={{y: -50}}
                animate={{y: 0}}
                transition={{duration: 0.5}}
            >
                <h2 className="text-[20px] lg:text-[24px] font-semibold mb-4">Welcome!</h2>
                <p className="text-sm lg:text-[13px]">
                    Welcome! Let’s start building your career profile. We’ll ask a few quick questions to tailor
                    opportunities just for you.
                </p>
            </motion.div>

            {/* Name Fields */}
            <motion.div
                className="w-full flex flex-col md:flex-row gap-2"
                initial={{x: -50}}
                animate={{x: 0}}
                transition={{duration: 0.5}}
            >
                <div className="flex flex-col flex-1">
                    <label className="block text-[#000000] text-[13px] font-medium mb-2">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={applicant.firstName}
                        onChange={handleChange}
                        className="w-full py-2 px-5 mb-4 rounded-[16px] h-[45px] border-[1px] border-[#E6E6E6] focus:ring-0 focus:outline-none focus:border-[1px] focus:border-[#E6E6E6]"
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <label className="block text-[#000000] text-[13px] font-medium mb-2">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={applicant.lastName}
                        onChange={handleChange}
                        className="w-full py-2 px-5 mb-4 border-[1px] border-[#E6E6E6] focus:ring-0 focus:outline-none focus:border-[1px] focus:border-[#E6E6E6] rounded-[16px] h-[45px]"
                    />
                </div>
            </motion.div>

            <motion.div
                className="w-full flex flex-col md:flex-row gap-2"
                initial={{x: -50}}
                animate={{x: 0}}
                transition={{duration: 0.5}}
            >
                <div className="flex flex-col flex-1">
                    <label className="block text-[#000000] text-[13px] font-medium mb-2">Middle Name</label>
                    <input
                        type="text"
                        name="middleName"
                        value={applicant.middleName}
                        onChange={handleChange}
                        className="w-full py-2 px-5 mb-4 border-[1px] border-[#E6E6E6] focus:ring-0 focus:outline-none focus:border-[1px] focus:border-[#E6E6E6] rounded-[16px] h-[45px]"
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <label className="block text-[#000000] text-[13px] font-medium mb-2">Email Address</label>
                    <input
                        type="text"
                        name="email"
                        value={applicant.email}
                        onChange={handleChange}
                        className="w-full py-2 px-5 mb-4 border-[1px] border-[#E6E6E6] focus:ring-0 focus:outline-none focus:border-[1px] focus:border-[#E6E6E6] rounded-[16px] h-[45px]"
                    />
                </div>
            </motion.div>

            <motion.div
                className="w-full flex flex-col"
                initial={{x: -50}}
                animate={{x: 0}}
                transition={{duration: 0.5}}
            >
                <label className="block text-[#000000] text-[13px] font-medium mb-2">Phone Number</label>
                <div className="relative">
                    <input
                        type="text"
                        name="phoneNumber"
                        value={applicant.phoneNumber}
                        onChange={handleChange}
                        className="w-full py-2 px-5 mb-4 border-[1px] border-[#E6E6E6] focus:ring-0 focus:outline-none focus:border-[1px] focus:border-[#E6E6E6] rounded-[16px] h-[45px]"
                    />
                </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
                className="w-full flex flex-col"
                initial={{x: -50}}
                animate={{x: 0}}
                transition={{duration: 0.5}}
            >
                <label className="block text-[#000000] text-[13px] font-medium mb-2">Password</label>
                <div className="relative">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        value={applicant.password}
                        onChange={handlePasswordChange}
                        className="w-full py-2 px-5 mb-4 border-[1px] border-[#E6E6E6] focus:ring-0 focus:outline-none focus:border-[1px] focus:border-[#E6E6E6] rounded-[16px] h-[45px]"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute top-[12px] right-[10px] text-[#6E4AED] focus:outline-none"
                    >
                        {passwordVisible ? "Hide" : "Show"}
                    </button>
                </div>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div
                className="w-full flex flex-col"
                initial={{x: -50}}
                animate={{x: 0}}
                transition={{duration: 0.5}}
            >
                <label className="block text-[#000000] text-[13px] font-medium mb-2">Confirm Password</label>
                <div className="relative">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="w-full py-2 px-5 mb-4 border-[1px] border-[#E6E6E6] focus:ring-0 focus:outline-none focus:border-[1px] focus:border-[#E6E6E6] rounded-[16px] h-[45px]"
                    />
                    {!passwordMatch && (
                        <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                    )}
                </div>
            </motion.div>

            {/* Password Strength Indicator */}
            <motion.div
                className="mt-[2px] mb-[30px]"
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

            {/* Proceed Button */}
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5}}
            >
                <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-3 text-white font-[13px] rounded-[16px] bg-[#6E4AED] hover:bg-[#5931A9] focus:outline-none focus:ring-0 focus:border-none"
                    disabled={!passwordMatch}
                >
                    Proceed
                </button>
            </motion.div>

            {/* Sign-in Link */}
            <motion.div
                className="mt-[20px] text-[13px] text-center text-[#737373]"
                initial={{y: 50}}
                animate={{y: 0}}
                transition={{duration: 0.5}}
            >
                Already have an account? <span className="font-bold text-[#6E4AEDEE]">Sign-in</span>
            </motion.div>

            {/* Social Login Buttons */}
            <motion.div
                className="flex justify-evenly items-center mx-auto mt-8 mb-4 gap-x-2"
                initial={{y: 50}}
                animate={{y: 0}}
                transition={{duration: 0.5}}
            >
                <div
                    className="p-2 flex justify-evenly items-center cursor-pointer border-[1px] border-[#E6E6E6] rounded-[16px] w-[97px] h-[44px]">
                    <img src={googleLogo} alt="google logo"/>
                    <p className="ml-[4px] text-[13px] text-center">Google</p>
                </div>
                <div
                    className="p-2 flex justify-evenly items-center cursor-pointer border-[1px] border-[#E6E6E6] rounded-[16px] w-[97px] h-[44px]">
                    <img src={microsoftLogo} alt="microsoft logo"/>
                    <p className="ml-[4px] text-[13px] text-center">Microsoft</p>
                </div>
                <div
                    className="p-2 flex justify-evenly items-center cursor-pointer border-[1px] border-[#E6E6E6] rounded-[16px] w-[97px] h-[44px]">
                    <img src={linkedinLogo} alt="linkedin logo"/>
                    <p className="ml-[4px] text-[13px] text-center">LinkedIn</p>
                </div>
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div
                className="w-full flex justify-center"
                initial={{y: 50}}
                animate={{y: 0}}
                transition={{duration: 0.5}}
            >
                <p className="text-center text-[16px] text-[#AFAFAF]">
                    Signing Up for GigHub means you agree to the <span
                    className="text-[#674EE5EE]">Privacy Policy</span> and <span
                    className="text-[#674EE5EE]">Terms</span> of <span className="text-[#674EE5EE]">Services</span>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default ApplicantSignupStepOne;
