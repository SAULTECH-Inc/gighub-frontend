import {useCallback, useEffect} from "react";
import ToggleSwitch from "../../../components/common/ToggleSwitch.tsx";
import {
    CommunicationNotification, CommunicationNotificationOption,
    NotificationType,
    useSettingsStore
} from "../../../store/useSettingsStore.ts";
import {debounce} from "lodash";
import {toast} from "react-toastify";

const CommunicationPreferences = () => {
    const {applicantSettings, communication, setCommunication, updateCommunication} = useSettingsStore();
    const notificationTypes = ["all", "emailNotification", "pushNotification"];
    const communicationNotificationState = [
        "promotionalOffers",
    "fromPlatform"
    ];


    useEffect(() => {
        if (applicantSettings) {
            setCommunication(applicantSettings.notifications.options.communication);
        }
    }, [applicantSettings]);


    const debouncedUpdate = useCallback(
        debounce(async (settings: CommunicationNotification) => {
            const response = await updateCommunication(settings);
            if (response) {
                setCommunication(response);
            } else {
                toast.error("Failed to update application status notification settings");
            }
        }, 500),
        [communication]
    );

    useEffect(() => {
        return () => {
            debouncedUpdate.cancel(); // prevent memory leak
        };
    }, [debouncedUpdate]);

    const getCommunicationStateField = (item: string) => {
        switch (item) {
            case "promotionalOffers":
                return "From employers";
            default:
                return "From platform";
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
            ...communication,
            notificationType: {
                ...communication.notificationType,
                [item]: !communication.notificationType[item as keyof NotificationType]
            }
        };
        setCommunication(updatedSettings);
        debouncedUpdate(updatedSettings);
    };

    const handleCommunicationSettingsToggle = (item: string) => {
        const updatedSettings = {
            ...communication,
            option: {
                ...communication.option,
                [item]: !communication.option[item as keyof CommunicationNotificationOption]
            }
        };
        setCommunication(updatedSettings);
        debouncedUpdate(updatedSettings);
    }

    return (
        <div className="w-[90%] flex flex-col self-center py-10 font-lato">
            <hr className="w-full border-t border-[#E6E6E6] mb-4" />

            {/* Page Title */}
            <h2 className="text-black font-bold text-[24px] text-left text-xl">
                Communication Preferences
            </h2>

            {/* White Box Container */}
            <div className="bg-white border border-[#E6E6E6] rounded-[16px] w-full min-h-[200px] flex flex-col items-start py-6 px-8 mt-4">
                {/* Header Titles */}
                <div className="grid grid-cols-2 w-full font-bold text-md text-black">
                    <h3>Receive Promotional Offers</h3>
                    <h3>Notification Type</h3>
                </div>

                {/* Horizontal Rule */}
                <hr className="w-full border-t border-[#E6E6E6] my-3" />

                {/* Two-Column Layout */}
                <div className="grid grid-cols-2 w-full gap-x-8 p-8">
                    {/* Left Column - Promotional Offers */}
                    <div className="w-full">
                        <div className="space-y-4 mt-2">
                            {communicationNotificationState.map((item, index) => (
                                <label key={index} className="flex items-center justify-between">
                                    <span className="text-[16px] text-[#8E8E8E]">{getCommunicationStateField(item)}</span>
                                    <ToggleSwitch
                                        isOn={communication.option[item as keyof CommunicationNotificationOption]}
                                        onToggle={() => handleCommunicationSettingsToggle(item)}
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
                                        isOn={communication.notificationType[item as keyof NotificationType]}
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

export default CommunicationPreferences;
