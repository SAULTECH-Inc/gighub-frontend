import {FC} from "react";
import ApplicantNavBar from "../components/layouts/ApplicantNavBar.tsx";
import Account from "./settings/account/Account.tsx";
import AccountSidebar from "./settings/account/AccountSidebar.tsx";
import {employerNavBarItemMap, employerNavItems, employerNavItemsMobile} from "../utils/constants.ts";
const EmployerProfile: FC = () => {
    return (
        <div className="bg-[#F7F8FA] mx-auto">
            <ApplicantNavBar navItems={employerNavItems} navItemsMobile={employerNavItemsMobile} navbarItemsMap={employerNavBarItemMap}/>
            <div className="flex justify-center bg-gray-100 min-h-screen pt-6 mx-auto gap-x-10 px-2 lg:px-5">
                {/* Sidebar */}
                <AccountSidebar/>

                {/* Main Content */}
                <div className="h-[1000px] rounded-[16px] w-full lg:w-[70%] bg-white border-[#E6E6E6] border-[1px] p-4 lg:p-8">
                    {/*<ProfileCard/>*/}

                     {/*Form */}
                    <form className="space-y-8">
                        <Account/>


                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;
