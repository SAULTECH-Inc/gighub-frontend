import React from "react";
import cancel from "../../assets/icons/cancel.svg";
import profilepics from "../../assets/images/profilepics.png";
import video from "../../assets/icons/videoThick.svg";
import userProfile from "../../assets/icons/userProfile.svg";
import documentAttachement from "../../assets/icons/documentAttachement.svg";
import useModalStore from "../../store/modalStateStores.ts";
import { ApplicationResponse } from "../../utils/types";
import { withdrawApplication } from "../../services/api";
import { ApplicationStatus } from "../../utils/dummyApplications.ts";
import { Link } from "react-router-dom";
import { UserType } from "../../utils/enums.ts";
import { USER_TYPE } from "../../utils/helpers.ts";

interface ModalProps {
  modalId: string;
  application: ApplicationResponse;
}

const ViewApplicationMethodModal: React.FC<ModalProps> = ({
  modalId,
  application,
}) => {
  const { modals, closeModal } = useModalStore();
  const isOpen = modals[modalId]; // Reactive state for this modal

  const handleWithdrawApplication = async (jobId: number) => {
    const response = await withdrawApplication(jobId);
    if (response) {
      closeModal(modalId);
    }
  };

  const profilePath =
    USER_TYPE === UserType.EMPLOYER
      ? `/applicant/public-profile-view/${application?.applicant?.id}`
      : `/employers/${application?.job?.employer?.id}/${application?.job?.employer?.companyName}/profile`;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="flex h-[700px] w-[calc(97%-10px)] flex-col justify-evenly overflow-hidden rounded-[16px] bg-white shadow-xl md:h-[830px] md:w-[568px]">
        {/* Header */}
        <div className="relative -mt-8 flex h-[113px] items-center rounded-t-[16px] bg-gradient-to-r from-[#6438C2] to-[#FFFFFF] md:-mt-9">
          {/* Close Button */}
          <div
            onClick={() => closeModal(modalId)}
            className="absolute right-4 top-9 md:top-12 flex h-[34px] w-[36px] cursor-pointer items-center justify-center rounded-full bg-white p-2 text-black focus:outline-none"
          >
            <img className="cursor-pointer" src={cancel} alt="cancel" />
          </div>
          <div className="absolute top-[50px] md:top-[70px] flex w-[530px] items-end justify-between px-3">
            {/* Profile Image */}
            <img
              src={
                USER_TYPE === UserType.EMPLOYER
                  ? application?.applicant?.profilePicture || profilepics
                  : application?.job?.employer?.companyLogo || profilepics
              }
              className="ml-3 h-[70px] w-[70px] flex-shrink-0 rounded-full md:h-[100px] md:w-[100px]"
              alt="profile pics"
            />
            <div className="mb-0 ml-4 flex flex-1 items-end justify-between pb-0 pt-5">
              {/* Company Info */}
              <div className="flex flex-col">
                <h2 className="text-[20px] font-bold text-black">
                  {application?.job?.employer?.companyName}
                </h2>
                <p className="text-[16px] text-[#7F7F7F]">
                  {application?.job?.location}
                </p>
              </div>
              {/* Remote Work */}
              <p className="text-[20px] font-medium text-[#6B5AED]">
                {application?.job?.jobType}
              </p>
            </div>
          </div>
        </div>

        {/* Application Pending and View Profile */}
        <div className="mt-[100px] flex w-full flex-col items-center justify-between gap-y-2 px-6 md:flex-row">
          <div className="w-full rounded-[16px] border-[1px] border-[#FFE4B5] bg-[#ffffe0] px-3 py-2 text-center text-[16px] font-medium text-[#FFBA00] md:w-[197px]">
            {application?.status}
          </div>
          <Link
            to={profilePath}
            className="w-full items-center rounded-[16px] bg-[#6438C2] px-4 py-2 text-center text-[16px] font-medium text-white hover:bg-purple-600 md:w-[147px]"
          >
            View Profile
          </Link>
        </div>

        {/* Application Details */}
        <div className="mx-auto mt-6 flex h-[318px] w-[90%] flex-col items-baseline justify-evenly rounded-[16px] border-[1px] border-[#E6E6E6] px-6 py-4 md:w-[512px]">
          <h3 className="text-gray-600 mb-4 text-sm font-medium">
            You Applied with
          </h3>
          <div className="flex h-[223px] w-full flex-col items-center justify-center gap-y-4 rounded-[16px] bg-[#F7F7F7] md:w-[461px]">
            {/* File Item */}
            {application?.job?.applicationMethod?.byCv && (
              <div className="flex h-[48px] w-[90%] items-center rounded-[16px] bg-[#FFFFFF] p-3 md:w-[392px]">
                <div className="flex h-[33px] w-[35px] items-center justify-center rounded-[10px] bg-[#D9D9D9] object-cover p-1">
                  <img src={documentAttachement} alt="work icon" />
                </div>
                <span className="text-gray-600 ml-3 text-sm">Aliyu_CV.pdf</span>
              </div>
            )}

            {/* Video Item */}
            {application?.job?.applicationMethod?.byVideo && (
              <div className="flex h-[48px] w-[90%] items-center rounded-[16px] bg-[#FFFFFF] p-3 md:w-[392px]">
                <div className="flex h-[33px] w-[35px] items-center justify-center rounded-[10px] bg-[#D9D9D9] object-cover p-1">
                  <img src={video} alt="video icon" />
                </div>
                <span className="text-gray-600 ml-3 text-sm">Video</span>
              </div>
            )}

            {/* Profile Item */}
            {application?.job?.applicationMethod?.byProfile && (
              <div className="flex h-[48px] w-[90%] items-center rounded-[16px] bg-[#FFFFFF] p-3 md:w-[392px]">
                <div className="flex h-[33px] w-[35px] items-center justify-center rounded-[10px] bg-[#D9D9D9] object-cover p-1">
                  <img src={userProfile} alt="profile icon" />
                </div>
                <span className="text-gray-600 ml-3 text-sm">Profile</span>
              </div>
            )}
            {/* Document Item */}
            {application?.job?.applicationMethod?.byCoverLetter && (
              <div className="flex h-[48px] w-[90%] items-center rounded-[16px] bg-[#FFFFFF] p-3 md:w-[392px]">
                <div className="flex h-[33px] w-full items-center justify-center rounded-[10px] bg-[#D9D9D9] object-cover p-1 md:w-[392px]">
                  <img src={documentAttachement} alt="document icon" />
                </div>
                <span className="text-gray-600 ml-3 text-sm">Document</span>
              </div>
            )}

            {/* Video Item */}
            {application?.job?.applicationMethod?.byPortfolio && (
              <div className="flex h-[48px] w-full items-center rounded-[16px] bg-[#FFFFFF] p-3 md:w-[392px]">
                <div className="flex h-[33px] w-[35px] items-center justify-center rounded-[10px] bg-[#D9D9D9] object-cover p-1">
                  <img src={video} alt="video icon" />
                </div>
                <span className="text-gray-600 ml-3 text-sm">Video</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex w-full flex-col items-center justify-center gap-x-4 gap-y-2 px-6 py-4 md:flex-row md:justify-end">
          {USER_TYPE === UserType.EMPLOYER ? (
            <button
              onClick={async () => {
                await handleWithdrawApplication(application.job.id);
              }}
              className="w-full rounded-[10px] bg-[#6438C2] px-6 py-2 text-[16px] text-white hover:bg-purple-600 md:w-fit"
            >
              Reject
            </button>
          ) : (
            <>
              <button
                onClick={() => closeModal(modalId)}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 w-full rounded-[10px] border-[1px] border-[#E6E6E6] px-6 py-2 text-[16px] md:w-[181px]"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleWithdrawApplication(application.job.id);
                }}
                className="w-full rounded-[10px] bg-[#6438C2] px-6 py-2 text-[16px] text-white hover:bg-purple-600 md:w-fit"
              >
                {application?.status === ApplicationStatus.WITHDRAW
                  ? "Re-Apply"
                  : "Withdraw Application"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewApplicationMethodModal;
