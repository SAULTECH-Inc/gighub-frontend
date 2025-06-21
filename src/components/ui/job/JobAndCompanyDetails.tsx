import JobDescription from "../applicant/job/JobDescription.tsx";
import CompanyInfo from "../applicant/job/CompanyInfo.tsx";
import React from "react";

export const JobAndCompanyDetails: React.FC = () => {
  return (
    <div className="w-full rounded-[16px] bg-white shadow-sm lg:flex">
      <div className="flex w-full flex-col items-center justify-center xl:grid xl:grid-cols-[70%_30%] xl:items-start">
        <JobDescription />
        <CompanyInfo />
      </div>
    </div>
  );
};
