import React from "react";
import Stats from "../ui/Stats.tsx";
import people from "../../assets/icons/people.svg";
import clicks from "../../assets/icons/clicks.svg";
import applied from "../../assets/icons/applied.svg";
import { useMetrics } from "../../store/useMetrics.ts";
const JobStat: React.FC = () => {
  const { metric } = useMetrics();
  return (
    <div className="mx-auto flex h-[290px] w-full flex-col space-y-6 rounded-[16px] md:h-[320px] lg:w-[556px]">
      <Stats />
      <div className="flex flex-col gap-y-5">
        <div className="flex items-center justify-start gap-x-2 md:gap-x-24 lg:gap-x-12">
          <div className="flex w-fit min-w-26 items-center justify-evenly gap-x-1 md:min-w-28 md:gap-x-2">
            <div className="flex h-[35px] w-[35px] items-center justify-center rounded-[10px] bg-[#6438C2] md:h-[40px] md:w-[40px]">
              <img src={people} alt="people" />
            </div>
            <p className="text-xs md:text-[18px] lg:text-[16px]">
              People Reached
            </p>
          </div>

          <div className="flex w-fit min-w-26 items-center justify-evenly gap-x-1 md:min-w-28 md:gap-x-2">
            <div className="flex h-[35px] w-[35px] items-center justify-center rounded-[10px] bg-[#6438C2] md:h-[40px] md:w-[40px]">
              <img src={clicks} alt="people" />
            </div>
            <p className="text-xs md:text-[18px] lg:text-[16px]">
              Total Clicks
            </p>
          </div>

          <div className="flex w-fit min-w-26 items-center justify-evenly gap-x-1 md:min-w-28 md:gap-x-2">
            <div className="flex h-[35px] w-[35px] items-center justify-center rounded-[10px] bg-[#6438C2] md:h-[40px] md:w-[40px]">
              <img src={applied} alt="people" />
            </div>
            <p className="text-xs md:text-[18px] lg:text-[16px]">Applied</p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start gap-x-16 md:gap-x-40 lg:gap-x-28">
          <div className="flex w-fit flex-col gap-y-3">
            <p className="text-xs md:text-[18px] lg:text-[16px]">
              {metric.jobsApplied} Talents
            </p>
            <hr className="w-[49px] border-[3px] border-[#6438C2]" />
          </div>

          <div className="flex w-fit flex-col gap-y-3">
            <p className="text-xs md:text-[18px] lg:text-[16px]">
              {metric.jobsApplied} clicks
            </p>
            <hr className="w-[49px] border-[3px] border-[#6438C2]" />
          </div>

          <div className="flex w-fit flex-col gap-y-3">
            <p className="text-xs md:text-[18px] lg:text-[16px]">
              {metric.jobsApplied} Applications
            </p>
            <hr className="w-[49px] border-[3px] border-[#6438C2]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobStat;
