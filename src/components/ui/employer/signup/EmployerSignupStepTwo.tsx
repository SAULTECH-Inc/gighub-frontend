import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import documentAttachment from "../../../../assets/icons/documentAttachment.svg";
import videoAttachment from "../../../../assets/icons/videoAttachment.svg";
import { toast } from "react-toastify";
import { useAuth } from "../../../../store/useAuth.ts";
import { EmployerSignupRequest } from "../../../../utils/types";

interface StepTwoProp {
  handleNext: () => void;
  handlePrev: () => void;
}

const EmployerSignupStepTwo: React.FC<StepTwoProp> = ({
  handleNext,
  handlePrev,
}) => {
  const {
    error,
    employerSignupRequest,
    setEmployerSignupRequest,
    sendVerificationOtp,
  } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [documentType, setDocumentType] = useState<string | undefined>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [browseClicked, setBrowseClicked] = useState<boolean | undefined>();

  const handleBrowseClick = () => {
    setBrowseClicked(true);
    if (documentType) {
      fileInputRef.current?.click();
    }
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
      setEmployerSignupRequest({
        ...employerSignupRequest,
        [name]: value,
      } as EmployerSignupRequest);
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
      if (documentType === "coverPage") {
        setEmployerSignupRequest({
          ...employerSignupRequest,
          [documentType]: newFiles[0].file,
        } as EmployerSignupRequest);
      } else if (documentType === "companyLogo") {
        setEmployerSignupRequest({
          ...employerSignupRequest,
          [documentType]: newFiles[0].file,
        } as EmployerSignupRequest);
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
    } else if (fileName.toLowerCase().includes("cover letter")) {
      return documentAttachment;
    } else if (fileName.toLowerCase().includes("video")) {
      return videoAttachment;
    }
    return documentAttachment;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName),
    );
  };

  const handleSendOtp = async () => {
    const success = await sendVerificationOtp(
      employerSignupRequest?.email as string,
      "SIGNUP",
    );
    if (success) {
      toast.success("Verification OTP sent successfully!");
      handleNext();
    } else {
      toast.error(
        error || "Failed to send verification OTP. Please try again later.",
      );
      return false;
    }
  };

  return (
    <motion.div
      className="w-[95%] px-[10px] md:mr-28 md:mt-32 md:w-[680px] lg:w-[500px] lg:px-0 mx-auto"
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
          <h1 className="mb-4 text-xl font-bold">Company Page Setup</h1>

          <motion.div
            className="relative mb-4 w-full"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.label
              className="mb-2 block text-[13px] font-medium text-[#000000]"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
              htmlFor="company-website"
            >
              Company Website
            </motion.label>
            <input
              type="text"
              className="w-full rounded-[16px] border-[2px] border-[#E6E6E6] bg-[#F7F8FA] px-4 py-2 outline-none focus:border-[2px] focus:border-[#E6E6E6] focus:ring-0"
              name="companyWebsite"
              value={employerSignupRequest?.companyWebsite}
              placeholder="https://example.com"
              onChange={handleChange}
              id="company-website"
            />
          </motion.div>

          <select
            className="mb-4 h-[52px] w-full rounded-[16px] border-[2px] border-[#E6E6E6] bg-[#F7F8FA] px-4 py-2 outline-none focus:border-[2px] focus:border-[#E6E6E6] focus:ring-0"
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
            <option value="coverPage">Cover Page</option>
            <option value="companyLogo">Company Logo</option>
          </select>

          <motion.div
            className="mb-4 flex h-[194px] w-full flex-col items-center justify-center rounded-[16px] border-[1px] border-dashed border-[#6438C2] bg-[#f2f5f7]"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-600 mb-2 text-center">
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
              disabled={!documentType}
            />
            <button
              type="button"
              className="mx-auto flex h-[44px] w-[162px] items-center justify-center rounded-[16px] border border-[#E6E6E6] bg-[#6438C2] font-[13px] text-white hover:bg-[#5931A9] focus:border-none focus:outline-none focus:ring-0"
              onClick={handleBrowseClick}
              disabled={!documentType}
            >
              Browse Files
            </button>
          </motion.div>
          {!documentType && browseClicked && (
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
            className="text-gray-600 mt-[20px] text-sm md:text-[16px]"
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
                className="flex h-[89px] w-full items-center justify-between rounded-[16px] border-[1px] border-[#E6E6E6] p-3"
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-x-2">
                  <img src={file.icon} alt="file icon" />
                  <div className="text-gray-400 text-xs md:text-sm">
                    {file.name}
                  </div>
                </div>
                <div className="text-gray-600 text-xs md:text-sm">
                  {file.progress}% Uploaded
                </div>
                <button
                  type="button"
                  className="text-sm text-red-600"
                  onClick={() => handleRemoveFile(file.name)}
                >
                  &#10005;
                </button>
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
          className="text-gray-600 h-[44px] w-[162px] rounded-[16px] border border-[#E6E6E6] bg-white font-[13px] hover:bg-[#F7F8FA] focus:border-none focus:outline-none focus:ring-0"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSendOtp}
          className="h-[44px] w-[162px] rounded-[16px] bg-[#6438C2] font-[13px] text-white hover:bg-[#5931A9] focus:border-none focus:outline-none focus:ring-0"
        >
          Proceed
        </button>
      </motion.div>
    </motion.div>
  );
};

export default EmployerSignupStepTwo;
