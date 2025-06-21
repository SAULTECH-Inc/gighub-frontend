import TopNavBar from "../../components/layouts/TopNavBar";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
} from "../../utils/constants";
import JobSearchTopBar from "../../components/ui/JobSearchTopBar";
import JobDetailsSidebar from "../../components/ui/applicant/job/JobDetailsSidebar.tsx";
import JobDescription from "../../components/ui/applicant/job/JobDescription.tsx";
import CompanyInfo from "../../components/ui/applicant/job/CompanyInfo.tsx";
import { useState } from "react";
import { JobPostResponse } from "../../utils/types";

const ApplicantJobDetails = () => {

  const [, setJobs] = useState<JobPostResponse[]>([]);
  const [, setTotalPages] = useState(0);
  return (
    <div>
      <TopNavBar
        navItems={applicantNavItems}
        navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap}
      />
      <div className="hidden sm:block">
        <JobSearchTopBar toggleSidebar={()=>{}} setJobs={setJobs} setTotalPages={setTotalPages} />
      </div>
      <div className="flex items-start justify-between bg-[#F7F8FA] p-3 max-lg:flex-col-reverse sm:p-6">
        <div className="flex flex-col gap-y-4 rounded-[16px] p-4 max-lg:grid max-lg:grid-cols-2 max-lg:gap-x-2 max-sm:grid-cols-1">
          {Array(3)
            .fill("")
            .map((_, index) => (
              <JobDetailsSidebar
                key={index}
                title="Quality Assurance Tester Manual Intern"
                location="Lagos, Nigeria"
                tags={["Full time", "Onsite", "Internship"]}
                description="The React Engineer translates project requirements and objectives into functional, high-quality, and ......."
                type="Full-Time"
                applicants={76}
                daysLeft={4}
              />
            ))}
        </div>
        <div className="rounded-[16px] bg-white shadow-lg">
          <div className="flex-row items-center justify-center sm:flex sm:items-start">
            <div>
              <JobDescription />
            </div>
            <div>
              <CompanyInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantJobDetails;
