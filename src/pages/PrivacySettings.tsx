import {FC} from "react";
import TopNavBar from "../components/layouts/TopNavBar.tsx";
import Privacy from "./settings/privacy/Privacy.tsx";
import PrivacySidebar from "./settings/privacy/PrivacySidebar.tsx";
import {employerNavBarItemMap, employerNavItems, employerNavItemsMobile} from "../utils/constants.ts";
const EmployerProfile: FC = () => {
    return (
        <div className="mx-auto">
            <TopNavBar navItems={employerNavItems} navItemsMobile={employerNavItemsMobile} navbarItemsMap={employerNavBarItemMap}/>
            <div className="flex justify-center  min-h-screen pt-6 mx-auto gap-x-10 px-2 lg:px-5">
                {/* Sidebar */}
                <PrivacySidebar/>

                {/* Main Content */}
                <div className=" rounded-[16px]  lg:w-[70%]  p-4 lg:p-8">
                    {/*<ProfileCard/>*/}

                    {/*Form */}
                    <form className="space-y-8">
                        <Privacy/>


                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;
