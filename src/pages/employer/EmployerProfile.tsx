import { FC, useEffect } from "react";
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
  useEffect(() => {
    if (employer) {
      setEmployerProfile(employer);
      console.log("Employer Profile: ", employer);
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer]);
  //w-[35%] md:w-[40%] lg:w-[30%] xl:w-[20%]
  return (
    <div className="relative mx-auto w-screen bg-[#F7F8FA]">
      <TopNavBar
        navItems={employerNavItems}
        navItemsMobile={employerNavItemsMobile}
        navbarItemsMap={employerNavBarItemMap}
      />
      <div className="mx-auto flex min-h-screen w-full items-start justify-center gap-x-5 bg-gray-100 pt-6 md:px-5 lg:px-10">
        {/* Sidebar */}
        <EmployerProfileSidebar />

        {/* Main Content */}
        <div className="h-fit w-full rounded-[16px] border-[1px] border-[#E6E6E6] bg-white p-4 md:w-[70%] lg:w-[67%] lg:p-8 xl:w-[75%]">
          <div className="font-lato flex items-center justify-between pb-4 text-sm text-[#6438C2] lg:text-[20px]">
            <p>Your Profile is 80% completed</p>
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
