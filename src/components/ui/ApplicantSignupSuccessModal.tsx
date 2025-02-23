import React from 'react';
import check from '../../assets/icons/checkWhite.svg';
import cancel from '../../assets/icons/cancelMedium.svg';
import useModalStore from "../../store/modalStateStores.ts";
import { useNavigate } from "react-router-dom";
import {useFormStore} from "../../store/useFormStore.ts";

interface ApplicantSignupSuccessModalProd {
    modelId: string;
    route: string;
}

const ApplicantSignupSuccessModal: React.FC<ApplicantSignupSuccessModalProd> = ({
                                                                                    modelId,
    route,
                                                                                    // Other props...
                                                                                }) => {
    const navigate = useNavigate();
    const {employer} = useFormStore();
    const { closeModal } = useModalStore();
    const isOpen = useModalStore().modals[modelId];
    if (!isOpen) return null;

    const handleProfileCompletion = () => {
        closeModal(modelId);
        navigate(route);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div
                className="relative bg-white max-w-lg mx-4 h-[500px] md:w-[709px] md:h-[630px] rounded-[16px] flex flex-col items-center justify-center gap-y-4">
                <img
                    className="cursor-pointer absolute top-5 right-5"
                    onClick={() => closeModal(modelId)}
                    src={cancel}
                    alt="close"
                />
                <img
                    src={check}
                    className="w-16 h-16 mb-4"
                    alt="check"
                />
                <h1 className="text-[24px] text-[#FA4E09] font-bold">Congratulations!</h1>
                <p className="text-[13px] text-[#000000] text-center px-12">
                    Congratulations, <b>{employer.companyName.toUpperCase()}! 🎉</b> Click "Complete Your Profile" to update your details,
                    unlock tailored job recommendations, and take bold steps toward your career goals!
                </p>
                <button
                    onClick={handleProfileCompletion}
                    className="bg-[#6438C2] text-white font-semibold py-2 px-4 rounded-[16px] w-[246px] h-[45px] hover:bg-[#7C4DFF] transition duration-300"
                >
                    Complete Your Profile
                </button>
            </div>
        </div>
    );
};

export default ApplicantSignupSuccessModal;