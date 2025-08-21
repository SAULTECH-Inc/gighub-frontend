import React, { useEffect, useState } from "react";
import PreferredLocationSelector from "../profile/PreferedLocationSelector.tsx";
import {
  CURRENCIES,
  getCurrencyBySymbol,
  JobPreference,
  Location,
  SalaryRange,
} from "../../../../utils/types";
import { useAuth } from "../../../../store/useAuth.ts";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import { PreferredJobRole } from "./PreferredJobRole.tsx";
import { PreferredJobType } from "./PreferredJobType.tsx";
import {
  CheckCircle2,
  DollarSign,
  Edit3,
  Plus,
  Save,
  Target,
  X,
} from "lucide-react";

// Frequency options for salary ranges
const SALARY_FREQUENCIES = [
  { value: "per year", label: "Per Year" },
  { value: "per month", label: "Per Month" },
  { value: "per week", label: "Per Week" },
  { value: "per day", label: "Per Day" },
  { value: "per hour", label: "Per Hour" },
];

const JobPreferencesForm: React.FC = () => {
  const { applicant } = useAuth();
  const { preferences, fetchPreferences, setPreference, updatePreference } =
    useApplicantJobProfile();
  const { isEditable, toggleEdit } = useSectionEditable("job-preference");

  const [salary, setSalary] = useState<SalaryRange>({
    currency: "NGN",
    minAmount: 0,
    maxAmount: 0,
    frequency: "per year", // Add default frequency
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
      [field]: field === "currency" || field === "frequency" ? value : Number(value),
    }));
  };

  const handleAddSalary = async () => {
    if (salary.minAmount > 0 && salary.maxAmount > salary.minAmount) {
      setSalary({
        currency: "₦",
        minAmount: 0,
        maxAmount: 0,
        frequency: "per year"
      });
      setPreference({
        applicantId: Number(applicant?.id) || 0,
        ...preferences,
        salaryRange: [...(preferences?.salaryRange as SalaryRange[]), salary],
      });
    }
  };

  const removeSalary = async (index: number) => {
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
    <section id="job-preferences" className="relative">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-red-100 p-2">
            <Target className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Job Preferences
            </h3>
            <p className="text-sm text-gray-500">
              Set your job search criteria and preferences
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleEdit}
            type="button"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isEditable
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            <Edit3 className="h-4 w-4" />
            {isEditable ? "Cancel" : "Edit"}
          </button>

          {isEditable && (
            <button
              onClick={handleUpdateExperience}
              type="button"
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="rounded-xl bg-gray-50 p-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Preferred Job Categories */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              Job Roles
            </h4>
            <PreferredJobRole />
          </div>

          {/* Preferred Location Selector */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Preferred Locations
            </h4>
            <PreferredLocationSelector
              isEditable={isEditable}
              preferences={preferences as JobPreference}
              handleLocationSelect={handleLocationSelect}
              removeLocation={removeLocation}
            />
          </div>

          {/* Preferred Job Type */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              Job Types
            </h4>
            <PreferredJobType />
          </div>

          {/* Preferred Salary Expectation */}
          <div className="space-y-4">
            {/* Salary Input Form */}
            {isEditable && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h5 className="mb-3 text-sm font-medium text-gray-700">
                  Add Salary Range
                </h5>
                <div className="space-y-4">
                  {/* Currency and Frequency Row */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {/* Currency Selector */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Currency
                      </label>
                      <select
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                        value={salary.currency}
                        onChange={(e) =>
                          handleSalaryChange("currency", e.target.value)
                        }
                        disabled={!isEditable}
                      >
                        {CURRENCIES.map((currency) => (
                          <option key={currency.code} value={currency.symbol}>
                            {currency.symbol} - {currency.name} ({currency.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Frequency Selector */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Frequency
                      </label>
                      <select
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                        value={salary.frequency}
                        onChange={(e) =>
                          handleSalaryChange("frequency", e.target.value)
                        }
                        disabled={!isEditable}
                      >
                        {SALARY_FREQUENCIES.map((freq) => (
                          <option key={freq.value} value={freq.value}>
                            {freq.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Salary Range Inputs */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {/* Minimum Amount */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Minimum Amount
                      </label>
                      <div className="relative">
                        <input
                          placeholder="0"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                          type="number"
                          min="0"
                          step="1000"
                          value={salary.minAmount || ""}
                          onChange={(e) =>
                            handleSalaryChange("minAmount", e.target.value)
                          }
                          disabled={!isEditable}
                        />
                        {salary.minAmount > 0 && (
                          <div className="absolute top-2 right-3 text-xs text-gray-400">
                            {salary.currency}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Maximum Amount */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Maximum Amount
                      </label>
                      <div className="relative">
                        <input
                          placeholder="0"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                          type="number"
                          min="0"
                          step="1000"
                          value={salary.maxAmount || ""}
                          onChange={(e) =>
                            handleSalaryChange("maxAmount", e.target.value)
                          }
                          disabled={!isEditable}
                        />
                        {salary.maxAmount > 0 && (
                          <div className="absolute top-2 right-3 text-xs text-gray-400">
                            {salary.currency}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add Button - Full width on mobile, right-aligned on larger screens */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={
                        !isEditable ||
                        !salary.minAmount ||
                        !salary.maxAmount ||
                        salary.maxAmount <= salary.minAmount
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
                      onClick={handleAddSalary}
                      title="Add salary range"
                    >
                      <Plus className="h-4 w-4" />
                      Add Range
                    </button>
                  </div>
                </div>

                {/* Validation Message */}
                {salary.minAmount &&
                  salary.maxAmount &&
                  salary.maxAmount <= salary.minAmount && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                      <span className="h-1 w-1 rounded-full bg-red-600"></span>
                      Maximum amount must be greater than minimum amount
                    </div>
                  )}
              </div>
            )}

            {/* Display Selected Salary Ranges */}
            {preferences?.salaryRange && preferences.salaryRange.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium text-gray-700">
                    Salary Expectations
                  </h5>
                  <span className="text-xs text-gray-500">
                    {preferences.salaryRange.length} range
                    {preferences.salaryRange.length !== 1 ? "s" : ""} added
                  </span>
                </div>

                <div className="space-y-2">
                  {preferences.salaryRange.map((salaryItem, index) => {
                    const currency = getCurrencyBySymbol(salaryItem.currency);
                    return (
                      <div
                        key={index}
                        className="group flex items-center justify-between rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 p-4 transition-all duration-200 hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-200">
                            <DollarSign className="h-4 w-4 text-orange-700" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-orange-900">
                              {salaryItem.currency}{" "}
                              {salaryItem.minAmount?.toLocaleString()} -{" "}
                              {salaryItem.currency}{" "}
                              {salaryItem.maxAmount?.toLocaleString()}
                            </div>
                            <div className="text-xs text-orange-600">
                              {salaryItem.frequency || "per year"} • {currency
                              ? `${currency.name} (${currency.code})`
                              : "Salary expectation"}
                            </div>
                          </div>
                        </div>

                        <button
                          disabled={!isEditable}
                          type="button"
                          onClick={() => removeSalary(index)}
                          className="rounded-lg p-2 text-orange-600 opacity-70 transition-all duration-200 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Remove salary range"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!preferences?.salaryRange ||
                preferences.salaryRange.length === 0) &&
              !isEditable && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 py-8 text-center text-gray-500">
                  <DollarSign className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <p className="text-sm font-medium">
                    No salary expectations set
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Add your salary expectations to help employers match your
                    requirements
                  </p>
                </div>
              )}

            {/* Helper Information */}
            {isEditable && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-200">
                    <span className="text-xs font-bold text-amber-700">💡</span>
                  </div>
                  <div className="space-y-2">
                    <h6 className="text-sm font-medium text-amber-800">
                      Salary Range Tips:
                    </h6>
                    <ul className="space-y-1 text-xs text-amber-700">
                      <li>
                        • Research market rates for your role and experience
                        level
                      </li>
                      <li>
                        • Consider the total compensation package, not just base
                        salary
                      </li>
                      <li>
                        • You can add multiple ranges for different currencies,
                        frequencies, or job levels
                      </li>
                      <li>
                        • Be realistic but don't undervalue your skills and
                        experience
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        {isEditable && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-blue-800">
              💡 Tips for setting job preferences:
            </h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Select job roles that match your skills and interests</li>
              <li>• Choose locations where you're willing to work</li>
              <li>
                • Be realistic with salary expectations based on market rates
              </li>
              <li>• Consider different job types (remote, hybrid, on-site)</li>
              <li>• Choose appropriate salary frequency (yearly, monthly, hourly, etc.)</li>
            </ul>
          </div>
        )}

        {/* Status Indicator */}
        {!isEditable && (
          <div className="mt-6 flex items-center gap-2 border-t border-gray-200 pt-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              Job preferences saved successfully
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobPreferencesForm;