import {FC} from "react";
import TopNavBar from "../components/layouts/TopNavBar.tsx";
import FilterBar from "./jobList2/FilterBar.tsx";
import Table from "./jobList2/Table.tsx";
import {employerNavBarItemMap, employerNavItems, employerNavItemsMobile} from "../utils/constants.ts";
const FilterJob: FC = () => {
    return (
        <div className="mx-auto">
            <TopNavBar navItems={employerNavItems} navItemsMobile={employerNavItemsMobile} navbarItemsMap={employerNavBarItemMap}/>
            <div className="flex justify-center    pt-6 mx-auto gap-x-10 px-2 lg:px-5">
                {/* Main Content */}
                <div className=" rounded-[16px]  lg:w-[70%]  p-4 lg:p-8">
                    {/*<ProfileCard/>*/}

                    {/*Form */}
                    <form className="space-y-8">
                        <FilterBar/>
                        <Table/>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FilterJob;
