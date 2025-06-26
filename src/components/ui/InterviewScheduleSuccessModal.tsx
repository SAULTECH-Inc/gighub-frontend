import React from "react";
import useModalStore from "../../store/modalStateStores.ts";
import { Link } from "react-router-dom";

interface SuccessModalProps {
  modalId: string;
  interviewId: number;
}

const InterviewScheduleSuccessModal: React.FC<SuccessModalProps> = ({
  modalId,
  interviewId,
}) => {
  const { modals, closeModal } = useModalStore();
  const isOpen = modals[modalId];

  const handleCloseApplicationSuccessModal = () => {
    if (isOpen) {
      closeModal(modalId);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={handleCloseApplicationSuccessModal}
    >
      <div
        className="relative flex h-[600px] w-[492px] flex-col items-center justify-center rounded-[12px] bg-white p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCloseApplicationSuccessModal}
          className="absolute top-6 right-6 cursor-pointer text-xl text-gray-500"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L17 17"
              stroke="#6438C2"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M1 17L17 0.999999"
              stroke="#6438C2"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="mb-5 flex h-fit w-fit items-center justify-center rounded-full">
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <rect width="100" height="100" fill="url(#pattern0_383_100)" />
            <defs>
              <pattern
                id="pattern0_383_100"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use xlinkHref="#image0_383_100" transform="scale(0.0111111)" />
              </pattern>
              <image
                id="image0_383_100"
                width="90"
                height="90"
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,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"
              />
            </defs>
          </svg>
        </div>

        <h2 className="mt-6 mb-6 text-[24px] font-semibold text-[#FA4E09]">
          Congratulations!
        </h2>

        <p className="mb-6 w-[360px] text-center text-[13px] text-gray-600">
          Your interview has been successfully scheduled. Both you and the
          candidate will receive a confirmation email with all the details. Good
          luck with your meeting!
        </p>

        <Link
          to={`/employer/interview-schedule/${interviewId}`}
          className="w-[186px] rounded-[16px] bg-[#6438C2] px-6 py-2 text-center text-[16px] font-medium text-white"
        >
          View Schedule
        </Link>
        <button
          onClick={handleCloseApplicationSuccessModal}
          className="mt-4 w-[186px] rounded-[8px] border-none bg-white px-6 py-2 text-[16px] font-medium text-[#6438C2]"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InterviewScheduleSuccessModal;
