import React from "react";
import WorkExperienceDetails from "./WorkExperienceDetails.tsx";
import useModalStore from "../../../../store/modalStateStores.ts";
import AddExperienceModal from "./AddExperienceModal.tsx";

const WorkExperience: React.FC = () => {
    const { openModal } = useModalStore();

    return (
        <section id="work-experience" className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] space-y-3">
            <h3 className="font-lato text-[20px] mb-4">
                Work Experience
            </h3>
            <div className="flex flex-col gap-y-4">
                <WorkExperienceDetails/>
                <WorkExperienceDetails/>
            </div>
            {/* Add Education Button */}
            <div className="w-full flex justify-start">
                <button
                    type="button"
                    onClick={() => openModal("add-educational-modal")}
                    className="flex items-center px-4 border-[#E6E6E6] border-[1px] w-[197px] h-[39px] rounded-[10px] bg-[#FFFFFF] text-purple-600 font-medium hover:underline">
                    Add experience
                    <span className="ml-2 text-xl font-bold">+</span>
                </button>
            </div>
            <AddExperienceModal modalId="add-experience-modal"/>
        </section>
    );
};

export default WorkExperience;
