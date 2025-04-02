import React from "react";
import microscope from '../../assets/icons/microscope.svg';
import certificate from '../../assets/icons/certificate.svg';
import location from '../../assets/icons/locations.svg';
import filter from '../../assets/icons/filter.svg';


interface JobSearchTopBarProps {
    toggleSidebar: () => void;
}
const JobSearchTopBar: React.FC<JobSearchTopBarProps> = ({
    toggleSidebar,
                                                         }) => {
    return (
        <div className="w-full flex flex-col justify-center bg-white mx-auto gap-y-8 p-6 mt-10">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <div className="flex w-full h-[43px] items-center rounded-[16px] border-[#F9F9F9] bg-[#F9F9F9]">
                    <img src={microscope} alt="microscope" className="m-2"/>
                    <input
                        type="text"
                        placeholder="Find job"
                        className="bg-transparent border-none h-full focus:ring-0 focus:outline-none px-4 py-2 w-full"
                    />
                </div>
                <div className="flex w-full h-[43px] items-center rounded-[16px] border-[#F9F9F9] bg-[#F9F9F9]">
                    <img src={certificate} alt="certificate" className="m-2"/>
                    <input
                        type="text"
                        placeholder="Certification"
                        className="bg-transparent border-none h-full focus:ring-0 focus:outline-none px-4 py-2 w-full"
                    />
                </div>
                <div className="flex w-full h-[43px] items-center rounded-[16px] border-[#F9F9F9] bg-[#F9F9F9]">
                    <img src={location} alt="location" className="m-2"/>
                    <input
                        type="text"
                        placeholder="Location"
                        className="bg-transparent border-none h-full focus:ring-0 focus:outline-none px-4 py-2 w-full"
                    />
                </div>
                <div className="flex gap-4 items-center">
                    <button
                        type="button"
                        className="w-full lg:w-[60%] h-[43px] rounded-[16px] bg-[#6438C2] text-white text-center"
                    >
                        Find Job
                    </button>
                    <div
                        onClick={toggleSidebar}
                        className="cursor-pointer w-[30%] h-[43px] rounded-[10px] bg-white border-[#F6F6F6] border-[2px] flex items-center justify-center md:hidden"
                    >
                        <img src={filter} alt="filter icon"/>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-wrap md:justify-between">
                <div className="flex items-center gap-x-1 md:gap-x-8">
                    <h2 className="text-[16px] text-[#141B34] font-bold">Popular Search:</h2>
                    <div className="flex text-xs items-center gap-x-2">
                        <p>UI/UX</p>
                        <p> Illustrator</p>
                        <p>Graphic Design</p>
                    </div>
                </div>
                <div className="hidden md:flex">
                    <p>Total Jobs Posted: <span>3k</span></p>
                </div>
            </div>
        </div>
    );
}

export default JobSearchTopBar;
