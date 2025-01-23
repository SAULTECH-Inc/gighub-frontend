import React, { useState } from "react";
import checkAutoApplyRocket from "../../assets/icons/checkAutoApplyRocket.svg";
import { JobDetails } from "../../pages/JobDetails";
import SubscriptionModal from "./SubscriptionModal.tsx"; // Import the modal component

export interface JobMatchCardProps {
    title: string;
    company: string;
    tags: string[];
    description: string;
    location: string;
    type: string;
    applicants: number;
    daysLeft: number;
}

const JobMatchCard: React.FC<JobMatchCardProps> = ({
                                                       title,
                                                       company,
                                                       tags,
                                                       description,
                                                       location,
                                                       type,
                                                       applicants,
                                                       daysLeft,
                                                   }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

    const handleModalToggle = () => {
        setIsModalOpen((prev) => !prev); // Toggle modal visibility
    };

    return (
        <div className="w-[596px] h-[382px] bg-white rounded-[16px] shadow p-6 space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-[20px] font-bold text-black">Job Match</h3>
                    <p className="text-[13px] text-[#8E8E8E] font-medium">
                        Job that matches your profile
                    </p>
                </div>
                <button
                    onClick={handleModalToggle} // Open modal on click
                    className="flex items-center gap-2 bg-gradient-to-r from-[#6438C2] to-[#FA4E09] text-white text-[13px] px-4 py-2 rounded-[16px] shadow-md"
                >
                    <span>Check Auto Apply</span>
                    <img src={checkAutoApplyRocket} alt="Rocket Icon" className="w-5 h-5" />
                </button>
            </div>

            {/* Job Details Section */}
            <JobDetails
                title={title}
                company={company}
                tags={tags}
                description={description}
                location={location}
                type={type}
                applicants={applicants}
                daysLeft={daysLeft}
            />

            {/* Subscription Modal */}
            {isModalOpen && <SubscriptionModal onClose={handleModalToggle} />} {/* Conditionally render the modal */}
        </div>
    );
};

export default JobMatchCard;
