import {FC} from "react";


const EmployerProfileSidebar: FC = () => {
    return (
        <div className="w-full h-full flex flex-col justify-between items-center gap-y-80 bg-transparent">
            <div className="bg-white flex flex-col h-[664px] border border-[#E6E6E6] rounded-[16px] p-6 -mx-80">
                <ul className="space-y-6 text-gray-800 text-[16px] font-lato">
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
                        className="bg-[#6438C2] text-white py-2 font-lato text-[20px] rounded-[16px] shadow-sm hover:bg-purple-700"
                    >
                        Go to dashboard
                    </button>
                    <button
                        type="button"
                        className="bg-[#6438C2] text-white font-lato text-[20px] py-2 rounded-[16px] shadow-sm hover:bg-purple-700"
                    >
                        View Public Profile
                    </button>
                </div>
            </div>

            <button
                type="button"
                className="w-[182px] bg-[#6438C2] text-white py-2 font-lato text-[20px] rounded-[16px] shadow-sm hover:bg-purple-700"
            >
                Go to dashboard
            </button>
        </div>
    );
};

export default EmployerProfileSidebar;
