import React from "react";
import BarChatBar from "./BarChatBar.tsx";

const Stats: React.FC = () => {
  return (
    <>
      <div className="flex h-[183px] w-full flex-row gap-x-8 rounded-[16px] bg-[#6438C2] lg:w-[556px]">
        <div
          title="y-axis-days"
          className="flex h-[100%] w-[10%] flex-col items-end justify-center gap-y-[4px] pl-5 font-lato text-[13px] text-white md:gap-y-3"
        >
          <p className="w-full">Sat</p>
          <p className="w-full">Thu</p>
          <p className="w-full">Wed</p>
          <p className="w-full">Tue</p>
          <p className="w-full">Mon</p>
        </div>
        <div className="flex h-[100%] w-[90%] items-end gap-x-8 pb-5 md:justify-evenly md:gap-x-9 md:pb-3">
          <BarChatBar height={33.3} />
          <BarChatBar height={59.0} />
          <BarChatBar height={42.6} />
          <BarChatBar height={76} />
          <BarChatBar height={50.3} />
          <BarChatBar height={67.2} />
        </div>
      </div>
    </>
  );
};

export default Stats;
