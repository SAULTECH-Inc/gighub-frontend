import React from "react";
import { NetworkDetails } from "../../utils/types";
import {
  acceptConnectionRequest,
  rejectConnectionRequest,
} from "../../services/api";
import pro from "../../assets/icons/pro.svg";

interface NetworkConnectionsCardProps {
  userDetails: NetworkDetails;
}
const NetworkConnectionsCard: React.FC<NetworkConnectionsCardProps> = ({
  userDetails,
}) => {
  const handleAcceptRequest = async () => {
    console.log("Accepted request from", userDetails.id);
    const response = await acceptConnectionRequest(userDetails.id);
    if (response?.statusCode === 200) {
      console.log("Request accepted successfully");
    } else {
      console.error("Failed to accept request", response?.data);
    }
  };
  const handleRejectRequest = async () => {
    console.log("Rejected request from", userDetails?.applicant?.firstName);
    const response = await rejectConnectionRequest(userDetails.id);
    if (response?.statusCode === 200) {
      console.log("Request rejected successfully");
    } else {
      console.error("Failed to reject request", response?.data);
    }
  };
  return (
    <div className="mx-auto flex max-w-[353px] flex-col space-y-6 rounded-[16px] border border-[#E6E6E6] bg-white px-4 py-6 shadow">
      <div className="relative flex flex-col gap-4">
        <div className="self-end rounded-[10px] border border-[#E6E6E6] px-4 py-[6px]">
          <button className="font-bold text-[#000000]">Send message</button>
        </div>
        <hr />
        <div className="absolute top-3 left-4 h-[60px] w-[60px] rounded-full bg-[#D9D9D9]">
          <img
            src={userDetails?.applicant?.profilePicture as string}
            alt="Profile"
            className="h-full w-full rounded-full"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[20px] font-bold text-[#000000]">
            {userDetails?.applicant?.firstName}{" "}
            {userDetails?.applicant?.lastName}
          </p>
          {userDetails?.applicant?.city && userDetails?.applicant?.city && (
            <p className="font-bold text-[#8E8E8E]">
              {userDetails?.applicant?.city} {userDetails?.applicant?.country}
            </p>
          )}
        </div>
        <div className="flex h-[40px] w-[40px] flex-row items-center justify-center rounded-full border-[1px] border-[#E6E6E6] bg-white">
          <img
            src={pro}
            alt="Profile"
            className="h-[24px] w-[24[x] rounded-full"
          />
        </div>
      </div>
      <div className="mt-4 flex w-full items-center justify-between gap-x-4 self-center font-bold">
        <button
          onClick={() => handleRejectRequest()}
          className="block rounded-[10px] bg-[#E6E6E6] px-10 py-[6px] text-[#000000]"
        >
          Reject
        </button>
        <button
          onClick={() => handleAcceptRequest()}
          className="block rounded-[10px] bg-[#6438C2] px-10 py-[7px] text-[#FFFFFF]"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default NetworkConnectionsCard;
