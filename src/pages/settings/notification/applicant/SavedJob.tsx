import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { RiTimeLine, RiCloseLine, RiLockLine, RiRefreshLine, RiMailLine, RiNotification3Line, RiBookmarkLine } from "react-icons/ri";
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
  const {
    applicantSettings,
    savedJob,
    setSavedJob,
    updateSavedJob
  } = useSettingsStore();

  const [isLoading, setIsLoading] = useState(false);

  const savedJobOptions: SavedJobConfig[] = useMemo(() => [
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
  ], []);

  const notificationTypeOptions = useMemo(() => [
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
  ], []);

  useEffect(() => {
    if (applicantSettings?.notifications?.options?.savedJob) {
      setSavedJob(applicantSettings.notifications.options.savedJob);
    }
  }, [applicantSettings, setSavedJob]);

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
      [updateSavedJob, setSavedJob]
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleSavedJobToggle = useCallback((key: string) => {
    if (!savedJob) return;

    const updatedSettings = {
      ...savedJob,
      option: {
        ...savedJob.option,
        [key]: !savedJob.option[key as keyof SavedJobStates],
      },
    };
    setSavedJob(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [savedJob, setSavedJob, debouncedUpdate]);

  const handleNotificationTypeToggle = useCallback((key: string) => {
    if (!savedJob) return;

    const updatedSettings = {
      ...savedJob,
      notificationType: {
        ...savedJob.notificationType,
        [key]: !savedJob.notificationType[key as keyof NotificationType],
      },
    };
    setSavedJob(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [savedJob, setSavedJob, debouncedUpdate]);

  if (!savedJob) {
    return (
        <div className="font-lato flex w-[95%] flex-col self-center py-10 md:w-[90%]">
          <div className="animate-pulse">
            <div className="h-px bg-gray-200 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
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
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <RiBookmarkLine className="h-6 w-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Saved Jobs Alerts
            </h2>
          </div>
          <p className="text-gray-600 text-sm">
            Stay updated on the status of your saved jobs with timely alerts about deadlines and changes.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  Saved Job Events
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Choose which saved job events you want to be notified about
                </p>
              </div>
              <div className="md:text-right">
                <h3 className="font-semibold text-gray-900 text-lg">
                  Notification Methods
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Select how you want to receive notifications
                </p>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Saved Job Options */}
              <div className="space-y-4">
                {savedJobOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isActive = savedJob.option[option.key as keyof SavedJobStates];

                  return (
                      <div
                          key={option.key}
                          className={`
                      p-4 rounded-xl border transition-all duration-200
                      ${isActive
                              ? 'border-orange-200 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                    `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`
                          p-2 rounded-lg transition-colors duration-200
                          ${isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}
                        `}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <label className="block font-medium text-gray-900 cursor-pointer">
                                {option.label}
                              </label>
                              <p className="text-sm text-gray-600 mt-1">
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
                  const isActive = savedJob.notificationType[option.key as keyof NotificationType];

                  return (
                      <div
                          key={option.key}
                          className={`
                      p-4 rounded-xl border transition-all duration-200
                      ${isActive
                              ? 'border-purple-200 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                    `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`
                          p-2 rounded-lg transition-colors duration-200
                          ${isActive ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}
                        `}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <label className="block font-medium text-gray-900 cursor-pointer">
                                {option.label}
                              </label>
                              <p className="text-sm text-gray-600 mt-1">
                                {option.description}
                              </p>
                            </div>
                          </div>
                          <div className="ml-4">
                            <ToggleSwitch
                                isOn={isActive}
                                onToggle={() => handleNotificationTypeToggle(option.key)}
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
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                  <span className="text-sm">Saving preferences...</span>
                </div>
              </div>
          )}
        </div>
      </section>
  );
};

export default SavedJob;