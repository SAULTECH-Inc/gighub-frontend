import React from "react";
import jobTypeIcon from "../../assets/icons/jobTypeIcon.svg";
import locationIcon from "../../assets/icons/locationIcon.svg";
import peopleApplied from "../../assets/icons/peopleApplied.svg";
import numberOfDaysRemaining from "../../assets/icons/numberOfDaysRemaining.svg";
import jobMatchFacebook from "../../assets/icons/jobMatchFacebook.svg";
import shareIcon from "../../assets/icons/shareIcon.svg";
import bookmarkIcon from "../../assets/icons/bookmarkIcon.svg";
import Rating from "../common/Rating.tsx";
import { JobMatchCardProps } from "./JobMatchCard.tsx";
import ShareModal from "../ui/ShareModal.tsx";
import ApplicationModal from "../ui/ApplicationModal.tsx";
import useModalStore from "../../redux/modalStateStores.ts";
import ApplicationSuccessModal from "../ui/ApplicationSuccessModal.tsx";
import PaymentSuccessModal from "../ui/PaymentSuccessModal.tsx";

export const JobDetails: React.FC<JobMatchCardProps> = ({
                                                            title,
                                                            company,
                                                            tags,
                                                            description,
                                                            location,
                                                            type,
                                                            applicants,
                                                            daysLeft,
                                                        }) => {
    const { openModal, isModalOpen } = useModalStore();

    const handleApplication = () => {
        openModal("application");
    };
    return (
        <div className="w-[556px] h-[249px] rounded-[16px] cursor-pointer bg-[#F7F8FA] p-4 flex flex-col space-y-6 mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex space-x-3 items-center">
                    <img src={jobMatchFacebook} alt={`${company} Logo`} className="w-10 h-10" />
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-[20px] text-black">{title}</h3>
                            <p className="text-[13px] text-gray-700 font-semibold">{company}</p>
                        </div>
                        <div className="flex space-x-2 mt-1">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-[#6E4AED1F] text-[#6E4AED] rounded-full text-[13px] font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Rating value={5.0} />
                    <img onClick={()=>openModal("share")} src={shareIcon} alt="Share Icon" className="w-5 h-5 cursor-pointer" />
                    <ShareModal modelId="share" />
                    <img src={bookmarkIcon} alt="Bookmark Icon" className="w-5 h-5 cursor-pointer" />
                </div>
            </div>

            {/* Description */}
            <p className="text-[13px] text-gray-700 leading-5 font-lato">
                {description}
            </p>

            {/* Job Info */}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <img src={jobTypeIcon} alt="Job Type Icon" className="w-4 h-4" />
                    <p className="text-[13px] text-gray-600">{type}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <img src={locationIcon} alt="Location Icon" className="w-4 h-4" />
                    <p className="text-[13px] text-gray-600">{location}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <img src={peopleApplied} alt="People Applied Icon" className="w-4 h-4" />
                    <p className="text-[13px] text-gray-600">{applicants} Applied</p>
                </div>
                <div className="flex items-center space-x-2">
                    <img src={numberOfDaysRemaining} alt="Days Remaining Icon" className="w-4 h-4" />
                    <p className="text-[13px] text-gray-600">{daysLeft} days left</p>
                </div>
                <button onClick={handleApplication} className="w-92px] h-28px] text-[13px] text-black bg-[#FFFFFF] border-[#E6E6E6] border-[1px] px-4 py-1 rounded-[10px] font-medium">
                    Apply
                </button>
                {/* Modals */}
                {isModalOpen("application") && <ApplicationModal modalId="application" />}
                {isModalOpen("application-success") && (
                    <ApplicationSuccessModal modalId="application-success" />
                )}
                {
                    isModalOpen("payment-success-modal") && (
                        <PaymentSuccessModal modalId="payment-success-modal"/>
                    )
                }
            </div>
        </div>
    );
};
