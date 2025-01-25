import React from "react";
import useModalStore from "../../redux/modalStateStores.ts";

interface SuccessModalProps {
    modalId: string;
}

const ApplicationSuccessModal: React.FC<SuccessModalProps> = ({ modalId }) => {
    const { modals, closeModal } = useModalStore(); // Access the modals state
    const isOpen = modals[modalId]; // Reactive state derived from modals

    const handleCloseApplicationSuccessModal = () => {
        if (isOpen) {
            closeModal(modalId);
        }
    };

    if (!isOpen) return null; // Do not render the modal if it's not open

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            onClick={handleCloseApplicationSuccessModal} // Close modal when clicking outside
        >
            <div
                className="relative bg-white rounded-[16px] shadow-lg w-[568px] h-[830px] flex flex-col justify-center items-center p-6"
                onClick={(e) => e.stopPropagation()} // Prevent click event propagation
            >
                {/* Close Button (X at the top-right corner) */}
                <button
                    onClick={handleCloseApplicationSuccessModal}
                    className="absolute top-4 right-4 text-gray-500 text-2xl cursor-pointer"
                >
                    ×
                </button>

                {/* Success Icon */}
                <div className="flex justify-center items-center w-fit h-fit rounded-full mb-6">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100" height="100" fill="url(#pattern0_65_26)" />
                        <defs>
                            <pattern id="pattern0_65_26" patternContentUnits="objectBoundingBox" width="1" height="1">
                                <use xlinkHref="#image0_65_26" transform="scale(0.0111111)" />
                            </pattern>
                            <image
                                id="image0_65_26"
                                width="90"
                                height="90"
                                xlinkHref="data:image/png;base64,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"
                            />
                        </defs>
                    </svg>
                </div>

                {/* Title */}
                <h2 className="text-[24px] font-semibold text-[#FA4E09] mt-10 mb-10">
                    Congratulations!
                </h2>

                {/* Message */}
                <p className="w-[458px] text-center text-gray-600 text-[16px] mb-8">
                    Your application has been successfully submitted, and all your details have been
                    received by the recruiter. You can monitor your application status by visiting your
                    Job Application Dashboard. Thank you for taking the next step in your career journey
                    with us!
                </p>

                {/* Check Status Button */}
                <button className="bg-[#6438C2] w-[232px] text-white text-[16px] font-medium rounded-[10px] py-3 px-8">
                    Check Status
                </button>
            </div>
        </div>
    );
};

export default ApplicationSuccessModal;
