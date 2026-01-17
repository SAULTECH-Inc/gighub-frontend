import React, { memo, useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  AlertCircle,
  Loader2,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import loginRight from "../../assets/icons/loginRight.png";
import { useAuth } from "../../store/useAuth";
import { useChatStore } from "../../store/useChatStore";
import { useSubscriptionStore } from "../../store/useSubscriptionStore.ts";
import { ApplicantData, EmployerData, Role } from "../../utils/types";
import { UserType } from "../../utils/enums.ts";
import { USER_TYPE } from "../../utils/helpers.ts";

interface TwoFactorVerificationProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({
                                                                       onSuccess,
                                                                       onBack,
                                                                     }) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { setSender } = useChatStore();
  const {
    verify2FA,
    resend2FACode,
    setAuthToken,
    setAuthRole,
    setApplicantData,
    setEmployerData,
    setProfileData,
    setEmail,
    setUserType,
    isAuthenticated,
  } = useAuth();

  const { getUserSubscription, getUserSubscriptionHistory } =
      useSubscriptionStore();

  // Get user data from location state (passed from login page)
  const tempUserData = location.state?.userData;
  const userEmail = location.state?.email || tempUserData?.email;
  const rememberMe = location.state?.rememberMe;

  // Helper function to validate userType
  const isValidUserType = (userType: any): boolean => {
    return (
        userType &&
        userType !== "null" &&
        userType !== null &&
        userType !== undefined &&
        typeof userType === "string" &&
        userType.trim() !== ""
    );
  };

  // Get the intended destination from location state or default routes
  const getRedirectPath = (userType?: string) => {
    const from = location.state?.from?.pathname;
    if (from) {
      return from;
    }

    if (userType && isValidUserType(userType)) {
      return `/${userType}/profile`;
    }

    if (USER_TYPE && isValidUserType(USER_TYPE)) {
      return `/${USER_TYPE}/profile`;
    }

    return `/dashboard`;
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && USER_TYPE && isValidUserType(USER_TYPE)) {
      const redirectPath = getRedirectPath();
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, USER_TYPE, navigate]);

  // Redirect back to login if no user data
  useEffect(() => {
    if (!tempUserData && !userEmail) {
      navigate("/login", { replace: true });
    }
  }, [tempUserData, userEmail, navigate]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last digit
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    setError("");

    // Focus the last filled input or the next empty one
    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  // Verify OTP
  const handleVerifyOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    // Call your 2FA verification API
    await verify2FA(otpCode, tempUserData?.tempToken, rememberMe)
      .then((response) => {

        if (!response) {
          setError("Verification failed. Please try again.");
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
          return;
        }

        if (!response.userType || !isValidUserType(response.userType)) {
          setError("Invalid user data received. Please contact support.");
          return;
        }

        // Auth setup (same as login page)
        setAuthToken(response.token as string);
        setAuthRole(response.role as Role);
        setSender(userEmail || response.email);
        setProfileData(response);
        setEmail(userEmail || response.email);
        setUserType(response.userType as UserType);

        // User-specific data
        if (response.userType === UserType.APPLICANT) {
          setApplicantData(response as ApplicantData);
        } else {
          setEmployerData(response as EmployerData);
        }

        // Fetch subscription info (non-blocking)
        if (response.id) {
          Promise.all([
            getUserSubscription(response.id),
            getUserSubscriptionHistory(response.id),
          ]).catch((err: any) => {
            console.warn("Subscription fetch failed: ", err);
          });
        }

        setSuccessMessage("Verification successful!");

        // Call onSuccess callback if provided
        if (onSuccess) {
          console.log("SUCCESS...");
          onSuccess();
        } else {
          console.log("REDIRECTING...");
          // Navigate to appropriate page
          const redirectPath = getRedirectPath(response.userType);
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 1000);
        }
      })
      .catch((err: any) => {
        console.error("2FA verification failed: ", err);
        setError(err.message || "Invalid code. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Resend OTP
  const handleResendCode = () => {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    setError("");

    resend2FACode(userEmail)
        .then(() => {
          setSuccessMessage("A new code has been sent to your email");
          setResendCooldown(60); // 60 seconds cooldown
          setTimeout(() => setSuccessMessage(""), 3000);
        })
        .catch((err: any) => {
          setError(err.message || "Failed to resend code. Please try again.");
        })
        .finally(() => {
          setResendLoading(false);
        });
  };

  // Handle back to login
  const handleBackToLogin = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/login", { replace: true });
    }
  };

  return (
      <div className="flex min-h-screen flex-col bg-gray-50 lg:flex-row">
        {/* Header for mobile */}
        <div className="bg-white p-4 shadow-sm lg:hidden">
          <div className="flex items-center justify-center gap-2">
            <img className="h-8 w-8" src={gighubLogo} alt="GigHub Logo" />
            <h1 className="text-lg font-black text-[#FA4E09]">GigHub</h1>
          </div>
        </div>

        {/* Welcome header for desktop */}
        <h1 className="absolute top-8 left-8 z-10 hidden text-2xl font-bold text-[#674EE5EE] lg:block xl:text-3xl">
          Two-Factor Authentication
        </h1>

        {/* Left Side - Form Section */}
        <div className="flex flex-1 items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md space-y-6">
            {/* Logo for desktop */}
            <div className="mb-8 hidden items-center justify-center gap-2 lg:flex">
              <img className="h-10 w-10" src={gighubLogo} alt="GigHub Logo" />
              <h1 className="text-xl font-black text-[#FA4E09]">GigHub</h1>
            </div>

            {/* Header Section */}
            <div className="space-y-2 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#6438C2]/10">
                <Shield className="h-8 w-8 text-[#6438C2]" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                Verify Your Identity
              </h2>
              <p className="text-sm text-gray-600 sm:text-base">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {/* Success Message */}
              {successMessage && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    {successMessage}
                  </div>
              )}

              {/* Error Message */}
              {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </div>
              )}

              {/* OTP Input Fields */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        disabled={isLoading}
                        className={`h-12 w-12 rounded-lg border-2 text-center text-xl font-semibold transition-all focus:border-transparent focus:ring-2 focus:ring-[#6438C2] sm:h-14 sm:w-14 ${
                            error
                                ? "border-red-500 bg-red-50"
                                : digit
                                    ? "border-[#6438C2] bg-[#6438C2]/5"
                                    : "border-gray-300 hover:border-gray-400"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                    />
                ))}
              </div>

              {/* Verify Button */}
              <button
                  type="submit"
                  disabled={isLoading || otp.join("").length !== 6}
                  className={`w-full rounded-lg px-4 py-3 font-medium text-white transition-all duration-200 ${
                      isLoading || otp.join("").length !== 6
                          ? "cursor-not-allowed bg-gray-400"
                          : "bg-[#6438C2] hover:bg-[#542F9E] active:scale-[0.98]"
                  } focus:ring-2 focus:ring-[#6438C2] focus:ring-offset-2`}
              >
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-4 w-4" />
                      Verify Code
                    </div>
                )}
              </button>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendLoading || resendCooldown > 0}
                      className={`font-semibold transition-colors focus:underline focus:outline-none ${
                          resendLoading || resendCooldown > 0
                              ? "cursor-not-allowed text-gray-400"
                              : "text-[#6438C2] hover:text-[#542F9E]"
                      }`}
                  >
                    {resendLoading ? (
                        <span className="inline-flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Sending...
                    </span>
                    ) : resendCooldown > 0 ? (
                        `Resend in ${resendCooldown}s`
                    ) : (
                        <span className="inline-flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" />
                      Resend Code
                    </span>
                    )}
                  </button>
                </p>
              </div>
            </form>

            {/* Back to Login */}
            <button
                onClick={handleBackToLogin}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6438C2] focus:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </button>

            {/* Security Note */}
            <div className="border-t pt-4 text-center text-xs text-gray-500">
              <div className="flex items-center justify-center gap-1">
                <Shield className="h-3 w-3" />
                <span>This code will expire in 10 minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image Section */}
        <div className="hidden items-center justify-center p-4 lg:flex lg:w-1/2 xl:w-2/5">
          <img
              className="h-auto max-h-[600px] max-w-full object-contain xl:max-h-[700px]"
              src={loginRight}
              alt="Security Illustration"
          />
        </div>
      </div>
  );
};

export const TwoFactorAuth = memo(TwoFactorVerification);
export default TwoFactorAuth;