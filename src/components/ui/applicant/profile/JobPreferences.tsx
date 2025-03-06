import React, {useEffect, useState} from "react";
import PreferredLocationSelector from "./PreferedLocationSelector.tsx";
import {JobPreference, Location, SalaryRange} from "../../../../utils/types";
import {useAuth} from "../../../../store/useAuth.ts";
import {useApplicantJobProfile} from "../../../../store/useApplicantJobProfile.ts";
import {useSectionEditable} from "../../../../store/useEditable.ts";

const JobPreferencesForm: React.FC = () => {
    const {applicant} = useAuth();
    const {preferences, fetchPreferences, setPreference, updatePreference} = useApplicantJobProfile();
    const {isEditable, toggleEdit} = useSectionEditable("job-preference");
    const categoryOptions = ["UI/UX", "Graphic Design", "Software Engineering", "Marketing"];
    const jobTypeOptions = ["Full Time", "Remote", "Part Time", "Freelance"];
    const countryOptions = ["Nigeria", "USA", "UK", "Canada"];
    const cityOptions = ["Apapa", "Ikeja", "Victoria Island", "Abuja"];

    const [salary, setSalary] = useState<SalaryRange>({currency: "NGN", minAmount: 0, maxAmount: 0});

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchPreferences(Number(applicant?.id) || 0);
            if (response && preferences) {
                setPreference({
                    roles: response.roles || [],
                    jobTypes: response.jobTypes || [],
                    locations: response.locations || [],
                    salaryRange: response.salaryRange || [],
                    applicantId: Number(applicant?.id) || 0,
                });
            } else {
                setPreference({
                    roles: [], jobTypes: [], locations: [], salaryRange: [], applicantId: Number(applicant?.id) || 0,
                });
            }
        };

        if (applicant?.id) {
            fetchData();
        }
    }, [applicant?.id]);


    const handleRoleSelect = async (category: string) => {
        if (category && !preferences?.roles?.includes(category)) {
            setPreference({
                ...preferences,
                applicantId: Number(applicant?.id) || 0,
                roles: [...preferences?.roles as string[], category]
            });
        }


    };

    const handleJobTypeSelect = async (type: string) => {
        if (type && !preferences?.jobTypes?.includes(type)) {
            setPreference({
                ...preferences,
                applicantId: Number(applicant?.id) || 0,
                jobTypes: [...preferences?.jobTypes as string[], type],
            });
        }
    };

    const handleLocationSelect = async (country: string, city: string) => {
        if (country && city) {
            const locationExists = preferences?.locations?.some((loc) => loc.country === country && loc.city === city);
            if (!locationExists) {
                setPreference({
                    applicantId: Number(applicant?.id) || 0, ...preferences,
                    locations: [...preferences?.locations as Location[], {country, city}],
                });
            }
        }
    };


    const handleSalaryChange = (field: keyof typeof salary, value: string) => {
        setSalary((prev) => ({
            ...prev, [field]: field === "currency" ? value : Number(value),
        }));
    };

    const handleAddSalary = async () => {
        if (salary.minAmount > 0 && salary.maxAmount > salary.minAmount) {
            setSalary({currency: "NGN", minAmount: 0, maxAmount: 0});
            setPreference({
                applicantId: Number(applicant?.id) || 0, ...preferences,
                salaryRange: [...preferences?.salaryRange as SalaryRange[], salary],
            });
        }
    };

    const removeSalary = async (index: number) => {
        // setSalaryExpectations((prev) => prev.filter((_, i) => i !== index));
        setPreference({
            applicantId: Number(applicant?.id) || 0, ...preferences,
            salaryRange: preferences?.salaryRange?.filter((_, i) => i !== index),
        });
    };

    const removeRole = async (index: number) => {
        setPreference({
            applicantId: Number(applicant?.id) || 0, ...preferences,
            roles: preferences?.roles?.filter((_, i) => i !== index),
        });
    };

    const removeJobType = async (index: number) => {
        setPreference({
            applicantId: Number(applicant?.id) || 0, ...preferences,
            jobTypes: preferences?.jobTypes?.filter((_, i) => i !== index),
        });
    };

    const removeLocation = async (index: number) => {
        setPreference({
            applicantId: Number(applicant?.id) || 0, ...preferences,
            locations: preferences?.locations?.filter((_, i) => i !== index),
        });
    };
    const handleToggleEdit = () => {
        toggleEdit();
    };
    const handleUpdateExperience = async () => {
        const updatedExperience = await updatePreference(preferences as JobPreference);
        if (updatedExperience) {
            setPreference({
                roles: updatedExperience.roles,
                jobTypes: updatedExperience.jobTypes,
                locations: updatedExperience.locations,
                salaryRange: updatedExperience.salaryRange,
                applicantId: Number(applicant?.id) || 0,
            })
            toggleEdit();
        }
    }

    return (<section id="job-preferences" className="relative pt-5 border-t-[2px] border-t-[#E6E6E6] space-y-3">
            <div
                className="absolute top-2 right-1 flex justify-evenly items-center text-xs gap-x-2 z-10">
                <button type="button" onClick={handleToggleEdit}
                        className="bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1">Edit
                </button>
                <button type="button"
                        onClick={handleUpdateExperience}
                        className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1`}>Save
                </button>
            </div>
            <div className="w-full bg-white rounded-lg mx-auto space-y-3">
                <h2 className="text-2xl font-bold font-lato text-gray-800">Job Preferences</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Preferred Job Categories */}
                    <div>
                        <label className="block text-lg font-lato text-gray-700 mb-2">
                            Preferred Job Roles
                        </label>
                        <div className="border-[1px]  w-full border-[#E6E6E6] rounded-[16px] bg-white p-4">
                            <select
                                className="w-full p-2 border border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA]"
                                value=""
                                disabled={!isEditable}
                                onChange={(e) => {
                                    handleRoleSelect(e.target.value).then(() => {
                                        e.target.value = "";
                                    });

                                }}
                            >
                                <option value="Role" disabled>
                                </option>
                                {categoryOptions.map((category) => (<option key={category} value={category}>
                                        {category}
                                    </option>))}
                            </select>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {preferences?.roles?.map((category, index) => (<div
                                        key={index}
                                        className="w-[168px] h-[38px] bg-[#56E5A1] text-white text-sm font-medium flex items-center justify-between px-4 rounded-[10px]"
                                    >
                                        <span>{category}</span>
                                        <button
                                            type="button"
                                            disabled={!isEditable}
                                            onClick={() => removeRole(index)}
                                            className="text-white font-bold text-lg"
                                        >
                                            &times;
                                        </button>
                                    </div>))}
                            </div>
                        </div>
                    </div>
                    {/*Preferred location selector*/}
                    <PreferredLocationSelector isEditable={isEditable} preferences={preferences as JobPreference}
                                               cityOptions={cityOptions}
                                               handleLocationSelect={handleLocationSelect}
                                               removeLocation={removeLocation} countryOptions={countryOptions}/>

                    {/* Preferred Job Type */}
                    <div>
                        <label className="block text-lg font-lato text-gray-700">
                            Preferred Job Type
                        </label>
                        <div className="border border-gray-300 border-[#E6E6E6] w-full rounded-[16px] bg-white p-4">
                            <select
                                className="w-full p-2 border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA]"
                                value=""
                                disabled={!isEditable}
                                onChange={(e) => {
                                    handleJobTypeSelect(e.target.value);
                                    e.target.value = ""; // Reset to keep the placeholder visible
                                }}
                            >
                                <option value="Job type" disabled>

                                </option>
                                {jobTypeOptions.map((type) => (<option key={type} value={type}>
                                        {type}
                                    </option>))}
                            </select>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {preferences?.jobTypes?.map((type, index) => (<div
                                        key={index}
                                        className="w-[168px] h-[38px] bg-[#56E5A1] text-white text-sm font-medium flex items-center justify-between px-4 rounded-[10px]"
                                    >
                                        <span>{type}</span>
                                        <button
                                            type="button"
                                            disabled={!isEditable}
                                            onClick={() => removeJobType(index)}
                                            className="text-white font-bold text-lg"
                                        >
                                            &times;
                                        </button>
                                    </div>))}
                            </div>
                        </div>
                    </div>

                    {/* Preferred Salary Expectation */}
                    <div>
                        <label className="flex flex-col text-lg font-medium text-gray-700 mb-2">
                            Preferred Salary Expectation
                        </label>
                        <div
                            className="flex flex-row justify-evenly w-full h-[55px] border-[1px] border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA] p-0">
                            <select
                                className="h-full rounded-l-[10px] w-[20%] md:w-[20%] pl-3 text-xs md:text-sm"
                                value={salary.currency}
                                onChange={(e) => handleSalaryChange("currency", e.target.value)}
                            >
                                <option>NGN</option>
                                <option>USD</option>
                                <option>EUR</option>
                                <option>GBP</option>
                            </select>
                            <input
                                placeholder="From"
                                className="w-[30%] md:w-[35%] px-4"
                                type="number"
                                min="10"
                                value={salary.minAmount || ""}
                                onChange={(e) => handleSalaryChange("minAmount", e.target.value)}
                            />
                            <input
                                placeholder="To"
                                className="w-[30%] md:w-[35%] px-4"
                                type="number"
                                min="10"
                                value={salary.maxAmount || ""}
                                onChange={(e) => handleSalaryChange("maxAmount", e.target.value)}
                            />
                            <button type="button"
                                    disabled={!isEditable}
                                    className="w-[20%] px-4 bg-[#E6E6E6] text-xs md:text-sm text-purple-950 font-bold text-center"
                                    onClick={handleAddSalary}>
                                ADD
                            </button>
                        </div>

                        {/* Display Selected Salaries */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {preferences?.salaryRange?.map((salary, index) => (<div key={index}
                                                                                    className="w-[250px] h-[38px] bg-[#56E5A1] text-white text-sm font-medium flex items-center justify-between px-4 rounded-[10px]">
                <span>
                    {salary.currency} {salary.minAmount} - {salary.maxAmount}
                </span>
                                    <button disabled={!isEditable} type="button" onClick={() => removeSalary(index)}
                                            className="text-white font-bold text-lg">
                                        &times;
                                    </button>
                                </div>))}
                        </div>
                    </div>

                </div>
            </div>
        </section>);
};

export default JobPreferencesForm;
