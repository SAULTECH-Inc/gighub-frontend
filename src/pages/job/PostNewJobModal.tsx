import React, { useState, useEffect } from "react";
import {
    X,
    Briefcase,
    MapPin,
    Building,
    Users,
    Save,
    Send,
    ChevronRight,
    Check,
    AlertCircle
} from "lucide-react";

interface JobFormData {
    title: string;
    companyName: string;
    location: string;
    employmentType: string;
    experienceLevel: string;
    salary: string;
    department: string;
    description: string;
    requirements: string;
    benefits: string;
    applicationDeadline: string;
}

interface PostNewJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveDraft?: (data: JobFormData) => void;
    onPublish?: (data: JobFormData) => void;
    initialData?: Partial<JobFormData>;
    isEditing?: boolean;
}

const PostNewJobModal: React.FC<PostNewJobModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             onSaveDraft,
                                                             onPublish,
                                                             initialData,
                                                             isEditing = false
                                                         }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<JobFormData>({
        title: '',
        companyName: '',
        location: '',
        employmentType: '',
        experienceLevel: '',
        salary: '',
        department: '',
        description: '',
        requirements: '',
        benefits: '',
        applicationDeadline: '',
        ...initialData
    });

    const [errors, setErrors] = useState<Partial<JobFormData>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    if (!isOpen) return null;

    const steps = [
        { id: 1, title: 'Basic Information', icon: Briefcase },
        { id: 2, title: 'Job Details', icon: Users },
        { id: 3, title: 'Requirements & Benefits', icon: Check }
    ];

    const employmentTypes = [
        'Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Freelance'
    ];

    const experienceLevels = [
        'Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager', 'Director'
    ];

    const handleInputChange = (field: keyof JobFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateStep = (step: number) => {
        const newErrors: Partial<JobFormData> = {};

        if (step === 1) {
            if (!formData.title.trim()) newErrors.title = 'Job title is required';
            if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
            if (!formData.location.trim()) newErrors.location = 'Location is required';
            if (!formData.employmentType) newErrors.employmentType = 'Employment type is required';
        }

        if (step === 2) {
            if (!formData.description.trim()) newErrors.description = 'Job description is required';
            if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience level is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const calculateProgress = () => {
        const fields = Object.values(formData);
        const filledFields = fields.filter(field => field && field.trim() !== '').length;
        return Math.round((filledFields / fields.length) * 100);
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        try {
            if (onSaveDraft) {
                await onSaveDraft(formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving draft:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        if (validateStep(1) && validateStep(2)) {
            setIsSaving(true);
            try {
                if (onPublish) {
                    await onPublish(formData);
                }
                onClose();
            } catch (error) {
                console.error('Error publishing job:', error);
            } finally {
                setIsSaving(false);
            }
        }
    };

    const progress = calculateProgress();

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
                                    <h2 className="text-xl font-semibold text-white">
                                        {isEditing ? 'Edit Job Posting' : 'Post New Job'}
                                    </h2>
                                    <p className="text-purple-100">Create an attractive job posting</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Progress */}
                                <div className="hidden sm:flex items-center space-x-2 text-white">
                                    <div className="w-32 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium">{progress}%</span>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Step Indicator */}
                        <div className="flex items-center justify-center mt-6 space-x-4">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                        currentStep === step.id
                                            ? 'bg-white text-purple-600'
                                            : currentStep > step.id
                                                ? 'bg-green-500 text-white'
                                                : 'bg-white bg-opacity-20 text-white'
                                    }`}>
                                        <step.icon size={16} />
                                        <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <ChevronRight className="text-white mx-2" size={16} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6">
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            placeholder="e.g. Senior Frontend Developer"
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                                errors.title ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle size={14} className="mr-1" />
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.companyName}
                                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                                            placeholder="Your company name"
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                                errors.companyName ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.companyName && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle size={14} className="mr-1" />
                                                {errors.companyName}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Location *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            placeholder="e.g. San Francisco, CA or Remote"
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                                errors.location ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        />
                                        {errors.location && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle size={14} className="mr-1" />
                                                {errors.location}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Employment Type *
                                        </label>
                                        <select
                                            value={formData.employmentType}
                                            onChange={(e) => handleInputChange('employmentType', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                                errors.employmentType ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        >
                                            <option value="">Select employment type</option>
                                            {employmentTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        {errors.employmentType && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle size={14} className="mr-1" />
                                                {errors.employmentType}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Salary Range
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.salary}
                                            onChange={(e) => handleInputChange('salary', e.target.value)}
                                            placeholder="e.g. $80,000 - $120,000 or Competitive"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.department}
                                            onChange={(e) => handleInputChange('department', e.target.value)}
                                            placeholder="e.g. Engineering, Marketing, Sales"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Job Details */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Experience Level *
                                        </label>
                                        <select
                                            value={formData.experienceLevel}
                                            onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                                errors.experienceLevel ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                        >
                                            <option value="">Select experience level</option>
                                            {experienceLevels.map(level => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                        {errors.experienceLevel && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle size={14} className="mr-1" />
                                                {errors.experienceLevel}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Application Deadline
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.applicationDeadline}
                                            onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                                        rows={8}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none ${
                                            errors.description ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle size={14} className="mr-1" />
                                            {errors.description}
                                        </p>
                                    )}
                                    <p className="mt-2 text-sm text-gray-500">
                                        {formData.description.length}/1000 characters
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Requirements & Benefits */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements & Benefits</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Requirements & Qualifications
                                    </label>
                                    <textarea
                                        value={formData.requirements}
                                        onChange={(e) => handleInputChange('requirements', e.target.value)}
                                        placeholder="• Bachelor's degree in Computer Science or related field&#10;• 3+ years of experience with React/TypeScript&#10;• Strong problem-solving skills&#10;• Experience with modern development tools"
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                    />
                                    <p className="mt-2 text-sm text-gray-500">
                                        List the essential qualifications, skills, and experience needed
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Benefits & Perks
                                    </label>
                                    <textarea
                                        value={formData.benefits}
                                        onChange={(e) => handleInputChange('benefits', e.target.value)}
                                        placeholder="• Competitive salary and equity package&#10;• Comprehensive health, dental, and vision insurance&#10;• 401(k) with company matching&#10;• Flexible work arrangements&#10;• Professional development budget"
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                    />
                                    <p className="mt-2 text-sm text-gray-500">
                                        Highlight what makes your company a great place to work
                                    </p>
                                </div>

                                {/* Preview Card */}
                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Preview</h4>
                                    <div className="space-y-2">
                                        <h5 className="font-medium text-gray-900">{formData.title || 'Job Title'}</h5>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center space-x-1">
                                                <Building size={14} />
                                                <span>{formData.companyName || 'Company'}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MapPin size={14} />
                                                <span>{formData.location || 'Location'}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Briefcase size={14} />
                                                <span>{formData.employmentType || 'Employment Type'}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {formData.description ? formData.description.substring(0, 150) + '...' : 'Job description will appear here...'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-3">
                                {currentStep > 1 && (
                                    <button
                                        onClick={handlePrevious}
                                        className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Previous
                                    </button>
                                )}

                                <button
                                    onClick={handleSaveDraft}
                                    disabled={isSaving}
                                    className="flex items-center space-x-2 px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
                                </button>
                            </div>

                            <div className="flex space-x-3">
                                {currentStep < 3 ? (
                                    <button
                                        onClick={handleNext}
                                        className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        <span>Continue</span>
                                        <ChevronRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePublish}
                                        disabled={isSaving}
                                        className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        <Send size={16} />
                                        <span>{isSaving ? 'Publishing...' : 'Publish Job'}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostNewJobModal;