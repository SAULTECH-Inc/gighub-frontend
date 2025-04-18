import SearchIcon from "../../components/common/SearchIcon.tsx";
import {useNetworkTab} from "../../store/useNetworkTab.ts";
import React from "react";

interface NetworkHeaderProps {
    handleSearchByName: (name: string) => void;
    handleSearchByProfession: (profession: string) => void;
    handleSearchByLocation: (location: string) => void;
}

export const NetworkHeader: React.FC<NetworkHeaderProps> = ({
    handleSearchByName,
    handleSearchByProfession,
    handleSearchByLocation,
                                                            }) => {
    const { activeTab } = useNetworkTab();
    return <div className="w-[94%] flex flex-col items-center justify-center py-6 self-center">
        <div
            className="w-full py-[10px] pl-[30px] pr-[12px] bg-[#FFFFFF] rounded-2xl flex flex-col sm:flex-row items-center gap-2">
            <div className="text-[#000000] text-center sm:text-start text-2xl font-bold xl:w-[24%]">
                <p>{
                    activeTab === "find-new-connections"
                        ? "Find New Connections"
                        : "Get in touch with your network"
                }</p>{" "}
            </div>
            <div className="w-[90%] sm:w-[76%] flex flex-wrap lg:flex-nowrap items-center justify-end gap-2">
                <div className="w-full lg:w-[35%] bg-[#F9F9F9] flex items-center px-4 py-[6px] rounded-[16px] gap-1">
                    <SearchIcon/>
                    <input
                        type="text"
                        placeholder="Search by name"
                        onKeyUp={(e) => handleSearchByName(e.currentTarget.value)}
                        className="placeholder-text-[13px] placeholder-text-[#A1A1A1]  border-none bg-transparent focus:outline-none focus:ring-transparent"
                    />
                </div>
                <div className="w-full lg:w-[65%] flex flex-wrap sm:flex-nowrap gap-2">
                    <div
                        className="w-full sm:w-[50%] bg-[#F9F9F9] flex items-center px-4 py-[6px] rounded-[16px] gap-1">
                        <SearchIcon/>
                        <input
                            type="text"
                            placeholder="Select profession"
                            onChange={(e) => handleSearchByProfession(e.currentTarget.value)}
                            className="placeholder-text-[13px] placeholder-text-[#A1A1A1]  border-none bg-transparent focus:outline-none focus:ring-transparent"
                        />
                    </div>
                    <div
                        className="w-full sm:w-[50%] bg-[#F9F9F9] flex items-center px-4 py-[6px] rounded-[16px] gap-1">
                        <SearchIcon/>
                        <input
                            type="text"
                            placeholder="Select location"
                            onChange={(e) => handleSearchByLocation(e.currentTarget.value)}
                            className=" placeholder-text-[13px] placeholder-text-[#A1A1A1] border-none bg-transparent focus:outline-none focus:ring-transparent"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>;
};
