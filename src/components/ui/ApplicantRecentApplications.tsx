import { FC, useEffect, useState } from "react";
import ApplicationCard from "./ApplicationCard.tsx";
import recentApplicationLogo from "../../assets/images/recentApplicationLogo.png";
import { ApplicationResponse, SortBy } from "../../utils/types";
import { getMyApplications, getRecentApplications } from "../../services/api";
import { USER_TYPE } from "../../utils/helpers.ts";
import { ApplicationStatus, UserType } from "../../utils/enums.ts";
import {
  Clock,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";

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
      case ApplicationStatus.WITHDRAWN:
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
      <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex items-center space-x-3 sm:mb-6">
            <div className="h-6 w-6 animate-pulse rounded-lg bg-slate-200"></div>
            <div className="h-6 w-40 animate-pulse rounded bg-slate-200 sm:w-48"></div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-xl bg-slate-100 sm:h-16"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="p-4 text-center sm:p-6">
          <XCircle className="mx-auto mb-3 h-10 w-10 text-red-400 sm:mb-4 sm:h-12 sm:w-12" />
          <h3 className="mb-2 text-lg font-semibold text-slate-800">
            Error Loading Applications
          </h3>
          <p className="text-sm text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-blue-50 to-transparent opacity-50 sm:h-32 sm:w-32"></div>
      <div className="absolute bottom-0 left-0 h-16 w-16 bg-gradient-to-tr from-slate-50 to-transparent sm:h-24 sm:w-24"></div>

      {/* Header */}
      <div className="relative p-4 pb-3 sm:p-6 sm:pb-4">
        <div className="mb-4 flex items-start justify-between sm:mb-6">
          <div className="flex min-w-0 flex-1 items-start space-x-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-lg sm:h-12 sm:w-12">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-bold text-slate-800 sm:text-xl">
                Recent Applications
              </h2>
              <p className="mt-1 line-clamp-2 text-xs text-slate-600 sm:text-sm">
                Track your latest job applications and their status
              </p>
            </div>
          </div>

          <button className="ml-2 flex-shrink-0 rounded-lg p-2 transition-colors hover:bg-slate-100">
            <MoreHorizontal className="h-4 w-4 text-slate-400 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Status Legend - Mobile Optimized */}
        <div className="block lg:hidden">
          <div className="mb-3 rounded-xl bg-slate-50 p-3 sm:mb-4 sm:p-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {statusLegend.slice(0, 6).map((item, index) => (
                <div
                  key={index}
                  className="flex min-w-0 items-center space-x-1.5 sm:space-x-2"
                >
                  <div
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-sm sm:h-3 sm:w-3"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-xs font-medium text-slate-700">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Status Legend */}
        <div className="hidden lg:block">
          <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <div className="flex flex-wrap items-center space-x-6 gap-y-2">
              {statusLegend.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="h-3 w-3 rounded-full shadow-sm"
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
      <div className="mx-4 border-t border-slate-100 sm:mx-6"></div>

      {/* Applications List */}
      <div className="p-4 pt-3 sm:p-6 sm:pt-4">
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
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center sm:py-12">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 sm:mb-4 sm:h-16 sm:w-16">
              <FileText className="h-6 w-6 text-slate-400 sm:h-8 sm:w-8" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-slate-700 sm:text-lg">
              No Applications Yet
            </h3>
            <p className="mb-4 max-w-sm text-sm leading-relaxed text-slate-500 sm:mb-6">
              Start applying to jobs that match your skills and experience. Your
              applications will appear here.
            </p>
            <Link
              to="/applicant/find-jobs"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:px-6 sm:py-2.5 sm:text-base"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {myApplications?.length && (
        <>
          <div className="mx-4 border-t border-slate-100 sm:mx-6"></div>
          <div className="p-4 pt-3 sm:p-6 sm:pt-4">
            <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span className="text-slate-600">
                Showing {myApplications.length} recent applications
              </span>
              <button className="text-left font-medium text-blue-600 hover:text-blue-700 hover:underline sm:text-right">
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
