import { FC } from "react";
import CompanyOverview from "../components/ui/employer/CompanyOverview.tsx";
import CompanySocials from "../components/ui/employer/CompanySocials.tsx";
import ApplicantNavBar from "../components/layouts/ApplicantNavBar.tsx";
import PersonalInfo from "../components/ui/applicant/PersonalInfo.tsx";
import ProfessionalSummary from "../components/ui/applicant/ProfessionalSummary.tsx";
import Education from "../components/ui/applicant/Education.tsx";
import WorkExperience from "../components/ui/applicant/WorkExperience.tsx";
import JobPreferences from "../components/ui/applicant/JobPreferences.tsx";
import SkillsAndCompetences from "../components/ui/applicant/SkillAndCompetences.tsx";
import ResumeAndCoverLetter from "../components/ui/applicant/ResumeAndCoverLetter.tsx";
import WorkSample from "../components/ui/applicant/WorkSample.tsx";
import Verification from "../components/ui/applicant/Verification.tsx";
import ApplicantProfileCard from "../components/ui/applicant/ApplicantProfileCard.tsx";
import ApplicantProfileSidebar from "../components/ui/applicant/ApplicantProfileSidebar.tsx";

const ApplicantProfile: FC = () => {
    return (
        <div className="bg-[#F7F8FA] min-h-screen">
            <ApplicantNavBar />
            <div className="flex justify-center bg-gray-100 pt-6 gap-x-2 mx-auto">
                {/* Sidebar */}
                <ApplicantProfileSidebar/>

                {/* Main Content */}
                <div className="w-full max-w-[1067px] bg-white border-[#E6E6E6] border-[1px] h-auto rounded-[16px] p-8 mx-4">
                    <div className="flex justify-between items-center text-[#6438C2] font-lato text-[20px] pb-4">
                        <p>Your Profile is 80% completed</p>
                    </div>
                    <ApplicantProfileCard />

                    {/* Form */}
                    <form className="space-y-8">
                        <PersonalInfo />
                        <ProfessionalSummary />
                        <CompanyOverview />
                        <Education />
                        <WorkExperience />
                        <JobPreferences />
                        <SkillsAndCompetences />
                        <ResumeAndCoverLetter />
                        <WorkSample />
                        <CompanySocials />
                        <Verification />

                        <div className="flex justify-between items-center space-x-4 mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
                            <p className="text-[#6438C2] font-lato font-semibold">Your profile is 80% Done</p>
                            <button
                                type="submit"
                                className="bg-[#6438C2] w-[150px] block text-white px-4 py-2 rounded-[16px] font-lato text-[20px] text-sm hover:bg-purple-700"
                            >
                                Update Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplicantProfile;
