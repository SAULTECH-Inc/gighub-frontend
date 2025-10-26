import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import code from "../../../../assets/icons/code.svg";
import { toast } from "react-toastify";
import { useAuth } from "../../../../store/useAuth.ts";
import {
  ArrowLeft,
  Mail,
  RefreshCw,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface StepThreeProp {
  handleNext: () => void;
  handlePrev: () => void;
}

const EmployerSignupStepThree: React.FC<StepThreeProp> = ({
  handleNext,
  handlePrev,
}) => {
  const { otp, setOtp, verifyOtp, employerSignupRequest, sendVerificationOtp } =
    useAuth();

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Timer for resend functionality
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const shakeAnimation = isInvalid
    ? { x: [-8, 8, -8, 8, 0], transition: { duration: 0.5 } }
    : { x: 0 };

  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length > 1) return; // Prevent multiple characters

    const updatedOTP = [...(otp as string).padEnd(6, "")];
    updatedOTP[index] = value;
    setOtp(updatedOTP.join("").slice(0, 6));

    // Clear invalid state when user starts typing
    if (isInvalid) {
      setIsInvalid(false);
    }

    // Auto-focus next input
    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (!otp?.[index] && index > 0) {
        // Focus previous input if current is empty
        otpRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const updatedOTP = [...(otp as string).padEnd(6, "")];
        updatedOTP[index] = "";
        setOtp(updatedOTP.join("").replace(/\s+$/, ""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("Text").replace(/\D/g, "");
    if (pastedText.length <= 6) {
      setOtp(pastedText.padEnd(6, "").slice(0, 6));
      // Focus the last filled input or the next empty one
      const nextIndex = Math.min(pastedText.length, 5);
      otpRefs.current[nextIndex]?.focus();
    }
  };

  const handleContinue = async () => {
    const otpValue = otp?.replace(/\s/g, "") || "";

    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      setIsInvalid(true);
      return;
    }

    setLoading(true);
    try {
      const success = await verifyOtp(
        employerSignupRequest?.email as string,
        otpValue,
      );

      if (success) {
        setIsInvalid(false);
        setShowSuccess(true);

        // Show success animation briefly before proceeding
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => {
            handleNext();
          }, 500);
        }, 1000);
      } else {
        setIsInvalid(true);
        setLoading(false);
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error: any) {
      setIsInvalid(true);
      setLoading(false);
      toast.error("Verification failed. Please try again." + error.message);
    }
  };

  const handleOtpResend = async () => {
    if (resendTimer > 0) return;

    setResending(true);
    try {
      const success = await sendVerificationOtp(
        employerSignupRequest?.email as string,
        "SIGNUP",
      );

      if (success) {
        setOtp("");
        setResendTimer(60); // 60 second cooldown
        toast.success("New verification code sent to your email!");
      } else {
        toast.error("Failed to resend code. Please try again.");
      }
    } catch (error: any) {
      toast.error("Failed to resend code. Please try again." + error.message);
    } finally {
      setResending(false);
    }
  };

  const formatEmail = (email: string) => {
    if (email.length <= 20) return email;
    const [username, domain] = email.split("@");
    if (username.length > 10) {
      return `${username.slice(0, 8)}...@${domain}`;
    }
    return email;
  };

  return (
    <motion.div
      className="mx-auto w-full max-w-md space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="space-y-4 text-center">
        <motion.div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Shield className="h-8 w-8 text-[#6438C2]" />
        </motion.div>

        <motion.h2
          className="text-2xl font-semibold text-gray-900 sm:text-3xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Verify Your Email
        </motion.h2>

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-sm text-gray-600 sm:text-base">
            We've sent a 6-digit verification code to
          </p>
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
            <Mail className="h-4 w-4 text-[#6438C2]" />
            <span className="font-medium break-all text-[#6438C2]">
              {formatEmail(employerSignupRequest?.email || "")}
            </span>
          </div>
        </motion.div>
      </div>

      {/* OTP Input Section */}
      <div className="space-y-6">
        <motion.div
          className="flex justify-center gap-2 sm:gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, ...shakeAnimation }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <motion.input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp?.[index] || ""}
                className={`h-12 w-12 rounded-lg border-2 text-center text-lg font-semibold transition-all duration-200 focus:outline-none sm:h-14 sm:w-14 sm:text-xl ${
                  isInvalid
                    ? "border-red-500 bg-red-50 text-red-600"
                    : showSuccess
                      ? "border-green-500 bg-green-50 text-green-600"
                      : otp?.[index]
                        ? "border-[#6438C2] bg-purple-50 text-[#6438C2]"
                        : "border-gray-300 hover:border-gray-400 focus:border-[#6438C2] focus:ring-2 focus:ring-purple-100"
                }`}
                onChange={(e) => handleOTPChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                ref={(el) => (otpRefs.current[index] = el)}
                disabled={loading}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              />
            ))}
        </motion.div>

        {/* Error/Success Messages */}
        <AnimatePresence>
          {isInvalid && (
            <motion.div
              className="flex items-center justify-center gap-2 text-sm text-red-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle className="h-4 w-4" />
              Invalid verification code. Please try again.
            </motion.div>
          )}

          {showSuccess && (
            <motion.div
              className="flex items-center justify-center gap-2 text-sm text-green-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CheckCircle className="h-4 w-4" />
              Email verified successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resend Section */}
        <motion.div
          className="space-y-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <img src={code} alt="Code icon" className="h-4 w-4" />
            <span>Didn't receive the code?</span>
          </div>

          <button
            type="button"
            onClick={handleOtpResend}
            disabled={resending || resendTimer > 0}
            className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
              resending || resendTimer > 0
                ? "cursor-not-allowed text-gray-400"
                : "text-[#6438C2] hover:text-[#5931A9]"
            }`}
          >
            <RefreshCw
              className={`h-4 w-4 ${resending ? "animate-spin" : ""}`}
            />
            {resending
              ? "Sending..."
              : resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Send new code"}
          </button>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <button
          type="button"
          onClick={handleContinue}
          disabled={loading || showSuccess}
          className={`w-full rounded-lg px-4 py-3 font-medium text-white transition-all duration-200 ${
            loading || showSuccess
              ? "cursor-not-allowed bg-gray-400"
              : "bg-[#6438C2] hover:bg-[#5931A9] active:scale-[0.98] active:transform"
          } focus:ring-2 focus:ring-purple-100 focus:ring-offset-2`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {showSuccess ? "Verified!" : "Verifying..."}
            </div>
          ) : (
            "Verify & Continue"
          )}
        </button>

        <button
          type="button"
          onClick={handlePrev}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </motion.div>

      {/* Security Note */}
      <motion.div
        className="border-t pt-4 text-center text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <p>This helps us keep your account secure</p>
      </motion.div>
    </motion.div>
  );
};

export default EmployerSignupStepThree;
