import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegTrashAlt } from "react-icons/fa";
import ExperienceUpdateForm from "./ExperienceUpdateForm.tsx";
import { CvResponseDto, ExperienceResponseDto } from "../../../../utils/types";
import { useApplicantJobProfile } from "../../../../store/useApplicantJobProfile.ts";
import { toast } from "react-toastify";
import { useSectionEditable } from "../../../../store/useEditable.ts";
import moment from "moment";
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
  const { isEditable, toggleEdit } = useSectionEditable("experience");

  useEffect(() => {
    setExperience(experienceData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienceData]);
  const handleDeleteExperience = async () => {
    try {
      console.log("ID of Education to be deleted is ::: " + experience.id);
      const success = await deleteExperience(experience.id as number);
      if (success) {
        toast.success("Education deleted successfully!");
        const updatedExperience = experiences.filter(
          (edu) => edu.id !== experience.id,
        );
        setExperiences(updatedExperience);
        setCvDetails({
          ...cvDetails,
          experiences: updatedExperience,
        } as CvResponseDto);
      }
    } catch (e) {
      console.error("Failed to delete education:", e);
      toast.error("Failed to delete education: " + e);
    }
  };
  const handleUpdateExperience = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    try {
      const response = await updateExperience(experience);

      if (response) {
        toast.success("updated successfully!");
        const updatedExperiences = experiences.map((edu) => {
          if (edu.id === experience.id) {
            return response;
          }
          return edu;
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
    console.log("🔄 Button Clicked! Before toggle: ", isEditable);
    toggleEdit();
    console.log("After toggle: ", isEditable);
  };

  return (
    <div>
      <div className="relative">
        {/* Education Section */}
        {experienceCollapse && (
          <div className="absolute top-16 right-10 z-10 flex items-center justify-evenly gap-x-2 text-xs md:top-5 md:right-24">
            <button
              type="button"
              onClick={handleToggleEdit}
              className="w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleUpdateExperience}
              className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} w-12 rounded-[5px] border-[1px] border-[#ccc] bg-[#F6F6F7] p-1`}
            >
              Save
            </button>
          </div>
        )}
        <div className="relative flex w-full flex-col items-center justify-between rounded-[16px] border-[1px] border-[#E6E6E6] bg-gray-50 p-3 md:p-4">
          {/* Left Content */}
          <div className="mb-5 w-full">
            <p className="text-sm font-semibold">
              {experienceData.position}, {experienceData.company}
            </p>
            <p className="text-sm font-light text-gray-100">
              {moment(experienceData?.startDate).format("MMM YYYY")} -{" "}
              {moment(experienceData?.endDate).format("MMM YYYY")}
            </p>
          </div>

          {/* Dropdown Button with Options */}
          {experienceCollapse ? (
            <MdKeyboardArrowUp
              className="absolute top-5 right-3 cursor-pointer text-[30px]"
              onClick={() => setExperienceCollapse(false)}
            />
          ) : (
            <MdKeyboardArrowDown
              className="absolute top-5 right-3 cursor-pointer text-[30px]"
              onClick={() => setExperienceCollapse(true)}
            />
          )}

          {/* AnimatePresence allows animation of exiting components */}
          <AnimatePresence>
            {experienceCollapse && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full overflow-hidden"
              >
                <ExperienceUpdateForm
                  isEditable={isEditable}
                  experienceData={experienceData}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <FaRegTrashAlt
          onClick={handleDeleteExperience}
          className="absolute top-8 -right-4 cursor-pointer text-[11px] font-light lg:-right-6"
        />
      </div>
    </div>
  );
};

export default WorkExperienceDetails;
