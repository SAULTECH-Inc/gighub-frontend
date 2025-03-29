import ToggleSwitch from "../../../components/common/ToggleSwitch.tsx";
import {
    ApplicationStatus,
    ApplicationStatusNotification,
    NotificationType, useSettingsStore,
} from "../../../store/useSettingsStore.ts";
import {toast} from "react-toastify";
import { debounce } from 'lodash';
import {useCallback, useEffect} from "react";

const JobApplicationUpdate = () => {
    const {applicationStatusNotification, applicantSettings, setApplicationStatusNotification, updateApplicationStatusNotification} = useSettingsStore();
    useEffect(() => {
        if(applicantSettings){
            setApplicationStatusNotification(applicantSettings?.notifications?.options?.applicationStatus);
        }
    }, [applicantSettings]);


    const debouncedUpdate = useCallback(
        debounce(async (settings: ApplicationStatusNotification) => {
            const response = await updateApplicationStatusNotification(settings);
            if (response) {
                setApplicationStatusNotification(response);
            } else {
                toast.error("Failed to update application status notification settings");
            }
        }, 500),
        [applicationStatusNotification]
    );

    useEffect(() => {
        return () => {
            debouncedUpdate.cancel(); // prevent memory leak
        };
    }, [debouncedUpdate]);



    // Define application updates options
    const applicationUpdates = ["all", "submitted", "shortlisted", "rejected", "scheduledForInterview"];

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
            ...applicationStatusNotification,
            notificationType: {
                ...applicationStatusNotification.notificationType,
                [item]: !applicationStatusNotification.notificationType[item as keyof NotificationType]
            }
        };
        setApplicationStatusNotification(updatedSettings);
        debouncedUpdate(updatedSettings);
    };

    // Helper function to get the field name dynamically
    const getApplicationUpdateStateField = (item: string) => {
        switch (item.toLowerCase()) {
            case "submitted":
                return "Submitted";
            case "shortlisted":
                return "Shortlisted";
            case "rejected":
                return "Rejected";
            case "scheduledForInterview":
                return "Interview Schedule";
            default:
                return "All";
        }
    };


    // Function to get the application update state
    const handleApplicationUpdateToggle = (item: string) => {
        const updatedSettings = {
            ...applicationStatusNotification,
            option: {
                ...applicationStatusNotification.option,
                [item]: !applicationStatusNotification.option[item as keyof ApplicationStatus]
            }
        };
        setApplicationStatusNotification(updatedSettings);
        debouncedUpdate(updatedSettings);
    };






    return (
        <div className="w-[90%] flex flex-col self-center py-10 font-lato">
            {/* Title */}
            <h2 className="text-black font-bold text-[24px] text-left text-xl">
                Job Application Update
            </h2>

            {/* Privacy Box */}
            <div className="bg-white border border-[#E6E6E6] rounded-[16px] w-full min-h-[265px] flex flex-col items-start py-6 px-8 mt-4">
                {/* Two Column Headings */}
                <div className="grid grid-cols-2 w-full">
                    <h3 className="text-black text-md font-bold">Receive Update on Application Status</h3>
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
                                    isOn={applicationStatusNotification?.option[item as keyof ApplicationStatus]}
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
                                    isOn={applicationStatusNotification?.notificationType[item as keyof NotificationType]}
                                    onToggle={() => handleToggle(item)}
                                />
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobApplicationUpdate;
