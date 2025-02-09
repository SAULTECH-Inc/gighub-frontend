import React, { useState } from "react";
import video from "../../assets/icons/video.svg";
import work from "../../assets/icons/work.svg";
import documentValidation from "../../assets/icons/documentValidation.svg";
import applyAvatar from "../../assets/images/applyAvatar.png";
import ApplicationSuccessModal from "./ApplicationSuccessModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";

interface ApplicationModalProps {
    modalId: string;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ modalId }) => {
    const { modals, closeModal, openModal } = useModalStore();
    const isOpen = modals[modalId]; // Reactive state for this modal
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const handleSelection = (option: string) => {
        setSelectedOptions((prevState) =>
            prevState.includes(option)
                ? prevState.filter((item) => item !== option)
                : [...prevState, option]
        );
    };

    const handleApplyNow = () => {
        closeModal(modalId); // Close current modal
        openModal("application-success"); // Open success modal
    };

    const handleCloseApplicationModal = () => {
        closeModal(modalId); // Close this modal
    };



    const iconMapping: Record<string, string> = {
        "Applied with Profile": applyAvatar,
        "Apply with Video": video,
        "Apply with CV": documentValidation,
        "Apply with work sample": work,
    };

    if (!isOpen) return null; // Only render modal when it is open

    return (
        <>
            {/* Application Modal */}
            <div
                className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                onClick={handleCloseApplicationModal} // Close modal when clicking outside
            >
                <div
                    className="bg-white rounded-[16px] shadow-lg w-[568px] h-[830px] flex flex-col justify-evenly py-[5px]"
                    onClick={(e) => e.stopPropagation()} // Prevent click event propagation
                >
                    <div className="flex flex-col justify-between px-8 mb-0">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-[24px] font-semibold">
                                Select Method of Application
                            </h2>
                            <button
                                onClick={handleCloseApplicationModal}
                                className="text-gray-500 text-2xl cursor-pointer"
                            >
                                ×
                            </button>
                        </div>
                        <p className="mb-6 text-gray-600 text-justify w-[267px]">
                            We will automatically help you figure out the raised
                        </p>
                    </div>

                    <hr className="w-full border-[#CCCCCC] my-0" />

                    {/* Recruiter Requirement buttons */}
                    <p className="text-[16px] px-8">Recruiter Requirements</p>
                    <div className="flex space-x-3 mb-4 px-8">
                        {["CV", "Portfolio", "Recent worksample"].map((label) => (
                            <button
                                key={label}
                                className={`py-2 px-6 rounded-[10px] h-[38px] text-[16px] ${
                                    selectedOptions.includes(label)
                                        ? "bg-purple-600 text-white border-purple-600"
                                        : "bg-purple-100 text-purple-600 border-purple-200"
                                }`}
                                onClick={() => handleSelection(label)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Text above the cards */}
                    <p className="text-[16px] text-[#8E8E8E] mb-4 px-8">
                        Please select your method of application and we will automatically
                        send your application to the recruiter.
                    </p>

                    <div className="grid grid-cols-2 gap-x-16 gap-y-4 mx-auto">
                        {[
                            "Applied with Profile",
                            "Apply with CV",
                            "Apply with Video",
                            "Apply with work sample",
                        ].map((label) => (
                            <div
                                key={label}
                                className={`relative flex flex-col justify-center items-center w-[214px] h-[154px] p-4 border-[3px] rounded-[16px] cursor-pointer 
            transition-all duration-300 ease-in-out ${
                                    selectedOptions.includes(label)
                                        ? "border-[#6438C2]" // Apply thick border with #6438C2 when selected
                                        : "border-[#E6E6E6]" // Default border
                                } hover:outline-[#6438C2] hover:outline-[3px] hover:outline-offset-0`} // Add outline on hover
                                onClick={() => handleSelection(label)}
                            >
                                <div className="flex justify-center items-center w-[50px] h-[50px] border-[1px] border-[#E6E6E6] rounded-[10px] mb-3">
                                    <img
                                        src={iconMapping[label]}
                                        alt={`${label} icon`}
                                        className="w-[24px] h-[24px]"
                                    />
                                </div>
                                <span className="font-medium text-center text-[16px]">
                  {label}
                </span>
                                {/* Custom Checkbox */}
                                <div
                                    className={`absolute top-2 right-2 w-[30px] h-[30px] flex items-center justify-center rounded-full transition-all duration-300 ease-in-out cursor-pointer ${
                                        selectedOptions.includes(label)
                                            ? "bg-[#6438C2] border-none"
                                            : "bg-white border-[#E6E6E6]"
                                    } hover:bg-[#6438C2]`}
                                >
                                    {selectedOptions.includes(label) && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-[20px] h-[20px]"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end space-x-10 mt-6 text-right px-8">
                        <button className="py-2 px-6 w-[211px] h-[43px] border-[#ccc] border-[1px] rounded-[10px] text-[16px] text-gray-700">
                            Go to recruiter profile
                        </button>

                        <button
                            onClick={handleApplyNow}
                            className="py-2 px-6 w-[133px] h-[43px] bg-[#6438C2] text-[16px] text-white rounded-[10px]"
                        >
                            Apply now
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <ApplicationSuccessModal modalId="application-success" />
        </>
    );
};

export default ApplicationModal;
