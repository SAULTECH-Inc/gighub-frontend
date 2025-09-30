import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Linkedin, Twitter, MapPin, Briefcase, Clock } from "lucide-react";
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
  const { setRecipient, setRecipientDetails, setIsClosed, setIsMinimized } = useChatStore();

  const handleConnect = async () => {
    try {
      const response = await connectUser(
        userDetails?.applicant?.id ? userDetails?.applicant?.id.toString() : "0"
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
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <img
              src={userDetails?.applicant?.profilePicture || "/api/placeholder/60/60"}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {userDetails?.applicant?.firstName} {userDetails?.applicant?.lastName}
            </h3>
            {userDetails?.applicant?.city && userDetails?.applicant?.country && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin size={14} className="mr-1" />
                <span>{userDetails?.applicant?.city}, {userDetails?.applicant?.country}</span>
              </div>
            )}
          </div>
        </div>

        {/* Professional Title */}
        <div className="mb-4">
          <div className="flex items-center text-sm text-purple-600 font-medium">
            <Briefcase size={14} className="mr-1" />
            <span>
              {userDetails?.applicant?.cv?.professionalTitle ||
                userDetails?.applicant?.professionalTitle ||
                "Professional"}
            </span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center space-x-3 mb-6">
          {userDetails?.applicant?.linkedInProfile && (
            <Link
              to={userDetails.applicant.linkedInProfile}
              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Linkedin size={16} />
            </Link>
          )}
          {userDetails?.applicant?.twitterProfile && (
            <Link
              to={userDetails.applicant.twitterProfile}
              className="p-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors"
            >
              <Twitter size={16} />
            </Link>
          )}
          <button
            onClick={handleStartChat}
            className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors ml-auto"
          >
            <MessageCircle size={16} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link
            to={`/applicant/public-profile-view/${userDetails?.applicant?.id}`}
            className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 text-center text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            View Profile
          </Link>
          <button
            onClick={handleConnect}
            disabled={isConnectionDisabled}
            className={`flex-1 py-2.5 px-4 text-center text-sm font-medium rounded-lg transition-colors ${
              isConnectionDisabled
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {userDetails?.connectionStatus === ConnectionStatus.PENDING && (
              <Clock size={14} className="inline mr-1" />
            )}
            {getConnectionButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
