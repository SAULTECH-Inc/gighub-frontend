import React, { useState } from "react";
import { motion } from "framer-motion";
import googleLogo from "../../../../assets/icons/googleLogo.svg";
import microsoftLogo from "../../../../assets/icons/microsoftLogo.svg";
import linkedinLogo from "../../../../assets/icons/linkedinLogo.svg";
import { calculatePasswordStrength } from "../../../../utils/helpers.ts";
import { useAuth } from "../../../../store/useAuth.ts";
import { ApplicantSignupRequest } from "../../../../utils/types";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface StepOneProp {
  handleNext: () => void;
}

const ApplicantSignupStepOne: React.FC<StepOneProp> = ({ handleNext }) => {
  const { applicantSignupRequest, setApplicantSignupRequest } = useAuth();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false); // for toggling password visibility
  const [confirmPassword, setConfirmPassword] = useState(""); // for confirm password
  const [passwordMatch, setPasswordMatch] = useState(true); // for password match validation

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === applicantSignupRequest?.password); // validate password match
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplicantSignupRequest({
      ...applicantSignupRequest,
      [name]: value,
    } as ApplicantSignupRequest);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleChange(e);
    const strength = calculatePasswordStrength(e.target.value);
    setPasswordStrength(strength);
  };

  return (
    <motion.div
      className="mx-auto mt-5 w-[85%] px-[10px] md:mt-32 md:mr-28 md:w-[680px] lg:w-[500px] lg:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Form Fields */}
      <motion.div
        className="mx-auto mb-[30px] flex w-full flex-col text-center"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 text-[20px] font-semibold lg:text-[24px]">
          Welcome!
        </h2>
        <p className="text-sm lg:text-[13px]">
          Welcome! Let’s start building your career profile. We’ll ask a few
          quick questions to tailor opportunities just for you.
        </p>
      </motion.div>

      {/* Name Fields */}
      <motion.div
        className="flex w-full flex-col gap-2 md:flex-row"
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-1 flex-col">
          <label className="mb-2 block text-[13px] font-medium text-[#000000]">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={applicantSignupRequest?.firstName}
            onChange={handleChange}
            className="mb-4 h-[45px] w-full rounded-[16px] border-[1px] border-[#E6E6E6] px-5 py-2 focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <label className="mb-2 block text-[13px] font-medium text-[#000000]">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={applicantSignupRequest?.lastName}
            onChange={handleChange}
            className="mb-4 h-[45px] w-full rounded-[16px] border-[1px] border-[#E6E6E6] px-5 py-2 focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
          />
        </div>
      </motion.div>

      <motion.div
        className="flex w-full flex-col gap-2 md:flex-row"
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-1 flex-col">
          <label className="mb-2 block text-[13px] font-medium text-[#000000]">
            Middle Name
          </label>
          <input
            type="text"
            name="middleName"
            value={applicantSignupRequest?.middleName}
            onChange={handleChange}
            className="mb-4 h-[45px] w-full rounded-[16px] border-[1px] border-[#E6E6E6] px-5 py-2 focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <label className="mb-2 block text-[13px] font-medium text-[#000000]">
            Email Address
          </label>
          <input
            type="text"
            name="email"
            value={applicantSignupRequest?.email}
            onChange={handleChange}
            className="mb-4 h-[45px] w-full rounded-[16px] border-[1px] border-[#E6E6E6] px-5 py-2 focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
          />
        </div>
      </motion.div>

      <motion.div
        className="flex w-full flex-col"
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <label className="mb-2 block text-[13px] font-medium text-[#000000]">
          Phone Number
        </label>
        <div className="relative">
          <input
            type="text"
            name="phoneNumber"
            value={applicantSignupRequest?.phoneNumber}
            onChange={handleChange}
            className="mb-4 h-[45px] w-full rounded-[16px] border-[1px] border-[#E6E6E6] px-5 py-2 focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
          />
        </div>
      </motion.div>

      {/* Password Field */}
      <motion.div
        className="flex w-full flex-col"
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <label className="mb-2 block text-[13px] font-medium text-[#000000]">
          Password
        </label>
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            value={applicantSignupRequest?.password}
            onChange={handlePasswordChange}
            className="mb-4 h-[45px] w-full rounded-[16px] border-[1px] border-[#E6E6E6] px-5 py-2 focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-[12px] right-[10px] text-[#6E4AED] focus:outline-none"
          >
            {passwordVisible ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </motion.div>

      {/* Confirm Password Field */}
      <motion.div
        className="flex w-full flex-col"
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <label className="mb-2 block text-[13px] font-medium text-[#000000]">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="mb-4 h-[45px] w-full rounded-[16px] border-[1px] border-[#E6E6E6] px-5 py-2 focus:border-[1px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
          />
          {!passwordMatch && (
            <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
          )}
        </div>
      </motion.div>

      {/* Password Strength Indicator */}
      <motion.div
        className="mt-[2px] mb-[30px]"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-evenly gap-x-2">
          {[1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className={`h-[12px] w-[71px] rounded-[16px] ${
                index <= passwordStrength ? "bg-[#51FF00]" : "bg-[#E6E6E6]"
              }`}
            ></div>
          ))}
        </div>
        <p className="mt-2 text-end text-[12px]">
          {passwordStrength < 3
            ? "Weak"
            : passwordStrength < 5
              ? "Medium"
              : "Strong"}
        </p>
      </motion.div>

      {/* Proceed Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded-[16px] bg-[#6E4AED] py-3 font-[13px] text-white hover:bg-[#5931A9] focus:border-none focus:ring-0 focus:outline-none"
          disabled={!passwordMatch}
        >
          Proceed
        </button>
      </motion.div>

      {/* Sign-in Link */}
      <motion.div
        className="mt-[20px] text-center text-[13px] text-[#737373]"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-[#6E4AEDEE]">
          Sign-in
        </Link>
      </motion.div>

      {/* Social Login Buttons */}
      <motion.div
        className="mx-auto mt-8 mb-4 flex items-center justify-evenly gap-x-2"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex h-[44px] w-[97px] cursor-pointer items-center justify-evenly rounded-[16px] border-[1px] border-[#E6E6E6] p-2">
          <img src={googleLogo} alt="google logo" />
          <p className="ml-[4px] text-center text-[13px]">Google</p>
        </div>
        <div className="flex h-[44px] w-[97px] cursor-pointer items-center justify-evenly rounded-[16px] border-[1px] border-[#E6E6E6] p-2">
          <img src={microsoftLogo} alt="microsoft logo" />
          <p className="ml-[4px] text-center text-[13px]">Microsoft</p>
        </div>
        <div className="flex h-[44px] w-[97px] cursor-pointer items-center justify-evenly rounded-[16px] border-[1px] border-[#E6E6E6] p-2">
          <img src={linkedinLogo} alt="linkedin logo" />
          <p className="ml-[4px] text-center text-[13px]">LinkedIn</p>
        </div>
      </motion.div>

      {/* Terms and Conditions */}
      <motion.div
        className="flex w-full justify-center"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-center text-[16px] text-[#AFAFAF]">
          Signing Up for GigHub means you agree to the{" "}
          <span className="text-[#674EE5EE]">Privacy Policy</span> and{" "}
          <span className="text-[#674EE5EE]">Terms</span> of{" "}
          <span className="text-[#674EE5EE]">Services</span>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ApplicantSignupStepOne;
