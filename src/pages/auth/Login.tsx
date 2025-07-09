import React, { memo, useState } from "react";
import loginRight from "../../assets/icons/loginRight.png";
import googleLogo from "../../assets/icons/gLogo.svg";
import linkedInLogo from "../../assets/icons/lLogo.svg";
import microsoftLogo from "../../assets/icons/mLogo.svg";
import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import { useAuth } from "../../store/useAuth";
import { Link, useNavigate } from "react-router-dom";
import CustomCheckbox from "../../components/common/CustomCheckbox";
import { useChatStore } from "../../store/useChatStore";
import { ApplicantData, EmployerData, Role } from "../../utils/types";
import { UserType } from "../../utils/enums.ts";
import { useSubscriptionStore } from "../../store/useSubscriptionStore.ts";

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
    handleLinkedinLogin
  } = useAuth();

  const navigate = useNavigate();
  const { getUserSubscription, getUserSubscriptionHistory } = useSubscriptionStore();

  // Handle login submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response: ApplicantData | EmployerData | null = await login(credentials);

      if (response) {
        // Set authentication data
        setAuthToken(response.token as string);
        setAuthRole(response.role as Role);
        setSender(credentials.email);
        setProfileData(response);
        setEmail(credentials.email);
        setUserType(response.userType as UserType);

        // Handle user type specific data and subscriptions
        if ("userType" in response && response.userType === UserType.APPLICANT) {
          setApplicantData(response as ApplicantData);
        } else {
          setEmployerData(response as EmployerData);
        }

        // Fetch subscription data if user ID exists
        if (response.id) {
          await Promise.all([
            getUserSubscription(response.id),
            getUserSubscriptionHistory(response.id)
          ]);
        }

        // Navigate to profile
        navigate(`/${response.userType}/profile`);
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error state here if needed
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
  };

  // Social login handlers with error handling
  const handleSocialLogin = (loginHandler: () => Promise<void> | void) => async () => {
    try {
      await loginHandler();
    } catch (error) {
      console.error("Social login failed:", error);
      // Handle error state here if needed
    }
  };

  return (
    <div className="relative mx-auto my-auto flex h-screen flex-row items-center justify-evenly space-x-0">
      <h1 className="hidden md:flex absolute top-[32px] left-[32px] text-[#674EE5EE] text-[28px] font-bold ">Let Sign
        You In</h1>
      {/* Left Side - Form Section */}
      <div className="flex md:h-[890px] w-full flex-col items-center justify-center gap-y-6 px-5 md:px-10 lg:w-1/2 xl:w-1/3">
        <div className="flex w-full flex-col gap-y-4">
          {/* Logo */}
          <div className="flex justify-center items-center gap-x-2">
            <img
              className="h-[41px] w-[41px]"
              src={gighubLogo}
              alt="Gighub Logo"
            />
            <h1 className="text-[#FA4E09] text-[20px] font-[900]">GigHub</h1>
          </div>


          {/* Header Section */}
          <div className="mx-auto mb-5 text-center">
            <h1 className="text-[22px] font-semibold sm:text-[25px] md:text-[32px]">
              Login Into Your Account
            </h1>
            <p className="text-[13px] text-[#AFAFAF] sm:text-[14px] md:text-[16px]">
              Welcome Back! Select method to login:
            </p>
          </div>

          {/* Social Login Options */}
          <div className="flex flex-row justify-center gap-x-4 px-4 lg:gap-x-10">
            <button
              type="button"
              onClick={handleSocialLogin(handleGoogleLogin)}
              className="w-4/12 cursor-pointer transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-300 lg:w-4/12"
              aria-label="Login with Google"
            >
              <img
                className="w-full"
                src={googleLogo}
                alt=""
              />
            </button>
            <button
              type="button"
              onClick={handleSocialLogin(handleLinkedinLogin)}
              className="w-4/12 cursor-pointer transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-300 lg:w-4/12"
              aria-label="Login with LinkedIn"
            >
              <img
                className="w-full"
                src={linkedInLogo}
                alt=""
              />
            </button>
            <button
              type="button"
              onClick={handleSocialLogin(handleOutlookLogin)}
              className="w-4/12 cursor-pointer transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-300 lg:w-4/12"
              aria-label="Login with Microsoft"
            >
              <img
                className="w-full"
                src={microsoftLogo}
                alt=""
              />
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} autoComplete="on" className="mb-12 flex w-full flex-col gap-y-4">
            <p className="text-center text-[#AFAFAF]">
              Or continue with email
            </p>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleInputChange('email')}
                className="w-full rounded-[16px] border-none bg-[#F4F7FA] p-3 transition-colors focus:border-none focus:ring-0 focus:outline-none md:p-4"
                placeholder="Email"
                autoComplete="username"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleInputChange('password')}
                className="w-full rounded-[16px] border-none bg-[#F4F7FA] p-3 transition-colors focus:border-none focus:ring-0 focus:outline-none md:p-4"
                placeholder="Password"
                autoComplete="current-password"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="mb-10 flex w-full flex-row items-center justify-between">
              <div className="flex cursor-pointer flex-row items-center justify-evenly gap-x-2">
                <CustomCheckbox
                  checked={credentials.rememberMe}
                  onChange={handleInputChange('rememberMe')}
                  label="Remember me"
                  size={19}
                  borderColor="#D9D9D9"
                  checkColor="#6E4AED"
                />
              </div>
              <Link
                to="/forgot-password"
                className="cursor-pointer text-[#6438C2] transition-colors hover:text-[#542F9E] focus:outline-none focus:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full rounded-[16px] bg-[#6438C2] py-3 text-white transition-colors hover:bg-[#542F9E] focus:outline-none focus:ring-2 focus:ring-[#6438C2] focus:ring-offset-2 md:px-4 md:py-4"
            >
              Login
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-left">
            Don't have an account?{" "}
            <Link
              to="/user-type-selection"
              className="text-[#6438C2] transition-colors hover:text-[#542F9E] focus:outline-none focus:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image Section */}
      <img
        className="hidden h-[890px] object-cover lg:flex"
        src={loginRight}
        alt="Login Illustration"
      />
    </div>
  );
};

export const Login = memo(LoginPage);
