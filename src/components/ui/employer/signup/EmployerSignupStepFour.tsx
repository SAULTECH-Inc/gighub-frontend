import React from "react";
import { motion } from "framer-motion";
import { FaArrowLeftLong } from "react-icons/fa6";
import ApplicantSignupSuccessModal from "../../../ui/ApplicantSignupSuccessModal.tsx";
import useModalStore from "../../../../store/modalStateStores.ts";
import { useAuth } from "../../../../store/useAuth.ts";
import { toast } from "react-toastify";
import { EmployerSignupRequest } from "../../../../utils/types";
import { UserType } from "../../../../utils/enums.ts";

interface StepTwoProp {
  handlePrev: () => void;
}

const EmployerSignupStepFour: React.FC<StepTwoProp> = ({ handlePrev }) => {
  const {
    employerSignupRequest,
    setEmployerSignupRequest,
    resetSignupRequest,
    signup,
  } = useAuth();
  const { openModal, isModalOpen } = useModalStore();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmployerSignupRequest({
      ...employerSignupRequest,
      [name]: value,
    } as EmployerSignupRequest);
  };

  // Handle form submission
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const requiredFieldsCompleted =
      employerSignupRequest?.companyName &&
      employerSignupRequest?.email &&
      employerSignupRequest?.companyPhone &&
      employerSignupRequest?.password &&
      employerSignupRequest?.confirmPassword;

    if (!requiredFieldsCompleted) {
      toast.error("All required fields must be filled out.");
      return;
    }

    const success = await signup(UserType.EMPLOYER, employerSignupRequest);

    if (success) {
      openModal("employer-signup-success-modal");
      resetSignupRequest();
    }
  };

  return (
    <motion.div
      className="mt-5 w-[310px] space-y-5 px-[10px] md:mt-32 md:mr-28 md:w-[680px] lg:w-[500px] lg:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-center text-[24px] font-bold text-[#000]"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Company Profile Setup
      </motion.h1>

      <motion.div
        className="flex w-full flex-col justify-start gap-4"
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
          className="h-[182px] w-full resize-none rounded-[16px] border-[1px] border-[#ccc] p-5 text-[16px] placeholder-gray-500 focus:border-[1px] focus:border-[#ccc] focus:ring-0 focus:outline-none"
          placeholder="Write here..."
          id="company-description"
          value={employerSignupRequest?.companyDescription} // ✅ Updated to `employer`
          name="companyDescription"
          onChange={handleChange}
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex w-full flex-col items-center justify-center gap-y-3"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          type="button"
          className="mx-auto block h-[50px] w-full rounded-[10px] bg-[#6438C2] text-[16px] font-semibold text-[#FFFFFF] transition hover:bg-[#5931A9]"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          type="button"
          className="mx-auto flex h-[50px] w-full items-center justify-center gap-x-2 rounded-[10px] border-[1px] border-[#CCC] bg-white text-[16px] font-semibold text-[#000000] transition hover:bg-[#ccc]"
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
