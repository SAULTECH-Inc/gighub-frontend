import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth.ts";
import { signingSignupRouteMap } from "../utils/constants.ts";
import { UserType } from "../utils/enums.ts";
import userSelection from "../assets/icons/userSelectionLeftSide.svg";
import gighubLogo from "../assets/icons/gighubLogoSmall.svg";
import {
  Mail,
  Users,
  UserPlus,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap
} from "lucide-react";

const SignupOption: React.FC = () => {
  const { userType, setSignupMethod } = useAuth();
  const navigator = useNavigate();
  const [selectedMethod, setSelectedMethod] = React.useState<string>("");

  const signupMethods = [
    {
      id: "google",
      name: "Google",
      icon: "G",
      color: "text-red-600",
      bgColor: "bg-red-500",
      description: "Quick setup with your Google account",
      handler: () => {
        setSelectedMethod("google");
        setSignupMethod("google");
      }
    },
    {
      id: "outlook",
      name: "Outlook",
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-500",
      description: "Connect with your Microsoft account",
      handler: () => {
        setSelectedMethod("outlook");
        setSignupMethod("outlook");
      }
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Users,
      color: "text-blue-700",
      bgColor: "bg-blue-700",
      description: "Import your professional profile",
      handler: () => {
        setSelectedMethod("linkedin");
        setSignupMethod("linkedin");
      }
    }
  ];

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
    navigator("/user-type-selection");
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.header
        className="bg-white shadow-sm p-4 lg:p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <img src={gighubLogo} alt="GigHub Logo" className="h-8 w-8" />
            <h1 className="text-[#FA4E09] text-xl font-black">GigHub</h1>
          </div>

          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center max-w-6xl mx-auto">

            {/* Left Section - Content */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Header */}
              <div className="text-center space-y-3">
                <motion.div
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Zap className="w-3 h-3" />
                  Almost there!
                </motion.div>

                <motion.h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  How would you like to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    sign up?
                  </span>
                </motion.h2>

                <motion.p
                  className="text-base text-gray-600 max-w-md mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Choose your preferred method to create your account
                </motion.p>
              </div>

              {/* Social Login Options */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                  {signupMethods.map((method, index) => {
                    const isSelected = selectedMethod === method.id;
                    const IconComponent = typeof method.icon === 'string' ? null : method.icon;

                    return (
                      <motion.div
                        key={method.id}
                        onClick={method.handler}
                        className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-300 ${
                          isSelected
                            ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-200"
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
                              className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CheckCircle className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex flex-col items-center space-y-2">
                          {/* Icon */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isSelected ? method.bgColor : "bg-gray-100"
                          } transition-colors duration-300`}>
                            {typeof method.icon === 'string' ? (
                              <span className={`text-sm font-bold ${
                                isSelected ? "text-white" : method.color
                              }`}>
                                {method.icon}
                              </span>
                            ) : IconComponent ? (
                              <IconComponent className={`w-4 h-4 ${
                                isSelected ? "text-white" : method.color
                              }`} />
                            ) : null}
                          </div>

                          {/* Label */}
                          <span className={`text-xs font-medium transition-colors duration-300 ${
                            isSelected ? "text-purple-700" : "text-gray-700"
                          }`}>
                            {method.name}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Method description */}
                <AnimatePresence mode="wait">
                  {selectedMethod && selectedMethod !== "personal" && (
                    <motion.div
                      key={selectedMethod}
                      className="text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm text-gray-600">
                        {signupMethods.find(m => m.id === selectedMethod)?.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-50 text-gray-500">or</span>
                  </div>
                </div>

                {/* Personal Details Option */}
                <motion.div
                  onClick={handlePersonalDetailsSignup}
                  className={`relative cursor-pointer rounded-lg border-2 p-4 max-w-md mx-auto transition-all duration-300 ${
                    selectedMethod === "personal"
                      ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-200"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  {/* Selection indicator */}
                  <AnimatePresence>
                    {selectedMethod === "personal" && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckCircle className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-center space-x-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedMethod === "personal" ? "bg-green-500" : "bg-gray-100"
                    } transition-colors duration-300`}>
                      <UserPlus className={`w-5 h-5 ${
                        selectedMethod === "personal" ? "text-white" : "text-green-600"
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="text-left">
                      <h3 className={`font-medium transition-colors duration-300 ${
                        selectedMethod === "personal" ? "text-purple-700" : "text-gray-900"
                      }`}>
                        Sign up with Personal Details
                      </h3>
                      <p className="text-sm text-gray-600">
                        Create account with your information
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-2 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <motion.button
                  onClick={handleProceed}
                  disabled={!selectedMethod}
                  className={`px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
                    selectedMethod
                      ? "bg-[#6438C2] hover:bg-[#5931A9] active:transform active:scale-[0.98]"
                      : "bg-gray-400 cursor-not-allowed"
                  } focus:ring-2 focus:ring-purple-100 focus:ring-offset-2`}
                  whileTap={selectedMethod ? { scale: 0.98 } : {}}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              {/* Security Note */}
              <motion.div
                className="text-center text-xs text-gray-500 border-t pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <div className="flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>All signup methods are secure and encrypted</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Section - Image */}
            <motion.div
              className="hidden lg:flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <img
                className="max-w-full h-auto max-h-[550px] xl:max-h-[600px] object-contain"
                src={userSelection}
                alt="Signup method selection illustration"
              />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-white border-t p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>🎉 You're just one step away from joining the GigHub community!</p>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default memo(SignupOption);