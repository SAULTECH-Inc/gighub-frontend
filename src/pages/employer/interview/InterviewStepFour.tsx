import React, { useCallback, useState, useMemo } from "react";
import {
  FileText,
  Upload,
  X,
  Tag,
  Users,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye
} from "lucide-react";
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

interface ValidationErrors {
  notes?: string;
  general?: string;
}

// File type configurations
const ALLOWED_FILE_TYPES = {
  'application/pdf': { ext: '.pdf', icon: FileText, color: 'text-red-500' },
  'application/msword': { ext: '.doc', icon: FileText, color: 'text-blue-500' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: '.docx', icon: FileText, color: 'text-blue-500' },
  'text/plain': { ext: '.txt', icon: FileText, color: 'text-gray-500' },
  'image/jpeg': { ext: '.jpg', icon: Eye, color: 'text-green-500' },
  'image/png': { ext: '.png', icon: Eye, color: 'text-green-500' },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

const InterviewStepFour: React.FC = () => {
  const { openModal, closeModal } = useModalStore();
  const { prevStep, interviewDetails, setInterviewDetails, reset, selectedCandidates, selectedJob } = useScheduleInterview();
  const { employer } = useAuth();

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [dragActive, setDragActive] = useState(false);

  // Format date for display
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  // Format duration
  const formatDuration = useCallback((minutes: number) => {
    if (minutes === 0) return "0 minutes";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} minutes`;
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${mins}m`;
  }, []);

  // Get interview type icon and label
  const getInterviewTypeInfo = useMemo(() => {
    const type = interviewDetails?.interviewType;
    switch (type) {
      case 'virtual-meeting':
        return { icon: Video, label: 'Virtual Meeting', color: 'text-blue-600' };
      case 'phone-call':
        return { icon: Phone, label: 'Phone Call', color: 'text-green-600' };
      case 'in-person':
        return { icon: MapPin, label: 'In-Person', color: 'text-purple-600' };
      case 'hybrid':
        return { icon: Globe, label: 'Hybrid', color: 'text-orange-600' };
      default:
        return { icon: Calendar, label: type || 'Interview', color: 'text-gray-600' };
    }
  }, [interviewDetails?.interviewType]);

  // Validate form
  const validateForm = useCallback((): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (interviewDetails?.notes && interviewDetails.notes.length > 1000) {
      newErrors.notes = "Notes cannot exceed 1000 characters.";
    }

    return newErrors;
  }, [interviewDetails?.notes]);

  // Handle notes change
  const handleNotesChange = useCallback((value: string) => {
    setInterviewDetails({
      ...interviewDetails,
      notes: value,
    } as InterviewScheduleDetails);

    // Clear notes error
    if (errors.notes) {
      setErrors(prev => ({ ...prev, notes: undefined }));
    }
  }, [interviewDetails, setInterviewDetails, errors.notes]);

  // Handle tag input
  const handleTagInput = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const input = event.target as HTMLInputElement;
      const value = input.value.trim();

      if (value && value.length <= 50) {
        const currentTags = interviewDetails?.tags || [];
        if (!currentTags.includes(value) && currentTags.length < 10) {
          setInterviewDetails({
            ...interviewDetails,
            tags: [...currentTags, value],
          } as InterviewScheduleDetails);
        }
        input.value = "";
      }
    }
  }, [interviewDetails, setInterviewDetails]);

  // Remove tag
  const handleTagRemoval = useCallback((tagToRemove: string) => {
    const currentTags = interviewDetails?.tags || [];
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    setInterviewDetails({
      ...interviewDetails,
      tags: updatedTags,
    } as InterviewScheduleDetails);
  }, [interviewDetails, setInterviewDetails]);

  // File validation
  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" is too large. Maximum size is 10MB.`;
    }

    if (!ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES]) {
      return `File "${file.name}" type is not supported.`;
    }

    const currentFiles = interviewDetails?.files || [];
    if (currentFiles.length >= MAX_FILES) {
      return `Maximum ${MAX_FILES} files allowed.`;
    }

    return null;
  }, [interviewDetails?.files]);

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setErrors(prev => ({ ...prev, general: validationError }));
        continue;
      }

      const fileId = `${file.name}-${Date.now()}`;
      setUploadingFiles(prev => new Set(prev).add(fileId));

      try {
        const response = await uploadFile(
          employer?.id as number,
          file,
          Action.FILE_UPLOAD,
          UserType.EMPLOYER,
          "Interview Files",
        );

        if (response.statusCode === 200) {
          const newFile = response.data.url;
          const updatedFiles = [...(interviewDetails?.files || []), newFile];
          setInterviewDetails({
            ...interviewDetails,
            files: updatedFiles,
          } as InterviewScheduleDetails);

          // Clear general error on successful upload
          setErrors(prev => ({ ...prev, general: undefined }));
        } else {
          setErrors(prev => ({ ...prev, general: `Failed to upload ${file.name}` }));
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, general: `Error uploading ${file.name}` }));
      } finally {
        setUploadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      }
    }
  }, [validateFile, employer?.id, interviewDetails, setInterviewDetails]);

  // Handle file removal
  const handleFileRemoval = useCallback(async (fileUrl: string, index: number) => {
    try {
      const response = await removeUploadedFile(
        employer?.id as number,
        fileUrl,
        Action.DELETING_A_FILE,
        UserType.EMPLOYER,
        "Interview Files",
      );

      if (response.statusCode === 200) {
        const files = interviewDetails?.files || [];
        const updatedFiles = files.filter((_, i) => i !== index);
        setInterviewDetails({
          ...interviewDetails,
          files: updatedFiles,
        } as InterviewScheduleDetails);
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, general: "Failed to remove file" }));
    }
  }, [employer?.id, interviewDetails, setInterviewDetails]);

  // File drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  // File input trigger
  const triggerFileInput = useCallback(() => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = Object.keys(ALLOWED_FILE_TYPES).join(",");
    fileInput.multiple = true;

    fileInput.onchange = (event) => {
      const input = event.target as HTMLInputElement;
      if (input.files) {
        handleFileUpload(input.files);
      }
    };

    fileInput.click();
  }, [handleFileUpload]);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await saveInterviewDetails(
        interviewDetails as InterviewScheduleDetails,
      );

      if (response.statusCode === 200) {
        reset();
        closeModal("interview-schedule");
        openModal("success-modal");
      } else {
        setErrors({ general: "Failed to schedule interview. Please try again." });
      }
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, interviewDetails, reset, closeModal, openModal]);

  // Get file info
  const getFileInfo = useCallback((fileUrl: string, index: number) => {
    const fileName = `File ${index + 1}`;
    const extension = fileUrl.slice(-4);
    const fileType = Object.entries(ALLOWED_FILE_TYPES).find(([_, config]) =>
      extension.includes(config.ext)
    );

    return {
      name: fileName + extension,
      icon: fileType?.[1].icon || FileText,
      color: fileType?.[1].color || 'text-gray-500'
    };
  }, []);

  const TypeIcon = getInterviewTypeInfo.icon;

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex min-h-[400px] w-[96%] max-w-[900px] flex-col items-center rounded-[10px] bg-white py-6">
        <div className="flex w-[95%] flex-col gap-6">

          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-6 w-6 text-[#6438C2]" />
              <h4 className="text-xl font-bold text-[#000000] sm:text-2xl">
                Review & Submit
              </h4>
            </div>
            <p className="text-sm text-gray-600 sm:text-base">
              Review your interview details and add any additional information
            </p>
          </div>

          {/* Interview Summary */}
          <section className="space-y-4">
            <h5 className="text-lg font-semibold text-gray-900">Interview Summary</h5>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Candidates */}
              <div className="rounded-[10px] border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-[#6438C2]" />
                  <h6 className="font-medium text-gray-900">Candidates</h6>
                </div>
                <div className="space-y-2">
                  {selectedCandidates.map((candidate, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#56E5A1]" />
                      <span className="text-sm text-gray-700">
                        {candidate.firstName} {candidate.lastName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job */}
              <div className="rounded-[10px] border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="h-5 w-5 text-[#6438C2]" />
                  <h6 className="font-medium text-gray-900">Position</h6>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">{selectedJob?.title}</p>
                  <p className="text-xs text-gray-500">{selectedJob?.company} • {selectedJob?.department}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="rounded-[10px] border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-[#6438C2]" />
                  <h6 className="font-medium text-gray-900">Schedule</h6>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">
                    {interviewDetails?.date && formatDate(interviewDetails.date)}
                  </p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {interviewDetails?.startTime} - {interviewDetails?.endTime}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Duration: {formatDuration(interviewDetails?.duration || 0)}
                  </p>
                </div>
              </div>

              {/* Interview Type */}
              <div className="rounded-[10px] border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TypeIcon className={`h-5 w-5 ${getInterviewTypeInfo.color}`} />
                  <h6 className="font-medium text-gray-900">Type</h6>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">{getInterviewTypeInfo.label}</p>
                  {interviewDetails?.interviewPlatform && (
                    <p className="text-xs text-gray-500">Platform: {interviewDetails.interviewPlatform}</p>
                  )}
                  {interviewDetails?.interviewLink && (
                    <p className="text-xs text-gray-500 truncate">Link: {interviewDetails.interviewLink}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Notes Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#6438C2]" />
              <h5 className="text-lg font-semibold text-gray-900">Notes & Instructions</h5>
            </div>

            <div className="space-y-2">
              <textarea
                placeholder="Add any special instructions, preparation notes, or important details for the interview..."
                value={interviewDetails?.notes || ""}
                onChange={(e) => handleNotesChange(e.target.value)}
                className={`h-32 w-full resize-none rounded-[15px] border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  errors.notes
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                    : "border-[#E6E6E6] bg-white focus:border-[#6438C2] focus:ring-[#6438C2]/20"
                }`}
                maxLength={1000}
              />

              <div className="flex items-center justify-between">
                {errors.notes && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.notes}</span>
                  </div>
                )}
                <span className="text-xs text-gray-500 ml-auto">
                  {(interviewDetails?.notes || "").length}/1000
                </span>
              </div>
            </div>
          </section>

          {/* Tags Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-[#6438C2]" />
              <h5 className="text-lg font-semibold text-gray-900">Tags</h5>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Add tags (press Enter or comma to add)"
                onKeyDown={handleTagInput}
                className="w-full rounded-[15px] border border-[#E6E6E6] px-4 py-3 text-sm transition-colors focus:border-[#6438C2] focus:outline-none focus:ring-2 focus:ring-[#6438C2]/20"
                maxLength={50}
              />

              {/* Display tags */}
              {interviewDetails?.tags && interviewDetails.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {interviewDetails.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-[10px] bg-[#6438C2] px-3 py-1 text-white"
                    >
                      <span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleTagRemoval(tag)}
                        className="rounded-full p-0.5 transition-colors hover:bg-white/20"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500">
                Add relevant tags like "technical", "senior", "remote", etc. ({(interviewDetails?.tags || []).length}/10)
              </p>
            </div>
          </section>

          {/* File Upload Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-[#6438C2]" />
              <h5 className="text-lg font-semibold text-gray-900">Attachments</h5>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`rounded-[15px] border-2 border-dashed p-6 text-center transition-colors ${
                dragActive
                  ? "border-[#6438C2] bg-[#6438C2]/5"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <Upload className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Drop files here or{" "}
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="text-[#6438C2] hover:underline"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, TXT, JPG, PNG up to 10MB each (max {MAX_FILES} files)
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded Files */}
            {interviewDetails?.files && interviewDetails.files.length > 0 && (
              <div className="space-y-2">
                <h6 className="text-sm font-medium text-gray-700">Uploaded Files:</h6>
                <div className="space-y-2">
                  {interviewDetails.files.map((file, index) => {
                    const fileInfo = getFileInfo(file, index);
                    const FileIcon = fileInfo.icon;

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-[10px] border border-gray-200 bg-gray-50 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileIcon className={`h-5 w-5 ${fileInfo.color}`} />
                          <span className="text-sm text-gray-700">{fileInfo.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileRemoval(file, index)}
                          className="rounded-full p-1 text-red-500 transition-colors hover:bg-red-50"
                          aria-label={`Remove ${fileInfo.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upload progress */}
            {uploadingFiles.size > 0 && (
              <div className="space-y-2">
                <h6 className="text-sm font-medium text-gray-700">Uploading:</h6>
                {Array.from(uploadingFiles).map((fileId) => (
                  <div key={fileId} className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#6438C2]" />
                    <span className="text-sm text-gray-600">Uploading file...</span>
                  </div>
                ))}
              </div>
            )}

            {errors.general && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.general}</span>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Navigation */}
      <div className="mx-2 my-4 flex w-[96%] max-w-[900px] justify-end gap-4">
        <button
          onClick={prevStep}
          disabled={isSubmitting}
          className="rounded-[15px] border border-[#E6E6E6] bg-[#F7F7F7] px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || uploadingFiles.size > 0}
          className="flex items-center gap-2 rounded-[15px] bg-[#6438C2] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5329a8] focus:outline-none focus:ring-2 focus:ring-[#6438C2] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scheduling...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Schedule Interview
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InterviewStepFour;