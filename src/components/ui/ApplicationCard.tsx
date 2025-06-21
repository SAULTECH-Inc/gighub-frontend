import React from "react";
import ViewApplicationMethodModal from "./ViewApplicationMethodModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import { ApplicationResponse } from "../../utils/types";

interface ApplicationCardProps {
  image: string;
  jobTitle: string;
  location: string;
  companyName: string;
  status: string;
  statusColor: string;
  buttonText: string;
  application?: ApplicationResponse;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  image,
  jobTitle,
  location,
  companyName,
  status,
  statusColor,
  buttonText,
  application,
}) => {
  const { openModal } = useModalStore();

  return (
    <div className="grid h-fit min-h-[58px] w-full grid-cols-[1fr_30px_100px] items-center gap-x-2 rounded-[16px] bg-[#F7F7F7] px-4 py-2 md:grid-cols-3 md:justify-between md:gap-x-6">
      {/* Applicant Details */}
      <div className="flex items-center space-x-4">
        <img
          src={image}
          alt="Applicant"
          className="h-[35px] w-[35px] rounded-[10px] object-cover md:h-[40px] md:w-[40px]"
        />
        <div>
          <h3 className="text-[11px] font-semibold text-black md:text-base">
            {jobTitle}
          </h3>
          <p className="text-gray-500 text-[9px] md:text-sm">
            {location} - <span className="text-purple-600">{companyName}</span>
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-start space-x-2">
        <span
          className="h-[14px] w-[14px] flex-shrink-0 rounded-full md:h-[16px] md:w-[16px]"
          style={{ backgroundColor: statusColor }}
        ></span>
        <span className="hidden whitespace-nowrap text-black md:flex">
          {status}
        </span>
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <button
          onClick={() => openModal("view-application-method-modal")}
          className="flex items-center justify-center rounded-[10px] bg-[#6438C2] p-2 font-lato text-[11px] font-medium text-white md:h-[35px] md:w-[127px] md:px-4 md:py-2 md:text-[16px]"
        >
          {buttonText}
        </button>
      </div>
      <ViewApplicationMethodModal
        application={application as ApplicationResponse}
        modalId="view-application-method-modal"
      />
    </div>
  );
};

export default ApplicationCard;
