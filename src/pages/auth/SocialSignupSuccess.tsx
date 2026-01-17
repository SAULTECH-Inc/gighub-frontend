import React, { memo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserType } from "../../utils/enums.ts";
import { removeFromLocalStorage, useAuth } from "../../store/useAuth.ts";
import {
  ApplicantData,
  ApplicantPersonalInfo,
  EmployerData,
  Role,
} from "../../utils/types";
import { useChatStore } from "../../store/useChatStore.ts";
import { useSubscriptionStore } from "../../store/useSubscriptionStore.ts";
import { CheckCircle, User, Briefcase, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { storage } from "../../utils/helpers.ts";
import { NODE_ENV } from "../../utils/constants.ts";

const SocialSignupSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const userType = searchParams.get("userType") as UserType;
  const email = searchParams.get("email");

  const navigate = useNavigate();
  const { setSender } = useChatStore();
  const { getUserSubscription, getUserSubscriptionHistory } =
    useSubscriptionStore();
  const {
    setIsAuthenticated,
    getUserByEmail,
    setAuthRole,
    setProfileData,
    setEmail,
    setUserType,
    setApplicantData,
    setApplicantPersonalInfo,
    setEmployerData,
  } = useAuth();

  const [loadingStep, setLoadingStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const loadingSteps = [
    "Verifying your account...",
    "Fetching your profile...",
    "Setting up your workspace...",
    "Almost ready...",
  ];

  useEffect(() => {
    const setupUserAccount = async () => {
      console.log("Starting process with:", { token, email, userType });

      if (!token || !email || !userType) {
        console.log("Missing required params, redirecting to login");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await removeFromLocalStorage(NODE_ENV);
        navigate("/login");
        return;
      }

      try {
        // Step 1: Initial setup
        setLoadingStep(0);
        storage.setItem("authToken", token);
        setIsAuthenticated(true);
        setEmail(email);
        setUserType(userType);
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Step 2: Get user data
        setLoadingStep(1);
        const response = await getUserByEmail(email);
        console.log("User data response:", response);

        if (response?.statusCode !== 200 || !response?.data) {
          throw new Error(
            `Failed to get user data. Status: ${response?.statusCode}`,
          );
        }

        const userData = response.data;

        // Step 3: Setup profile
        setLoadingStep(2);
        setAuthRole(userData.role as Role);
        setSender(email);
        setProfileData(userData);
        setApplicantPersonalInfo(userData as ApplicantPersonalInfo);

        // Set user-specific data and subscriptions
        if (
          "userType" in userData &&
          userData.userType === UserType.APPLICANT
        ) {
          setApplicantData(userData as ApplicantData);
        } else {
          setEmployerData(userData as EmployerData);
        }

        if (userData.id) {
          await Promise.all([
            getUserSubscription(userData.id),
            getUserSubscriptionHistory(userData.id),
          ]);
        }

        await new Promise((resolve) => setTimeout(resolve, 800));

        // Step 4: Final setup
        setLoadingStep(3);
        await new Promise((resolve) => setTimeout(resolve, 800));

        setIsComplete(true);

        // Navigate to appropriate dashboard
        setTimeout(() => {
          const dashboardPath =
            userType === UserType.APPLICANT
              ? "/applicant/dashboard"
              : "/employer/dashboard";
          navigate(dashboardPath);
        }, 2000);
      } catch (error) {
        console.error("Setup failed:", error);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await removeFromLocalStorage(NODE_ENV);
        navigate("/login");
      }
    };

    setupUserAccount().then((r) => r);
  }, [
    token,
    email,
    userType,
    navigate,
    setIsAuthenticated,
    getUserByEmail,
    setAuthRole,
    setProfileData,
    setEmail,
    setUserType,
    setApplicantData,
    setEmployerData,
    setSender,
    getUserSubscription,
    getUserSubscriptionHistory,
  ]);

  const renderIcon = () => {
    if (isComplete) {
      return (
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <motion.div
            className="absolute -inset-2 -z-10 rounded-full bg-green-200"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.3 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.div>
      );
    }

    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    );
  };

  const renderUserTypeBadge = () => (
    <motion.div
      className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
    >
      {userType === UserType.APPLICANT ? (
        <>
          <User className="h-4 w-4" />
          Job Seeker Account
        </>
      ) : (
        <>
          <Briefcase className="h-4 w-4" />
          Employer Account
        </>
      )}
    </motion.div>
  );

  const renderContent = () => {
    if (isComplete) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p className="mb-4 text-gray-600">
            Your account has been successfully set up!
          </p>
          <p className="text-sm text-gray-500">
            Redirecting you to your dashboard...
          </p>
        </motion.div>
      );
    }

    return (
      <div className="space-y-4">
        <p className="font-medium text-gray-600">{loadingSteps[loadingStep]}</p>

        {/* Progress Bar */}
        <div className="h-2 w-full rounded-full bg-gray-200">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{
              width: `${((loadingStep + 1) / loadingSteps.length) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Loading Steps List */}
        <div className="mt-6 space-y-2 text-left">
          {loadingSteps.map((step, index) => (
            <motion.div
              key={index}
              className={`flex items-center gap-3 text-sm ${
                index <= loadingStep ? "text-purple-600" : "text-gray-400"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  index < loadingStep
                    ? "bg-green-500"
                    : index === loadingStep
                      ? "animate-pulse bg-purple-500"
                      : "bg-gray-300"
                }`}
              />
              {step}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4">
      <motion.div
        className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl sm:p-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Success Icon or Loading */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.5,
            type: "spring",
            stiffness: 200,
          }}
        >
          {renderIcon()}
        </motion.div>

        {/* Title */}
        <motion.h1
          className="mb-4 text-2xl font-bold text-gray-800 sm:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {isComplete ? "Welcome to Gighub!" : "Setting Up Your Account"}
        </motion.h1>

        {/* User Type Badge */}
        {renderUserTypeBadge()}

        {/* Loading Steps or Success Message */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          {renderContent()}
        </motion.div>

        {/* Email Display */}
        <motion.div
          className="rounded-xl bg-gray-50 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          <p className="mb-1 text-sm text-gray-500">Signed in as:</p>
          <p className="font-medium text-gray-800">{email}</p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-purple-200 opacity-20" />
        <div className="absolute bottom-4 left-4 h-6 w-6 rounded-full bg-blue-200 opacity-20" />
        <div className="absolute top-1/3 left-4 h-4 w-4 rounded-full bg-green-200 opacity-20" />
      </motion.div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-200 opacity-10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-blue-200 opacity-10 blur-3xl" />
        <div className="absolute top-3/4 left-1/3 h-48 w-48 rounded-full bg-green-200 opacity-10 blur-3xl" />
      </div>
    </div>
  );
};

export default memo(SocialSignupSuccess);
