import useModalStore from "../../store/modalStateStores.ts";
import cancel from "../../assets/icons/cancel.svg";
import profilepics from "../../assets/images/profilepics.png";
import React from "react";
import { InterviewScheduleDetailsResponse } from "../../utils/types";
import moment from "moment";
import {
  capitalizeEachCase,
  formatTime,
  USER_TYPE,
} from "../../utils/helpers.ts";
import { Link } from "react-router-dom";
import {
  cancelInterview,
  rescheduleInterview,
  withdrawApplication,
} from "../../services/api";
import { useAuth } from "../../store/useAuth.ts";
import { UserType } from "../../utils/enums.ts";

interface ModalProps {
  modalId: string;
  selectedEvent: InterviewScheduleDetailsResponse;
}
const ApplicantScheduleModal: React.FC<ModalProps> = ({
  modalId,
  selectedEvent,
}) => {
  const { modals, closeModal } = useModalStore();
  const { userType } = useAuth();
  const handleWithdrawApplication = async (jobId: number) => {
    const response = await withdrawApplication(jobId);
    if (response) {
      closeModal(modalId);
    }
  };

  const handleCancelInterview = async (interviewId: number) => {
    // Implement cancellation logic here
    console.log("Cancelling interview with ID:", interviewId);
    const response = await cancelInterview(interviewId);
    if (response) {
      closeModal(modalId);
    }
  };
  const handleUpdateInterview = async (interviewId: number) => {
    console.log("Rescheduling interview with ID:", interviewId);
    const response = await rescheduleInterview(interviewId);
    if (response) {
      closeModal(modalId);
    }
  };
  const isOpen = modals[modalId];
  const isEmployer = USER_TYPE === UserType.EMPLOYER;
  const profilePath = isEmployer
    ? `/applicant/public-profile-view/${selectedEvent?.job?.employer?.id}`
    : `/employers/${selectedEvent?.job?.employer?.id}/${selectedEvent?.job?.employer?.companyName}/profile`;

  const profilePicUrl = isEmployer
    ? selectedEvent?.job?.employer?.companyLogo
    : selectedEvent?.job?.employer?.companyLogo;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex h-[700px] w-[650px] flex-col justify-evenly overflow-hidden rounded-[16px] bg-white shadow-xl">
        {/* Header */}
        <div className="relative -mt-9 flex h-[113px] items-center rounded-t-[16px] bg-gradient-to-r from-[#6438C2] to-[#FFFFFF]">
          {/* Close Button */}
          <div
            onClick={() => closeModal(modalId)}
            className="absolute right-6 top-10 flex h-[34px] w-[36px] cursor-pointer items-center justify-center rounded-full bg-white p-2 text-black focus:outline-none"
          >
            <img className="cursor-pointer" src={cancel} alt="cancel" />
          </div>
          <div className="absolute top-[70px] flex w-[530px] items-end justify-between px-3">
            {/* Profile Image */}
            <img
              src={profilePicUrl || profilepics}
              className="ml-3 h-[100px] w-[100px] flex-shrink-0 rounded-full"
              alt="profile pics"
            />
            <div className="mb-0 ml-4 flex flex-1 items-end justify-between pb-0 pt-5">
              {/* Company Info */}
              <div className="flex flex-col">
                <h2 className="text-[20px] font-bold text-black">
                  {selectedEvent?.job?.company}
                </h2>
                <p className="text-[16px] text-[#7F7F7F]">
                  {selectedEvent?.job?.location}
                </p>
              </div>
              {/* Remote Work */}
              <p className="text-[20px] font-medium text-[#6B5AED]">
                {selectedEvent?.job?.jobType}
              </p>
            </div>
          </div>
        </div>

        {/* Application Pending and View Profile */}
        <div className="mt-[100px] flex w-full items-center justify-between px-6">
          <div className="flex h-[27px] w-[128px] items-center justify-center rounded-[16px] border-[1px] border-[#FFE4B5] bg-[#FA4E0930] px-2 py-3 text-center text-[16px] font-medium text-[#FA4E09]">
            {selectedEvent.status}
          </div>
          <Link
            to={profilePath}
            className="flex h-[34px] w-[147px] items-center justify-center rounded-[10px] bg-[#6438C2] px-4 py-2 text-[16px] font-medium text-white hover:bg-purple-600"
          >
            View Profile
          </Link>
        </div>

        <div className="mt-6 flex w-full items-center justify-start gap-x-4 px-6">
          <h3 className="text-center text-[16px] font-semibold text-[#6438C2]">
            {selectedEvent?.title}
          </h3>
          {/*vertical divider*/}
          <div className="mx-4 h-[20px] border-l-[2px] border-[#6438C2]"></div>
          <h3 className="text-center text-[16px] font-semibold text-[#6438C2]">
            {selectedEvent?.job?.title}
          </h3>
        </div>

        {/* Application Details */}
        <div className="mx-auto mt-6 grid h-[190px] w-[512px] grid-cols-2 items-center justify-center gap-2 rounded-[16px] border-[1px] border-[#E6E6E6] p-4">
          <div className="pl-4">
            <h4 className="text-[16px] font-semibold text-black">
              Interview Date
            </h4>
            <p className="text-[16px] text-[#6438C2]">
              {moment(selectedEvent.date).format("ll")}
            </p>
          </div>
          <div className="pl-4">
            <h4 className="text-[16px] font-semibold text-black">
              Interview Time
            </h4>
            <p className="text-[16px] text-[#6438C2]">
              {formatTime(selectedEvent.startTime)} -{" "}
              {formatTime(selectedEvent.endTime)}
            </p>
          </div>
          <div className="pl-4">
            <h4 className="text-[16px] font-semibold text-black">
              Interview Type
            </h4>
            <p className="text-[16px] text-[#6438C2]">
              {capitalizeEachCase(selectedEvent.interviewType)}
            </p>
          </div>
          <div className="pl-4">
            <h4 className="text-[16px] font-semibold text-black">Time Zone</h4>
            <p className="text-[16px] text-[#6438C2]">
              {selectedEvent.timeZone}
            </p>
          </div>
          <div className="pl-4">
            <h4 className="text-[16px] font-semibold text-black">
              Interview Platform
            </h4>
            <p className="text-[16px] text-[#6438C2]">
              {capitalizeEachCase(selectedEvent.interviewPlatform)}
            </p>
          </div>
        </div>
        {/*Interview platform, interview link, join button*/}
        <div className="mt-6 flex w-full items-center justify-between px-6">
          <Link
            to={selectedEvent?.interviewLink || ""}
            className="flex h-[34px] w-[147px] items-center justify-center rounded-[10px] bg-[#6438C2] px-4 py-2 text-[16px] font-medium text-white hover:bg-purple-600"
          >
            Join
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between gap-x-4 px-6 py-4">
          <button
            onClick={() => closeModal(modalId)}
            className="text-gray-700 hover:bg-gray-100 w-[181px] rounded-[10px] border-[1px] border-[#E6E6E6] bg-white px-6 py-2 text-[16px]"
          >
            Close
          </button>
          <div className="flex items-center gap-x-2">
            {userType === UserType.EMPLOYER && (
              <button
                onClick={() => handleCancelInterview(selectedEvent.id)}
                className="rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#F9F9F9] px-6 py-2 text-[16px] text-black hover:bg-[#F5F5F5]"
              >
                Cancel Interview
              </button>
            )}
            <button
              onClick={async () => {
                if (userType === UserType.APPLICANT) {
                  await handleWithdrawApplication(selectedEvent.job.id);
                } else {
                  await handleUpdateInterview(selectedEvent.id);
                }
              }}
              className="rounded-[10px] bg-[#6438C2] px-6 py-2 text-[16px] text-white hover:bg-purple-600"
            >
              {userType === UserType.APPLICANT
                ? "Withdraw Application"
                : "Modify Interview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantScheduleModal;
