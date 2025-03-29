import {FC} from "react";
import {Link} from "react-router-dom";

// #E6E6E6
const EmployerProfileSidebar: FC = () => {
    return (
        <div className="relative w-[35%] md:w-[29%] lg:w-[25%] xl:w-[22%] h-[2385px] min-h-screen md:grid grid-cols-1 justify-between bg-transparent  rounded-[16px] hidden">
            <div className="w-full flex flex-col justify-between bg-white h-fit px-5 py-8 rounded-[16px] gap-y-36">
                <ul className="w-full space-y-6 text-gray-800 text-[16px] font-lato">
                    <li className="cursor-pointer text-[#6438C2] hover:text-purple-700">Basic Company Information</li>
                    <li className="cursor-pointer hover:text-purple-700">Contact Information</li>
                    <li className="cursor-pointer hover:text-purple-700">Branding and visual</li>
                    <li className="cursor-pointer hover:text-purple-700">Company Overview</li>
                    <li className="cursor-pointer hover:text-purple-700">Social and professional link</li>
                    <li className="cursor-pointer hover:text-purple-700">Compliance and verifications</li>
                </ul>
                <div className="mt-8 flex flex-col space-y-3">
                    <Link
                        to="/employer/dashboard"
                        className="bg-[#6438C2] text-white text-center py-5 font-lato text-[1rem]  rounded-[16px] hover:bg-purple-700"
                    >
                        Go to dashboard
                    </Link>
                    <Link
                        to="/employer/profile"
                        className="bg-[#6438C2] text-white text-center py-5 font-lato text-[1rem] rounded-[16px] hover:bg-purple-700"
                    >
                        View Public Profile
                    </Link>
                </div>
            </div>

            <Link to="/employer/dashboard"
                className="absolute bottom-0 block w-full h-fit bg-[#6438C2] text-white text-center py-5 px-10 font-lato text-[1rem]  rounded-[16px] hover:bg-purple-700"
            >
                Go to dashboard
            </Link>
        </div>
    );
};

export default EmployerProfileSidebar;
