import CustomRadioButton from "../common/CustomRadioButton.tsx";
import CustomCheckbox from "../common/CustomCheckbox.tsx";
import SalaryRangeSelector from "../common/SalaryRangeSelector.tsx";
import {
  UseJobSearchSettings,
  useJobSearchSettings,
} from "../../store/useJobSearchSettings.ts";
import {
  currencies,
  DEFAULT_MAX,
  DEFAULT_MIN,
  employmentTypeMap,
  employmentTypeOptions,
} from "../../utils/constants.ts";
import { EmploymentType } from "../../utils/enums.ts";
import { RotateCcw } from "lucide-react";

interface Props {
  jobType: string[];
  experience: string[];
  location: string;
  sortBy: string;
  employmentType?: EmploymentType;
}

const JobSearchSidebar: React.FC<Props> = ({
                                             jobType,
                                             experience,
                                             location,
                                             sortBy,
                                             employmentType,
                                           }) => {
  const { settings, setSettings, updateSettings, resetSettings } =
    useJobSearchSettings();
  const salaryRange = settings?.salaryRange || {
    min: 0,
    max: 0,
    currency: "₦",
    frequency: "month",
  };

  return (
    <div className="space-y-6">
      {/* Reset Button */}
      <div className="flex items-center justify-end">
        <button
          onClick={resetSettings}
          className="flex items-center gap-2 text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
        >
          <RotateCcw className="h-4 w-4" />
          Reset All
        </button>
      </div>

      {/* Sort By */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Sort by</h3>
        <div className="space-y-2">
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
              size={18}
              color="#6E4AED"
            />
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Job Type */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Job Type</h3>
        <div className="space-y-2">
          {[
            "Full Time",
            "Freelance",
            "Part Time",
            "Contract",
            "Internship",
            "Volunteer",
            "Consultant",
            "Temporary",
            "Apprenticeship",
          ].map((option) => (
            <CustomCheckbox
              key={option}
              checked={jobType.includes(option)}
              onChange={() => {
                updateSettings({
                  jobType: jobType.includes(option)
                    ? jobType.filter((type) => type !== option)
                    : [...jobType, option],
                });
              }}
              label={option}
              size={18}
              borderColor="#D9D9D9"
              checkColor="#6E4AED"
            />
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Salary Range */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Salary Range</h3>
        <SalaryRangeSelector
          baseMin={DEFAULT_MIN}
          baseMax={DEFAULT_MAX}
          currency={
            currencies.some((c) => c.label === salaryRange?.currency)
              ? salaryRange?.currency
              : "NGN"
          }
          frequency={salaryRange?.frequency || "month"}
          onChange={(v) => {
            if (
              v.currency !== salaryRange?.currency ||
              v.frequency !== salaryRange?.frequency ||
              v.min !== salaryRange?.min ||
              v.max !== salaryRange?.max
            ) {
              updateSettings({
                salaryRange: {
                  ...v,
                  currency: v.currency,
                },
              });
            }
          }}
        />
      </div>

      <hr className="border-gray-200" />

      {/* Experience */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Experience Level</h3>
        <div className="space-y-2">
          {["Under 1 Year", "1 - 2 Years", "2 - 5 Years", "5+ Years"].map(
            (option) => (
              <CustomCheckbox
                key={option}
                checked={experience.includes(option)}
                onChange={() => {
                  updateSettings({
                    experienceLevel: experience?.includes(option)
                      ? experience.filter((type) => type !== option)
                      : [...experience, option],
                  });
                }}
                label={option}
                size={18}
                borderColor="#D9D9D9"
                checkColor="#6E4AED"
              />
            ),
          )}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Employment Type */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Work Location</h3>
        <div className="space-y-2">
          {["Onsite", "Hybrid", "Remote"].map((option) => (
            <CustomRadioButton
              key={option}
              name="employmentType"
              value={option}
              checked={
                employmentTypeOptions[employmentType as EmploymentType] ===
                option
              }
              onChange={() => {
                setSettings({
                  ...settings,
                  employmentType: employmentTypeMap[option],
                } as UseJobSearchSettings);
              }}
              label={option}
              size={18}
              color="#6E4AED"
            />
          ))}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Location */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Location</h3>
        <input
          type="text"
          value={location}
          onChange={(e) => {
            setSettings({
              ...settings,
              location: e.target.value,
            } as UseJobSearchSettings);
          }}
          placeholder="Enter city or location"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default JobSearchSidebar;