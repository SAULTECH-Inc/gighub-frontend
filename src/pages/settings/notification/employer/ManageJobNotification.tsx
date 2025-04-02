import {ManageJobApplicationsNotifications, ManageJobNotificationState,
    NotificationType,
    useSettingsStore
} from "../../../../store/useSettingsStore.ts";
import {useCallback, useEffect} from "react";
import {debounce} from "lodash";
import {toast} from "react-toastify";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";

const ManageJobNotification = ()=>{
    const {employerSettings, manageJobApplications, setManageJobApplications, updateManageJobApplications} = useSettingsStore();
    useEffect(() => {
        if(employerSettings){
            setManageJobApplications(employerSettings?.notifications?.options?.manageJobApplications);
        }
    }, [employerSettings]);


    const debouncedUpdate = useCallback(
        debounce(async (settings: ManageJobApplicationsNotifications) => {
            const response = await updateManageJobApplications(settings);
            if (response) {
                setManageJobApplications(response);
            } else {
                toast.error("Failed to update application status notification settings");
            }
        }, 500),
        [manageJobApplications]
    );

    useEffect(() => {
        return () => {
            debouncedUpdate.cancel(); // prevent memory leak
        };
    }, [debouncedUpdate]);

    // Define application updates options
    const applicationUpdates = ["applicantApplies", "applicationStatusUpdated", "interviewScheduled"];

    // Define notification types options
    const notificationTypes = ["all", "emailNotification", "pushNotification"];
    const getNotificationTypeStateField = (item: string) => {
        switch (item) {
            case "emailNotification":
                return "Email Notification";
            case "pushNotification":
                return "Push Notification";
            default:
                return "All";
        }
    }

    const handleToggle = (item: string) => {
        const updatedSettings = {
            ...manageJobApplications,
            notificationType: {
                ...manageJobApplications.notificationType,
                [item]: !manageJobApplications.notificationType[item as keyof NotificationType]
            }
        };
        setManageJobApplications(updatedSettings);
        debouncedUpdate(updatedSettings);
    };

    // Helper function to get the field name dynamically
    const getApplicationUpdateStateField = (item: string) => {
        switch (item) {
            case "applicantApplies":
                return "Notify me when an applicant  applies";
            case "applicationStatusUpdated":
                return "Notify me when an applicant's application status is updated";
            default:
                return "Notify me about applicant interview  schedule";
        }
    };


    // Function to get the application update state
    const handleApplicationUpdateToggle = (item: string) => {
        const updatedSettings = {
            ...manageJobApplications,
            option: {
                ...manageJobApplications.option,
                [item]: !manageJobApplications.option[item as keyof ManageJobNotificationState]
            }
        };
        setManageJobApplications(updatedSettings);
        debouncedUpdate(updatedSettings);
    };






    return (
        <div className="w-[90%] flex flex-col self-center py-10 font-lato">
            {/* Title */}
            <h2 className="text-black font-bold text-[24px] text-left text-xl">
                Manage Job Application
            </h2>

            {/* Privacy Box */}
            <div className="bg-white border border-[#E6E6E6] rounded-[16px] w-full min-h-[265px] flex flex-col items-start py-6 px-8 mt-4">
                {/* Two Column Headings */}
                <div className="grid grid-cols-2 w-full">
                    <h3 className="text-black text-md font-bold">Notify me when:</h3>
                    <h3 className="text-black text-md font-bold text-right">Notification Type</h3>
                </div>

                {/* Horizontal Rule */}
                <hr className="w-full border-t border-[#E6E6E6] my-3" />

                {/* Two-Column Layout */}
                <div className="grid grid-cols-2 w-full gap-x-8 p-8">
                    {/* Left Column - Application Status */}
                    <div className="w-full space-y-4">
                        {applicationUpdates.map((item, index) => (
                            <label key={index} className="flex items-center justify-between">
                                <span className="font-bold text-[16px] text-[#8E8E8E]">{getApplicationUpdateStateField(item)}</span>
                                <ToggleSwitch
                                    isOn={manageJobApplications?.option[item as keyof ManageJobNotificationState]}
                                    onToggle={() => handleApplicationUpdateToggle(item)}
                                />
                            </label>
                        ))}
                    </div>

                    {/* Right Column - Notification Type */}
                    <div className="w-full space-y-4">
                        {notificationTypes.map((item, index) => (
                            <label key={index} className="flex items-center justify-between">
                                <span className="font-bold text-[16px] text-[#8E8E8E]">{getNotificationTypeStateField(item)}</span>
                                <ToggleSwitch
                                    isOn={manageJobApplications?.notificationType[item as keyof NotificationType]}
                                    onToggle={() => handleToggle(item)}
                                />
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageJobNotification;
