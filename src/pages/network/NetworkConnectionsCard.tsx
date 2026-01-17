import React, { useState } from "react";
import { Check, X, MessageCircle, Award } from "lucide-react";
import { NetworkDetails } from "../../utils/types";
import {
  acceptConnectionRequest,
  rejectConnectionRequest,
} from "../../services/api";

interface NetworkConnectionsCardProps {
  userDetails: NetworkDetails;
}

const NetworkConnectionsCard: React.FC<NetworkConnectionsCardProps> = ({
  userDetails,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionTaken, setActionTaken] = useState<
    "accepted" | "rejected" | null
  >(null);

  const handleAcceptRequest = async () => {
    setIsProcessing(true);
    try {
      const response = await acceptConnectionRequest(userDetails.id);
      if (response?.statusCode === 200) {
        setActionTaken("accepted");
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
        setActionTaken("rejected");
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
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <div
          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            actionTaken === "accepted" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {actionTaken === "accepted" ? (
            <Check size={24} className="text-green-600" />
          ) : (
            <X size={24} className="text-red-600" />
          )}
        </div>
        <p className="text-gray-600">
          Request {actionTaken === "accepted" ? "accepted" : "declined"}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="p-6">
        {/* Header with Message Button */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
              Connection Request
            </span>
          </div>
          <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-purple-50 hover:text-purple-600">
            <MessageCircle size={18} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="mb-6 flex items-center space-x-3">
          <div className="relative">
            <img
              src={
                userDetails?.applicant?.profilePicture ||
                "/api/placeholder/60/60"
              }
              alt="Profile"
              className="h-14 w-14 rounded-full object-cover"
            />
            <div className="absolute -top-1 -right-1 rounded-full bg-purple-100 p-1">
              <Award size={12} className="text-purple-600" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-gray-900">
              {userDetails?.applicant?.firstName}{" "}
              {userDetails?.applicant?.lastName}
            </h3>
            {userDetails?.applicant?.city &&
              userDetails?.applicant?.country && (
                <p className="truncate text-sm text-gray-500">
                  {userDetails?.applicant?.city},{" "}
                  {userDetails?.applicant?.country}
                </p>
              )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleRejectRequest}
            disabled={isProcessing}
            className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
          >
            {isProcessing ? "..." : "Decline"}
          </button>
          <button
            onClick={handleAcceptRequest}
            disabled={isProcessing}
            className="flex-1 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
          >
            {isProcessing ? "..." : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkConnectionsCard;
