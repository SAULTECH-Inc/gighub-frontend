import React from "react";
import SubscriptionModal from "../ui/SubscriptionModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import PaymentModal from "../ui/PaymentModal.tsx";
import JobStat from "./JobStat.tsx";
import EmployerJobMultistepForm from "../../pages/employer/EmployerJobMultistepForm.tsx"; // Import the modal component

const JobStatCard: React.FC = () => {
  const { modals, openModal } = useModalStore();
  const isPaymentModalOpen = modals["payment-modal"];
  const isSubscriptionModalOpen = modals["subscription-modal"];
  const isPostJobModalOpen = modals["post-job-modal"]; // Add this variable to your state store
  const handleModalToggle = () => {
    openModal("post-job-modal"); // Close the modal when clicked
  };

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-[16px] bg-white p-4 shadow lg:flex-1 lg:p-6">
      {/* Header Section */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-black md:text-[20px]">
            Job Insight
          </h3>
        </div>
        <button
          type="button"
          onClick={handleModalToggle} // Open modal on click
          className="w-[173px] rounded-[16px] bg-[#6438C2] px-4 py-2 text-center text-[13px] text-white shadow-sm"
        >
          Post Jobs
        </button>
      </div>
      {/* Job Details Section */}
      <JobStat />
      {/* Subscription Modal */}
      {isSubscriptionModalOpen && (
        <SubscriptionModal modalId="subscription-modal" />
      )}{" "}
      {/* Conditionally render the modal */}
      {/* Payment Modal */}
      {isPaymentModalOpen && <PaymentModal modalId="payment-modal" />}
      {/* Post Job */}
      {isPostJobModalOpen && (
        <EmployerJobMultistepForm modalId="post-job-modal" />
      )}
    </div>
  );
};

export default JobStatCard;
