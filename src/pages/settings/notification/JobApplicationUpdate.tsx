import { useState } from "react";
import ToggleSwitch from "../../../components/common/ToggleSwitch.tsx";

const JobApplicationUpdate = () => {
    // State to track toggle status for each item
    const [toggledItems, setToggledItems] = useState<{ [key: string]: boolean }>({});

    // Function to toggle a specific item
    const handleToggle = (item: string) => {
        setToggledItems((prev) => ({
            ...prev,
            [item]: !prev[item], // Toggle the state
        }));
    };

    // Define application updates options
    const applicationUpdates = ["All", "Submitted", "Shortlisted", "Rejected", "Interview Schedule"];

    // Define notification types options
    const notificationTypes = ["All", "Email", "Push"];

    return (
        <div className="flex flex-col items-center py-10 font-lato w-full">
            {/* Title */}
            <h2 className="text-black font-bold text-[24px] leading-[28.8px] tracking-[0%] text-xl mt-[-80px] self-start pl-4">
                Job Application Update
            </h2>

            {/* Privacy Box */}
            <div className="bg-white border border-[#E6E6E6] rounded-[16px] w-[920px] min-h-[265px] flex flex-col items-start py-6 px-8 mt-4">
                {/* Two Column Headings */}
                <div className="grid grid-cols-2 w-full">
                    <h3 className="text-black text-md font-bold">Receive Update on Application Status</h3>
                    <h3 className="text-black text-md font-bold text-right">Notification Type</h3>
                </div>

                {/* Horizontal Rule */}
                <hr className="w-full border-t border-[#E6E6E6] my-3" />

                {/* Two-Column Layout */}
                <div className="grid grid-cols-2 w-full">
                    {/* Left Column - Application Status */}
                    <div className="w-full space-y-4">
                        {applicationUpdates.map((item, index) => (
                            <label key={index} className="flex items-center justify-between">
                                <span className="font-bold text-[16px] text-[#8E8E8E]">{item}</span>
                                <ToggleSwitch
                                    isOn={toggledItems[item] || false}
                                    onToggle={() => handleToggle(item)}
                                />
                            </label>
                        ))}
                    </div>

                    {/* Right Column - Notification Type */}
                    <div className="w-full space-y-4">
                        {notificationTypes.map((item, index) => (
                            <label key={index} className="flex items-center justify-between">
                                <span className="font-bold text-[16px] text-[#8E8E8E]">{item} Notification</span>
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
    );
};

export default JobApplicationUpdate;
