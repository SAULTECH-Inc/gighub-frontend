import React from "react";
import searchFilterButton from "../../assets/icons/search-filter-button.svg";
import CustomRadioButton from "../common/CustomRadioButton.tsx";
import CustomCheckbox from "../common/CustomCheckbox.tsx";
import SalaryRangeSelector, {CurrencyType, FrequencyType} from "../common/SalaryRangeSelector.tsx";
import {UseJobSearchSettings, useJobSearchSettings} from "../../store/useJobSearchSettings.ts";

interface JobSearchSidebar{
    jobType: string[];
    experience: string[];
    location: string;
    sortBy: string;
}
const JobSearchSidebar: React.FC<JobSearchSidebar> = ({
    jobType,
    experience,
    location,
    sortBy,
                                                      })=>{
    const {settings, setSettings, resetSettings} = useJobSearchSettings();
    return (
        <div className="w-full bg-white grid grid-cols-1 px-4 border-2 border-[#F5F5F5]">
            {/* Filter Header */}
            <div className="flex justify-between items-center">
                <div className="flex gap-x-4">
                    <img src={searchFilterButton} className="cursor-pointer" alt="search filter button"/>
                    <p>Filter</p>
                </div>
                <p className="cursor-pointer text-[#6438C2]" onClick={resetSettings}>Reset</p>
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
                            onChange={() => {
                                setSettings({
                                    ...settings,
                                    sortBy: option,
                                } as UseJobSearchSettings);
                            }}
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
                            checked={jobType?.includes(option)}
                            onChange={() => {
                                setSettings({
                                    ...settings,
                                    jobType: jobType.includes(option)
                                        ? jobType.filter((type) => type !== option)
                                        : [...jobType, option],
                                } as UseJobSearchSettings);
                            }}
                            label={option}
                            size={19}
                            borderColor="#D9D9D9"
                            checkColor="#6E4AED"
                        />
                    ))}
                </div>
            </div>
            <hr className="w-full border-[#E6E6E6]"/>
            {/*baseMin = 0,*/}
            {/*baseMax = 100000,*/}
            {/*currency = "USD",*/}
            {/*frequency = "year",*/}
            <SalaryRangeSelector
                baseMax={settings?.salaryRange?.max}
                baseMin={settings?.salaryRange?.min}
                currency={settings?.salaryRange?.currency as CurrencyType}
                frequency={settings?.salaryRange?.frequency as FrequencyType}
                onChange={
                (v)=>{
                    setSettings({
                        ...settings,
                        salaryRange: v,
                } as UseJobSearchSettings);
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
                            checked={experience?.includes(option)}
                            onChange={() => {
                                setSettings({
                                    ...settings,
                                    experience: experience.includes(option)
                                        ? experience.filter((type) => type !== option)
                                        : [...experience, option],

                                } as UseJobSearchSettings);
                            }}
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
                            onChange={() => {
                                setSettings({
                                    ...settings,
                                    location: option,
                                } as UseJobSearchSettings);
                            }}
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
