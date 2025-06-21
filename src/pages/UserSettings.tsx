import { FC, useEffect, useState } from "react";
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
import { useNavMenuStore } from "../store/useNavMenuStore.ts";
import MonthlyPlan from "./settings/subscription/MonthlyPlan.tsx";
import InvoiceList from "./settings/subscription/InvoiceList.tsx";
import Privacy from "./settings/privacy/Privacy.tsx";
import Account from "./settings/account/Account.tsx";
import { useAuth } from "../store/useAuth.ts";
import { UserType } from "../utils/enums.ts";
import {
  ApplicantSettings,
  EmployerSettings,
  useSettingsStore,
} from "../store/useSettingsStore.ts";
import TopNavBar from "../components/layouts/TopNavBar.tsx";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../utils/constants.ts";
import ManageJobNotification from "./settings/notification/employer/ManageJobNotification.tsx";
import JobPostingStatus from "./settings/notification/employer/JobPostingStatus.tsx";
import PaymentAndSubscription from "./settings/notification/employer/PaymentAndSubscription.tsx";
import { IoArrowBackOutline } from "react-icons/io5";
import NotificationSidebarAsMenu from "../components/ui/NotificationSidebarAsMenu.tsx";
import { useSubscriptionStore } from "../store/useSubscriptionStore.ts";
const UserSettings: FC = () => {
  const { settings } = useNavMenuStore();
  const { applicant, employer, userType } = useAuth();
  const { setApplicantSettings, setEmployerSettings, fetchSettings } =
    useSettingsStore();
  const [showMenu, setShowMenu] = useState(false);
  const { getUserSubscription, getUserSubscriptionHistory } =
    useSubscriptionStore();

  useEffect(() => {
    if (!userType) return;

    console.log("✅ useEffect triggered for subscription");

    if (userType === UserType.APPLICANT && applicant?.id) {
      getUserSubscription(applicant.id as number);
      getUserSubscriptionHistory(applicant.id as number);
    } else if (userType === UserType.EMPLOYER && employer?.id) {
      getUserSubscription(employer.id as number);
      getUserSubscriptionHistory(employer.id as number);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, applicant?.id, employer?.id]);

  useEffect(() => {
    const fetchUserSettings = async () => {
      console.log("hello world");
      const response = await fetchSettings(userType as UserType);
      if (userType === UserType.EMPLOYER) {
        setEmployerSettings(response as EmployerSettings);
      } else {
        const appSettings = response as ApplicantSettings;
        setApplicantSettings(appSettings);
      }
    };
    fetchUserSettings().then(() => console.log("FETCH SETTINGS"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType]);
  const toggle = () => setShowMenu(!showMenu);
  return (
    <div className="mx-auto h-auto w-full bg-[#F7F8FA]">
      {userType === UserType.EMPLOYER ? (
        <TopNavBar
          navItems={employerNavItems}
          navItemsMobile={employerNavItemsMobile}
          navbarItemsMap={employerNavBarItemMap}
        />
      ) : (
        <TopNavBar
          navItems={applicantNavItems}
          navItemsMobile={applicantNavItemsMobile}
          navbarItemsMap={applicantNavBarItemMap}
        />
      )}
      <div className="mt-10 grid w-full grid-cols-1 justify-center gap-x-[5%] px-2 md:px-10 lg:grid-cols-[20%_70%]">
        {/* Sidebar */}
        <NotificationSidebar />

        {/* Main Content */}
        <div className="flex w-full flex-col">
          <div className="mb-4 flex gap-x-4 px-4 text-[#6438C2] md:hidden">
            <div
              onClick={() => {
                setShowMenu(!showMenu);
              }}
              className="flex cursor-pointer items-center gap-x-2"
            >
              <IoArrowBackOutline />
              <p className="text-sm">Back</p>
            </div>
            <h1 className="text-lg font-bold">
              {settings.notification && "Notification"}
              {settings.subscription && "Subscription"}
              {settings.account && "Account"}
              {settings.privacy && "Privacy"}
            </h1>
          </div>
          <NotificationSettingsHeader />
          <NotificationSidebarAsMenu toggle={toggle} open={showMenu} />

          {/*Notification */}
          {settings.notification && userType === UserType.APPLICANT && (
            <div className="flex max-h-screen w-full flex-col items-center overflow-y-auto">
              <JobApplicationUpdate />
              <JobRecommendation />
              <InterviewInvitation />
              <AutoApply />
              <SavedJob />
              <EmployerAction />
              <PlatformNotification />
              <GeneralSettings />
              <CommunicationPreferences />
            </div>
          )}

          {settings.notification && userType === UserType.EMPLOYER && (
            <div className="flex max-h-screen w-full flex-col items-center overflow-y-auto">
              <ManageJobNotification />
              <JobPostingStatus />
              <InterviewInvitation />
              <PaymentAndSubscription />
            </div>
          )}
          {/*Subscription */}
          {settings.subscription && (
            <div className="flex max-h-screen w-full flex-col items-center md:overflow-y-auto">
              <MonthlyPlan />
              <InvoiceList />
            </div>
          )}

          {settings.privacy && (
            <div className="flex max-h-screen w-full flex-col items-center overflow-y-auto">
              <Privacy />
            </div>
          )}

          {settings.account && (
            <div className="flex max-h-screen w-full flex-col items-center overflow-y-auto">
              <Account />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
