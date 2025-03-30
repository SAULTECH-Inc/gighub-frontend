import {useCallback, useEffect} from "react";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
    GeneralSettingsNotification, GeneralSettingsNotificationOptions,
    NotificationType,
    useSettingsStore
} from "../../../../store/useSettingsStore.ts";
import {debounce} from "lodash";
import {toast} from "react-toastify";

const GeneralSettings = () => {
    const {applicantSettings, generalSettings, setGeneralSettings, updateGeneralSettings} = useSettingsStore();
    const notificationTypes = ["all", "emailNotification", "pushNotification"];
    const generalSettingsState = [
        "enableTwoFactorAuth",
        "passwordChange",
        "passwordReset",
        "loginFromNewDevice",
        "login",
    ];

    useEffect(() => {
        if (applicantSettings) {
            setGeneralSettings(applicantSettings.notifications.options.generalSettings);
        }
    }, [applicantSettings]);


    const debouncedUpdate = useCallback(
        debounce(async (settings: GeneralSettingsNotification) => {
            const response = await updateGeneralSettings(settings);
            if (response) {
                setGeneralSettings(response);
            } else {
                toast.error("Failed to update application status notification settings");
            }
        }, 500),
        [generalSettings]
    );

    useEffect(() => {
        return () => {
            debouncedUpdate.cancel(); // prevent memory leak
        };
    }, [debouncedUpdate]);

    const getGeneralSettingsStateField = (item: string) => {
        switch (item) {
            case "enableTwoFactorAuth":
                return "Two factor authentication is enabled";
            case "passwordChange":
                return "Password is changed";
            case "passwordReset":
                return "Password is reset";
            case "loginFromNewDevice":
                return "Login from new device";
            default:
                return "Login";
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
            ...generalSettings,
            notificationType: {
                ...generalSettings.notificationType,
                [item]: !generalSettings.notificationType[item as keyof NotificationType]
            }
        };
        setGeneralSettings(updatedSettings);
        debouncedUpdate(updatedSettings);
    };

    const handleGeneralSettingsToggle = (item: string) => {
        const updatedSettings = {
            ...generalSettings,
            option: {
                ...generalSettings.option,
                [item]: !generalSettings.option[item as keyof GeneralSettingsNotificationOptions]
            }
        };
        setGeneralSettings(updatedSettings);
        debouncedUpdate(updatedSettings);
    }

    return (
        <div className="w-[90%] flex flex-col self-center font-lato">
            <hr className="w-full border-t border-[#E6E6E6] mb-4"/>

            {/* Page Title */}
            <h2 className="text-black font-bold text-[24px] text-left text-xl">
                General Settings
            </h2>

            {/* White Box Container */}
            <div
                className="bg-white border border-[#E6E6E6] rounded-[16px] w-full min-h-[200px] flex flex-col items-start py-6 px-8 mt-4">
                {/* Header Titles */}
                <div className="grid grid-cols-2 w-full font-bold text-md text-black">
                    <h3>Notify me when:</h3>
                    <h3>Notification Type</h3>
                </div>

                {/* Horizontal Rule */}
                <hr className="w-full border-t border-[#E6E6E6] my-3"/>

                {/* Two-Column Layout */}
                <div className="grid grid-cols-2 w-full gap-x-8 p-8">
                    {/* Left Column - General Settings Notifications */}
                    <div className="w-full">
                        <div className="space-y-4 mt-2">
                            {generalSettingsState.map((item, index) => (
                                <label key={index} className="flex items-center justify-between">
                                    <span
                                        className="text-[16px] text-[#8E8E8E]">{getGeneralSettingsStateField(item)}</span>
                                    <ToggleSwitch
                                        isOn={generalSettings.option[item as keyof GeneralSettingsNotificationOptions]}
                                        onToggle={() => handleGeneralSettingsToggle(item)}
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
                                    <span
                                        className="text-[16px] text-[#8E8E8E]">{getNotificationTypeStateField(item)}</span>
                                    <ToggleSwitch
                                        isOn={generalSettings.notificationType[item as keyof NotificationType]}
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

export default GeneralSettings;
