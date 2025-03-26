import JobSearchBar from "../../components/layouts/JobSearchBar";
import TopNavBar from "../../components/layouts/TopNavBar"
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
        <div className="relative bg-[#F7F8FA] p-6">
            <JobSearchBar />
        </div>
    </div>
  )
}

export default ApplicantShortList