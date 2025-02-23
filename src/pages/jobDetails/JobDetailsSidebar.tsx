import React from "react";
import RemoteIcon from "../../assets/icons/remote.svg";
import FullTimeIcon from "../../assets/icons/fulltime.svg";
import SalaryIcon from "../../assets/icons/salary.svg";
import LevelIcon from "../../assets/icons/level.svg";
import CalendarIcon from "../../assets/icons/calendar.svg";

const Sidebar: React.FC = () => {
    return (
        <div className="absolute w-[357px] top-[215px] left-[1048px] bg-white shadow-lg rounded-[16px] p-6 flex flex-col gap-y-6">
            {/* Sidebar Items */}
            <div className="flex items-center gap-x-3">
                <img src={RemoteIcon} alt="Remote work" className="w-6 h-6" />
                <span className="text-gray-700 font-lato text-[16px] font-medium leading-[20px]">Remote work</span>
            </div>

            <div className="flex items-center gap-x-3">
                <img src={FullTimeIcon} alt="Full Time" className="w-6 h-6" />
                <span className="text-gray-700 font-lato text-[16px] font-medium leading-[20px]">Full Time</span>
            </div>

            <div className="flex items-center gap-x-3">
                <img src={SalaryIcon} alt="Salary" className="w-6 h-6" />
                <span className="text-gray-700 font-lato text-[16px] font-medium leading-[20px]">$8000 - $10,000/yr</span>
            </div>

            <div className="flex items-center gap-x-3">
                <img src={LevelIcon} alt="Mid Level" className="w-6 h-6" />
                <span className="text-gray-700 font-lato text-[16px] font-medium leading-[20px]">Mid level</span>
            </div>

            <div className="flex items-center gap-x-3">
                <img src={CalendarIcon} alt="Date" className="w-6 h-6" />
                <span className="text-gray-700 font-lato text-[16px] font-medium leading-[20px]">Dec 20, 2025</span>
            </div>
        </div>
    );
};

export default Sidebar;
