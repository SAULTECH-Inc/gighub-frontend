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
    Download
} from "lucide-react";
import { JobPostResponse } from "../../utils/types";
import moment from "moment";

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
                                                             isDraft = false
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
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock size={16} className="mr-1" />
          Draft
        </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
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
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Job Details</h2>
                                    <p className="text-purple-100">View and manage job posting</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {getStatusBadge()}
                                <button
                                    onClick={onClose}
                                    className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
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
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                            {job.title || 'Untitled Position'}
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center space-x-1">
                                                <Building size={16} />
                                                <span>{job?.company || 'Company Name'}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MapPin size={16} />
                                                <span>{job.location || 'Location not specified'}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Briefcase size={16} />
                                                <span>{job.employmentType || 'Not specified'}</span>
                                            </div>
                                            {job.salaryRange && (
                                                <div className="flex items-center space-x-1">
                                                    <DollarSign size={16} />
                                                    <span>{job?.salaryRange?.maximumAmount}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Users className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-blue-600">Applicants</p>
                                                <p className="text-xl font-bold text-blue-900">{job.applicantsCount || 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <Calendar className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-green-600">Posted Date</p>
                                                <p className="text-lg font-semibold text-green-900">
                                                    {moment(job.createdAt).format("MMM D, YYYY")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <Eye className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-purple-600">Views</p>
                                                <p className="text-xl font-bold text-purple-900">{job?.applicantsCount || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {job.description || 'No description provided yet.'}
                                    </p>
                                </div>
                            </div>

                            {/* Requirements */}
                            {job.requirements && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Employment Type:</span>
                                            <span className="font-medium">{job.employmentType || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Experience Level:</span>
                                            <span className="font-medium">{job.level || 'Not specified'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Department:</span>
                                            <span className="font-medium">{job.department || 'Not specified'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Info</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Application Deadline:</span>
                                            <span className="font-medium">
                        {job.endDate ? moment(job.endDate).format("MMM D, YYYY") : 'No deadline'}
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
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-3">
                                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors">
                                    <Share2 size={16} />
                                    <span>Share</span>
                                </button>
                                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors">
                                    <Download size={16} />
                                    <span>Export</span>
                                </button>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                                        className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        <Edit3 size={16} />
                                        <span>{isDraft ? 'Continue Editing' : 'Edit Job'}</span>
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
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteConfirm(false)} />
                    <div className="relative bg-white rounded-2xl p-6 max-w-md w-full">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-full">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Delete {isDraft ? 'Draft' : 'Job Posting'}
                            </h3>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this {isDraft ? 'draft' : 'job posting'}?
                            {!isDraft && ' All applications will be lost.'} This action cannot be undone.
                        </p>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Delete {isDraft ? 'Draft' : 'Job'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetailsModal;