import React from "react";

const JobSearchTop: React.FC = () => {
    return (
        <div className="relative  w-[1370px] h-[51px] rounded-[16px] bg-white shadow-md flex items-center ml-[-220px] px-4 mt-[5px]">
            <span className="text-black text-lg font-lato">Job Details</span>
            <input
                type="text"
                placeholder="Search job"
                className="ml-auto w-[629px] h-[37px] rounded-[10px] border border-[#E6E6E6] bg-[#F7F7F7] px-4 font-lato text-gray-600"
            />
        </div>
    );
};

export default JobSearchTop;
