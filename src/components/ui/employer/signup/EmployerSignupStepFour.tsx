import React from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import { FaArrowLeftLong } from "react-icons/fa6";
import ApplicantSignupSuccessModal from "../../../ui/ApplicantSignupSuccessModal.tsx";
import useModalStore from "../../../../redux/modalStateStores.ts";
import {useFormStore} from "../../../../redux/useFormStore.ts";

interface StepTwoProp {
    handlePrev: () => void;
}

const EmployerSignupStepFour: React.FC<StepTwoProp> = ({handlePrev,
                                                         }) => {
    const { openModal,isModalOpen } = useModalStore();
    const {formData, setFormData} = useFormStore();
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>)=> {
        const { name, value } = e.target as HTMLTextAreaElement;
        setFormData({
           employer: {
               ...formData.employer,
               [name]: value
           }
        });
    }
    const handleSubmit = () => {
        console.log('Form Data Submitted:', formData);
    }

    return (
        <motion.div
            className="min-w-96 md:w-full md:max-w-[500px] mx-auto md:mx-5 flex flex-col justify-evenly items-center gap-y-[50px] px-4 md:px-0"
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
                    {/*labeled*/}
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
                        className="resize-none border-[1px] border-[#ccc] rounded-[16px] focus:outline-none focus:ring-0 focus:border-[1px] focus:border-[#ccc] w-full h-[182px] text-[16px] placeholder-gray-500"
                        placeholder="Write here..."
                        id="company-description"
                        value={formData.employer.companyDescription}
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
                    className="mx-auto block w-full h-[50px] text-[16px] font-semibold text-[#FFFFFF] bg-[#6438C2] rounded-[10px] hover:bg-[#5931A9] transition"
                    onClick={()=>{
                        openModal('application-signup-success-modal');
                        handleSubmit();
                    }}
                >
                    Submit
                </button>
                <button
                    className="flex justify-center items-center gap-x-2 mx-auto w-full h-[50px] text-[16px] font-semibold text-[#000000] border-[1px] border-[#CCC] bg-white rounded-[10px] hover:bg-[#ccc] transition"
                    onClick={handlePrev}
                >
                    <FaArrowLeftLong className="text-purple-700"/>
                    Back
                </button>
            </motion.div>
            {
                isModalOpen("application-signup-success-modal") && (
                    <ApplicantSignupSuccessModal
                        modelId="application-signup-success-modal"
                        route="/employer/profile"
                    />
                )
            }
        </motion.div>
    );
};

export default EmployerSignupStepFour;
