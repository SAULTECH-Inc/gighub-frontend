import React, { useState } from "react";
import { Edit3, Trash2, Eye, Calendar, FileText, MoreVertical, AlertTriangle, Play } from "lucide-react";
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
    if (progress < 30) return 'bg-red-200 text-red-800';
    if (progress < 70) return 'bg-yellow-200 text-yellow-800';
    return 'bg-green-200 text-green-800';
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
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No draft jobs</h3>
        <p className="text-gray-600">Your saved drafts will appear here when you start creating job posts.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Cards */}
      <div className="block lg:hidden">
        <div className="p-4 space-y-4">
          {listings.map((listing) => {
            const progress = getProgressValue(listing);
            return (
              <div
                key={listing.id}
                className="bg-gray-50 rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                {/* Header with Actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
                      {listing.title || 'Untitled Job'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            progress < 30 ? 'bg-red-500' : progress < 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{progress}%</span>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === listing.id ? null : listing.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeDropdown === listing.id && (
                      <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-40">
                        <button
                          onClick={() => {
                            onEdit(listing.id);
                            setActiveDropdown(null);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Edit3 size={14} />
                          <span>Edit Draft</span>
                        </button>
                        <button
                          onClick={() => {
                            onView(listing.id);
                            setActiveDropdown(null);
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                          >
                            <Play size={14} />
                            <span>Publish</span>
                          </button>
                        )}
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

                {/* Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600">Type</p>
                      <p className="font-semibold text-gray-900">{listing.employmentType || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
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
                    className="flex-1 py-2.5 px-4 bg-white border border-gray-200 text-gray-700 text-center text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Continue Editing
                  </button>
                  {progress >= 70 && (
                    <button
                      onClick={() => onPublish(listing.id)}
                      className="px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
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
        <div className="bg-purple-600 text-white p-4 rounded-t-2xl">
          <div className="grid grid-cols-12 gap-4 items-center font-medium text-sm">
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
                className={`grid grid-cols-12 gap-4 items-center p-4 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}
              >
                <div className="col-span-3">
                  <h4 className="font-medium text-gray-900 truncate">
                    {listing.title || 'Untitled Job'}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">
                    {listing.location || 'Location not set'}
                  </p>
                </div>

                <div className="col-span-2">
                  {listing.employmentType ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {listing.employmentType}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Not set</span>
                  )}
                </div>

                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress < 30 ? 'bg-red-500' : progress < 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 min-w-12">{progress}%</span>
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProgressColor(progress)}`}>
                    <div className="w-1.5 h-1.5 bg-current rounded-full mr-1"></div>
                    {progress < 30 ? 'Just Started' : progress < 70 ? 'In Progress' : 'Ready to Publish'}
                  </span>
                </div>

                <div className="col-span-1">
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      onClick={() => onEdit(listing.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit draft"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => onView(listing.id)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Preview"
                    >
                      <Eye size={16} />
                    </button>
                    {progress >= 70 && (
                      <button
                        onClick={() => onPublish(listing.id)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Publish job"
                      >
                        <Play size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(listing.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Draft</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this draft? All your progress will be lost and this action cannot be undone.
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