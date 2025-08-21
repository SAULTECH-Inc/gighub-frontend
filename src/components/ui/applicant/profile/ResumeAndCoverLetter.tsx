import React, { useState } from "react";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import { CvResponseDto, FileUploadRequest } from "../../../../utils/types";
import { useAuth } from "../../../../store/useAuth.ts";
import { Action, UserType } from "../../../../utils/enums.ts";
import { toast } from "react-toastify";
import {
  FileText,
  Video,
  Upload,
  X,
  CheckCircle2,
  FolderOpen,
  Eye
} from "lucide-react";

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
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && documentName) {
      setIsUploading(true);
      const singleFile = files[0];

      try {
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
          toast.success(`${documentName} uploaded successfully!`);
        } else {
          toast.error("Failed to upload file. Please try again later.");
        }
      } catch (error) {
        toast.error("Failed to upload file. Please try again later.");
      } finally {
        setIsUploading(false);
      }
    } else if (!documentName) {
      toast.error("Please select a document type first.");
    }
  };

  const removeFile = async (fileName: string) => {
    try {
      const response = await deleteProfileFile({
        userId: applicant?.id,
        fileUrl:
          fileName === "Video"
            ? cvDetails?.videoCv
            : fileName === "Resume"
              ? cvDetails?.cvLink
              : cvDetails?.coverLetterLink,
        whatIsTheItem: fileName,
        userType: UserType.APPLICANT,
        action: Action.DELETE_PROFILE_FILE,
      } as FileUploadRequest);

      if (response) {
        setCvDetails({
          ...cvDetails,
          [getField(fileName)]: null,
        } as CvResponseDto);
        toast.success(`${fileName} removed successfully!`);
      } else {
        toast.error("Failed to delete file. Please try again later.");
      }
    } catch (error) {
      toast.error("Failed to delete file. Please try again later.");
    }
  };

  const handleChangeDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentName(e.target.value);
  };

  const documentOptions = [
    { value: "Resume", label: "Resume/CV", icon: FileText },
    { value: "Cover Letter", label: "Cover Letter", icon: FileText },
    { value: "Video", label: "Video CV", icon: Video },
  ];

  // Get file icon based on type
// Get uploaded files
  const uploadedFiles = [
    {
      name: "Resume",
      url: cvDetails?.cvLink,
      icon: FileText,
      color: "blue"
    },
    {
      name: "Cover Letter",
      url: cvDetails?.coverLetterLink,
      icon: FileText,
      color: "green"
    },
    {
      name: "Video",
      url: cvDetails?.videoCv,
      icon: Video,
      color: "purple"
    },
  ].filter(file => file.url && file.url !== "");

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "green":
        return "bg-green-50 border-green-200 text-green-800";
      case "purple":
        return "bg-purple-50 border-purple-200 text-purple-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <section id="resume-cover-letter" className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <FolderOpen className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Documents & Media</h3>
            <p className="text-sm text-gray-500">Upload your resume, cover letter, and video CV</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="space-y-6">
          {/* Document Type Selection */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Document Type
            </h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select document type to upload
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all duration-200"
                onChange={handleChangeDropdown}
                value={documentName}
              >
                <option value="" disabled>Choose document type...</option>
                {documentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Upload Files
              </h4>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors duration-200">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Upload className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop your files here
                    </p>
                    <p className="text-xs text-gray-500 mb-4">or</p>

                    <button
                      type="button"
                      onClick={() => document.getElementById("fileInput")?.click()}
                      disabled={!documentName || isUploading}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 mx-auto"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Browse Files
                        </>
                      )}
                    </button>
                  </div>

                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept={documentName === "Video" ? "video/*" : ".pdf,.doc,.docx"}
                  />
                </div>
              </div>

              {!documentName && (
                <div className="mt-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  💡 Please select a document type first before uploading.
                </div>
              )}
            </div>

            {/* Uploaded Files Display */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Uploaded Files
              </h4>

              <div className="space-y-3">
                {uploadedFiles.length > 0 ? (
                  uploadedFiles.map(({ color, icon: IconComponent, name, url }, index) => {
                    return (
                      <div
                        key={index}
                        className={`group flex items-center justify-between rounded-lg border p-4 transition-all duration-200 hover:shadow-sm ${getColorClasses(color)}`}
                      >
                        <div className="flex flex-1 items-center gap-3">
                          <div
                            className={`rounded-lg p-2 ${color === "blue" ? "bg-blue-200" : color === "green" ? "bg-green-200" : "bg-purple-200"}`}
                          >
                            <IconComponent
                              className={`h-4 w-4 ${color === "blue" ? "text-blue-700" : color === "green" ? "text-green-700" : "text-purple-700"}`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {name}
                              </span>
                              <CheckCircle2
                                className={`h-4 w-4 ${color === "blue" ? "text-blue-600" : color === "green" ? "text-green-600" : "text-purple-600"}`}
                              />
                            </div>
                            <p className="text-xs opacity-75">
                              Successfully uploaded
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (url) {
                                return window.open(url, "_blank");
                              }
                            }}
                            className={`rounded-lg p-2 transition-colors duration-200 ${color === "blue" ? "text-blue-600 hover:bg-blue-200" : color === "green" ? "text-green-600 hover:bg-green-200" : "text-purple-600 hover:bg-purple-200"}`}
                            title="View file"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile(name)}
                            className="rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                            title="Remove file"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
                    <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm font-medium">No files uploaded yet</p>
                    <p className="text-xs text-gray-400 mt-1">Upload your documents to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Upload Guidelines:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Resume/CV:</strong> Upload your most recent version in PDF format</li>
              <li>• <strong>Cover Letter:</strong> Tailor it to highlight relevant experience</li>
              <li>• <strong>Video CV:</strong> Keep it professional and under 2 minutes</li>
              <li>• <strong>File Size:</strong> Maximum 10MB per file for optimal performance</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeAndCoverLetter;