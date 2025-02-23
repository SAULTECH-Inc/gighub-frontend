
import ApplicantNavBar from "../../components/layouts/ApplicantNavBar.tsx";
import ApplicationStats from "../../components/ui/ApplicationStats.tsx";
import BelowApplicationStats from "../../components/ui/BelowApplicationStats.tsx";
import ApplicantRecentApplications from "../../components/ui/ApplicantRecentApplications.tsx";
import ApplicantMessages from "../../components/ui/ApplicantMessages.tsx";
import ApplicantSchedules from "../../components/ui/ApplicantSchedules.tsx";
import {
    applicantNavBarItemMap,
    applicantNavItems, applicantNavItemsMobile,
} from "../../utils/constants.ts";

export const ApplicantDashboard = () => {
    return (
        <>
            <div className="bg-[#F7F7F7]">
                <ApplicantNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile} navbarItemsMap={applicantNavBarItemMap}/>
                <div
                    className="py-6 bg-gray-100 px-3 md:grid md:grid-cols-[1024px_396px] gap-6 min-h-screen items-start justify-center">
                    {/* First Column */}
                    <div className="flex flex-col items-center space-y-6 w-full">
                        <ApplicationStats/>
                        <BelowApplicationStats/>
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
};
