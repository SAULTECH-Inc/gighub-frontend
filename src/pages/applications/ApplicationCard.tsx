import React from "react";
import { HiArrowLongRight } from "react-icons/hi2";
import { Application, ApplicationStatus } from "../../utils/dummyApplications";

const ApplicationCard: React.FC<{ application: Application }> = ({
  application,
}) => {
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return "#FFD900";
      case ApplicationStatus.INTERVIEWED:
        return "#65FF81";
      case ApplicationStatus.HIRED:
        return "#56E5A1";
      case ApplicationStatus.SHORTLISTED:
        return "#56E5A1";
      case ApplicationStatus.WITHDRAW:
        return "#FF5733";
      case ApplicationStatus.REJECTED:
        return "#FA4E09";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  function truncateText(text: string, maxChars: number) {
    if (!text) return "";
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars) + "...";
  }

  return (
    <div className="my-2 flex w-full">
      <div className="flex h-[63px] w-full items-center justify-between rounded-[16px] bg-[#F7F7F7] px-2 sm:hidden">
        <div className="flex items-center gap-2">
          <div className="h-[46px] w-[51px] rounded-[10px] bg-[#D9D9D9]"></div>
          <div>
            <p className="font-bold">
              {truncateText(application.companyName, 10)}
            </p>
            <p className="text-[13px] font-bold text-[#7F7F7F]">
              {truncateText(application.location, 10)}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 text-[13px]`}>
          <div
            className={`h-[16px] w-[16px] rounded-full bg-[${getStatusColor(application.status)}]`}
          ></div>
          <p className={`text-[${getStatusColor(application.status)}]`}>
            {application.status}
          </p>
        </div>
      </div>
      <div className="hidden h-[63px] w-full items-center rounded-[16px] bg-[#F7F7F7] px-2 sm:flex">
        <div className="flex w-[30%] items-center gap-2">
          <div className="h-[46px] w-[51px] rounded-[10px] bg-[#D9D9D9]"></div>
          <div>
            <p className="font-bold">
              {truncateText(application.companyName, 13)}
            </p>
            <p className="text-[13px] font-bold text-[#7F7F7F]">
              {truncateText(application.location, 13)}
            </p>
          </div>
        </div>
        <div className="flex w-[70%]">
          <div className="flex w-full items-center justify-around md:justify-between">
            <div className="hidden w-[100px] justify-start text-[13px] lg:flex">
              {application.appliedDate}
            </div>
            <div className="hidden w-[100px] justify-start text-[13px] md:flex">
              {application.position}
            </div>
            <div className="hidden w-[140px] justify-start text-[13px] mdl:flex">
              {application.jobLocation}
            </div>
            <div className={`flex w-[180px] items-center gap-2 text-[13px]`}>
              <div
                className={`h-[16px] w-[16px] rounded-full bg-[${getStatusColor(application.status)}]`}
              ></div>
              <p className={`text-[${getStatusColor(application.status)}]`}>
                {application.status}
              </p>
            </div>
          </div>
          <div className="flex justify-end sm:w-[30%]">
            <div className="ml-2 hidden h-[41px] w-[41px] items-center justify-center rounded-full bg-[#6B5AED4F] sm:flex">
              <HiArrowLongRight className="fill-[#6B5AED]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
