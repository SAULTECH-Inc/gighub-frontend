import { Teams } from "../../../../assets/icons";
import { Referrer1 } from "../../../../assets/images";
import { useJobFormStore } from "../../../../store/useJobFormStore";
import { useEffect, useState } from "react";
import DatePicker from "../../../common/DatePicker";
import { DepartmentType } from "../../../../utils/DepartmentType";
import SearchableSelectWithAdd from "../../../common/SearchableSelectWithAdd";
import { JobLocations } from "../../../../utils/JobType";
import { EmploymentType } from "../../../../utils/DepartmentType";
import { JobType } from "../../../../utils/JobType";
import CustomSelect from "../../../common/CustomSelect";
import CustomRadioButton from "../../../common/CustomRadioButton";


interface Option {
  value: string;
  label: string;
}

const CreateJobStepTwo: React.FC = () => {
  const { job, nextStep, prevStep, setJobData } = useJobFormStore();
  const [selectedDate, setSelectedDate] = useState<string>(job.endDate || "");
  const [selectedOption, setSelectedOption] = useState("company");
  const [selectOption, setSelectOption] = useState("option1");
  
  
  const handleSelectedOption = (type: "job" | "company") => {
    setSelectedOption(type);
  };

  useEffect(() => {
    if (job.endDate !== selectedDate) {
      setSelectedDate(job.endDate);
    }
  }, [job.endDate, selectedDate]);


  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setJobData({
      ...job,
      endDate: e.target.value,
    });
  };

  const handleDepartmentChange = (option: { label: string; value: string }) => {
    setJobData({
      ...job,
      department: option.value,
    });
  };

  const handleChange = (selectedOption: Option) => {
    setJobData({ ...job, location: selectedOption.value });
  };

  const handleAddOption = (newOption: Option) => {
    setJobData({ ...job, location: newOption.value });
  };

  const handleSelect = (option: { label: string; value: string }) => {
    setSelectOption(option.label);
    setJobData({
      ...job,
      jobType: option.value,
    });
  };
  
  const handleEmploymentSelect = (option: { label: string; value: string }) => {
    setJobData({
      ...job,
      employmentType: option.value,
    });
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 py-6">
      <div className="w-[96%] max-w-[900px] h-[600px] bg-white flex flex-col items-center rounded-[10px] py-10">
        <div className="w-full sm:w-[95%] my-4 flex flex-col gap-4 px-4 sm:px-10">
        <div className="flex justify-between border-b-[1px] text-gray-600 mb-6">
        <div
          onClick={() => handleSelectedOption("company")}
          className={`cursor-pointer text-center py-2 flex-1 ${
            selectedOption === "company"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-600"
          }`}
        >
          Company
        </div>
        <div
          onClick={() => handleSelectedOption("job")}
          className={`cursor-pointer text-center py-2 flex-1 ${
            selectedOption === "job"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-600"
          }`}
        >
          Job
        </div>
      </div>
        </div>
        {selectedOption === "company" && 
        <div className="w-full sm:w-[95%] flex flex-col gap-4 px-4 sm:px-10">
        <label className="text-[#000000] font-medium mb-1">
            Department
          </label>
          <SearchableSelectWithAdd 
            placeholder={job?.department || "Choose a Department..."}
            options={DepartmentType}
            className="text-left w-full p-2 border border-[#E6E6E6] rounded-[10px] "
            onChange={handleDepartmentChange}
          />
          <label className="text-[#000000]">Hiring Manager</label>
          <div className="border border-[#E6E6E6] w-full py-3 px-4 rounded-[15px] flex gap-3">
            <img src={Referrer1} alt="" width={27} />
            <input
              type="text"
              placeholder="Shedrach Adam"
              className="w-full outline-none"
            />
            <img src={Teams} alt="ArrowDown" />
          </div>
          <DatePicker
            label="Select Application End Date"
            value={job.endDate || selectedDate}
            name="applicationPeriod"
            onChange={handleDateChange}
            disabled={false}
            className="border border-[#E6E6E6] w-full py-3 px-4 rounded-[15px]"
          />
         <label className="text-[#000000]">Location</label>
            <SearchableSelectWithAdd
            placeholder={job.location || "Choose a Location..."}
            className="text-left w-full px-4 py-3 border border-[#E6E6E6] rounded-[10px]"
            options={JobLocations} // Pass options from global state
            onChange={handleChange} // Update global state on selection
            onAddOption={handleAddOption}
            />
        </div>
        }

        {selectedOption === "job" && 
                <div className="w-[95%] flex flex-col gap-6 px-10">
                <label className="text-[#000000]">Experience in years</label>
                <div className="border border-[#E6E6E6] w-full py-3 px-4 rounded-[15px] flex gap-3">
                  <input
                    type="number"
                    placeholder="Eg. 1, 2 or 50"
                    className="w-full outline-none no-arrows"
                    onChange={(e) => setJobData({ ...job, experienceYears: parseInt(e.target.value) })}
                    value={job.experienceYears}
                  />
                </div>
                <label className="w-full text-[#000000]">Salary Budget</label>
                <div className="flex flex-col gap-4">
                  
                  <div className="w-full flex gap-10 ">
                  <CustomRadioButton 
                   name="group1"
                   value="option1"
                   checked={selectOption === "option1"}
                   onChange={(e) => setSelectOption(e.target.value)}
                   label="Exact Amount"
                   size={19}
                   color="#6E4AED"
                  />
                  <CustomRadioButton 
                   name="group1"
                   value="option2"
                   checked={selectOption === "option2"}
                   onChange={(e) => setSelectOption(e.target.value)}
                   label="Range"
                   size={19}
                   color="#6E4AED"
                  />
                  </div>
                  { selectOption === "option1" && (
                    <div className="border border-[#E6E6E6] py-3 px-4 rounded-[15px] flex gap-3">
                      <input
                        type="number"
                        onChange={(e) => setJobData({ ...job, exactAmount: parseInt(e.target.value) })}
                        className="w-full outline-none no-arrows"
                        placeholder="Exact Amount"
                        value={job.exactAmount}
                      />
                    </div>
                  )}
                  {selectOption === "option2" && (
                    <div className="flex justify-around">
                      <div className="sm:w-[48%] border border-[#E6E6E6] py-3 px-4 rounded-[15px] flex gap-3">
                        <input
                          type="number"
                          className="w-full outline-none no-arrows"
                          placeholder="Minimum Amount"
                          value={job.minimumAmount}
                          onChange={(e) => setJobData({ ...job, minimumAmount: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="sm:w-[48%] border border-[#E6E6E6] py-3 px-4 rounded-[15px] flex gap-3">
                        <input
                          type="number"
                          className="w-full outline-none no-arrows"
                          placeholder="Maximum Amount"
                          value={job.maximumAmount}
                          onChange={(e) => setJobData({ ...job, maximumAmount: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 w-full justify-between">
                <div className="w-full sm:w-[48%] flex flex-col gap-2">
                <label className="w-full text-[#000000]">Job Type</label>
                <CustomSelect
                      placeholder={job.jobType || "Choose a Job Type..."}
                      options={JobType}
                      className="text-left w-full p-2 border border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA]"
                      onChange={handleSelect}
                    />
                  </div>
                  <div className="w-full sm:w-[48%] flex flex-col gap-2">
                  <label className="w-full text-[#000000]">Employment Type</label>
                  <CustomSelect
                      placeholder={job.employmentType || "Choose an Employment Type..."}
                      options={EmploymentType}
                      className="text-left w-full p-2 border border-[#E6E6E6] rounded-[10px] bg-[#F7F8FA]"
                      onChange={handleEmploymentSelect}
                    />
                  </div>
                </div>
              </div>
        }
      </div>
      <div className="w-[96%] max-w-[900px] flex justify-end gap-6 mx-2">
        <button
          className="px-10 py-[13px] bg-[#F7F7F7] border border-[#E6E6E6] rounded-[15px] self-end"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          className="px-10 py-[13px] bg-[#6438C2] text-white rounded-[15px]"
          onClick={nextStep}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepTwo;