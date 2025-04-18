import Companies from "../../components/company list/Companies";
import CompanyNavbar from "../../components/company list/CompanyNavbar";
import TopNavBar from "../../components/layouts/TopNavBar";
import JobDetailsSidebar from "../../components/ui/applicant/JobDetailsSidebar";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
} from "../../utils/constants";

const CompanyList = () => {
  return (
    <div className="relative overflow-hidden">
      <TopNavBar
        navItems={applicantNavItems}
        navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap}
      />
      <div className="bg-[#F7F8FA] p-4">
        <CompanyNavbar />
        <div className="mt-5 flex items-start gap-x-6 max-lg:flex-col-reverse">
          <div className="min-[348px] grid max-w-[441px] grid-cols-1 gap-4 max-lg:mt-10 max-lg:max-w-full max-lg:grid-cols-2 max-sm:grid-cols-1">
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
          <div className="flex w-full flex-col justify-center rounded-[16px] bg-white p-4 shadow-md">
            
            <div className="flex w-[96%] flex-wrap gap-4 sm:w-full lg:justify-start">
            <div className="flex lg:hidden w-full flex-col justify-center my-2">
              <h2 className="text-[24px] font-bold text-black">
                Find Companies Easily
              </h2>
              <span className="font-bold">Sunday 6, 2024</span>
            </div>
              {Array(7)
                .fill("")
                .map((_, index) => (
                  <Companies
                    key={index}
                    title="PaystacK inc"
                    description="PaystacK incPaystack is a leading payment platform that simplifies online and offline payments for businesses in Africa, offering seamless transactions, robust APIs, and scalable solutions.View Profile"
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
