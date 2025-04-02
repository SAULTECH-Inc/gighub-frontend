import {useCallback, useEffect} from "react";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
    EmployerActionNotification, EmployerActionOption,
    NotificationType,
    useSettingsStore
} from "../../../../store/useSettingsStore.ts";
import {debounce} from "lodash";
import {toast} from "react-toastify";

const EmployerAction = () => {
    const {applicantSettings, employerAction, setEmployerAction, updateEmployerAction} = useSettingsStore();
    const notificationTypes = ["all", "emailNotification", "pushNotification"];
    const employerActions = [
        "viewedMyProfile",
    "downloadedMyResume",
    "sentDirectMessage",
    ];

    useEffect(() => {
        if(applicantSettings){
            setEmployerAction(applicantSettings.notifications.options.employerAction);
        }
    }, [applicantSettings]);


    const debouncedUpdate = useCallback(
        debounce(async (settings: EmployerActionNotification) => {
            const response = await updateEmployerAction(settings);
            if (response) {
                setEmployerAction(response);
            } else {
                toast.error("Failed to update application status notification settings");
            }
        }, 500),
        [employerAction]
    );

    useEffect(() => {
        return () => {
            debouncedUpdate.cancel(); // prevent memory leak
        };
    }, [debouncedUpdate]);

    const getEmployerActionStateField = (item: string) => {
        switch (item) {
            case "viewedMyProfile":
                return "Views my profile";
            case "downloadedMyResume":
                return "Downloads my Resume";
            default:
                return "Sends a direct message";
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
            ...employerAction,
            notificationType: {
                ...employerAction.notificationType,
                [item]:!employerAction.notificationType[item as keyof NotificationType]
            }
        };
        setEmployerAction(updatedSettings);
        debouncedUpdate(updatedSettings);
    };

    const handleEmployerActionsToggle = (item: string) => {
        const updatedSettings = {
            ...employerAction,
            option: {
                ...employerAction.option,
                [item]:!employerAction.option[item as keyof EmployerActionOption]
            }
        };
        setEmployerAction(updatedSettings);
        debouncedUpdate(updatedSettings);
    }

    return (
        <div className="w-[95%] md:w-[90%] flex flex-col self-center font-lato">
            <hr className="w-full border-t border-[#E6E6E6] mb-4" />

            {/* Page Title */}
            <h2 className="text-black font-bold text-[24px] text-left text-xl">
                Employer Action
            </h2>

            {/* White Box Container */}
            <div className="bg-white border border-[#E6E6E6] rounded-[16px] w-full min-h-[200px] flex flex-col items-start py-6 px-4 md:px-8 mt-4">
                {/* Header Titles */}
                <div className="grid grid-cols-2 w-full font-bold text-md text-black">
                    <h3>Notify me when an employer:</h3>
                    <h3>Notification Type</h3>
                </div>

                {/* Horizontal Rule */}
                <hr className="w-full border-t border-[#E6E6E6] my-3" />

                {/* Two-Column Layout */}
                <div className="grid grid-cols-2 w-full gap-x-8 px-2 py-8">
                    {/* Left Column - Employer Actions */}
                    <div className="w-full">
                        <div className="space-y-4 mt-2">
                            {employerActions.map((item, index) => (
                                <label key={index} className="flex items-center justify-between">
                                    <span className="text-[16px] text-[#8E8E8E]">{getEmployerActionStateField(item)}</span>
                                    <ToggleSwitch
                                        isOn={employerAction.option[item as keyof EmployerActionOption]}
                                        onToggle={() => handleEmployerActionsToggle(item)}
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
                                        isOn={employerAction.notificationType[item as keyof NotificationType]}
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

export default EmployerAction;
