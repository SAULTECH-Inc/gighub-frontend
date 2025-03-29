import {useCallback, useEffect} from "react";
import ToggleSwitch from "../../../components/common/ToggleSwitch.tsx";
import {
    InterviewInvitationState, InterviewInvitationNotification, NotificationType,
    useSettingsStore
} from "../../../store/useSettingsStore.ts";
import {debounce} from "lodash";
import {toast} from "react-toastify";

const InterviewInvitation = () => {
    // State to track toggle status for each item
    const {applicantSettings, interviewInvitation, setInterviewInvitation, updateInterviewInvitation} = useSettingsStore();
    const notificationTypes = ["all", "emailNotification", "pushNotification"];
    const interviewUpdates = [
        "scheduleCancelled",
    "scheduleRescheduled",
    "notifyForUpcomingInterviews",
    "notifyForInterviewConfirmation"
    ];

    useEffect(() => {
        if(applicantSettings){
            setInterviewInvitation(applicantSettings.notifications.options.interviewInvitation);
        }
    }, [applicantSettings]);


    const debouncedUpdate = useCallback(
        debounce(async (settings: InterviewInvitationNotification) => {
            const response = await updateInterviewInvitation(settings);
            if (response) {
                setInterviewInvitation(response);
            } else {
                toast.error("Failed to update application status notification settings");
            }
        }, 500),
        [interviewInvitation]
    );

    useEffect(() => {
        return () => {
            debouncedUpdate.cancel(); // prevent memory leak
        };
    }, [debouncedUpdate]);

    const getInterviewInvitationStateField = (item: string) => {
        switch (item) {
            case "scheduleRescheduled":
                return "An employer schedules an interview";
            case "scheduleCancelled":
                return "An interview is canceled";
            case "notifyForUpcomingInterviews":
                return "Notify for upcoming interviews";
            default:
                return "Notify for interview confirmation";
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
            ...interviewInvitation,
            notificationType: {
                ...interviewInvitation.notificationType,
                [item]:!interviewInvitation.notificationType[item as keyof NotificationType]
            }
        };
        setInterviewInvitation(updatedSettings);
        debouncedUpdate(updatedSettings);
    };

    const handleInterviewInvitationToggle = (item: string) => {
        const updatedSettings = {
            ...interviewInvitation,
            option: {
                ...interviewInvitation.option,
                [item]:!interviewInvitation.option[item as keyof InterviewInvitationState]
            }
        };
        setInterviewInvitation(updatedSettings);
        debouncedUpdate(updatedSettings);
    }

    return (
        <div className="w-[90%] flex flex-col self-center py-10 font-lato">
            <hr className="w-full border-t border-[#E6E6E6] mb-4" />

            {/* Page Title */}
            <h2 className="text-black font-bold text-[24px] text-left text-xl">
                Interview Invitation
            </h2>

            {/* White Box Container */}
            <div className="bg-white border border-[#E6E6E6] rounded-[16px] w-full min-h-[200px] flex flex-col items-start py-6 px-8 mt-4">
                {/* Header Titles */}
                <div className="grid grid-cols-2 w-full font-bold text-md text-black">
                    <h3>Notify me when:</h3>
                    <h3>Notification Type</h3>
                </div>

                {/* Horizontal Rule */}
                <hr className="w-full border-t border-[#E6E6E6] my-3" />

                {/* Two-Column Layout */}
                <div className="grid grid-cols-2 w-full gap-x-8 p-8">
                    {/* Left Column - Interview Updates */}
                    <div className="w-full">
                        <div className="space-y-4 mt-2">
                            {interviewUpdates.map((item, index) => (
                                <label key={index} className="flex items-center justify-between">
                                    <span className="text-[16px] text-[#8E8E8E]">{getInterviewInvitationStateField(item)}</span>
                                    <ToggleSwitch
                                        isOn={interviewInvitation.option[item as keyof InterviewInvitationState]}
                                        onToggle={() => handleInterviewInvitationToggle(item)}
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
                                        isOn={interviewInvitation.notificationType[item as keyof NotificationType]}
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

export default InterviewInvitation;
