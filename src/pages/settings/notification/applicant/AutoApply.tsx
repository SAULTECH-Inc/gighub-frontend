import {useCallback, useEffect} from "react";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
    AutoApplyState,
    AutoApplyNotification,NotificationType,
    useSettingsStore
} from "../../../../store/useSettingsStore.ts";
import {debounce} from "lodash";
import {toast} from "react-toastify";

const AutoApply = () => {
    // State to track toggle status for each item
    const {applicantSettings, autoApply, setAutoApply, updateAutoApply} = useSettingsStore();
    const notificationTypes = ["all", "emailNotification", "pushNotification"];
    const autoApplyOptions = [
        "jobAutoApplied",
    "jobMatchFound",
    "jobMatchedButFailedToApply"
    ];

    useEffect(() => {
        if(applicantSettings){
            setAutoApply(applicantSettings.notifications.options.autoApply);
        }
    }, [applicantSettings]);


    const debouncedUpdate = useCallback(
        debounce(async (settings: AutoApplyNotification) => {
            const response = await updateAutoApply(settings);
            if (response) {
                setAutoApply(response);
            } else {
                toast.error("Failed to update application status notification settings");
            }
        }, 500),
        [autoApply]
    );

    useEffect(() => {
        return () => {
            debouncedUpdate.cancel(); // prevent memory leak
        };
    }, [debouncedUpdate]);

    const getAutoApplyStateField = (item: string) => {
        switch (item) {
            case "jobAutoApplied":
                return "A job is auto-applied successfully";
            case "jobMatchFound":
                return "Job Match Found";
            default:
                return "Job matches my profile but fails to apply";
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
            ...autoApply,
            notificationType: {
                ...autoApply.notificationType,
                [item]:!autoApply.notificationType[item as keyof NotificationType]
            }
        };
        setAutoApply(updatedSettings);
        debouncedUpdate(updatedSettings);
    };

    const handleAutoApplyToggle = (item: string) => {
        const updatedSettings = {
            ...autoApply,
            option: {
                ...autoApply.option,
                [item]:!autoApply.option[item as keyof AutoApplyState]
            }
        };
        setAutoApply(updatedSettings);
        debouncedUpdate(updatedSettings);
    }
    return (
        <div className="w-[95%] md:w-[90%] flex flex-col self-center font-lato">
            <hr className="w-full border-t border-[#E6E6E6] mb-4" />

            {/* Page Title */}
            <h2 className="text-black font-bold text-[24px] text-left text-xl">
                Auto Apply Notification
            </h2>

            {/* White Box Container */}
            <div className="bg-white border border-[#E6E6E6] rounded-[16px] w-full min-h-[200px] flex flex-col items-start py-6 px-4 md:px-8 mt-4">
                {/* Header Titles */}
                <div className="grid grid-cols-2 w-full font-bold text-md text-black">
                    <h3>Notify me when:</h3>
                    <h3>Notification Type</h3>
                </div>

                {/* Horizontal Rule */}
                <hr className="w-full border-t border-[#E6E6E6] my-3" />

                {/* Two-Column Layout */}
                <div className="grid grid-cols-2 w-full gap-x-8 px-2 py-8">
                    {/* Left Column - Auto Apply Updates */}
                    <div className="w-full">
                        <div className="space-y-4 mt-2">
                            {autoApplyOptions.map((item, index) => (
                                <label key={index} className="flex items-center justify-between">
                                    <span className="text-[16px] text-[#8E8E8E]">{getAutoApplyStateField(item)}</span>
                                    <ToggleSwitch
                                        isOn={autoApply.option[item as keyof AutoApplyState]}
                                        onToggle={() => handleAutoApplyToggle(item)}
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
                                        isOn={autoApply.notificationType[item as keyof NotificationType]}
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

export default AutoApply;
