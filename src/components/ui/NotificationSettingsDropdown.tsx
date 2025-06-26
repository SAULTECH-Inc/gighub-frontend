import folderSearch from "../../assets/icons/folder-search.svg";
import jobPosting from "../../assets/icons/jobPosting.svg";
import interviewNotification from "../../assets/icons/interviewNotification.svg";
import platformUpdate from "../../assets/icons/platformUpdate.svg";
import paymentAndBilling from "../../assets/icons/paymentAndBilling.svg";
import generalNotification from "../../assets/icons/generalNotification.svg";
import React, { useState } from "react";
import useModalStore from "../../store/modalStateStores.ts";

interface NotificationSettingsDropdownProp {
  modalId: string;
}
const NotificationSettingsDropdown: React.FC<
  NotificationSettingsDropdownProp
> = ({ modalId }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const { modals, closeModal } = useModalStore();
  const isOpen = modals[modalId];

  const handleCloseApplicationSuccessModal = () => {
    if (isOpen) {
      closeModal(modalId);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative flex h-[400px] w-[305px] flex-col gap-y-4 rounded-[16px] bg-white p-4 shadow-lg">
          <button
            onClick={handleCloseApplicationSuccessModal}
            className="absolute top-2 right-4 text-lg font-bold text-purple-700"
          >
            &times;
          </button>
          <h1 className="mt-4 text-[20px]">Manage Your Notification</h1>
          <div className="flex w-full flex-col gap-y-4">
            <div
              onClick={() => setSelectedOption("jobApplication")}
              className={`flex h-[26px] cursor-pointer items-center gap-x-4 py-4 pl-2 text-[16px] hover:border-l-[5px] hover:border-l-[#6B5AED] ${selectedOption === "jobApplication" ? "border-l-[5px] border-l-[#6B5AED]" : "border-l-[5px] border-l-[#FFFFFF]"}`}
            >
              <img src={folderSearch} alt="Job Application" />{" "}
              <p>Job Application</p>
            </div>
            <div
              onClick={() => setSelectedOption("jobPosting")}
              className={`flex h-[26px] cursor-pointer items-center gap-x-4 py-4 pl-2 text-[16px] hover:border-l-[5px] hover:border-l-[#6B5AED] ${selectedOption === "jobPosting" ? "border-l-[5px] border-l-[#6B5AED]" : "border-l-[5px] border-l-[#FFFFFF]"}`}
            >
              <img src={jobPosting} alt="Job Posting" /> <p>Job Posting</p>
            </div>
            <div
              onClick={() => setSelectedOption("interviewNotification")}
              className={`flex h-[26px] cursor-pointer items-center gap-x-4 py-4 pl-2 text-[16px] hover:border-l-[5px] hover:border-l-[#6B5AED] ${selectedOption === "interviewNotification" ? "border-l-[5px] border-l-[#6B5AED]" : "border-l-[5px] border-l-[#FFFFFF]"}`}
            >
              <img src={interviewNotification} alt="Interview Notification" />{" "}
              <p>Interview Notification</p>
            </div>
            <div
              onClick={() => setSelectedOption("platformUpdate")}
              className={`flex h-[26px] cursor-pointer items-center gap-x-4 py-4 pl-2 text-[16px] hover:border-l-[5px] hover:border-l-[#6B5AED] ${selectedOption === "platformUpdate" ? "border-l-[5px] border-l-[#6B5AED]" : "border-l-[5px] border-l-[#FFFFFF]"}`}
            >
              <img src={platformUpdate} alt="Platform Update" />{" "}
              <p>Platform Update</p>
            </div>
            <div
              onClick={() => setSelectedOption("paymentBilling")}
              className={`flex h-[26px] cursor-pointer items-center gap-x-4 py-4 pl-2 text-[16px] hover:border-l-[5px] hover:border-l-[#6B5AED] ${selectedOption === "paymentBilling" ? "border-l-[5px] border-l-[#6B5AED]" : "border-l-[5px] border-l-[#FFFFFF]"}`}
            >
              <img src={paymentAndBilling} alt="Payment and Billing" />{" "}
              <p>Payment and Billing</p>
            </div>
            <div
              onClick={() => setSelectedOption("generalNotification")}
              className={`flex h-[26px] cursor-pointer items-center gap-x-4 py-4 pl-2 text-[16px] hover:border-l-[5px] hover:border-l-[#6B5AED] ${selectedOption === "generalNotification" ? "border-l-[5px] border-l-[#6B5AED]" : "border-l-[5px] border-l-[#FFFFFF]"}`}
            >
              <img src={generalNotification} alt="General Notification" />{" "}
              <p>General Notification</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationSettingsDropdown;
