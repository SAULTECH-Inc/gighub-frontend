import React, {useState} from "react";
import loginRight from '../../assets/icons/loginRight.png';
import googleLogo from '../../assets/icons/gLogo.svg';
import linkedInLogo from '../../assets/icons/lLogo.svg';
import microsoftLogo from '../../assets/icons/mLogo.svg';
import gighubLogo from '../../assets/icons/gighubLogoSmall.svg';
import {useAuth} from "../../store/useAuth.ts";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {UserType} from "../../utils/types/enums.ts";
export const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const {login} = useAuth();
    const navigate = useNavigate();
    const userType = localStorage.getItem("userType") as UserType;
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(credentials);
        if(success) {
            console.log("LOGIN AS ::: "+userType);
            const path = `/${userType}/profile`;
            navigate(path);
        }else{
            toast.error("Invalid email or password. Please try again.");
        }
    };

    const handleRememberMe = ()=>{
        setCredentials((prevState) => ({...prevState, rememberMe:!prevState.rememberMe}));
    }


    return (
        <>
            <form
                  className="h-screen flex flex-row justify-evenly space-x-0 items-center mx-auto my-auto">
                <div className="flex flex-col gap-y-6 justify-center items-center w-full px-5 md:px-10 lg:w-1/2  xl:w-1/3 h-[890px]">
                    <div className="flex flex-col w-full gap-y-2">
                        <img className="h-40 w-40 mx-auto" src={gighubLogo} alt="right"/>
                        <div className="mx-auto mb-5">
                            <h1 className="text-[20px] sm:text-[25px] md:text-[32px]">Login Into Your Account</h1>
                            <p className="text-[12px] sm:text-[13px] md:text-[16px] text-[#AFAFAF]">Welcome Back! Select method to login:</p>
                        </div>
                        <div className="flex flex-row justify-center gap-x-4 lg:gap-x-10 px-4">
                            <img className="cursor-pointer lg:w-4/12 w-3/12" src={googleLogo} alt="right"/>
                            <img className="cursor-pointer lg:w-4/12 w-3/12" src={linkedInLogo} alt="right"/>
                            <img className="cursor-pointer lg:w-4/12 w-3/12" src={microsoftLogo} alt="right"/>
                        </div>
                        <div className="w-full flex flex-col gap-y-4 mt-12">
                            <p className="text-center text-[#AFAFAF]">Or continue with email</p>
                            <div className="gap-y-10 flex flex-col">
                                <input
                                    onChange={(e)=>{
                                        setCredentials({...credentials, email: e.target.value })
                                    }}
                                    className="bg-[#F4F7FA] p-3 md:p-4 w-full rounded-[16px] focus:ring-0 focus:border-none focus:outline-none"
                                    type="email" placeholder="Email" required/>
                                <input
                                    onChange={(e)=>{
                                        setCredentials({...credentials, password: e.target.value })
                                    }}
                                    className="bg-[#F4F7FA] p-3 md:p-4 w-full rounded-[16px] focus:ring-0 focus:border-none focus:outline-none"
                                    type="password" placeholder="Password" required/>
                            </div>
                        </div>
                        <div className="w-full flex flex-row justify-between items-center mb-10">
                            <div className="flex flex-row justify-evenly items-center gap-x-2 cursor-pointer"><input
                                checked={credentials.rememberMe}
                                onChange={(e) => {
                                    setCredentials({...credentials, rememberMe: e.target.checked })
                                }}
                                className="bg-[#6438C2] p-3 md focus:outline-none focus:ring-0"
                                type="checkbox"/>
                                <span onClick={handleRememberMe}>Remember me</span></div>
                            <Link to="/forgot-password" className="cursor-pointer">Forgot Password?</Link>
                        </div>
                        <button
                            onClick={handleLogin}
                            // disabled={isAuthenticated}
                            type="button"
                                className="w-full bg-[#6438C2] text-white hover:bg-[#542F9E] py-3 md:py-4 md:px-4 rounded-[16px]">Login
                        </button>
                        <p className="text-left">Don't have an account? <Link to="/user-type-selection" className="text-[#6438C2]">Sign Up</Link></p>
                    </div>
                </div>
                <img className="hidden lg:flex h-[890px]" src={loginRight} alt="right"/>
            </form>
        </>
    );
};
