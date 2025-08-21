import CustomDropdown from "../../../common/CustomDropdown.tsx";
import RichTextEditor from "../../../common/RichTextEditor.tsx";
import React, { useEffect, useState } from "react";
import useModalStore from "../../../../store/modalStateStores.ts";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import {
  CvResponseDto,
  ExperienceResponseDto,
  Option,
} from "../../../../utils/types";
import CustomSelect from "../../../common/CustomSelect.tsx";
import { toast } from "react-toastify";
import CustomCheckbox from "../../../common/CustomCheckbox.tsx";
import { jobLocation } from "../../../../utils/constants.ts";
import { useCities } from "../../../../hooks/useCities.ts";
import { useJobRoles } from "../../../../hooks/useJobRoles.ts";
import {
  X,
  Briefcase,
  Plus,
  MapPin,
  Building,
  Calendar,
  User,
  AlertCircle
} from "lucide-react";

interface AddExperienceModalProp {
  modalId: string;
}

const AddExperienceModal: React.FC<AddExperienceModalProp> = ({ modalId }) => {
  const jobRoles = useJobRoles();
  const { cities } = useCities();
  const {
    experience,
    setCvDetails,
    cvDetails,
    setExperience,
    addExperience,
    setExperiences,
    experiences,
    resetExperience,
  } = useApplicantJobProfile();

  const [description, setDescription] = useState(experience?.description ?? "");
  const [currentlyEmployed, setCurrentlyEmployed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const { modals, closeModal } = useModalStore();
  const isOpen = modals[modalId];

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    setExperience({
      ...experience,
      description: description,
    });
    if (currentlyEmployed) {
      setExperience({ ...experience, endDate: new Date() });
    }
  }, [description, currentlyEmployed]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!experience?.company?.trim()) {
      newErrors.company = "Company name is required";
    }
    if (!experience?.position?.trim()) {
      newErrors.position = "Position is required";
    }
    if (!experience?.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!currentlyEmployed && !experience?.endDate) {
      newErrors.endDate = "End date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExperience({
      ...experience,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await addExperience(experience);
      if (response) {
        toast.success("Experience added successfully!");
        resetExperience();
        setDescription("");
        setCurrentlyEmployed(false);
        setErrors({});

        const exp: ExperienceResponseDto[] = [...(experiences || [])];
        exp.push(response);
        setExperience(response);
        setExperiences(exp);
        setCvDetails({
          ...cvDetails,
          experiences: exp,
        } as CvResponseDto);

        closeModal(modalId);
      }
    } catch (error) {
      toast.error("Failed to add experience.");
      console.error("Error adding experience:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      resetExperience();
      setDescription("");
      setCurrentlyEmployed(false);
      setErrors({});
      closeModal(modalId);
    }
  };

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExperience({
      ...experience,
      [name]: new Date(value),
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleCloseModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-600 to-orange-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Add Work Experience</h2>
              <p className="text-orange-100 text-sm">Add your professional work experience and achievements</p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            disabled={isSubmitting}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Company and Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Building className="w-4 h-4" />
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={experience?.company || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                    errors.company
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                  } focus:outline-none`}
                  placeholder="Enter company name"
                />
                {errors.company && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.company}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4" />
                  Your Role/Position <span className="text-red-500">*</span>
                </label>
                <CustomDropdown
                  placeholder="Select your role"
                  options={jobRoles}
                  handleSelect={(option: Option) => {
                    setExperience({
                      ...experience,
                      position: option.value,
                    });
                    if (errors.position) {
                      setErrors(prev => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { position, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  className={`text-left w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                    errors.position
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                  } focus:outline-none`}
                />
                {errors.position && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.position}
                  </p>
                )}
              </div>
            </div>

            {/* Location and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4" />
                  Work Location
                </label>
                <CustomSelect
                  placeholder="Select location type"
                  options={jobLocation}
                  onChange={(option: Option) => {
                    setExperience({
                      ...experience,
                      location: option.value,
                    });
                  }}
                  className="text-left w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  City
                </label>
                <CustomDropdown
                  placeholder="Select city"
                  options={cities}
                  handleSelect={(option: Option) => {
                    setExperience({
                      ...experience,
                      city: option.value,
                    });
                  }}
                  className="text-left w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4" />
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  onChange={handleChangeDate}
                  value={
                    experience?.startDate
                      ? new Date(experience.startDate).toISOString().split("T")[0]
                      : ""
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                    errors.startDate
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                  } focus:outline-none`}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.startDate}
                  </p>
                )}
              </div>

              {!currentlyEmployed && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4" />
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    onChange={handleChangeDate}
                    value={
                      experience?.endDate
                        ? new Date(experience.endDate).toISOString().split("T")[0]
                        : ""
                    }
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                      errors.endDate
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                    } focus:outline-none`}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.endDate}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Currently Employed Checkbox */}
            <div className="flex items-center">
              <CustomCheckbox
                label="Currently working here"
                checked={currentlyEmployed}
                onChange={(e) => setCurrentlyEmployed(e.target.checked)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Job Description & Achievements
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <RichTextEditor
                  value={description || ""}
                  onChange={setDescription}
                />
              </div>
              <p className="text-xs text-gray-500">
                Highlight your key responsibilities, achievements, and skills gained in this role
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleCloseModal}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Experience
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExperienceModal;