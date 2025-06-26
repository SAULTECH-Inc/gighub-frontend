import React from "react";
import check from "../../assets/icons/checkWhite.svg";
import cancel from "../../assets/icons/cancelMedium.svg";
import useModalStore from "../../store/modalStateStores.ts";
import { useNavigate } from "react-router-dom";
import { useFormStore } from "../../store/useFormStore.ts";

interface ApplicantSignupSuccessModalProd {
  modelId: string;
  route: string;
}

const ApplicantSignupSuccessModal: React.FC<
  ApplicantSignupSuccessModalProd
> = ({
  modelId,
  route,
  // Other props...
}) => {
  const navigate = useNavigate();
  const { employer } = useFormStore();
  const { closeModal } = useModalStore();
  const isOpen = useModalStore().modals[modelId];
  if (!isOpen) return null;

  const handleProfileCompletion = () => {
    closeModal(modelId);
    navigate(route);
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative mx-4 flex h-[500px] max-w-lg flex-col items-center justify-center gap-y-4 rounded-[16px] bg-white md:h-[630px] md:w-[709px]">
        <img
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => closeModal(modelId)}
          src={cancel}
          alt="close"
        />
        <img src={check} className="mb-4 h-16 w-16" alt="check" />
        <h1 className="text-[24px] font-bold text-[#FA4E09]">
          Congratulations!
        </h1>
        <p className="px-12 text-center text-[13px] text-[#000000]">
          Congratulations, <b>{employer.companyName.toUpperCase()}! 🎉</b> Click
          "Complete Your Profile" to update your details, unlock tailored job
          recommendations, and take bold steps toward your career goals!
        </p>
        <button
          onClick={handleProfileCompletion}
          className="h-[45px] w-[246px] rounded-[16px] bg-[#6438C2] px-4 py-2 font-semibold text-white transition duration-300 hover:bg-[#7C4DFF]"
        >
          Complete Your Profile
        </button>
      </div>
    </div>
  );
};

export default ApplicantSignupSuccessModal;
