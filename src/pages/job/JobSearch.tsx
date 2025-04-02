import React, {useEffect, useRef, useState} from "react";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
    applicantNavBarItemMap,
    applicantNavItems,
    applicantNavItemsMobile,
} from "../../utils/constants.ts";
import {JobDetails} from "../../components/features/JobDetails.tsx";
import JobSearchSidebar from "../../components/ui/JobSearchSidebar.tsx";
import ApplicantSchedules from "../../components/ui/ApplicantSchedules.tsx";
import TopHiringCompanies from "./TopHiringCompanies.tsx";
import JobSearchSidebarMobile from "../../components/ui/JobSearchSidebarMobile.tsx";
import JobSearchTopBar from "../../components/ui/JobSearchTopBar.tsx";
import {AnimatePresence, motion} from "framer-motion";

const JobSearch: React.FC = () => {
    const [showSideBarMenu, setShowSideBarMenu] = useState(false);
    // States for different filter sections
    const [sortBy, setSortBy] = useState("Most Relevant");
    const [location, setLocation] = useState("Onsite");

    const [jobType, setJobType] = useState<string[]>([]);
    const [experience, setExperience] = useState<string[]>([]);
    const sidebarRef = useRef<HTMLDivElement>(null);

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

    const handleToggleSidebar = () => {
        setShowSideBarMenu((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                showSideBarMenu &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                setShowSideBarMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSideBarMenu]);

    return (
        <div className="relative">
            <TopNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile}
                       navbarItemsMap={applicantNavBarItemMap}/>

            <AnimatePresence>
                {showSideBarMenu && (
                    <motion.div
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-0 z-50" // Make sure to preserve positioning
                    >
                        <JobSearchSidebarMobile
                            toggleSidebar={handleToggleSidebar}
                            isOpened={showSideBarMenu}
                            ref={sidebarRef}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <JobSearchTopBar toggleSidebar={handleToggleSidebar} />

            <div className="w-full grid grid-cols-1 gap-y-6 md:grid-cols-[30%_70%] lg:grid-cols-[20%_45%_30%] justify-evenly gap-x-4 bg-[#F7F8FA] md:p-4">
                <div className={`md:w-full w-full hidden md:flex`}>
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

                <div className="w-full flex flex-col rounded-[16px] gap-y-8 md:gap-y-4 bg-white p-2 md:p-4">
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

                <div className="w-full md:col-span-2 mdl:flex mdl:flex-row lg:flex-col lg:col-span-1 lg:w-full flex flex-col gap-y-4">
                    <ApplicantSchedules/>
                    <TopHiringCompanies/>
                </div>
            </div>


        </div>
    );
};

export default JobSearch;
