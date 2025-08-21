import React, { useState } from "react";
import { Check, X, MessageCircle, Award } from "lucide-react";
import { NetworkDetails } from "../../utils/types";
import { acceptConnectionRequest, rejectConnectionRequest } from "../../services/api";

interface NetworkConnectionsCardProps {
  userDetails: NetworkDetails;
}

const NetworkConnectionsCard: React.FC<NetworkConnectionsCardProps> = ({
                                                                         userDetails,
                                                                       }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionTaken, setActionTaken] = useState<'accepted' | 'rejected' | null>(null);

  const handleAcceptRequest = async () => {
    setIsProcessing(true);
    try {
      const response = await acceptConnectionRequest(userDetails.id);
      if (response?.statusCode === 200) {
        setActionTaken('accepted');
        console.log("Request accepted successfully");
      } else {
        console.error("Failed to accept request", response?.data);
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRequest = async () => {
    setIsProcessing(true);
    try {
      const response = await rejectConnectionRequest(userDetails.id);
      if (response?.statusCode === 200) {
        setActionTaken('rejected');
        console.log("Request rejected successfully");
      } else {
        console.error("Failed to reject request", response?.data);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (actionTaken) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
          actionTaken === 'accepted' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {actionTaken === 'accepted' ? (
            <Check size={24} className="text-green-600" />
          ) : (
            <X size={24} className="text-red-600" />
          )}
        </div>
        <p className="text-gray-600">
          Request {actionTaken === 'accepted' ? 'accepted' : 'declined'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header with Message Button */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Connection Request
            </span>
          </div>
          <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <MessageCircle size={18} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="relative">
            <img
              src={userDetails?.applicant?.profilePicture || "/api/placeholder/60/60"}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="absolute -top-1 -right-1 bg-purple-100 rounded-full p-1">
              <Award size={12} className="text-purple-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {userDetails?.applicant?.firstName} {userDetails?.applicant?.lastName}
            </h3>
            {userDetails?.applicant?.city && userDetails?.applicant?.country && (
              <p className="text-sm text-gray-500 truncate">
                {userDetails?.applicant?.city}, {userDetails?.applicant?.country}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleRejectRequest}
            disabled={isProcessing}
            className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isProcessing ? "..." : "Decline"}
          </button>
          <button
            onClick={handleAcceptRequest}
            disabled={isProcessing}
            className="flex-1 py-2.5 px-4 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isProcessing ? "..." : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkConnectionsCard;