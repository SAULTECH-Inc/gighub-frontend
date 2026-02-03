import React, { useState } from "react";
import {
  X,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Calendar,
  Building,
  Briefcase,
  CheckCircle,
  Edit3,
  Trash2,
  Eye,
  Share2,
  Download,
} from "lucide-react";
import { JobPostResponse } from "../../utils/types";
import moment from "moment";
import numeral from "numeral";

interface JobDetailsModalProps {
  job: JobPostResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  isDraft?: boolean;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  isDraft = false,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !job) return null;

  const handleDelete = () => {
    if (onDelete && job.id) {
      onDelete(job.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const getStatusBadge = () => {
    if (isDraft) {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
          <Clock size={16} className="mr-1" />
          Draft
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
        <CheckCircle size={16} className="mr-1" />
        Active
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="bg-opacity-50 fixed inset-0 bg-black transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-opacity-20 rounded-lg bg-white p-2">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Job Details
                  </h2>
                  <p className="text-purple-100">View and manage job posting</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge()}
                <button
                  onClick={onClose}
                  className="hover:bg-opacity-20 rounded-lg p-2 text-white transition-colors hover:bg-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
            <div className="p-6">
              {/* Job Title and Basic Info */}
              <div className="mb-8">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                      {job.title || "Untitled Position"}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Building size={16} />
                        <span>{job?.company || "Company Name"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin size={16} />
                        <span>{job.location || "Location not specified"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Briefcase size={16} />
                        <span>{job.employmentType || "Not specified"}</span>
                      </div>
                      {job.salaryRange && (
                        <div className="flex items-center space-x-1">
                          <DollarSign size={16} />
                          <span>{numeral(job?.salaryRange?.maximumAmount).format("0.[0]a")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-blue-100 p-2">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-600">Applicants</p>
                        <p className="text-xl font-bold text-blue-900">
                          {job.applicantsCount || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-green-100 p-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Posted Date</p>
                        <p className="text-lg font-semibold text-green-900">
                          {moment(job.createdAt).format("MMM D, YYYY")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-purple-100 p-2">
                        <Eye className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-600">Views</p>
                        <p className="text-xl font-bold text-purple-900">
                          {job?.applicantsCount || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Job Description
                </h3>
                <div className="rounded-xl bg-gray-50 p-6">
                  <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                    {job.description || "No description provided yet."}
                  </p>
                </div>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Requirements
                  </h3>
                  <div className="rounded-xl bg-gray-50 p-6">
                    <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                      {job.requirements}
                    </p>
                  </div>
                </div>
              )}

              {/*/!* Benefits *!/*/}
              {/*{job.benefits && (*/}
              {/*    <div className="mb-8">*/}
              {/*        <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits & Perks</h3>*/}
              {/*        <div className="bg-gray-50 rounded-xl p-6">*/}
              {/*            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">*/}
              {/*                {job.benefits}*/}
              {/*            </p>*/}
              {/*        </div>*/}
              {/*    </div>*/}
              {/*)}*/}

              {/* Additional Details */}
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Job Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employment Type:</span>
                      <span className="font-medium">
                        {job.employmentType || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience Level:</span>
                      <span className="font-medium">
                        {job.level || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">
                        {job.department || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Application Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Application Deadline:
                      </span>
                      <span className="font-medium">
                        {job.endDate
                          ? moment(job.endDate).format("MMM D, YYYY")
                          : "No deadline"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">
                        {moment(job.updatedAt).format("MMM D, YYYY")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800">
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800">
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center space-x-2 rounded-lg px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>

                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(job.id);
                      onClose();
                    }}
                    className="flex items-center space-x-2 rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors hover:bg-purple-700"
                  >
                    <Edit3 size={16} />
                    <span>{isDraft ? "Continue Editing" : "Edit Job"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="bg-opacity-50 fixed inset-0 bg-black"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center space-x-3">
              <div className="rounded-full bg-red-100 p-2">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete {isDraft ? "Draft" : "Job Posting"}
              </h3>
            </div>

            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this{" "}
              {isDraft ? "draft" : "job posting"}?
              {!isDraft && " All applications will be lost."} This action cannot
              be undone.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700"
              >
                Delete {isDraft ? "Draft" : "Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsModal;
