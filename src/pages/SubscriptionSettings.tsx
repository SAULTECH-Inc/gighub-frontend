import {FC} from "react";
import ApplicantNavBar from "../components/layouts/ApplicantNavBar.tsx";
import SubscriptionHead from "./settings/subscription/SubscriptionHead.tsx";
import MonthlyPlan from "./settings/subscription/MonthlyPlan.tsx";
import InvoiceList from "./settings/subscription/InvoiceList.tsx";
import SubscriptionSidebar from "./settings/subscription/SubsriptionSidebar.tsx";
import {employerNavBarItemMap, employerNavItems, employerNavItemsMobile} from "../utils/constants.ts";
const EmployerProfile: FC = () => {
    return (
        <div className="mx-auto">
            <ApplicantNavBar navItems={employerNavItems} navItemsMobile={employerNavItemsMobile} navbarItemsMap={employerNavBarItemMap}/>
            <div className="flex justify-center  min-h-screen pt-6 mx-auto gap-x-10 px-2 lg:px-5">
                {/* Sidebar */}
                <SubscriptionSidebar/>

                {/* Main Content */}
                <div className=" rounded-[16px]  lg:w-[70%]  p-4 lg:p-8">
                    {/*<ProfileCard/>*/}

                    {/*Form */}
                    <form className="space-y-8">
                        <SubscriptionHead/>
                        <MonthlyPlan/>
                        <InvoiceList/>



                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;
