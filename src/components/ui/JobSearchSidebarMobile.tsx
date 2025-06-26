import { forwardRef } from "react";
import CustomRadioButton from "../common/CustomRadioButton.tsx";
import CustomCheckbox from "../common/CustomCheckbox.tsx";
import SalaryRangeSelector from "../common/SalaryRangeSelector.tsx";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  UseJobSearchSettings,
  useJobSearchSettings,
} from "../../store/useJobSearchSettings.ts";
import { currencies } from "../../utils/Countries.ts";
import {
  DEFAULT_MAX,
  DEFAULT_MIN,
  employmentTypeMap,
  employmentTypeOptions,
} from "../../utils/constants.ts";
import { EmploymentType } from "../../utils/employmentTypes.ts";

interface Props {
  toggleSidebar: () => void;
  isOpened: boolean;
  jobType: string[];
  experience: string[];
  location: string;
  sortBy: string;
  employmentType?: EmploymentType;
}
const JobSearchSidebarMobile = forwardRef<HTMLDivElement, Props>(
  (
    {
      toggleSidebar,
      isOpened = false,
      jobType,
      experience,
      location,
      sortBy,
      employmentType,
    },
    ref,
  ) => {
    const { settings, setSettings, updateSettings, resetSettings } =
      useJobSearchSettings();
    const salaryRange = settings?.salaryRange || {
      min: 0,
      max: 0,
      currency: "₦",
      frequency: "month",
    };

    return (
      <div
        ref={ref}
        className={`bg-opacity-50 fixed inset-0 z-50 items-start justify-start overflow-y-auto bg-black ${isOpened ? "flex" : "hidden"}`}
      >
        <div className="relative grid min-h-screen w-[300px] grid-cols-1 overflow-y-auto border-2 border-[#F5F5F5] bg-white px-4 py-4">
          {/* Filter Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
              <IoMdArrowRoundBack onClick={() => toggleSidebar()} />
              <p>Filter</p>
            </div>
            <p
              className="cursor-pointer text-[#6438C2]"
              onClick={resetSettings}
            >
              Reset
            </p>
          </div>
          <hr className="w-full border-[#E6E6E6]" />

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
          <hr className="my-4 w-full border-[#E6E6E6]" />

          {/* Job Type */}
          <div className="flex flex-col gap-y-3">
            <h3>Job Type</h3>

            <div>
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
                  size={19}
                  borderColor="#D9D9D9"
                  checkColor="#6E4AED"
                />
              ))}
            </div>
          </div>
          <hr className="my-4 w-full border-[#E6E6E6]" />

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
                    currency: v.currency, // this is now the symbol
                  },
                });
              }
            }}
          />

          <hr className="my-4 w-full border-[#E6E6E6]" />

          {/* Experience */}
          <div className="flex flex-col gap-y-3">
            <h3>Experience</h3>
            <div>
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
                    size={19}
                    borderColor="#D9D9D9"
                    checkColor="#6E4AED"
                  />
                ),
              )}
            </div>
          </div>
          <hr className="my-4 w-full border-[#E6E6E6]" />

          {/* Employment Type */}
          <div className="flex flex-col gap-y-3">
            <h3>Employment Type</h3>
            <div className="flex flex-col gap-y-2">
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
                  size={19}
                  color="#6E4AED"
                />
              ))}
            </div>
          </div>
          <hr className="w-full border-[#E6E6E6]" />

          {/* Location */}
          <div className="flex flex-col gap-y-3">
            <h3>Location</h3>
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  location: e.target.value,
                } as UseJobSearchSettings);
              }}
              placeholder="Enter location"
              className="rounded-lg border border-[#E6E6E6] px-3 py-2 focus:ring-2 focus:ring-purple-300 focus:outline-none"
            />
          </div>
        </div>
      </div>
    );
  },
);

export default JobSearchSidebarMobile;
