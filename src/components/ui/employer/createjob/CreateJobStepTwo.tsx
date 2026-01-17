import { Teams } from "../../../../assets/icons";
import { Referrer1 } from "../../../../assets/images";
import {
  JobFormData,
  useJobFormStore,
} from "../../../../store/useJobFormStore";
import React, { useEffect, useState } from "react";
import DatePicker from "../../../common/DatePicker";
import SearchableSelectWithAdd from "../../../common/SearchableSelectWithAdd";
import CustomSelect from "../../../common/CustomSelect";
import CustomRadioButton from "../../../common/CustomRadioButton";
import { FaAsterisk } from "react-icons/fa";
import { jobLevels, Option } from "../../../../utils/types";
import { useDepartments } from "../../../../hooks/useDepartments.ts";
import {
  RiArrowRightLine,
  RiArrowLeftLine,
  RiBuilding2Line,
  RiBriefcase4Line,
  RiMapPinLine,
  RiCalendarLine,
  RiUserLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiTrophyLine,
} from "react-icons/ri";
import {
  currencies,
  employmentTypOptions,
  JobLocations,
  JobType,
} from "../../../../utils/constants.ts";

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
    setSelectedDate(value.toLocaleDateString());
    setJobData({
      ...job,
      endDate: value.toISOString(),
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
    <div className="flex w-full flex-col items-center p-3 sm:p-6">
      {/* Main Card */}
      <div className="w-full max-w-[880px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-4 sm:px-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Job Details
          </h2>

          {/* Modern Tab Navigation */}
          <div className="xs:flex-row xs:gap-0 flex flex-col gap-1 rounded-lg bg-white/80 p-1 backdrop-blur-sm">
            <button
              onClick={() => handleSelectedOption("company")}
              className={`flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-2.5 text-xs font-medium transition-all duration-200 sm:gap-2 sm:px-4 sm:text-sm ${
                selectedOption === "company"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              } `}
            >
              <RiBuilding2Line className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Company</span>
            </button>
            <button
              onClick={() => handleSelectedOption("job")}
              className={`flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-2.5 text-xs font-medium transition-all duration-200 sm:gap-2 sm:px-4 sm:text-sm ${
                selectedOption === "job"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              } `}
            >
              <RiBriefcase4Line className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Job</span>
            </button>
          </div>
        </div>

        {/* Content Area with proper spacing for dropdowns */}
        <div className="min-h-[500px] p-3 pb-32 sm:min-h-[600px] sm:p-6 sm:pb-40">
          {selectedOption === "company" && (
            <div className="space-y-6 sm:space-y-10">
              {/* Department and Hiring Manager Row */}
              <div className="grid grid-cols-1 gap-6 sm:gap-10 lg:grid-cols-2">
                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-900 sm:text-sm">
                    <RiBuilding2Line className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                    <span>Department</span>
                  </label>
                  <div className="relative z-[100]">
                    <SearchableSelectWithAdd
                      placeholder={job?.department || "Choose Department..."}
                      options={departments}
                      className="h-10 w-full rounded-lg border-2 border-gray-200 px-3 text-xs transition-colors duration-200 focus:border-blue-500 sm:h-12 sm:px-4 sm:text-sm"
                      onChange={handleDepartmentChange}
                    />
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-900 sm:text-sm">
                    <RiUserLine className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                    <span>Hiring Manager</span>
                  </label>
                  <div className="flex h-10 items-center gap-2 rounded-lg border-2 border-gray-200 px-3 transition-colors duration-200 focus-within:border-blue-500 sm:h-12 sm:gap-3 sm:px-4">
                    <img
                      src={Referrer1}
                      alt=""
                      className="h-5 w-5 flex-shrink-0 rounded-full sm:h-6 sm:w-6"
                    />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={job?.hiringManager || ""}
                      onChange={(e) => {
                        setJobData({
                          ...job,
                          hiringManager: e.target.value,
                        });
                      }}
                      className="min-w-0 flex-1 border-none bg-transparent text-xs outline-none focus:border-none focus:outline-none sm:text-sm"
                    />
                    <img
                      src={Teams}
                      alt="Teams"
                      className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5"
                    />
                  </div>
                </div>
              </div>

              {/* End Date and Location Row */}
              <div className="grid grid-cols-1 gap-6 sm:gap-10 lg:grid-cols-2">
                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-900 sm:text-sm">
                    <RiCalendarLine className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                    <span>Application End Date</span>
                  </label>
                  <div className="relative z-[90]">
                    <DatePicker
                      required={true}
                      selectedDate={new Date(job.endDate)}
                      onDateChange={(date) => {
                        handleDateChange(date as Date);
                      }}
                      disabled={false}
                      className="h-10 w-full rounded-lg border-2 border-gray-200 px-3 text-xs transition-colors duration-200 focus:border-blue-500 sm:h-12 sm:px-4 sm:text-sm"
                    />
                    {errors.endDate && (
                      <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-2 text-red-600">
                        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-red-600"></div>
                        <span className="text-xs font-medium">
                          {errors.endDate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-900 sm:text-sm">
                    <RiMapPinLine className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                    <span>Location</span>
                    <FaAsterisk className="h-1.5 w-1.5 text-red-500 sm:h-2 sm:w-2" />
                  </label>
                  <div className="relative z-[100]">
                    <SearchableSelectWithAdd
                      placeholder={job.location || "Choose Location..."}
                      className="h-10 w-full rounded-lg border-2 border-gray-200 px-3 text-xs transition-colors duration-200 focus:border-blue-500 sm:h-12 sm:px-4 sm:text-sm"
                      options={JobLocations}
                      onChange={handleLocationChange}
                      onAddOption={handleAddOption}
                    />
                    {errors.location && (
                      <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-2 text-red-600">
                        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-red-600"></div>
                        <span className="text-xs font-medium">
                          {errors.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedOption === "job" && (
            <div className="space-y-6 sm:space-y-10">
              {/* Job Title and Experience Row */}
              <div className="grid grid-cols-1 gap-6 sm:gap-10 lg:grid-cols-2">
                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-900 sm:text-sm">
                    <RiBriefcase4Line className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                    <span>Job Title</span>
                    <FaAsterisk className="h-1.5 w-1.5 text-red-500 sm:h-2 sm:w-2" />
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    className="h-10 w-full rounded-lg border-2 border-gray-200 px-3 text-xs transition-colors duration-200 focus:border-blue-500 sm:h-12 sm:px-4 sm:text-sm"
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
                    value={job.title || ""}
                  />
                  {errors.title && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2 text-red-600">
                      <div className="h-2 w-2 flex-shrink-0 rounded-full bg-red-600"></div>
                      <span className="text-xs font-medium">
                        {errors.title}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-900 sm:text-sm">
                    <RiTrophyLine className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                    <span>Experience & Level</span>
                    <FaAsterisk className="h-1.5 w-1.5 text-red-500 sm:h-2 sm:w-2" />
                  </label>
                  <div className="flex h-10 overflow-hidden rounded-lg border-2 border-gray-200 transition-colors duration-200 focus-within:border-blue-500 sm:h-12">
                    <input
                      type="number"
                      placeholder="Years"
                      className="min-w-0 flex-1 border-none bg-transparent px-2 text-xs outline-none sm:px-4 sm:text-sm"
                      onChange={(e) => {
                        handleNumberInputChange(e, "experienceYears");
                        setErrors({
                          ...errors,
                          experienceYears: e.target.value
                            ? ""
                            : "Please enter years of experience.",
                        });
                      }}
                      value={job.experienceYears || ""}
                    />
                    <div className="w-px bg-gray-200"></div>
                    <select
                      className="min-w-0 flex-1 border-none bg-transparent px-2 text-xs outline-none sm:px-4 sm:text-sm"
                      value={job.level || ""}
                      onChange={handleLevelChange}
                    >
                      <option value="" disabled>
                        Level
                      </option>
                      {jobLevels.map((level, key) => (
                        <option key={key} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {(errors.experienceYears || errors.level) && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2 text-red-600">
                      <div className="h-2 w-2 flex-shrink-0 rounded-full bg-red-600"></div>
                      <span className="text-xs font-medium">
                        {errors.experienceYears || errors.level}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Salary Budget Section */}
              <div className="space-y-4 sm:space-y-6">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-900 sm:text-sm">
                  <RiMoneyDollarCircleLine className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                  <span>Salary Budget</span>
                </label>

                {/* Radio Button Options */}
                <div className="xs:flex-row xs:flex-wrap flex flex-col gap-3 rounded-lg bg-gray-50 p-3 sm:gap-6 sm:p-4">
                  <CustomRadioButton
                    name="paymentOption"
                    value="option1"
                    checked={selectOption === "option1"}
                    onChange={() => handleSelectOptionChange("option1")}
                    label="Exact Amount"
                    size={14}
                    color="#6E4AED"
                  />
                  <CustomRadioButton
                    name="paymentOption"
                    value="option2"
                    checked={selectOption === "option2"}
                    onChange={() => handleSelectOptionChange("option2")}
                    label="Range"
                    size={14}
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
                    size={14}
                    color="#6E4AED"
                  />
                </div>

                {/* Salary Input Fields */}
                {(selectOption === "option1" || selectOption === "option2") && (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Amount Input Section */}
                    {selectOption === "option1" && (
                      <div className="space-y-3 sm:space-y-4">
                        <label className="text-xs font-medium text-gray-700 sm:text-sm">
                          Amount
                        </label>
                        <div className="flex h-10 items-center gap-2 rounded-lg border-2 border-gray-200 px-3 transition-colors duration-200 focus-within:border-blue-500 sm:h-12 sm:gap-3 sm:px-4">
                          <span className="min-w-[35px] flex-shrink-0 text-xs font-medium text-gray-600 sm:min-w-[50px] sm:text-sm">
                            {job.currency || "USD"}
                          </span>
                          <div className="h-4 w-px bg-gray-200 sm:h-6"></div>
                          <input
                            type="number"
                            className="min-w-0 flex-1 border-none bg-transparent text-xs outline-none sm:text-sm"
                            placeholder="Enter exact amount"
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
                        </div>
                      </div>
                    )}

                    {selectOption === "option2" && (
                      <div className="space-y-3 sm:space-y-4">
                        <label className="text-xs font-medium text-gray-700 sm:text-sm">
                          Salary Range
                        </label>

                        {/* Mobile: Stacked layout */}
                        <div className="block space-y-3 sm:hidden">
                          <div className="flex h-10 items-center gap-2 rounded-lg border-2 border-gray-200 px-3 transition-colors duration-200 focus-within:border-blue-500">
                            <span className="min-w-[35px] flex-shrink-0 text-xs font-medium text-gray-600">
                              {job.currency || "USD"}
                            </span>
                            <div className="h-4 w-px bg-gray-200"></div>
                            <input
                              type="number"
                              className="min-w-0 flex-1 border-none bg-transparent text-xs outline-none"
                              placeholder="Minimum"
                              value={job.minimumAmount || ""}
                              onChange={(e) =>
                                handleNumberInputChange(e, "minimumAmount")
                              }
                            />
                          </div>
                          <div className="flex h-10 items-center gap-2 rounded-lg border-2 border-gray-200 px-3 transition-colors duration-200 focus-within:border-blue-500">
                            <span className="min-w-[35px] flex-shrink-0 text-xs font-medium text-gray-600">
                              {job.currency || "USD"}
                            </span>
                            <div className="h-4 w-px bg-gray-200"></div>
                            <input
                              type="number"
                              className="min-w-0 flex-1 border-none bg-transparent text-xs outline-none"
                              placeholder="Maximum"
                              value={job.maximumAmount || ""}
                              onChange={(e) =>
                                handleNumberInputChange(e, "maximumAmount")
                              }
                            />
                          </div>
                        </div>

                        {/* Desktop: Single row layout */}
                        <div className="hidden h-12 items-center gap-3 rounded-lg border-2 border-gray-200 px-4 transition-colors duration-200 focus-within:border-blue-500 sm:flex">
                          <span className="min-w-[50px] flex-shrink-0 text-sm font-medium text-gray-600">
                            {job.currency || "USD"}
                          </span>
                          <div className="h-6 w-px bg-gray-200"></div>
                          <input
                            type="number"
                            className="min-w-0 flex-1 border-none bg-transparent text-sm outline-none"
                            placeholder="Minimum"
                            value={job.minimumAmount || ""}
                            onChange={(e) =>
                              handleNumberInputChange(e, "minimumAmount")
                            }
                          />
                          <div className="h-6 w-px bg-gray-200"></div>
                          <input
                            type="number"
                            className="min-w-0 flex-1 border-none bg-transparent text-sm outline-none"
                            placeholder="Maximum"
                            value={job.maximumAmount || ""}
                            onChange={(e) =>
                              handleNumberInputChange(e, "maximumAmount")
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* Frequency and Currency Section */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                      <div className="space-y-3 sm:space-y-4">
                        <label className="text-xs font-medium text-gray-700 sm:text-sm">
                          Frequency
                        </label>
                        <select
                          className="h-10 w-full rounded-lg border-2 border-gray-200 px-3 text-xs transition-colors duration-200 focus:border-blue-500 sm:h-12 sm:px-4 sm:text-sm"
                          value={job.frequency || ""}
                          onChange={handleFrequencyChange}
                        >
                          <option value="" disabled>
                            Select Frequency
                          </option>
                          <option value="per year">Yearly</option>
                          <option value="per month">Monthly</option>
                          <option value="per week">Weekly</option>
                          <option value="per day">Daily</option>
                          <option value="per hour">Hourly</option>
                        </select>
                      </div>

                      <div className="relative z-[80] space-y-3 sm:space-y-4">
                        <label className="text-xs font-medium text-gray-700 sm:text-sm">
                          Currency
                        </label>
                        <CustomSelect
                          placeholder={job.currency || "Choose currency..."}
                          options={currencies}
                          className="h-10 w-full rounded-lg border-2 border-gray-200 px-3 text-xs transition-colors duration-200 focus:border-blue-500 sm:h-12 sm:px-4 sm:text-sm"
                          onChange={handleCurrencySelect}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2 text-red-600 sm:p-3">
                        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-red-600"></div>
                        <span className="text-xs font-medium sm:text-sm">
                          {error}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Job Type, Employment Type, Priority Row */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-900 sm:text-sm">
                    <RiBriefcase4Line className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                    <span>Job Type</span>
                    <FaAsterisk className="h-1.5 w-1.5 text-red-500 sm:h-2 sm:w-2" />
                  </label>
                  <div className="relative z-[70]">
                    <CustomSelect
                      placeholder={job.jobType || "Choose..."}
                      options={JobType}
                      className="h-10 w-full rounded-lg border-2 border-gray-200 px-3 text-xs transition-colors duration-200 focus:border-blue-500 sm:h-12 sm:px-4 sm:text-sm"
                      onChange={handleJobSelect}
                    />
                    {errors.jobType && (
                      <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-2 text-red-600">
                        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-red-600"></div>
                        <span className="text-xs font-medium">
                          {errors.jobType}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-900 sm:text-sm">
                    <RiTimeLine className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                    <span>Employment Type</span>
                    <FaAsterisk className="h-1.5 w-1.5 text-red-500 sm:h-2 sm:w-2" />
                  </label>
                  <div className="relative z-[60]">
                    <CustomSelect
                      placeholder={job.employmentType || "Choose ..."}
                      options={employmentTypOptions}
                      className="h-10 w-full rounded-lg border-2 border-gray-200 px-3 text-xs transition-colors duration-200 focus:border-blue-500 sm:h-12 sm:px-4 sm:text-sm"
                      onChange={handleEmploymentSelect}
                    />
                    {errors.employmentType && (
                      <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-2 text-red-600">
                        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-red-600"></div>
                        <span className="text-xs font-medium">
                          {errors.employmentType}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 sm:col-span-2 sm:space-y-4 lg:col-span-1">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-900 sm:text-sm">
                    <RiTrophyLine className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
                    <span>Priority</span>
                    <FaAsterisk className="h-1.5 w-1.5 text-red-500 sm:h-2 sm:w-2" />
                  </label>
                  <div className="relative z-[50]">
                    <CustomSelect
                      placeholder={job.priority || "Choose ..."}
                      options={[
                        { label: "High", value: "HIGH" },
                        { label: "Medium", value: "MEDIUM" },
                        { label: "Low", value: "LOW" },
                      ]}
                      className="h-10 w-full rounded-lg border-2 border-gray-200 px-3 text-xs transition-colors duration-200 focus:border-blue-500 sm:h-12 sm:px-4 sm:text-sm"
                      onChange={(option) => {
                        setJobData({
                          ...job,
                          priority: option.value,
                        });
                      }}
                    />
                    {errors.priority && (
                      <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-2 text-red-600">
                        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-red-600"></div>
                        <span className="text-xs font-medium">
                          {errors.priority}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="xs:flex-row xs:gap-0 mt-6 flex w-full max-w-[880px] flex-col justify-between gap-3 px-3 sm:px-0">
        <button
          onClick={prevStep}
          className="xs:order-1 order-2 flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 sm:px-8 sm:text-base"
        >
          <RiArrowLeftLine className="h-4 w-4" />
          <span>Back</span>
        </button>
        <button
          onClick={handleNextStep}
          className="xs:order-2 order-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl sm:px-8 sm:text-base"
        >
          <span>Continue</span>
          <RiArrowRightLine className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepTwo;
