import React from "react";
import linkedin from "../../assets/icons/linkedin-round.svg";
import twitter from "../../assets/icons/twitter-rounded.svg";
import chatIcon from "../../assets/icons/chat-icon.svg";
import { NetworkDetails } from "../../utils/types";
import { Link } from "react-router-dom";
import { connectUser } from "../../services/api";
import { ConnectionStatus } from "../../utils/enums.ts";
import { useChatStore } from "../../store/useChatStore.ts";

interface NetworkCardProps {
  userDetails: NetworkDetails;
  setChatWindowOpened: React.Dispatch<React.SetStateAction<boolean>>;
}
const UserCard: React.FC<NetworkCardProps> = ({
  userDetails,
  setChatWindowOpened,
}) => {
  const { setRecipient, setRecipientDetails, setIsClosed, setIsMinimized } =
    useChatStore();

  const handleConnect = async () => {
    console.log(
      "Connect clicked for user with ID:",
      userDetails?.applicant?.id,
    );
    // Add your connect logic here
    const response = await connectUser(
      userDetails?.applicant?.id ? userDetails?.applicant?.id.toString() : "0",
    );
    console.log("Connect response:", response);
    if (response?.statusCode === 200) {
      console.log("Connection request sent successfully");
    } else {
      console.error("Failed to send connection request");
    }
  };

  return (
    <>
      <div className="mdl:w-[55%] relative h-[440px] w-[calc(100%-1rem)] space-y-4 rounded-[16px] border-[1px] border-[#E6E6E6] p-[18px] sm:w-[calc(45%-1rem)] md:w-full lg:w-[380px]">
        <div className="h-[60px] w-[60px] rounded-full bg-[#D9D9D9]">
          <img
            src={userDetails?.applicant?.profilePicture as string}
            alt="Profile"
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-[20px] font-semibold text-[#000000]">
            {userDetails?.applicant?.firstName}{" "}
            {userDetails?.applicant?.lastName}
          </h3>
          {userDetails?.applicant?.city && userDetails?.applicant?.city && (
            <p className="font-bold text-[#8E8E8E]">
              {userDetails?.applicant?.city} {userDetails?.applicant?.country}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-x-2">
            <div className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border-[1px] border-[#E6E6E6]">
              <Link
                to={
                  userDetails?.applicant?.linkedInProfile
                    ? userDetails?.applicant?.linkedInProfile
                    : linkedin
                }
              >
                <img src={linkedin} alt="linkedin-icon" />
              </Link>
            </div>
            <div className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border-[1px] border-[#E6E6E6]">
              <Link
                to={
                  userDetails?.applicant?.twitterProfile
                    ? userDetails?.applicant?.twitterProfile
                    : twitter
                }
              >
                <img src={twitter} alt="twitter icon" />
              </Link>
            </div>
          </div>
          <div>
            <div
              onClick={() => {
                setIsClosed(false);
                setIsMinimized(false);
                setRecipient(userDetails?.applicant?.email as string);
                setRecipientDetails(userDetails);
                setChatWindowOpened((prev) => !prev);
              }}
              className="flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full border-[1px] border-[#E6E6E6] bg-[#6438C2]"
            >
              <img src={chatIcon} alt="chat icon" />
            </div>
          </div>
        </div>
        <hr className="w-full border-[1px] border-[#AFAFAF]" />
        <div className="flex items-center justify-between text-[16px] font-bold text-[#6438C2]">
          <p>
            {userDetails?.applicant?.cv?.professionalTitle ||
              userDetails?.applicant?.professionalTitle ||
              "Applicant"}
          </p>
          <p>Level</p>
        </div>

        <div className="absolute right-0 bottom-4 left-0 flex w-full items-center justify-center gap-x-6 font-bold">
          <Link
            to={`/applicant/public-profile-view/${userDetails?.id}`}
            className="w-1/3 rounded-[10px] bg-[#E6E6E6] px-2 py-[8px] text-center text-sm text-[#000000]"
          >
            View Profile
          </Link>
          <button
            onClick={() => handleConnect()}
            disabled={
              userDetails?.connectionStatus === ConnectionStatus.PENDING ||
              userDetails?.connectionStatus === ConnectionStatus.REJECTED
            }
            className="w-1/3 rounded-[10px] bg-[#6438C2] px-2 py-[8px] text-sm text-[#FFFFFF]"
          >
            {userDetails?.connectionStatus === ConnectionStatus.PENDING
              ? "Request Sent"
              : userDetails?.connectionStatus === ConnectionStatus.REJECTED
                ? "Rejected"
                : "Connect"}
          </button>
        </div>
      </div>
    </>
  );
};

export default UserCard;
