import React, { useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import applicantSignupStep1 from "../../assets/icons/applicantSignup1.svg";
import applicantSignupStep2 from "../../assets/icons/applicantSignup2.svg";
import ApplicantSignupStepOne from "../../components/features/signup/applicant/ApplicantSignupStepOne.tsx";
import ApplicantSignupStepTwo from "../../components/features/signup/applicant/ApplicantSignupStepTwo.tsx";
import ApplicantSignupStepThree from "../../components/features/signup/applicant/ApplicantSignupStepThree.tsx";

const ApplicantMultistepForm: React.FC = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  return (
    <motion.div
      className="relative flex min-h-screen flex-col items-center justify-center py-2 md:flex-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <motion.img
        className="absolute left-[3%] top-5"
        src={gighubLogo}
        alt="logo"
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Step Indicator */}
      <div className="absolute left-1/2 top-10 flex -translate-x-1/2 transform flex-col gap-y-2 md:left-1/2 md:top-5 md:transform">
        <span className="block text-left mt-4">{step} of 3</span>
        <div className="flex justify-evenly gap-x-2">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`h-[9px] w-[41px] rounded-[16px] ${
                stepNumber <= step ? "bg-[#6438C2]" : "bg-[#F9F9F9]"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Left Section - Form */}
      <div className="flex w-full items-center justify-center px-5 pt-[100px] md:w-1/2 md:pl-32 md:pt-0">
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ApplicantSignupStepOne handleNext={handleNext} />
          </motion.div>
        )}
        {/* Step 2: Education and Work Experience */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ApplicantSignupStepTwo
              handleNext={handleNext}
              handlePrev={handlePrev}
            />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ApplicantSignupStepThree handlePrev={handlePrev} />
          </motion.div>
        )}
      </div>

      {/* Right Section - Image */}
      <div className="hidden w-1/2 pl-40 lg:block">
        {step === 1 && (
          <motion.img
            className="h-auto max-h-screen"
            src={applicantSignupStep1}
            alt="Step 1"
          />
        )}
        {step === 2 && (
          <motion.img
            className="h-auto max-h-screen"
            src={applicantSignupStep2}
            alt="Step 2"
          />
        )}
        {step === 3 && (
          <motion.img
            className="h-auto max-h-screen"
            src={applicantSignupStep2}
            alt="Step 3"
          />
        )}
      </div>
    </motion.div>
  );
};

export default ApplicantMultistepForm;
