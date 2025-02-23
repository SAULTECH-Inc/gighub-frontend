import React from "react";
import { motion } from "framer-motion";
import { FaArrowLeftLong } from "react-icons/fa6";
import ApplicantSignupSuccessModal from "../../../ui/ApplicantSignupSuccessModal.tsx";
import useModalStore from "../../../../store/modalStateStores.ts";
import { useFormStore } from "../../../../store/useFormStore.ts"; // ✅ Updated import
import { useAuth } from "../../../../store/useAuth.ts";
import { toast } from "react-toastify";
import {UserType} from "../../../../utils/types/enums.ts";

interface StepTwoProp {
    handlePrev: () => void;
}

const EmployerSignupStepFour: React.FC<StepTwoProp> = ({ handlePrev }) => {
    const { signup } = useAuth();
    const { openModal, isModalOpen } = useModalStore();
    const { employer, setEmployerData, resetFormData } = useFormStore(); // ✅ Updated store usage

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEmployerData({ [name]: value }); // ✅ More precise update
    };

    // Handle form submission
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // Ensure required fields are filled
        const requiredFieldsCompleted =
            employer.companyName &&
            employer.email &&
            employer.companyPhone &&
            employer.password &&
            employer.confirmPassword;

        if (!requiredFieldsCompleted) {
            toast.error("All required fields must be filled out.");
            return;
        }

        console.log("DATA TO BE SUBMITTED ::: ", employer);

        // Call signup function (no need to pass employer data, Zustand store handles it)
        const success = await signup(UserType.EMPLOYER);

        if(success){
            openModal("employer-signup-success-modal");
            resetFormData();
        }
    };

    return (
        <motion.div
            className="w-[310px] md:w-[680px] lg:w-[500px] mt-5 md:mr-28 md:mt-32 px-[10px] lg:px-0 space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1
                className="text-[24px] text-center text-[#000] font-bold"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Company Profile Setup
            </motion.h1>

            <motion.div
                className="w-full flex flex-col justify-start gap-4"
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.label
                    className="text-[13px] text-gray-100"
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                    htmlFor="company-description"
                >
                    Company Description
                </motion.label>
                <textarea
                    className="resize-none border-[1px] p-5 border-[#ccc] rounded-[16px] focus:outline-none focus:ring-0 focus:border-[1px] focus:border-[#ccc] w-full h-[182px] text-[16px] placeholder-gray-500"
                    placeholder="Write here..."
                    id="company-description"
                    value={employer.companyDescription} // ✅ Updated to `employer`
                    name="companyDescription"
                    onChange={handleChange}
                />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                className="w-full flex flex-col items-center justify-center gap-y-3"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <button
                    type="button"
                    className="mx-auto block w-full h-[50px] text-[16px] font-semibold text-[#FFFFFF] bg-[#6438C2] rounded-[10px] hover:bg-[#5931A9] transition"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
                <button
                    type="button"
                    className="flex justify-center items-center gap-x-2 mx-auto w-full h-[50px] text-[16px] font-semibold text-[#000000] border-[1px] border-[#CCC] bg-white rounded-[10px] hover:bg-[#ccc] transition"
                    onClick={handlePrev}
                >
                    <FaArrowLeftLong className="text-purple-700" />
                    Back
                </button>
            </motion.div>

            {/* Success Modal */}
            {isModalOpen("employer-signup-success-modal") && (
                <ApplicantSignupSuccessModal
                    modelId="employer-signup-success-modal"
                    route="/employer/profile"
                />
            )}
        </motion.div>
    );
};

export default EmployerSignupStepFour;
