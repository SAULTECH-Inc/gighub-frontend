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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-bl from-blue-50 to-transparent opacity-50 pointer-events-none"></div>

        {/* Header */}
        <div className="relative p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                  Top Companies Hiring
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Discover leading employers actively recruiting
                </p>
              </div>
            </div>

            {topHiringCompanies?.length > 5 && (
              <Link
                to="/companies"
                className="flex items-center space-x-1 text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors group"
              >
                <span>See all</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Companies List */}
        <div className="p-4 sm:p-6 pt-3 sm:pt-4">
          {topHiringCompanies?.length ? (
            <div className="space-y-3 sm:space-y-4">
              {topHiringCompanies.map((data: any, index: number) => (
                <div
                  key={index}
                  className="group relative bg-slate-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl p-3 sm:p-4 transition-all duration-300 hover:shadow-md border border-slate-100 hover:border-indigo-200"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    {/* Company Logo */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={data?.employer?.companyLogo || dangote}
                        alt={`${data?.employer?.companyName} Logo`}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shadow-sm border border-slate-200 group-hover:border-indigo-300 transition-colors"
                      />
                      {/* Active hiring indicator */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                        <TrendingUp className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col space-y-1 sm:space-y-2">
                        <h3
                          onClick={() => {
                            setJobToApply(data.job);
                            setCurrentlyViewed(data.job);
                            setViewingJob(true);
                          }}
                          className="cursor-pointer font-semibold text-slate-800 hover:text-indigo-600 transition-colors text-sm sm:text-base line-clamp-2 group-hover:text-indigo-700"
                        >
                          <Link to={`/employers/${data?.employer.id}/${data?.employer.companyName}/profile`} className="font-bold">{data?.employer?.companyName}</Link>
                          <span className="font-normal text-slate-600"> • hiring </span>
                          <Link to={`/employer/jobs/job-details/${data?.job.id}`} className="font-medium text-indigo-600">{data?.job?.title}</Link>
                        </h3>

                        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-slate-500">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>2 people in your network work here</span>
                        </div>

                        {/* Additional job details */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                          {data?.job?.location && (
                            <div className="inline-flex items-center px-2 py-1 bg-slate-200 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-700 rounded-full text-xs font-medium transition-colors">
                              {data.job.location}
                            </div>
                          )}
                          {data?.job?.jobType && (
                            <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              {data.job.jobType}
                            </div>
                          )}
                          {data?.job?.salary && (
                            <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {data.job.salary}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action indicator */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>

                  {/* Hover effect border */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-2">
                No Companies Found
              </h3>
              <p className="text-sm text-slate-500 max-w-sm">
                We're working to bring you the top hiring companies. Check back soon for updates.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {topHiringCompanies?.length > 0 && (
          <>
            <div className="border-t border-slate-100"></div>
            <div className="p-4 sm:p-6 pt-3 sm:pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
                <span className="text-slate-600">
                  Showing {topHiringCompanies.length} active companies
                </span>
                <Link
                  to="/companies"
                  className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
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
