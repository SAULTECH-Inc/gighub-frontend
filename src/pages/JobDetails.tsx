import {FC} from "react";
import ApplicantNavBar from "../components/layouts/ApplicantNavBar.tsx";
import JobDetailsSidebar from "./jobDetails/JobDetailsSidebar.tsx";
import JobDetailsTop from "./jobDetails/JobDetailsTop.tsx";
import JobDetailsBody from "./jobDetails/JobDetailsBody.tsx";
import {employerNavBarItemMap, employerNavItems, employerNavItemsMobile} from "../utils/constants.ts";
const EmployerProfile: FC = () => {
    return (
        <div className="mx-auto">
            <ApplicantNavBar navItems={employerNavItems} navItemsMobile={employerNavItemsMobile} navbarItemsMap={employerNavBarItemMap}/>
            <div className="flex justify-center bg-gray  min-h-screen pt-6 mx-auto gap-x-10 px-2 lg:px-5">
                {/* Sidebar */}
                <JobDetailsSidebar/>


                {/* Main Content */}
                <div className=" rounded-[16px]  lg:w-[70%]  p-4 lg:p-8">
                    {/*<ProfileCard/>*/}

                    {/*Form */}
                    <form className="space-y-8">
                        <JobDetailsTop/>
                        <JobDetailsBody/>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;
