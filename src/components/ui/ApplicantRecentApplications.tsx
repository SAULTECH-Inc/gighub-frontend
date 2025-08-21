import { FC, useEffect, useState } from "react";
import ApplicationCard from "./ApplicationCard.tsx";
import recentApplicationLogo from "../../assets/images/recentApplicationLogo.png";
import { ApplicationResponse, SortBy } from "../../utils/types";
import { getMyApplications, getRecentApplications } from "../../services/api";
import { ApplicationStatus } from "../../utils/dummyApplications.ts";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import { Clock, FileText, Users, CheckCircle, XCircle, Eye, Calendar, MoreHorizontal } from "lucide-react";

const ApplicantRecentApplications: FC = () => {
    const [myApplications, setMyApplications] = useState<ApplicationResponse[]>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paginationParams] = useState({
        page: 1,
        limit: 5,
        sort: {
            sortDirection: "createdAt",
            orderBy: "desc",
        },
        applicationStatus: null,
    });

    useEffect(() => {
        const fetchMyApplications = async () => {
            setLoading(true);
            if (USER_TYPE === UserType.EMPLOYER) {
                return await getRecentApplications(
                    paginationParams?.applicationStatus,
                    paginationParams?.sort as SortBy,
                    paginationParams.page,
                    paginationParams.limit,
                );
            }
            return await getMyApplications(
                paginationParams?.applicationStatus,
                paginationParams?.sort as SortBy,
                paginationParams.page,
                paginationParams.limit,
            );
        };

        fetchMyApplications()
            .then((response) => {
                setMyApplications(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError("Error fetching applications : " + error.message);
                setLoading(false);
            });
    }, []);

    const getStatusColor = (status: ApplicationStatus): string => {
        switch (status) {
            case ApplicationStatus.VIEWED:
                return "#3498db";
            case ApplicationStatus.PENDING:
                return "#FFD900";
            case ApplicationStatus.HIRED:
                return "#4CD137";
            case ApplicationStatus.INTERVIEWED:
                return "#6B5AED";
            case ApplicationStatus.REJECTED:
                return "#D32F2F";
            case ApplicationStatus.SHORTLISTED:
                return "#1abc9c";
            case ApplicationStatus.WITHDRAW:
                return "#95a5a6";
            default:
                return "#7f8c8d";
        }
    };

    const statusLegend = [
        { status: "Pending", color: "#FFD900", icon: Clock },
        { status: "Interviewed", color: "#6B5AED", icon: Calendar },
        { status: "Hired", color: "#4CD137", icon: CheckCircle },
        { status: "Rejected", color: "#D32F2F", icon: XCircle },
        { status: "Viewed", color: "#3498db", icon: Eye },
        { status: "Shortlisted", color: "#1abc9c", icon: Users },
    ];

    if (loading) {
        return (
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
                <div className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                        <div className="w-6 h-6 bg-slate-200 rounded-lg animate-pulse"></div>
                        <div className="h-6 bg-slate-200 rounded w-40 sm:w-48 animate-pulse"></div>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-14 sm:h-16 bg-slate-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
                <div className="p-4 sm:p-6 text-center">
                    <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Error Loading Applications</h3>
                    <p className="text-sm text-slate-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-bl from-blue-50 to-transparent opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-slate-50 to-transparent"></div>

            {/* Header */}
            <div className="relative p-4 sm:p-6 pb-3 sm:pb-4">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="flex items-start space-x-3 min-w-0 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-lg flex-shrink-0">
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg sm:text-xl font-bold text-slate-800 truncate">
                                Recent Applications
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2">
                                Track your latest job applications and their status
                            </p>
                        </div>
                    </div>

                    <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0 ml-2">
                        <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    </button>
                </div>

                {/* Status Legend - Mobile Optimized */}
                <div className="block lg:hidden">
                    <div className="bg-slate-50 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                            {statusLegend.slice(0, 6).map((item, index) => (
                                <div key={index} className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                                    <div
                                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-sm flex-shrink-0"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-xs font-medium text-slate-700 truncate">
                        {item.status}
                      </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desktop Status Legend */}
                <div className="hidden lg:block">
                    <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4 mb-4">
                        <div className="flex items-center space-x-6 flex-wrap gap-y-2">
                            {statusLegend.map((item, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <div
                                        className="w-3 h-3 rounded-full shadow-sm"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm font-medium text-slate-700">
                        {item.status}
                      </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="mx-4 sm:mx-6 border-t border-slate-100"></div>

            {/* Applications List */}
            <div className="p-4 sm:p-6 pt-3 sm:pt-4">
                {myApplications?.length ? (
                    <div className="space-y-3 sm:space-y-4">
                        {myApplications.map((application, index) => (
                            <ApplicationCard
                                key={index}
                                image={
                                    application?.applicant?.profilePicture ||
                                    recentApplicationLogo
                                }
                                jobTitle={application.job.title}
                                location={application.job.location}
                                companyName={application.job.company}
                                status={application.status}
                                statusColor={getStatusColor(application.status)}
                                buttonText="View Details"
                                application={application}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3 sm:mb-4">
                            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-2">
                            No Applications Yet
                        </h3>
                        <p className="text-sm text-slate-500 max-w-sm mb-4 sm:mb-6 leading-relaxed">
                            Start applying to jobs that match your skills and experience. Your applications will appear here.
                        </p>
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 sm:px-6 sm:py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base">
                            Browse Jobs
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            {myApplications?.length && (
                <>
                    <div className="mx-4 sm:mx-6 border-t border-slate-100"></div>
                    <div className="p-4 sm:p-6 pt-3 sm:pt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                  <span className="text-slate-600">
                    Showing {myApplications.length} recent applications
                  </span>
                            <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline text-left sm:text-right">
                                View All Applications
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ApplicantRecentApplications;