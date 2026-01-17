import React, { useRef, useState } from "react";
import { useAuth } from "../../store/useAuth.ts";
import { Link, useNavigate } from "react-router-dom";
import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import loginRight from "../../assets/icons/loginRight.png";
import { motion } from "framer-motion";

const VerifyOtpToResetPassword: React.FC = () => {
  const { otp, setOtp, email, verifyOtp, verifyAccount } = useAuth();
  const [otpArr, setOtpArr] = useState<string[]>([]);
  const navigate = useNavigate();

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isInvalid] = useState(false);
  const shakeAnimation = isInvalid
    ? { x: [-5, 5, -5, 5, 0] } // Shake effect, ends smoothly at 0
    : { x: 0 }; // Normal state

  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const updatedOTP = [...otpArr];
    updatedOTP[index] = e.target.value;
    setOtpArr(updatedOTP);
    setOtp(updatedOTP.join(""));

    if (e.target.value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otpArr[index] && index > 0) {
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
      const updatedOTP = [...otpArr];
      for (let i = 0; i < 6; i++) {
        updatedOTP[i] = pastedText[i];
      }
      setOtpArr(updatedOTP);
      setOtp(updatedOTP.join(""));
    }
  };

  const handleVerifyOtpAndContinue = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const success = await verifyOtp(email as string, otp as string);
    if (success) {
      navigate("/reset-password");
    }
  };

  const handleResendOtp = async () => {
    await verifyAccount(email as string);
  };

  return (
    <>
      <form className="relative mx-auto my-auto flex h-screen flex-row items-center justify-evenly space-x-0">
        <img
          className="absolute top-5 left-5 mx-auto h-30 w-30"
          src={gighubLogo}
          alt="right"
        />
        <div className="relative flex h-[890px] w-full flex-col items-center justify-center gap-y-6 px-5 md:px-10 lg:w-1/2 xl:w-1/3">
          <Link
            to="/user-type-selection"
            className="absolute top-2 right-5 text-[#6438C2]"
          >
            Create an Account
          </Link>
          <div className="flex w-full flex-col gap-y-2">
            <img className="mx-auto h-40 w-40" src={gighubLogo} alt="right" />
            <div className="mx-auto mb-5 text-center">
              <h1 className="text-[20px] sm:text-[25px] md:text-[32px]">
                Reset Password
              </h1>
              <p className="text-[12px] text-[#AFAFAF] sm:text-[13px] md:text-[16px]">
                We sent a code to{" "}
                <span className="text-[#6438C2]">{email}</span>
              </p>
            </div>
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
                    value={otpArr[index] || ""}
                    className={`my-10 h-[40px] w-[40px] rounded-[10px] border-[1px] text-center transition-all focus:ring-0 focus:outline-none lg:h-[42px] lg:w-[47px] ${
                      otpArr[index]
                        ? "border-[2px] border-[#6438C2] focus:border-[2px] focus:border-[#6438C2]" // Keep purple if filled
                        : "border-[#5E5E5E] focus:border-[#6438C2]" // Default gray, turns purple on focus
                    }`}
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

            <div className="flex flex-col items-center justify-center">
              <button
                onClick={handleVerifyOtpAndContinue}
                // disabled={isAuthenticated}
                type="button"
                className="mb-5 w-full rounded-[16px] bg-[#6438C2] py-3 text-white hover:bg-[#542F9E] md:px-4 md:py-4"
              >
                Very OTP
              </button>
              <p>
                Didn't receive the email click to{" "}
                <span
                  className="cursor-pointer text-[12px] text-[#6438C2] sm:text-[13px] md:text-[16px]"
                  onClick={handleResendOtp}
                >
                  resend
                </span>
              </p>
            </div>
            <Link
              to="/login"
              className="w-full rounded-[16px] py-3 text-center text-[#8E8E8E] hover:bg-white md:px-4 md:py-4"
            >
              {" "}
              ← Back to sign-in
            </Link>
          </div>
        </div>
        <img
          className="hidden h-[890px] lg:flex"
          src={loginRight}
          alt="right"
        />
      </form>
    </>
  );
};

export default VerifyOtpToResetPassword;
