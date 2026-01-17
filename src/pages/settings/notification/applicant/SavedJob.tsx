import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import {
  RiTimeLine,
  RiCloseLine,
  RiLockLine,
  RiRefreshLine,
  RiMailLine,
  RiNotification3Line,
  RiBookmarkLine,
} from "react-icons/ri";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  NotificationType,
  SavedJobNotification,
  SavedJobStates,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";

interface SavedJobConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const SavedJob = () => {
  const { applicantSettings, setSavedJob, updateSavedJob } = useSettingsStore();

  // Get the actual data from applicantSettings instead of the separate state
  const actualSavedJobData =
    applicantSettings?.notifications?.options?.savedJob;

  const [isLoading, setIsLoading] = useState(false);

  const savedJobOptions: SavedJobConfig[] = useMemo(
    () => [
      {
        key: "aboutToExpire",
        label: "Job About to Expire",
        icon: RiTimeLine,
        description: "When a saved job is approaching its application deadline",
      },
      {
        key: "expired",
        label: "Job Expired",
        icon: RiCloseLine,
        description: "When a saved job has passed its application deadline",
      },
      {
        key: "closed",
        label: "Job Closed",
        icon: RiLockLine,
        description: "When a saved job has been closed by the employer",
      },
      {
        key: "updatedByEmployer",
        label: "Job Updated",
        icon: RiRefreshLine,
        description: "When an employer updates the details of a saved job",
      },
    ],
    [],
  );

  const notificationTypeOptions = useMemo(
    () => [
      {
        key: "all",
        label: "All Notifications",
        description: "Enable all notification methods",
        icon: RiNotification3Line,
      },
      {
        key: "emailNotification",
        label: "Email Notifications",
        description: "Receive saved job updates via email",
        icon: RiMailLine,
      },
      {
        key: "pushNotification",
        label: "Push Notifications",
        description: "Receive browser/app push notifications",
        icon: RiNotification3Line,
      },
    ],
    [],
  );

  // Initialize state from backend data
  useEffect(() => {
    const savedJobData = applicantSettings?.notifications?.options?.savedJob;

    if (
      savedJobData &&
      (!actualSavedJobData ||
        JSON.stringify(actualSavedJobData) !== JSON.stringify(savedJobData))
    ) {
      setSavedJob(savedJobData);
    }
  }, [applicantSettings, setSavedJob, actualSavedJobData]);

  const debouncedUpdate = useCallback(
    debounce(async (settings: SavedJobNotification) => {
      setIsLoading(true);
      try {
        const response = await updateSavedJob(settings);
        if (response) {
          setSavedJob(response);
          toast.success("Saved job notification settings updated");
        } else {
          toast.error("Failed to update saved job notification settings");
        }
      } catch (error) {
        toast.error("An error occurred while updating settings");
        console.error("Update error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [updateSavedJob, setSavedJob],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleSavedJobToggle = useCallback(
    (key: string) => {
      if (!actualSavedJobData) return;

      const updatedSettings = {
        ...actualSavedJobData,
        option: {
          ...actualSavedJobData.option,
          [key]: !actualSavedJobData.option[key as keyof SavedJobStates],
        },
      };
      setSavedJob(updatedSettings);
      debouncedUpdate(updatedSettings);
    },
    [actualSavedJobData, setSavedJob, debouncedUpdate],
  );

  const handleNotificationTypeToggle = useCallback(
    (key: string) => {
      if (!actualSavedJobData) return;

      const updatedSettings = {
        ...actualSavedJobData,
        notificationType: {
          ...actualSavedJobData.notificationType,
          [key]:
            !actualSavedJobData.notificationType[key as keyof NotificationType],
        },
      };
      setSavedJob(updatedSettings);
      debouncedUpdate(updatedSettings);
    },
    [actualSavedJobData, setSavedJob, debouncedUpdate],
  );

  if (!actualSavedJobData) {
    return (
      <div className="font-lato flex w-[95%] flex-col self-center py-10 md:w-[90%]">
        <div className="animate-pulse">
          <div className="mb-4 h-px bg-gray-200"></div>
          <div className="mb-4 h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="h-64 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="font-lato flex w-[95%] flex-col self-center py-10 md:w-[90%]">
      {/* Section Divider */}
      <hr className="mb-8 border-gray-200" />

      {/* Section Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center space-x-3">
          <div className="rounded-lg bg-orange-100 p-2">
            <RiBookmarkLine className="h-6 w-6 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Saved Jobs Alerts
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Stay updated on the status of your saved jobs with timely alerts about
          deadlines and changes.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Saved Job Events
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Choose which saved job events you want to be notified about
              </p>
            </div>
            <div className="md:text-right">
              <h3 className="text-lg font-semibold text-gray-900">
                Notification Methods
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Select how you want to receive notifications
              </p>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column - Saved Job Options */}
            <div className="space-y-4">
              {savedJobOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive =
                  actualSavedJobData?.option?.[
                    option.key as keyof SavedJobStates
                  ] || false;

                return (
                  <div
                    key={option.key}
                    className={`rounded-xl border p-4 transition-all duration-200 ${
                      isActive
                        ? "border-orange-200 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    } `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-1 items-start space-x-3">
                        <div
                          className={`rounded-lg p-2 transition-colors duration-200 ${isActive ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"} `}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <label className="block cursor-pointer font-medium text-gray-900">
                            {option.label}
                          </label>
                          <p className="mt-1 text-sm text-gray-600">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4">
                        <ToggleSwitch
                          isOn={isActive}
                          onToggle={() => handleSavedJobToggle(option.key)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column - Notification Types */}
            <div className="space-y-4">
              {notificationTypeOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive =
                  actualSavedJobData?.notificationType?.[
                    option.key as keyof NotificationType
                  ] || false;

                return (
                  <div
                    key={option.key}
                    className={`rounded-xl border p-4 transition-all duration-200 ${
                      isActive
                        ? "border-purple-200 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    } `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-1 items-start space-x-3">
                        <div
                          className={`rounded-lg p-2 transition-colors duration-200 ${isActive ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"} `}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <label className="block cursor-pointer font-medium text-gray-900">
                            {option.label}
                          </label>
                          <p className="mt-1 text-sm text-gray-600">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4">
                        <ToggleSwitch
                          isOn={isActive}
                          onToggle={() =>
                            handleNotificationTypeToggle(option.key)
                          }
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="px-6 pb-4">
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
              <span className="text-sm">Saving preferences...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SavedJob;
