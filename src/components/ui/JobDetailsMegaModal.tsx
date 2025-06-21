// Re-importing from react-icons as per your original code
import { MdClose } from "react-icons/md";
import {
  FaBuilding,
  FaBriefcase,
  FaUserTie,
  FaChartLine,
  FaInfoCircle,
  FaHourglassHalf,
  FaDollarSign,
  FaUsers,
} from "react-icons/fa";
// Assuming useModalStore is correctly implemented and imported from your store
import useModalStore from "../../store/modalStateStores";
import DOMPurify from "dompurify";
import { JobPostResponse, JobStatus } from "../../utils/types";
import React, { useCallback, useEffect } from "react";
import numeral from "numeral"; // DOMPurify import

interface JobDetailsMegaModalProps {
  modalId: string;
  job: JobPostResponse;
}

const JobDetailsMegaModal: React.FC<JobDetailsMegaModalProps> = ({
  modalId,
  job,
}) => {
  const { isModalOpen, closeModal } = useModalStore();
  if (!isModalOpen(modalId)) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const close = useCallback(() => closeModal(modalId), [closeModal, modalId]);

  // Helper function to format dates (handles Date objects or date strings)
  const formatDate = (dateInput: Date | string): string => {
    if (!dateInput) return "N/A";
    const date = new Date(dateInput);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle keyboard events for closing the modal (e.g., pressing Escape)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    },
    [close],
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      className="font-inter fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-20 px-2 pb-10 pt-16 md:px-6"
      onClick={close}
    >
      <div
        className="border-gray-100 relative max-h-screen w-full max-w-6xl scale-100 transform overflow-y-auto rounded-3xl border bg-white p-6 opacity-100 shadow-2xl transition-all duration-300 ease-out md:max-h-max md:overflow-y-visible md:p-10"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-modal-title"
        aria-describedby="job-modal-description"
      >
        {/* Header with improved styling */}
        <div className="border-gray-200 mb-6 flex items-center justify-end border-b pb-4">
          <button
            onClick={close}
            className="text-gray-500 rounded-full p-1 transition-colors duration-200 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            aria-label="Close modal"
          >
            <MdClose size={24} /> {/* React Icon */}
          </button>
        </div>

        {/* Title and Info - Enhanced typography */}
        <div className="mb-6 space-y-2 text-center md:text-left">
          <h2
            id="job-modal-title"
            className="text-gray-900 text-3xl font-extrabold leading-tight md:text-4xl"
          >
            {job.title}
          </h2>
          <p className="text-gray-700 text-lg font-medium">
            {job.company} &bull; {job.location}
          </p>
          <p className="text-gray-500 text-sm">
            <span className="font-semibold">Duration:</span>{" "}
            {formatDate(job.startDate)} to {formatDate(job.endDate)}
          </p>
        </div>

        {/* Job Details Grid - More structured and visually distinct */}
        <div className="bg-gray-50 mb-8 grid grid-cols-1 gap-x-6 gap-y-4 rounded-lg p-4 text-base shadow-inner sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-2">
            <span className="text-purple-500">
              <FaBuilding />
            </span>
            <strong>Department:</strong> {job.department}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-500">
              <FaBriefcase />
            </span>
            <strong>Job Type:</strong> {job.jobType}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-500">
              <FaUserTie />
            </span>
            <strong>Employment:</strong> {job.employmentType}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-500">
              <FaChartLine />
            </span>
            <strong>Level:</strong> {job.level}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-500">
              <FaInfoCircle />
            </span>
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold ${job.jobStatus === JobStatus.NEW ? "text-green-600" : "text-red-600"}`}
            >
              {job.jobStatus}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-500">
              <FaHourglassHalf />
            </span>
            <strong>Experience:</strong> {job.experienceYears}+ years
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-500">
              <FaDollarSign />
            </span>
            <strong>Salary:</strong> {job?.salaryRange?.currency}
            {numeral(job?.salaryRange?.minimumAmount).format("0.[0]a")} -{" "}
            {job?.salaryRange?.currency}
            {numeral(job?.salaryRange?.maximumAmount).format("0.[0]a")}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-500">
              <FaUsers />
            </span>
            <strong>Applicants:</strong> {job.applicantsCount || 0}
          </div>
        </div>

        {/* Skills - Visually distinct tags */}
        <div className="mb-8">
          <h4 className="text-gray-800 mb-3 border-b-2 border-purple-200 pb-2 text-xl font-bold">
            Required Skills
          </h4>
          <div className="flex flex-wrap gap-3">
            {job.skillSet.length > 0 ? (
              job.skillSet.map((skill, i) => (
                <span
                  key={i}
                  className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 shadow-sm transition-colors duration-200 hover:bg-purple-200"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-600 text-sm">
                No specific skills listed.
              </p>
            )}
          </div>
        </div>

        {/* Preferences - Grouped with clear headings */}
        {(job.preferredCandidateCountry.length > 0 ||
          job.preferredCandidatePreviousCompany.length > 0 ||
          job.preferredCandidateUniversity.length > 0) && (
          <div className="mb-8">
            <h3 className="text-gray-800 mb-3 border-b-2 border-purple-200 pb-2 text-xl font-bold">
              Preferred Candidate Profile
            </h3>
            <div className="grid grid-cols-1 gap-4 text-base md:grid-cols-2">
              {job.preferredCandidateCountry.length > 0 && (
                <div>
                  <h5 className="text-gray-700 mb-1 text-sm font-semibold">
                    Preferred Countries:
                  </h5>
                  <p className="text-gray-600">
                    {job.preferredCandidateCountry.join(", ") || "Any"}
                  </p>
                </div>
              )}
              {job.preferredCandidateUniversity.length > 0 && (
                <div>
                  <h5 className="text-gray-700 mb-1 text-sm font-semibold">
                    Preferred Universities:
                  </h5>
                  <p className="text-gray-600">
                    {job.preferredCandidateUniversity.join(", ") || "Any"}
                  </p>
                </div>
              )}
              {job.preferredCandidatePreviousCompany.length > 0 && (
                <div>
                  <h5 className="text-gray-700 mb-1 text-sm font-semibold">
                    Preferred Previous Companies:
                  </h5>
                  <p className="text-gray-600">
                    {job.preferredCandidatePreviousCompany.join(", ") || "Any"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description and Responsibility - Clear headings and readable content */}
        <div className="mb-8">
          <h3 className="text-gray-800 mb-3 border-b-2 border-purple-200 pb-2 text-xl font-bold">
            Job Description
          </h3>
          <div
            id="job-modal-description"
            className="text-gray-700 prose w-full max-w-none whitespace-pre-wrap text-base leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(job.description),
            }}
          ></div>
        </div>

        {job.responsibility && (
          <div className="mb-8">
            <h3 className="text-gray-800 mb-3 border-b-2 border-purple-200 pb-2 text-xl font-bold">
              Responsibilities
            </h3>
            <div
              className="text-gray-700 prose w-full max-w-none whitespace-pre-wrap text-base leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(job.responsibility),
              }}
            ></div>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && (
          <div className="mb-8">
            <h3 className="text-gray-800 mb-3 border-b-2 border-purple-200 pb-2 text-xl font-bold">
              Requirements
            </h3>
            <div
              className="text-gray-700 prose w-full max-w-none whitespace-pre-wrap text-base leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(job.requirements),
              }}
            ></div>
          </div>
        )}

        {/* Footer - Enhanced status display */}
        <div className="border-gray-200 mt-8 flex flex-col items-center gap-4 border-t pt-6 md:flex-row md:justify-between">
          <span className="text-gray-500 text-sm font-medium">
            Posted on {formatDate(job.createdAt)}
          </span>
          {job.applied && (
            <span className="rounded-full bg-green-50 px-4 py-2 text-base font-bold text-green-600 shadow-sm">
              <i className="fas fa-check-circle mr-2"></i>Already Applied
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsMegaModal;
