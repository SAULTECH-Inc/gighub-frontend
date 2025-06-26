import React from "react";
import { useScheduleInterview } from "../../../store/useScheduleInterview.ts";
import { InterviewScheduleDetails } from "../../../utils/types";
import { useAuth } from "../../../store/useAuth.ts";
import {
  removeUploadedFile,
  saveInterviewDetails,
  uploadFile,
} from "../../../services/api";
import { Action, UserType } from "../../../utils/enums.ts";
import useModalStore from "../../../store/modalStateStores.ts";

const InterviewStepFour: React.FC = () => {
  // const {isAuthenticated, employer} = useAuth();
  const { openModal, closeModal } = useModalStore();
  const { prevStep, interviewDetails, setInterviewDetails, reset } =
    useScheduleInterview();
  const { employer } = useAuth();
  const [, setInterviewId] = React.useState<number | null>(null);
  const handleFileUploadDialog = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf, .doc, .docx, .txt, .jpg, .jpeg, .png"; // Specify the accepted file types

    fileInput.onchange = async (event) => {
      const input = event.target as HTMLInputElement;
      const files = input.files;

      if (files && files.length > 0) {
        const response = await uploadFile(
          employer?.id as number,
          files[0],
          Action.FILE_UPLOAD,
          UserType.EMPLOYER,
          "Interview Files",
        );
        if (response.statusCode === 200) {
          console.log("File uploaded successfully");
          const newFile = response.data.url; // Assuming the response contains the file URL
          const updatedFiles = [...(interviewDetails?.files || []), newFile];
          setInterviewDetails({
            ...interviewDetails,
            files: updatedFiles,
          } as InterviewScheduleDetails);
        } else {
          console.error("Error uploading file:", response.data);
        }
      }
    };

    fileInput.click();
  };

  const handleRemoveFile = async (fileUrl: string) => {
    const response = await removeUploadedFile(
      employer?.id as number,
      fileUrl,
      Action.DELETING_A_FILE,
      UserType.EMPLOYER,
      "Interview Files",
    );
    if (response.statusCode === 200) {
      console.log("File removed successfully");
      const files = interviewDetails?.files || [];
      const updatedFiles = files.filter((file) => file !== fileUrl);
      setInterviewDetails({
        ...interviewDetails,
        files: updatedFiles,
      } as InterviewScheduleDetails);
    } else {
      console.error("Error removing file:", response.data);
    }
  };

  const handleSubmit = async () => {
    const response = await saveInterviewDetails(
      interviewDetails as InterviewScheduleDetails,
    );
    if (response.statusCode === 200) {
      console.log("Interview details saved successfully");
      setInterviewId(response.data.id);
      reset();

      closeModal("interview-schedule");
      openModal("success-modal");
    } else {
      console.error("Error saving interview details:", response.data);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex min-h-[400px] w-[96%] max-w-[900px] flex-col items-center rounded-[10px] bg-white py-4">
        <div className="flex w-[95%] flex-col gap-3">
          <h4 className="text-[13px] font-bold text-[#000000] sm:text-2xl">
            Review & Submit
          </h4>
          <p className="text-[14px] text-[#000000] sm:text-[16px]">
            Please review the details of your interview before submitting.
          </p>
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="note"
              className="text-[14px] font-bold text-[#000000] sm:text-[16px]"
            >
              Note/Instruction
            </label>
            <textarea
              name="note"
              value={interviewDetails?.notes || ""}
              onChange={(e) => {
                setInterviewDetails({
                  ...interviewDetails,
                  notes: e.target.value,
                } as InterviewScheduleDetails);
              }}
              className="h-[121px] w-full resize-none rounded-[15px] border border-[#E6E6E6] px-4 py-2 focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="tags"
              className="text-[14px] font-bold text-[#000000] sm:text-[16px]"
            >
              Tags
            </label>
            <input
              type="text"
              name="tags"
              placeholder="Enter tags and press Enter or use commas to separate"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  const value = input.value.trim();
                  if (value) {
                    const currentTags = interviewDetails?.tags || [];
                    if (!currentTags.includes(value)) {
                      setInterviewDetails({
                        ...interviewDetails,
                        tags: [...currentTags, value],
                      } as InterviewScheduleDetails);
                    }
                    input.value = "";
                  }
                }
              }}
              onBlur={(e) => {
                const value = e.target.value.trim();
                if (value) {
                  const currentTags = interviewDetails?.tags || [];
                  if (!currentTags.includes(value)) {
                    setInterviewDetails({
                      ...interviewDetails,
                      tags: [...currentTags, value],
                    } as InterviewScheduleDetails);
                  }
                  e.target.value = "";
                }
              }}
              onChange={(e) => {
                const value = e.target.value;
                if (value.includes(",")) {
                  const newTags = value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0);

                  const currentTags = interviewDetails?.tags || [];
                  const uniqueNewTags = newTags.filter(
                    (tag) => !currentTags.includes(tag),
                  );

                  if (uniqueNewTags.length > 0) {
                    setInterviewDetails({
                      ...interviewDetails,
                      tags: [...currentTags, ...uniqueNewTags],
                    } as InterviewScheduleDetails);
                  }
                  e.target.value = "";
                }
              }}
              className="w-full rounded-[15px] border border-[#E6E6E6] px-4 py-2 focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
            />
            {/* Display entered tags as chips */}
            <div className="flex w-full flex-wrap gap-2">
              {interviewDetails?.tags?.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-[10px] bg-[#6438C2] px-3 py-1 text-white"
                >
                  <span className="text-[14px]">{tag}</span>
                  <button
                    type="button"
                    className="text-sm text-white hover:text-red-200"
                    onClick={() => {
                      const currentTags = interviewDetails?.tags || [];
                      const updatedTags = currentTags.filter(
                        (_, i) => i !== index,
                      );
                      setInterviewDetails({
                        ...interviewDetails,
                        tags: updatedTags,
                      } as InterviewScheduleDetails);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <div className="w-full flex-col items-center justify-between gap-2 sm:gap-6">
              <label
                htmlFor="time"
                className="text-[14px] font-bold text-[#000000] sm:text-[16px]"
              >
                File Upload
              </label>
              <div className="flex h-[132px] w-full flex-col gap-2 rounded-[15px] border border-[#E6E6E6] p-4">
                <div className="flex h-[35px] w-full items-center justify-between gap-2 rounded-[15px] border border-[#E6E6E6] px-4 py-2">
                  <label className="text-[#8E8E8E]">
                    Upload attachment (Optional)
                  </label>
                  <button
                    onClick={handleFileUploadDialog}
                    name="browse-button"
                    className="border-none px-4 py-2 text-[13px] font-bold text-[#6438C2] focus:border-none focus:ring-0 focus:outline-none"
                  >
                    Browse
                  </button>
                </div>
              </div>
            </div>
            {/*selected files with remove functionality */}
            <div className="flex w-full flex-wrap gap-2">
              {interviewDetails?.files?.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-[10px] border border-[#E6E6E6] bg-[#F7F7F7] px-4 py-2"
                >
                  <span className="text-[14px] text-[#000000] sm:text-[16px]">
                    File{index + 1}
                    {file.slice(-4)}
                  </span>
                  <button
                    type="button"
                    className="text-sm text-red-500"
                    onClick={() => handleRemoveFile(file)}
                  >
                    {/*  remove/close/times svg icon*/}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
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
          onClick={handleSubmit}
          className="w-[35%] rounded-[15px] border border-[#E6E6E6] bg-[#6438C2] px-1 py-[8px] text-sm text-white sm:w-[29%]"
        >
          Submit Job
        </button>
      </div>
    </div>
  );
};

export default InterviewStepFour;
