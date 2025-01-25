import React from "react";
import ViewApplicationMethodModal from "./ViewApplicationMethodModal.tsx";
import useModalStore from "../../redux/modalStateStores.ts";


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
        <div className="grid grid-cols-3 items-center bg-[#F7F7F7] h-[58px] rounded-[16px] gap-x-6 w-full px-4">
            {/* Applicant Details */}
            <div className="flex items-center space-x-4">
                <img
                    src={image}
                    alt="Applicant"
                    className="w-[40px] h-[40px] rounded-[10px] object-cover"
                />
                <div>
                    <h3 className="text-base font-semibold text-black">{jobTitle}</h3>
                    <p className="text-sm text-gray-500">
                        {location} - <span className="text-purple-600">{companyName}</span>
                    </p>
                </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
                <span
                    className="w-[16px] h-[16px] rounded-full flex-shrink-0"
                    style={{ backgroundColor: statusColor }}
                ></span>
                <span className="text-black whitespace-nowrap">{status}</span>
            </div>

            {/* Button */}
            <div className="flex justify-end items-center">
                <button onClick={()=>openModal("view-application-method-modal")} className="w-[127px] h-[35px] px-4 py-2 bg-[#6438C2] text-white rounded-[10px] font-lato text-[16px] font-medium leading-[19.2px]">
                    {buttonText}
                </button>
                <ViewApplicationMethodModal modalId="view-application-method-modal"/>
            </div>
        </div>
    );
};

export default ApplicationCard;
