import React from "react";
import useModalStore from "../../store/modalStateStores.ts";
import cancelMedium from "../../assets/icons/cancelMedium.svg";
import checkMarkBig from "../../assets/icons/checkMarkBig.svg";
interface ModalProps {
  modalId: string;
}

const PaymentModal: React.FC<ModalProps> = ({ modalId }) => {
  const { modals, closeModal } = useModalStore(); // Access the modals state
  const isOpen = modals[modalId];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-[600px] w-[492px] bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-end">
          <img
            className="cursor-pointer"
            onClick={() => closeModal(modalId)}
            src={cancelMedium}
            alt="cancel"
          />
        </div>

        <div className="mx-auto flex flex-col items-baseline">
          <div className="mx-auto flex flex-col items-center justify-center">
            <img src={checkMarkBig} alt="check" />
            <h2 className="mt-4 text-[24px] font-semibold text-[#FA4E09]">
              Congratulations!
            </h2>
            <h2 className="mt-4 text-[24px] font-semibold text-[#FA4E09]">
              Subscription Activated!
            </h2>
          </div>
          <p className="text-gray-600 mt-8 text-center text-[13px]">
            our payment was successful, and your Auto Apply Monthly Subscription
            is now active—enjoy 200 Automatic Applications Per Month and
            effortless opportunity management!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
