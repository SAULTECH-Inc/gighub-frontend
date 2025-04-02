import {FC, useEffect, useState} from "react";
import NotificationSettingsHeader from "./settings/notification/applicant/NotificationSettingsHeader.tsx";
import JobRecommendation from "./settings/notification/applicant/JobRecommendation.tsx";
import InterviewInvitation from "./settings/notification/applicant/InterviewInvitation.tsx";
import AutoApply from "./settings/notification/applicant/AutoApply.tsx";
import SavedJob from "./settings/notification/applicant/SavedJob.tsx";
import EmployerAction from "./settings/notification/applicant/EmployerAction.tsx";
import PlatformNotification from "./settings/notification/applicant/PlatformNotification.tsx";
import GeneralSettings from "./settings/notification/applicant/GeneralSettings.tsx";
import CommunicationPreferences from "./settings/notification/applicant/CommunicationPreferences.tsx";
import JobApplicationUpdate from "./settings/notification/applicant/JobApplicationUpdate.tsx";
import NotificationSidebar from "./settings/notification/applicant/NotificationSidebar.tsx";
import {useNavMenuStore} from "../store/useNavMenuStore.ts";
import MonthlyPlan from "./settings/subscription/MonthlyPlan.tsx";
import InvoiceList from "./settings/subscription/InvoiceList.tsx";
import Privacy from "./settings/privacy/Privacy.tsx";
import Account from "./settings/account/Account.tsx";
import {useAuth} from "../store/useAuth.ts";
import {UserType} from "../utils/enums.ts";
import {ApplicantSettings, EmployerSettings, useSettingsStore} from "../store/useSettingsStore.ts";
import TopNavBar from "../components/layouts/TopNavBar.tsx";
import {
    applicantNavBarItemMap,
    applicantNavItems,
    applicantNavItemsMobile, employerNavBarItemMap,
    employerNavItems,
    employerNavItemsMobile
} from "../utils/constants.ts";
import {useUserSubscription} from "../store/useUserSubscription.ts";
import ManageJobNotification from "./settings/notification/employer/ManageJobNotification.tsx";
import JobPostingStatus from "./settings/notification/employer/JobPostingStatus.tsx";
import PaymentAndSubscription from "./settings/notification/employer/PaymentAndSubscription.tsx";
import {IoArrowBackOutline} from "react-icons/io5";
import NotificationSidebarAsMenu from "../components/ui/NotificationSidebarAsMenu.tsx";
const UserSettings: FC = () => {
    const {settings} = useNavMenuStore();
    const {applicant, employer, userType} = useAuth();
    const {setApplicantSettings, setEmployerSettings, fetchSettings} = useSettingsStore();
    const [showMenu, setShowMenu] = useState(false);
    const {fetchSubscription, setSubscription,  fetchSubscriptionHistory, setSubscriptionHistory} = useUserSubscription();

    useEffect(() => {
        if (!userType) return;

        console.log("✅ useEffect triggered for subscription");

        if(userType === UserType.APPLICANT && applicant?.id){
            const doFetch = async () => {
                const res1 = await fetchSubscription(applicant.id);
                const res2 = await fetchSubscriptionHistory(applicant.id);
                if(res1 && res2){
                    setSubscription(res1);
                    setSubscriptionHistory(res2);
                }
            };
            doFetch();
        } else if (userType === UserType.EMPLOYER && employer?.id){
            const doFetch = async () => {
                const res1 = await fetchSubscription(employer.id as number);
                const res2 = await fetchSubscriptionHistory(employer.id as number);
                if(res1 && res2){
                    setSubscription(res1);
                    setSubscriptionHistory(res2);
                }
            };
            doFetch();
        }
    }, [userType, applicant?.id, employer?.id]);


    useEffect(() => {
        const fetchUserSettings = async()=> {
            console.log("hello world");
            const response = await fetchSettings(userType as UserType);
            if(userType === UserType.EMPLOYER){

                setEmployerSettings(response as EmployerSettings);
            } else {
                const appSettings = response as ApplicantSettings;
                setApplicantSettings(appSettings);
            }
        }
        fetchUserSettings()
        .then(()=>console.log("FETCH SETTINGS"));
    }, [userType]);
    const toggle = () => setShowMenu(!showMenu);
    return (
        <div className="w-full mx-auto bg-[#F7F8FA] h-auto">
            {
                userType === UserType.EMPLOYER ? (
                    <TopNavBar navItems={employerNavItems} navItemsMobile={employerNavItemsMobile} navbarItemsMap={employerNavBarItemMap}/>
                ):
                    (
                        <TopNavBar navItems={applicantNavItems} navItemsMobile={applicantNavItemsMobile} navbarItemsMap={applicantNavBarItemMap}/>
                    )

            }
            <div className="w-full grid grid-cols-1 lg:grid-cols-[20%_70%] justify-center gap-x-[5%] mt-10 px-2 md:px-10">
                {/* Sidebar */}
                <NotificationSidebar/>


                {/* Main Content */}
                <div className="w-full flex flex-col">
                    <div className="md:hidden flex gap-x-4 text-[#6438C2] mb-4 px-4">
                        <div onClick={()=>{
                            setShowMenu(!showMenu);
                        }} className="flex gap-x-2 items-center cursor-pointer">
                            <IoArrowBackOutline/>
                            <p className="text-sm">Back</p>
                        </div>
                        <h1 className="text-lg font-bold">
                            {settings.notification && "Notification"}
                            {settings.subscription && "Subscription"}
                            {settings.account && "Account"}
                            {settings.privacy && "Privacy"}
                        </h1>
                    </div>
                    <NotificationSettingsHeader/>
                    <NotificationSidebarAsMenu toggle={toggle} open={showMenu}/>

                    {/*Notification */}
                    {settings.notification && userType === UserType.APPLICANT && (
                        <div className="w-full flex flex-col items-center overflow-y-auto max-h-screen">
                            <JobApplicationUpdate/>
                            <JobRecommendation/>
                            <InterviewInvitation/>
                            <AutoApply/>
                            <SavedJob/>
                            <EmployerAction/>
                            <PlatformNotification/>
                            <GeneralSettings/>
                            <CommunicationPreferences/>
                        </div>)}

                    {settings.notification && userType === UserType.EMPLOYER && (
                        <div className="w-full flex flex-col items-center overflow-y-auto max-h-screen">
                            <ManageJobNotification/>
                            <JobPostingStatus/>
                            <InterviewInvitation/>
                            <PaymentAndSubscription/>
                        </div>)}
                    {/*Subscription */}
                    {settings.subscription && (
                        <div className="w-full flex flex-col items-center md:overflow-y-auto max-h-screen">
                           <MonthlyPlan/>
                            <InvoiceList/>
                        </div>)}

                    {
                        settings.privacy && (
                            <div className="w-full flex flex-col items-center overflow-y-auto max-h-screen">
                                <Privacy/>
                            </div>)
                    }

                    {
                        settings.account && (
                            <div className="w-full flex flex-col items-center overflow-y-auto max-h-screen">
                                <Account/>
                            </div>)
                    }
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
