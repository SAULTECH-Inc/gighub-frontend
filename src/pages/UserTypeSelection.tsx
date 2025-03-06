import React from "react";
import userSelection from '../assets/icons/userSelectionLeftSide.svg';
import gighubLogo from '../assets/icons/gighubLogoSmall.svg'
import jobSeekerUser from '../assets/icons/jobSeekerUser.svg'
import employerUser from '../assets/icons/employerUser.svg'
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../store/useAuth.ts";
import { UserType } from "../utils/enums.ts";

const UserTypeSelection: React.FC = () => {
    const {isAuthenticated, userType, setUserType} = useAuth();
    const navigator = useNavigate();

    React.useEffect(() => {
        if (isAuthenticated && userType) {
            navigator(
                `/${userType}/profile`
            )
        }
    }, [isAuthenticated, userType]);

    const handleAsJobSeeker = () => {
        setUserType(UserType.APPLICANT);
    };

    const handleAsEmployer = () => {
        setUserType(UserType.EMPLOYER);
    };

    const handleProceed = () => {
        navigator(`/${userType}/signup`);
    };

    const handleBack = () => {
        // Go back to the previous page
        navigator(-1);
    };

    return (
        <div className="flex justify-around items-center py-2 gap-x-0 border-2 my-auto h-screen">
            {/* Left Section */}
            <motion.div
                className="w-full lg:w-1/2 flex flex-col items-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="w-full flex justify-start xs:ml-5 sm:ml-5 md:ml-5 xs:mt-5 sm:mt-5 md:mt-5">
                    <img src={gighubLogo} alt="logo" />
                </div>
                <div className="w-full h-[824px] flex flex-col justify-evenly mx-auto">
                    <div className="w-full text-center">
                        <h1 className="text-[20px] lg:text-[24px] font-bold text-gray-600">How are You Planning To Use Gighub</h1>
                        <p className="text-[13px] text-gray-600">We will streamline your setup experience
                            accordingly</p>
                    </div>
                    <motion.div
                        className="w-full flex justify-center gap-x-8"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            onClick={handleAsJobSeeker}
                            className={`cursor-pointer w-[calc(130px+5px)] lg:w-[137px] h-[145px] flex flex-col items-center justify-evenly border-[1px] rounded-[16px] ${userType === UserType.APPLICANT ? "border-purple-600" : "border-[#E6E6E6]"}`}
                            whileHover={{ scale: 1.05 }}
                        >
                            <img className="mx-auto" src={jobSeekerUser} alt="job seeker" />
                            <p>As a Job Seeker</p>
                        </motion.div>
                        <motion.div
                            onClick={handleAsEmployer}
                            className={`cursor-pointer w-[calc(130px+5px)] lg:w-[137px] lg:h-[145px] flex flex-col items-center justify-evenly border-[1px] rounded-[16px] ${userType === UserType.EMPLOYER ? "border-purple-600" : "border-[#E6E6E6]"}`}
                            whileHover={{ scale: 1.05 }}
                        >
                            <img className="mx-auto" src={employerUser} alt="employer" />
                            <p>As an Employer</p>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        className="w-full flex justify-center lg:justify-end text-right gap-x-4"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.button
                            onClick={handleBack}
                            className="w-[131px] h-[43px] border-[1px] border-[#E6E6E6] bg-white text-black font-semibold text-[16px] rounded-[10px]"
                            whileHover={{ scale: 1.05 }}
                        >
                            Back
                        </motion.button>
                        <motion.button
                            onClick={handleProceed}
                            className="w-[131px] h-[43px] bg-[#6438C2] text-white font-semibold text-[16px] rounded-[10px]"
                            whileHover={{ scale: 1.05 }}
                            disabled={!userType} // Disable button if no selection is made
                        >
                            Proceed
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
            {/* Right Section */}
            <motion.img
                className="hidden my-auto lg:flex"
                src={userSelection}
                alt="user type selection right side"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            />
        </div>
    );
};

export default UserTypeSelection;
