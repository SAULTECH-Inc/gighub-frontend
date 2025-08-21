import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import documentAttachment from "../../../../assets/icons/documentAttachment.svg";
import videoAttachment from "../../../../assets/icons/videoAttachment.svg";
import { useAuth } from "../../../../store/useAuth.ts";
import { ApplicantSignupRequest } from "../../../../utils/types";
import { toast } from "react-toastify";
import {
  Upload,
  X,
  File,
  FileText,
  Video,
  Briefcase,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

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
  type: string;
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

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [documentType, setDocumentType] = useState<string>(
    applicantSignupRequest?.documentType || ""
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentOptions = [
    { value: "", label: "Select document type", disabled: true, icon: File },
    { value: "resume", label: "Resume/CV", icon: FileText },
    { value: "coverLetterLink", label: "Cover Letter", icon: FileText },
    { value: "portfolio", label: "Work Samples/Portfolio", icon: Briefcase },
    { value: "videoCv", label: "Video CV", icon: Video },
  ];

  const generateFileId = () => Math.random().toString(36).substr(2, 9);

  const handleBrowseClick = () => {
    if (documentType) {
      setShowError(false);
      fileInputRef.current?.click();
    } else {
      setShowError(true);
    }
  };

  const getFileIcon = (fileName: string, docType: string) => {
    const name = fileName.toLowerCase();
    if (docType === "videoCv" || name.includes("video") || name.endsWith('.mp4') || name.endsWith('.avi')) {
      return videoAttachment;
    }
    return documentAttachment;
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!documentType) {
      setShowError(true);
      return;
    }

    const fileArray = Array.from(files);
    const maxSize = 10 * 1024 * 1024; // 10MB limit

    // Validate file sizes
    const oversizedFiles = fileArray.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast.error(`Files must be smaller than 10MB. Please reduce file size and try again.`);
      return;
    }

    const newFiles: UploadedFile[] = fileArray.map((file) => ({
      name: file.name,
      progress: 0,
      file,
      icon: getFileIcon(file.name, documentType),
      id: generateFileId(),
      type: documentType,
    }));

    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Update formData based on documentType
    const documentTypeMap: { [key: string]: string } = {
      resume: "resume",
      coverLetterLink: "coverLetterLink",
      portfolio: "portfolio",
      videoCv: "videoCv"
    };

    if (documentTypeMap[documentType]) {
      setApplicantSignupRequest({
        ...applicantSignupRequest,
        [documentTypeMap[documentType]]: newFiles[0].file,
      } as ApplicantSignupRequest);
    }

    // Simulate file upload progress
    newFiles.forEach((newFile) => {
      const interval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === newFile.id && file.progress < 100
              ? { ...file, progress: Math.min(file.progress + 10, 100) }
              : file
          )
        );
      }, 300);

      // Clear interval when progress reaches 100%
      setTimeout(() => clearInterval(interval), 3000);
    });
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
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "documentType") {
      setDocumentType(value);
      setShowError(false);
    } else {
      setApplicantSignupRequest({
        ...applicantSignupRequest,
        [name]: value,
      } as ApplicantSignupRequest);
    }
  };

  const handleProceed = async () => {
    setIsLoading(true);
    try {
      const success = await sendVerificationOtp(
        applicantSignupRequest?.email as string,
        "SIGNUP"
      );
      if (success) {
        toast.success("Verification code sent to your email!");
        handleNext();
      } else {
        toast.error("Failed to send verification code. Please try again.");
      }
    } catch (error: any) {
      toast.error("An error occurred. Please try again."+error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileTypeIcon = (fileName: string, fileType: string) => {
    if (fileType === "videoCv") return <Video className="w-5 h-5 text-purple-600" />;
    if (fileName.toLowerCase().includes("resume")) return <FileText className="w-5 h-5 text-blue-600" />;
    if (fileName.toLowerCase().includes("portfolio")) return <Briefcase className="w-5 h-5 text-green-600" />;
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
          className="text-2xl sm:text-3xl font-semibold text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Upload Your Documents
        </motion.h2>
        <motion.p
          className="text-gray-600 text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Share your work experience and showcase your professional background
        </motion.p>
      </div>

      {/* Main Form Card */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Document Type Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <File className="inline w-4 h-4 mr-2" />
            Document Type
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            name="documentType"
            value={documentType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6438C2] focus:border-transparent transition-colors hover:border-gray-400 bg-white"
          >
            {documentOptions.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload Area */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Upload className="inline w-4 h-4 mr-2" />
            Upload Files
          </label>

          <motion.div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
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
              accept={documentType === "videoCv" ? ".mp4,.avi,.mov,.wmv" : ".pdf,.doc,.docx,.jpg,.jpeg,.png"}
            />

            <div className="space-y-4">
              <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                documentType ? "bg-purple-100" : "bg-gray-100"
              }`}>
                <Upload className={`w-6 h-6 ${
                  documentType ? "text-[#6438C2]" : "text-gray-400"
                }`} />
              </div>

              <div>
                <p className={`text-base font-medium ${
                  documentType ? "text-gray-700" : "text-gray-500"
                }`}>
                  Drag and drop your files here
                </p>
                <p className="text-sm text-gray-500 mt-1">or</p>
              </div>

              <button
                type="button"
                onClick={handleBrowseClick}
                disabled={!documentType}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  documentType
                    ? "bg-[#6438C2] text-white hover:bg-[#5931A9] active:transform active:scale-95"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Browse Files
              </button>

              {documentType && (
                <div className="text-xs text-gray-500 mt-2">
                  {documentType === "videoCv"
                    ? "Supported formats: MP4, AVI, MOV, WMV (Max 10MB)"
                    : "Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)"
                  }
                </div>
              )}
            </div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {!documentType && showError && (
              <motion.div
                className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
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
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <File className="w-4 h-4" />
                Uploaded Files ({uploadedFiles.length})
              </h4>

              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    className="bg-gray-50 rounded-lg border p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 mt-1">
                          {getFileTypeIcon(file.name, file.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                            {file.name}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">
                              {formatFileSize(file.file.size)}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">
                              {file.type.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-600">
                                {file.progress === 100 ? (
                                  <span className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-3 h-3" />
                                    Complete
                                  </span>
                                ) : (
                                  `Uploading... ${file.progress}%`
                                )}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                className={`h-2 rounded-full transition-colors ${
                                  file.progress === 100 ? "bg-green-500" : "bg-[#6438C2]"
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${file.progress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Tips */}
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-start gap-2">
            <File className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">💡 Upload tips:</p>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>Keep file names professional and descriptive</li>
                <li>Use PDF format for documents when possible</li>
                <li>Ensure video files are clear and well-lit</li>
                <li>Keep file sizes under 10MB for faster upload</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 sm:justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <button
          type="button"
          onClick={handlePrev}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          type="button"
          onClick={handleProceed}
          disabled={isLoading}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#6438C2] hover:bg-[#5931A9] active:transform active:scale-[0.98]"
          } focus:ring-2 focus:ring-purple-100 focus:ring-offset-2`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending Code...
            </div>
          ) : (
            "Continue"
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ApplicantSignupStepTwo;