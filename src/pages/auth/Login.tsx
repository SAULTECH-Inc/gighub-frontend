import React, { useState } from "react";
import loginRight from "../../assets/icons/loginRight.png";
import googleLogo from "../../assets/icons/gLogo.svg";
import linkedInLogo from "../../assets/icons/lLogo.svg";
import microsoftLogo from "../../assets/icons/mLogo.svg";
import gighubLogo from "../../assets/icons/gighubLogoSmall.svg";
import { useAuth } from "../../store/useAuth";
import { Link, useNavigate } from "react-router-dom";
import CustomCheckbox from "../../components/common/CustomCheckbox";
import { useChatStore } from "../../store/useChatStore";
import {ApplicantData, EmployerData, Role} from "../../utils/types";
import {UserType} from "../../utils/enums.ts";

export const Login = () => {
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

    // Handle login submission
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const response: ApplicantData | EmployerData | null = await login(credentials);

        if (response) {
            setAuthToken(response?.token as string);
            setAuthRole(response?.role as Role);
            setSender(credentials.email);
            setProfileData(response);
            setEmail(credentials.email);
            setUserType(response?.userType as UserType);

            if ("userType" in response && response.userType === UserType.APPLICANT) {
                setApplicantData(response as ApplicantData);
            } else {
                setEmployerData(response as EmployerData);
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
                onSubmit={handleLogin}
                className="h-screen flex flex-row justify-evenly space-x-0 items-center mx-auto my-auto"
            >
                {/* Left Side - Form Section */}
                <div className="flex flex-col gap-y-6 justify-center items-center w-full px-5 md:px-10 lg:w-1/2 xl:w-1/3 h-[890px]">
                    <div className="flex flex-col w-full gap-y-1">
                        {/* Logo */}
                        <img className="h-40 w-40 mx-auto" src={gighubLogo} alt="Gighub Logo" />

                        <div className="mx-auto mb-5 text-center">
                            <h1 className="text-[22px] sm:text-[25px] md:text-[32px]">
                                Login Into Your Account
                            </h1>
                            <p className="text-[13px] sm:text-[14px] md:text-[16px] text-[#AFAFAF]">
                                Welcome Back! Select method to login:
                            </p>
                        </div>

                        {/* Social Login Options */}
                        <div className="flex flex-row justify-center gap-x-4 lg:gap-x-10 px-4">
                            <img
                                className="cursor-pointer lg:w-4/12 w-4/12"
                                src={googleLogo}
                                alt="Login with Google"
                            />
                            <img
                                className="cursor-pointer lg:w-4/12 w-4/12"
                                src={linkedInLogo}
                                alt="Login with LinkedIn"
                            />
                            <img
                                className="cursor-pointer lg:w-4/12 w-4/12"
                                src={microsoftLogo}
                                alt="Login with Microsoft"
                            />
                        </div>

                        {/* Email & Password Login */}
                        <div className="w-full flex flex-col gap-y-4 mt-12">
                            <p className="text-center text-[#AFAFAF]">Or continue with email</p>

                            {/* Email Input */}
                            <input
                                onChange={(e) =>
                                    setCredentials((prev) => ({
                                        ...prev,
                                        email: e.target.value,
                                    }))
                                }
                                className="bg-[#F4F7FA] p-3 md:p-4 w-full rounded-[16px] border-none focus:ring-0 focus:border-none focus:outline-none"
                                type="email"
                                placeholder="Email"
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
                                className="bg-[#F4F7FA] p-3 md:p-4 w-full rounded-[16px] border-none focus:ring-0 focus:border-none focus:outline-none"
                                type="password"
                                placeholder="Password"
                                required
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="w-full flex flex-row justify-between items-center mb-10">
                            <div className="flex flex-row justify-evenly items-center gap-x-2 cursor-pointer">
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
                            className="w-full bg-[#6438C2] text-white hover:bg-[#542F9E] py-3 md:py-4 md:px-4 rounded-[16px]"
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
                <img className="hidden lg:flex h-[890px]" src={loginRight} alt="Login Illustration" />
            </form>
        </>
    );
};
