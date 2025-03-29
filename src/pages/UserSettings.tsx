import {FC, useEffect} from "react";
import NotificationSettingsHeader from "./settings/notification/NotificationSettingsHeader.tsx";
import JobRecommendation from "./settings/notification/JobRecommendation.tsx";
import InterviewInvitation from "./settings/notification/InterviewInvitation.tsx";
import AutoApply from "./settings/notification/AutoApply.tsx";
import SavedJob from "./settings/notification/SavedJob.tsx";
import EmployerAction from "./settings/notification/EmployerAction.tsx";
import PlatformNotification from "./settings/notification/PlatformNotification.tsx";
import GeneralSettings from "./settings/notification/GeneralSettings.tsx";
import CommunicationPreferences from "./settings/notification/CommunicationPreferences.tsx";
import JobApplicationUpdate from "./settings/notification/JobApplicationUpdate.tsx";
import NotificationSidebar from "./settings/notification/NotificationSidebar.tsx";
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
const UserSettings: FC = () => {
    const {settings} = useNavMenuStore();
    const {applicant, employer, userType} = useAuth();
    const {setApplicantSettings, setEmployerSettings, fetchSettings} = useSettingsStore();
    const {fetchSubscription, setSubscription,  fetchSubscriptionHistory, setSubscriptionHistory} = useUserSubscription();
    useEffect(() => {
        if(userType === UserType.APPLICANT){
            const doFetchSubscription = async ()=>{
                const responseOne = await fetchSubscription(applicant?.id);
                const responseTwo = await fetchSubscriptionHistory(applicant?.id);
                if(responseOne && responseTwo){
                    setSubscription(responseOne);
                    setSubscriptionHistory(responseTwo);
                }
            };
            doFetchSubscription();
        }else{
            const doFetchSubscription = async ()=>{
                const responseOne = await fetchSubscription(employer?.id as number);
                const responseTwo = await fetchSubscriptionHistory(employer?.id as number);
                if(responseOne && responseTwo){
                    setSubscription(responseOne);
                    setSubscriptionHistory(responseTwo);
                }
            };
            doFetchSubscription();
        }
    }, [applicant, employer, userType]);
    useEffect(() => {
        const fetchUserSettings = async()=> {
            const response = await fetchSettings(userType as UserType);
            if(userType === UserType.EMPLOYER){
                setEmployerSettings(response as EmployerSettings);
            } else {
                const appSettings = response as ApplicantSettings;
                setApplicantSettings(appSettings);
            }
        }
        fetchUserSettings();
    }, [userType]);
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
            <div className="w-full grid grid-cols-1 lg:grid-cols-[20%_70%] justify-center gap-x-[5%] mt-10 px-10">
                {/* Sidebar */}
                <NotificationSidebar/>


                {/* Main Content */}
                <div className="w-full flex flex-col">
                    <NotificationSettingsHeader/>

                    {/*Notification */}
                    {settings.notification && (
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
                    {/*Subscription */}
                    {settings.subscription && (
                        <div className="w-full flex flex-col items-center overflow-y-auto max-h-screen">
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
