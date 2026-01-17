import { FC, useEffect, useState } from "react";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import JobDetailsSidebar from "../jobDetails/JobDetailsSidebar.tsx";
import JobDetailsTop from "../jobDetails/JobDetailsTop.tsx";
import JobDetailsBody from "../jobDetails/JobDetailsBody.tsx";
import {
  applicantNavBarItemMap,
  employerNavBarItemMap,
} from "../../utils/constants.ts";
import { useParams } from "react-router-dom";
import { JobPostResponse } from "../../utils/types";
import { fetchJobById } from "../../services/api";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
const JobDetails: FC = () => {
  const { id } = useParams();

  const [job, setJob] = useState<JobPostResponse>();
  useEffect(() => {
    if (!id) return; // Prevents fetching if id is undefined

    const fetchJob = async () => {
      try {
        const response = await fetchJobById(Number(id)); // Assuming this returns { data: JobPostResponse }
        setJob(response.data);
      } catch (error) {
        console.error("Failed to fetch job:", error);
      }
    };

    fetchJob().then((r) => r);
  }, [id]);

  const handleEditJob = async () => {};

  return (
    <div className="mx-auto">
      {USER_TYPE === UserType.EMPLOYER ? (
        <TopNavBar
          navbarItemsMap={employerNavBarItemMap}
          userType={"employer"}
        />
      ) : (
        <TopNavBar
          navbarItemsMap={applicantNavBarItemMap}
          userType={"applicant"}
        />
      )}
      <div className="mx-auto flex min-h-screen justify-center gap-x-10 bg-[#F7F8FA] px-2 pt-6 lg:px-5">
        {/* Main Content */}
        <div className="flex w-full flex-col gap-y-8 rounded-[16px] p-4 lg:p-8">
          <JobDetailsTop />
          {/*Form */}
          {job && (
            <form className="mx-auto flex min-h-[600px] w-full flex-col items-start gap-x-4 gap-y-4 md:flex-row">
              <JobDetailsBody handleEditJob={handleEditJob} job={job} />
              <JobDetailsSidebar handleEditJob={handleEditJob} job={job} />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
