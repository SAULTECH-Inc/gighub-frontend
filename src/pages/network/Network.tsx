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
import {NetworkHeader} from "./NetworkHeader.tsx";
import NetworkCard from "./NetworkCard.tsx";
import NetworkConnectionsCard from "./NetworkConnectionsCard.tsx";

const Network: React.FC = ()=>{
    return <>
        <div className="w-full flex flex-col mx-auto border-2 border-black">
            {
                USER_TYPE === UserType.APPLICANT ?
                    (<TopNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile}
                                navbarItemsMap={applicantNavBarItemMap}/>)
                    : <TopNavBar navItems={employerNavItems} navItemsMobile={employerNavItemsMobile}
                                 navbarItemsMap={employerNavBarItemMap}/>
            }
            <NetworkHeader/>
            <div
                className="w-full mx-auto flex flex-col md:flex-row gap-6 justify-center p-4 border-2 border-black">
                {/* Main Content Area */}
                <div className="w-full grid sm:grid-cols-1 lg:grid-cols-4 gap-6 border-2">
                    <NetworkCard/>
                    <NetworkCard/>
                    <NetworkCard/>
                    <NetworkCard/>
                    <NetworkCard/>
                    <NetworkCard/>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                    <h2 className="font-semibold text-lg">Find New Connections</h2>
                    <NetworkConnectionsCard/>
                    <NetworkConnectionsCard/>
                    <NetworkConnectionsCard/>
                </div>
            </div>

        </div>
    </>
}

export default Network;
