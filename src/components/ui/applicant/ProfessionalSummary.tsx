import React from "react";

const ProfessionalSummary: React.FC = () => {
    const titles = [
        "Software Engineer",
        "Project Manager",
        "Designer",
        "Data Scientist",
        "Business Analyst",
        "DevOps Engineer",
    ]; // Example options

    return (
        <section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
            <h3 className="font-lato text-[20px] mb-4">
                Professional Summary
            </h3>
            <div className="flex flex-col mx-auto">
                <label
                    htmlFor="professionalTitle"
                    className="mb-1 text-sm  font-lato font-medium  text-gray-600"
                >
                    Professional Title
                </label>
                <select
                    id="professionalTitle"
                    className="p-3 border rounded-[10px] bg-gray-50 focus:outline-none focus:ring-2  bg-[#F7F8FA] w-[964px]  h-[37px] border-none"
                >
                    <option value=""></option>
                    {titles.map((title, index) => (
                        <option key={index} value={title}>
                            {title}
                        </option>
                    ))}
                </select>
            </div>
        </section>
    );
};

export default ProfessionalSummary;
