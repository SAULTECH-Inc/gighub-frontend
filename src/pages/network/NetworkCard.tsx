import React, { memo } from "react";
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
import MyNetwork from "./MyNetwork.tsx";
import FindConnections from "./FindConnections.tsx";
import { Users, UserPlus } from "lucide-react";

const Network: React.FC = () => {
  const { activeTab, setActiveTab } = useNetworkTab();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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

      {/* Enhanced Tab Navigation */}
      <div className="sticky top-0 z-10 mt-12 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-4">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("find-new-connections")}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === "find-new-connections"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <UserPlus size={18} />
                <span>Find New Connections</span>
              </button>
              <button
                onClick={() => setActiveTab("my-connections")}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === "my-connections"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Users size={18} />
                <span>My Connections</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "find-new-connections" ? (
          <FindConnections />
        ) : (
          <MyNetwork />
        )}
      </main>
    </div>
  );
};

export default memo(Network);