import {
  ManageJobApplicationsNotifications,
  ManageJobNotificationState,
  NotificationType,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";
import { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";

const ManageJobNotification = () => {
  const {
    employerSettings,
    manageJobApplications,
    setManageJobApplications,
    updateManageJobApplications,
  } = useSettingsStore();
  useEffect(() => {
    if (employerSettings) {
      setManageJobApplications(
        employerSettings?.notifications?.options?.manageJobApplications,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employerSettings]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce(async (settings: ManageJobApplicationsNotifications) => {
      const response = await updateManageJobApplications(settings);
      if (response) {
        setManageJobApplications(response);
      } else {
        toast.error(
          "Failed to update application status notification settings",
        );
      }
    }, 500),
    [manageJobApplications],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel(); // prevent memory leak
    };
  }, [debouncedUpdate]);

  // Define application updates options
  const applicationUpdates = [
    "applicantApplies",
    "applicationStatusUpdated",
    "interviewScheduled",
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
      ...manageJobApplications,
      notificationType: {
        ...manageJobApplications.notificationType,
        [item]:
          !manageJobApplications.notificationType[
            item as keyof NotificationType
          ],
      },
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
        [item]:
          !manageJobApplications.option[
            item as keyof ManageJobNotificationState
          ],
      },
    };
    setManageJobApplications(updatedSettings);
    debouncedUpdate(updatedSettings);
  };

  return (
    <div className="font-lato flex w-[90%] flex-col self-center py-10">
      {/* Title */}
      <h2 className="text-left text-xl text-[24px] font-bold text-black">
        Manage Job Application
      </h2>

      {/* Privacy Box */}
      <div className="mt-4 flex min-h-[265px] w-full flex-col items-start rounded-[16px] border border-[#E6E6E6] bg-white px-8 py-6">
        {/* Two Column Headings */}
        <div className="grid w-full grid-cols-2">
          <h3 className="text-md font-bold text-black">Notify me when:</h3>
          <h3 className="text-md text-right font-bold text-black">
            Notification Type
          </h3>
        </div>

        {/* Horizontal Rule */}
        <hr className="my-3 w-full border-t border-[#E6E6E6]" />

        {/* Two-Column Layout */}
        <div className="grid w-full grid-cols-2 gap-x-8 p-8">
          {/* Left Column - Application Status */}
          <div className="w-full space-y-4">
            {applicationUpdates.map((item, index) => (
              <label key={index} className="flex items-center justify-between">
                <span className="text-[16px] font-bold text-[#8E8E8E]">
                  {getApplicationUpdateStateField(item)}
                </span>
                <ToggleSwitch
                  isOn={
                    manageJobApplications?.option[
                      item as keyof ManageJobNotificationState
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
                    manageJobApplications?.notificationType[
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

export default ManageJobNotification;
