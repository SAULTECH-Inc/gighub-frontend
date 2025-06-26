import dangote from "../../assets/images/dangote-logo.svg";
import React from "react";
import { TopHiringCompanyDto } from "../../utils/types";
import { useJobSearchSettings } from "../../store/useJobSearchSettings.ts";
import { Link } from "react-router-dom";

interface TopHiringCompaniesProps {
  topHiringCompanies: TopHiringCompanyDto[];
}
const TopHiringCompanies: React.FC<TopHiringCompaniesProps> = ({
  topHiringCompanies,
}) => {
  const { setViewingJob, setCurrentlyViewed, setJobToApply } =
    useJobSearchSettings();
  return (
    <>
      <div className="mx-auto flex h-[365px] w-full justify-center">
        <div className="w-[95%] rounded-[16px] bg-white p-4 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[20px] font-semibold">Top Companies Hiring</h2>
            {topHiringCompanies?.length > 5 && (
              <Link to="/companies" className="text-sm text-[#6B5AED]">
                See all
              </Link>
            )}
          </div>

          <div>
            {/*Messages*/}
            {topHiringCompanies?.map((data: any, index: number) => (
              <div
                key={index}
                className="mb-4 flex items-start justify-between"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={data?.employer?.companyLogo || dangote}
                    alt="Dangote Logo"
                    className="h-[57px] w-[57px] rounded-[16px]"
                  />
                  <div className="flex flex-col space-y-1 py-4">
                    <h3
                      onClick={() => {
                        setJobToApply(data.job);
                        setCurrentlyViewed(data.job);
                        setViewingJob(true);
                      }}
                      className="cursor-pointer text-sm font-medium hover:underline md:text-lg"
                    >
                      {data?.employer?.companyName} . hiring {data?.job?.title}
                    </h3>
                    <p className="text-xs text-gray-500 md:text-sm">
                      2 people in your network work here
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopHiringCompanies;
