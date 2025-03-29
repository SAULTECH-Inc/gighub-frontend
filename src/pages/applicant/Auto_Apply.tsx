import JobApplied from "../../components/features/JobApplied";
import JobSearchBar from "../../components/layouts/JobSearchBar";
import TopNavBar from "../../components/layouts/TopNavBar";
import {
    applicantNavBarItemMap,
    applicantNavItems,
    applicantNavItemsMobile,
} from "../../utils/constants";

const Auto_Apply = () => {
    const getFormattedDate = (): string => {
        // Get current date
        const today = new Date();
        return today.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };
  return (
    <div>
        <TopNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap} />
        <div className="bg-[#F7F8FA] p-6 flex flex-col mt-5">
            <JobSearchBar />
            <h3 className="text-[20px] font-normal text-black my-7">Number of Jobs Applied For You: <span className="text-[#6438C2]">1500</span></h3>
            <div className="bg-white shadow-md p-6 flex flex-col gap-10 rounded-[16px]">
            {Array(7).fill("").map((index)=>(
                            <JobApplied
                            key={index} 
                            companyName="Fundy Inc"
                            jobTitle="Product Design"
                            jobType="Remote"
                            location="Lagos, Nigeria"
                            date={getFormattedDate()}
                        />
            ))}
            </div>
        </div>
    </div>
  )
}

export default Auto_Apply