import React from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Linkedin,
  Twitter,
  MapPin,
  Briefcase,
  Clock,
} from "lucide-react";
import { NetworkDetails } from "../../utils/types";
import { ConnectionStatus } from "../../utils/enums.ts";
import { connectUser } from "../../services/api";
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
    try {
      const response = await connectUser(
        userDetails?.applicant?.id
          ? userDetails?.applicant?.id.toString()
          : "0",
      );
      if (response?.statusCode === 200) {
        console.log("Connection request sent successfully");
      } else {
        console.error("Failed to send connection request");
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };

  const handleStartChat = () => {
    setIsClosed(false);
    setIsMinimized(false);
    setRecipient(userDetails?.applicant?.email as string);
    setRecipientDetails(userDetails);
    setChatWindowOpened(true);
  };

  const getConnectionButtonText = () => {
    switch (userDetails?.connectionStatus) {
      case ConnectionStatus.PENDING:
        return "Request Sent";
      case ConnectionStatus.REJECTED:
        return "Request Declined";
      default:
        return "Connect";
    }
  };

  const isConnectionDisabled =
    userDetails?.connectionStatus === ConnectionStatus.PENDING ||
    userDetails?.connectionStatus === ConnectionStatus.REJECTED;

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="p-6">
        {/* Profile Header */}
        <div className="mb-4 flex items-start space-x-4">
          <div className="relative">
            <img
              src={
                userDetails?.applicant?.profilePicture ||
                "/api/placeholder/60/60"
              }
              alt="Profile"
              className="h-16 w-16 rounded-full border-2 border-gray-100 object-cover"
            />
            <div className="absolute -right-1 -bottom-1 h-5 w-5 rounded-full border-2 border-white bg-green-400"></div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-gray-900">
              {userDetails?.applicant?.firstName}{" "}
              {userDetails?.applicant?.lastName}
            </h3>
            {userDetails?.applicant?.city &&
              userDetails?.applicant?.country && (
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <MapPin size={14} className="mr-1" />
                  <span>
                    {userDetails?.applicant?.city},{" "}
                    {userDetails?.applicant?.country}
                  </span>
                </div>
              )}
          </div>
        </div>

        {/* Professional Title */}
        <div className="mb-4">
          <div className="flex items-center text-sm font-medium text-purple-600">
            <Briefcase size={14} className="mr-1" />
            <span>
              {userDetails?.applicant?.cv?.professionalTitle ||
                userDetails?.applicant?.professionalTitle ||
                "Professional"}
            </span>
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-6 flex items-center space-x-3">
          {userDetails?.applicant?.linkedInProfile && (
            <Link
              to={userDetails.applicant.linkedInProfile}
              className="rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100"
            >
              <Linkedin size={16} />
            </Link>
          )}
          {userDetails?.applicant?.twitterProfile && (
            <Link
              to={userDetails.applicant.twitterProfile}
              className="rounded-lg bg-sky-50 p-2 text-sky-600 transition-colors hover:bg-sky-100"
            >
              <Twitter size={16} />
            </Link>
          )}
          <button
            onClick={handleStartChat}
            className="ml-auto rounded-lg bg-purple-50 p-2 text-purple-600 transition-colors hover:bg-purple-100"
          >
            <MessageCircle size={16} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link
            to={`/applicant/public-profile-view/${userDetails?.applicant?.id}`}
            className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            View Profile
          </Link>
          <button
            onClick={handleConnect}
            disabled={isConnectionDisabled}
            className={`flex-1 rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
              isConnectionDisabled
                ? "cursor-not-allowed bg-gray-100 text-gray-500"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {userDetails?.connectionStatus === ConnectionStatus.PENDING && (
              <Clock size={14} className="mr-1 inline" />
            )}
            {getConnectionButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
