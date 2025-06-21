import React, { useEffect, useState } from "react";
import { useAuth } from "../../store/useAuth.ts";
import { Link, useNavigate } from "react-router-dom";
import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import loginRight from "../../assets/icons/loginRight.png";
import { motion } from "framer-motion";
import { calculatePasswordStrength } from "../../utils/helpers.ts";
import passwordResetIcon from "../../assets/icons/passwordResetIcon.svg";
import { PasswordResetRequest } from "../../utils/types";
import { toast } from "react-toastify";

const ResetPassword: React.FC = () => {
  const {
    passwordResetRequest,
    setPasswordResetRequest,
    email,
    resetPassword,
  } = useAuth();
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    if (passwordResetRequest?.confirmPassword) {
      setPasswordMatch(
        passwordResetRequest?.confirmPassword ===
          passwordResetRequest?.password,
      );
    }
  }, [passwordResetRequest]);

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordResetRequest({
      ...passwordResetRequest,
      confirmPassword: e.target.value,
      email: email as string,
    });
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordResetRequest({
      ...passwordResetRequest,
      [name]: value,
      email: email as string,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleChange(e);
    const strength = calculatePasswordStrength(e.target.value);
    setPasswordStrength(strength);
  };
  const handleResetPassword = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const success = await resetPassword(
      passwordResetRequest as PasswordResetRequest,
    );
    if (success) {
      toast.success("Password reset successfully!");
      navigate("/password-reset-success");
    }
  };
  return (
    <>
      <form className="relative mx-auto my-auto flex h-screen flex-row items-center justify-evenly space-x-0">
        <img
          className="h-30 w-30 absolute left-5 top-5 mx-auto"
          src={gighubLogo}
          alt="right"
        />
        <div className="relative flex h-[890px] w-full flex-col items-center justify-center gap-y-6 px-5 md:px-10 lg:w-1/2 xl:w-1/3">
          <Link
            to="/user-type-selection"
            className="absolute right-5 top-2 text-[#6438C2]"
          >
            Create an Account
          </Link>
          <div className="flex w-full flex-col gap-y-2">
            <img
              className="mx-auto h-10 w-10"
              src={passwordResetIcon}
              alt="right"
            />
            <div className="mx-auto mb-5 text-center">
              <h1 className="text-[20px] sm:text-[25px] md:text-[32px]">
                Set new password
              </h1>
              <p className="text-[12px] text-[#AFAFAF] sm:text-[13px] md:text-[16px]">
                Must be atleast 8 characters
              </p>
            </div>
            <div>
              <div className="mb-2 flex flex-col gap-y-3">
                <label className="text-[13px] font-medium text-[#8E8E8E]">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    onChange={handlePasswordChange}
                    name="password"
                    className="w-full rounded-[16px] border border-[#E6E6E6] p-3 text-[16px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0 md:p-3"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-[10px] top-[12px] text-[#6E4AED] focus:outline-none"
                  >
                    {passwordVisible ? "Hide" : "Show"}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                <motion.div
                  className="mb-[10px] mt-0"
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-evenly gap-x-2">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div
                        key={index}
                        className={`h-[12px] w-[71px] rounded-[16px] ${
                          index <= passwordStrength
                            ? "bg-[#51FF00]"
                            : "bg-[#E6E6E6]"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="mt-2 text-end text-[12px]">
                    {passwordStrength < 3
                      ? "Weak"
                      : passwordStrength < 5
                        ? "Medium"
                        : "Strong"}
                  </p>
                </motion.div>
              </div>

              <div className="mb-10 flex flex-col gap-y-3">
                <label className="text-[13px] font-medium text-[#8E8E8E]">
                  Confirm Password
                </label>
                <input
                  onChange={handleConfirmPasswordChange}
                  className="w-full rounded-[16px] border border-[#E6E6E6] p-3 text-[16px] focus:border-[#E6E6E6] focus:outline-none focus:ring-0 md:p-3"
                  type="password"
                  required
                />
                {!passwordMatch && (
                  <span className="mt-1 text-xs text-red-500">
                    Passwords do not match
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleResetPassword}
              type="button"
              className="mb-5 w-full rounded-[16px] bg-[#6438C2] py-3 text-white hover:bg-[#542F9E] md:px-4 md:py-4"
            >
              Reset Password
            </button>
            <Link
              to="/login"
              className="w-full rounded-[16px] py-3 text-center text-[#8E8E8E] hover:bg-white md:px-4 md:py-4"
            >
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

export default ResetPassword;
