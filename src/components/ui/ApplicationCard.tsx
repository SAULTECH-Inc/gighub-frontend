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
            case 'pending':
                return { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' };
            case 'shortlisted':
                return { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-200' };
            case 'hired':
                return { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' };
            case 'interviewed':
                return { bg: 'bg-purple-50', text: 'text-purple-700', ring: 'ring-purple-200' };
            case 'rejected':
                return { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200' };
            case 'viewed':
                return { bg: 'bg-slate-50', text: 'text-slate-700', ring: 'ring-slate-200' };
            default:
                return { bg: 'bg-slate-50', text: 'text-slate-700', ring: 'ring-slate-200' };
        }
    };

    const statusConfig = getStatusConfig(status);

    return (
        <>
            <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-100 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-200 hover:-translate-y-0.5">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50/0 to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Mobile Layout */}
                <div className="relative sm:hidden">
                    {/* Top Row: Job Details */}
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="relative flex-shrink-0">
                            <img
                                src={image}
                                alt="Company"
                                className="w-10 h-10 rounded-lg object-cover shadow-sm border border-slate-200"
                            />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm"></div>
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-800 text-sm truncate group-hover:text-slate-900 transition-colors">
                                {jobTitle}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <div className="flex items-center space-x-1 text-xs text-slate-500">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate">{location}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-purple-600 mt-0.5">
                                <Building2 className="w-3 h-3" />
                                <span className="truncate font-medium">{companyName}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Status and Button */}
                    <div className="flex items-center justify-between">
                        <div className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.ring}`}>
                            <div
                                className="w-2 h-2 rounded-full shadow-sm"
                                style={{ backgroundColor: statusColor }}
                            />
                            <span className="whitespace-nowrap">{status}</span>
                        </div>

                        <button
                            onClick={() => openModal("view-application-method-modal")}
                            className="group/btn relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-purple-500/25 active:scale-95 flex items-center space-x-1.5"
                        >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                            <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                        </button>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="relative hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 items-center">
                    {/* Left: Job Details */}
                    <div className="flex items-center space-x-4 min-w-0">
                        <div className="relative flex-shrink-0">
                            <img
                                src={image}
                                alt="Company"
                                className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-200"
                            />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm"></div>
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-800 text-sm truncate group-hover:text-slate-900 transition-colors">
                                {jobTitle}
                            </h3>
                            <div className="flex items-center space-x-3 mt-1">
                                <div className="flex items-center space-x-1 text-xs text-slate-500">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate">{location}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-purple-600">
                                    <Building2 className="w-3 h-3" />
                                    <span className="truncate font-medium">{companyName}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center: Status Badge */}
                    <div className="flex items-center justify-center">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium ring-1 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.ring}`}>
                            <div
                                className="w-2 h-2 rounded-full shadow-sm"
                                style={{ backgroundColor: statusColor }}
                            />
                            <span className="whitespace-nowrap">{status}</span>
                        </div>
                    </div>

                    {/* Right: Action Button */}
                    <div className="flex items-center justify-end">
                        <button
                            onClick={() => openModal("view-application-method-modal")}
                            className="group/btn relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-purple-500/25 active:scale-95 flex items-center space-x-2"
                        >
                            <Eye className="w-4 h-4" />
                            <span>{buttonText}</span>
                            <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                        </button>
                    </div>
                </div>

                {/* Bottom border animation */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
            </div>

            <ViewApplicationMethodModal
                application={application as ApplicationResponse}
                modalId="view-application-method-modal"
            />
        </>
    );
};

export default ApplicationCard;