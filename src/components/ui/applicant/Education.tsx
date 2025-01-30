import React from "react";

const Education: React.FC = () => {
    const educationOptions = [
        "BSc, Computer Science",
        "BSc, Mechanical Engineering",
        "MSc, Electrical Engineering",
        "PhD, Artificial Intelligence",
    ];
    return (
        <div className="flex flex-col items-start justify-center bg-gray-100 space-y-2 mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
            {/* Education Section */}
            <h3 className="font-lato text-[20px] mb-4">
                Education
            </h3>
            <div
                className="w-[964px] h-[68px] p-4 border-[1px] border-[#E6E6E6] rounded-[16px] bg-gray-50 flex justify-between items-center"
            >
                {/* Left Content */}
                <div>
                    <p className="text-sm font-medium">BSc, Mechanical Engineering</p>
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
                <button
                    className="flex items-center px-4 border-[#E6E6E6] border-[1px] w-[197px] h-[39px] rounded-[10px] bg-[#FFFFFF] text-purple-600 font-medium hover:underline">
                    Add education
                    <span className="ml-2 text-xl font-bold">+</span>
                </button>
            </div>
        </div>
    );
};

export default Education;
