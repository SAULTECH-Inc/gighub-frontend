import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import code from "../../../../assets/icons/code.svg";
import { FaArrowLeftLong } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useAuth } from "../../../../store/useAuth.ts";

interface StepTwoProp {
  handleNext: () => void;
  handlePrev: () => void;
}

const EmployerSignupStepThree: React.FC<StepTwoProp> = ({
  handleNext,
  handlePrev,
}) => {
  const {
    otp,
    loading,
    setOtp,
    verifyOtp,
    employerSignupRequest,
    sendVerificationOtp,
  } = useAuth();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const shakeAnimation = isInvalid
    ? { x: [-5, 5, -5, 5, 0] } // Shake effect, ends smoothly at 0
    : { x: 0 }; // Normal state
  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const updatedOTP = [...(otp as string)];
    updatedOTP[index] = e.target.value;
    setOtp(updatedOTP.join(""));

    if (e.target.value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp?.[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    console.log(index);
    const pastedText = e.clipboardData.getData("Text");
    if (pastedText.length === 6) {
      setOtp("");
      const updatedOTP = [];
      for (let i = 0; i < 6; i++) {
        updatedOTP[i] = pastedText[i];
      }
      setOtp(updatedOTP.join(""));
    }
  };

  const handleContinue = async () => {
    if (otp === "") {
      toast.error("All OTP fields are required.");
      return;
    }
    const success = await verifyOtp(
      employerSignupRequest?.email as string,
      otp as string,
    );
    if (success) {
      setIsInvalid(false);
      handleNext();
    } else {
      setIsInvalid(true);
    }
  };

  const handleOtpResend = async () => {
    await sendVerificationOtp(employerSignupRequest?.email as string, "SIGNUP");
    setOtp("");
  };

  return (
    <motion.div
      className="mt-5 w-[310px] space-y-5 px-[10px] md:mr-28 md:mt-32 md:w-[680px] lg:w-[500px] lg:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-center text-[24px] font-bold text-[#6438C2]"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        OTP Verification
      </motion.h1>
      <motion.p
        className="text-justify text-[16px] lg:text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        We’ve sent a verification code to your email. Please enter the code to
        confirm your account and start exploring GigHub.{" "}
        <span className="text-purple-700">{employerSignupRequest?.email}</span>
      </motion.p>

      <motion.div
        className="flex w-full items-center justify-center gap-x-2 lg:justify-evenly"
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
              name={`otp[${index}]`}
              value={otp[index] || ""}
              className="h-[40px] w-[40px] rounded-[10px] border-[1px] border-[#5E5E5E] text-center focus:border-[1px] focus:border-[#5E5E5E] focus:outline-none focus:ring-0 lg:h-[42px] lg:w-[47px]"
              onChange={(e) => handleOTPChange(e, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              onPaste={(e) => handlePaste(e, index)}
              ref={(el) => (otpRefs.current[index] = el)}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
      </motion.div>

      <motion.div
        className="mx-auto flex gap-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src={code} alt="code" />
        <div className="lex gap-x-2 text-sm">
          Haven't Received a Code? &nbsp;
          <a
            className="text-[#56E5A1] decoration-0"
            href={"#"}
            onClick={handleOtpResend}
          >
            Send me another one
          </a>
        </div>
      </motion.div>

      <motion.div
        className="flex w-full flex-col items-center justify-center gap-y-3"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          type="button"
          className="mx-auto block h-[50px] w-full rounded-[10px] bg-[#6438C2] text-[16px] font-semibold text-[#FFFFFF] transition hover:bg-[#5931A9]"
          onClick={handleContinue}
        >
          {loading ? "Verifying..." : "Continue"}
        </button>
        <button
          type="button"
          className="mx-auto flex h-[50px] w-full items-center justify-center gap-x-2 rounded-[10px] border-[1px] border-[#CCC] bg-white text-[16px] font-semibold text-[#000000] transition hover:bg-[#ccc]"
          onClick={handlePrev}
        >
          <FaArrowLeftLong className="text-purple-700" />
          Back
        </button>
      </motion.div>
    </motion.div>
  );
};

export default EmployerSignupStepThree;
