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
import useModalStore from "../../store/modalStateStores.ts";
import ApplicationSuccessModal from "../ui/ApplicationSuccessModal.tsx";
import PaymentSuccessModal from "../ui/PaymentSuccessModal.tsx";
import { Link } from "react-router-dom";

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
        <div
            className="w-full md:w-[556px] h-[280px] rounded-[16px] cursor-pointer bg-[#F7F8FA] p-4 flex flex-col space-y-6 mx-auto">
            {/* Header */}
            <div className="relative flex justify-between items-center">
                <div className="flex space-x-3 items-center">
                    <img src={jobMatchFacebook} alt={`${company} Logo`} className="w-8 h-8 md:w-10 md:h-10"/>
                    <div className="mt-5 flex flex-col gap-y-2">
                        <div className="w-full flex items-center gap-x-2 gap-y-2 justify-evenly">
                            <h3 className="font-bold text-[15px] md:text-[20px] text-black">{title}</h3>
                            <p className="text-[10px] md:text-[13px] text-gray-700 font-semibold">{company}</p>
                        </div>
                        <div className="flex space-x-2 mt-1">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-[#6E4AED1F] text-[#6E4AED] rounded-full text-[9px] md:text-[13px] font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute -right-2 -top-1 flex items-center space-x-3">
                    <Rating value={5.0}/>
                    <img onClick={() => openModal("share")} src={shareIcon} alt="Share Icon"
                         className="w-4 h-4 md:w-5 md:h-5 cursor-pointer"/>
                    <ShareModal modelId="share"/>
                    <img src={bookmarkIcon} alt="Bookmark Icon" className="w-4 h-4 md:w-5 md:h-5 cursor-pointer"/>
                </div>
            </div>

            {/* Description */}
            <Link to={`/applicant/job-details/${title}`}>
            <p className="text-[12px] md:text-[13px] text-gray-700 leading-5 font-lato">
                {description}
            </p>
            </Link>

            {/* Job Info */}
            <div className="w-full flex flex-wrap md:justify-between items-center md:gap-2 gap-x-4 gap-y-3 justify-start">
                <div className="flex items-center space-x-2">
                    <img src={jobTypeIcon} alt="Job Type Icon" className="w-4 h-4"/>
                    <p className="text-[11px] md:text-[13px] text-gray-600">{type}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <img src={locationIcon} alt="Location Icon" className="w-4 h-4"/>
                    <p className="text-[11px] md:text-[13px] text-gray-600">{location}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <img src={peopleApplied} alt="People Applied Icon" className="w-4 h-4"/>
                    <p className="text-[11px] md:text-[13px] text-gray-600">{applicants} Applied</p>
                </div>
                <div className="flex items-center space-x-2">
                    <img src={numberOfDaysRemaining} alt="Days Remaining Icon" className="w-4 h-4"/>
                    <p className="text-[11px] md:text-[13px] text-gray-600">{daysLeft} days left</p>
                </div>
                <div className="flex justify-evenly gap-x-2">
                    <button onClick={handleApplication}
                            className="text-[11px] md:text-[13px] text-[#6E4AED] bg-[#ffffff] border-[#E6E6E6] border-[1px] px-4 py-1 rounded-[10px] font-medium">
                        Refer
                    </button>
                    <button onClick={handleApplication}
                            className="text-[11px] md:text-[13px] text-black bg-[#FFFFFF] border-[#E6E6E6] border-[1px] px-4 py-1 rounded-[10px] font-medium">
                        Apply
                    </button>
                    {/* Modals */}
                    {isModalOpen("application") && <ApplicationModal modalId="application"/>}
                    {isModalOpen("application-success") && (
                        <ApplicationSuccessModal modalId="application-success"/>
                    )}
                    {
                        isModalOpen("payment-success-modal") && (
                            <PaymentSuccessModal modalId="payment-success-modal"/>
                        )
                    }
                </div>
            </div>
        </div>
    );
};
