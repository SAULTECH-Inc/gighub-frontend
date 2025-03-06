import React from "react";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import ApplicationStats from "../../components/ui/ApplicationStats.tsx";
import ApplicantRecentApplications from "../../components/ui/ApplicantRecentApplications.tsx";
import ApplicantSchedules from "../../components/ui/ApplicantSchedules.tsx";
import ApplicantMessages from "../../components/ui/ApplicantMessages.tsx";
import BelowJobStats from "../../components/ui/BelowJobStats.tsx";
import {employerNavBarItemMap, employerNavItems, employerNavItemsMobile} from "../../utils/constants.ts";

const EmployerDashboard: React.FC = () => {
    return (
        <>
            <div className="bg-[#F7F7F7]">
                <TopNavBar navItems={employerNavItems} navItemsMobile={employerNavItemsMobile} navbarItemsMap={employerNavBarItemMap}/>
                <div
                    className="py-6 bg-gray-100 px-3 lg:grid lg:grid-cols-[1024px_396px] gap-6 min-h-screen items-start justify-center overscroll-auto">
                    {/* First Column */}
                    <div className="flex flex-col items-center space-y-6 w-full">
                        <ApplicationStats/>
                        <BelowJobStats/>
                        <ApplicantRecentApplications/>
                    </div>

                    {/* Second Column */}
                    <div className="flex flex-col items-center gap-y-4 w-full">
                        <div className="w-full flex justify-center">
                            <ApplicantSchedules/>
                        </div>
                        <div className="w-full flex justify-center">
                            <ApplicantMessages/>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default EmployerDashboard;