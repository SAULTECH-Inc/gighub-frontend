import React from "react";
import JobStatCard from "./JobStatCard.tsx";
import SubscriptionModal from "../ui/SubscriptionModal.tsx";
import PaymentModal from "../ui/PaymentModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";

const JobInsightCard: React.FC = () => {
    const { modals, openModal } = useModalStore();
    const isPaymentModalOpen = modals["payment-modal"];
    const isSubscriptionModalOpen = modals["subscription-modal"];
    const handleModalToggle = ()=>{
        openModal("subscription-modal") // Close the modal when clicked
    }

    return (
        <div className="w-full md:flex-1 h-[382px] bg-white rounded-[16px] shadow p-4 md:p-6 flex flex-col justify-between">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h3 className="text-[16px] md:text-[20px] font-bold text-black">Job Match</h3>
                    <p className="text-[10px] md:text-[13px] text-[#8E8E8E] font-medium">
                        Job that matches your profile
                    </p>
                </div>
                <button
                    onClick={handleModalToggle} // Open modal on click
                    className="flex items-center gap-2 bg-gradient-to-r from-[#6438C2] to-[#FA4E09] text-white text-[13px] px-4 py-2 rounded-[16px] shadow-sm"
                >
                    <span>Check Auto Apply</span>
                </button>
            </div>

            {/* Job Details Section */}
            <JobStatCard/>

            {/* Subscription Modal */}
            {isSubscriptionModalOpen && <SubscriptionModal modalId={"subscription-modal"} />} {/* Conditionally render the modal */}
            {/* Payment Modal */}
            {isPaymentModalOpen && <PaymentModal modalId="payment-modal" />}
        </div>
    );
}

export default JobInsightCard;