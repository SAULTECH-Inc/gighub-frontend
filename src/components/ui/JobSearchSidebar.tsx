import React from "react";
import searchFilterButton from "../../assets/icons/search-filter-button.svg";
import CustomRadioButton from "../common/CustomRadioButton.tsx";
import CustomCheckbox from "../common/CustomCheckbox.tsx";
import SalaryRangeSelector from "../common/SalaryRangeSelector.tsx";

interface JobSearchSidebar{
    jobType: string[];
    setJobType: React.Dispatch<React.SetStateAction<string[]>>;
    experience: string[];
    setExperience: React.Dispatch<React.SetStateAction<string[]>>;
    location: string;
    setLocation: React.Dispatch<React.SetStateAction<string>>;
    resetFilters: () => void;
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
    handleCheckboxChange: (category: string[], setCategory: React.Dispatch<React.SetStateAction<string[]>>, value: string)=>void;
}
const JobSearchSidebar: React.FC<JobSearchSidebar> = ({
    jobType,
    setJobType,
    experience,
    setExperience,
    location,
    setLocation,
    resetFilters,
    sortBy,
    setSortBy,
    handleCheckboxChange,
                                                      })=>{
    return (
        <div className="w-full bg-white grid grid-cols-1 px-4 border-2 border-[#F5F5F5]">
            {/* Filter Header */}
            <div className="flex justify-between items-center">
                <div className="flex gap-x-4">
                    <img src={searchFilterButton} className="cursor-pointer" alt="search filter button"/>
                    <p>Filter</p>
                </div>
                <p className="cursor-pointer text-[#6438C2]" onClick={resetFilters}>Reset</p>
            </div>
            <hr className="w-full border-[#E6E6E6]"/>

            {/* Sort By */}
            <div className="flex flex-col gap-y-2">
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
            <hr className="w-full border-[#E6E6E6]"/>

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
            <hr className="w-full border-[#E6E6E6]"/>

            <SalaryRangeSelector onChange={
                (v)=>{
                   console.log(v);
                }
            }/>

            <hr className="w-full border-[#E6E6E6]"/>

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
            <hr className="w-full border-[#E6E6E6]"/>

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
    )
}

export default JobSearchSidebar;