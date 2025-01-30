import {FC} from "react";
import EmployerProfileSidebar from "../components/ui/EmployerProfileSidebar.tsx";
import CompanyInfo from "../components/ui/employer/CompanyInfo.tsx";
import CompanyContactInfo from "../components/ui/employer/CompanyContactInfo.tsx";
import CompanyBrandingVisualIdentity from "../components/ui/employer/CompanyBrandingVisualIdentity.tsx";
import CompanyOverview from "../components/ui/employer/CompanyOverview.tsx";
import CompanySocials from "../components/ui/employer/CompanySocials.tsx";
import ComplianceAndVerification from "../components/ui/employer/ComplianceAndVerification.tsx";
import ProfileCard from "../components/ui/employer/ProfileCard.tsx";
import ApplicantNavBar from "../components/layouts/ApplicantNavBar.tsx";
const EmployerProfile: FC = () => {
    return (
        <div className="bg-[#CCC]">
            <ApplicantNavBar/>
            <div className="flex justify-evenly bg-gray-100 min-h-screen pt-6 gap-x-2 mx-auto ">
                {/* Sidebar */}
                <EmployerProfileSidebar/>

                {/* Main Content */}
                <div className=" h-[2520px] rounded-[16px]
                w-full max-w-[1067px] bg-white border-[#E6E6E6] border-[1px]   p-8 mx-4">
                    <div className="flex justify-between items-center text-[#6438C2] font-lato text-[20px] pb-4">
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
                                className="bg-[#6438C2] w-[150px] block text-white px-4 py-2 rounded-[16px] font-lato text-[20px] text-sm hover:bg-purple-700"
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
