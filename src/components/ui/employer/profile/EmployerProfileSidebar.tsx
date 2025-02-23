import {FC} from "react";

// #E6E6E6
const EmployerProfileSidebar: FC = () => {
    return (
        <div className="w-[20%] h-[2520px] lg:flex flex-col justify-between items-center bg-transparent  rounded-[16px] xs:hidden hidden">
            <div className="w-full flex flex-col justify-between bg-white h-[664px] p-10 rounded-[16px]">
                <ul className="w-full space-y-6 text-gray-800 text-[16px] font-lato">
                    <li className="cursor-pointer text-[#6438C2] hover:text-purple-700">Basic Company Information</li>
                    <li className="cursor-pointer hover:text-purple-700">Contact Information</li>
                    <li className="cursor-pointer hover:text-purple-700">Branding and visual</li>
                    <li className="cursor-pointer hover:text-purple-700">Company Overview</li>
                    <li className="cursor-pointer hover:text-purple-700">Social and professional link</li>
                    <li className="cursor-pointer hover:text-purple-700">Compliance and verifications</li>
                </ul>
                <div className="mt-8 flex flex-col space-y-3">
                    <button
                        type="button"
                        className="bg-[#6438C2] text-white py-2 font-lato text-[20px] rounded-[16px] shadow hover:bg-purple-700"
                    >
                        Go to dashboard
                    </button>
                    <button
                        type="button"
                        className="bg-[#6438C2] text-white font-lato text-[20px] py-2 rounded-[16px] shadow hover:bg-purple-700"
                    >
                        View Public Profile
                    </button>
                </div>
            </div>

            <button
                type="button"
                className="w-full bg-[#6438C2] text-white font-lato text-[20px] py-2 rounded-[16px] shadow hover:bg-purple-700"
            >
                Go to dashboard
            </button>
        </div>
    );
};

export default EmployerProfileSidebar;
