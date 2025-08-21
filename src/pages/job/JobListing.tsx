import React, { useState } from "react";
import { Trash2, Eye, Calendar, Users, MoreVertical, AlertTriangle, Briefcase } from "lucide-react";
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
      case 'full-time':
        return 'bg-green-100 text-green-700';
      case 'part-time':
        return 'bg-blue-100 text-blue-700';
      case 'contract':
        return 'bg-purple-100 text-purple-700';
      case 'internship':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No active jobs</h3>
        <p className="text-gray-600">Create your first job posting to start attracting candidates.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Cards */}
      <div className="block lg:hidden">
        <div className="p-4 space-y-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-gray-50 rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header with Actions */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                    {listing.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEmploymentTypeColor(listing.employmentType)}`}>
                    {listing.employmentType}
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === listing.id ? null : listing.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {activeDropdown === listing.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-36">
                      <button
                        onClick={() => {
                          onView(listing.id);
                          setActiveDropdown(null);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Eye size={14} />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(listing.id)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Applicants</p>
                    <p className="font-semibold text-gray-900">{listing.applicantsCount || 0}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-600" />
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
                  className="flex-1 py-2.5 px-4 bg-white border border-gray-200 text-gray-700 text-center text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDeleteClick(listing.id)}
                  className="px-4 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
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
        <div className="bg-purple-600 text-white p-4 rounded-t-2xl">
          <div className="grid grid-cols-12 gap-4 items-center font-medium text-sm">
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
              className={`grid grid-cols-12 gap-4 items-center p-4 hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
              }`}
            >
              <div className="col-span-3">
                <h4 className="font-medium text-gray-900 truncate">{listing.title}</h4>
                <p className="text-sm text-gray-500 truncate">{listing.location || 'Remote'}</p>
              </div>

              <div className="col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEmploymentTypeColor(listing.employmentType)}`}>
                  {listing.employmentType}
                </span>
              </div>

              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-900">{listing.applicantsCount || 0}</span>
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {moment(listing.createdAt).format("MMM D, YYYY")}
                  </span>
                </div>
              </div>

              <div className="col-span-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                  Active
                </span>
              </div>

              <div className="col-span-1">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => onView(listing.id)}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(listing.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Job Posting</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this job posting? This action cannot be undone and all associated applications will be removed.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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