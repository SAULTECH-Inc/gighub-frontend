import React, { useState } from "react";
import PreferredLocationSelector from "./PreferedLocationSelector.tsx";

interface JobLocation {
    country: string;
    city: string;
}

export interface JobPreferences {
    categories: string[];
    jobType: string[];
    locations: JobLocation[];
    salaryExpectation: string;
}

const JobPreferencesForm: React.FC = () => {
    const [preferences, setPreferences] = useState<JobPreferences>({
        categories: [],
        jobType: [],
        locations: [],
        salaryExpectation: "",
    });

    const categoryOptions = ["UI/UX", "Graphic Design", "Software Engineering", "Marketing"];
    const jobTypeOptions = ["Full Time", "Remote", "Part Time", "Freelance"];
    const countryOptions = ["Nigeria", "USA", "UK", "Canada"];
    const cityOptions = ["Apapa", "Ikeja", "Victoria Island", "Abuja"];
    const salaryOptions = ["$30,000 - $50,000", "$50,000 - $70,000", "$70,000 - $100,000"];

    const handleCategorySelect = (category: string) => {
        if (category && !preferences.categories.includes(category)) {
            setPreferences((prev) => ({
                ...prev,
                categories: [...prev.categories, category],
            }));
        }
    };

    const handleJobTypeSelect = (type: string) => {
        if (type && !preferences.jobType.includes(type)) {
            setPreferences((prev) => ({
                ...prev,
                jobType: [...prev.jobType, type],
            }));
        }
    };

    const handleLocationSelect = (country: string, city: string) => {
        // Only add location if both country and city are selected
        if (country && city) {
            const locationExists = preferences.locations.some(
                (loc) => loc.country === country && loc.city === city
            );
            if (!locationExists) {
                setPreferences((prev) => ({
                    ...prev,
                    locations: [...prev.locations, { country, city }],
                }));
            }
        }
    };


    const handleSalarySelect = (salary: string) => {
        if (salary) {
            setPreferences((prev) => ({
                ...prev,
                salaryExpectation: salary,
            }));
        }
    };

    const removeCategory = (index: number) => {
        setPreferences((prev) => ({
            ...prev,
            categories: prev.categories.filter((_, i) => i !== index),
        }));
    };

    const removeJobType = (index: number) => {
        setPreferences((prev) => ({
            ...prev,
            jobType: prev.jobType.filter((_, i) => i !== index),
        }));
    };

    const removeLocation = (index: number) => {
        setPreferences((prev) => ({
            ...prev,
            locations: prev.locations.filter((_, i) => i !== index),
        }));
    };

    return (
        <section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] ">
        <div className="p-8 bg-white rounded-lg max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold font-lato text-gray-800">Job Preferences</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Preferred Job Categories */}
                <div>
                    <label className="block text-lg font-lato text-gray-700 mb-2">
                        Preferred Job Categories
                    </label>
                    <div className="border-[1px]  w-[400px] h-[176px] border-[#E6E6E6] rounded-[16px] bg-white p-4">
                        <select
                            className="w-full p-2 border border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA]"
                            value=""
                            onChange={(e) => {
                                handleCategorySelect(e.target.value);
                                e.target.value = ""; // Reset to keep the placeholder visible
                            }}
                        >
                            <option value="" disabled>
                            </option>
                            {categoryOptions.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {preferences.categories.map((category, index) => (
                                <div
                                    key={index}
                                    className="w-[168px] h-[38px] bg-[#56E5A1] text-white text-sm font-medium flex items-center justify-between px-4 rounded-[10px]"
                                >
                                    <span>{category}</span>
                                    <button
                                        onClick={() => removeCategory(index)}
                                        className="text-white font-bold text-lg"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/*Preferred location selector*/}
                <PreferredLocationSelector preferences={preferences} cityOptions={cityOptions} handleLocationSelect={handleLocationSelect} removeLocation={removeLocation} countryOptions={countryOptions}/>

                {/* Preferred Job Type */}
                <div>
                    <label className="block text-lg font-lato  -mt-14 text-gray-700">
                        Preferred Job Type
                    </label>
                    <div className="border border-gray-300 border-[#E6E6E6] w-[400px] h-[167px] rounded-[16px] bg-white p-4">
                        <select
                            className="w-full p-2 border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA]"
                            value=""
                            onChange={(e) => {
                                handleJobTypeSelect(e.target.value);
                                e.target.value = ""; // Reset to keep the placeholder visible
                            }}
                        >
                            <option value="" disabled>

                            </option>
                            {jobTypeOptions.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {preferences.jobType.map((type, index) => (
                                <div
                                    key={index}
                                    className="w-[168px] h-[38px] bg-[#56E5A1] text-white text-sm font-medium flex items-center justify-between px-4 rounded-[10px]"
                                >
                                    <span>{type}</span>
                                    <button
                                        onClick={() => removeJobType(index)}
                                        className="text-white font-bold text-lg"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Preferred Salary Expectation */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                        Preferred Salary Expectation
                    </label>
                    <select
                        className=" p-2 w-full max-w-xs h-[55px] border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA]"
                        value=""
                        onChange={(e) => {
                            handleSalarySelect(e.target.value);
                            e.target.value = ""; // Reset to keep the placeholder visible
                        }}
                    >
                        <option value="" disabled>
                        </option>
                        {salaryOptions.map((salary) => (
                            <option key={salary} value={salary}>
                                {salary}
                            </option>
                        ))}
                    </select>

                    {preferences.salaryExpectation && (
                        <div className="mt-4">
                            <div className="w-[168px] h-[38px] bg-[#56E5A1] text-white text-sm font-lato flex items-center justify-between px-4 rounded-[10px]">
                                <span>{preferences.salaryExpectation}</span>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
        </section>
    );
};

export default JobPreferencesForm;
