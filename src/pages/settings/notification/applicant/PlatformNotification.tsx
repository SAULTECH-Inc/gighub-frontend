import { useCallback, useEffect } from "react";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  NotificationType,
  PlatformNotificationOption,
  PlatformNotifications,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";
import { debounce } from "lodash";
import { toast } from "react-toastify";

const PlatformNotification = () => {
  const { applicantSettings, platform, setPlatform, updatePlatform } =
    useSettingsStore();
  const notificationTypes = ["all", "emailNotification", "pushNotification"];
  const platformState = ["newProductOrUpdate", "maintenanceDowntime"];

  useEffect(() => {
    if (applicantSettings) {
      setPlatform(applicantSettings.notifications.options.platform);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantSettings]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce(async (settings: PlatformNotifications) => {
      const response = await updatePlatform(settings);
      if (response) {
        setPlatform(response);
      } else {
        toast.error(
          "Failed to update application status notification settings",
        );
      }
    }, 500),
    [platform],
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
      ...platform,
      notificationType: {
        ...platform.notificationType,
        [item]: !platform.notificationType[item as keyof NotificationType],
      },
    };
    setPlatform(updatedSettings);
    debouncedUpdate(updatedSettings);
  };

  const handlePlatformToggle = (item: string) => {
    const updatedSettings = {
      ...platform,
      option: {
        ...platform.option,
        [item]: !platform.option[item as keyof PlatformNotificationOption],
      },
    };
    setPlatform(updatedSettings);
    debouncedUpdate(updatedSettings);
  };
  return (
    <div className="flex w-[95%] flex-col self-center py-10 font-lato md:w-[90%]">
      <hr className="mb-4 w-full border-t border-[#E6E6E6]" />

      {/* Page Title */}
      <h2 className="text-left text-[24px] text-xl font-bold text-black">
        Platform Notification
      </h2>

      {/* White Box Container */}
      <div className="mt-4 flex min-h-[200px] w-full flex-col items-start rounded-[16px] border border-[#E6E6E6] bg-white px-4 py-6 md:px-8">
        {/* Header Titles */}
        <div className="text-md grid w-full grid-cols-2 font-bold text-black">
          <h3>Notify me about:</h3>
          <h3>Notification Type</h3>
        </div>

        {/* Horizontal Rule */}
        <hr className="my-3 w-full border-t border-[#E6E6E6]" />

        {/* Two-Column Layout */}
        <div className="grid w-full grid-cols-2 gap-x-8 px-2 py-8">
          {/* Left Column - Platform Notifications */}
          <div className="w-full">
            <div className="mt-2 space-y-4">
              {platformState.map((item, index) => (
                <label
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-[16px] text-[#8E8E8E]">
                    {getPlatformStateField(item)}
                  </span>
                  <ToggleSwitch
                    isOn={
                      platform.option[item as keyof PlatformNotificationOption]
                    }
                    onToggle={() => handlePlatformToggle(item)}
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
                      platform.notificationType[item as keyof NotificationType]
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

export default PlatformNotification;
