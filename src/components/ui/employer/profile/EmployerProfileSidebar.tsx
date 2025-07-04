import { FC } from "react";
import { Link } from "react-router-dom";

// #E6E6E6
const EmployerProfileSidebar: FC = () => {
  return (
    <div className="relative hidden h-[2385px] min-h-screen w-[35%] grid-cols-1 justify-between rounded-[16px] bg-transparent md:grid md:w-[29%] lg:w-[25%] xl:w-[22%]">
      <div className="flex h-fit w-full flex-col justify-between gap-y-36 rounded-[16px] bg-white px-5 py-8">
        <ul className="font-lato w-full space-y-6 text-[16px] text-gray-800">
          <li className="cursor-pointer text-[#6438C2] hover:text-purple-700">
            Basic Company Information
          </li>
          <li className="cursor-pointer hover:text-purple-700">
            Contact Information
          </li>
          <li className="cursor-pointer hover:text-purple-700">
            Branding and visual
          </li>
          <li className="cursor-pointer hover:text-purple-700">
            Company Overview
          </li>
          <li className="cursor-pointer hover:text-purple-700">
            Social and professional link
          </li>
          <li className="cursor-pointer hover:text-purple-700">
            Compliance and verifications
          </li>
        </ul>
        <div className="mt-8 flex flex-col space-y-3">
          <Link
            to="/employer/dashboard"
            className="font-lato rounded-[16px] bg-[#6438C2] py-5 text-center text-[1rem] text-white hover:bg-purple-700"
          >
            Go to dashboard
          </Link>
          <Link
            to="/employer/profile"
            className="font-lato rounded-[16px] bg-[#6438C2] py-5 text-center text-[1rem] text-white hover:bg-purple-700"
          >
            View Public Profile
          </Link>
        </div>
      </div>

      <Link
        to="/employer/dashboard"
        className="font-lato absolute bottom-0 block h-fit w-full rounded-[16px] bg-[#6438C2] px-10 py-5 text-center text-[1rem] text-white hover:bg-purple-700"
      >
        Go to dashboard
      </Link>
    </div>
  );
};

export default EmployerProfileSidebar;
