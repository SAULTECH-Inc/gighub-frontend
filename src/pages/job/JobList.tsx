import { FC } from "react";
import JobFilterBar from "../jobList/JobFilterBar.tsx";
import JobTable from "../jobList/JobTable.tsx";
const JobList: FC = () => {
  return (
    <div className="mx-auto">
      {/*<TopNavBar/>*/}
      <div className="mx-auto flex justify-center gap-x-10 px-2 pt-6 lg:px-5">
        {/* Main Content */}
        <div className="rounded-[16px] p-4 lg:w-[70%] lg:p-8">
          {/*<ProfileCard/>*/}

          {/*Form */}
          <form className="space-y-8">
            <JobFilterBar />
            <JobTable />
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobList;
