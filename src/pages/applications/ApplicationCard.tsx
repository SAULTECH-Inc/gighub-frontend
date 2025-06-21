import React, { useMemo } from "react";
import { HiArrowLongRight } from "react-icons/hi2";
import { ApplicationResponse } from "../../utils/types";
import moment from "moment";
import { getStatusColor } from "../../utils/helpers.ts";

const ApplicationCard: React.FC<{
  application: ApplicationResponse;
  onView: () => void;
}> = ({ application, onView }) => {
  const statusColor = useMemo(
    () => getStatusColor(application.status),
    [application.status],
  );
  console.log("STATUS COLOR ::: " + statusColor);

  return (
    <div className="grid w-full grid-cols-[calc(63%+10%)_calc(40%-10%)] items-center justify-between rounded-[16px] bg-[#F5F5F5] p-2 md:grid-cols-[20%_24%_12%_14%_12%] mdl:grid-cols-[20%_14%_24%_12%_14%_12%]">
      {/*Profile*/}
      <div className="flex w-full items-center gap-2">
        <div className="h-[46px] w-[51px] rounded-[10px] bg-[#D9D9D9]">
          <img
            className="h-full w-full rounded-[10px]"
            src={application?.job?.employer?.companyLogo || ""}
            alt="company logo"
          />
        </div>
        <div>
          <p className="hidden font-bold md:flex">{application.job.company}</p>
          <p className="font-bold md:hidden">{application.job.title}</p>
          <div className="flex text-[13px] font-bold text-[#7F7F7F]">
            <p className="">{application.job.location}&nbsp;</p>
            <p className="text-[#6B5AED] md:hidden">
              - {application.job.company}
            </p>
          </div>
        </div>
      </div>
      {/*Date*/}
      <div className="hidden w-full items-center justify-start text-[13px] mdl:flex">
        <p>{moment(application.createdAt).format("DD MMM, YYYY")}</p>
      </div>
      {/*Role name*/}
      <div className="hidden w-full flex-wrap justify-start text-[13px] md:flex">
        <p className="text-left">{application.job.title}</p>
      </div>

      <div className="hidden w-full justify-start text-[13px] md:flex">
        {application.job.jobType}
      </div>

      {/*Status*/}
      <div className={`flex w-full items-center gap-2 text-[13px]`}>
        <div
          className={`h-[16px] w-[16px] rounded-full`}
          style={{ backgroundColor: statusColor }}
        ></div>
        <p style={{ color: statusColor }}>{application.status}</p>
      </div>

      {/*Control*/}
      <div className="hidden justify-end md:flex">
        <div
          onClick={onView}
          className="ml-2 hidden h-[41px] w-[41px] cursor-pointer items-center justify-center rounded-full bg-[#6B5AED4F] sm:flex"
        >
          <HiArrowLongRight className="fill-[#6B5AED]" />
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
