import { Teams } from "../../../../assets/icons";
import { Referrer1 } from "../../../../assets/images";
import {
  JobFormData,
  useJobFormStore,
} from "../../../../store/useJobFormStore";
import React, { useEffect, useState } from "react";
import DatePicker from "../../../common/DatePicker";
import SearchableSelectWithAdd from "../../../common/SearchableSelectWithAdd";
import { JobLocations } from "../../../../utils/JobType";
import { EmploymentType } from "../../../../utils/DepartmentType";
import { JobType } from "../../../../utils/JobType";
import CustomSelect from "../../../common/CustomSelect";
import CustomRadioButton from "../../../common/CustomRadioButton";
import { currencies } from "../../../../utils/Countries";
import { FaAsterisk } from "react-icons/fa";
import { jobLevels, Option } from "../../../../utils/types";
import { useDepartments } from "../../../../hooks/useDepartments.ts";

const CreateJobStepTwo: React.FC = () => {
  const departments = useDepartments();
  const { job, nextStep, prevStep, setJobData } = useJobFormStore();
  const [selectedDate, setSelectedDate] = useState<string>(job.endDate || "");
  const [error, setError] = useState<string>("");
  const [title, setTitle] = useState(job.title || "");
  const [selectedOption, setSelectedOption] = useState("company");
  const [selectOption, setSelectOption] = useState("option1");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Job title is required.";
    }

    if (!selectedDate) {
      newErrors.endDate = "Application end date is required.";
    }

    if (!job.location) {
      newErrors.location = "Location is required.";
    }

    if (!job.experienceYears || job.experienceYears <= 0) {
      newErrors.experienceYears = "Experience must be greater than 0.";
    }

    if (!job.level) {
      newErrors.level = "Please select a job level.";
    }

    if (!job.jobType) {
      newErrors.jobType = "Please select a job type.";
    }

    if (!job.employmentType) {
      newErrors.employmentType = "Please select an employment type.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectedOption = (type: "job" | "company") => {
    setSelectedOption(type);
  };

  useEffect(() => {
    if (job.endDate !== selectedDate) {
      setSelectedDate(job.endDate);
    }
  }, [job.endDate, selectedDate]);

  useEffect(() => {
    setJobData({
      ...job,
      title: title,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const handleDateChange = (value: Date) => {
    setSelectedDate(value.toLocaleDateString()); // Fix here

    setJobData({
      ...job,
      endDate: value.toISOString(), // You may prefer ISO format for consistency/storage
    });

    setErrors({
      ...errors,
      endDate: value ? "" : "Please select end date.",
    });
  };

  const handleDepartmentChange = (option: { label: string; value: string }) => {
    setJobData({
      ...job,
      department: option.value,
    });
  };

  const handleLocationChange = (selectedOption: Option) => {
    setJobData({ ...job, location: selectedOption.value });
    setErrors({
      ...errors,
      location: selectedOption.value ? "" : "Please select a location.",
    });
  };

  const handleAddOption = (newOption: Option) => {
    setJobData({ ...job, location: newOption.value });
  };

  const handleSelectOptionChange = (value: string) => {
    setSelectOption(value);
    setJobData({
      ...job,
      ...(value === "option1"
        ? { minimumAmount: 0, maximumAmount: 0 }
        : { maximumAmount: 0 }),
    });
  };

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof JobFormData,
  ) => {
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) value = 0;

    const updatedJob: JobFormData = { ...job, [field]: value };

    if (
      field === "minimumAmount" &&
      updatedJob.minimumAmount > updatedJob.maximumAmount &&
      updatedJob.maximumAmount !== 0
    ) {
      setError("Maximum amount cannot be less than minimum amount.");
      setJobData(updatedJob);
    } else if (
      field === "maximumAmount" &&
      updatedJob.minimumAmount > updatedJob.maximumAmount
    ) {
      setError("Maximum amount cannot be less than minimum amount.");
      setJobData(updatedJob);
    } else {
      setError("");
      setJobData(updatedJob);
    }
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobData({
      ...job,
      level: e.target.value,
    });
    setErrors({
      ...errors,
      level: e.target.value ? "" : "Please select a level.",
    });
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobData({
      ...job,
      frequency: e.target.value,
    });
  };

  const handleCurrencySelect = (option: { label: string; value: string }) => {
    setJobData({
      ...job,
      currency: option.value,
    });
  };

  const handleJobSelect = (option: { label: string; value: string }) => {
    setJobData({
      ...job,
      jobType: option.value,
    });
    setErrors({
      ...errors,
      jobType: option.value ? "" : "Please select a job type.",
    });
  };

  const handleEmploymentSelect = (option: { label: string; value: string }) => {
    setJobData({
      ...job,
      employmentType: option.value,
    });
    setErrors({
      ...errors,
      employmentType: option.value ? "" : "Please select an employment type.",
    });
  };

  const handleNextStep = () => {
    if (validateFields()) {
      nextStep();
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex h-full min-h-[500px] w-[96%] max-w-[900px] flex-col items-center rounded-[10px] bg-white px-2 py-2">
        <div className="flex w-full flex-col gap-2 sm:w-[95%]">
          <div className="my-3 flex justify-between border-b-[1px] text-gray-600">
            <div
              onClick={() => handleSelectedOption("company")}
              className={`flex-1 cursor-pointer text-center text-sm ${
                selectedOption === "company"
                  ? "border-b-4 border-[#6438C2] text-[#6438C2]"
                  : "text-gray-600"
              }`}
            >
              Company
            </div>
            <div
              onClick={() => handleSelectedOption("job")}
              className={`flex-1 cursor-pointer text-center text-sm ${
                selectedOption === "job"
                  ? "border-b-4 border-[#6438C2] text-[#6438C2]"
                  : "text-gray-600"
              }`}
            >
              Job
            </div>
          </div>
        </div>
        {selectedOption === "company" && (
          <div className="flex w-full flex-col gap-2 sm:w-[95%]">
            {/*First Row*/}
            <div className="flex flex-col gap-x-3 md:flex-row md:items-center md:justify-evenly">
              <div className="flex w-full flex-col">
                <label className="text-sm font-medium text-[#000000] sm:text-base">
                  Department
                </label>
                <SearchableSelectWithAdd
                  placeholder={job?.department || "Choose a Department..."}
                  options={departments}
                  className="w-full rounded-[10px] border border-[#E6E6E6] p-2 text-left text-sm sm:text-base"
                  onChange={handleDepartmentChange}
                />
              </div>
              <div className="flex w-full flex-col">
                <label className="text-sm text-[#000000] sm:text-base">
                  Hiring Manager
                </label>
                <div className="flex h-10 w-full gap-3 rounded-[10px] border border-[#E6E6E6] px-4">
                  <img src={Referrer1} alt="" width={27} />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={job?.hiringManager}
                    onChange={(e) => {
                      setJobData({
                        ...job,
                        hiringManager: e.target.value,
                      });
                    }}
                    className="w-full border-none text-sm outline-none focus:border-none focus:ring-0 focus:outline-none sm:text-base"
                  />
                  <img src={Teams} alt="ArrowDown" />
                </div>
              </div>
            </div>
            {/*Second row*/}
            <div className="flex flex-col gap-x-3 md:flex-row md:items-center md:justify-evenly">
              <div className="flex w-full flex-col">
                <label className="text-sm text-[#000000] sm:text-base">
                  End Date
                </label>
                <div className="relative">
                  <DatePicker
                    required={true}
                    selectedDate={new Date(job.endDate)}
                    onDateChange={(date) => {
                      handleDateChange(date as Date);
                    }}
                    disabled={false}
                    className="h-10 w-full rounded-[10px] border border-[#E6E6E6] px-4 text-sm outline-none focus:border-[#E6E6E6] focus:ring-0 focus:outline-none sm:text-base"
                  />
                  {errors.endDate && (
                    <p className="text-xs text-red-500">{errors.endDate}</p>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-col">
                <label className="flex items-center gap-1 text-sm text-[#000000] sm:text-base">
                  Location <FaAsterisk className="w-2 fill-[#FA4E09]" />
                </label>

                <SearchableSelectWithAdd
                  placeholder={job.location || "Choose a Location..."}
                  className="h-10 w-full rounded-[10px] border border-[#E6E6E6] px-4 text-left text-sm sm:text-base"
                  options={JobLocations}
                  onChange={handleLocationChange}
                  onAddOption={handleAddOption}
                />
              </div>
            </div>
          </div>
        )}

        {selectedOption === "job" && (
          <div className="flex w-full flex-col gap-3 py-2 sm:w-[95%] sm:py-0">
            <div className="flex w-full flex-col justify-between gap-2 text-sm sm:flex-row sm:text-base">
              <div className="flex w-full flex-col gap-2">
                <div className="flex items-center gap-1 text-[#000000]">
                  Job Title <FaAsterisk className="w-2 fill-[#FA4E09]" />
                </div>

                <div className="flex h-10 rounded-[10px] border border-[#E6E6E6] px-4">
                  <input
                    type="text"
                    placeholder="Graphic Designer"
                    className="w-full border-none text-sm outline-none focus:border-none focus:ring-0 focus:outline-none sm:text-base"
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setJobData({
                        ...job,
                        title: e.target.value,
                      });
                      setErrors({
                        ...errors,
                        title: e.target.value.trim()
                          ? ""
                          : "Job title is required.",
                      });
                    }}
                    value={job.title}
                  />
                </div>
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title}</p>
                )}
              </div>
              <div className="flex w-full flex-col gap-2">
                <div className="flex items-center gap-1 text-[#000000]">
                  Experience in years/ Level
                  <FaAsterisk className="w-2 fill-[#FA4E09]" />
                </div>
                <div className="relative flex w-full overflow-hidden rounded-[10px] border border-[#E6E6E6]">
                  <div className="flex h-10 w-[60%] border-r border-[#E6E6E6]">
                    <input
                      type="number"
                      placeholder="Years"
                      className="no-arrows w-full border-none text-sm outline-none focus:border-none focus:ring-0 focus:outline-none sm:text-base"
                      onChange={(e) => {
                        handleNumberInputChange(e, "experienceYears");
                        setErrors({
                          ...errors,
                          experienceYears: e.target.value
                            ? ""
                            : "Please select year(s) of experience.",
                        });
                      }}
                      value={job.experienceYears || ""}
                    />
                  </div>
                  <select
                    className="h-full border-none text-sm outline-none focus:border-none focus:ring-0 sm:text-base"
                    value={job.level || ""}
                    onChange={handleLevelChange}
                  >
                    <option value="" disabled>
                      Select Level
                    </option>
                    {jobLevels.map((level, key) => (
                      <option key={key} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.experienceYears && (
                  <p className="text-xs text-red-500">
                    {errors.experienceYears}
                  </p>
                )}
                {errors.level && (
                  <p className="text-xs text-red-500">{errors.level}</p>
                )}
              </div>
            </div>
            <label className="w-full text-sm text-[#000000] sm:text-base">
              Salary Budget
            </label>
            <div className="flex w-full flex-col gap-1 sm:gap-4">
              <div className="flex w-full flex-wrap gap-2 border-[#E6E6E6] sm:gap-10">
                <CustomRadioButton
                  name="paymentOption"
                  value="option1"
                  checked={selectOption === "option1"}
                  onChange={() => handleSelectOptionChange("option1")}
                  label={window.innerWidth >= 400 ? "Exact Amount" : "Exact"}
                  size={16}
                  color="#6E4AED"
                />
                <CustomRadioButton
                  name="paymentOption"
                  value="option2"
                  checked={selectOption === "option2"}
                  onChange={() => handleSelectOptionChange("option2")}
                  label="Range"
                  size={16}
                  color="#6E4AED"
                />
                <CustomRadioButton
                  name="paymentOption"
                  value="option3"
                  checked={selectOption === "option3"}
                  onChange={() => {
                    handleSelectOptionChange("option3");
                    setJobData({
                      ...job,
                      maximumAmount: undefined,
                      minimumAmount: undefined,
                    });
                  }}
                  label="Prefer not to mention"
                  size={16}
                  color="#6E4AED"
                />
              </div>
              {(selectOption === "option1" || selectOption === "option2") && (
                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <div className="w-full">
                    {selectOption === "option1" && (
                      <div className="relative flex h-10 gap-3 rounded-[10px] border border-[#E6E6E6] px-4">
                        <span className="flex items-center text-sm sm:text-base">
                          {job.currency}
                        </span>
                        <input
                          type="number"
                          className="no-arrows w-full border-y-0 border-r-0 border-[#E6E6E6] text-sm outline-none focus:border-none focus:ring-0 focus:outline-none sm:border-1 sm:border-x-1 sm:text-base"
                          placeholder="Exact Amount"
                          value={job.maximumAmount || ""}
                          onChange={(e) => {
                            const value = e.target.value
                              ? parseInt(e.target.value, 10)
                              : 0;
                            setJobData({
                              ...job,
                              maximumAmount: value,
                              minimumAmount: 0,
                            });
                          }}
                        />
                        <select
                          className="hidden h-[full] w-full border-y-0 border-r-0 border-l-1 border-[#E6E6E6] text-sm outline-none focus:border-none focus:ring-0 sm:block"
                          value={job.frequency || ""}
                          onChange={handleFrequencyChange}
                        >
                          <option value="" disabled>
                            Select Frequency
                          </option>
                          <option value="per year">yearly</option>
                          <option value="per month">monthly</option>
                          <option value="per week">weekly</option>
                          <option value="per day">daily</option>
                          <option value="per hour">hourly</option>
                        </select>
                      </div>
                    )}
                    {selectOption === "option2" && (
                      <div className="flex w-full flex-col justify-between gap-2 sm:flex-row">
                        <div className="flex h-10 w-full items-center overflow-hidden rounded-[10px] border border-[#E6E6E6]">
                          <span className="p-1 text-[12px] text-gray-500 sm:text-sm">
                            {job.currency}
                          </span>
                          <input
                            type="number"
                            className="no-arrows w-full border-y-0 border-x-[#E6E6E6] text-sm outline-none focus:border-none focus:ring-0 focus:outline-none"
                            placeholder="Minimum"
                            value={job.minimumAmount || ""}
                            onChange={(e) =>
                              handleNumberInputChange(e, "minimumAmount")
                            }
                          />
                          <input
                            type="number"
                            className="no-arrows w-full border-y-0 border-r-0 border-l-0 text-sm outline-none focus:border-none focus:ring-0 focus:outline-none"
                            placeholder="Maximum"
                            value={job.maximumAmount || ""}
                            onChange={(e) =>
                              handleNumberInputChange(e, "maximumAmount")
                            }
                          />
                          <div className="border border-[#E6E6E6]">
                            <select
                              className="hidden h-full border-none outline-none focus:border-none focus:ring-0 sm:block"
                              value={job.frequency || ""}
                              onChange={handleFrequencyChange}
                            >
                              <option value="" disabled>
                                Select Frequency
                              </option>
                              <option value="per year">yearly</option>
                              <option value="per month">monthly</option>
                              <option value="per week">weekly</option>
                              <option value="per day">daily</option>
                              <option value="per hour">hourly</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex w-full gap-2 md:w-[50%]">
                    <select
                      className="h-full w-[50%] rounded-[10px] border border-[#E6E6E6] text-sm outline-none focus:border-none focus:ring-0 sm:hidden"
                      value={job.frequency || ""}
                      onChange={handleFrequencyChange}
                    >
                      <option value="" disabled>
                        Select Frequency
                      </option>
                      <option value="per year">yearly</option>
                      <option value="per month">monthly</option>
                      <option value="per week">weekly</option>
                      <option value="per day">daily</option>
                    </select>
                    <div className="w-[50%] sm:w-full">
                      <CustomSelect
                        placeholder={job.currency || "Choose currency..."}
                        options={currencies}
                        className="h-10 w-full overflow-hidden rounded-[10px] border border-[#E6E6E6] bg-[#F7F8FA] px-2 text-left text-sm md:text-[12px]"
                        onChange={handleCurrencySelect}
                      />
                    </div>
                  </div>
                </div>
              )}
              <p className="text-[10px] text-red-500">{error}</p>
            </div>
            <div className="flex w-full flex-wrap justify-between gap-2">
              <div className="flex w-full flex-col gap-2 sm:w-[48%]">
                <div className="flex items-center gap-1 text-[#000000]">
                  Job Type
                  <FaAsterisk className="w-2 fill-[#FA4E09]" />
                </div>
                <CustomSelect
                  placeholder={job.jobType || "Choose..."}
                  options={JobType}
                  className="h-10 w-full rounded-[10px] border border-[#E6E6E6] bg-[#F7F8FA] px-2 text-left text-sm"
                  onChange={handleJobSelect}
                />
                {errors.jobType && (
                  <p className="text-xs text-red-500">{errors.jobType}</p>
                )}
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-[48%]">
                <div className="flex items-center gap-1 text-[#000000]">
                  Employment Type
                  <FaAsterisk className="w-2 fill-[#FA4E09]" />
                </div>

                <CustomSelect
                  placeholder={job.employmentType || "Choose ..."}
                  options={EmploymentType}
                  className="h-10 w-full rounded-[10px] border border-[#E6E6E6] bg-[#F7F8FA] px-2 text-left text-sm"
                  onChange={handleEmploymentSelect}
                />
                {errors.employmentType && (
                  <p className="text-xs text-red-500">
                    {errors.employmentType}
                  </p>
                )}
              </div>

              <div className="flex w-full flex-col gap-2 sm:w-[48%]">
                <div className="flex items-center gap-1 text-[#000000]">
                  Priority
                  <FaAsterisk className="w-2 fill-[#FA4E09]" />
                </div>

                <CustomSelect
                  placeholder={job.priority || "Choose ..."}
                  options={[
                    {
                      label: "High",
                      value: "HIGH",
                    },
                    {
                      label: "Medium",
                      value: "MEDIUM",
                    },
                    {
                      label: "Low",
                      value: "LOW",
                    },
                  ]}
                  className="h-10 w-full rounded-[10px] border border-[#E6E6E6] bg-[#F7F8FA] px-2 text-left text-sm"
                  onChange={(option) => {
                    setJobData({
                      ...job,
                      priority: option.value,
                    });
                  }}
                />
                {errors.priority && (
                  <p className="text-xs text-red-500">{errors.priority}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mx-2 my-2 flex w-[96%] max-w-[900px] justify-end gap-6 text-sm">
        <button
          className="w-[35%] self-end rounded-[15px] border border-[#E6E6E6] bg-[#F7F7F7] py-[8px] sm:w-[29%]"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          className="w-[35%] rounded-[15px] bg-[#6438C2] py-[8px] text-white sm:w-[29%]"
          onClick={handleNextStep}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepTwo;
