import React from "react";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../../utils/constants.ts";
import { useNetworkTab } from "../../store/useNetworkTab.ts";
import { FindConnections } from "./FindConnections.tsx";
import MyNetwork from "./MyNetwork.tsx";

const Network: React.FC = () => {
  /* active tab */
  const { activeTab, setActiveTab } = useNetworkTab();
  return (
    <>
      <div className="mx-auto flex w-full flex-col bg-[#F7F8FA]">
        {USER_TYPE === UserType.APPLICANT ? (
          <TopNavBar
            navItems={applicantNavItems}
            navItemsMobile={applicantNavItemsMobile}
            navbarItemsMap={applicantNavBarItemMap}
          />
        ) : (
          <TopNavBar
            navItems={employerNavItems}
            navItemsMobile={employerNavItemsMobile}
            navbarItemsMap={employerNavBarItemMap}
          />
        )}
        <div className="mt-12 flex w-full items-center justify-center border-b border-[#E6E6E6] bg-white px-4 py-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("find-new-connections")}
              className={`border-b-4 pb-2 transition-colors ${
                activeTab === "find-new-connections"
                  ? "border-purple-600 font-medium text-purple-600"
                  : "border-transparent text-gray-600 hover:border-purple-600 hover:text-purple-600"
              }`}
            >
              Find New Connections
            </button>
            <button
              onClick={() => setActiveTab("my-connections")}
              className={`border-b-4 pb-2 transition-colors ${
                activeTab === "my-connections"
                  ? "border-purple-600 font-medium text-purple-600"
                  : "border-transparent text-gray-600 hover:border-purple-600 hover:text-purple-600"
              }`}
            >
              My Connections
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        {activeTab === "find-new-connections" ? (
          <FindConnections />
        ) : (
          <MyNetwork />
        )}
      </div>
    </>
  );
};

export default Network;
