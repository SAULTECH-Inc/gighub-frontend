import jobApplied from "../../assets/icons/jobApplied.svg";
import shortlisted from "../../assets/icons/shortlisted.svg";
import pending from "../../assets/icons/pending.svg";
import { FC } from "react";
import numeral from "numeral";
import { useMetrics } from "../../store/useMetrics.ts";

const ApplicationStats: FC = () => {
  const { metric } = useMetrics();

  return (
    <>
      <div className="grid w-full grid-cols-3 items-center justify-center gap-x-2 bg-[#FFFFFF] p-2 sm:items-baseline md:h-[122px] md:gap-x-6 md:p-4">
        <div className="flex cursor-pointer items-center border-r-[1px] border-r-[#ccc] p-2 md:justify-between md:border-none md:bg-[#F7F7F7]">
          <div className="text-sm md:text-2xl">
            <h3 className="text-gray-700">Jobs Applied</h3>
            <p className="font-bold text-[#000000]">
              {numeral(metric.jobsApplied).format("0.0a")}
            </p>
          </div>
          <div className="hidden h-[60px] w-[60px] items-center justify-center rounded-[50%] bg-[#56E5A1] md:flex">
            <img
              src={jobApplied}
              alt="job applied"
              className="h-auto w-fit rounded"
            />
          </div>
        </div>

        <div className="flex cursor-pointer items-center justify-between border-r-[1px] border-r-[#ccc] p-2 md:border-none md:bg-[#F7F7F7]">
          <div className="text-sm md:text-2xl">
            <h3 className="text-gray-700">Shortlisted</h3>
            <p className="font-bold text-[#000000]">
              {numeral(metric.shortlisted).format("0.0a")}
            </p>
          </div>
          <div className="hidden h-[60px] w-[60px] items-center justify-center rounded-[50%] bg-[#FA4E09] md:flex">
            <img
              src={shortlisted}
              alt="shortlisted"
              className="h-auto w-fit rounded"
            />
          </div>
        </div>

        <div className="flex cursor-pointer items-center justify-between p-2 md:bg-[#F7F7F7]">
          <div className="text-sm md:text-2xl">
            <h3 className="text-gray-700">Pending</h3>
            <p className="font-bold text-[#000000]">
              {numeral(metric.pending).format("0.0a")}
            </p>
          </div>
          <div className="hidden h-[60px] w-[60px] items-center justify-center rounded-[50%] bg-[#FD7E14] md:flex">
            <img src={pending} alt="pending" className="h-auto w-fit rounded" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationStats;
