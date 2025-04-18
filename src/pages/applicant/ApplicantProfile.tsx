import {FC, useEffect} from "react";
import SocialsSection from "../../components/ui/SocialsSection.tsx";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import PersonalInfo from "../../components/ui/applicant/profile/PersonalInfo.tsx";
import ProfessionalSummary from "../../components/ui/applicant/profile/ProfessionalSummary.tsx";
import Education from "../../components/ui/applicant/profile/Education.tsx";
import WorkExperience from "../../components/ui/applicant/profile/WorkExperience.tsx";
import JobPreferences from "../../components/ui/applicant/profile/JobPreferences.tsx";
import SkillsAndCompetences from "../../components/ui/applicant/profile/SkillAndCompetences.tsx";
import WorkSample from "../../components/ui/applicant/profile/WorkSample.tsx";
import Verification from "../../components/ui/applicant/profile/Verification.tsx";
import ApplicantProfileCard from "../../components/ui/applicant/profile/ApplicantProfileCard.tsx";
import ApplicantProfileSidebar from "../../components/ui/applicant/profile/ApplicantProfileSidebar.tsx";
import {useAuth} from "../../store/useAuth.ts";
import {applicantNavBarItemMap, applicantNavItems, applicantNavItemsMobile} from "../../utils/constants.ts";
import {useApplicantJobProfile} from "../../store/useApplicantJobProfile.ts";
import ResumeAndCoverLetter from "../../components/ui/applicant/profile/ResumeAndCoverLetter.tsx";

const ApplicantProfile: FC = () => {
    const {applicant} = useAuth();
    const {setCvDetails, fetchCvDetails} = useApplicantJobProfile();
    useEffect(() => {
        const doFetchCvDetails = async()=>{
            const response = await fetchCvDetails();
            if(response){
                setCvDetails(response);
            }
        }
        doFetchCvDetails();
    }, [applicant, fetchCvDetails, setCvDetails]);
    return (
        <div className="bg-[#F7F8FA] min-h-screen">
            <TopNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile} navbarItemsMap={applicantNavBarItemMap}/>
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
                        <Education />
                        <WorkExperience />
                        <JobPreferences />
                        <SkillsAndCompetences />
                        <ResumeAndCoverLetter />
                        <WorkSample />
                        <SocialsSection />
                        <Verification />

                        <div className="flex justify-between items-center space-x-4 mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
                            <p className="text-[#6438C2] text-xl font-lato font-semibold">Your profile is 80% Done</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplicantProfile;
