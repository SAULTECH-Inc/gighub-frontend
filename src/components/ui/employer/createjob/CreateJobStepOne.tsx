import React, { useState } from "react";
import RichTextEditor from "../../../common/RichTextEditor";
import { useJobFormStore } from "../../../../store/useJobFormStore";
import {
  RiFileTextLine,
  RiTaskLine,
  RiUserStarLine,
  RiArrowRightLine,
} from "react-icons/ri";

const CreateJobStepOne: React.FC = () => {
  const { job, nextStep, setJobData } = useJobFormStore();
  const [selectedOption, setSelectedOption] = useState("description");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const tabs = [
    {
      id: "description",
      label: "Description",
      icon: RiFileTextLine,
      title: "Job Description",
    },
    {
      id: "responsibility",
      label: "Responsibilities",
      icon: RiTaskLine,
      title: "Job Responsibilities",
    },
    {
      id: "requirements",
      label: "Requirements",
      icon: RiUserStarLine,
      title: "Job Requirements",
    },
  ];

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
      newErrors.description = "Job description is required.";
    }

    if (isRichTextEmpty(job.responsibility)) {
      newErrors.responsibility = "Job responsibilities are required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const getCurrentContent = () => {
    switch (selectedOption) {
      case "description":
        return job.description;
      case "responsibility":
        return job.responsibility;
      case "requirements":
        return job.requirements;
      default:
        return "";
    }
  };

  const handleContentChange = (content: string) => {
    setJobData({ [selectedOption]: content });
    // Clear error when content is added
    if (!isRichTextEmpty(content) && errors[selectedOption]) {
      setErrors({ ...errors, [selectedOption]: "" });
    }
  };

  const getWordCount = (content: string) => {
    if (!content) return 0;
    return content
      .replace(/<[^>]*>/g, "")
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const currentTab = tabs.find((tab) => tab.id === selectedOption);

  return (
    <div className="flex w-full flex-col items-center p-6">
      {/* Main Card */}
      <div className="w-full max-w-[880px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Job Content
          </h2>

          {/* Modern Tab Navigation */}
          <div className="flex rounded-lg bg-white/80 p-1 backdrop-blur-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedOption === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectedOption(tab.id as any)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  } `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Current Tab Title */}
          <div className="mb-4">
            <h3 className="text-base font-medium text-gray-900">
              {currentTab?.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedOption === "description" &&
                "Describe the role and what the candidate will do"}
              {selectedOption === "responsibility" &&
                "List the key responsibilities and duties"}
              {selectedOption === "requirements" &&
                "Specify required skills and qualifications"}
            </p>
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-3 p-0">
            <RichTextEditor
              key={selectedOption}
              value={getCurrentContent()}
              className="h-full rounded-lg transition-colors duration-200 focus-within:border-none"
              onChange={handleContentChange}
            />

            {/* Error Message */}
            {errors[selectedOption] && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-600">
                <div className="h-2 w-2 rounded-full bg-red-600"></div>
                <span className="text-sm font-medium">
                  {errors[selectedOption]}
                </span>
              </div>
            )}

            {/* Word Count */}
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">
              <span>Maximum 2000 words</span>
              <span className="font-medium">
                {getWordCount(getCurrentContent())} words
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 flex w-full max-w-[880px] justify-end">
        <button
          onClick={handleNextStep}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
        >
          <span>Continue</span>
          <RiArrowRightLine className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CreateJobStepOne;
