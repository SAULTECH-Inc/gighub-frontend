import React from "react";
import microscope from '../../assets/icons/microscope.svg';
import certificate from '../../assets/icons/certificate.svg';
import location from '../../assets/icons/locations.svg';
const JobSearchTopBar: React.FC = () => {
    return (
        <div className="w-full flex flex-col  justify-center bg-white mx-auto gap-y-8 p-6">
            <div className="w-full flex justify-start items-center gap-x-8">
                <div
                    className="flex w-[367px] h-[43px] items-center rounded-[16px] border-[#F9F9F9] bg-[#F9F9F9] focus:border-[#ccc]">
                    <img src={microscope} alt="microscope" className="m-2"/>
                    <input
                        type="text"
                        placeholder="Find job"
                        className="bg-transparent border-none h-full focus:border-none focus:ring-0 focus:outline-none px-4 py-2 w-full"
                    />
                </div>
                <div
                    className="flex w-[367px] h-[43px] items-center rounded-[16px] border-[#F9F9F9] border-2 bg-[#F9F9F9] focus:border-[#ccc]">
                    <img src={certificate} alt="certificate" className="m-2"/>
                    <input
                        type="text"
                        placeholder="Certification"
                        className="bg-transparent border-none h-full focus:border-none focus:ring-0 focus:outline-none px-4 py-2 w-full"
                    />
                </div>
                <div
                    className="flex w-[367px] h-[43px] items-center rounded-[16px] border-[#F9F9F9] border-2 bg-[#F9F9F9] focus:border-[#ccc] mr-10">
                    <img src={location} alt="location" className="m-2"/>
                    <input
                        type="text"
                        placeholder="Location"
                        className="bg-transparent border-none h-full focus:border-none focus:ring-0 focus:outline-none px-4 py-2 w-full"
                    />
                </div>
                <button type="button" className="w-[159px] h-[43px] items-center rounded-[16px] bg-[#6438C2] text-center text-white focus:border-none focus:ring-0 focus:outline-none">Find Job</button>
            </div>
            <div className="w-full flex justify-between">
                <div className="flex justify-evenly gap-x-8">
                    <h2 className="text-[16px] text-[#141B34] font-bold">Popular Search:</h2>
                    <p>UI/UX</p>
                    <p>Illustrator</p>
                    <p>Graphic Design</p>
                </div>
                <div>
                    <p>Total Jobs Posted: <span>3k</span></p>
                </div>

            </div>
        </div>
    );
}

export default JobSearchTopBar;