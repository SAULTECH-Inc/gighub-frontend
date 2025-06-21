import React from "react";

const JobSearchTop: React.FC = () => {
  return (
    <div className="relative mx-auto flex h-[75px] w-full items-center justify-between rounded-[16px] bg-white px-4 shadow-sm">
      <h3 className="hidden text-lg font-semibold text-black md:flex">
        Job Details
      </h3>
      <input
        type="text"
        placeholder="Search job"
        className="h-[50px] w-[629px] rounded-[10px] border border-[#E6E6E6] bg-[#F7F7F7] px-4 text-gray-600 focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
      />
    </div>
  );
};

export default JobSearchTop;
