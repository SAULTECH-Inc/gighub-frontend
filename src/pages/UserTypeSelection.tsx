import React, { useEffect, useState } from "react";
import userSelection from '../assets/icons/userSelectionLeftSide.svg';
import gighubLogo from '../assets/icons/gighubLogoSmall.svg'
import jobSeekerUser from '../assets/icons/jobSeekerUser.svg'
import employerUser from '../assets/icons/employerUser.svg'
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UserTypeSelection: React.FC = () => {
    const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
    const navigator = useNavigate();

    // Load selection from localStorage if exists
    useEffect(() => {
        const savedSelection = localStorage.getItem("userType");
        if (savedSelection) {
            setSelectedUserType(savedSelection);
        }
    }, []);

    const handleAsJobSeeker = () => {
        setSelectedUserType("jobSeeker");
        localStorage.setItem("userType", "jobSeeker");
    };

    const handleAsEmployer = () => {
        setSelectedUserType("employer");
        localStorage.setItem("userType", "employer");
    };

    const handleProceed = () => {
        // Navigate to the next step of the application process
        navigator("/applicant/signup");
    };

    const handleBack = () => {
        // Go back to the previous page
        navigator(-1);
    };

    return (
        <div className="flex justify-around items-center py-2 gap-x-0">
            {/* Left Section */}
            <motion.div
                className="w-1/2 flex flex-col items-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="w-full flex justify-start">
                    <img src={gighubLogo} alt="logo" />
                </div>
                <div className="w-full h-[824px] flex flex-col justify-evenly mx-auto">
                    <div className="w-full text-center">
                        <h1 className="text-[24px] font-bold text-gray-600">How are You Planning To Use Gighub</h1>
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
                            className={`cursor-pointer w-[137px] h-[145px] flex flex-col items-center justify-evenly border-[1px] rounded-[16px] ${selectedUserType === "jobSeeker" ? "border-purple-600" : "border-[#E6E6E6]"}`}
                            whileHover={{ scale: 1.05 }}
                        >
                            <img className="mx-auto" src={jobSeekerUser} alt="job seeker" />
                            <p>As a Job Seeker</p>
                        </motion.div>
                        <motion.div
                            onClick={handleAsEmployer}
                            className={`cursor-pointer w-[137px] h-[145px] flex flex-col items-center justify-evenly border-[1px] rounded-[16px] ${selectedUserType === "employer" ? "border-purple-600" : "border-[#E6E6E6]"}`}
                            whileHover={{ scale: 1.05 }}
                        >
                            <img className="mx-auto" src={employerUser} alt="employer" />
                            <p>As an Employer</p>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        className="w-full flex justify-end text-right space-x-4"
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
                            disabled={!selectedUserType} // Disable button if no selection is made
                        >
                            Proceed
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
            {/* Right Section */}
            <motion.img
                className="h-auto max-h-screen"
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
