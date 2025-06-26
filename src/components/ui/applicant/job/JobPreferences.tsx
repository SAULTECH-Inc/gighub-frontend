import React, { useEffect, useState } from "react";
import PreferredLocationSelector from "../profile/PreferedLocationSelector.tsx";
import { JobPreference, Location, SalaryRange } from "../../../../utils/types";
import { useAuth } from "../../../../store/useAuth.ts";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import { PreferredJobRole } from "./PreferredJobRole.tsx";
import { PreferredJobType } from "./PreferredJobType.tsx";

const JobPreferencesForm: React.FC = () => {
  const { applicant } = useAuth();
  const { preferences, fetchPreferences, setPreference, updatePreference } =
    useApplicantJobProfile();
  const { isEditable, toggleEdit } = useSectionEditable("job-preference");

  const [salary, setSalary] = useState<SalaryRange>({
    currency: "NGN",
    minAmount: 0,
    maxAmount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchPreferences();
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
          roles: [],
          jobTypes: [],
          locations: [],
          salaryRange: [],
          applicantId: Number(applicant?.id) || 0,
        });
      }
    };

    if (applicant?.id) {
      fetchData().then((r) => r);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicant?.id]);

  const handleLocationSelect = async (country: string, city: string) => {
    if (country && city) {
      const locationExists = preferences?.locations?.some(
        (loc) => loc.country === country && loc.city === city,
      );
      if (!locationExists) {
        setPreference({
          applicantId: Number(applicant?.id) || 0,
          ...preferences,
          locations: [
            ...(preferences?.locations as Location[]),
            { country, city },
          ],
        });
      }
    }
  };

  const handleSalaryChange = (field: keyof typeof salary, value: string) => {
    setSalary((prev) => ({
      ...prev,
      [field]: field === "currency" ? value : Number(value),
    }));
  };

  const handleAddSalary = async () => {
    if (salary.minAmount > 0 && salary.maxAmount > salary.minAmount) {
      setSalary({ currency: "NGN", minAmount: 0, maxAmount: 0 });
      setPreference({
        applicantId: Number(applicant?.id) || 0,
        ...preferences,
        salaryRange: [...(preferences?.salaryRange as SalaryRange[]), salary],
      });
    }
  };

  const removeSalary = async (index: number) => {
    // setSalaryExpectations((prev) => prev.filter((_, i) => i !== index));
    setPreference({
      applicantId: Number(applicant?.id) || 0,
      ...preferences,
      salaryRange: preferences?.salaryRange?.filter((_, i) => i !== index),
    });
  };

  const removeLocation = async (index: number) => {
    setPreference({
      applicantId: Number(applicant?.id) || 0,
      ...preferences,
      locations: preferences?.locations?.filter((_, i) => i !== index),
    });
  };
  const handleToggleEdit = () => {
    toggleEdit();
  };
  const handleUpdateExperience = async () => {
    const updatedExperience = await updatePreference(
      preferences as JobPreference,
    );
    if (updatedExperience) {
      setPreference({
        roles: updatedExperience.roles,
        jobTypes: updatedExperience.jobTypes,
        locations: updatedExperience.locations,
        salaryRange: updatedExperience.salaryRange,
        applicantId: Number(applicant?.id) || 0,
      });
      toggleEdit();
    }
  };

  return (
    <section
      id="job-preferences"
      className="relative space-y-3 border-t-[2px] border-t-[#E6E6E6] pt-5"
    >
      <div className="absolute top-2 right-1 z-10 flex items-center justify-evenly gap-x-2 text-xs">
        <button
          type="button"
          onClick={handleToggleEdit}
          className="w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleUpdateExperience}
          className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1`}
        >
          Save
        </button>
      </div>
      <div className="mx-auto w-full space-y-3 rounded-lg bg-white">
        <h2 className="font-lato text-2xl font-bold text-gray-800">
          Job Preferences
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Preferred Job Categories */}
          <PreferredJobRole />

          {/*Preferred location selector*/}
          <PreferredLocationSelector
            isEditable={isEditable}
            preferences={preferences as JobPreference}
            handleLocationSelect={handleLocationSelect}
            removeLocation={removeLocation}
          />

          {/* Preferred Job Type */}
          <PreferredJobType />

          {/* Preferred Salary Expectation */}
          <div>
            <label className="mb-2 flex flex-col text-lg font-medium text-gray-700">
              Preferred Salary Expectation
            </label>
            <div className="flex h-[55px] w-full flex-row justify-evenly rounded-[10px] border-[1px] border-[#E6E6E6] bg-[#F7F8FA] p-0">
              <select
                className="h-full w-[20%] rounded-l-[10px] text-xs md:w-[20%] md:text-sm"
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
                className="w-[30%] px-4 md:w-[35%]"
                type="number"
                min="10"
                value={salary.minAmount || ""}
                onChange={(e) =>
                  handleSalaryChange("minAmount", e.target.value)
                }
              />
              <input
                placeholder="To"
                className="w-[30%] px-4 md:w-[35%]"
                type="number"
                min="10"
                value={salary.maxAmount || ""}
                onChange={(e) =>
                  handleSalaryChange("maxAmount", e.target.value)
                }
              />
              <button
                type="button"
                disabled={!isEditable}
                className="w-[20%] rounded-tr-[10px] rounded-br-[10px] bg-[#E6E6E6] px-4 text-center text-xs font-bold text-purple-950 md:text-sm"
                onClick={handleAddSalary}
              >
                ADD
              </button>
            </div>

            {/* Display Selected Salaries */}
            <div className="mt-4 flex flex-wrap gap-2">
              {preferences?.salaryRange?.map((salary, index) => (
                <div
                  key={index}
                  className="flex h-[38px] w-[250px] items-center justify-between rounded-[10px] bg-[#56E5A1] px-4 text-sm font-medium text-white"
                >
                  <span>
                    {salary.currency} {salary.minAmount} - {salary.maxAmount}
                  </span>
                  <button
                    disabled={!isEditable}
                    type="button"
                    onClick={() => removeSalary(index)}
                    className="text-lg font-bold text-white"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobPreferencesForm;
