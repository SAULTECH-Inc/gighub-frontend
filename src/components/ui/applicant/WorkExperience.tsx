import React from "react";

const WorkExperience: React.FC = () => {
    const educationOptions = [
        "0-1 year",
        "1-3 years",
        "3-5 years",
        "5-7 years",
        "7-10 years",
        "10+ years",
    ];
    return (
        <div className="flex flex-col items-center justify-center  bg-gray-100 space-y-6">
            {/* Education Section */}
            <div
                className="w-[964px] h-[68px] p-4 border-[1px] border-[#E6E6E6] rounded-[16px] bg-gray-50 flex justify-between items-center"
            >
                {/* Left Content */}
                <div>
                    <p className="text-sm font-medium">Product Designer - Fundy Inc</p>
                    <p className="text-sm text-gray-500">Dec 2025 - Dec 2025</p>
                </div>

                {/* Dropdown Button with Options */}
                <select
                    className="appearance-none bg-transparent border-none text-gray-600 focus:outline-none"
                    defaultValue=""
                >
                    <option value="" disabled>

                    </option>
                    {educationOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {/* Add Education Button */}
            <div className="w-[964px] flex justify-start">
                <button className="flex items-center px-4 border-[#E6E6E6] border-[1px] w-[197px] h-[39px] rounded-[10px] bg-[#FFFFFF] text-purple-600 font-medium hover:underline">
                    Work Experience
                    <span className="ml-2 text-xl font-bold">+</span>
                </button>
            </div>
        </div>
    );
};

export default WorkExperience;
