import React from "react";

const FilterBar: React.FC = () => {
    return (
        <div className="absolute w-[1370px] h-[81px] top-[90px] left-[35px] bg-white shadow-md rounded-[16px] flex items-center px-6">
            {/* Search Box */}
            <input
                type="text"
                placeholder="Select Job"
                className="w-[381px] h-[50px] bg-[#F7F7F7] text-[#000000] border border-[#E6E6E6] rounded-[10px] px-4"
            />

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Open Button */}
            <button className="w-[135px] h-[43px]  bg-[#F7F7F7] text-[#000000] rounded-[10px] px-6 py-3 text-center font-medium">
                Open
            </button>

            {/* Draft Button */}
            <button className="w-[133px] h-[43px] bg-[#6438C2] border border-[#E6E6E6] text-white  rounded-[10px] px-6 py-3 text-center font-medium ml-4">
                Draft
            </button>
        </div>
    );
};

export default FilterBar;
