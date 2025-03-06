import React, {useState} from "react";
import TopNavBar from "../components/layouts/TopNavBar.tsx";
import {
    applicantNavBarItemMap,
    applicantNavItems,
    applicantNavItemsMobile,
} from "../utils/constants.ts";
import JobSearchTopBar from "../components/ui/JobSearchTopBar.tsx";
import {JobDetails} from "../components/features/JobDetails.tsx";
import JobSearchSidebar from "../components/ui/JobSearchSidebar.tsx";
import ApplicantSchedules from "../components/ui/ApplicantSchedules.tsx";
import ApplicantMessages from "../components/ui/ApplicantMessages.tsx";

const JobSearch: React.FC = () => {
    // States for different filter sections
    const [sortBy, setSortBy] = useState("Most Relevant");
    const [location, setLocation] = useState("Onsite");

    const [jobType, setJobType] = useState<string[]>([]);
    const [experience, setExperience] = useState<string[]>([]);

    // Handle checkbox changes (toggle in array)
    const handleCheckboxChange = (category: string[], setCategory: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        category.forEach(console.log);
        setCategory((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    // Reset all filters
    const resetFilters = () => {
        setSortBy("Most Relevant");
        setLocation("Onsite");
        setJobType([]);
        setExperience([]);
    };

    return (
        <div>
            <TopNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile}
                       navbarItemsMap={applicantNavBarItemMap}/>

            <JobSearchTopBar/>

            <div className="grid grid-cols-12 gap-x-4 bg-[#F7F8FA] border-2 p-4">
                <div className="col-span-2 flex">
                    <JobSearchSidebar
                        jobType={jobType}
                        setJobType={setJobType}
                        experience={experience}
                        setExperience={setExperience}
                        resetFilters={resetFilters}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        location={location}
                        setLocation={setLocation}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                </div>

                <div className="col-span-6 flex flex-col rounded-[16px] gap-y-4 bg-white p-4">
                    {Array(4)
                        .fill("")
                        .map((_, index) => (
                            <JobDetails
                                key={index}
                                title="Visual Designer"
                                company="Facebook"
                                tags={['UIUX', 'Blender']}
                                description="The Visual Designer conveys design concepts into wireframes and high fidelity, quality prototypes to match project requirements, objectives, and brand guide."
                                location="Lagos, Nigeria"
                                type="Full-Time"
                                applicants={76}
                                daysLeft={4}
                            />
                        ))}
                </div>

                <div className="col-span-4 flex flex-col gap-y-4">
                    <ApplicantSchedules/>
                    <ApplicantMessages/>
                </div>
            </div>


        </div>
    );
};

export default JobSearch;
