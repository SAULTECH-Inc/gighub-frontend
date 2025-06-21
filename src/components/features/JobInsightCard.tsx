import React from "react";
import JobStatCard from "./JobStatCard.tsx";
import SubscriptionModal from "../ui/SubscriptionModal.tsx";
import PaymentModal from "../ui/PaymentModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";

const JobInsightCard: React.FC = () => {
  const { modals, openModal } = useModalStore();
  const isPaymentModalOpen = modals["payment-modal"];
  const isSubscriptionModalOpen = modals["subscription-modal"];
  const handleModalToggle = () => {
    openModal("subscription-modal"); // Close the modal when clicked
  };

  return (
    <div className="flex h-[382px] w-full flex-col justify-between rounded-[16px] bg-white p-4 shadow md:flex-1 md:p-6">
      {/* Header Section */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-black md:text-[20px]">
            Job Match
          </h3>
          <p className="text-[10px] font-medium text-[#8E8E8E] md:text-[13px]">
            Job that matches your profile
          </p>
        </div>
        <button
          onClick={handleModalToggle} // Open modal on click
          className="flex items-center gap-2 rounded-[16px] bg-gradient-to-r from-[#6438C2] to-[#FA4E09] px-4 py-2 text-[13px] text-white shadow-sm"
        >
          <span>Check Auto Apply</span>
        </button>
      </div>
      {/* Job Details Section */}
      <JobStatCard />
      {/* Subscription Modal */}
      {isSubscriptionModalOpen && (
        <SubscriptionModal modalId={"subscription-modal"} />
      )}{" "}
      {/* Conditionally render the modal */}
      {/* Payment Modal */}
      {isPaymentModalOpen && <PaymentModal modalId="payment-modal" />}
    </div>
  );
};

export default JobInsightCard;
