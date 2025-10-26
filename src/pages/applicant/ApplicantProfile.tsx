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
import { useProfileCompletionDetails } from "../../hooks/useProfileCompletionDetails.ts";
import { ProfileCompletionResponse } from "../../utils/types";

const ApplicantProfile: FC = () => {
  const { applicant } = useAuth();
  const { setCvDetails, fetchCvDetails } = useApplicantJobProfile();
  const {data: completionDetails} = useProfileCompletionDetails();

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
        <div className="flex min-h-[calc(100vh-120px)] flex-col gap-6 lg:flex-row xl:gap-8">
          {/* Sidebar - Hidden on mobile, visible on large screens */}
          <div className="hidden flex-shrink-0 lg:block lg:w-80 xl:w-76">
            <div className="sticky top-6">
              <ApplicantProfileSidebar completionDetails={completionDetails || {} as ProfileCompletionResponse} />
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl flex-1">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* Progress Header */}
              <div className="border-b border-gray-100 bg-white px-6 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#6438C2]"></div>
                    <p className="text-lg font-semibold text-[#6438C2]">
                      Your Profile is {completionDetails?.percentage}% completed
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#6438C2] to-[#8B5CF6] transition-all duration-500" style={{width: completionDetails?.percentage}}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {completionDetails?.percentage}%
                    </span>
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
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                        <p className="text-xl font-semibold text-[#6438C2]">
                          Your profile is {completionDetails?.percentage}% Done
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          className="rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                        >
                          Save Draft
                        </button>
                        <button
                          type="button"
                          className="rounded-lg bg-[#6438C2] px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-[#5931A9]"
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
