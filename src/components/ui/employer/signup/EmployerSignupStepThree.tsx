import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import code from "../../../../assets/icons/code.svg";
import { toast } from "react-toastify";
import { useAuth } from "../../../../store/useAuth.ts";
import { ArrowLeft, Mail, RefreshCw, Shield, AlertCircle, CheckCircle } from "lucide-react";

interface StepThreeProp {
  handleNext: () => void;
  handlePrev: () => void;
}

const EmployerSignupStepThree: React.FC<StepThreeProp> = ({
                                                            handleNext,
                                                            handlePrev,
                                                          }) => {
  const {
    otp,
    setOtp,
    verifyOtp,
    employerSignupRequest,
    sendVerificationOtp,
  } = useAuth();

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
      toast.error("Verification failed. Please try again."+error.message);
    }
  };

  const handleOtpResend = async () => {
    if (resendTimer > 0) return;

    setResending(true);
    try {
      const success = await sendVerificationOtp(
        employerSignupRequest?.email as string,
        "SIGNUP"
      );

      if (success) {
        setOtp("");
        setResendTimer(60); // 60 second cooldown
        toast.success("New verification code sent to your email!");
      } else {
        toast.error("Failed to resend code. Please try again.");
      }
    } catch (error: any) {
      toast.error("Failed to resend code. Please try again."+error.message);
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
      className="w-full max-w-md mx-auto space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Shield className="w-8 h-8 text-[#6438C2]" />
        </motion.div>

        <motion.h2
          className="text-2xl sm:text-3xl font-semibold text-gray-900"
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
          <p className="text-gray-600 text-sm sm:text-base">
            We've sent a 6-digit verification code to
          </p>
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
            <Mail className="w-4 h-4 text-[#6438C2]" />
            <span className="font-medium text-[#6438C2] break-all">
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
                className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold border-2 rounded-lg transition-all duration-200 focus:outline-none ${
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
              className="flex items-center justify-center gap-2 text-red-600 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle className="w-4 h-4" />
              Invalid verification code. Please try again.
            </motion.div>
          )}

          {showSuccess && (
            <motion.div
              className="flex items-center justify-center gap-2 text-green-600 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CheckCircle className="w-4 h-4" />
              Email verified successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resend Section */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <img src={code} alt="Code icon" className="w-4 h-4" />
            <span>Didn't receive the code?</span>
          </div>

          <button
            type="button"
            onClick={handleOtpResend}
            disabled={resending || resendTimer > 0}
            className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
              resending || resendTimer > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#6438C2] hover:text-[#5931A9]"
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
            {resending
              ? "Sending..."
              : resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Send new code"
            }
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
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
            loading || showSuccess
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#6438C2] hover:bg-[#5931A9] active:transform active:scale-[0.98]"
          } focus:ring-2 focus:ring-purple-100 focus:ring-offset-2`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </motion.div>

      {/* Security Note */}
      <motion.div
        className="text-center text-xs text-gray-500 border-t pt-4"
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