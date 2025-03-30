import {FC} from "react";
import JobFilterBar from "../jobList/JobFilterBar.tsx";
import JobTable from "../jobList/JobTable.tsx";
const JobList: FC = () => {
    return (
        <div className="mx-auto">
            {/*<TopNavBar/>*/}
            <div className="flex justify-center    pt-6 mx-auto gap-x-10 px-2 lg:px-5">
                {/* Main Content */}
                <div className=" rounded-[16px]  lg:w-[70%]  p-4 lg:p-8">
                    {/*<ProfileCard/>*/}

                    {/*Form */}
                    <form className="space-y-8">
                        <JobFilterBar/>
                        <JobTable/>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JobList;
