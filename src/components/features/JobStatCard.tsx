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
    const handleModalToggle = ()=>{
        openModal("post-job-modal") // Close the modal when clicked
    }

    return (
        <div className="w-full lg:flex-1 h-[382px] bg-white rounded-[16px] shadow p-4 lg:p-6 flex flex-col justify-between">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h3 className="text-[16px] md:text-[20px] font-bold text-black">Job Insight</h3>
                </div>
                <button
                    type="button"
                    onClick={handleModalToggle} // Open modal on click
                    className="w-[173px] bg-[#6438C2] text-white text-center text-[13px] px-4 py-2 rounded-[16px] shadow-sm"
                >
                   Post Jobs
                </button>
            </div>

            {/* Job Details Section */}
            <JobStat/>

            {/* Subscription Modal */}
            {isSubscriptionModalOpen && <SubscriptionModal modalId="subscription-modal" />} {/* Conditionally render the modal */}
            {/* Payment Modal */}
            {isPaymentModalOpen && <PaymentModal modalId="payment-modal" />}
            {/* Post Job */}
            {isPostJobModalOpen && <EmployerJobMultistepForm modalId="post-job-modal"/>}
        </div>
    );
};

export default JobStatCard;
