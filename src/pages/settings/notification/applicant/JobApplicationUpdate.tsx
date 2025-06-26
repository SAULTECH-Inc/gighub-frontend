import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  ApplicationStatus,
  ApplicationStatusNotification,
  NotificationType,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { useCallback, useEffect } from "react";

const JobApplicationUpdate = () => {
  const {
    applicationStatusNotification,
    applicantSettings,
    setApplicationStatusNotification,
    updateApplicationStatusNotification,
  } = useSettingsStore();
  useEffect(() => {
    if (applicantSettings) {
      setApplicationStatusNotification(
        applicantSettings?.notifications?.options?.applicationStatus,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantSettings]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce(async (settings: ApplicationStatusNotification) => {
      const response = await updateApplicationStatusNotification(settings);
      if (response) {
        setApplicationStatusNotification(response);
      } else {
        toast.error(
          "Failed to update application status notification settings",
        );
      }
    }, 500),
    [applicationStatusNotification],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel(); // prevent memory leak
    };
  }, [debouncedUpdate]);

  // Define application updates options
  const applicationUpdates = [
    "all",
    "submitted",
    "shortlisted",
    "rejected",
    "scheduledForInterview",
  ];

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
  };

  const handleToggle = (item: string) => {
    const updatedSettings = {
      ...applicationStatusNotification,
      notificationType: {
        ...applicationStatusNotification.notificationType,
        [item]:
          !applicationStatusNotification.notificationType[
            item as keyof NotificationType
          ],
      },
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
        [item]:
          !applicationStatusNotification.option[
            item as keyof ApplicationStatus
          ],
      },
    };
    setApplicationStatusNotification(updatedSettings);
    debouncedUpdate(updatedSettings);
  };

  return (
    <div className="font-lato flex w-[95%] flex-col self-center py-10 md:w-[90%]">
      {/* Title */}
      <h2 className="text-left text-xl text-[24px] font-bold text-black">
        Job Application Update
      </h2>

      {/* Privacy Box */}
      <div className="mt-4 flex min-h-[265px] w-full flex-col items-start rounded-[16px] border border-[#E6E6E6] bg-white px-4 py-6 md:px-8">
        {/* Two Column Headings */}
        <div className="grid w-full grid-cols-2">
          <h3 className="text-md font-bold text-black">
            Receive Update on Application Status
          </h3>
          <h3 className="text-md text-right font-bold text-black">
            Notification Type
          </h3>
        </div>

        {/* Horizontal Rule */}
        <hr className="my-3 w-full border-t border-[#E6E6E6]" />

        {/* Two-Column Layout */}
        <div className="grid w-full grid-cols-2 gap-x-8 px-2 py-8">
          {/* Left Column - Application Status */}
          <div className="w-full space-y-4">
            {applicationUpdates.map((item, index) => (
              <label key={index} className="flex items-center justify-between">
                <span className="text-[16px] font-bold text-[#8E8E8E]">
                  {getApplicationUpdateStateField(item)}
                </span>
                <ToggleSwitch
                  isOn={
                    applicationStatusNotification?.option[
                      item as keyof ApplicationStatus
                    ]
                  }
                  onToggle={() => handleApplicationUpdateToggle(item)}
                />
              </label>
            ))}
          </div>

          {/* Right Column - Notification Type */}
          <div className="w-full space-y-4">
            {notificationTypes.map((item, index) => (
              <label key={index} className="flex items-center justify-between">
                <span className="text-[16px] font-bold text-[#8E8E8E]">
                  {getNotificationTypeStateField(item)}
                </span>
                <ToggleSwitch
                  isOn={
                    applicationStatusNotification?.notificationType[
                      item as keyof NotificationType
                    ]
                  }
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
