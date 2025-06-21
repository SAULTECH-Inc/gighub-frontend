import { useCallback, useEffect } from "react";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  InterviewInvitationState,
  InterviewInvitationNotification,
  NotificationType,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { USER_TYPE } from "../../../../utils/helpers.ts";
import { UserType } from "../../../../utils/enums.ts";

const InterviewInvitation = () => {
  // State to track toggle status for each item
  const {
    applicantSettings,
    employerSettings,
    interviewInvitation,
    setInterviewInvitation,
    updateInterviewInvitation,
  } = useSettingsStore();
  const notificationTypes = ["all", "emailNotification", "pushNotification"];
  const interviewUpdates = [
    "scheduleCancelled",
    "scheduleRescheduled",
    "notifyForUpcomingInterviews",
    "notifyForInterviewConfirmation",
  ];

  useEffect(() => {
    if (applicantSettings && USER_TYPE === UserType.APPLICANT) {
      setInterviewInvitation(
        applicantSettings.notifications.options.interviewInvitation,
      );
    } else {
      setInterviewInvitation(
        employerSettings.notifications.options.interviewInvitation,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantSettings]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce(async (settings: InterviewInvitationNotification) => {
      const response = await updateInterviewInvitation(settings);
      if (response) {
        setInterviewInvitation(response);
      } else {
        toast.error(
          "Failed to update application status notification settings",
        );
      }
    }, 500),
    [interviewInvitation],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel(); // prevent memory leak
    };
  }, [debouncedUpdate]);

  const getInterviewInvitationStateField = (item: string) => {
    switch (item) {
      case "scheduleRescheduled":
        return "When An employer schedules an interview";
      case "scheduleCancelled":
        return "When An interview is cancelled";
      case "notifyForUpcomingInterviews":
        return "For upcoming interviews";
      default:
        return "For interview confirmation";
    }
  };

  const getNotificationTypeStateField = (item: string) => {
    switch (item) {
      case "emailNotification":
        return "Email Notification";
      case "pushNotification":
        return "Push Notification";
      default:
        return "All";
    }
  };
  const handleNotificationTypeToggle = (item: string) => {
    const updatedSettings = {
      ...interviewInvitation,
      notificationType: {
        ...interviewInvitation.notificationType,
        [item]:
          !interviewInvitation.notificationType[item as keyof NotificationType],
      },
    };
    setInterviewInvitation(updatedSettings);
    debouncedUpdate(updatedSettings);
  };

  const handleInterviewInvitationToggle = (item: string) => {
    const updatedSettings = {
      ...interviewInvitation,
      option: {
        ...interviewInvitation.option,
        [item]:
          !interviewInvitation.option[item as keyof InterviewInvitationState],
      },
    };
    setInterviewInvitation(updatedSettings);
    debouncedUpdate(updatedSettings);
  };

  return (
    <div className="flex w-[95%] flex-col self-center py-10 font-lato md:w-[90%]">
      <hr className="mb-4 w-full border-t border-[#E6E6E6]" />

      {/* Page Title */}
      <h2 className="text-left text-[24px] text-xl font-bold text-black">
        Interview Invitation
      </h2>

      {/* White Box Container */}
      <div className="mt-4 flex min-h-[200px] w-full flex-col items-start rounded-[16px] border border-[#E6E6E6] bg-white px-4 py-6">
        {/* Header Titles */}
        <div className="text-md grid w-full grid-cols-2 font-bold text-black">
          <h3>Notify me:</h3>
          <h3>Notification Type</h3>
        </div>

        {/* Horizontal Rule */}
        <hr className="my-3 w-full border-t border-[#E6E6E6]" />

        {/* Two-Column Layout */}
        <div className="grid w-full grid-cols-2 gap-x-8 px-2 py-8">
          {/* Left Column - Interview Updates */}
          <div className="w-full">
            <div className="mt-2 space-y-4">
              {interviewUpdates.map((item, index) => (
                <label
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-[16px] text-[#8E8E8E]">
                    {getInterviewInvitationStateField(item)}
                  </span>
                  <ToggleSwitch
                    isOn={
                      interviewInvitation.option[
                        item as keyof InterviewInvitationState
                      ]
                    }
                    onToggle={() => handleInterviewInvitationToggle(item)}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Right Column - Notification Type */}
          <div className="w-full">
            <div className="mt-2 space-y-4">
              {notificationTypes.map((item, index) => (
                <label
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-[16px] text-[#8E8E8E]">
                    {getNotificationTypeStateField(item)}
                  </span>
                  <ToggleSwitch
                    isOn={
                      interviewInvitation.notificationType[
                        item as keyof NotificationType
                      ]
                    }
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
