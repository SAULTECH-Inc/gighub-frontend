import React from "react";
import useModalStore from "../../store/modalStateStores.ts";
import cancelMedium from '../../assets/icons/cancelMedium.svg';
import checkMarkBig from '../../assets/icons/checkMarkBig.svg';
interface ModalProps {
    modalId: string;
}

const PaymentModal: React.FC<ModalProps> = ({ modalId }) => {
    const { modals, closeModal } = useModalStore(); // Access the modals state
    const isOpen = modals[modalId];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white shadow-xl p-6 w-[492px] h-[600px]">
                <div className="flex items-center justify-end mb-6">
                    <img className="cursor-pointer" onClick={() => closeModal(modalId)} src={cancelMedium} alt="cancel"/>
                </div>

                <div className="flex flex-col items-baseline mx-auto">
                    <div className="mx-auto flex flex-col justify-center items-center">
                        <img src={checkMarkBig} alt="check"/>
                        <h2 className="text-[24px] font-semibold text-[#FA4E09] mt-4">Congratulations!</h2>
                        <h2 className="text-[24px] font-semibold text-[#FA4E09] mt-4">Subscription Activated!</h2>
                    </div>
                    <p className="text-center text-gray-600 text-[13px] mt-8">
                        our payment was successful, and your Auto Apply Monthly Subscription is
                        now active—enjoy 200 Automatic Applications Per Month and effortless
                        opportunity management!
                    </p>
                </div>

            </div>
        </div>
    );
};

export default PaymentModal;
