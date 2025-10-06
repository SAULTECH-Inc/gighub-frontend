import { FC, useEffect, useState } from "react";
import EmployerProfileSidebar from "../../components/ui/employer/profile/EmployerProfileSidebar.tsx";
import CompanyInfo from "../../components/ui/employer/profile/CompanyInfo.tsx";
import CompanyContactInfo from "../../components/ui/employer/profile/CompanyContactInfo.tsx";
import CompanyBrandingVisualIdentity from "../../components/ui/employer/profile/CompanyBrandingVisualIdentity.tsx";
import CompanyOverview from "../../components/ui/employer/profile/CompanyOverview.tsx";
import SocialsSection from "../../components/ui/SocialsSection.tsx";
import ComplianceAndVerification from "../../components/ui/employer/profile/ComplianceAndVerification.tsx";
import ProfileCard from "../../components/ui/employer/profile/ProfileCard.tsx";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../../utils/constants.ts";
import { useAuth } from "../../store/useAuth.ts";
import { useEmployerProfile } from "../../store/useEmployerProfile.ts";
import { useProfileCompletionDetails } from "../../hooks/useProfileCompletionDetails.ts";
import { ProfileCompletionResponse } from "../../utils/types";

const EmployerProfile: FC = () => {
  const { employer } = useAuth();
  const {
    setEmployerProfile,
    setCompanyInfo,
    setContactInfo,
    setSocials,
    setComplianceAndVerification,
    setBrandAndVisuals,
    setAboutCompany,
  } = useEmployerProfile();

  const [, setProfileCompletion] = useState(0);
  const {data: completionDetails} = useProfileCompletionDetails();

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!employer) return 0;

    const fields = [
      employer.companyName,
      employer.industry,
      employer.companySize,
      employer.country,
      employer.city,
      employer.companyAddress,
      employer.managerEmail,
      employer.managerPhoneNumber,
      employer.companyPhone,
      employer.email,
      employer.companyDescription,
      employer.registrationNumber,
      employer.taxIdentificationNumber,
      employer.linkedInProfile,
      employer.brandAndVisuals && employer.brandAndVisuals?.length > 0
        ? "logo"
        : null,
    ];

    const completedFields = fields.filter(
      (field) => field && field.toString().trim() !== "",
    ).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  useEffect(() => {
    if (employer) {
      setEmployerProfile(employer);

      // Set individual store states
      setCompanyInfo({
        companyName: employer?.companyName,
        industry: employer?.industry || "",
        companySize: employer?.companySize || "",
        country: employer?.country || "",
        city: employer.city || "",
        companyAddress: employer.companyAddress || "",
      });

      setContactInfo({
        managerEmail: employer.managerEmail || "",
        managerPhoneNumber: employer.managerPhoneNumber || "",
        companyPhone: employer.companyPhone || "",
        email: employer.email || "",
      });

      setSocials({
        linkedInProfile: employer.linkedInProfile || "",
        twitterProfile: employer.twitterProfile || "",
        facebookProfile: employer.facebookProfile || "",
        instagramProfile: employer.instagramProfile || "",
        githubProfile: employer.githubProfile || "",
      });

      setBrandAndVisuals({
        files: employer.brandAndVisuals || [],
      });

      setAboutCompany({
        companyDescription: employer.companyDescription || "",
      });

      setComplianceAndVerification({
        registrationNumber: employer.registrationNumber || "",
        taxIdentificationNumber: employer.taxIdentificationNumber || "",
      });

      // Calculate and set profile completion
      const completion = calculateProfileCompletion();
      setProfileCompletion(completion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer]);

  // Get completion status color and icon
  return (
    <div className="relative mx-auto w-screen bg-gray-50">
      <TopNavBar
        navItems={employerNavItems}
        navItemsMobile={employerNavItemsMobile}
        navbarItemsMap={employerNavBarItemMap}
      />

      <div className="mx-auto flex min-h-screen w-full items-start justify-center gap-x-6 bg-gray-50 pt-6 md:px-5 lg:px-10">
        {/* Sidebar */}
        <EmployerProfileSidebar completionDetails={completionDetails || {} as ProfileCompletionResponse} />

        {/* Main Content */}
        <div className="h-fit w-full rounded-xl border border-gray-200 bg-white p-4 md:w-[70%] lg:w-[67%] lg:p-8 xl:w-[75%]">
          {/* Simple Header - Keep Original Style */}
          <div className="flex items-center justify-between pb-4 text-sm text-purple-600 lg:text-xl">
            <p>Your Profile is {completionDetails?.percentage || 0}% completed</p>
            <p>Company Account</p>
          </div>

          <ProfileCard />

          {/* Form */}
          <form className="space-y-8">
            <CompanyInfo />

            {/* Contact Information */}
            <CompanyContactInfo />

            {/* Branding and Visual Identity */}
            <CompanyBrandingVisualIdentity />

            {/* Company Overview */}
            <CompanyOverview />

            {/* Social and Professional Links */}
            <SocialsSection />

            {/* Compliance and Verifications */}
            <ComplianceAndVerification />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
