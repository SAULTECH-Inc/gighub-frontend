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
  RiTrophyLine
} from "react-icons/ri";

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
      <div className="w-full max-w-[880px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>

          {/* Modern Tab Navigation */}
          <div className="flex flex-col xs:flex-row bg-white/80 rounded-lg p-1 backdrop-blur-sm gap-1 xs:gap-0">
            <button
              onClick={() => handleSelectedOption("company")}
              className={`
                flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200
                ${selectedOption === "company"
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }
              `}
            >
              <RiBuilding2Line className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Company</span>
            </button>
            <button
              onClick={() => handleSelectedOption("job")}
              className={`
                flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200
                ${selectedOption === "job"
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }
              `}
            >
              <RiBriefcase4Line className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Job</span>
            </button>
          </div>
        </div>

        {/* Content Area with proper spacing for dropdowns */}
        <div className="p-3 sm:p-6 pb-32 sm:pb-40 min-h-[500px] sm:min-h-[600px]">
          {selectedOption === "company" && (
            <div className="space-y-6 sm:space-y-10">
              {/* Department and Hiring Manager Row */}
              <div className="grid grid-cols-1 gap-6 sm:gap-10 lg:grid-cols-2">
                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900">
                    <RiBuilding2Line className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                    <span>Department</span>
                  </label>
                  <div className="relative z-[100]">
                    <SearchableSelectWithAdd
                      placeholder={job?.department || "Choose Department..."}
                      options={departments}
                      className="w-full h-10 sm:h-12 rounded-lg border-2 border-gray-200 px-3 sm:px-4 text-xs sm:text-sm focus:border-blue-500 transition-colors duration-200"
                      onChange={handleDepartmentChange}
                    />
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900">
                    <RiUserLine className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                    <span>Hiring Manager</span>
                  </label>
                  <div className="flex items-center h-10 sm:h-12 gap-2 sm:gap-3 rounded-lg border-2 border-gray-200 px-3 sm:px-4 focus-within:border-blue-500 transition-colors duration-200">
                    <img src={Referrer1} alt="" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0" />
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
                      className="flex-1 border-none focus:outline-none focus:border-none text-xs sm:text-sm outline-none bg-transparent min-w-0"
                    />
                    <img src={Teams} alt="Teams" className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  </div>
                </div>
              </div>

              {/* End Date and Location Row */}
              <div className="grid grid-cols-1 gap-6 sm:gap-10 lg:grid-cols-2">
                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900">
                    <RiCalendarLine className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
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
                      className="h-10 sm:h-12 w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 text-xs sm:text-sm focus:border-blue-500 transition-colors duration-200"
                    />
                    {errors.endDate && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-lg mt-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                        <span className="text-xs font-medium">{errors.endDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900">
                    <RiMapPinLine className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                    <span>Location</span>
                    <FaAsterisk className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-red-500" />
                  </label>
                  <div className="relative z-[100]">
                    <SearchableSelectWithAdd
                      placeholder={job.location || "Choose Location..."}
                      className="h-10 sm:h-12 w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 text-xs sm:text-sm focus:border-blue-500 transition-colors duration-200"
                      options={JobLocations}
                      onChange={handleLocationChange}
                      onAddOption={handleAddOption}
                    />
                    {errors.location && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-lg mt-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                        <span className="text-xs font-medium">{errors.location}</span>
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
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900">
                    <RiBriefcase4Line className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                    <span>Job Title</span>
                    <FaAsterisk className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-red-500" />
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    className="h-10 sm:h-12 w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 text-xs sm:text-sm focus:border-blue-500 transition-colors duration-200"
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
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-lg">
                      <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                      <span className="text-xs font-medium">{errors.title}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900">
                    <RiTrophyLine className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                    <span>Experience & Level</span>
                    <FaAsterisk className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-red-500" />
                  </label>
                  <div className="flex h-10 sm:h-12 overflow-hidden rounded-lg border-2 border-gray-200 focus-within:border-blue-500 transition-colors duration-200">
                    <input
                      type="number"
                      placeholder="Years"
                      className="flex-1 px-2 sm:px-4 border-none text-xs sm:text-sm outline-none bg-transparent min-w-0"
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
                      className="flex-1 px-2 sm:px-4 border-none text-xs sm:text-sm outline-none bg-transparent min-w-0"
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
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-lg">
                      <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                      <span className="text-xs font-medium">
                        {errors.experienceYears || errors.level}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Salary Budget Section */}
              <div className="space-y-4 sm:space-y-6">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900">
                  <RiMoneyDollarCircleLine className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  <span>Salary Budget</span>
                </label>

                {/* Radio Button Options */}
                <div className="flex flex-col xs:flex-row xs:flex-wrap gap-3 sm:gap-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
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
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Amount</label>
                        <div className="flex h-10 sm:h-12 items-center gap-2 sm:gap-3 rounded-lg border-2 border-gray-200 px-3 sm:px-4 focus-within:border-blue-500 transition-colors duration-200">
                          <span className="text-xs sm:text-sm font-medium text-gray-600 min-w-[35px] sm:min-w-[50px] flex-shrink-0">
                            {job.currency || "USD"}
                          </span>
                          <div className="w-px h-4 sm:h-6 bg-gray-200"></div>
                          <input
                            type="number"
                            className="flex-1 border-none text-xs sm:text-sm outline-none bg-transparent min-w-0"
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
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Salary Range</label>

                        {/* Mobile: Stacked layout */}
                        <div className="block sm:hidden space-y-3">
                          <div className="flex h-10 items-center gap-2 rounded-lg border-2 border-gray-200 px-3 focus-within:border-blue-500 transition-colors duration-200">
                            <span className="text-xs font-medium text-gray-600 min-w-[35px] flex-shrink-0">
                              {job.currency || "USD"}
                            </span>
                            <div className="w-px h-4 bg-gray-200"></div>
                            <input
                              type="number"
                              className="flex-1 border-none text-xs outline-none bg-transparent min-w-0"
                              placeholder="Minimum"
                              value={job.minimumAmount || ""}
                              onChange={(e) =>
                                handleNumberInputChange(e, "minimumAmount")
                              }
                            />
                          </div>
                          <div className="flex h-10 items-center gap-2 rounded-lg border-2 border-gray-200 px-3 focus-within:border-blue-500 transition-colors duration-200">
                            <span className="text-xs font-medium text-gray-600 min-w-[35px] flex-shrink-0">
                              {job.currency || "USD"}
                            </span>
                            <div className="w-px h-4 bg-gray-200"></div>
                            <input
                              type="number"
                              className="flex-1 border-none text-xs outline-none bg-transparent min-w-0"
                              placeholder="Maximum"
                              value={job.maximumAmount || ""}
                              onChange={(e) =>
                                handleNumberInputChange(e, "maximumAmount")
                              }
                            />
                          </div>
                        </div>

                        {/* Desktop: Single row layout */}
                        <div className="hidden sm:flex h-12 items-center gap-3 rounded-lg border-2 border-gray-200 px-4 focus-within:border-blue-500 transition-colors duration-200">
                          <span className="text-sm font-medium text-gray-600 min-w-[50px] flex-shrink-0">
                            {job.currency || "USD"}
                          </span>
                          <div className="w-px h-6 bg-gray-200"></div>
                          <input
                            type="number"
                            className="flex-1 border-none text-sm outline-none bg-transparent min-w-0"
                            placeholder="Minimum"
                            value={job.minimumAmount || ""}
                            onChange={(e) =>
                              handleNumberInputChange(e, "minimumAmount")
                            }
                          />
                          <div className="w-px h-6 bg-gray-200"></div>
                          <input
                            type="number"
                            className="flex-1 border-none text-sm outline-none bg-transparent min-w-0"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-3 sm:space-y-4">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Frequency</label>
                        <select
                          className="h-10 sm:h-12 w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 text-xs sm:text-sm focus:border-blue-500 transition-colors duration-200"
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

                      <div className="space-y-3 sm:space-y-4 relative z-[80]">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Currency</label>
                        <CustomSelect
                          placeholder={job.currency || "Choose currency..."}
                          options={currencies}
                          className="h-10 sm:h-12 w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 text-xs sm:text-sm focus:border-blue-500 transition-colors duration-200"
                          onChange={handleCurrencySelect}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 sm:p-3 rounded-lg">
                        <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm font-medium">{error}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Job Type, Employment Type, Priority Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900">
                    <RiBriefcase4Line className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                    <span>Job Type</span>
                    <FaAsterisk className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-red-500" />
                  </label>
                  <div className="relative z-[70]">
                    <CustomSelect
                      placeholder={job.jobType || "Choose..."}
                      options={JobType}
                      className="h-10 sm:h-12 w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 text-xs sm:text-sm focus:border-blue-500 transition-colors duration-200"
                      onChange={handleJobSelect}
                    />
                    {errors.jobType && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-lg mt-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                        <span className="text-xs font-medium">{errors.jobType}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900">
                    <RiTimeLine className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                    <span>Employment Type</span>
                    <FaAsterisk className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-red-500" />
                  </label>
                  <div className="relative z-[60]">
                    <CustomSelect
                      placeholder={job.employmentType || "Choose ..."}
                      options={EmploymentType}
                      className="h-10 sm:h-12 w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 text-xs sm:text-sm focus:border-blue-500 transition-colors duration-200"
                      onChange={handleEmploymentSelect}
                    />
                    {errors.employmentType && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-lg mt-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                        <span className="text-xs font-medium">{errors.employmentType}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900">
                    <RiTrophyLine className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                    <span>Priority</span>
                    <FaAsterisk className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-red-500" />
                  </label>
                  <div className="relative z-[50]">
                    <CustomSelect
                      placeholder={job.priority || "Choose ..."}
                      options={[
                        { label: "High", value: "HIGH" },
                        { label: "Medium", value: "MEDIUM" },
                        { label: "Low", value: "LOW" },
                      ]}
                      className="h-10 sm:h-12 w-full rounded-lg border-2 border-gray-200 px-3 sm:px-4 text-xs sm:text-sm focus:border-blue-500 transition-colors duration-200"
                      onChange={(option) => {
                        setJobData({
                          ...job,
                          priority: option.value,
                        });
                      }}
                    />
                    {errors.priority && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-lg mt-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                        <span className="text-xs font-medium">{errors.priority}</span>
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
      <div className="w-full max-w-[880px] flex flex-col xs:flex-row justify-between gap-3 xs:gap-0 mt-6 px-3 sm:px-0">
        <button
          onClick={prevStep}
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 sm:px-8 py-3 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base order-2 xs:order-1"
        >
          <RiArrowLeftLine className="h-4 w-4" />
          <span>Back</span>
        </button>
        <button
          onClick={handleNextStep}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 sm:px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base order-1 xs:order-2"
        >
          <span>Continue</span>
          <RiArrowRightLine className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepTwo;