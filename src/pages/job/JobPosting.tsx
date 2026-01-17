import React, { useState } from "react";
import {
  Edit3,
  Trash2,
  Eye,
  Calendar,
  FileText,
  MoreVertical,
  AlertTriangle,
  Play,
} from "lucide-react";
import { JobPostResponse } from "../../utils/types";
import moment from "moment";

interface JobPostingProps {
  listings: JobPostResponse[];
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onPublish?: (id: number) => void;
}

const JobPosting: React.FC<JobPostingProps> = ({
  listings,
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onPublish = () => {},
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const handleDeleteClick = (jobId: number) => {
    setSelectedJobId(jobId);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  const confirmDelete = () => {
    if (selectedJobId) {
      onDelete(selectedJobId);
      setShowDeleteModal(false);
      setSelectedJobId(null);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-200 text-red-800";
    if (progress < 70) return "bg-yellow-200 text-yellow-800";
    return "bg-green-200 text-green-800";
  };

  const getProgressValue = (listing: JobPostResponse) => {
    // Calculate progress based on filled fields
    let filledFields = 0;
    const totalFields = 8;

    if (listing.title) filledFields++;
    if (listing.description) filledFields++;
    if (listing.employmentType) filledFields++;
    if (listing.location) filledFields++;
    if (listing.salaryRange) filledFields++;
    if (listing.requirements) filledFields++;
    if (listing.company) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  };

  if (listings.length === 0) {
    return (
      <div className="py-12 text-center">
        <FileText className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No draft jobs
        </h3>
        <p className="text-gray-600">
          Your saved drafts will appear here when you start creating job posts.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Cards */}
      <div className="block lg:hidden">
        <div className="space-y-4 p-4">
          {listings.map((listing) => {
            const progress = getProgressValue(listing);
            return (
              <div
                key={listing.id}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-shadow hover:shadow-md"
              >
                {/* Header with Actions */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-2 truncate text-lg font-semibold text-gray-900">
                      {listing.title || "Untitled Job"}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 flex-1 rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            progress < 30
                              ? "bg-red-500"
                              : progress < 70
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {progress}%
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === listing.id ? null : listing.id,
                        )
                      }
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeDropdown === listing.id && (
                      <div className="absolute top-full right-0 z-10 mt-1 min-w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                        <button
                          onClick={() => {
                            onEdit(listing.id);
                            setActiveDropdown(null);
                          }}
                          className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Edit3 size={14} />
                          <span>Edit Draft</span>
                        </button>
                        <button
                          onClick={() => {
                            onView(listing.id);
                            setActiveDropdown(null);
                          }}
                          className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Eye size={14} />
                          <span>Preview</span>
                        </button>
                        {progress >= 70 && (
                          <button
                            onClick={() => {
                              onPublish(listing.id);
                              setActiveDropdown(null);
                            }}
                            className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                          >
                            <Play size={14} />
                            <span>Publish</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(listing.id)}
                          className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600">Type</p>
                      <p className="font-semibold text-gray-900">
                        {listing.employmentType || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Saved</p>
                      <p className="font-semibold text-gray-900">
                        {moment(listing.createdAt).format("MMM D")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => onEdit(listing.id)}
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Continue Editing
                  </button>
                  {progress >= 70 && (
                    <button
                      onClick={() => onPublish(listing.id)}
                      className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      Publish
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        {/* Table Header */}
        <div className="rounded-t-2xl bg-purple-600 p-4 text-white">
          <div className="grid grid-cols-12 items-center gap-4 text-sm font-medium">
            <div className="col-span-3">Job Title</div>
            <div className="col-span-2">Employment Type</div>
            <div className="col-span-2">Progress</div>
            <div className="col-span-2">Last Saved</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {listings.map((listing, index) => {
            const progress = getProgressValue(listing);
            return (
              <div
                key={listing.id}
                className={`grid grid-cols-12 items-center gap-4 p-4 transition-colors hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-25"
                }`}
              >
                <div className="col-span-3">
                  <h4 className="truncate font-medium text-gray-900">
                    {listing.title || "Untitled Job"}
                  </h4>
                  <p className="truncate text-sm text-gray-500">
                    {listing.location || "Location not set"}
                  </p>
                </div>

                <div className="col-span-2">
                  {listing.employmentType ? (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {listing.employmentType}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Not set</span>
                  )}
                </div>

                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 flex-1 rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress < 30
                            ? "bg-red-500"
                            : progress < 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="min-w-12 text-sm font-medium text-gray-600">
                      {progress}%
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {moment(listing.createdAt).format("MMM D, YYYY")}
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getProgressColor(progress)}`}
                  >
                    <div className="mr-1 h-1.5 w-1.5 rounded-full bg-current"></div>
                    {progress < 30
                      ? "Just Started"
                      : progress < 70
                        ? "In Progress"
                        : "Ready to Publish"}
                  </span>
                </div>

                <div className="col-span-1">
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      onClick={() => onEdit(listing.id)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      title="Edit draft"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onView(listing.id)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-purple-50 hover:text-purple-600"
                      title="Preview"
                    >
                      <Eye size={16} />
                    </button>
                    {progress >= 70 && (
                      <button
                        onClick={() => onPublish(listing.id)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600"
                        title="Publish job"
                      >
                        <Play size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(listing.id)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Delete draft"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center space-x-3">
              <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Draft
              </h3>
            </div>

            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this draft? All your progress will
              be lost and this action cannot be undone.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700"
              >
                Delete Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobPosting;
