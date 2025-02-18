import { FC } from "react";
import CompanyOverview from "../../components/ui/employer/profile/CompanyOverview.tsx";
import CompanySocials from "../../components/ui/employer/profile/CompanySocials.tsx";
import ApplicantNavBar from "../../components/layouts/ApplicantNavBar.tsx";
import PersonalInfo from "../../components/ui/applicant/profile/PersonalInfo.tsx";
import ProfessionalSummary from "../../components/ui/applicant/profile/ProfessionalSummary.tsx";
import Education from "../../components/ui/applicant/profile/Education.tsx";
import WorkExperience from "../../components/ui/applicant/profile/WorkExperience.tsx";
import JobPreferences from "../../components/ui/applicant/profile/JobPreferences.tsx";
import SkillsAndCompetences from "../../components/ui/applicant/profile/SkillAndCompetences.tsx";
import ResumeAndCoverLetter from "../../components/ui/applicant/profile/ResumeAndCoverLetter.tsx";
import WorkSample from "../../components/ui/applicant/profile/WorkSample.tsx";
import Verification from "../../components/ui/applicant/profile/Verification.tsx";
import ApplicantProfileCard from "../../components/ui/applicant/profile/ApplicantProfileCard.tsx";
import ApplicantProfileSidebar from "../../components/ui/applicant/profile/ApplicantProfileSidebar.tsx";
import {useAuth} from "../../store/useAuth.ts";
import {useJobPreferenceStore} from "../../store/useJobPreferenceStore.ts";

const ApplicantProfile: FC = () => {
    const {applicant,updateProfile} = useAuth();
    const {preferences, addPreference} = useJobPreferenceStore();
    const handleSaveChanges = async () => {
        if(preferences){
            await addPreference(preferences);
        }
        if(applicant){
            updateProfile(applicant);
        }
    }
    return (
        <div className="bg-[#F7F8FA] min-h-screen">
            <ApplicantNavBar />
            <div className="flex justify-center bg-gray-100 min-h-screen pt-6 mx-auto gap-x-10 px-2 lg:px-5">
                {/* Sidebar */}
                <ApplicantProfileSidebar/>

                {/* Main Content */}
                <div className="h-auto rounded-[16px] w-full lg:w-[70%] bg-white border-[#E6E6E6] border-[1px] p-5 lg:py-8 lg:px-10 mb-6">
                    <div className="flex justify-between items-center text-[#6438C2] font-lato text-sm lg:text-[20px] pb-4">
                        <p>Your Profile is 80% completed</p>
                    </div>
                    <ApplicantProfileCard />

                    {/* Form */}
                    <form className="w-full space-y-9">
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
                            <p className="text-[#6438C2] text-xl font-lato font-semibold">Your profile is 80% Done</p>
                            <button
                                type="button"
                                onClick={handleSaveChanges}
                                className="bg-[#6438C2] block text-white px-6 py-3 rounded-[10px] font-lato text-[20px] text-xl hover:bg-purple-700"
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
