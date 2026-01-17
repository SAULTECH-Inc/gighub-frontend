import React, { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { removeFromLocalStorage, useAuth } from "../store/useAuth.ts";
import { UserType } from "../utils/enums.ts";
import userSelection from "../assets/icons/userSelectionLeftSide.svg";
import gighubLogo from "../assets/icons/gighubLogoSmall.svg";
import jobSeekerUser from "../assets/icons/jobSeekerUser.svg";
import employerUser from "../assets/icons/employerUser.svg";
import {
  Users,
  Building2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { NODE_ENV } from "../utils/constants.ts";

const UserTypeSelection: React.FC = () => {
  const { isAuthenticated, userType, setUserType } = useAuth();
  const navigator = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated && userType) {
      navigator(`/${userType}/profile`);
    }
  }, [isAuthenticated, userType, navigator]);

  const handleAsJobSeeker = () => {
    setUserType(UserType.APPLICANT);
  };

  const handleAsEmployer = () => {
    setUserType(UserType.EMPLOYER);
  };

  const handleProceed = () => {
    navigator(`/signup-option`);
  };

  const handleBack = async () => {
    await removeFromLocalStorage(NODE_ENV);
    navigator("/login");
  };

  const userOptions = [
    {
      id: UserType.APPLICANT,
      title: "Job Seeker",
      description: "Find your dream job",
      icon: jobSeekerUser,
      lucideIcon: Users,
      features: [
        "Browse job opportunities",
        "Apply with ease",
        "Track applications",
      ],
      handler: handleAsJobSeeker,
      color: "from-blue-500 to-purple-600",
    },
    {
      id: UserType.EMPLOYER,
      title: "Employer",
      description: "Hire top talent",
      icon: employerUser,
      lucideIcon: Building2,
      features: [
        "Post job openings",
        "Review candidates",
        "Manage hiring process",
      ],
      handler: handleAsEmployer,
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <motion.div
      className="flex min-h-screen flex-col bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.header
        className="bg-white p-4 shadow-sm lg:p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={gighubLogo} alt="GigHub Logo" className="h-8 w-8" />
            <h1 className="text-xl font-black text-[#FA4E09]">GigHub</h1>
          </div>

          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="mx-auto grid min-h-[calc(100vh-200px)] max-w-6xl items-center justify-items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            {/* Left Section - Content */}
            <div className="flex w-full items-center justify-center">
              <motion.div
                className="max-w-lg space-y-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Header */}
                <div className="space-y-3 text-center">
                  <motion.div
                    className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1.5 text-xs font-medium text-purple-700"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Sparkles className="h-3 w-3" />
                    Welcome to GigHub
                  </motion.div>

                  <motion.h2
                    className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    How do you plan to use{" "}
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      GigHub?
                    </span>
                  </motion.h2>

                  <motion.p
                    className="text-base text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    We'll customize your experience based on your selection
                  </motion.p>
                </div>

                {/* User Type Cards */}
                <motion.div
                  className="grid gap-3 sm:grid-cols-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {userOptions.map((option, index) => {
                    const isSelected = userType === option.id;

                    return (
                      <motion.div
                        key={option.id}
                        onClick={option.handler}
                        className={`relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                          isSelected
                            ? "border-purple-500 shadow-lg shadow-purple-200"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      >
                        {/* Selection indicator */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CheckCircle className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Gradient background */}
                        {isSelected && (
                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-5`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.05 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}

                        <div className="relative space-y-3 p-4">
                          {/* Icon */}
                          <div className="flex items-center justify-center">
                            <div
                              className={`rounded-full p-3 ${
                                isSelected ? "bg-purple-100" : "bg-gray-100"
                              } transition-colors duration-300`}
                            >
                              <img
                                src={option.icon}
                                alt={option.title}
                                className="h-6 w-6"
                              />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="space-y-1 text-center">
                            <h3
                              className={`text-base font-semibold transition-colors duration-300 ${
                                isSelected ? "text-purple-700" : "text-gray-900"
                              }`}
                            >
                              {option.title}
                            </h3>
                            <p className="text-xs text-gray-600">
                              {option.description}
                            </p>
                          </div>

                          {/* Features */}
                          <div className="space-y-0.5">
                            {option.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5 text-xs text-gray-500"
                              >
                                <div className="h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                                <span className="text-xs">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex flex-col justify-center gap-2 sm:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <button
                    onClick={handleBack}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>

                  <motion.button
                    onClick={handleProceed}
                    disabled={!userType}
                    className={`flex items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-medium text-white transition-all duration-200 ${
                      userType
                        ? "bg-[#6438C2] hover:bg-[#5931A9] active:scale-[0.98] active:transform"
                        : "cursor-not-allowed bg-gray-400"
                    } focus:ring-2 focus:ring-purple-100 focus:ring-offset-2`}
                    whileTap={userType ? { scale: 0.98 } : {}}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Section - Image */}
            <div className="hidden w-full items-center justify-center lg:flex">
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <img
                  className="h-auto max-h-[550px] max-w-full object-contain xl:max-h-[600px]"
                  src={userSelection}
                  alt="User type selection illustration"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        className="border-t bg-white p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-500">
          <p>Choose your path and let's build something amazing together! 🚀</p>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default memo(UserTypeSelection);
