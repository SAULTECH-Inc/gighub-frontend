import JobSearchBar from "../../components/layouts/JobSearchBar";
import TopNavBar from "../../components/layouts/TopNavBar"
import ApplicantSchedules from "../../components/ui/ApplicantSchedules";
import JobShortlisted from "../../components/ui/JobShortlisted";
import {
    applicantNavBarItemMap,
    applicantNavItems,
    applicantNavItemsMobile,
} from "../../utils/constants";

const ApplicantShortList = () => {
  return (
    <div>
        <TopNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap} />
        <div className="bg-[#F7F8FA] px-6 grid grid-cols-[1024px_396px] gap-6 min-h-screen max-lg:grid-cols-1">
            {/* first column */}
            <div className="flex flex-col w-full">
                <JobSearchBar />
                <div className="bg-white mt-10 rounded-[16px] p-4">
                    <h3 className="text-[30px] font-bold">You are shortlisted in the following jobs</h3>
                    <div className="flex flex-col items-center">
                        {Array(2).fill("").map((index)=>(
                            <JobShortlisted
                            key={index} 
                            companyName="Fundy Inc"
                            jobTitle="Product Design"
                            jobType="Full Time, Remote"
                            location="Lagos, Nigeria"
                            shortlisted="13 January, 2025"
                        />
                        ))}
                    </div>
                </div>
            </div>
            {/* second column */}
            <ApplicantSchedules />
        </div>
    </div>
  )
}

export default ApplicantShortList