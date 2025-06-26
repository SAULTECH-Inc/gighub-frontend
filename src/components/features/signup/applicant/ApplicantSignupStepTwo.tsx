import React, { useState, useRef } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import documentAttachment from "../../../../assets/icons/documentAttachment.svg";
import videoAttachment from "../../../../assets/icons/videoAttachment.svg";
import { useAuth } from "../../../../store/useAuth.ts";
import { ApplicantSignupRequest } from "../../../../utils/types";

interface StepTwoProp {
  handleNext: () => void;
  handlePrev: () => void;
}

const ApplicantSignupStepTwo: React.FC<StepTwoProp> = ({
  handleNext,
  handlePrev,
}) => {
  const {
    applicantSignupRequest,
    setApplicantSignupRequest,
    sendVerificationOtp,
  } = useAuth();
  const [triggerError, setTriggerError] = useState({
    documentType: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [documentType, setDocumentType] = useState<string | undefined>(
    applicantSignupRequest?.documentType,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    if (documentType) {
      setTriggerError({ ...triggerError, documentType: false });
      fileInputRef.current?.click();
    } else {
      setTriggerError({ ...triggerError, documentType: true });
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      const newFiles = fileArray.map((file) => ({
        name: file.name,
        progress: 0,
        file,
        icon: getFileIcon(file.name),
      }));
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);

      // Update formData based on documentType
      if (documentType === "resume") {
        setApplicantSignupRequest({
          ...applicantSignupRequest,
          [documentType]: newFiles[0].file,
        } as ApplicantSignupRequest);
      } else if (documentType === "coverLetterLink") {
        setApplicantSignupRequest({
          ...applicantSignupRequest,
          [documentType]: newFiles[0].file,
        } as ApplicantSignupRequest);
      } else if (documentType === "portfolio") {
        setApplicantSignupRequest({
          ...applicantSignupRequest,
          [documentType]: newFiles[0].file,
        } as ApplicantSignupRequest);
      } else if (documentType === "videoCv") {
        setApplicantSignupRequest({
          ...applicantSignupRequest,
          [documentType]: newFiles[0].file,
        } as ApplicantSignupRequest);
      }

      // Simulate file upload progress (replace with actual upload logic)
      newFiles.forEach((file, index) => {
        console.log(index);
        const interval = setInterval(() => {
          setUploadedFiles((prev) => {
            const updatedFiles = [...prev];
            const currentFile = updatedFiles.find((f) => f.name === file.name);
            if (currentFile && currentFile.progress < 100) {
              currentFile.progress += 10; // Increment progress by 10% for simulation
            }
            return updatedFiles;
          });
          if (file.progress >= 100) clearInterval(interval); // Stop when 100% is reached
        }, 500); // Update progress every 500ms (simulated)
      });
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().includes("resume")) {
      return documentAttachment;
    } else if (fileName.toLowerCase().includes("coverLetterLink")) {
      return documentAttachment;
    } else if (fileName.toLowerCase().includes("videoCv")) {
      return videoAttachment;
    }
    return documentAttachment;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  // Remove a file from the list
  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName),
    );
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target as HTMLInputElement & HTMLSelectElement;
    if (name === "documentType") {
      setDocumentType(value);
    } else {
      setApplicantSignupRequest({
        ...applicantSignupRequest,
        [name]: value,
      } as ApplicantSignupRequest);
    }
  };

  const handleProceed = async () => {
    const success = await sendVerificationOtp(
      applicantSignupRequest?.email as string,
      "SIGNUP",
    );
    if (success) {
      handleNext();
    } else {
      return false;
    }
  };

  return (
    <motion.div
      className="mx-auto mt-5 w-[100%] px-[10px] md:mt-32 md:mr-28 md:w-[680px] lg:w-[500px] lg:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full rounded-[16px] border-[1px] border-[#E6E6E6] p-6"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mx-auto flex w-full flex-col justify-center"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-4 text-xl font-bold">Upload Work Experience</h1>

          <select
            className="mb-4 h-[52px] w-full rounded-[16px] border-[2px] border-[#E6E6E6] bg-[#F7F8FA] px-4 py-2 outline-none focus:border-none focus:ring-0"
            onChange={(e) => {
              handleChange(e);
              setDocumentType(e.target.value);
            }}
            name="documentType"
            value={documentType || ""}
          >
            <option value="" disabled>
              Document name
            </option>
            <option value="resume">Resume</option>
            <option value="coverLetterLink">Cover Letter</option>
            <option value="portfolio">Work Samples</option>
            <option value="videoCv">Video CV</option>
          </select>

          <motion.div
            className="mb-4 flex h-[194px] w-full flex-col items-center justify-center rounded-[16px] border-[1px] border-dashed border-[#6438C2] bg-[#f2f5f7]"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()} // Prevent default to allow dropping
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-2 text-center text-gray-600">
              Drag and drop your files here
            </p>
            <span className="my-4">OR</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
              name="workExperience"
              ref={fileInputRef}
              multiple
              disabled={!documentType} // Disable the file input if no document type is selected
            />
            <button
              type="button"
              className="mx-auto flex h-[44px] w-[162px] items-center justify-center rounded-[16px] border border-[#E6E6E6] bg-[#6438C2] font-[13px] text-white hover:bg-[#5931A9] focus:border-none focus:ring-0 focus:outline-none"
              onClick={handleBrowseClick}
              disabled={!documentType} // Disable the button if no document type is selected
            >
              Browse Files
            </button>
          </motion.div>
          {!documentType && triggerError.documentType && (
            <motion.p
              className="mt-2 text-sm text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              * Please select a document name before uploading.
            </motion.p>
          )}

          <motion.p
            className="mt-[20px] text-[16px] text-gray-600"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Uploaded Files
          </motion.p>
          <motion.div
            className="mt-[20px] flex w-full flex-col gap-y-[10px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={index}
                className="flex h-[89px] w-full flex-col items-center gap-y-2 rounded-[16px] border-[1px] border-[#E6E6E6] p-3 md:gap-y-0"
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex w-full items-center justify-between gap-x-3 md:mt-2 md:px-3">
                  <div className="flex items-center gap-x-2">
                    <img src={file.icon} alt="file icon" />
                    <div className="text-sm text-gray-400">
                      {file.name.slice(0, 10).concat("...")}
                    </div>
                  </div>
                  <div className="hidden text-sm text-gray-600 md:flex">
                    {file.progress}% Uploaded
                  </div>
                  <button
                    type="button"
                    className="text-sm text-red-600"
                    onClick={() => handleRemoveFile(file.name)} // Remove file on click
                  >
                    &#10005; {/* Unicode for 'X' symbol */}
                  </button>
                </div>
                <div className="ml-2 self-start text-sm text-gray-600 md:hidden">
                  {file.progress}% Uploaded
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-6 flex w-full justify-end gap-x-4"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          type="button"
          onClick={handlePrev}
          className="h-[44px] w-[162px] rounded-[16px] border border-[#E6E6E6] bg-white font-[13px] text-gray-600 hover:bg-[#F7F8FA] focus:border-none focus:ring-0 focus:outline-none"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleProceed}
          className="h-[44px] w-[162px] rounded-[16px] bg-[#6438C2] font-[13px] text-white hover:bg-[#5931A9] focus:border-none focus:ring-0 focus:outline-none"
        >
          Proceed
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ApplicantSignupStepTwo;
