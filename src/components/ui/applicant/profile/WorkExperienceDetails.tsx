import React, {useState} from "react";
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/md";
import {AnimatePresence, motion} from "framer-motion";
import {FaRegTrashAlt} from "react-icons/fa";
import ExperienceUpdateForm from "./ExperienceUpdateForm.tsx";

const WorkExperienceDetails: React.FC = ()=>{
    const [experienceCollapse, setExperienceCollapse] = useState<boolean>(false);
    return (<div>
        <div className="relative">
            {/* Education Section */}

            <div
                className="relative w-full flex-col p-3 md:p-4 border-[1px] border-[#E6E6E6] rounded-[16px] bg-gray-50 flex justify-between items-center"
            >
                {/* Left Content */}
                <div className="w-full mb-5">
                    <p className="text-sm font-semibold">BSc, Mechanical Engineering</p>
                    <p className="text-sm font-light text-gray-100">Dec 2025 - Dec 2025</p>
                </div>

                {/* Dropdown Button with Options */}
                {
                    experienceCollapse ? (
                        <MdKeyboardArrowUp className="absolute right-3 top-5 cursor-pointer text-[30px]"
                                           onClick={() => setExperienceCollapse(false)}/>
                    ) : (
                        <MdKeyboardArrowDown className="absolute right-3 top-5 cursor-pointer text-[30px]"
                                             onClick={() => setExperienceCollapse(true)}/>
                    )
                }

                {/* AnimatePresence allows animation of exiting components */}
                <AnimatePresence>
                    {experienceCollapse && (
                        <motion.div
                            initial={{opacity: 0, height: 0}}
                            animate={{opacity: 1, height: "auto"}}
                            exit={{opacity: 0, height: 0}}
                            transition={{duration: 0.5, ease: "easeInOut"}}
                            className="w-full overflow-hidden"
                        >
                            <ExperienceUpdateForm/>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <FaRegTrashAlt className="absolute -right-4 lg:-right-6 text-[11px] top-8 font-light cursor-pointer"/>
        </div>
    </div>);
}

export default WorkExperienceDetails;