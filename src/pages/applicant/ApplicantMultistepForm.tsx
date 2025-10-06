import React, { useState } from "react";
import { motion } from "framer-motion";
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

  const getStepImage = () => {
    switch (step) {
      case 1:
        return applicantSignupStep1;
      case 2:
        return applicantSignupStep2;
      case 3:
        return applicantSignupStep2;
      default:
        return applicantSignupStep1;
    }
  };

  return (
    <motion.div
      className="flex min-h-screen flex-col bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Logo and Progress */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.img
              className="h-8 w-auto sm:h-10"
              src={gighubLogo}
              alt="GigHub Logo"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Step Indicator */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Step {step} of 3
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      stepNumber <= step
                        ? "w-8 bg-[#6438C2] sm:w-10"
                        : "w-6 bg-gray-200 sm:w-8"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Spacer for alignment */}
            <div className="w-8 sm:w-10" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="grid min-h-[calc(100vh-120px)] items-center justify-items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            {/* Form Section */}
            <div className="flex w-full max-w-md items-center justify-center">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {step === 1 && (
                  <ApplicantSignupStepOne handleNext={handleNext} />
                )}
                {step === 2 && (
                  <ApplicantSignupStepTwo
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                  />
                )}
                {step === 3 && (
                  <ApplicantSignupStepThree handlePrev={handlePrev} />
                )}
              </motion.div>
            </div>

            {/* Image Section */}
            <div className="hidden w-full items-center justify-center lg:flex">
              <motion.img
                key={step}
                className="h-auto max-h-[600px] max-w-full object-contain xl:max-h-[800px]"
                src={getStepImage()}
                alt={`Step ${step} illustration`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default ApplicantMultistepForm;
