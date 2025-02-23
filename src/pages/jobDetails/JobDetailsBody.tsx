import React from "react";

const JobDetailsBody: React.FC = () => {
    return (
        <div className="flex flex-col ml-[-360px] mt-[-60px] items-center justify-center bg-gray-100 ">
            {/* Top Section */}
            <div className="w-[986px] h-[84px] bg-white flex items-center justify-between px-6 shadow-md top-[20px] rounded-md ">
                <h2 className="text-black font-lato text-lg font-bold">Product Designer</h2>
                <div className="flex space-x-4 text-[#6438C2] font-bold text-[20px] leading-[24px] tracking-[0%] font-lato text-md">
                    <span>Full Time/ Remote</span>
                    <span>|</span>
                    <span>Mid Level</span>
                </div>
            </div>

            {/* Job Details Box */}
            <div className="w-[986px] h-[747px] bg-white shadow-lg rounded-[16px] mt-[20px] p-8">
                {/* Job Description Section */}
                <div className="w-[921px] h-[40px] bg-[#6438C2] rounded-[16px] flex items-center px-4">
                    <span className="text-white font-lato font-bold text-lg">Job Description</span>
                </div>
                <p className="text-[#8E8E8E] font-lato  text-[16px] leading-[19.2px] tracking-[0%] mt-4">
                    We are looking for a creative and detail-oriented Product Designer to join our dynamic team.
                    In this role, you will collaborate with cross-functional teams to design and improve user-centered
                    products
                    that solve complex problems. Your work will directly impact the user experience,
                    ensuring our products are not only functional but also aesthetically appealing and intuitive.
                </p>

                {/* Key Responsibilities */}
                <div className="w-[921px] h-[40px] bg-[#6438C2] rounded-[16px] flex items-center px-4 mt-6">
                    <span className="text-white font-lato font-bold text-lg">Key Responsibility</span>
                </div>
                <ul className="text-[#8E8E8E] font-lato text-[16px] leading-[19.2px] list-disc list-inside marker:text-purple-600 mt-4 space-y-3">
                    <li>User-Centered Design: Conduct user research, create user personas, and map customer journeys to
                        inform design decisions.
                    </li>
                    <li>Concept Development: Develop wireframes, mockups, and prototypes to communicate design concepts
                        effectively.
                    </li>
                    <li>Collaboration: Work closely with product managers, developers, and stakeholders to align on
                        design goals and deliverables.
                    </li>
                    <li>Visual Design: Design high-fidelity UI elements and ensure they align with the company’s brand
                        and style guidelines.
                    </li>
                    <li>Iterative Design Process: Gather feedback, test prototypes with users, and iterate designs to
                        improve usability and user satisfaction.
                    </li>
                    <li>Design Systems: Maintain and contribute to the company’s design system, ensuring consistency
                        across all products.
                    </li>
                    <li>Problem Solving: Analyze user pain points and business challenges to deliver innovative and
                        practical design solutions.
                    </li>
                    <li>Handoff to Development: Prepare design assets and collaborate with developers to ensure seamless
                        implementation of designs.
                    </li>
                </ul>


                <div className="top-20">
                    {/* Horizontal Rule */}
                    <hr className="w-[910.5px] border border-black mt-[150px]"/>

                    {/* Edit Job Button */}
                    <button
                        className="w-[225px] h-[46px] bg-[#6438C2] text-white font-lato text-md font-bold rounded-[15px] mt-[20px] px-10 py-3 ml-[670px]"
                    >
                        Edit Job
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsBody;
