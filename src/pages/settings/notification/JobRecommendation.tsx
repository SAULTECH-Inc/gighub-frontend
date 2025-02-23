import ToggleSwitch from "../../../components/common/ToggleSwitch.tsx";
import { useState } from "react";

const JobRecommendation = () => {
    // State to track toggle status for each item
    const [toggledItems, setToggledItems] = useState<{ [key: string]: boolean }>({});

    // Function to toggle state for a specific item
    const handleToggle = (item: string) => {
        setToggledItems((prev) => ({
            ...prev,
            [item]: !prev[item], // Toggle the state
        }));
    };

    return (
        <div className="flex flex-col items-center py-10 font-lato mt-5">
            <hr className="w-full border-t border-[#E6E6E6] mb-4" />

            {/* Page Title */}
            <h2 className="text-black font-bold text-[24px] leading-[28.8px] tracking-[0%] self-start pl-4">
                Job Recommendation
            </h2>

            {/* White Box Container */}
            <div className="bg-white border border-[#E6E6E6] rounded-[16px] w-[920px] min-h-[363px] flex flex-col items-start py-6 px-8 mt-10">
                {/* Header Titles */}
                <div className="grid grid-cols-2 w-full font-bold text-md text-black">
                    <h3>Notify me about recommended jobs based on</h3>
                    <h3>Frequency</h3>
                </div>

                {/* Horizontal Rule */}
                <hr className="w-full border-t border-[#E6E6E6] my-3" />

                {/* Two-Column Layout */}
                <div className="grid grid-cols-2 w-full">
                    {/* Left Column - Job Preferences */}
                    <div className="w-full">
                        <div className="space-y-4 mt-2">
                            {["Profile Preferences", "Saved Job Search"].map((item, index) => (
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

                    {/* Right Column - Frequency */}
                    <div className="w-full">
                        <div className="space-y-4 mt-2">
                            {["Instant", "Daily", "Weekly"].map((item, index) => (
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

                {/* Notification Type */}
                <hr className="w-full border-t border-[#E6E6E6] my-5" />
                <h3 className="font-bold text-md text-black">Notification Type</h3>

                <div className="space-y-4 mt-4 w-full">
                    {["All", "Email Notification", "Push Notification"].map((item, index) => (
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
    );
};

export default JobRecommendation;
