import React, { useState } from "react";
import videoIcon from "../../../../assets/icons/video.svg";
import fileIcon from "../../../../assets/icons/fileUploaded.svg";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import { CvResponseDto, FileUploadRequest } from "../../../../utils/types";
import { useAuth } from "../../../../store/useAuth.ts";
import { Action, UserType } from "../../../../utils/enums.ts";
import { toast } from "react-toastify";
const getField = (docName: string) => {
  switch (docName) {
    case "Resume":
      return "cvLink";
    case "Cover Letter":
      return "coverLetterLink";
    default:
      return "videoCv";
  }
};
const ResumeAndCoverLetter: React.FC = () => {
  const { applicant } = useAuth();
  const { cvDetails, setCvDetails, uploadProfileFile, deleteProfileFile } =
    useApplicantJobProfile();
  const [documentName, setDocumentName] = useState<string>("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const singleFile = files[0];
      const response = await uploadProfileFile({
        file: singleFile,
        userId: applicant?.id,
        whatIsTheItem: documentName,
        userType: UserType.APPLICANT,
        action: Action.PROFILE_PICTURE_UPDATE,
      } as FileUploadRequest);
      if (response) {
        setCvDetails({
          ...cvDetails,
          [getField(documentName)]: response?.url as string,
        } as CvResponseDto);
      } else {
        toast.error("Failed to upload file. Please try again later.");
      }
    }
  };

  const removeFile = async (fileName: string) => {
    const response = await deleteProfileFile({
      userId: applicant?.id,
      fileUrl:
        fileName === "Video"
          ? cvDetails?.videoCv
          : fileName === "Resume"
            ? cvDetails?.cvLink
            : cvDetails?.coverLetterLink,
      whatIsTheItem: documentName,
      userType: UserType.APPLICANT,
      action: Action.DELETE_PROFILE_FILE,
    } as FileUploadRequest);
    if (response) {
      setCvDetails({
        ...cvDetails,
        [getField(documentName)]: null,
      } as CvResponseDto);
    } else {
      toast.error("Failed to delete file. Please try again later.");
    }
  };

  const handleChangeDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentName(e.target.value);
  };

  const documentOptions = ["Resume", "Cover Letter", "Video"];

  // Function to get the appropriate file icon
  // const getFileIcon = (file: any) => {
  //     return file.type.startsWith('video') ? videoIcon : fileIcon;
  // };

  return (
    <section
      id="resume-cover-letter"
      className="w-full space-y-3 border-t-[2px] border-t-[#E6E6E6] pt-5"
    >
      <h3 className="text-xl">Resume and Cover Letter</h3>

      <div className="w-full space-y-6">
        {/* Document Name Dropdown */}
        <div className="flex w-full flex-col justify-start">
          <label className="mb-2 block text-lg font-medium">
            Document Name
          </label>
          <select
            className="w-full rounded-[16px] border border-[#E6E6E6] p-4 focus:border-[1px] focus:outline-none focus:ring-0"
            onChange={handleChangeDropdown}
            value={documentName}
          >
            <option value="" disabled></option>
            {documentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload Section */}
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex h-[194px] w-full flex-col items-center justify-center rounded-[16px] border-[2px] border-dashed border-[#6438C2] bg-white p-4 text-center md:w-[30%]">
            <p className="mb-4 text-center text-[16px] text-gray-600">
              Drag and drop your files here
              <br />
              <span>OR</span>
            </p>
            <button
              type="button"
              onClick={() => document.getElementById("fileInput")?.click()}
              className="rounded-[16px] bg-[#6438C2] px-6 py-2 text-white"
            >
              Browse Files
            </button>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleFileUpload}
              multiple
            />
          </div>

          {/* Display Selected Files */}
          <div className="flex h-[194px] w-full flex-col gap-2 overflow-auto rounded-[16px] border border-[#E6E6E6] p-4 md:w-[70%]">
            <p className="weight-400 font-lato text-[#8E8E8E]">
              Uploaded files
            </p>

            <div className="flex flex-wrap gap-4">
              {cvDetails?.cvLink && cvDetails?.cvLink !== "" && (
                <div className="flex h-[60px] w-[120px] items-center justify-center gap-2 rounded-[16px] border border-[#E6E6E6] bg-[#F2F5F7] p-3">
                  <div className="flex flex-col items-center">
                    <img
                      src={fileIcon}
                      alt="file icon"
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="truncate text-xs">Resume</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile("Resume")}
                    className="text-lg font-semibold text-black hover:text-gray-400"
                    style={{ fontSize: "20px" }}
                  >
                    &times;
                  </button>
                </div>
              )}

              {cvDetails?.coverLetterLink &&
                cvDetails?.coverLetterLink !== "" && (
                  <div className="flex h-[60px] w-[120px] items-center justify-center gap-2 rounded-[16px] border border-[#E6E6E6] bg-[#F2F5F7] p-3">
                    <div className="flex flex-col items-center">
                      <img
                        src={fileIcon}
                        alt="file icon"
                        className="h-8 w-8 rounded-full"
                      />
                      <span className="truncate text-xs">Cover Letter</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile("Cover Letter")}
                      className="text-lg font-semibold text-black hover:text-gray-400"
                      style={{ fontSize: "20px" }}
                    >
                      &times;
                    </button>
                  </div>
                )}

              {cvDetails?.videoCv && cvDetails?.videoCv !== "" && (
                <div className="flex h-[60px] w-[120px] items-center justify-center gap-2 rounded-[16px] border border-[#E6E6E6] bg-[#F2F5F7] p-3">
                  <div className="flex flex-col items-center">
                    <img
                      src={videoIcon}
                      alt="file icon"
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="truncate text-xs">Video</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile("Video")}
                    className="text-lg font-semibold text-black hover:text-gray-400"
                    style={{ fontSize: "20px" }}
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeAndCoverLetter;
