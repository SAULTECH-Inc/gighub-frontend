import TopNavBar from "../../components/layouts/TopNavBar"
import {
    applicantNavBarItemMap,
    applicantNavItems,
    applicantNavItemsMobile,
} from "../../utils/constants";
import JobSearchTopBar from "../../components/ui/JobSearchTopBar";
import  JobDetailsSidebar  from "../../components/ui/applicant/JobDetailsSidebar";
import JobDescription from "../../components/ui/applicant/JobDescription";
import CompanyInfo from "../../components/ui/applicant/CompanyInfo";

const ApplicantJobdetails = () => {
  return (
    <div>
        <TopNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap} />
        <div className="hidden sm:block">
        <JobSearchTopBar/>
        </div>
        <div className="flex items-start max-lg:flex-col-reverse justify-between bg-[#F7F8FA] sm:p-6 p-3">
            <div className="flex flex-col max-lg:grid max-lg:grid-cols-2 max-lg:gap-x-2 max-sm:grid-cols-1 rounded-[16px] gap-y-4 p-4">
                {Array(3).fill("").map((_, index)=>(
                    <JobDetailsSidebar
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
            <div className=" bg-white shadow-lg rounded-[16px]">
                <div className="sm:flex flex-row sm:items-start items-center justify-center ">
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
  )
}

export default ApplicantJobdetails
