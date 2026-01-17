import dangote from "../../assets/images/dangote-logo.svg";
import React from "react";
import { TopHiringCompanyDto } from "../../utils/types";
import { useJobSearchSettings } from "../../store/useJobSearchSettings.ts";
import { Link } from "react-router-dom";
import { Building2, Users, ArrowRight, TrendingUp } from "lucide-react";

interface TopHiringCompaniesProps {
  topHiringCompanies: TopHiringCompanyDto[];
}

const TopHiringCompanies: React.FC<TopHiringCompaniesProps> = ({
  topHiringCompanies,
}) => {
  const { setViewingJob, setCurrentlyViewed, setJobToApply } =
    useJobSearchSettings();

  return (
    <div className="w-full max-w-full">
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
        {/* Background decoration */}
        <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-blue-50 to-transparent opacity-50 sm:h-32 sm:w-32"></div>

        {/* Header */}
        <div className="relative border-b border-slate-100 p-4 pb-3 sm:p-6 sm:pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg sm:h-12 sm:w-12">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                  Top Companies Hiring
                </h2>
                <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">
                  Discover leading employers actively recruiting
                </p>
              </div>
            </div>

            {topHiringCompanies?.length > 5 && (
              <Link
                to="/companies"
                className="group flex items-center space-x-1 text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 sm:text-sm"
              >
                <span>See all</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Companies List */}
        <div className="p-4 pt-3 sm:p-6 sm:pt-4">
          {topHiringCompanies?.length ? (
            <div className="space-y-3 sm:space-y-4">
              {topHiringCompanies.map((data: any, index: number) => (
                <div
                  key={index}
                  className="group relative rounded-xl border border-slate-100 bg-slate-50 p-3 transition-all duration-300 hover:border-indigo-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md sm:p-4"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    {/* Company Logo */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={data?.employer?.companyLogo || dangote}
                        alt={`${data?.employer?.companyName} Logo`}
                        className="h-12 w-12 rounded-xl border border-slate-200 object-cover shadow-sm transition-colors group-hover:border-indigo-300 sm:h-14 sm:w-14"
                      />
                      {/* Active hiring indicator */}
                      <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-green-400 shadow-sm sm:h-5 sm:w-5">
                        <TrendingUp className="h-2 w-2 text-white sm:h-2.5 sm:w-2.5" />
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col space-y-1 sm:space-y-2">
                        <h3
                          onClick={() => {
                            setJobToApply(data.job);
                            setCurrentlyViewed(data.job);
                            setViewingJob(true);
                          }}
                          className="line-clamp-2 cursor-pointer text-sm font-semibold text-slate-800 transition-colors group-hover:text-indigo-700 hover:text-indigo-600 sm:text-base"
                        >
                          <Link
                            to={`/employers/${data?.employer.id}/${data?.employer.companyName}/profile`}
                            className="font-bold"
                          >
                            {data?.employer?.companyName}
                          </Link>
                          <span className="font-normal text-slate-600">
                            {" "}
                            • hiring{" "}
                          </span>
                          <Link
                            to={`/employer/jobs/job-details/${data?.job.id}`}
                            className="font-medium text-indigo-600"
                          >
                            {data?.job?.title}
                          </Link>
                        </h3>

                        <div className="flex items-center space-x-1 text-xs text-slate-500 sm:space-x-2 sm:text-sm">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>2 people in your network work here</span>
                        </div>

                        {/* Additional job details */}
                        <div className="mt-1 flex flex-wrap items-center gap-2 sm:mt-2 sm:gap-3">
                          {data?.job?.location && (
                            <div className="inline-flex items-center rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700">
                              {data.job.location}
                            </div>
                          )}
                          {data?.job?.jobType && (
                            <div className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                              {data.job.jobType}
                            </div>
                          )}
                          {data?.job?.salary && (
                            <div className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                              {data.job.salary}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action indicator */}
                    <div className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                      <ArrowRight className="h-4 w-4 text-indigo-400 transition-colors group-hover:text-indigo-600 sm:h-5 sm:w-5" />
                    </div>
                  </div>

                  {/* Hover effect border */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-hover:w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="flex flex-col items-center justify-center py-8 text-center sm:py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 sm:h-20 sm:w-20">
                <Building2 className="h-8 w-8 text-slate-400 sm:h-10 sm:w-10" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-slate-700 sm:text-lg">
                No Companies Found
              </h3>
              <p className="max-w-sm text-sm text-slate-500">
                We're working to bring you the top hiring companies. Check back
                soon for updates.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {topHiringCompanies?.length > 0 && (
          <>
            <div className="border-t border-slate-100"></div>
            <div className="p-4 pt-3 sm:p-6 sm:pt-4">
              <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                <span className="text-slate-600">
                  Showing {topHiringCompanies.length} active companies
                </span>
                <Link
                  to="/companies"
                  className="font-medium text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
                >
                  Explore all companies
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopHiringCompanies;
