import React from "react";
import ViewApplicationMethodModal from "./ViewApplicationMethodModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import { ApplicationResponse } from "../../utils/types";
import { MapPin, Building2, Eye, ChevronRight } from "lucide-react";

interface ApplicationCardProps {
  image: string;
  jobTitle: string;
  location: string;
  companyName: string;
  status: string;
  statusColor: string;
  buttonText: string;
  application?: ApplicationResponse;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  image,
  jobTitle,
  location,
  companyName,
  status,
  statusColor,
  buttonText,
  application,
}) => {
  const { openModal } = useModalStore();

  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          ring: "ring-amber-200",
        };
      case "shortlisted":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          ring: "ring-blue-200",
        };
      case "hired":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          ring: "ring-emerald-200",
        };
      case "interviewed":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          ring: "ring-purple-200",
        };
      case "rejected":
        return { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200" };
      case "viewed":
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          ring: "ring-slate-200",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          ring: "ring-slate-200",
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/50">
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/0 to-slate-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

        {/* Mobile Layout */}
        <div className="relative sm:hidden">
          {/* Top Row: Job Details */}
          <div className="mb-3 flex items-center space-x-3">
            <div className="relative flex-shrink-0">
              <img
                src={image}
                alt="Company"
                className="h-10 w-10 rounded-lg border border-slate-200 object-cover shadow-sm"
              />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 shadow-sm"></div>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-slate-900">
                {jobTitle}
              </h3>
              <div className="mt-1 flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{location}</span>
                </div>
              </div>
              <div className="mt-0.5 flex items-center space-x-1 text-xs text-purple-600">
                <Building2 className="h-3 w-3" />
                <span className="truncate font-medium">{companyName}</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Status and Button */}
          <div className="flex items-center justify-between">
            <div
              className={`inline-flex items-center space-x-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.ring}`}
            >
              <div
                className="h-2 w-2 rounded-full shadow-sm"
                style={{ backgroundColor: statusColor }}
              />
              <span className="whitespace-nowrap">{status}</span>
            </div>

            <button
              onClick={() => openModal("view-application-method-modal")}
              className="group/btn relative flex items-center space-x-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:from-violet-700 hover:to-purple-700 hover:shadow-md hover:shadow-purple-500/25 active:scale-95"
            >
              <Eye className="h-3 w-3" />
              <span>View</span>
              <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
              <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full"></div>
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="relative hidden grid-cols-[1fr_auto_auto] items-center gap-4 sm:grid">
          {/* Left: Job Details */}
          <div className="flex min-w-0 items-center space-x-4">
            <div className="relative flex-shrink-0">
              <img
                src={image}
                alt="Company"
                className="h-12 w-12 rounded-xl border border-slate-200 object-cover shadow-sm"
              />
              <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-400 shadow-sm"></div>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-slate-900">
                {jobTitle}
              </h3>
              <div className="mt-1 flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{location}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-purple-600">
                  <Building2 className="h-3 w-3" />
                  <span className="truncate font-medium">{companyName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Status Badge */}
          <div className="flex items-center justify-center">
            <div
              className={`inline-flex items-center space-x-2 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.ring}`}
            >
              <div
                className="h-2 w-2 rounded-full shadow-sm"
                style={{ backgroundColor: statusColor }}
              />
              <span className="whitespace-nowrap">{status}</span>
            </div>
          </div>

          {/* Right: Action Button */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => openModal("view-application-method-modal")}
              className="group/btn relative flex items-center space-x-2 overflow-hidden rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:from-violet-700 hover:to-purple-700 hover:shadow-md hover:shadow-purple-500/25 active:scale-95"
            >
              <Eye className="h-4 w-4" />
              <span>{buttonText}</span>
              <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
              <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full"></div>
            </button>
          </div>
        </div>

        {/* Bottom border animation */}
        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500 group-hover:w-full"></div>
      </div>

      <ViewApplicationMethodModal
        application={application as ApplicationResponse}
        modalId="view-application-method-modal"
      />
    </>
  );
};

export default ApplicationCard;
