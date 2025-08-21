import React, { useState } from "react";
import { motion } from "framer-motion";
import googleLogo from "../../../../assets/icons/googleLogo.svg";
import microsoftLogo from "../../../../assets/icons/microsoftLogo.svg";
import linkedinLogo from "../../../../assets/icons/linkedinLogo.svg";
import { calculatePasswordStrength } from "../../../../utils/helpers.ts";
import { useAuth } from "../../../../store/useAuth.ts";
import { APIResponse, ApplicantSignupRequest } from "../../../../utils/types";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";

interface StepOneProp {
  handleNext: () => void;
}

// Add this interface for the API response
interface EmailCheckResponse {
  exists: boolean;
  message?: string;
}

const ApplicantSignupStepOne: React.FC<StepOneProp> = ({ handleNext }) => {
  const { applicantSignupRequest, setApplicantSignupRequest, validateEmailAssociationToAnAccount } = useAuth();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // API call to check if email exists
  const checkEmailExists = async (email: string): Promise<EmailCheckResponse> => {
    try {
      // Replace with your actual API endpoint
      const response: APIResponse<any> = await validateEmailAssociationToAnAccount(email);

      if (response.statusCode === 200) {
        throw new Error('Network response was not ok');
      }

      return await response.data;
    } catch (error) {
      console.error('Error checking email:', error);
      // Return false on error to allow user to continue
      return { exists: false, message: 'Unable to verify email. Please try again.' };
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // Clear error if passwords now match
    if (value === applicantSignupRequest?.password && formErrors.confirmPassword) {
      setFormErrors(prev => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...rest } = prev;
        return rest;
      });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplicantSignupRequest({
      ...applicantSignupRequest,
      [name]: value,
    } as ApplicantSignupRequest);

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    const strength = calculatePasswordStrength(e.target.value);
    setPasswordStrength(strength);
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    // Required field validation
    if (!applicantSignupRequest?.firstName?.trim()) {
      errors.firstName = "First name is required";
    }
    if (!applicantSignupRequest?.lastName?.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!applicantSignupRequest?.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(applicantSignupRequest.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!applicantSignupRequest?.phoneNumber?.trim()) {
      errors.phoneNumber = "Phone number is required";
    }
    if (!applicantSignupRequest?.password?.trim()) {
      errors.password = "Password is required";
    } else if (passwordStrength < 3) {
      errors.password = "Password is too weak. Please use a stronger password";
    }
    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== applicantSignupRequest?.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const next = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setIsCheckingEmail(true);

    try {
      // Check if email already exists
      const emailCheck = await checkEmailExists(applicantSignupRequest.email!);

      if (emailCheck) {
        setFormErrors(prev => ({
          ...prev,
          email: "An account with this email already exists. Please use a different email or sign in."
        }));
        return;
      }

      // If email doesn't exist, proceed to next step
      // Simulate additional processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      handleNext();

    } catch (error) {
      console.error('Error during email validation:', error);
      setFormErrors(prev => ({
        ...prev,
        email: "Unable to verify email. Please try again."
      }));
    } finally {
      setIsSubmitting(false);
      setIsCheckingEmail(false);
    }
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 3) return "Weak";
    if (passwordStrength < 5) return "Medium";
    return "Strong";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 3) return "text-red-500";
    if (passwordStrength < 5) return "text-yellow-500";
    return "text-green-500";
  };

  const socialProviders = [
    { name: "Google", logo: googleLogo, color: "hover:bg-red-50" },
    { name: "Microsoft", logo: microsoftLogo, color: "hover:bg-blue-50" },
    { name: "LinkedIn", logo: linkedinLogo, color: "hover:bg-blue-50" },
  ];

  // Check if passwords match for the confirm password field
  const passwordsMatch = confirmPassword && confirmPassword === applicantSignupRequest?.password;

  return (
    <motion.div
      className="w-full space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <UserPlus className="w-8 h-8 text-[#6438C2]" />
        </motion.div>

        <motion.h2
          className="text-2xl sm:text-3xl font-semibold text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Welcome to GigHub!
        </motion.h2>

        <motion.p
          className="text-gray-600 text-sm sm:text-base max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Let's start building your career profile. We'll ask a few quick questions to tailor opportunities just for you.
        </motion.p>
      </div>

      {/* Form */}
      <motion.form
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <User className="inline w-4 h-4 mr-1" />
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={applicantSignupRequest?.firstName || ""}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6438C2] focus:border-transparent transition-colors ${
                formErrors.firstName
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Enter your first name"
            />
            {formErrors.firstName && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.firstName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={applicantSignupRequest?.lastName || ""}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6438C2] focus:border-transparent transition-colors ${
                formErrors.lastName
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Enter your last name"
            />
            {formErrors.lastName && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Middle Name and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Middle Name
            </label>
            <input
              type="text"
              name="middleName"
              value={applicantSignupRequest?.middleName || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6438C2] focus:border-transparent transition-colors hover:border-gray-400"
              placeholder="Enter your middle name (optional)"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Mail className="inline w-4 h-4 mr-1" />
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={applicantSignupRequest?.email || ""}
                onChange={handleChange}
                className={`w-full px-4 py-3 ${isCheckingEmail ? 'pr-12' : ''} border rounded-lg focus:ring-2 focus:ring-[#6438C2] focus:border-transparent transition-colors ${
                  formErrors.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="Enter your email address"
              />
              {isCheckingEmail && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#6438C2]" />
                </div>
              )}
            </div>
            {formErrors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {formErrors.email}
              </p>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Phone className="inline w-4 h-4 mr-1" />
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={applicantSignupRequest?.phoneNumber || ""}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6438C2] focus:border-transparent transition-colors ${
              formErrors.phoneNumber
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Enter your phone number"
          />
          {formErrors.phoneNumber && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {formErrors.phoneNumber}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Lock className="inline w-4 h-4 mr-1" />
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={applicantSignupRequest?.password || ""}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#6438C2] focus:border-transparent transition-colors ${
                formErrors.password
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formErrors.password && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {formErrors.password}
            </p>
          )}
        </div>

        {/* Password Strength Indicator */}
        {applicantSignupRequest?.password && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                    index <= passwordStrength ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className={`text-sm text-right font-medium ${getPasswordStrengthColor()}`}>
              <Shield className="inline w-3 h-3 mr-1" />
              {getPasswordStrengthText()}
            </p>
          </motion.div>
        )}

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              disabled={!applicantSignupRequest?.password}
              className={`w-full px-4 py-3 ${passwordsMatch ? 'pr-20' : 'pr-12'} border rounded-lg focus:ring-2 focus:ring-[#6438C2] focus:border-transparent transition-colors ${
                formErrors.confirmPassword
                  ? "border-red-500 bg-red-50"
                  : passwordsMatch
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
              } ${!applicantSignupRequest?.password ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="Confirm your password"
            />

            {/* Check icon - positioned further left when visible */}
            {passwordsMatch && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            )}

            {/* Eye icon - always in the same position */}
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              disabled={!applicantSignupRequest?.password}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {confirmPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formErrors.confirmPassword && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {formErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="button"
          onClick={next}
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#6E4AED] hover:bg-[#5931A9] active:transform active:scale-[0.98]"
          } focus:ring-2 focus:ring-[#6438C2] focus:ring-offset-2`}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isCheckingEmail ? "Checking email..." : "Processing..."}
            </div>
          ) : (
            "Continue"
          )}
        </motion.button>
      </motion.form>

      {/* Sign-in Link */}
      <motion.div
        className="text-center text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Already have an account?{" "}
        <Link
          className="font-semibold text-[#6E4AED] hover:text-[#5931A9] transition-colors"
          to="/login"
        >
          Sign in
        </Link>
      </motion.div>

      {/* Social Login */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-50 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {socialProviders.map((provider) => (
            <motion.button
              key={provider.name}
              type="button"
              className={`flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg transition-colors ${provider.color} hover:border-gray-400`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img src={provider.logo} alt={`${provider.name} logo`} className="w-5 h-5" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {provider.name}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Terms and Conditions */}
      <motion.div
        className="text-center text-xs text-gray-500 border-t pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p>
          By signing up, you agree to our{" "}
          <Link to="/privacy" className="text-[#6E4AED] hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link to="/terms" className="text-[#6E4AED] hover:underline">
            Terms of Service
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ApplicantSignupStepOne;