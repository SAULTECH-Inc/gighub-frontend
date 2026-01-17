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
  Calendar,
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
    if (
      !window.confirm("Are you sure you want to delete this education entry?")
    ) {
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

  const handleUpdateEducation = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
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
      className="relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:shadow-sm"
    >
      {/* Main Content */}
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex flex-1 items-start gap-4">
            {/* Education Icon */}
            <div className="flex-shrink-0 rounded-lg bg-purple-100 p-2">
              <GraduationCap className="h-5 w-5 text-purple-600" />
            </div>

            {/* Education Info */}
            <div className="min-w-0 flex-1">
              <h4 className="mb-1 text-lg font-semibold text-gray-900">
                {applicantEducation?.degree}
                {applicantEducation?.fieldOfStudy && (
                  <span className="text-gray-600">
                    {" "}
                    in {applicantEducation.fieldOfStudy}
                  </span>
                )}
              </h4>

              <div className="mb-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>{applicantEducation?.institution}</span>
                </div>

                {applicantEducation?.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {applicantEducation.city}, {applicantEducation?.country}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateRange()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-shrink-0 items-center gap-2">
            {/* Delete Button */}
            <button
              onClick={handleDeleteEducation}
              disabled={isDeleting}
              className="rounded-lg p-2 text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
              title="Delete education"
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>

            {/* Expand/Collapse Button */}
            <button
              type="button"
              onClick={() => setEducationCollapse(!educationCollapse)}
              className="rounded-lg p-2 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600"
              title={educationCollapse ? "Collapse" : "Expand"}
            >
              {educationCollapse ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Quick Preview (when collapsed) */}
        {!educationCollapse && applicantEducation?.description && (
          <div className="mt-3 line-clamp-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            <div
              dangerouslySetInnerHTML={{
                __html: applicantEducation.description,
              }}
            />
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
              <div className="mb-4 flex items-center justify-end gap-2">
                <button
                  onClick={handleToggleEdit}
                  type="button"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isEditable
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  }`}
                >
                  <Edit3 className="h-4 w-4" />
                  {isEditable ? "Cancel" : "Edit"}
                </button>

                {isEditable && (
                  <button
                    onClick={handleUpdateEducation}
                    type="button"
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-purple-700"
                  >
                    <Save className="h-4 w-4" />
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
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Ready to save</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EducationDetails;
