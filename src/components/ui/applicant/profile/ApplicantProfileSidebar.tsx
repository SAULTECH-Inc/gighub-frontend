import { FC } from "react";
import { Link } from "react-scroll";

const ApplicantProfileSidebar: FC = () => {
  return (
    <div className="hidden h-[3920px] w-[20%] flex-col items-center justify-between rounded-[16px] bg-transparent xs:hidden lg:flex">
      <div className="flex h-[664px] w-full flex-col justify-between rounded-[16px] bg-white p-10">
        <ul className="text-gray-800 space-y-6 font-lato text-[16px]">
          <li className="cursor-pointer text-[#6438C2] hover:text-purple-700">
            <Link
              to="personal-info"
              smooth={true}
              duration={500}
              offset={-50} // Adjust offset if you have sticky headers
            >
              Personal Information
            </Link>
          </li>

          <li className="cursor-pointer hover:text-purple-700">
            <Link
              to="professional-summary"
              smooth={true}
              duration={500}
              offset={-50}
            >
              Professional Summary
            </Link>
          </li>

          <li className="cursor-pointer hover:text-purple-700">
            <Link to="education" smooth={true} duration={500} offset={-50}>
              Education
            </Link>
          </li>

          <li className="cursor-pointer hover:text-purple-700">
            <Link
              to="work-experience"
              smooth={true}
              duration={500}
              offset={-50}
            >
              Work Experience
            </Link>
          </li>

          <li className="cursor-pointer hover:text-purple-700">
            <Link
              to="job-preferences"
              smooth={true}
              duration={500}
              offset={-50}
            >
              Job Preferences
            </Link>
          </li>

          <li className="cursor-pointer hover:text-purple-700">
            <Link
              to="skills-competences"
              smooth={true}
              duration={500}
              offset={-50}
            >
              Skills and Competencies
            </Link>
          </li>

          <li className="cursor-pointer hover:text-purple-700">
            <Link
              to="resume-cover-letter"
              smooth={true}
              duration={500}
              offset={-50}
            >
              Resume and Cover Letters
            </Link>
          </li>

          <li className="cursor-pointer hover:text-purple-700">
            <Link to="work-sample" smooth={true} duration={500} offset={-50}>
              Work Sample
            </Link>
          </li>

          <li className="cursor-pointer hover:text-purple-700">
            <Link
              to="company-socials"
              smooth={true}
              duration={500}
              offset={-50}
            >
              Social and Professional Links
            </Link>
          </li>

          <li className="cursor-pointer hover:text-purple-700">
            <Link to="verification" smooth={true} duration={500} offset={-50}>
              Verification
            </Link>
          </li>
        </ul>

        <div className="mt-8 flex flex-col space-y-3">
          <Link
            to="/applicant/find-jobs"
            className="rounded-[16px] bg-[#6438C2] py-2 text-center font-lato text-[20px] text-white shadow hover:bg-purple-700"
          >
            Find Jobs
          </Link>
        </div>
      </div>

      <Link
        to="/applicant/find-jobs"
        className="w-[182px] rounded-[16px] bg-[#6438C2] py-2 text-center font-lato text-[20px] text-white shadow-sm hover:bg-purple-700"
      >
        Find Jobs
      </Link>
    </div>
  );
};

export default ApplicantProfileSidebar;
