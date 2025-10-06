import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ExperienceUpdateForm from "./ExperienceUpdateForm.tsx";
import { CvResponseDto, ExperienceResponseDto } from "../../../../utils/types";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import { toast } from "react-toastify";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import moment from "moment";
import {
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  Trash2,
  Briefcase,
  MapPin,
  Calendar,
  Building,
} from "lucide-react";

interface ExperienceDetailsProps {
  experienceData: ExperienceResponseDto;
}

const WorkExperienceDetails: React.FC<ExperienceDetailsProps> = ({
  experienceData,
}) => {
  const {
    experience,
    updateExperience,
    setExperience,
    setExperiences,
    deleteExperience,
    experiences,
    setCvDetails,
    cvDetails,
  } = useApplicantJobProfile();
  const [experienceCollapse, setExperienceCollapse] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { isEditable, toggleEdit } = useSectionEditable("experience");

  useEffect(() => {
    setExperience(experienceData);
  }, [experienceData, setExperience]);

  const handleDeleteExperience = async () => {
    if (
      !window.confirm("Are you sure you want to delete this work experience?")
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deleteExperience(experience.id as number);
      if (success) {
        toast.success("Experience deleted successfully!");
        const updatedExperience = experiences.filter(
          (exp) => exp.id !== experience.id,
        );
        setExperiences(updatedExperience);
        setCvDetails({
          ...cvDetails,
          experiences: updatedExperience,
        } as CvResponseDto);
      }
    } catch (e) {
      console.error("Failed to delete experience:", e);
      toast.error("Failed to delete experience");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateExperience = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    try {
      const response = await updateExperience(experience);

      if (response) {
        toast.success("Experience updated successfully!");
        const updatedExperiences = experiences.map((exp) => {
          if (exp.id === experience.id) {
            return response;
          }
          return exp;
        });
        toggleEdit();
        setExperience(response);
        setExperiences(updatedExperiences);
        setCvDetails({
          ...cvDetails,
          experiences: updatedExperiences,
        } as CvResponseDto);
      }
    } catch (error) {
      toast.error("Failed to update experience.");
      console.error("Error updating experience:", error);
    }
  };

  const handleToggleEdit = () => {
    toggleEdit();
  };

  const formatDateRange = () => {
    const startDate = moment(experienceData?.startDate).format("MMM YYYY");
    const endDate = experienceData?.endDate
      ? moment(experienceData.endDate).format("MMM YYYY")
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
            {/* Experience Icon */}
            <div className="flex-shrink-0 rounded-lg bg-orange-100 p-2">
              <Briefcase className="h-5 w-5 text-orange-600" />
            </div>

            {/* Experience Info */}
            <div className="min-w-0 flex-1">
              <h4 className="mb-1 text-lg font-semibold text-gray-900">
                {experienceData?.position}
                {experienceData?.company && (
                  <span className="text-gray-600">
                    {" "}
                    at {experienceData.company}
                  </span>
                )}
              </h4>

              <div className="mb-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{experienceData?.company}</span>
                </div>

                {experienceData?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{experienceData.location}</span>
                    {experienceData?.city && (
                      <span>, {experienceData.city}</span>
                    )}
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
              type="button"
              onClick={handleDeleteExperience}
              disabled={isDeleting}
              className="rounded-lg p-2 text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
              title="Delete experience"
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
              onClick={() => setExperienceCollapse(!experienceCollapse)}
              className="rounded-lg p-2 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600"
              title={experienceCollapse ? "Collapse" : "Expand"}
            >
              {experienceCollapse ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Quick Preview (when collapsed) */}
        {!experienceCollapse && experienceData?.description && (
          <div className="mt-3 line-clamp-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            <div
              dangerouslySetInnerHTML={{ __html: experienceData.description }}
            />
          </div>
        )}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {experienceCollapse && (
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
                      : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                  }`}
                >
                  <Edit3 className="h-4 w-4" />
                  {isEditable ? "Cancel" : "Edit"}
                </button>

                {isEditable && (
                  <button
                    onClick={handleUpdateExperience}
                    type="button"
                    className="flex items-center gap-2 rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-orange-700"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                )}
              </div>

              {/* Experience Update Form */}
              <ExperienceUpdateForm
                isEditable={isEditable}
                experienceData={experienceData}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Indicators */}
      {experienceCollapse && !isEditable && (
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

export default WorkExperienceDetails;
