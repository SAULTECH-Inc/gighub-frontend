import { FC } from "react";
import { Link } from "react-scroll";

const ApplicantProfileSidebar: FC = () => {
    return (
        <div className="w-[20%] h-[3920px] lg:flex flex-col justify-between items-center bg-transparent rounded-[16px] xs:hidden hidden">
            <div className="w-full flex flex-col justify-between bg-white h-[664px] p-10 rounded-[16px]">
                <ul className="space-y-6 text-gray-800 text-[16px] font-lato">
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
                        <Link to="professional-summary" smooth={true} duration={500} offset={-50}>
                            Professional Summary
                        </Link>
                    </li>

                    <li className="cursor-pointer hover:text-purple-700">
                        <Link to="education" smooth={true} duration={500} offset={-50}>
                            Education
                        </Link>
                    </li>

                    <li className="cursor-pointer hover:text-purple-700">
                        <Link to="work-experience" smooth={true} duration={500} offset={-50}>
                            Work Experience
                        </Link>
                    </li>

                    <li className="cursor-pointer hover:text-purple-700">
                        <Link to="job-preferences" smooth={true} duration={500} offset={-50}>
                            Job Preferences
                        </Link>
                    </li>

                    <li className="cursor-pointer hover:text-purple-700">
                        <Link to="skills-competences" smooth={true} duration={500} offset={-50}>
                            Skills and Competencies
                        </Link>
                    </li>

                    <li className="cursor-pointer hover:text-purple-700">
                        <Link to="resume-cover-letter" smooth={true} duration={500} offset={-50}>
                            Resume and Cover Letters
                        </Link>
                    </li>

                    <li className="cursor-pointer hover:text-purple-700">
                        <Link to="work-sample" smooth={true} duration={500} offset={-50}>
                            Work Sample
                        </Link>
                    </li>

                    <li className="cursor-pointer hover:text-purple-700">
                        <Link to="company-socials" smooth={true} duration={500} offset={-50}>
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
