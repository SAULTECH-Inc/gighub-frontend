import {FC} from "react";
import ApplicantNavBar from "../components/layouts/ApplicantNavBar.tsx";
import Notification from "./settings/notification/Notification.tsx";
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
const EmployerProfile: FC = () => {
    return (
        <div className="mx-auto">
            <ApplicantNavBar/>
            <div className="flex justify-center  min-h-screen pt-6 mx-auto gap-x-10 px-2 lg:px-5">
                {/* Sidebar */}
                <NotificationSidebar/>


                {/* Main Content */}
                <div className=" rounded-[16px]  lg:w-[70%]  p-4 lg:p-8">
                    {/*<ProfileCard/>*/}

                    {/*Form */}
                    <form className="space-y-8">
                        <Notification/>
                        <JobApplicationUpdate/>
                        <JobRecommendation/>
                        <InterviewInvitation/>
                        <AutoApply/>
                        <SavedJob/>
                        <EmployerAction/>
                        <PlatformNotification/>
                        <GeneralSettings/>
                        <CommunicationPreferences/>


                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;
