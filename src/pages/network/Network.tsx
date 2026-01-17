import React, { memo } from "react";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  applicantNavBarItemMap,
  employerNavBarItemMap,
} from "../../utils/constants.ts";
import { useNetworkTab } from "../../store/useNetworkTab.ts";
import MyNetwork from "./MyNetwork.tsx";
import FindConnections from "./FindConnections.tsx";
import { Users, UserPlus } from "lucide-react";

const Network: React.FC = () => {
  const { activeTab, setActiveTab } = useNetworkTab();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {USER_TYPE === UserType.EMPLOYER ? (
        <TopNavBar
          navbarItemsMap={employerNavBarItemMap}
          userType={"employer"}
        />
      ) : (
        <TopNavBar
          navbarItemsMap={applicantNavBarItemMap}
          userType={"applicant"}
        />
      )}

      {/* Enhanced Tab Navigation */}
      <div className="sticky top-0 z-10 mt-12 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-4">
            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab("find-new-connections")}
                className={`flex items-center space-x-2 rounded-md px-6 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === "find-new-connections"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <UserPlus size={18} />
                <span>Find New Connections</span>
              </button>
              <button
                onClick={() => setActiveTab("my-connections")}
                className={`flex items-center space-x-2 rounded-md px-6 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === "my-connections"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
