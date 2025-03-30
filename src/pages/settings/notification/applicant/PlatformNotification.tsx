import {useCallback, useEffect} from "react";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
    NotificationType, PlatformNotificationOption, PlatformNotifications,
    useSettingsStore
} from "../../../../store/useSettingsStore.ts";
import {debounce} from "lodash";
import {toast} from "react-toastify";

const PlatformNotification = () => {
    const {applicantSettings, platform, setPlatform, updatePlatform} = useSettingsStore();
    const notificationTypes = ["all", "emailNotification", "pushNotification"];
    const platformState = [
        "newProductOrUpdate",
    "maintenanceDowntime"
    ];

    useEffect(() => {
        if(applicantSettings){
            setPlatform(applicantSettings.notifications.options.platform);
        }
    }, [applicantSettings]);


    const debouncedUpdate = useCallback(
        debounce(async (settings: PlatformNotifications) => {
            const response = await updatePlatform(settings);
            if (response) {
                setPlatform(response);
            } else {
                toast.error("Failed to update application status notification settings");
            }
        }, 500),
        [platform]
    );

    useEffect(() => {
        return () => {
            debouncedUpdate.cancel(); // prevent memory leak
        };
    }, [debouncedUpdate]);
    const getPlatformStateField = (item: string) => {
        switch (item) {
            case "newProductOrUpdate":
                return "New features or update";
            default:
                return "Maintenance or downtime";
        }
    }

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


    const handleNotificationTypeToggle = (item: string) => {
        const updatedSettings = {
            ...platform,
            notificationType: {
                ...platform.notificationType,
                [item]:!platform.notificationType[item as keyof NotificationType]
            }
        };
        setPlatform(updatedSettings);
        debouncedUpdate(updatedSettings);
    };

    const handlePlatformToggle = (item: string) => {
        const updatedSettings = {
            ...platform,
            option: {
                ...platform.option,
                [item]:!platform.option[item as keyof PlatformNotificationOption]
            }
        };
        setPlatform(updatedSettings);
        debouncedUpdate(updatedSettings);
    }
    return (
        <div className="w-[90%] flex flex-col self-center py-10 font-lato">
            <hr className="w-full border-t border-[#E6E6E6] mb-4" />

            {/* Page Title */}
            <h2 className="text-black font-bold text-[24px] text-left text-xl">
                Platform Notification
            </h2>

            {/* White Box Container */}
            <div className="bg-white border border-[#E6E6E6] rounded-[16px] w-full min-h-[200px] flex flex-col items-start py-6 px-8 mt-4">
                {/* Header Titles */}
                <div className="grid grid-cols-2 w-full font-bold text-md text-black">
                    <h3>Notify me about:</h3>
                    <h3>Notification Type</h3>
                </div>

                {/* Horizontal Rule */}
                <hr className="w-full border-t border-[#E6E6E6] my-3" />

                {/* Two-Column Layout */}
                <div className="grid grid-cols-2 w-full gap-x-8 p-8">
                    {/* Left Column - Platform Notifications */}
                    <div className="w-full">
                        <div className="space-y-4 mt-2">
                            {platformState.map((item, index) => (
                                <label key={index} className="flex items-center justify-between">
                                    <span className="text-[16px] text-[#8E8E8E]">{getPlatformStateField(item)}</span>
                                    <ToggleSwitch
                                        isOn={platform.option[item as keyof PlatformNotificationOption]}
                                        onToggle={() => handlePlatformToggle(item)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Notification Type */}
                    <div className="w-full">
                        <div className="space-y-4 mt-2">
                            {notificationTypes.map((item, index) => (
                                <label key={index} className="flex items-center justify-between">
                                    <span className="text-[16px] text-[#8E8E8E]">{getNotificationTypeStateField(item)}</span>
                                    <ToggleSwitch
                                        isOn={platform.notificationType[item as keyof NotificationType]}
                                        onToggle={() => handleNotificationTypeToggle(item)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformNotification;
