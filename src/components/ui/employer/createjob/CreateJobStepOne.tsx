import React, { useState } from "react";
import RichTextEditor from "../../../common/RichTextEditor";
import { useJobFormStore } from "../../../../store/useJobFormStore";

const CreateJobStepOne: React.FC = () => {
  const { job, nextStep, setJobData } = useJobFormStore();
  const [selectedOption, setSelectedOption] = useState("description");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper function to check if rich text content is effectively empty
  const isRichTextEmpty = (content: string): boolean => {
    return (
      !content ||
      content.trim() === "" ||
      content === "<p><br></p>" ||
      content === "<p></p>" ||
      content.replace(/<[^>]*>/g, "").trim() === ""
    );
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (isRichTextEmpty(job.description)) {
      newErrors.description = "Description is required.";
    }

    if (isRichTextEmpty(job.responsibility)) {
      newErrors.responsibility = "Responsibility is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // This effect updates the job store when description or responsibility changes
  const handleSelectedOption = (
    type: "description" | "responsibility" | "requirements",
  ) => {
    setSelectedOption(type);
  };

  const handleNextStep = () => {
    if (validateFields()) {
      nextStep();
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex h-full min-h-[500px] w-full max-w-[900px] flex-col items-center justify-center rounded-[10px] bg-white px-2">
        <div className="flex w-full flex-col gap-2 sm:w-[95%]">
          <div className="text-gray-600 flex justify-between border-b-[1px]">
            <div
              onClick={() => handleSelectedOption("description")}
              className={`flex-1 cursor-pointer text-center text-sm ${
                selectedOption === "description"
                  ? "border-b-4 border-[#6438C2] text-[#6438C2]"
                  : "text-gray-600"
              }`}
            >
              Job Description
            </div>
            <div
              onClick={() => handleSelectedOption("responsibility")}
              className={`flex-1 cursor-pointer text-center text-sm ${
                selectedOption === "responsibility"
                  ? "border-b-4 border-[#6438C2] text-[#6438C2]"
                  : "text-gray-600"
              }`}
            >
              Job Responsibility
            </div>
            <div
              onClick={() => handleSelectedOption("requirements")}
              className={`flex-1 cursor-pointer text-center text-sm ${
                selectedOption === "requirements"
                  ? "border-b-4 border-[#6438C2] text-[#6438C2]"
                  : "text-gray-600"
              }`}
            >
              Job Requirements
            </div>
          </div>

          {selectedOption === "description" && (
            <h2 className="text-wrap text-sm text-[#000000]">
              Job Description
            </h2>
          )}
          {selectedOption === "responsibility" && (
            <h2 className="text-sm text-[#000000]">Job Responsibility</h2>
          )}

          {selectedOption === "requirements" && (
            <h2 className="text-sm text-[#000000]">Job Requirements</h2>
          )}

          {selectedOption === "description" && (
            <>
              <RichTextEditor
                key={selectedOption}
                value={job.description}
                className="overflow-y-auto"
                onChange={(content) => setJobData({ description: content })}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </>
          )}
          {selectedOption === "responsibility" && (
            <>
              <RichTextEditor
                key={selectedOption}
                value={job.responsibility}
                className="overflow-y-auto"
                onChange={(content) => setJobData({ responsibility: content })}
              />
              {errors.responsibility && (
                <p className="text-xs text-red-500">{errors.responsibility}</p>
              )}
            </>
          )}

          {selectedOption === "requirements" && (
            <>
              <RichTextEditor
                key={selectedOption}
                value={job.requirements}
                className="overflow-y-auto"
                onChange={(content) => setJobData({ requirements: content })}
              />
              {errors.requirements && (
                <p className="text-xs text-red-500">{errors.requirements}</p>
              )}
            </>
          )}

          <p className="flex self-end text-[13px] text-[#8E8E8E]">
            Maximum 2000 words
          </p>
        </div>
      </div>
      <div className="my-2 flex w-[96%] max-w-[900px] justify-end">
        <button
          className="w-[25%] rounded-[15px] bg-[#6438C2] py-[8px] text-white"
          onClick={handleNextStep}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepOne;
