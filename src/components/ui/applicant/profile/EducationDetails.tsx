import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EducationUpdateForm from "./EducationUpdateForm.tsx";
import { CvResponseDto, EducationResponseDto } from "../../../../utils/types";
import moment from "moment";
import { toast } from "react-toastify";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import {
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  Trash2,
  GraduationCap,
  MapPin,
  Calendar
} from "lucide-react";

export interface EducationDetailsProps {
  education: EducationResponseDto;
}

const EducationDetails: React.FC<EducationDetailsProps> = ({ education }) => {
  const { isEditable, toggleEdit } = useSectionEditable("education");
  const [educationCollapse, setEducationCollapse] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const {
    deleteEducation,
    applicantEducation,
    educations,
    setEducations,
    setApplicantEducation,
    updatedApplicantEducation,
    cvDetails,
    setCvDetails,
  } = useApplicantJobProfile();

  useEffect(() => {
    setApplicantEducation(education);
  }, [education, setApplicantEducation]);

  const handleDeleteEducation = async () => {
    if (!window.confirm("Are you sure you want to delete this education entry?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deleteEducation(education.id as number);
      if (success) {
        toast.success("Education deleted successfully!");
        const updatedEducations = educations.filter(
            (edu) => edu.id !== education.id,
        );
        setEducations(updatedEducations);
        setCvDetails({
          ...cvDetails,
          educations: updatedEducations,
        } as CvResponseDto);
      }
    } catch (e) {
      console.error("Failed to delete education:", e);
      toast.error("Failed to delete education");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateEducation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await updatedApplicantEducation(applicantEducation);

      if (response) {
        toast.success("Education updated successfully!");
        const updatedEducations = educations.map((edu) => {
          if (edu.id === applicantEducation.id) {
            return response;
          }
          return edu;
        });
        toggleEdit();
        setApplicantEducation(response);
        setEducations(updatedEducations);
        setCvDetails({
          ...cvDetails,
          educations: updatedEducations,
        } as CvResponseDto);
      }
    } catch (error) {
      toast.error("Failed to update education.");
      console.error("Error updating education:", error);
    }
  };

  const handleToggleEdit = () => {
    toggleEdit();
  };

  const formatDateRange = () => {
    const startDate = moment(applicantEducation?.startDate).format("MMM YYYY");
    const endDate = applicantEducation?.endDate
        ? moment(applicantEducation.endDate).format("MMM YYYY")
        : "Present";
    return `${startDate} - ${endDate}`;
  };

  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-all duration-200"
      >
        {/* Main Content */}
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Education Icon */}
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>

              {/* Education Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {applicantEducation?.degree}
                  {applicantEducation?.fieldOfStudy && (
                      <span className="text-gray-600"> in {applicantEducation.fieldOfStudy}</span>
                  )}
                </h4>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>{applicantEducation?.institution}</span>
                  </div>

                  {applicantEducation?.city && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{applicantEducation.city}, {applicantEducation?.country}</span>
                      </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateRange()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Delete Button */}
              <button
                  onClick={handleDeleteEducation}
                  disabled={isDeleting}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                  title="Delete education"
              >
                {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Trash2 className="w-4 h-4" />
                )}
              </button>

              {/* Expand/Collapse Button */}
              <button
                  type="button"
                  onClick={() => setEducationCollapse(!educationCollapse)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title={educationCollapse ? "Collapse" : "Expand"}
              >
                {educationCollapse ? (
                    <ChevronUp className="w-5 h-5" />
                ) : (
                    <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Preview (when collapsed) */}
          {!educationCollapse && applicantEducation?.description && (
              <div className="text-sm text-gray-600 line-clamp-2 bg-gray-50 rounded-lg p-3 mt-3">
                <div dangerouslySetInnerHTML={{ __html: applicantEducation.description }} />
              </div>
          )}
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {educationCollapse && (
              <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="border-t border-gray-100 bg-gray-50"
              >
                <div className="p-6">
                  {/* Edit Controls */}
                  <div className="flex items-center justify-end gap-2 mb-4">
                    <button
                        onClick={handleToggleEdit}
                        type="button"
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isEditable
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                        }`}
                    >
                      <Edit3 className="w-4 h-4" />
                      {isEditable ? 'Cancel' : 'Edit'}
                    </button>

                    {isEditable && (
                        <button
                            onClick={handleUpdateEducation}
                            type="button"
                            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors duration-200"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </button>
                    )}
                  </div>

                  {/* Education Update Form */}
                  <EducationUpdateForm
                      isEditable={isEditable}
                      educationData={education}
                  />
                </div>
              </motion.div>
          )}
        </AnimatePresence>

        {/* Status Indicators */}
        {educationCollapse && !isEditable && (
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Ready to save</span>
              </div>
            </div>
        )}
      </motion.div>
  );
};

export default EducationDetails;