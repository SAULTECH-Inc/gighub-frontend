import {FC} from "react";
import EmployerProfileSidebar from "../../components/ui/employer/profile/EmployerProfileSidebar.tsx";
import CompanyInfo from "../../components/ui/employer/profile/CompanyInfo.tsx";
import CompanyContactInfo from "../../components/ui/employer/profile/CompanyContactInfo.tsx";
import CompanyBrandingVisualIdentity from "../../components/ui/employer/profile/CompanyBrandingVisualIdentity.tsx";
import CompanyOverview from "../../components/ui/employer/profile/CompanyOverview.tsx";
import CompanySocials from "../../components/ui/employer/profile/CompanySocials.tsx";
import ComplianceAndVerification from "../../components/ui/employer/profile/ComplianceAndVerification.tsx";
import ProfileCard from "../../components/ui/employer/profile/ProfileCard.tsx";
import ApplicantNavBar from "../../components/layouts/ApplicantNavBar.tsx";
import {employerNavBarItemMap, employerNavItems, employerNavItemsMobile} from "../../utils/constants.ts";
const EmployerProfile: FC = () => {
    return (
        <div className="bg-[#F7F8FA] mx-auto">
            <ApplicantNavBar navItems={employerNavItems} navItemsMobile={employerNavItemsMobile} navbarItemsMap={employerNavBarItemMap}/>
            <div className="flex justify-center bg-gray-100 min-h-screen pt-6 mx-auto gap-x-10 px-2 lg:px-5">
                {/* Sidebar */}
                <EmployerProfileSidebar/>

                {/* Main Content */}
                <div className="h-[2600px] rounded-[16px] w-full lg:w-[70%] bg-white border-[#E6E6E6] border-[1px] p-4 lg:p-8">
                    <div className="flex justify-between items-center text-[#6438C2] font-lato text-sm lg:text-[20px] pb-4">
                        <p>Your Profile is 80% completed</p>
                        <p>Company Account</p>
                    </div>
                    <ProfileCard/>

                    {/* Form */}
                    <form className="space-y-8">
                        <CompanyInfo/>

                        {/* Contact Information */}
                        <CompanyContactInfo/>

                        {/* Branding and Visual Identity */}
                        <CompanyBrandingVisualIdentity/>



                        {/* Company Overview */}
                        <CompanyOverview/>

                        {/* Social and Professional Links */}
                        <CompanySocials/>

                        {/* Compliance and Verifications */}
                        <ComplianceAndVerification/>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="submit"
                                className="bg-[#6438C2] w-full lg:w-[30%] block text-white px-4 py-4 rounded-[16px] font-lato text-[20px] text-sm hover:bg-purple-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;
