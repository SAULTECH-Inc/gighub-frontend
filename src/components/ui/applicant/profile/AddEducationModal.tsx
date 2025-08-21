import CustomDropdown from "../../../common/CustomDropdown.tsx";
import RichTextEditor from "../../../common/RichTextEditor.tsx";
import React, { useEffect, useState } from "react";
import useModalStore from "../../../../store/modalStateStores.ts";
import {
  classOfDegrees,
  CvResponseDto,
  EducationResponseDto,
  fieldsOfStudies,
  institutions,
  Option,
} from "../../../../utils/types";
import { toast } from "react-toastify";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import CustomCheckbox from "../../../common/CustomCheckbox.tsx";
import { useCities } from "../../../../hooks/useCities.ts";
import { useCountries } from "../../../../hooks/useCountries.ts";
import {
  X,
  GraduationCap,
  Plus,
  MapPin,
  Globe,
  Calendar,
  BookOpen,
  AlertCircle
} from "lucide-react";

interface AddEducationModalProp {
  modalId: string;
}

const AddEducationModal: React.FC<AddEducationModalProp> = ({ modalId }) => {
  const { cities } = useCities();
  const { countries } = useCountries();
  const { modals, closeModal } = useModalStore();
  const isOpen = modals[modalId];
  const {
    cvDetails,
    educations,
    setEducations,
    setCvDetails,
    applicantEducation,
    setApplicantEducation,
    resetApplicantEducation,
    addApplicantEducation,
  } = useApplicantJobProfile();

  const [description, setDescription] = useState<string>("");
  const [currentlyEnrolled, setCurrentEnrolled] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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
    setApplicantEducation({
      ...applicantEducation,
      description: description,
    });
    if (currentlyEnrolled) {
      setApplicantEducation({
        ...applicantEducation,
        endDate: new Date(),
      });
    }
  }, [description, currentlyEnrolled]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!applicantEducation?.degree?.trim()) {
      newErrors.degree = "Degree is required";
    }
    if (!applicantEducation?.fieldOfStudy?.trim()) {
      newErrors.fieldOfStudy = "Field of study is required";
    }
    if (!applicantEducation?.institution?.trim()) {
      newErrors.institution = "Institution is required";
    }
    if (!applicantEducation?.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!currentlyEnrolled && !applicantEducation?.endDate) {
      newErrors.endDate = "End date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEducation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const newEducation = await addApplicantEducation(applicantEducation);
      if (newEducation) {
        toast.success("Education added successfully!");
        resetApplicantEducation();
        setDescription("");
        setCurrentEnrolled(false);
        setErrors({});

        const edus: EducationResponseDto[] = [...(educations || [])];
        edus.push(newEducation);
        setEducations(edus);
        setCvDetails({
          ...cvDetails,
          educations: edus,
        } as CvResponseDto);

        closeModal(modalId);
      }
    } catch (error) {
      toast.error("Failed to add education.");
      console.error("Error adding education:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      resetApplicantEducation();
      setDescription("");
      setCurrentEnrolled(false);
      setErrors({});
      closeModal(modalId);
    }
  };

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplicantEducation({
      ...applicantEducation,
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

  const formatDateForInput = (dateValue: any): string => {
    if (!dateValue) return "";

    try {
      const date = new Date(dateValue);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date value:", dateValue);
        return "";
      }

      return date.toISOString().split("T")[0];
    } catch (error) {
      console.warn("Error formatting date:", dateValue, error);
      return "";
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Add Education</h2>
              <p className="text-purple-100 text-sm">Add your educational background and qualifications</p>
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
            {/* Degree and Field of Study */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <BookOpen className="w-4 h-4" />
                  Degree <span className="text-red-500">*</span>
                </label>
                <CustomDropdown
                  placeholder="Select degree type"
                  options={classOfDegrees}
                  handleSelect={(selected: Option) => {
                    setApplicantEducation({
                      ...applicantEducation,
                      degree: selected.value,
                    });
                    if (errors.degree) {
                      setErrors(prev => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { degree, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  className={`text-left w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                    errors.degree
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                  } focus:outline-none`}
                />
                {errors.degree && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.degree}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Field of Study <span className="text-red-500">*</span>
                </label>
                <CustomDropdown
                  placeholder="Select field of study"
                  options={fieldsOfStudies}
                  handleSelect={(selected: Option) => {
                    setApplicantEducation({
                      ...applicantEducation,
                      fieldOfStudy: selected.value,
                    });
                    if (errors.fieldOfStudy) {
                      setErrors(prev => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { fieldOfStudy, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  className={`text-left w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                    errors.fieldOfStudy
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                  } focus:outline-none`}
                />
                {errors.fieldOfStudy && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fieldOfStudy}
                  </p>
                )}
              </div>
            </div>

            {/* Institution and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <GraduationCap className="w-4 h-4" />
                  Institution <span className="text-red-500">*</span>
                </label>
                <CustomDropdown
                  placeholder="Select institution"
                  options={institutions}
                  handleSelect={(selected: Option) => {
                    setApplicantEducation({
                      ...applicantEducation,
                      institution: selected.value,
                    });
                    if (errors.institution) {
                      setErrors(prev => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { institution, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  className={`text-left w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                    errors.institution
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                  } focus:outline-none`}
                />
                {errors.institution && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.institution}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Globe className="w-4 h-4" />
                  Country
                </label>
                <CustomDropdown
                  placeholder="Select country"
                  options={countries}
                  handleSelect={(selected: Option) => {
                    setApplicantEducation({
                      ...applicantEducation,
                      country: selected.label,
                    });
                  }}
                  className="text-left w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* City and Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4" />
                  City
                </label>
                <CustomDropdown
                  placeholder="Select city"
                  options={cities}
                  handleSelect={(selected: Option) => {
                    setApplicantEducation({
                      ...applicantEducation,
                      city: selected.value,
                    });
                  }}
                  className="text-left w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4" />
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  onChange={handleChangeDate}
                  value={formatDateForInput(applicantEducation?.startDate)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                    errors.startDate
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                  } focus:outline-none`}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.startDate}
                  </p>
                )}
              </div>

              {!currentlyEnrolled && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4" />
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    onChange={handleChangeDate}
                    value={formatDateForInput(applicantEducation?.endDate)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                      errors.endDate
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
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

            {/* Currently Enrolled Checkbox */}
            <div className="flex items-center">
              <CustomCheckbox
                label="Currently enrolled"
                checked={currentlyEnrolled}
                onChange={(e) => setCurrentEnrolled(e.target.checked)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <RichTextEditor
                  onChange={setDescription}
                  value={description}
                />
              </div>
              <p className="text-xs text-gray-500">
                Optional: Add details about your achievements, relevant coursework, or academic honors
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCloseModal}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddEducation}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Education
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEducationModal;