import React, {useEffect, useState} from "react";
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/md";
import {AnimatePresence, motion} from "framer-motion";
import EducationUpdateForm from "./EducationUpdateForm.tsx";
import {FaRegTrashAlt} from "react-icons/fa";
import {CvResponseDto, EducationResponseDto} from "../../../../utils/types";
import moment from "moment";
import {toast} from "react-toastify";
import {useSectionEditable} from "../../../../store/useEditable.ts";
import {useApplicantJobProfile} from "../../../../store/useApplicantJobProfile.ts";

export interface EductionDetailsProps {
    education: EducationResponseDto;
}

const EducationDetails: React.FC<EductionDetailsProps> = ({education}) => {
    const {isEditable, toggleEdit} = useSectionEditable("education");
    const [educationCollapse, setEducationCollapse] = useState<boolean>(false);

    const {
        deleteEducation,
        applicantEducation,
        educations,
        setEducations,
        setApplicantEducation,
        updatedApplicantEducation,
        cvDetails,
        setCvDetails
    } = useApplicantJobProfile();
    useEffect(() => {
        setApplicantEducation(education);
    }, [education]);
    const handleDeleteEducation = async () => {
        try {
            console.log("ID of Education to be deleted is ::: " + education.id)
            const success = await deleteEducation(education.id as number);
            if (success) {
                toast.success("Education deleted successfully!");
                const updatedEducations = educations.filter(edu => edu.id !== education.id);
                setEducations(updatedEducations);
                setCvDetails({
                    ...cvDetails,
                    educations: updatedEducations,
                } as CvResponseDto);

            }
        } catch (e) {
            console.error("Failed to delete education:", e);
            toast.error("Failed to delete education: " + e);
        }
    }
    const handleUpdateEducation = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            console.log("EDUCATION TO BE UPDATED ::: " + JSON.stringify(applicantEducation));
            const response = await updatedApplicantEducation(applicantEducation);

            if (response) {
                toast.success("Education updated successfully!");
                const updatedEducations = educations.map((edu) => {
                        if (edu.id === applicantEducation.id) {
                            return response;
                        }
                        return edu;
                    }
                );
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
        console.log("🔄 Button Clicked! Before toggle: ", isEditable);
        toggleEdit();
        console.log("After toggle: ", isEditable);
    };


    return (<div>
        <div className="relative">
            {
                educationCollapse && (
                    <div
                        className="absolute z-10 top-16 right-10 md:top-5 md:right-24 flex justify-evenly items-center text-xs gap-x-2">
                        <button type="button" onClick={handleToggleEdit}
                                className="bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1">Edit
                        </button>
                        <button type="button"
                                onClick={handleUpdateEducation}
                                className={`${!isEditable ? "cursor-not-allowed" : "cursor-pointer"} bg-[#F6F6F7] w-12 rounded-[5px] border-[#ccc] border-[1px] p-1`}>Save
                        </button>
                    </div>
                )
            }

            <div
                className="relative w-full flex-col p-3 md:p-4 border-[1px] border-[#E6E6E6] rounded-[16px] bg-gray-50 flex justify-between items-center"
            >
                {/* Left Content */}
                <div className="w-full mb-5">
                    <p className="text-sm font-semibold">{applicantEducation?.degree}, {applicantEducation?.fieldOfStudy}</p>
                    <p className="text-sm font-light text-gray-100">{moment(applicantEducation?.startDate).format('MMM YYYY')} - {moment(applicantEducation?.startDate).format('MMM YYYY')}</p>
                </div>

                {/* Dropdown Button with Options */}
                {
                    educationCollapse ? (
                        <MdKeyboardArrowUp className="absolute right-3 top-5 cursor-pointer text-[30px]"
                                           onClick={() => setEducationCollapse(false)}/>
                    ) : (
                        <MdKeyboardArrowDown className="absolute right-3 top-5 cursor-pointer text-[30px]"
                                             onClick={() => setEducationCollapse(true)}/>
                    )
                }

                {/* AnimatePresence allows animation of exiting components */}
                <AnimatePresence>
                    {educationCollapse && (
                        <motion.div
                            initial={{opacity: 0, height: 0}}
                            animate={{opacity: 1, height: "auto"}}
                            exit={{opacity: 0, height: 0}}
                            transition={{duration: 0.5, ease: "easeInOut"}}
                            className="relative w-full overflow-hidden"
                        >
                            <EducationUpdateForm isEditable={isEditable} educationData={education}/>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <FaRegTrashAlt className="absolute -right-4 lg:-right-6 text-[11px] top-8 font-light cursor-pointer"
                           onClick={handleDeleteEducation}/>
        </div>
    </div>);
}

export default EducationDetails;