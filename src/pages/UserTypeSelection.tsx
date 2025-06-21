import React, { memo } from "react";
import userSelection from "../assets/icons/userSelectionLeftSide.svg";
import gighubLogo from "../assets/icons/gighubLogoSmall.svg";
import jobSeekerUser from "../assets/icons/jobSeekerUser.svg";
import employerUser from "../assets/icons/employerUser.svg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth.ts";
import { UserType } from "../utils/enums.ts";

const UserTypeSelection: React.FC = () => {
  const { isAuthenticated, userType, setUserType } = useAuth();
  const navigator = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated && userType) {
      navigator(`/${userType}/profile`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userType]);

  const handleAsJobSeeker = () => {
    setUserType(UserType.APPLICANT);
  };

  const handleAsEmployer = () => {
    setUserType(UserType.EMPLOYER);
  };

  const handleProceed = () => {
    navigator(`/${userType}/signup`);
  };

  const handleBack = () => {
    // Go back to the previous page
    navigator(-1);
  };

  return (
    <div className="my-auto flex h-screen items-center justify-around gap-x-0 border-2 py-2">
      {/* Left Section */}
      <motion.div
        className="flex w-full flex-col items-start lg:w-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex w-full justify-start xs:ml-5 xs:mt-5 sm:ml-5 sm:mt-5 md:ml-5 md:mt-5">
          <img src={gighubLogo} alt="logo" />
        </div>
        <div className="mx-auto flex h-[824px] w-full flex-col justify-evenly">
          <div className="w-full text-center">
            <h1 className="text-gray-600 text-[20px] font-bold lg:text-[24px]">
              How are You Planning To Use Gighub
            </h1>
            <p className="text-gray-600 text-[13px]">
              We will streamline your setup experience accordingly
            </p>
          </div>
          <motion.div
            className="flex w-full justify-center gap-x-8"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              onClick={handleAsJobSeeker}
              className={`flex h-[145px] w-[calc(130px+5px)] cursor-pointer flex-col items-center justify-evenly rounded-[16px] border-[1px] lg:w-[137px] ${userType === UserType.APPLICANT ? "border-purple-600" : "border-[#E6E6E6]"}`}
              whileHover={{ scale: 1.05 }}
            >
              <img className="mx-auto" src={jobSeekerUser} alt="job seeker" />
              <p>As a Job Seeker</p>
            </motion.div>
            <motion.div
              onClick={handleAsEmployer}
              className={`flex w-[calc(130px+5px)] cursor-pointer flex-col items-center justify-evenly rounded-[16px] border-[1px] lg:h-[145px] lg:w-[137px] ${userType === UserType.EMPLOYER ? "border-purple-600" : "border-[#E6E6E6]"}`}
              whileHover={{ scale: 1.05 }}
            >
              <img className="mx-auto" src={employerUser} alt="employer" />
              <p>As an Employer</p>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex w-full justify-center gap-x-4 text-right lg:justify-end"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.button
              onClick={handleBack}
              className="h-[43px] w-[131px] rounded-[10px] border-[1px] border-[#E6E6E6] bg-white text-[16px] font-semibold text-black"
              whileHover={{ scale: 1.05 }}
            >
              Back
            </motion.button>
            <motion.button
              onClick={handleProceed}
              className="h-[43px] w-[131px] rounded-[10px] bg-[#6438C2] text-[16px] font-semibold text-white"
              whileHover={{ scale: 1.05 }}
              disabled={!userType} // Disable button if no selection is made
            >
              Proceed
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
      {/* Right Section */}
      <motion.img
        className="my-auto hidden lg:flex"
        src={userSelection}
        alt="user type selection right side"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
};

export default memo(UserTypeSelection);
