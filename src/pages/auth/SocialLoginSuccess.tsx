import React, { memo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserType } from "../../utils/enums.ts";
import { removeFromLocalStorage, useAuth } from "../../store/useAuth.ts";
import { ApplicantData, ApplicantPersonalInfo, EmployerData, Role } from "../../utils/types";
import { useChatStore } from "../../store/useChatStore.ts";
import { useSubscriptionStore } from "../../store/useSubscriptionStore.ts";
import { CheckCircle, User, Briefcase, Loader2, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { storage } from "../../utils/helpers.ts";

const SocialLoginSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const userType = searchParams.get('userType') as UserType;
  const email = searchParams.get('email');

  const navigate = useNavigate();
  const { setSender } = useChatStore();
  const { getUserSubscription, getUserSubscriptionHistory } = useSubscriptionStore();
  const {
    setIsAuthenticated,
    getUserByEmail,
    setAuthRole,
    setProfileData,
    setEmail,
    setUserType,
    setApplicantData,
    setEmployerData,
    setApplicantPersonalInfo
  } = useAuth();

  const [loadingStep, setLoadingStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const loadingSteps = [
    "Authenticating your session...",
    "Loading your profile...",
    "Syncing your data...",
    "Welcome back!"
  ];

  useEffect(() => {
    const authenticateUser = async () => {
      console.log("Starting login process with:", { token, email, userType });

      if (!token || !email || !userType) {
        console.log("Missing required params, redirecting to login");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await removeFromLocalStorage();
        navigate("/login");
        return;
      }

      try {
        // Step 1: Authentication
        setLoadingStep(0);
        storage.setItem('authToken', token);
        setIsAuthenticated(true);
        setEmail(email);
        setUserType(userType);
        await new Promise(resolve => setTimeout(resolve, 600));

        // Step 2: Load user profile
        setLoadingStep(1);
        const response = await getUserByEmail(email);
        console.log("User profile response:", response);

        if (response?.statusCode !== 200 || !response?.data) {
          throw new Error(`Failed to load user profile. Status: ${response?.statusCode}`);
        }

        const userData = response.data;
        setApplicantPersonalInfo(userData as ApplicantPersonalInfo);

        // Step 3: Sync user data
        setLoadingStep(2);
        setAuthRole(userData.role as Role);
        setSender(email);
        setProfileData(userData);

        // Set user-specific data and sync subscriptions
        if ("userType" in userData && userData.userType === UserType.APPLICANT) {
          setApplicantData(userData as ApplicantData);
        } else {
          setEmployerData(userData as EmployerData);
        }

        if (userData.id) {
          await Promise.all([
            getUserSubscription(userData.id),
            getUserSubscriptionHistory(userData.id)
          ]);
        }

        await new Promise(resolve => setTimeout(resolve, 600));

        // Step 4: Complete login
        setLoadingStep(3);
        await new Promise(resolve => setTimeout(resolve, 600));

        setIsComplete(true);

        // Navigate to appropriate dashboard
        setTimeout(() => {
          const dashboardPath = userType === UserType.APPLICANT
            ? "/applicant/dashboard"
            : "/employer/dashboard";
          navigate(dashboardPath);
        }, 1500);

      } catch (error) {
        console.error("Login failed:", error);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await removeFromLocalStorage();
        navigate("/login");
      }
    };

    authenticateUser().then(r=>r);
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
    getUserSubscriptionHistory
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
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <motion.div
            className="absolute -inset-2 bg-green-200 rounded-full -z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.3 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </motion.div>
      );
    }

    return (
      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    );
  };

  const renderUserTypeBadge = () => (
    <motion.div
      className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
    >
      <LogIn className="w-4 h-4" />
      {userType === UserType.APPLICANT ? (
        <>
          <User className="w-4 h-4" />
          Job Seeker
        </>
      ) : (
        <>
          <Briefcase className="w-4 h-4" />
          Employer
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
          <p className="text-gray-600 mb-4">
            Welcome back! You've been successfully logged in.
          </p>
          <p className="text-sm text-gray-500">
            Taking you to your dashboard...
          </p>
        </motion.div>
      );
    }

    return (
      <div className="space-y-4">
        <p className="text-gray-600 font-medium">
          {loadingSteps[loadingStep]}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Loading Steps List */}
        <div className="text-left space-y-2 mt-6">
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
                className={`w-2 h-2 rounded-full ${
                  index < loadingStep
                    ? "bg-green-500"
                    : index === loadingStep
                      ? "bg-purple-500 animate-pulse"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full text-center relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Success Icon or Loading */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
        >
          {renderIcon()}
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {isComplete ? "Welcome Back!" : "Logging You In"}
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
          className="bg-gray-50 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          <p className="text-sm text-gray-500 mb-1">Logged in as:</p>
          <p className="text-gray-800 font-medium">{email}</p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-purple-200 rounded-full opacity-20" />
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-blue-200 rounded-full opacity-20" />
        <div className="absolute top-1/3 left-4 w-4 h-4 bg-green-200 rounded-full opacity-20" />
      </motion.div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200 rounded-full opacity-10 blur-3xl" />
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-green-200 rounded-full opacity-10 blur-3xl" />
      </div>
    </div>
  );
};

export default memo(SocialLoginSuccess);
