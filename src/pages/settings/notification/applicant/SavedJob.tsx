import { useCallback, useEffect } from "react";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  NotificationType,
  SavedJobNotification,
  SavedJobStates,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";
import { debounce } from "lodash";
import { toast } from "react-toastify";

const SavedJobsAlert = () => {
  // State to track toggle status for each item
  const { applicantSettings, savedJob, setSavedJob, updateSavedJob } =
    useSettingsStore();
  const notificationTypes = ["all", "emailNotification", "pushNotification"];
  const savedJobsState = [
    "aboutToExpire",
    "expired",
    "closed",
    "updatedByEmployer",
  ];

  useEffect(() => {
    if (applicantSettings) {
      setSavedJob(applicantSettings.notifications.options.savedJob);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantSettings]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce(async (settings: SavedJobNotification) => {
      const response = await updateSavedJob(settings);
      if (response) {
        setSavedJob(response);
      } else {
        toast.error(
          "Failed to update application status notification settings",
        );
      }
    }, 500),
    [savedJob],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel(); // prevent memory leak
    };
  }, [debouncedUpdate]);

  const getSavedJobStateField = (item: string) => {
    switch (item) {
      case "aboutToExpire":
        return "A saved job is about to expire";
      case "expired":
        return "A saved job has expired";
      case "closed":
        return "A saved job has been closed";
      default:
        return "Updated by employer";
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
      ...savedJob,
      notificationType: {
        ...savedJob.notificationType,
        [item]: !savedJob.notificationType[item as keyof NotificationType],
      },
    };
    setSavedJob(updatedSettings);
    debouncedUpdate(updatedSettings);
  };

  const handleSavedJobsToggle = (item: string) => {
    const updatedSettings = {
      ...savedJob,
      option: {
        ...savedJob.option,
        [item]: !savedJob.option[item as keyof SavedJobStates],
      },
    };
    setSavedJob(updatedSettings);
    debouncedUpdate(updatedSettings);
  };

  return (
    <div className="font-lato flex w-[95%] flex-col self-center py-10 md:w-[90%]">
      <hr className="mb-4 w-full border-t border-[#E6E6E6]" />

      {/* Page Title */}
      <h2 className="text-left text-xl text-[24px] font-bold text-black">
        Saved Jobs Alert
      </h2>

      {/* White Box Container */}
      <div className="mt-4 flex min-h-[200px] w-full flex-col items-start rounded-[16px] border border-[#E6E6E6] bg-white px-4 py-6 md:px-8">
        {/* Header Titles */}
        <div className="text-md grid w-full grid-cols-2 font-bold text-black">
          <h3>Notify me when:</h3>
          <h3>Notification Type</h3>
        </div>

        {/* Horizontal Rule */}
        <hr className="my-3 w-full border-t border-[#E6E6E6]" />

        {/* Two-Column Layout */}
        <div className="grid w-full grid-cols-2 gap-x-8 px-2 py-8">
          {/* Left Column - Saved Jobs Alerts */}
          <div className="w-full">
            <div className="mt-2 space-y-4">
              {savedJobsState.map((item, index) => (
                <label
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-[16px] text-[#8E8E8E]">
                    {getSavedJobStateField(item)}
                  </span>
                  <ToggleSwitch
                    isOn={savedJob.option[item as keyof SavedJobStates]}
                    onToggle={() => handleSavedJobsToggle(item)}
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
                      savedJob.notificationType[item as keyof NotificationType]
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

export default SavedJobsAlert;
