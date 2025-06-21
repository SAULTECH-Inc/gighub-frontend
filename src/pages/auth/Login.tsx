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

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
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
  } = useAuth();

  const navigate = useNavigate();

  const { getUserSubscription, getUserSubscriptionHistory } =
    useSubscriptionStore();

  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response: ApplicantData | EmployerData | null =
      await login(credentials);

    if (response) {
      setAuthToken(response?.token as string);
      setAuthRole(response?.role as Role);
      setSender(credentials.email);
      setProfileData(response);
      setEmail(credentials.email);
      setUserType(response?.userType as UserType);

      if ("userType" in response && response.userType === UserType.APPLICANT) {
        setApplicantData(response as ApplicantData);
        // Fetch user subscription for applicant
        if (response.id) {
          getUserSubscription(response.id);
          getUserSubscriptionHistory(response.id);
        }
      } else {
        setEmployerData(response as EmployerData);
        // Fetch user subscription for employer
        if (response.id) {
          getUserSubscription(response.id);
          getUserSubscriptionHistory(response.id);
        }
      }

      navigate(`/${response.userType}/profile`);
    }
  };

  // Handle remember me toggle
  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prevState) => ({
      ...prevState,
      rememberMe: e.target.checked,
    }));
  };

  return (
    <>
      <form
        autoComplete="on"
        onSubmit={handleLogin}
        className="mx-auto my-auto flex h-screen flex-row items-center justify-evenly space-x-0"
      >
        {/* Left Side - Form Section */}
        <div className="flex h-[890px] w-full flex-col items-center justify-center gap-y-6 px-5 md:px-10 lg:w-1/2 xl:w-1/3">
          <div className="flex w-full flex-col gap-y-1">
            {/* Logo */}
            <img
              className="mx-auto h-40 w-40"
              src={gighubLogo}
              alt="Gighub Logo"
            />

            <div className="mx-auto mb-5 text-center">
              <h1 className="text-[22px] sm:text-[25px] md:text-[32px]">
                Login Into Your Account
              </h1>
              <p className="text-[13px] text-[#AFAFAF] sm:text-[14px] md:text-[16px]">
                Welcome Back! Select method to login:
              </p>
            </div>

            {/* Social Login Options */}
            <div className="flex flex-row justify-center gap-x-4 px-4 lg:gap-x-10">
              <img
                className="w-4/12 cursor-pointer lg:w-4/12"
                src={googleLogo}
                alt="Login with Google"
              />
              <img
                className="w-4/12 cursor-pointer lg:w-4/12"
                src={linkedInLogo}
                alt="Login with LinkedIn"
              />
              <img
                className="w-4/12 cursor-pointer lg:w-4/12"
                src={microsoftLogo}
                alt="Login with Microsoft"
              />
            </div>

            {/* Email & Password Login */}
            <div className="mt-12 flex w-full flex-col gap-y-4">
              <p className="text-center text-[#AFAFAF]">
                Or continue with email
              </p>

              {/* Email Input */}
              <input
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="w-full rounded-[16px] border-none bg-[#F4F7FA] p-3 focus:border-none focus:outline-none focus:ring-0 md:p-4"
                type="email"
                placeholder="Email"
                autoComplete="username"
                required
              />

              {/* Password Input */}
              <input
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full rounded-[16px] border-none bg-[#F4F7FA] p-3 focus:border-none focus:outline-none focus:ring-0 md:p-4"
                type="password"
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
                  onChange={handleRememberMe}
                  label="Remember me"
                  size={19}
                  borderColor="#D9D9D9"
                  checkColor="#6E4AED"
                />
              </div>
              <Link to="/forgot-password" className="cursor-pointer">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full rounded-[16px] bg-[#6438C2] py-3 text-white hover:bg-[#542F9E] md:px-4 md:py-4"
            >
              Login
            </button>

            {/* Sign Up Link */}
            <p className="text-left">
              Don't have an account?{" "}
              <Link to="/user-type-selection" className="text-[#6438C2]">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Image Section */}
        <img
          className="hidden h-[890px] lg:flex"
          src={loginRight}
          alt="Login Illustration"
        />
      </form>
    </>
  );
};

export const Login = memo(LoginPage);
