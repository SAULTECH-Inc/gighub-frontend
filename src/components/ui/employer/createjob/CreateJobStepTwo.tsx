import { Teams } from "../../../../assets/icons";
import { Referrer1 } from "../../../../assets/images";
import {
  JobFormData,
  useJobFormStore,
} from "../../../../store/useJobFormStore";
import { useEffect, useState } from "react";
import DatePicker from "../../../common/DatePicker";
import { DepartmentType } from "../../../../utils/DepartmentType";
import SearchableSelectWithAdd from "../../../common/SearchableSelectWithAdd";
import { JobLocations } from "../../../../utils/JobType";
import { EmploymentType } from "../../../../utils/DepartmentType";
import { JobType } from "../../../../utils/JobType";
import CustomSelect from "../../../common/CustomSelect";
import CustomRadioButton from "../../../common/CustomRadioButton";
import { currencies } from "../../../../utils/Countries";
import { FaAsterisk } from "react-icons/fa";

interface Option {
  value: string;
  label: string;
}

const CreateJobStepTwo: React.FC = () => {
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
  }, [title]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setJobData({
      ...job,
      endDate: e.target.value,
    });
    setErrors({
      ...errors,
      endDate: e.target.value ? "" : "Please select end date.",
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
    field: keyof JobFormData
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
    <div className="w-full flex flex-col items-center">
      <div className="w-[96%] max-w-[900px] min-h-[400px] bg-white px-2 py-2 flex flex-col items-center rounded-[10px]">
        <div className="w-full sm:w-[95%] flex flex-col gap-2">
          <div className="flex justify-between border-b-[1px] my-3 text-gray-600">
            <div
              onClick={() => handleSelectedOption("company")}
              className={`cursor-pointer text-center text-sm flex-1 ${
                selectedOption === "company"
                  ? "text-[#6438C2] border-b-4 border-[#6438C2]"
                  : "text-gray-600"
              }`}
            >
              Company
            </div>
            <div
              onClick={() => handleSelectedOption("job")}
              className={`cursor-pointer text-center text-sm flex-1 ${
                selectedOption === "job"
                  ? "text-[#6438C2] border-b-4 border-[#6438C2]"
                  : "text-gray-600"
              }`}
            >
              Job
            </div>
          </div>
        </div>
        {selectedOption === "company" && (
          <div className="w-full sm:w-[95%] flex flex-col gap-2">
            <label className="text-[#000000] font-medium text-sm sm:text-base">
              Department
            </label>
            <SearchableSelectWithAdd
              placeholder={job?.department || "Choose a Department..."}
              options={DepartmentType}
              className="text-left w-full p-2 border border-[#E6E6E6] rounded-[10px]  text-sm sm:text-base"
              onChange={handleDepartmentChange}
            />
            <label className="text-[#000000]  text-sm sm:text-base">
              Hiring Manager
            </label>
            <div className="border border-[#E6E6E6] w-full h-10 px-4 rounded-[10px] flex gap-3">
              <img src={Referrer1} alt="" width={27} />
              <input
                type="text"
                placeholder="Shedrach Adam"
                className="w-full outline-none border-none focus:outline-none  text-sm sm:text-base focus:ring-0 focus:border-none"
              />
              <img src={Teams} alt="ArrowDown" />
            </div>
            <div className="relative">
              <DatePicker
                label="Select Application End Date"
                requiredAsterisk={true}
                value={job.endDate || selectedDate}
                name="applicationPeriod"
                onChange={handleDateChange}
                disabled={false}
                className="border border-[#E6E6E6] w-full h-10 px-4  text-sm sm:text-base rounded-[10px]"
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs">{errors.endDate}</p>
              )}
            </div>
            <div className="text-[#000000] flex gap-1 items-center  text-sm sm:text-base">
              Location <FaAsterisk className="w-2 fill-[#FA4E09] " />
            </div>

            <SearchableSelectWithAdd
              placeholder={job.location || "Choose a Location..."}
              className="text-left w-full px-4 h-10 border border-[#E6E6E6] rounded-[10px]  text-sm sm:text-base"
              options={JobLocations}
              onChange={handleLocationChange}
              onAddOption={handleAddOption}
            />
            {errors.location && (
              <p className="text-red-500 text-xs">{errors.location}</p>
            )}
          </div>
        )}

        {selectedOption === "job" && (
          <div className="w-full sm:w-[95%] flex flex-col gap-3 py-2 sm:py-0">
            <div className="flex flex-col sm:flex-row gap-2 w-full justify-between  text-sm sm:text-base">
              <div className="w-full flex flex-col gap-2">
                <div className="text-[#000000] flex gap-1 items-center">
                  Job Title <FaAsterisk className="w-2 fill-[#FA4E09]" />
                </div>

                <div className="border border-[#E6E6E6] h-10 px-4 rounded-[10px] flex">
                  <input
                    type="text"
                    placeholder="Graphic Designer"
                    className="w-full outline-none border-none focus:outline-none focus:ring-0 focus:border-none text-sm sm:text-base"
                    onChange={(e) => {
                      setTitle(e.target.value);
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
                  <p className="text-red-500 text-xs">{errors.title}</p>
                )}
              </div>
              <div className="w-full flex flex-col gap-2 ">
                <div className="text-[#000000] flex gap-1 items-center">
                  Experience in years/ Level
                  <FaAsterisk className="w-2 fill-[#FA4E09]" />
                </div>
                <div className="relative w-full flex border border-[#E6E6E6] rounded-[10px] overflow-hidden">
                  <div className="border-r border-[#E6E6E6] h-10 w-[60%] flex">
                    <input
                      type="number"
                      placeholder="Years"
                      className="w-full text-sm sm:text-base outline-none border-none focus:outline-none focus:ring-0 focus:border-none no-arrows"
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
                    className="text-sm border-none h-full sm:text-base outline-none focus:ring-0 focus:border-none"
                    value={job.level || ""}
                    onChange={handleLevelChange}
                  >
                    <option value="" disabled>
                      Select Level
                    </option>
                    <option value="Beginner">Beginner</option>
                    <option value="Junior">Junior</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                    <option value="Manager">Manager</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                {errors.experienceYears && (
                  <p className="text-red-500 text-xs">
                    {errors.experienceYears}
                  </p>
                )}
                {errors.level && (
                  <p className="text-red-500 text-xs">{errors.level}</p>
                )}
              </div>
            </div>
            <label className="w-full text-[#000000]  text-sm sm:text-base">
              Salary Budget
            </label>
            <div className="w-full flex flex-col gap-1 sm:gap-4">
              <div className="w-full flex flex-wrap gap-2 sm:gap-10 border-[#E6E6E6] ">
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
                <div className="w-full flex-col md:flex-row flex gap-2">
                  <div className="w-full">
                    {selectOption === "option1" && (
                      <div className="border border-[#E6E6E6] h-10 px-4 rounded-[10px] flex gap-3 relative">
                        <span className=" text-sm sm:text-base flex items-center">
                          {job.currency}
                        </span>
                        <input
                          type="number"
                          className="text-sm w-full sm:text-base border-[#E6E6E6] border-r-0 sm:border-1 sm:border-x-1 border-y-0 outline-none focus:outline-none focus:ring-0 focus:border-none no-arrows"
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
                          className="hidden sm:block w-full text-sm border-r-0 border-y-0 border-l-1 border-[#E6E6E6] h-[full] outline-none focus:ring-0 focus:border-none"
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
                      <div className="w-full flex flex-col sm:flex-row justify-between gap-2">
                        <div className="w-full border border-[#E6E6E6] h-10 rounded-[10px] overflow-hidden flex items-center">
                          <span className="text-[12px] sm:text-sm p-1 text-gray-500">
                            {job.currency}
                          </span>
                          <input
                            type="number"
                            className="text-sm w-full border-x-[#E6E6E6] border-y-0 outline-none focus:outline-none focus:ring-0 focus:border-none no-arrows"
                            placeholder="Minimum"
                            value={job.minimumAmount || ""}
                            onChange={(e) =>
                              handleNumberInputChange(e, "minimumAmount")
                            }
                          />
                          <input
                            type="number"
                            className="text-sm w-full border-r-0 border-l-0 border-y-0 outline-none focus:outline-none focus:ring-0 focus:border-none no-arrows"
                            placeholder="Maximum"
                            value={job.maximumAmount || ""}
                            onChange={(e) =>
                              handleNumberInputChange(e, "maximumAmount")
                            }
                          />
                          <div className="border border-[#E6E6E6]">
                            <select
                              className="hidden sm:block border-none h-full outline-none focus:ring-0 focus:border-none"
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
                  <div className="w-full md:w-[50%] flex gap-2">
                    <select
                      className="w-[50%] sm:hidden text-sm border border-[#E6E6E6] rounded-[10px] h-full outline-none focus:ring-0 focus:border-none"
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
                        className="text-left text-sm w-full px-2 md:text-[12px] overflow-hidden border h-10 border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA]"
                        onChange={handleCurrencySelect}
                      />
                    </div>
                  </div>
                </div>
              )}
              <p className="text-red-500 text-[10px]">{error}</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full justify-between">
              <div className="w-full sm:w-[48%] flex flex-col gap-2">
                <div className="text-[#000000] flex gap-1 items-center">
                  Job Type
                  <FaAsterisk className="w-2 fill-[#FA4E09]" />
                </div>
                <CustomSelect
                  placeholder={job.jobType || "Choose..."}
                  options={JobType}
                  className="text-left w-full text-sm px-2 border h-10 border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA]"
                  onChange={handleJobSelect}
                />
                {errors.jobType && (
                  <p className="text-red-500 text-xs">{errors.jobType}</p>
                )}
              </div>
              <div className="w-full sm:w-[48%] flex flex-col gap-2">
                <div className="text-[#000000] flex gap-1 items-center">
                  Employment Type
                  <FaAsterisk className="w-2 fill-[#FA4E09]" />
                </div>

                <CustomSelect
                  placeholder={job.employmentType || "Choose ..."}
                  options={EmploymentType}
                  className="text-left w-full px-2 h-10 text-sm border border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA]"
                  onChange={handleEmploymentSelect}
                />
                {errors.employmentType && (
                  <p className="text-red-500 text-xs">
                    {errors.employmentType}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-[96%] max-w-[900px] my-2 text-sm flex justify-end gap-6 mx-2">
        <button
          className="w-[35%] sm:w-[29%] py-[8px] bg-[#F7F7F7] border border-[#E6E6E6] rounded-[15px] self-end"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          className="w-[35%] sm:w-[29%] py-[8px] bg-[#6438C2] text-white rounded-[15px]"
          onClick={handleNextStep}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepTwo;
