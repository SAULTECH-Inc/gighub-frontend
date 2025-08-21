import React, { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import loginRight from "../../assets/icons/loginRight.png";
import googleLogo from "../../assets/icons/gLogo.svg";
import linkedInLogo from "../../assets/icons/lLogo.svg";
import microsoftLogo from "../../assets/icons/mLogo.svg";
import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import { useAuth } from "../../store/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CustomCheckbox from "../../components/common/CustomCheckbox";
import { useChatStore } from "../../store/useChatStore";
import { ApplicantData, EmployerData, Role } from "../../utils/types";
import { UserType } from "../../utils/enums.ts";
import { useSubscriptionStore } from "../../store/useSubscriptionStore.ts";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  LogIn,
  Loader2,
  Shield
} from "lucide-react";
import { USER_TYPE } from "../../utils/helpers.ts";

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [socialLoading, setSocialLoading] = useState<{[key: string]: boolean}>({});

  const { setSender } = useChatStore();
  const {
    login,
    setAuthToken,
    setAuthRole,
    setApplicantData,
    setEmployerData,
    setProfileData,
    setEmail,
    setUserType,
    handleGoogleLogin,
    handleOutlookLogin,
    handleLinkedinLogin,
    isAuthenticated,
    profileData
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const { getUserSubscription, getUserSubscriptionHistory } = useSubscriptionStore();

  // Helper function to validate userType
  const isValidUserType = (userType: any): boolean => {
    return userType &&
      userType !== 'null' &&
      userType !== null &&
      userType !== undefined &&
      typeof userType === 'string' &&
      userType.trim() !== '';
  };

  // Get the intended destination from location state or default routes
  const getRedirectPath = (userType?: string) => {
    // First, check if there's a 'from' parameter in location state
    const from = location.state?.from?.pathname;
    if (from) {
      return from;
    }

    // If we have a valid userType, redirect to their profile
    if (userType && isValidUserType(userType)) {
      return `/${userType}/profile`;
    }

    // If user has profile data with valid userType, redirect to their profile
    if (profileData?.userType && isValidUserType(profileData.userType)) {
      return `/${profileData.userType}/profile`;
    }

    // Default fallback routes
    return `/dashboard`;
  };

  // Only redirect if we have authenticated user with complete and valid profile data
  useEffect(() => {
    if (isAuthenticated && profileData?.userType && isValidUserType(profileData.userType)) {
      const redirectPath = getRedirectPath();
      console.log('Redirecting authenticated user to:', redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, profileData?.userType, navigate]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!credentials.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!credentials.password.trim()) {
      newErrors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response: ApplicantData | EmployerData | null = await login(credentials);

      if (response) {
        console.log('Login response:', response);

        // Validate the response has required data
        if (!response.userType || !isValidUserType(response.userType)) {
          console.error('Invalid userType in response:', response.userType);
          setErrors({ general: "Invalid user data received. Please contact support." });
          return;
        }

        // Set authentication data
        setAuthToken(response.token as string);
        setAuthRole(response.role as Role);
        setSender(credentials.email);
        setProfileData(response);
        setEmail(credentials.email);
        setUserType(response.userType as UserType);

        // Handle user type specific data
        if ("userType" in response && response.userType === UserType.APPLICANT) {
          setApplicantData(response as ApplicantData);
        } else {
          setEmployerData(response as EmployerData);
        }

        // Fetch subscription data if user ID exists
        if (response.id) {
          try {
            await Promise.all([
              getUserSubscription(response.id),
              getUserSubscriptionHistory(response.id)
            ]);
          } catch (subscriptionError) {
            console.warn('Failed to fetch subscription data:', subscriptionError);
            // Don't block login for subscription errors
          }
        }

        // Navigate with proper userType validation
        const redirectPath = getRedirectPath(response.userType);
        console.log('Login successful, redirecting to:', redirectPath);
        navigate(redirectPath, { replace: true });
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ general: "Invalid email or password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'rememberMe' ? e.target.checked : e.target.value;
    setCredentials(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  // Social login handlers with error handling
  const handleSocialLogin = (provider: string, loginHandler: () => Promise<void> | void) => async () => {
    setSocialLoading(prev => ({ ...prev, [provider]: true }));
    try {
      await loginHandler();
      // Social login success will be handled by the useEffect hook
      // which will redirect once profileData is updated
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      setErrors({ general: `${provider} login failed. Please try again.` });
    } finally {
      setSocialLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const socialProviders = [
    {
      name: "Google",
      logo: googleLogo,
      handler: handleGoogleLogin,
      color: "hover:bg-red-50 focus:ring-red-300"
    },
    {
      name: "LinkedIn",
      logo: linkedInLogo,
      handler: handleLinkedinLogin,
      color: "hover:bg-blue-50 focus:ring-blue-300"
    },
    {
      name: "Microsoft",
      logo: microsoftLogo,
      handler: handleOutlookLogin,
      color: "hover:bg-blue-50 focus:ring-blue-300"
    }
  ];

  // Check if we're waiting for complete profile data
  const isWaitingForProfileData = isAuthenticated && (!profileData || !isValidUserType(profileData.userType));

  // Show loading state while checking authentication or waiting for profile data
  if (isAuthenticated && isValidUserType(profileData?.userType)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#6438C2] mx-auto mb-4" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Show loading state while waiting for complete profile data
  if (isWaitingForProfileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#6438C2] mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex flex-col lg:flex-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header for mobile */}
      <motion.div
        className="lg:hidden bg-white shadow-sm p-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2">
          <img className="h-8 w-8" src={gighubLogo} alt="GigHub Logo" />
          <h1 className="text-[#FA4E09] text-lg font-black">GigHub</h1>
        </div>
      </motion.div>

      {/* Welcome header for desktop */}
      <motion.h1
        className="hidden lg:block absolute top-8 left-8 text-[#674EE5EE] text-2xl xl:text-3xl font-bold z-10"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Let's Sign You In
      </motion.h1>

      {/* Left Side - Form Section */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <motion.div
          className="w-full max-w-md space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Logo for desktop */}
          <motion.div
            className="hidden lg:flex justify-center items-center gap-2 mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <img className="h-10 w-10" src={gighubLogo} alt="GigHub Logo" />
            <h1 className="text-[#FA4E09] text-xl font-black">GigHub</h1>
          </motion.div>

          {/* Header Section */}
          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Select your preferred sign-in method
            </p>
          </motion.div>

          {/* Social Login Options */}
          <motion.div
            className="grid grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {socialProviders.map((provider) => (
              <motion.button
                key={provider.name}
                type="button"
                onClick={handleSocialLogin(provider.name, provider.handler)}
                disabled={socialLoading[provider.name] || isLoading}
                className={`relative border-none hover:bg-transparent transition-all duration-200 ${provider.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`Login with ${provider.name}`}
              >
                {socialLoading[provider.name] ? (
                  <Loader2 className="w-6 h-6 mx-auto animate-spin text-gray-600" />
                ) : (
                  <img
                    className="w-full h-full mx-auto"
                    src={provider.logo}
                    alt={`${provider.name} logo`}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500">Or continue with email</span>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.form
            onSubmit={handleLogin}
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {/* General Error */}
            <AnimatePresence>
              {errors.general && (
                <motion.div
                  className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.general}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                <Mail className="inline w-4 h-4 mr-1" />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleInputChange('email')}
                className={`w-full px-4 py-3 border rounded-lg transition-colors focus:ring-2 focus:ring-[#6438C2] focus:border-transparent ${
                  errors.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="Enter your email"
                autoComplete="username"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                <Lock className="inline w-4 h-4 mr-1" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleInputChange('password')}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg transition-colors focus:ring-2 focus:ring-[#6438C2] focus:border-transparent ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <CustomCheckbox
                checked={credentials.rememberMe}
                onChange={handleInputChange('rememberMe')}
                label="Remember me"
                size={19}
                borderColor="#D9D9D9"
                checkColor="#6E4AED"
                disabled={isLoading}
              />
              <Link
                to="/forgot-password"
                className="text-sm text-[#6438C2] hover:text-[#542F9E] transition-colors focus:outline-none focus:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#6438C2] hover:bg-[#542F9E] active:transform active:scale-[0.98]"
              } focus:ring-2 focus:ring-[#6438C2] focus:ring-offset-2`}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </div>
              )}
            </motion.button>
          </motion.form>

          {/* Sign Up Link */}
          <motion.p
            className="text-center text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            Don't have an account?{" "}
            <Link
              to="/user-type-selection"
              className="font-semibold text-[#6438C2] hover:text-[#542F9E] transition-colors focus:outline-none focus:underline"
            >
              Sign up
            </Link>
          </motion.p>

          {/* Security Note */}
          <motion.div
            className="text-center text-xs text-gray-500 border-t pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Your data is protected with enterprise-grade security</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Image Section */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 xl:w-2/5 items-center justify-center p-4"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <img
          className="max-w-full h-auto max-h-[600px] xl:max-h-[700px] object-contain"
          src={loginRight}
          alt="Login Illustration"
        />
      </motion.div>
    </motion.div>
  );
};

export const Login = memo(LoginPage);