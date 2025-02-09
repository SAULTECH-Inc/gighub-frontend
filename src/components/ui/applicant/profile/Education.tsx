import React from "react";
import EducationDetails from "./EducationDetails.tsx";
import useModalStore from "../../../../store/modalStateStores.ts";
import AddEducationModal from "./AddEducationModal.tsx";
// Importing AnimatePresence for exit animations

const Education: React.FC = () => {
    const { openModal } = useModalStore();
    return (
        <section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] space-y-3">
            <h3 className="font-lato text-[20px] mb-4">
                Education
            </h3>
            <div className="flex flex-col gap-y-4">
                <EducationDetails/>
                <EducationDetails/>
            </div>
            {/* Add Education Button */}
            <div className="w-full flex justify-start">
                <button
                    type="button"
                    onClick={() => openModal("add-educational-modal")}
                    className="flex items-center px-4 border-[#E6E6E6] border-[1px] w-[197px] h-[39px] rounded-[10px] bg-[#FFFFFF] text-purple-600 font-medium hover:underline">
                    Add education
                    <span className="ml-2 text-xl font-bold">+</span>
                </button>
            </div>
            <AddEducationModal modalId="add-educational-modal"/>
        </section>
    );
};

export default Education;
