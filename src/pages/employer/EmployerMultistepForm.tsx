import React, { useEffect, useState } from "react";
import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import { motion } from "framer-motion";
import applicantSignupStep1 from "../../assets/icons/applicantSignupStep1.png";
import applicantSignupStep2 from "../../assets/icons/applicantSignupStep2.svg";
import applicantSignupStep4 from "../../assets/icons/applicantSignupStepFour.svg";
import EmployerSignupStepOne from "../../components/ui/employer/signup/EmployerSignupStepOne.tsx";
import EmployerSignupStepTwo from "../../components/ui/employer/signup/EmployerSignupStepTwo.tsx";
import EmployerSignupStepThree from "../../components/ui/employer/signup/EmployerSignupStepThree.tsx";
import EmployerSignupStepFour from "../../components/ui/employer/signup/EmployerSignupStepFour.tsx";
import { useAuth } from "../../store/useAuth.ts";
import { useNavigate } from "react-router-dom";
import { UserType } from "../../utils/enums.ts";

const EmployerMultistepForm: React.FC = () => {
  const [step, setStep] = useState(1);

  const { isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated && userType === UserType.EMPLOYER) {
      navigate(`/employer/profile`, { replace: true });
    }
  }, [isAuthenticated, navigate, userType]);
  const handleNext = () => {
    setStep(step + 1);
  };
  const handlePrev = () => setStep(step - 1);
  return (
    <motion.form
      className="relative mx-auto my-auto flex h-screen w-full flex-col items-center justify-center py-2 md:flex-row lg:gap-x-[10%] xl:gap-x-[1%]"
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
        <span className="mt-2 block text-center md:text-left md:mt-0">{step} of 4</span>
        <div className="flex justify-evenly gap-x-2">
          {[1, 2, 3, 4].map((stepNumber) => (
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
            <EmployerSignupStepOne handleNext={handleNext} />
          </motion.div>
        )}
        {/* Step 2: Education and Work Experience */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <EmployerSignupStepTwo
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
            <EmployerSignupStepThree
              handleNext={handleNext}
              handlePrev={handlePrev}
            />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <EmployerSignupStepFour handlePrev={handlePrev} />
          </motion.div>
        )}
      </div>

      {/* Right Section - Image */}
      {/*<div className="hidden lg:block w-1/2 pl-40">*/}
      {step === 1 && (
        <motion.img
          className="hidden h-[890px] lg:flex"
          src={applicantSignupStep1}
          alt="Step 1"
        />
      )}
      {step === 2 && (
        <motion.img
          className="hidden h-[890px] lg:flex"
          src={applicantSignupStep2}
          alt="Step 2"
        />
      )}
      {step === 3 && (
        <motion.img
          className="hidden h-[890px] lg:flex"
          src={applicantSignupStep2}
          alt="Step 3"
        />
      )}
      {step === 4 && (
        <motion.img
          className="hidden h-[890px] lg:flex"
          src={applicantSignupStep4}
          alt="Step 4"
        />
      )}
      {/*</div>*/}
    </motion.form>
  );
};

export default EmployerMultistepForm;
