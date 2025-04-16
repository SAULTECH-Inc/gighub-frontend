import React, {forwardRef, useState} from "react";
import CustomRadioButton from "../common/CustomRadioButton.tsx";
import CustomCheckbox from "../common/CustomCheckbox.tsx";
import SalaryRangeSelector from "../common/SalaryRangeSelector.tsx";
import {IoMdArrowRoundBack} from "react-icons/io";

interface Props{
    toggleSidebar: ()=>void;
    isOpened: boolean;
}
const JobSearchSidebarMobile = forwardRef<HTMLDivElement, Props>(
    ({ toggleSidebar, isOpened = false }, ref) => {
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

    // Toggle sidebar men

    return (
        <div ref={ref} className={`fixed inset-0 z-50 items-start justify-start bg-black bg-opacity-50 overflow-y-auto ${isOpened ? "flex" : "hidden"}`}>
            <div className="relative w-[300px] min-h-screen bg-white grid grid-cols-1 px-4 py-4 border-2 border-[#F5F5F5] overflow-y-auto">
                {/* Filter Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-x-4">
                        <IoMdArrowRoundBack onClick={()=>toggleSidebar()} />
                        <p>Filter</p>
                    </div>
                    <p className="cursor-pointer text-[#6438C2]" onClick={resetFilters}>Reset</p>
                </div>
                <hr className="w-full border-[#E6E6E6]"/>

                {/* Sort By */}
                <div className="flex flex-col gap-y-4">
                    <h3>Sort by</h3>
                    <div className="flex flex-col gap-y-2">
                        {["Most Relevant", "Most Recent", "Top Salary"].map((option) => (
                            <CustomRadioButton
                                key={option}
                                name="sortBy"
                                value={option}
                                checked={sortBy === option}
                                onChange={() => setSortBy(option)}
                                label={option}
                                size={19}
                                color="#6E4AED"
                            />
                        ))}
                    </div>
                </div>
                <hr className="w-full border-[#E6E6E6] my-4"/>

                {/* Job Type */}
                <div className="flex flex-col gap-y-3">
                    <h3>Job Type</h3>
                    <div>
                        {["Full-time", "Freelance", "Part-time", "Contract", "Internship", "Volunteer"].map((option) => (
                            <CustomCheckbox
                                key={option}
                                checked={jobType.includes(option)}
                                onChange={() => handleCheckboxChange(jobType, setJobType, option)}
                                label={option}
                                size={19}
                                borderColor="#D9D9D9"
                                checkColor="#6E4AED"
                            />
                        ))}
                    </div>
                </div>
                <hr className="w-full border-[#E6E6E6] my-4"/>

                <SalaryRangeSelector onChange={
                    (v)=>{
                        console.log(v);
                    }
                }/>

                <hr className="w-full border-[#E6E6E6] my-4"/>

                {/* Experience */}
                <div className="flex flex-col gap-y-3">
                    <h3>Experience</h3>
                    <div>
                        {["Under 1 Year", "1 - 2 Years", "2 - 5 Years", "5+ Years"].map((option) => (
                            <CustomCheckbox
                                key={option}
                                checked={experience.includes(option)}
                                onChange={() => handleCheckboxChange(experience, setExperience, option)}
                                label={option}
                                size={19}
                                borderColor="#D9D9D9"
                                checkColor="#6E4AED"
                            />
                        ))}
                    </div>
                </div>
                <hr className="w-full border-[#E6E6E6] my-4"/>

                {/* Location */}
                <div className="flex flex-col gap-y-3">
                    <h3>Location</h3>
                    <div className="flex flex-col gap-y-2">
                        {["Onsite", "Hybrid", "Remote"].map((option) => (
                            <CustomRadioButton
                                key={option}
                                name="location"
                                value={option}
                                checked={location === option}
                                onChange={() => setLocation(option)}
                                label={option}
                                size={19}
                                color="#6E4AED"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
});

export default JobSearchSidebarMobile;
