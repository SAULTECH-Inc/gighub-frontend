
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import ApplicationStats from "../../components/ui/ApplicationStats.tsx";
import BelowApplicationStats from "../../components/ui/BelowApplicationStats.tsx";
import ApplicantRecentApplications from "../../components/ui/ApplicantRecentApplications.tsx";
import ApplicantMessages from "../../components/ui/ApplicantMessages.tsx";
import ApplicantSchedules from "../../components/ui/ApplicantSchedules.tsx";
import {
    applicantNavBarItemMap,
    applicantNavItems, applicantNavItemsMobile,
} from "../../utils/constants.ts";

import { useNavigate } from "react-router-dom";

export const ApplicantDashboard = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="bg-[#F7F7F7]">
                <TopNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile} navbarItemsMap={applicantNavBarItemMap}/>
                <div
                    className="py-6 bg-gray-100 px-3 xl:grid xl:grid-cols-[65%_30%] gap-4 min-h-screen items-start justify-center">
                    {/* First Column */}
                    <div className="flex flex-col items-center space-y-6 w-full">
                        <ApplicationStats/>
                        <BelowApplicationStats/>
                        <ApplicantRecentApplications/>
                    </div>

                    {/* Second Column */}
                    <div className="flex xl:flex-col xl:items-center gap-x-2 gap-y-4 w-full">
                        <div className="w-full flex justify-center">
                            <ApplicantSchedules/>
                        </div>
                        <div className="w-full flex justify-center">
                            <ApplicantMessages/>
                        </div>
                    </div>
                                      {/* <button className="font-medium text-[#000000]" onClick={() => navigate("/user/publicprofileview/[id]")}> */}
                  <button className="font-medium bg-red-600 px-5 text-[#000000]" onClick={() => navigate("/user/viewprofile")}>
                    View Profile
                  </button>
                </div>

            </div>
        </>
    );
};
