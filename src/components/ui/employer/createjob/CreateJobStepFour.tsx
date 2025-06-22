import React from "react";
import { useJobFormStore } from "../../../../store/useJobFormStore";
import { PreferredCompanies, universities } from "../../../../utils/Countries";
import MultiSelect from "../../../common/MultiSelect";
import { Crown } from "../../../../assets/images";
import { toast } from "react-toastify";
import { useSubscriptionStore } from "../../../../store/useSubscriptionStore.ts";

const CreateJobStepFour: React.FC = () => {
  const { isSubscribed } = useSubscriptionStore();
  const { prevStep, job, setJobData, postJob, resetFormData } =
    useJobFormStore();

  const submitJob = async () => {
    try {
      const response = await postJob(job);
      if (response.statusCode === 201) {
        console.log("Job created successfully:", response.data);
        toast.success("Job created successfully");
        resetFormData();
      }
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex min-h-[400px] w-[96%] max-w-[900px] flex-col items-center rounded-[10px] bg-white py-4">
        <div className="flex w-[95%] flex-col gap-3">
          {!isSubscribed && (
            <div className="flex w-fit gap-1 rounded-[7px] bg-[#6438C2] px-[6px] py-[3px]">
              <img src={Crown} alt="premium crown" className="w-4" />
              <p className="text-[12px] text-white sm:text-base">Premium</p>
            </div>
          )}
          <div className="">
            <MultiSelect
              label="Preferred Candidate Previous Company"
              placeholder="Search or add a company"
              options={PreferredCompanies}
              disabled={!isSubscribed}
              selectedItems={(job?.preferredCandidatePreviousCompany || []).map(
                (company) => ({
                  label: company,
                  value: company,
                }),
              )}
              setSelectedItems={(items) =>
                setJobData({
                  ...job,
                  preferredCandidatePreviousCompany: items.map(
                    (item) => item.value,
                  ), // Keep it as string[]
                })
              }
            />
          </div>
          {!isSubscribed && (
            <div className="flex w-fit gap-1 rounded-[7px] bg-[#6438C2] px-[6px] py-[3px]">
              <img src={Crown} alt="premium crown" className="w-4" />
              <p className="text-[12px] text-white sm:text-base">Premium</p>
            </div>
          )}
          <MultiSelect
            label="Preferred Candidate University"
            placeholder="Search or add university"
            options={universities}
            disabled={!isSubscribed}
            selectedItems={(job?.preferredCandidateUniversity || []).map(
              (university) => ({
                label: university,
                value: university,
              }),
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
      <div className="mx-2 my-2 flex w-[96%] max-w-[900px] justify-end gap-6">
        <button
          className="w-[35%] self-end rounded-[15px] border border-[#E6E6E6] bg-[#F7F7F7] py-[8px] text-sm sm:w-[29%]"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => submitJob()} // Replace 123 with the actual employerId
          className="w-[35%] rounded-[15px] border border-[#E6E6E6] bg-[#6438C2] px-1 py-[8px] text-sm text-white sm:w-[29%]"
        >
          Submit Job
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepFour;
