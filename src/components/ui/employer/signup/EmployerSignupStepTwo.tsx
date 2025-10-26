import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import documentAttachment from "../../../../assets/icons/documentAttachment.svg";
import videoAttachment from "../../../../assets/icons/videoAttachment.svg";
import { toast } from "react-toastify";
import { useAuth } from "../../../../store/useAuth.ts";
import { EmployerSignupRequest } from "../../../../utils/types";
import { Upload, X, File, Globe, CheckCircle, AlertCircle } from "lucide-react";

interface StepTwoProp {
  handleNext: () => void;
  handlePrev: () => void;
}

interface UploadedFile {
  name: string;
  progress: number;
  file: File;
  icon: string;
  id: string;
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

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [documentType, setDocumentType] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [browseClicked, setBrowseClicked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const { name, value } = e.target;
    if (name === "documentType") {
      setDocumentType(value);
    } else {
      setEmployerSignupRequest({
        ...employerSignupRequest,
        [name]: value,
      } as EmployerSignupRequest);
    }
  };

  const generateFileId = () => Math.random().toString(36).substr(2, 9);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!documentType) {
      setBrowseClicked(true);
      return;
    }

    const fileArray = Array.from(files);
    const newFiles: UploadedFile[] = fileArray.map((file) => ({
      name: file.name,
      progress: 0,
      file,
      icon: getFileIcon(file.name),
      id: generateFileId(),
    }));

    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Update formData based on documentType
    if (documentType === "coverPage" || documentType === "companyLogo") {
      setEmployerSignupRequest({
        ...employerSignupRequest,
        [documentType]: newFiles[0].file,
      } as EmployerSignupRequest);
    }

    // Simulate file upload progress
    newFiles.forEach((newFile) => {
      const interval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === newFile.id && file.progress < 100
              ? { ...file, progress: Math.min(file.progress + 10, 100) }
              : file,
          ),
        );
      }, 300);

      // Clear interval when progress reaches 100%
      setTimeout(() => clearInterval(interval), 3000);
    });
  };

  const getFileIcon = (fileName: string) => {
    const name = fileName.toLowerCase();
    if (
      name.includes("video") ||
      name.endsWith(".mp4") ||
      name.endsWith(".avi")
    ) {
      return videoAttachment;
    }
    return documentAttachment;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.id !== fileId),
    );
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
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
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const documentOptions = [
    { value: "", label: "Select document type", disabled: true },
    { value: "coverPage", label: "Cover Page" },
    { value: "companyLogo", label: "Company Logo" },
  ];

  return (
    <motion.div
      className="w-full space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="space-y-2">
        <motion.h2
          className="text-2xl font-semibold text-gray-900 sm:text-3xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Company Page Setup
        </motion.h2>
        <motion.p
          className="text-sm text-gray-600 sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Add your company details and upload required documents
        </motion.p>
      </div>

      {/* Main Form Card */}
      <motion.div
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Company Website */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Globe className="mr-1 inline h-4 w-4" />
            Company Website
          </label>
          <input
            type="url"
            name="companyWebsite"
            value={employerSignupRequest?.companyWebsite || ""}
            onChange={handleChange}
            placeholder="https://example.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors hover:border-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#6438C2]"
          />
        </div>

        {/* Document Type Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <File className="mr-1 inline h-4 w-4" />
            Document Type
          </label>
          <select
            name="documentType"
            value={documentType}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 transition-colors hover:border-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#6438C2]"
          >
            {documentOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload Area */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Upload className="mr-1 inline h-4 w-4" />
            Upload Documents
          </label>

          <motion.div
            className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 ${
              isDragOver
                ? "border-[#6438C2] bg-purple-50"
                : documentType
                  ? "border-gray-300 hover:border-[#6438C2] hover:bg-gray-50"
                  : "border-gray-200 bg-gray-50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            whileHover={documentType ? { scale: 1.01 } : {}}
            transition={{ duration: 0.2 }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.avi"
            />

            <div className="space-y-4">
              <Upload
                className={`mx-auto h-8 w-8 ${
                  documentType ? "text-[#6438C2]" : "text-gray-400"
                }`}
              />
              <div>
                <p
                  className={`text-base font-medium ${
                    documentType ? "text-gray-700" : "text-gray-500"
                  }`}
                >
                  Drag and drop your files here
                </p>
                <p className="mt-1 text-sm text-gray-500">or</p>
              </div>

              <button
                type="button"
                onClick={handleBrowseClick}
                disabled={!documentType}
                className={`rounded-lg px-6 py-2 font-medium transition-all duration-200 ${
                  documentType
                    ? "bg-[#6438C2] text-white hover:bg-[#5931A9] active:scale-95 active:transform"
                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                }`}
              >
                Browse Files
              </button>
            </div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {!documentType && browseClicked && (
              <motion.div
                className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                Please select a document type before uploading files.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Uploaded Files */}
        <AnimatePresence>
          {uploadedFiles.length > 0 && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <File className="h-4 w-4" />
                Uploaded Files ({uploadedFiles.length})
              </h4>

              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border bg-gray-50 p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <img
                        src={file.icon}
                        alt="File icon"
                        className="h-6 w-6 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-2 max-w-32 flex-1 rounded-full bg-gray-200">
                            <motion.div
                              className="h-2 rounded-full bg-[#6438C2]"
                              initial={{ width: 0 }}
                              animate={{ width: `${file.progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <span className="flex items-center gap-1 text-xs text-gray-600">
                            {file.progress === 100 ? (
                              <>
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                Complete
                              </>
                            ) : (
                              `${file.progress}%`
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        className="flex flex-col gap-3 sm:flex-row sm:justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <button
          type="button"
          onClick={handlePrev}
          className="w-full rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={isLoading}
          className={`w-full rounded-lg px-6 py-3 font-medium text-white transition-all duration-200 sm:w-auto ${
            isLoading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-[#6438C2] hover:bg-[#5931A9] active:scale-[0.98] active:transform"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sending OTP...
            </div>
          ) : (
            "Continue"
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default EmployerSignupStepTwo;
