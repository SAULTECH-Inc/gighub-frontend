import {FC} from "react";


const ApplicantProfileSidebar: FC = () => {
    return (
        <div className="w-[20%] h-[3920px] lg:flex flex-col justify-between items-center bg-transparent  rounded-[16px] xs:hidden hidden">
            <div className="w-full flex flex-col justify-between bg-white h-[664px] p-10 rounded-[16px]">
                <ul className="space-y-6 text-gray-800 text-[16px] font-lato">
                    <li className="cursor-pointer text-[#6438C2] hover:text-purple-700">Personal Information</li>
                    <li className="cursor-pointer hover:text-purple-700">Professional summary</li>
                    <li className="cursor-pointer hover:text-purple-700">Education</li>
                    <li className="cursor-pointer hover:text-purple-700">Work Experience</li>
                    <li className="cursor-pointer hover:text-purple-700">Job Preferences</li>
                    <li className="cursor-pointer hover:text-purple-700">Skills and competencies</li>
                    <li className="cursor-pointer hover:text-purple-700">Resume and cover letters</li>
                    <li className="cursor-pointer hover:text-purple-700">Work Sample</li>
                    <li className="cursor-pointer hover:text-purple-700">Social and professional link</li>
                    <li className="cursor-pointer hover:text-purple-700">Verification</li>

                </ul>
                <div className="mt-8 flex flex-col space-y-3">
                    <button
                        type="button"
                        className="bg-[#6438C2] text-white font-lato text-[20px] py-2 rounded-[16px] shadow hover:bg-purple-700"
                    >
                        Find Jobs
                    </button>
                </div>
            </div>

            <button
                type="button"
                className="w-[182px] bg-[#6438C2] text-white py-2 font-lato text-[20px] rounded-[16px] shadow-sm hover:bg-purple-700"
            >
                Find Jobs
            </button>
        </div>
    );
};

export default ApplicantProfileSidebar;
