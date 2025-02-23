import React from "react";
import ViewApplicationMethodModal from "./ViewApplicationMethodModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";


interface ApplicationCardProps {
    image: string;
    jobTitle: string;
    location: string;
    companyName: string;
    status: string;
    statusColor: string;
    buttonText: string;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
                                                             image,
                                                             jobTitle,
                                                             location,
                                                             companyName,
                                                             status,
                                                             statusColor,
                                                             buttonText,
                                                         }) => {
    const {openModal } = useModalStore();

    return (
        <div
            className="grid grid-cols-[1fr_30px_100px] md:grid-cols-3 md:justify-between items-center bg-[#F7F7F7] h-[58px] rounded-[16px] md:gap-x-6 gap-x-2 w-full px-4">
            {/* Applicant Details */}
            <div className="flex items-center space-x-4">
                <img
                    src={image}
                    alt="Applicant"
                    className="w-[35px] h-[35px] md:w-[40px] md:h-[40px] rounded-[10px] object-cover"
                />
                <div>
                    <h3 className="text-[11px] md:text-base font-semibold text-black">{jobTitle}</h3>
                    <p className="text-[9px] md:text-sm text-gray-500">
                        {location} - <span className="text-purple-600">{companyName}</span>
                    </p>
                </div>
            </div>

            {/* Status */}
            <div className="flex justify-start items-center space-x-2">
                <span
                    className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] rounded-full flex-shrink-0"
                    style={{backgroundColor: statusColor}}
                ></span>
                <span className="hidden md:flex text-black whitespace-nowrap">{status}</span>
            </div>

            {/* Button */}
            <div className="flex justify-end">
                <button onClick={() => openModal("view-application-method-modal")}
                        className="md:w-[127px] md:h-[35px] p-2 md:px-4 md:py-2 bg-[#6438C2] flex justify-center items-center text-white rounded-[10px] font-lato text-[11px] md:text-[16px] font-medium ">
                    {buttonText}
                </button>
            </div>
            <ViewApplicationMethodModal modalId="view-application-method-modal"/>
        </div>
    );
};

export default ApplicationCard;
