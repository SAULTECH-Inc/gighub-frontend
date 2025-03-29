import React from "react";

interface ActionPrompterProps {
    open: boolean;
    message: string;
    onAnswer: (confirmed: boolean) => void;
}

const ActionPrompter: React.FC<ActionPrompterProps> = ({
                                                           open,
                                                           message,
                                                           onAnswer,
                                                       }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-xl p-5 max-w-xs w-full shadow-2xl animate-scale-in">
                <div className="text-center space-y-4">
                    {/* Icon Section */}
                    <div className="flex justify-center">
                        <svg
                            className="w-12 h-12 text-[#FD7E14]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    {/* Message Text */}
                    <p className="text-[#000000] text-base font-medium leading-relaxed">
                        {message}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-3 mt-4">
                        <button
                            onClick={() => onAnswer(false)}
                            className="px-4 py-2.5 rounded-lg text-[#8E8E8E] font-medium hover:bg-gray-100
                       transition-all duration-200 border border-transparent hover:border-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onAnswer(true)}
                            className="px-4 py-2.5 rounded-lg bg-[#56E5A1] text-white font-medium
                       hover:bg-[#45C48B] transition-all duration-200
                       shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionPrompter;
