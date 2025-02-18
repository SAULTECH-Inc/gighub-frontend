import React, {useState} from "react";
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/md";
import {AnimatePresence, motion} from "framer-motion";
import EducationUpdateForm from "./EducationUpdateForm.tsx";
import {FaRegTrashAlt} from "react-icons/fa";
import {ApplicantData, CvResponseDto, EducationResponseDto} from "../../../../utils/types";
import moment from "moment";
import {useAuth} from "../../../../store/useAuth.ts";
import useEducationFormStore from "../../../../store/useEducationFormStore.tsx";
import {toast} from "react-toastify";
export interface EductionDetailsProps{
    education: EducationResponseDto
}
const EducationDetails: React.FC<EductionDetailsProps> = ({education})=>{
    const [educationCollapse, setEducationCollapse] = useState<boolean>(false);
    const {applicant, setProfileData} = useAuth();
    const {deleteEducation} = useEducationFormStore();
    const handleDeleteEducation = async ()=>{
        try {
            const success = await deleteEducation(education.id || 0, applicant?.id || 0, applicant?.cv?.id || 0);
            if (success) {
                toast.success("Education deleted successfully!");
                const educations: EducationResponseDto[] = [...applicant?.cv?.educations || []];
                const updatedEducations = educations.filter(edu => edu.id !== education.id);
                setProfileData({
                    ...applicant,
                    cv: {
                        ...applicant?.cv,
                        educations: updatedEducations
                    } as CvResponseDto
                } as ApplicantData);
            }
        } catch (e) {
            console.error("Failed to delete education:", e);
            toast.error("Failed to delete education: "+e);
        }
    }
    return (<div>
        <div className="relative">
            {/* Education Section */}

            <div
                className="relative w-full flex-col p-3 md:p-4 border-[1px] border-[#E6E6E6] rounded-[16px] bg-gray-50 flex justify-between items-center"
            >
                {/* Left Content */}
                <div className="w-full mb-5">
                    <p className="text-sm font-semibold">{education?.degree}, {education?.fieldOfStudy?.toLocaleUpperCase()}</p>
                    <p className="text-sm font-light text-gray-100">{moment(education?.startDate).format('MMM YYYY')} - {moment(education?.startDate).format('MMM YYYY')}</p>
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
                            className="w-full overflow-hidden"
                        >
                            <EducationUpdateForm educationData={education}/>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <FaRegTrashAlt className="absolute -right-4 lg:-right-6 text-[11px] top-8 font-light cursor-pointer" onClick={handleDeleteEducation}/>
        </div>
    </div>);
}

export default EducationDetails;