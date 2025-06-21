import React from "react";
import { Link } from "react-router-dom";
import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import loginRight from "../../assets/icons/loginRight.png";
import passwordResetIcon from "../../assets/icons/passwordResetIcon.svg";

const PasswordResetSuccess: React.FC = () => {
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
          <div className="flex w-full flex-col gap-y-5">
            <img
              className="mx-auto h-10 w-10"
              src={passwordResetIcon}
              alt="right"
            />
            <div className="mx-auto mb-5 text-center">
              <h1 className="text-[20px] sm:text-[25px] md:text-[32px]">
                Well Done
              </h1>
              <p className="text-[12px] text-[#AFAFAF] sm:text-[13px] md:text-[16px]">
                Your Password has been reset
              </p>
            </div>
            <Link
              to="/login"
              className="mb-5 w-full rounded-[16px] bg-[#6438C2] py-3 text-center text-white hover:bg-[#542F9E] md:px-4 md:py-4"
            >
              Try Login now
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

export default PasswordResetSuccess;
