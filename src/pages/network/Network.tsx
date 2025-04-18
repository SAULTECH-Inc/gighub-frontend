import React from "react";
import {USER_TYPE} from "../../utils/helpers.ts";
import {UserType} from "../../utils/enums.ts";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
    applicantNavBarItemMap,
    applicantNavItems,
    applicantNavItemsMobile, employerNavBarItemMap,
    employerNavItems, employerNavItemsMobile
} from "../../utils/constants.ts";
import {useNetworkTab} from "../../store/useNetworkTab.ts";
import {FindConnections} from "./FindConnections.tsx";
import MyNetwork from "./MyNetwork.tsx";

const Network: React.FC = () => {
    /* active tab */
    const { activeTab, setActiveTab } = useNetworkTab();
    return <>
        <div className="w-full flex flex-col mx-auto">
            {
                USER_TYPE === UserType.APPLICANT ?
                    (<TopNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile}
                                navbarItemsMap={applicantNavBarItemMap}/>)
                    : <TopNavBar navItems={employerNavItems} navItemsMobile={employerNavItemsMobile}
                                 navbarItemsMap={employerNavBarItemMap}/>
            }
            <div className="w-full flex justify-center items-center px-4 py-6 bg-white border-b border-[#E6E6E6] mt-12">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab("find-new-connections")}
                        className={`pb-2 border-b-4 transition-colors ${
                            activeTab === "find-new-connections"
                                ? "text-purple-600 border-purple-600 font-medium"
                                : "text-gray-600 border-transparent hover:text-purple-600 hover:border-purple-600"
                        }`}
                    >
                        Find New Connections
                    </button>
                    <button
                        onClick={() => setActiveTab("my-connections")}
                        className={`pb-2 border-b-4 transition-colors ${
                            activeTab === "my-connections"
                                ? "text-purple-600 border-purple-600 font-medium"
                                : "text-gray-600 border-transparent hover:text-purple-600 hover:border-purple-600"
                        }`}
                    >
                        My Connections
                    </button>
                </div>
            </div>



            {/* Main Content Area */}
            {
                activeTab === "find-new-connections"
                    ? <FindConnections/>
                    : <MyNetwork/>
            }

        </div>
    </>
}

export default Network;
