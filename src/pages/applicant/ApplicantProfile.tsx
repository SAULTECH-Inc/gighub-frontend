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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TopNavBar
        navItems={applicantNavItems}
        navItemsMobile={applicantNavItemsMobile}
        navbarItemsMap={applicantNavBarItemMap}
      />

      {/* Main Container */}
      <div className="container mx-auto px-4 py-6 lg:px-6 xl:px-8">
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 min-h-[calc(100vh-120px)]">

          {/* Sidebar - Hidden on mobile, visible on large screens */}
          <div className="hidden lg:block lg:w-80 xl:w-76 flex-shrink-0">
            <div className="sticky top-6">
              <ApplicantProfileSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

              {/* Progress Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#6438C2] rounded-full"></div>
                    <p className="text-lg font-semibold text-[#6438C2]">
                      Your Profile is 80% completed
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-gradient-to-r from-[#6438C2] to-[#8B5CF6] rounded-full transition-all duration-500"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">80%</span>
                  </div>
                </div>
              </div>

              {/* Profile Card */}
              <ApplicantProfileCard />

              {/* Form Content */}
              <div className="px-6 py-8 lg:px-8 lg:py-10">
                <form className="space-y-12">
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

                  {/* Bottom Summary */}
                  <div className="border-t-2 border-gray-100 pt-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-xl font-semibold text-[#6438C2]">
                          Your profile is 80% Done
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          Save Draft
                        </button>
                        <button
                          type="button"
                          className="px-6 py-3 bg-[#6438C2] text-white rounded-lg hover:bg-[#5931A9] transition-colors font-medium shadow-sm"
                        >
                          Complete Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ApplicantProfile);