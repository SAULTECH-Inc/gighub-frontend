import React, { useState } from "react";
import {
  Trash2,
  Eye,
  Calendar,
  Users,
  MoreVertical,
  AlertTriangle,
  Briefcase,
} from "lucide-react";
import { JobPostResponse } from "../../utils/types";
import moment from "moment";

interface JobListingsProps {
  listings: JobPostResponse[];
  onView?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const JobListing: React.FC<JobListingsProps> = ({
  listings,
  onView = () => {},
  onDelete = () => {},
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

  const getEmploymentTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "full-time":
        return "bg-green-100 text-green-700";
      case "part-time":
        return "bg-blue-100 text-blue-700";
      case "contract":
        return "bg-purple-100 text-purple-700";
      case "internship":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (listings.length === 0) {
    return (
      <div className="py-12 text-center">
        <Briefcase className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No active jobs
        </h3>
        <p className="text-gray-600">
          Create your first job posting to start attracting candidates.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Cards */}
      <div className="block lg:hidden">
        <div className="space-y-4 p-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-shadow hover:shadow-md"
            >
              {/* Header with Actions */}
              <div className="mb-4 flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 truncate text-lg font-semibold text-gray-900">
                    {listing.title}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getEmploymentTypeColor(listing.employmentType)}`}
                  >
                    {listing.employmentType}
                  </span>
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
                    <div className="absolute top-full right-0 z-10 mt-1 min-w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                      <button
                        onClick={() => {
                          onView(listing.id);
                          setActiveDropdown(null);
                        }}
                        className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Eye size={14} />
                        <span>View Details</span>
                      </button>
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

              {/* Stats Grid */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Applicants</p>
                    <p className="font-semibold text-gray-900">
                      {listing.applicantsCount || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">Posted</p>
                    <p className="font-semibold text-gray-900">
                      {moment(listing.createdAt).format("MMM D")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => onView(listing.id)}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDeleteClick(listing.id)}
                  className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        {/* Table Header */}
        <div className="rounded-t-2xl bg-purple-600 p-4 text-white">
          <div className="grid grid-cols-12 items-center gap-4 text-sm font-medium">
            <div className="col-span-3">Job Title</div>
            <div className="col-span-2">Employment Type</div>
            <div className="col-span-2">Applicants</div>
            <div className="col-span-2">Posted Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {listings.map((listing, index) => (
            <div
              key={listing.id}
              className={`grid grid-cols-12 items-center gap-4 p-4 transition-colors hover:bg-gray-50 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-25"
              }`}
            >
              <div className="col-span-3">
                <h4 className="truncate font-medium text-gray-900">
                  {listing.title}
                </h4>
                <p className="truncate text-sm text-gray-500">
                  {listing.location || "Remote"}
                </p>
              </div>

              <div className="col-span-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getEmploymentTypeColor(listing.employmentType)}`}
                >
                  {listing.employmentType}
                </span>
              </div>

              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-900">
                    {listing.applicantsCount || 0}
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
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  <div className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  Active
                </span>
              </div>

              <div className="col-span-1">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => onView(listing.id)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-purple-50 hover:text-purple-600"
                    title="View details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(listing.id)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete job"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="bg-opacity-20 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center space-x-3">
              <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Job Posting
              </h3>
            </div>

            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this job posting? This action
              cannot be undone and all associated applications will be removed.
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
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobListing;
