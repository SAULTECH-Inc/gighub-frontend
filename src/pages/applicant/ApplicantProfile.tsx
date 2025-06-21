import { FC, memo, useEffect } from "react";
import SocialsSection from "../../components/ui/SocialsSection.tsx";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import PersonalInfo from "../../components/ui/applicant/profile/PersonalInfo.tsx";
import ProfessionalSummary from "../../components/ui/applicant/profile/ProfessionalSummary.tsx";
import Education from "../../components/ui/applicant/profile/Education.tsx";
import WorkExperience from "../../components/ui/applicant/profile/WorkExperience.tsx";
import JobPreferences from "../../components/ui/applicant/job/JobPreferences.tsx";
import SkillsAndCompetences from "../../components/ui/applicant/profile/SkillAndCompetences.tsx";
import WorkSample from "../../components/ui/applicant/profile/WorkSample.tsx";
import Verification from "../../components/ui/applicant/profile/Verification.tsx";
import ApplicantProfileCard from "../../components/ui/applicant/profile/ApplicantProfileCard.tsx";
import ApplicantProfileSidebar from "../../components/ui/applicant/profile/ApplicantProfileSidebar.tsx";
import { useAuth } from "../../store/useAuth.ts";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
} from "../../utils/constants.ts";
import { useApplicantJobProfile } from "../../store/useApplicantJobProfile.ts";
import ResumeAndCoverLetter from "../../components/ui/applicant/profile/ResumeAndCoverLetter.tsx";

const ApplicantProfile: FC = () => {
  const { applicant } = useAuth();
  const { setCvDetails, fetchCvDetails } = useApplicantJobProfile();
  useEffect(() => {
    const doFetchCvDetails = async () => {
      const response = await fetchCvDetails();
      if (response) {
        setCvDetails(response);
      }
    };
    doFetchCvDetails().then((r) => r);
  }, [applicant, fetchCvDetails, setCvDetails]);
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <TopNavBar
        navItems={applicantNavItems}
        navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap}
      />
      <div className="bg-gray-100 mx-auto flex min-h-screen justify-center gap-x-10 px-2 pt-6 lg:px-5">
        {/* Sidebar */}
        <ApplicantProfileSidebar />

        {/* Main Content */}
        <div className="mb-6 h-auto w-full rounded-[16px] border-[1px] border-[#E6E6E6] bg-white p-5 lg:w-[70%] lg:px-10 lg:py-8">
          <div className="flex items-center justify-between pb-4 font-lato text-sm text-[#6438C2] lg:text-[20px]">
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

            <div className="mt-4 flex items-center justify-between space-x-4 border-t-[2px] border-t-[#E6E6E6] pt-5">
              <p className="font-lato text-xl font-semibold text-[#6438C2]">
                Your profile is 80% Done
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(ApplicantProfile);
