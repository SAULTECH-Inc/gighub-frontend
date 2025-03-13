import React from "react";
import { useJobFormStore } from "../../../../store/useJobFormStore";
import { PreferredCompanies, universities } from "../../../../utils/Countries";
import MultiSelect from "../../../common/MultiSelect";
import { Crown } from "../../../../assets/images";
// import { useAuth } from "../../../../store/useAuth";

const CreateJobStepFour: React.FC = () => {
  // const {isAuthenticated, employer} = useAuth();
  const { prevStep, job, setJobData } = useJobFormStore();
  const employerId = 20; // employer?.id;

  const submitJob = async (employerId: number) => {
    try {
      const { job } = useJobFormStore.getState(); // Get job data from Zustand store
      // Convert skillSet to an array of strings
      const skillSet = job.skillSet || []; // Define skillSet
      const formattedJob = {
        ...job,
        skillSet: skillSet.map((skill) => skill.skill || skill), // Ensure each value is a string
      };

      const response = await fetch(
        `http://localhost:3005/jobs/create/${employerId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedJob),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create job");
      }

      const result = await response.json();
      console.log("Job created successfully:", result);
      useJobFormStore.getState().resetFormData(); // Reset form after submission
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[96%] max-w-[900px] min-h-[400px] bg-white flex flex-col items-center py-4 rounded-[10px]">
        <div className="w-[95%] flex gap-3 flex-col">
          <div className="w-fit flex gap-1 bg-[#6438C2] py-[3px] px-[6px] rounded-[7px]">
            <img src={Crown} alt="premium crown" className="w-4" />
            <p className="text-white text-[12px] sm:text-base">Premium</p>
          </div>
          <div className="">
            <MultiSelect
              label="Preferred Candidate Previous Company"
              placeholder="Search or add a company"
              options={PreferredCompanies}
              selectedItems={(job?.preferredCandidatePreviousCompany || []).map(
                (company) => ({
                  label: company,
                  value: company,
                })
              )}
              setSelectedItems={(items) =>
                setJobData({
                  ...job,
                  preferredCandidatePreviousCompany: items.map(
                    (item) => item.value
                  ), // Keep it as string[]
                })
              }
            />
          </div>
          <div className="w-fit flex gap-1 bg-[#6438C2] py-[3px] px-[6px] rounded-[7px]">
            <img src={Crown} alt="premium crown" className="w-4" />
            <p className="text-white text-[12px] sm:text-base">Premium</p>
          </div>
          <MultiSelect
            label="Preferred Candidate University"
            placeholder="Search or add university"
            options={universities}
            selectedItems={(job?.preferredCandidateUniversity || []).map(
              (university) => ({
                label: university,
                value: university,
              })
            )}
            setSelectedItems={(items) =>
              setJobData({
                ...job,
                preferredCandidateUniversity: items.map((item) => item.value), // Keep it as string[]
              })
            }
          />
        </div>
      </div>
      <div className="w-[96%] my-2 max-w-[900px] flex justify-end gap-6 mx-2">
        <button
          className="w-[35%] sm:w-[29%] py-[8px] bg-[#F7F7F7] border border-[#E6E6E6] rounded-[15px] text-sm self-end"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => submitJob(employerId)} // Replace 123 with the actual employerId
          className="w-[35%] sm:w-[29%] py-[8px] px-1 bg-[#6438C2] border border-[#E6E6E6] rounded-[15px] text-white text-sm"
        >
          Submit Job
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepFour;
