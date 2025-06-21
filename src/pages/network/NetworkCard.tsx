import linkedin from "../../assets/icons/linkedin-round.svg";
import twitter from "../../assets/icons/twitter-rounded.svg";
import chatIcon from "../../assets/icons/chat-icon.svg";
import avatarIcon from "../../assets/icons/avatar.svg";
import { NetworkDetails } from "../../utils/types";
import React from "react";
import { Link } from "react-router-dom";
import { useChatStore } from "../../store/useChatStore.ts";
interface NetworkCardProps {
  userDetails: NetworkDetails;
  setChatWindowOpened: React.Dispatch<React.SetStateAction<boolean>>;
}
const NetworkCard: React.FC<NetworkCardProps> = ({
  userDetails,
  setChatWindowOpened,
}) => {
  const { setRecipient, setRecipientDetails, setIsClosed, setIsMinimized } =
    useChatStore();
  const location =
    userDetails?.city && userDetails?.country
      ? `${userDetails?.city}, ${userDetails?.country}`
      : null;
  return (
    <>
      <div className="h-[380px] w-full space-y-4 rounded-[16px] border-[1px] border-[#E6E6E6] p-[18px] sm:w-[45%] md:w-full mdl:w-[45%] lg:w-[298px]">
        <div className="h-[60px] w-[60px] rounded-full bg-[#D9D9D9]">
          <img
            src={userDetails?.profilePicture || avatarIcon}
            alt="Profile"
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-[20px] font-semibold text-[#000000]">
            {userDetails?.firstName} {userDetails?.lastName}
          </h3>
          {location && <p>{location}</p>}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-x-2">
            <div className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border-[1px] border-[#E6E6E6]">
              <Link to={userDetails?.linkedInProfile || "#"}>
                <img src={linkedin} alt="linkedin-icon" />
              </Link>
            </div>
            <div className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border-[1px] border-[#E6E6E6]">
              <Link to={userDetails?.twitterProfile || "#"}>
                <img src={twitter} alt="twitter-icon" />
              </Link>
            </div>
          </div>
          <div>
            <div
              onClick={() => {
                setIsClosed(false);
                setIsMinimized(false);
                setRecipient(userDetails.email);
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
            {userDetails?.professionalTitle ||
              userDetails?.cv?.professionalTitle ||
              "Applicant"}
          </p>
          <p>Level</p>
        </div>
        <div className="flex items-center justify-between text-[16px] font-bold text-[#6438C2]">
          {userDetails.mutualFriends && userDetails.mutualFriends > 0 ? (
            <p>
              {userDetails.mutualFriends} Mutual Connection
              {userDetails.mutualFriends > 1 ? "s" : ""}
            </p>
          ) : (
            <p>No Mutual Connections</p>
          )}
          <div className="rounded-[10px] border border-[#E6E6E6] px-[16px] py-[6px] md:px-[10px] md:py-[4px] lg:px-[16px] lg:py-[6px]">
            <Link
              to={`/applicant/public-profile-view/${userDetails?.userId}`}
              className="text-[16px] font-medium text-[#000000] md:text-[14px] lg:text-[16px]"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NetworkCard;
