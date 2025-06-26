import SearchIcon from "../../components/common/SearchIcon.tsx";
import { useNetworkTab } from "../../store/useNetworkTab.ts";
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
  return (
    <div className="flex w-[94%] flex-col items-center justify-center self-center py-6">
      <div className="flex w-full flex-col items-center gap-2 rounded-2xl bg-[#FFFFFF] py-[10px] pr-[12px] pl-[30px] sm:flex-row">
        <div className="text-center text-2xl font-bold text-[#000000] sm:text-start xl:w-[24%]">
          <p>
            {activeTab === "find-new-connections"
              ? "Find New Connections"
              : "Get in touch with your network"}
          </p>{" "}
        </div>
        <div className="flex w-[90%] flex-wrap items-center justify-end gap-2 sm:w-[76%] lg:flex-nowrap">
          <div className="flex w-full items-center gap-1 rounded-[16px] bg-[#F9F9F9] px-4 py-[6px] lg:w-[35%]">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by name"
              onKeyUp={(e) => handleSearchByName(e.currentTarget.value)}
              className="placeholder-text-[13px] placeholder-text-[#A1A1A1] border-none bg-transparent focus:ring-transparent focus:outline-none"
            />
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:flex-nowrap lg:w-[65%]">
            <div className="flex w-full items-center gap-1 rounded-[16px] bg-[#F9F9F9] px-4 py-[6px] sm:w-[50%]">
              <SearchIcon />
              <input
                type="text"
                placeholder="Select profession"
                onChange={(e) =>
                  handleSearchByProfession(e.currentTarget.value)
                }
                className="placeholder-text-[13px] placeholder-text-[#A1A1A1] border-none bg-transparent focus:ring-transparent focus:outline-none"
              />
            </div>
            <div className="flex w-full items-center gap-1 rounded-[16px] bg-[#F9F9F9] px-4 py-[6px] sm:w-[50%]">
              <SearchIcon />
              <input
                type="text"
                placeholder="Select location"
                onChange={(e) => handleSearchByLocation(e.currentTarget.value)}
                className="placeholder-text-[13px] placeholder-text-[#A1A1A1] border-none bg-transparent focus:ring-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
