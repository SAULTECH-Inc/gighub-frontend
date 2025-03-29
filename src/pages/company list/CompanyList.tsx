import Companies from "../../components/company list/Companies";
import CompanyNavbar from "../../components/company list/CompanyNavbar";
import TopNavBar from "../../components/layouts/TopNavBar"
import JobDetailsSidebar from "../../components/ui/applicant/JobDetailsSidebar";
import {
    applicantNavBarItemMap,
    applicantNavItems,
    applicantNavItemsMobile,
} from "../../utils/constants";


const CompanyList = () => {
  return (
    <div className="relative overflow-hidden">
        {/*<TopNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile}*/}
        {/*navbarItemsMap={applicantNavBarItemMap} />*/}
        <div className="p-4 bg-[#F7F8FA]">
            <CompanyNavbar />
            <div className="flex max-lg:flex-col-reverse items-start gap-x-6 mt-5">
                <div className="grid grid-cols-1 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4 max-lg:mt-10 max-w-[500px] max-lg:max-w-full">
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
                <div className="flex-1 bg-white shadow-md p-4 rounded-[16px]">
                    <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4">
                        {Array(4).fill("").map((_, index)=>(
                            <Companies
                            key={index}
                            title='PaystacK inc'
                            description="PaystacK incPaystack is a leading payment platform that simplifies online and offline payments for businesses in Africa, offering seamless transactions, robust APIs, and scalable solutions.View Profile"
                        />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default CompanyList
