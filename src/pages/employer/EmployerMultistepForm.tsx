import React, {useState} from "react";
import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import {motion} from "framer-motion";
import applicantSignupStep1 from "../../assets/icons/applicantSignupStep1.svg";
import applicantSignupStep2 from "../../assets/icons/applicantSignupStep2.svg";
import applicantSignupStep4 from "../../assets/icons/applicantSignupStepFour.svg";
import EmployerSignupStepOne from "../../components/ui/employer/signup/EmployerSignupStepOne.tsx";
import EmployerSignupStepTwo from "../../components/ui/employer/signup/EmployerSignupStepTwo.tsx";
import EmployerSignupStepThree from "../../components/ui/employer/signup/EmployerSignupStepThree.tsx";
import EmployerSignupStepFour from "../../components/ui/employer/signup/EmployerSignupStepFour.tsx";

const EmployerMultistepForm: React.FC = ()=>{
    const [step, setStep] = useState(1);

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);
    return (
        <motion.div
            className="relative flex flex-col md:flex-row justify-center items-center min-h-screen py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Logo */}
            <motion.img
                className="absolute top-5 left-[3%]"
                src={gighubLogo}
                alt="logo"
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            />

            {/* Step Indicator */}
            <div className="absolute top-10 md:top-5 left-1/2 transform -translate-x-1/2 md:left-1/2 md:transform flex flex-col gap-y-2">
                <span className="block text-left mt-2 md:mt-0">{step} of 4</span>
                <div className="flex justify-evenly gap-x-2">
                    {[1, 2, 3, 4].map((stepNumber) => (
                        <div
                            key={stepNumber}
                            className={`w-[41px] h-[9px] rounded-[16px] ${
                                stepNumber <= step ? "bg-[#6438C2]" : "bg-[#F9F9F9]"
                            }`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Left Section - Form */}
            <div className="w-full md:w-1/2 flex justify-center items-center px-5 pt-[100px] md:pt-0 md:pl-32">
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
                        <EmployerSignupStepTwo handleNext={handleNext} handlePrev={handlePrev} />
                    </motion.div>
                )}
                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <EmployerSignupStepThree handleNext={handleNext} handlePrev={handlePrev} />
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
            <div className="hidden md:block w-1/2 pl-40">
                {step === 1 && <motion.img className="h-auto max-h-screen" src={applicantSignupStep1} alt="Step 1" />}
                {step === 2 && <motion.img className="h-auto max-h-screen" src={applicantSignupStep2} alt="Step 2" />}
                {step === 3 && <motion.img className="h-auto max-h-screen" src={applicantSignupStep2} alt="Step 3" />}
                {step === 4 && <motion.img className="h-auto max-h-screen" src={applicantSignupStep4} alt="Step 4" />}
            </div>
        </motion.div>
    );
}

export default EmployerMultistepForm;