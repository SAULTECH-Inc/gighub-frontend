import { useState } from "react";
import ToggleSwitch from "../../../components/common/ToggleSwitch.tsx";

const AutoApply = () => {
    // State to track toggle status for each item
    const [toggledItems, setToggledItems] = useState<{ [key: string]: boolean }>({});

    // Function to toggle a specific item
    const handleToggle = (item: string) => {
        setToggledItems((prev) => ({
            ...prev,
            [item]: !prev[item], // Toggle the state
        }));
    };

    return (
        <div className="flex flex-col items-center py-10 font-lato">
            <hr className="w-full border-t border-[#E6E6E6] mb-4" />

            {/* Page Title */}
            <h2 className="text-black font-bold text-[24px] leading-[28.8px] tracking-[0%] self-start pl-4">
                Auto Apply Notification
            </h2>

            {/* White Box Container */}
            <div className="bg-white border border-[#E6E6E6] rounded-[16px] w-[920px] min-h-[200px] flex flex-col items-start py-6 px-8 mt-4">
                {/* Header Titles */}
                <div className="grid grid-cols-2 w-full font-bold text-md text-black">
                    <h3>Notify me when:</h3>
                    <h3>Notification Type</h3>
                </div>

                {/* Horizontal Rule */}
                <hr className="w-full border-t border-[#E6E6E6] my-3" />

                {/* Two-Column Layout */}
                <div className="grid grid-cols-2 w-full">
                    {/* Left Column - Auto Apply Updates */}
                    <div className="w-full">
                        <div className="space-y-4 mt-2">
                            {[
                                "A job is auto-applied successfully",
                                "An auto-apply job matches my profile but fails to apply",
                            ].map((item, index) => (
                                <label key={index} className="flex items-center justify-between">
                                    <span className="text-[16px] text-[#8E8E8E]">{item}</span>
                                    <ToggleSwitch
                                        isOn={toggledItems[item] || false}
                                        onToggle={() => handleToggle(item)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Notification Type */}
                    <div className="w-full">
                        <div className="space-y-4 mt-2">
                            {["Email Notification", "Push Notification"].map((item, index) => (
                                <label key={index} className="flex items-center justify-between">
                                    <span className="text-[16px] text-[#8E8E8E]">{item}</span>
                                    <ToggleSwitch
                                        isOn={toggledItems[item] || false}
                                        onToggle={() => handleToggle(item)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoApply;
