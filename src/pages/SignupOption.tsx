import React, { memo } from "react";
import userSelection from "../assets/icons/userSelectionLeftSide.svg";
import gighubLogo from "../assets/icons/gighubLogoSmall.svg";
import { Mail, Users, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth.ts";
import { signingSignupRouteMap } from "../utils/constants.ts";
import { UserType } from "../utils/enums.ts";

const SignupOption: React.FC = () => {
  const { userType, setSignupMethod } = useAuth();
  const navigator = useNavigate();
  const [selectedMethod, setSelectedMethod] = React.useState<string>("");

  const handleGoogleSignup = () => {
    setSelectedMethod("google");
    setSignupMethod("google");
  };

  const handleOutlookSignup = () => {
    setSelectedMethod("outlook");
    setSignupMethod("outlook");
  };

  const handleLinkedInSignup = () => {
    setSelectedMethod("linkedin");
    setSignupMethod("linkedin");
  };

  const handlePersonalDetailsSignup = () => {
    setSelectedMethod("personal");
    setSignupMethod("personal");
  };

  const handleProceed = () => {
    if (selectedMethod === "personal") {
      navigator(`/${userType}/signup`);
    } else {
      window.location.href = signingSignupRouteMap[selectedMethod].concat(userType as UserType);
    }
  };

  const handleBack = () => {
    // Go back to user type selection
    navigator("/user-type-selection");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 lg:justify-around lg:px-0">
      {/* Left Section */}
      <motion.div
        className="flex w-full max-w-md flex-col items-start lg:w-1/2 lg:max-w-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-8 flex w-full justify-center lg:justify-start lg:ml-5 lg:mt-5">
          <img src={gighubLogo} alt="logo" />
        </div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 lg:h-[824px] lg:justify-evenly lg:space-y-0">
          <div className="w-full text-center">
            <h1 className="text-xl font-bold text-gray-600 lg:text-2xl">
              How Would You Like To Sign Up?
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Choose your preferred signup method to get started
            </p>
          </div>

          {/* Social Authentication Options */}
          <motion.div
            className="flex w-full flex-col items-center space-y-6"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-3 gap-3 w-full max-w-sm sm:gap-4 lg:flex lg:justify-center lg:gap-x-4 lg:max-w-none">
              <motion.div
                onClick={handleGoogleSignup}
                className={`flex h-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 sm:h-28 lg:h-[120px] lg:w-[130px] ${selectedMethod === "google" ? "border-purple-600 bg-purple-50" : "border-gray-200"}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 sm:h-8 sm:w-8">
                  <span className="text-white font-bold text-xs sm:text-sm">G</span>
                </div>
                <p className="mt-2 text-xs text-center sm:text-sm">Google</p>
              </motion.div>

              <motion.div
                onClick={handleOutlookSignup}
                className={`flex h-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 sm:h-28 lg:h-[120px] lg:w-[130px] ${selectedMethod === "outlook" ? "border-purple-600 bg-purple-50" : "border-gray-200"}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="h-6 w-6 text-blue-600 sm:h-8 sm:w-8" />
                <p className="mt-2 text-xs text-center sm:text-sm">Outlook</p>
              </motion.div>

              <motion.div
                onClick={handleLinkedInSignup}
                className={`flex h-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 sm:h-28 lg:h-[120px] lg:w-[130px] ${selectedMethod === "linkedin" ? "border-purple-600 bg-purple-50" : "border-gray-200"}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="h-6 w-6 text-blue-700 sm:h-8 sm:w-8" />
                <p className="mt-2 text-xs text-center sm:text-sm">LinkedIn</p>
              </motion.div>
            </div>

            {/* Divider */}
            <div className="flex w-full max-w-sm items-center justify-center gap-x-4 lg:max-w-md">
              <div className="h-px flex-1 bg-gray-300"></div>
              <span className="text-sm text-gray-500">OR</span>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            {/* Personal Details Option */}
            <motion.div
              onClick={handlePersonalDetailsSignup}
              className={`flex h-24 w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded-2xl border-2 sm:h-28 lg:h-[120px] lg:max-w-md ${selectedMethod === "personal" ? "border-purple-600 bg-purple-50" : "border-gray-200"}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserPlus className="h-6 w-6 text-green-600 sm:h-8 sm:w-8" />
              <p className="mt-2 text-xs text-center sm:text-sm">Sign up with Personal Details</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex w-full justify-center gap-x-4 lg:justify-end"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.button
              onClick={handleBack}
              className="h-12 w-24 rounded-xl border-2 border-gray-200 bg-white text-sm font-semibold text-black sm:h-11 sm:w-32 sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back
            </motion.button>
            <motion.button
              onClick={handleProceed}
              className="h-12 w-24 rounded-xl bg-purple-600 text-sm font-semibold text-white disabled:bg-gray-400 disabled:cursor-not-allowed sm:h-11 sm:w-32 sm:text-base"
              whileHover={{ scale: selectedMethod ? 1.05 : 1 }}
              whileTap={{ scale: selectedMethod ? 0.95 : 1 }}
              disabled={!selectedMethod}
            >
              Proceed
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Section */}
      <motion.img
        className="my-auto hidden lg:flex lg:max-w-lg xl:max-w-xl"
        src={userSelection}
        alt="signup method selection right side"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
};

export default memo(SignupOption);
