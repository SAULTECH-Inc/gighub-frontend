import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import { useCallback, useEffect } from "react";
import {
  JobRecommendations,
  JobRecommendationsNotification,
  NotificationFrequency,
  NotificationType,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";
import { debounce } from "lodash";
import { toast } from "react-toastify";

const JobRecommendation = () => {
  // State to track toggle status for each item
  const {
    applicantSettings,
    jobRecommendations,
    setJobRecommendationsNotification,
    updateJobRecommendationsNotification,
  } = useSettingsStore();
  const frequency = ["instance", "daily", "weekly"];
  const notificationTypes = ["all", "emailNotification", "pushNotification"];
  const jobRecommendation = [
    "profilePreferences",
    "savedJobSearch",
    "jobMatchFound",
  ];

  useEffect(() => {
    if (applicantSettings) {
      setJobRecommendationsNotification(
        applicantSettings.notifications.options.jobRecommendations,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantSettings]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce(async (settings: JobRecommendationsNotification) => {
      const response = await updateJobRecommendationsNotification(settings);
      if (response) {
        setJobRecommendationsNotification(response);
      } else {
        toast.error(
          "Failed to update application status notification settings",
        );
      }
    }, 500),
    [jobRecommendations],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel(); // prevent memory leak
    };
  }, [debouncedUpdate]);

  const getJobRecommendationStateField = (item: string) => {
    switch (item) {
      case "profilePreferences":
        return "Profile Preferences";
      case "savedJobSearch":
        return "Saved Job Search";
      case "jobMatchFound":
        return "Job Match Found";
      default:
        return "All";
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

  const getFrequencyField = (item: string) => {
    switch (item.toLowerCase()) {
      case "instant":
        return "Instant";
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      default:
        return "Monthly";
    }
  };
  const handleFrequencyToggle = (item: string) => {
    const updatedSettings = {
      ...jobRecommendations,
      frequency: {
        ...jobRecommendations.frequency,
        [item]:
          !jobRecommendations.frequency[item as keyof NotificationFrequency],
      },
    };
    setJobRecommendationsNotification(updatedSettings);
    debouncedUpdate(updatedSettings);
  };
  const handleNotificationTypeToggle = (item: string) => {
    const updatedSettings = {
      ...jobRecommendations,
      notificationType: {
        ...jobRecommendations.notificationType,
        [item]:
          !jobRecommendations.notificationType[item as keyof NotificationType],
      },
    };
    setJobRecommendationsNotification(updatedSettings);
    debouncedUpdate(updatedSettings);
  };

  const handleJobRecommendationToggle = (item: string) => {
    const updatedSettings = {
      ...jobRecommendations,
      option: {
        ...jobRecommendations.option,
        [item]: !jobRecommendations.option[item as keyof JobRecommendations],
      },
    };
    setJobRecommendationsNotification(updatedSettings);
    debouncedUpdate(updatedSettings);
  };

  return (
    <div className="flex w-[95%] flex-col self-center font-lato md:w-[90%]">
      <hr className="mb-4 w-full border-t border-[#E6E6E6]" />

      {/* Page Title */}
      <h2 className="text-left text-[24px] text-xl font-bold text-black">
        Job Recommendation
      </h2>

      {/* White Box Container */}
      <div className="mt-4 flex min-h-[265px] w-full flex-col items-start rounded-[16px] border border-[#E6E6E6] bg-white px-4 py-6 md:px-8">
        {/* Header Titles */}
        <div className="text-md grid w-full grid-cols-2 font-bold text-black">
          <h3>Notify me about recommended jobs based on</h3>
          <h3>Frequency</h3>
        </div>

        {/* Horizontal Rule */}
        <hr className="my-3 w-full border-t border-[#E6E6E6]" />

        {/* Two-Column Layout */}
        <div className="grid w-full grid-cols-2 items-start gap-x-8 px-2 py-8">
          {/* Left Column - Job Preferences */}
          <div className="w-full">
            <div className="mt-2 space-y-4">
              {jobRecommendation.map((item, index) => (
                <label
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-[16px] text-[#8E8E8E]">
                    {getJobRecommendationStateField(item)}
                  </span>
                  <ToggleSwitch
                    isOn={
                      jobRecommendations.option[
                        item as keyof JobRecommendations
                      ]
                    }
                    onToggle={() => handleJobRecommendationToggle(item)}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Right Column - Frequency */}
          <div className="w-full">
            <div className="mt-2 space-y-4">
              {frequency.map((item, index) => (
                <label
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-[16px] text-[#8E8E8E]">
                    {getFrequencyField(item)}
                  </span>
                  <ToggleSwitch
                    isOn={
                      jobRecommendations.frequency[
                        item as keyof NotificationFrequency
                      ]
                    }
                    onToggle={() => handleFrequencyToggle(item)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Notification Type */}
        <hr className="my-5 w-full border-t border-[#E6E6E6]" />
        <h3 className="text-md font-bold text-black">Notification Type</h3>

        <div className="mt-4 w-full gap-x-8 space-y-4 p-8">
          {notificationTypes.map((item, index) => (
            <label key={index} className="flex items-center justify-between">
              <span className="text-[16px] text-[#8E8E8E]">
                {getNotificationTypeStateField(item)}
              </span>
              <ToggleSwitch
                isOn={
                  jobRecommendations.notificationType[
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
  );
};

export default JobRecommendation;
