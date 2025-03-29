import {FC, useEffect, useState} from "react";
import EmployerProfileSidebar from "../../components/ui/employer/profile/EmployerProfileSidebar.tsx";
import CompanyInfo from "../../components/ui/employer/profile/CompanyInfo.tsx";
import CompanyContactInfo from "../../components/ui/employer/profile/CompanyContactInfo.tsx";
import CompanyBrandingVisualIdentity from "../../components/ui/employer/profile/CompanyBrandingVisualIdentity.tsx";
import CompanyOverview from "../../components/ui/employer/profile/CompanyOverview.tsx";
import CompanySocials from "../../components/ui/employer/profile/CompanySocials.tsx";
import ComplianceAndVerification from "../../components/ui/employer/profile/ComplianceAndVerification.tsx";
import ProfileCard from "../../components/ui/employer/profile/ProfileCard.tsx";
import TopNavBar from "../../components/layouts/TopNavBar.tsx";
import {employerNavBarItemMap, employerNavItems, employerNavItemsMobile} from "../../utils/constants.ts";
import {useAuth} from "../../store/useAuth.ts";
import {useEmployerProfile} from "../../store/useEmployerProfile.ts";
import ActionPrompter from "../../components/common/ActionPrompter.tsx";
const EmployerProfile: FC = () => {
    const {employer} = useAuth();
    const {setEmployerProfile} = useEmployerProfile();
    const [isOpen, setIsOpen] = useState(true);

    const handleAnswer = (confirmed: boolean) => {
        if (confirmed) {
            console.log("User confirmed action");
            // Perform your action here
        } else {
            console.log("User cancelled action");
        }
        setIsOpen(false);
    };
    useEffect(() => {
        if (employer){
            setEmployerProfile(employer);
        }
    }, [employer]);
    //w-[35%] md:w-[40%] lg:w-[30%] xl:w-[20%]
    return (
        <div className="relative bg-[#F7F8FA] mx-auto w-screen">
            <TopNavBar navItems={employerNavItems} navItemsMobile={employerNavItemsMobile} navbarItemsMap={employerNavBarItemMap}/>
            <div className="w-full flex justify-center items-start bg-gray-100 min-h-screen pt-6 mx-auto gap-x-5 md:px-5 lg:px-10">
                {/* Sidebar */}
                <EmployerProfileSidebar/>

                {/* Main Content */}
                <div className="h-fit rounded-[16px] w-full md:w-[70%] lg:w-[67%] xl:w-[75%] bg-white border-[#E6E6E6] border-[1px] p-4 lg:p-8">
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
                    </form>
                </div>
            </div>
            <ActionPrompter onAnswer={handleAnswer} open={isOpen} message="Are you sure you want to delete"/>
        </div>
    );
};

export default EmployerProfile;
