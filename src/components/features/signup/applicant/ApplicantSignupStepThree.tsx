import React, {useRef, useState} from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import {useFormStore} from "../../../../store/useFormStore.ts";
import code from "../../../../assets/icons/code.svg";
import { FaArrowLeftLong } from "react-icons/fa6";
import ApplicantSignupSuccessModal from "../../../ui/ApplicantSignupSuccessModal.tsx";
import useModalStore from "../../../../store/modalStateStores.ts";
import {useOtp} from "../../../../hooks/useOtpVerify.ts";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../../store/useAuth.ts";
import { UserType } from "../../../../utils/enums.ts";

interface StepTwoProp {
    handlePrev: () => void;
}

const ApplicantSignupStepThree: React.FC<StepTwoProp> = ({
                                                             handlePrev
                                                         }) => {
    const {applicant, setApplicantData, resetFormData} = useFormStore();
    const { openModal,isModalOpen } = useModalStore();
    const {signup} = useAuth();
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { verifyOtp,sendOtp } = useOtp();
    const [isInvalid, setIsInvalid] = useState(false);
    const shakeAnimation = isInvalid
        ? { x: [-5, 5, -5, 5, 0] }  // Shake effect, ends smoothly at 0
        : { x: 0 }; // Normal state

    const navigate = useNavigate();

    const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedOTP = [...applicant.otp];
        updatedOTP[index] = e.target.value;
        setApplicantData({
            ...applicant,
            ['otp']: updatedOTP.join(''),
        });

        if (e.target.value && index < otpRefs.current.length - 1) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !applicant.otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        console.log(index)
        const pastedText = e.clipboardData.getData("Text");
        if (pastedText.length === 6) {
            const updatedOTP = [...applicant.otp];
            for (let i = 0; i < 6; i++) {
                updatedOTP[i] = pastedText[i];
            }
            setApplicantData({
                ...applicant,
                ['otp']: updatedOTP.join(''),
            });
        }
    };

    const handleContinue = () => {
        const otp = applicant.otp;
        if (otp === "") {
            toast.error("All OTP fields are required.");
            return;
        }

        verifyOtp({ otp }, {
            onSuccess: (data) => {
                if (data.statusCode === 200) {
                    setIsInvalid(false);
                    setTimeout(
                        async () => {
                            await signup(UserType.APPLICANT);
                            if (useAuth.getState().signupSuccess) {
                                setTimeout(
                                    ()=>{
                                        openModal("application-signup-success-modal");
                                        resetFormData();
                                    }, 500
                                )
                                setApplicantData({
                                    ...applicant,
                                    otp: "",
                                });
                                resetFormData();
                                navigate("/applicant/profile")


                            }
                        }, 500
                    )
                }
            },
            onError: (error) => {
                console.error("OTP Verification Failed:", JSON.stringify(error));
                setIsInvalid(true);
                toast.error(error.message);
                setTimeout(() => {
                    setIsInvalid(false);
                    setApplicantData({
                        ...applicant,
                        otp: "",
                    });
                }, 500);
            }
        });
    };

    const handleOtpResend = ()=>{
        sendOtp({ email: applicant.email, name: applicant.firstName });
    }




    return (
        <motion.div
            className="w-[310px] md:w-[680px] lg:w-[500px] mt-5 md:mr-28 md:mt-32 px-[10px] lg:px-0 space-y-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1
                className="text-[24px] text-center text-[#6438C2] font-bold"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                OTP Verification
            </motion.h1>
            <motion.p
                className="text-[16px] text-justify lg:text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                We’ve sent a verification code to your email. Please enter the code to confirm
                your account and start exploring GigHub.{" "}
                <span className="text-purple-700">
                    {applicant.email}
                </span>
            </motion.p>

            {/* OTP Input Fields */}
            <motion.div
                className="flex justify-center lg:justify-evenly items-center w-full gap-x-2"
                initial={{ x: -50 }}
                animate={shakeAnimation}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                {Array(6)
                    .fill(0)
                    .map((_, index) => (
                        <motion.input
                            key={index}
                            maxLength={1}
                            name={`otp[${index}]`}  // Dynamically bind input name
                            value={applicant.otp[index] || ''}  // Bind OTP value from formData
                            className="w-[40px] h-[40px] lg:w-[47px] lg:h-[42px] text-center rounded-[10px] border-[1px] border-[#5E5E5E] focus:outline-none focus:ring-0 focus:border-[1px] focus:border-[#5E5E5E]"
                            onChange={(e) => handleOTPChange(e, index)}  // Handle change for each input
                            onKeyDown={(e) => handleBackspace(e, index)} // Handle backspace key press for focus shift
                            onPaste={(e) => handlePaste(e, index)} // Handle paste event to auto-fill OTP
                            ref={(el) => otpRefs.current[index] = el}  // Set the reference for each input
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
            </motion.div>

            {/* Resend Code */}
            <motion.div
                className="flex gap-x-2 mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <img src={code} alt="code" />
                <div className="flex gap-x-1 md:gap-x-2 text-sm md:text-lg">
                    Haven't Received a Code?
                    <a className="text-[#56E5A1] decoration-0" href={"#"} onClick={handleOtpResend}>
                        Send me another one
                    </a>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                className="w-full flex flex-col items-center justify-center gap-y-3"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <button
                    className="mx-auto block w-full h-[50px] text-[16px] font-semibold text-[#FFFFFF] bg-[#6438C2] rounded-[10px] hover:bg-[#5931A9] transition"
                    onClick={handleContinue}
                >
                    Continue
                </button>
                <button
                    className="flex justify-center items-center gap-x-2 mx-auto w-full h-[50px] text-[16px] font-semibold text-[#000000] border-[1px] border-[#CCC] bg-white rounded-[10px] hover:bg-[#ccc] transition"
                    onClick={handlePrev}
                >
                    <FaArrowLeftLong className="text-purple-700"/>
                    Back
                </button>
            </motion.div>
            {
                isModalOpen("application-signup-success-modal") && (
                    <ApplicantSignupSuccessModal
                        modelId="application-signup-success-modal"
                        route="/applicant/profile"
                    />
                )
            }
        </motion.div>
    );
};

export default ApplicantSignupStepThree;
