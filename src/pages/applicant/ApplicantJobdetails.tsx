import TopNavBar from "../../components/layouts/TopNavBar"
import {
    applicantNavBarItemMap,
    applicantNavItems,
    applicantNavItemsMobile,
} from "../../utils/constants";
import JobSearchTopBar from "../../components/ui/JobSearchTopBar";
import  JobDetails  from "../../components/ui/applicant/JobDetails";
import JobDescription from "../../components/ui/applicant/JobDescription";

const ApplicantJobdetails = () => {
  return (
    <div>
        <TopNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap} />
        <JobSearchTopBar/>
        <div className="grid grid-cols-12 gap-x-14 bg-[#F7F8FA] p-6">
            <div className="col-span-4 flex flex-col rounded-[16px] gap-y-4 p-4">
                {Array(3).fill("").map((_, index)=>(
                    <JobDetails 
                    key={index}
                    title='Quality Assurance Tester Manual Intern'
                    location='Lagos, Nigeria'
                    tags={['Full time', 'Onsite', 'Internship']}
                    description='The React Engineer translates project requirements and objectives into functional, high-quality, and .......'
                    type="Full-Time"
                    applicants={76}
                    daysLeft={4}
                    />
                ))}
            </div>
            <div className="col-span-8 bg-white p-4 shadowm-lg">
                <div className="flex items-center gap-2">
                    <div>
                        <JobDescription />
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ApplicantJobdetails