import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import { Link, useNavigate } from "react-router-dom";
import loginRight from "../../assets/icons/loginRight.png";
import React from "react";
import { useAuth } from "../../store/useAuth.ts";

const ForgotPassword: React.FC = () => {
  const { setEmail, email, sendVerificationOtp } = useAuth();
  const navigate = useNavigate();
  let inputComplete = true;
  const handleValidateEmail = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    if (!inputComplete) {
      return;
    }
    const success = await sendVerificationOtp(
      email as string,
      "RESET_PASSWORD",
    );
    if (success) {
      navigate("/verify-otp-to-reset-password");
    }
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
                Forgot Password?
              </h1>
              <p className="text-[12px] text-[#AFAFAF] sm:text-[13px] md:text-[16px]">
                No worries, we will send you reset instruction
              </p>
            </div>
            <div className="mb-10 flex flex-col gap-y-3">
              <label className="text-[13px] font-medium text-[#8E8E8E]">
                Email
              </label>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                  inputComplete = !!e.target.value;
                }}
                className="w-full rounded-[16px] border border-[#E6E6E6] p-3 focus:border-[#E6E6E6] focus:ring-0 focus:outline-none md:p-3"
                type="email"
                required
              />
            </div>
            <button
              onClick={handleValidateEmail}
              type="button"
              className="mb-5 w-full rounded-[16px] bg-[#6438C2] py-3 text-white hover:bg-[#542F9E] md:px-4 md:py-4"
            >
              Send Reset Instructions
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

export default ForgotPassword;
