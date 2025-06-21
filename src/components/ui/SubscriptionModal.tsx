import React, { memo } from "react";
import useModalStore from "../../store/modalStateStores.ts";
import PaymentModal from "./PaymentModal.tsx";

interface SubscriptionModalProps {
  modalId: string;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ modalId }) => {
  const { modals, openModal, closeModal, isModalOpen } = useModalStore();
  const isOpen = modals[modalId];

  if (!isOpen) return null;

  const handleSubscription = () => {
    closeModal(modalId);
    openModal("payment-modal");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      {/* Modal Container */}
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-[#F7F7F7] p-4 shadow-lg md:p-6">
        {/* Close Button */}
        <button
          onClick={() => closeModal(modalId)}
          className="absolute right-2 top-2 text-2xl text-gray-500 hover:text-gray-700 focus:outline-none md:right-4 md:top-4 md:text-[32px]"
          aria-label="Close Modal"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="mb-4 text-left text-xl font-semibold md:mb-6 md:text-2xl">
          Unlock Auto Apply Premium
        </h2>

        {/* Content Section */}
        <div className="flex flex-col gap-4 rounded-xl bg-white p-4 md:gap-6 md:p-6 lg:flex-row">
          {/* Subscription Plans */}
          <div className="w-full space-y-4 md:space-y-6 lg:w-7/12">
            {/* Monthly Plan */}
            <div
              onClick={handleSubscription}
              className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-gradient-to-r from-[#6438C2] to-[#FA4E09] p-3 text-white transition-transform duration-300 ease-in-out hover:scale-[1.02] md:p-4"
            >
              <div className="flex items-center">
                <div className="mr-2 text-xl text-yellow-300 md:mr-4 md:text-2xl">
                  ⭐
                </div>
                <div>
                  <h3 className="text-base font-semibold md:text-lg">
                    Monthly Plan
                  </h3>
                  <p className="text-xs opacity-90 md:text-sm">
                    Up to 200 applications daily
                  </p>
                </div>
              </div>
              <span className="text-base font-bold md:text-lg">$29/mo</span>
            </div>

            {/* Quarterly Plan */}
            <div
              onClick={handleSubscription}
              className="relative flex w-full cursor-pointer items-center justify-between rounded-xl bg-gradient-to-r from-[#6438C2] to-[#65FF81] p-3 text-white transition-transform duration-300 ease-in-out hover:scale-[1.02] md:p-4"
            >
              <div className="absolute -right-2 -top-2 rounded-full bg-[#FACC15] px-2 py-1 text-xs font-bold text-black">
                POPULAR
              </div>
              <div className="flex items-center">
                <div className="mr-2 text-xl text-blue-300 md:mr-4 md:text-2xl">
                  💎
                </div>
                <div>
                  <h3 className="text-base font-semibold md:text-lg">
                    Quarterly Plan
                  </h3>
                  <p className="text-xs opacity-90 md:text-sm">
                    Up to 200 applications daily
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-bold md:text-lg">$69/3mo</span>
                <p className="text-xs opacity-75">Save 20%</p>
              </div>
            </div>

            {/* Yearly Plan */}
            <div
              onClick={handleSubscription}
              className="relative flex w-full cursor-pointer items-center justify-between rounded-xl bg-gradient-to-r from-[#6438C2] to-[#FA4E09] p-3 text-white transition-transform duration-300 ease-in-out hover:scale-[1.02] md:p-4"
            >
              <div className="absolute -right-2 -top-2 rounded-full bg-green-400 px-2 py-1 text-xs font-bold text-black">
                BEST VALUE
              </div>
              <div className="flex items-center">
                <div className="mr-2 text-xl text-yellow-300 md:mr-4 md:text-2xl">
                  🏆
                </div>
                <div>
                  <h3 className="text-base font-semibold md:text-lg">
                    Annual Plan
                  </h3>
                  <p className="text-xs opacity-90 md:text-sm">
                    Up to 200 applications daily
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-bold md:text-lg">$199/yr</span>
                <p className="text-xs opacity-75">Save 43%</p>
              </div>
            </div>

            <p className="text-justify text-sm text-[#8E8E8E] md:text-base">
              Auto Apply is our premium automation service that intelligently
              matches and submits applications to relevant opportunities on your
              behalf, maximizing your career prospects while saving you valuable
              time.
            </p>

            <button
              onClick={handleSubscription}
              className="w-full rounded-lg bg-[#6438C2] py-2 text-sm font-bold text-white transition-colors duration-300 hover:bg-purple-700 focus:outline-none md:py-3 md:text-base"
            >
              Start 7-Day Free Trial
            </button>
            {isModalOpen("payment-modal") && (
              <PaymentModal modalId="payment-modal" />
            )}
          </div>

          {/* Services Section */}
          <div className="w-full rounded-lg bg-[#F7F7F7] p-3 md:p-4 lg:w-5/12">
            <h4 className="mb-3 text-base font-bold text-black md:text-lg">
              What's Included
            </h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="border-b border-gray-300 pb-3">
                <span className="mb-1 block text-sm font-bold text-[#6438C2] md:text-base">
                  Monthly
                </span>
                <div className="flex">
                  <span className="mr-2 mt-0.5 text-xl text-red-500">🎯</span>
                  <p className="text-xs text-[#8E8E8E] md:text-sm">
                    Up to 6,000 automated applications per month with
                    intelligent job matching and personalized cover letters.
                  </p>
                </div>
              </li>

              <li className="border-b border-gray-300 pb-3">
                <span className="mb-1 block text-sm font-bold text-[#6438C2] md:text-base">
                  Quarterly
                </span>
                <div className="flex">
                  <span className="mr-2 mt-0.5 text-xl text-red-500">💎</span>
                  <p className="text-xs text-[#8E8E8E] md:text-sm">
                    Up to 18,000 automated applications over 3 months with
                    priority matching and advanced filtering options.
                  </p>
                </div>
              </li>

              <li>
                <span className="mb-1 block text-sm font-bold text-[#6438C2] md:text-base">
                  Annual
                </span>
                <div className="flex">
                  <span className="mr-2 mt-0.5 text-xl text-red-500">🏆</span>
                  <p className="text-xs text-[#8E8E8E] md:text-sm">
                    Up to 73,000 automated applications per year with premium
                    support, advanced analytics, and exclusive job
                    opportunities.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SubscriptionModal);
