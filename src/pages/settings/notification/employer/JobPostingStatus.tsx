import {
  JobPostingStatusNotification,
  JobPostingStatusNotificationOptions,
  NotificationType,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";
import { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";

const JobPostingStatus = () => {
  const {
    employerSettings,
    jobPostingStatus,
    setJobPostingStatus,
    updateJobPostingStatus,
  } = useSettingsStore();
  useEffect(() => {
    if (employerSettings) {
      setJobPostingStatus(
        employerSettings?.notifications?.options?.jobPostingStatus,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employerSettings]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce(async (settings: JobPostingStatusNotification) => {
      const response = await updateJobPostingStatus(settings);
      if (response) {
        setJobPostingStatus(response);
      }
    }, 500),
    [jobPostingStatus],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel(); // prevent memory leak
    };
  }, [debouncedUpdate]);

  // Define application updates options
  const applicationUpdates = [
    "draftSaved",
    "jobUpdated",
    "jobPublished",
    "jobFailed",
    "jobExpired",
    "jobDeleted",
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
      ...jobPostingStatus,
      notificationType: {
        ...jobPostingStatus.notificationType,
        [item]:
          !jobPostingStatus.notificationType[item as keyof NotificationType],
      },
    };
    setJobPostingStatus(updatedSettings);
    debouncedUpdate(updatedSettings);
  };

  // Helper function to get the field name dynamically
  const getApplicationUpdateStateField = (item: string) => {
    switch (item) {
      case "draftSaved":
        return "Job Posting draft is saved";
      case "jobUpdated":
        return "When job is updated";
      case "jobPublished":
        return "When job is published";
      case "jobFailed":
        return "When job fails";
      case "jobExpired":
        return "When job expires";
      default:
        return "When job is deleted";
    }
  };

  // Function to get the application update state
  const handleApplicationUpdateToggle = (item: string) => {
    const updatedSettings = {
      ...jobPostingStatus,
      option: {
        ...jobPostingStatus.option,
        [item]:
          !jobPostingStatus.option[
            item as keyof JobPostingStatusNotificationOptions
          ],
      },
    };
    setJobPostingStatus(updatedSettings);
    debouncedUpdate(updatedSettings);
  };

  return (
    <div className="flex w-[90%] flex-col self-center py-10">
      {/* Title */}
      <h2 className="text-left text-[24px] text-xl font-bold text-black">
        Job Posting Status
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
                    jobPostingStatus?.option[
                      item as keyof JobPostingStatusNotificationOptions
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
                    jobPostingStatus?.notificationType[
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

export default JobPostingStatus;
