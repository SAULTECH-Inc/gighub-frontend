import React, { useState } from "react";
import { motion } from "framer-motion";
import { calculatePasswordStrength } from "../../../../utils/helpers.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../store/useAuth.ts";
import { EmployerSignupRequest } from "../../../../utils/types";
import { Eye, EyeOff } from "lucide-react";

// Define the Zod schema
const schema = z
  .object({
    companyName: z.string().min(1, "Company Name is required"),
    email: z.string().email("Invalid email address"),
    companyPhone: z.string().min(1, "Phone is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

interface StepOneProp {
  handleNext: () => void;
}

const EmployerSignupStepOne: React.FC<StepOneProp> = ({ handleNext }) => {
  const { employerSignupRequest, setEmployerSignupRequest, verifyAccount } =
    useAuth();
  const [accountExist, setAccountExist] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: employerSignupRequest?.companyName,
      email: employerSignupRequest?.email,
      companyPhone: employerSignupRequest?.companyPhone,
      password: employerSignupRequest?.password,
      confirmPassword: employerSignupRequest?.confirmPassword,
    },
  });

  const password = watch("password");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const strength = calculatePasswordStrength(e.target.value);
    setPasswordStrength(strength);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const onSubmit = async (data: FormData) => {
    const exist = await verifyAccount(data.email);
    if (exist) {
      setAccountExist(exist);
      return;
    }

    setEmployerSignupRequest({
      ...employerSignupRequest,
      companyName: data.companyName,
      email: data.email,
      companyPhone: data.companyPhone,
      password: data.password,
      confirmPassword: data.confirmPassword,
    } as EmployerSignupRequest);

    handleNext();
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

  return (
    <motion.div
      className="w-full space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="space-y-2 text-center">
        <motion.h2
          className="text-2xl font-semibold text-gray-900 sm:text-3xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Company Profile Setup
        </motion.h2>
        <motion.p
          className="text-sm text-gray-600 sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Let's get your company profile set up
        </motion.p>
      </div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Company Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("companyName")}
            className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#6438C2] ${
              errors.companyName
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Enter your company name"
          />
          {errors.companyName && (
            <p className="text-sm text-red-600">{errors.companyName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            {...register("email")}
            className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#6438C2] ${
              errors.email || accountExist
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Enter your email address"
            onChange={() => setAccountExist(false)}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
          {accountExist && (
            <p className="text-sm text-red-600">
              Account with this email already exists
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register("companyPhone")}
            className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#6438C2] ${
              errors.companyPhone
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            placeholder="Enter your phone number"
          />
          {errors.companyPhone && (
            <p className="text-sm text-red-600">
              {errors.companyPhone.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              {...register("password")}
              onChange={handlePasswordChange}
              className={`w-full rounded-lg border px-4 py-3 pr-12 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#6438C2] ${
                errors.password
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-1/2 right-3 -translate-y-1/2 transform p-1 text-gray-500 transition-colors hover:text-gray-700"
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Password Strength Indicator */}
        {password && (
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
            <p
              className={`text-right text-sm font-medium ${getPasswordStrengthColor()}`}
            >
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
              {...register("confirmPassword")}
              disabled={!password}
              className={`w-full rounded-lg border px-4 py-3 pr-12 transition-colors focus:border-transparent focus:ring-2 focus:ring-[#6438C2] ${
                errors.confirmPassword
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              } ${!password ? "cursor-not-allowed bg-gray-100" : ""}`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              disabled={!password}
              className="absolute top-1/2 right-3 -translate-y-1/2 transform p-1 text-gray-500 transition-colors hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {confirmPasswordVisible ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`w-full rounded-lg px-4 py-3 font-medium text-white transition-all duration-200 ${
            isSubmitting
              ? "cursor-not-allowed bg-gray-400"
              : "bg-[#6E4AED] hover:bg-[#5931A9] active:scale-[0.98] active:transform"
          } focus:ring-2 focus:ring-[#6438C2] focus:ring-offset-2`}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing...
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
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Already have an account?{" "}
        <Link
          className="font-semibold text-[#6E4AED] transition-colors hover:text-[#5931A9]"
          to="/login"
        >
          Sign in
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default EmployerSignupStepOne;
