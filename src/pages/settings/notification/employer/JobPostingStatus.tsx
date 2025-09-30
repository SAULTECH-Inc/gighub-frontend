import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { RiDraftLine, RiRefreshLine, RiCheckboxCircleLine, RiErrorWarningLine, RiTimeLine, RiDeleteBinLine, RiMailLine, RiNotification3Line, RiArticleLine } from "react-icons/ri";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  JobPostingStatusNotification,
  JobPostingStatusNotificationOptions,
  NotificationType,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";

interface JobPostingConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const JobPostingStatus = () => {
  const {
    employerSettings,
    setJobPostingStatus,
    updateJobPostingStatus,
  } = useSettingsStore();

  // Get the actual data from employerSettings instead of the separate state
  const actualJobPostingStatusData = employerSettings?.notifications?.options?.jobPostingStatus;

  const [isLoading, setIsLoading] = useState(false);

  const jobPostingOptions: JobPostingConfig[] = useMemo(() => [
    {
      key: "draftSaved",
      label: "Draft Saved",
      icon: RiDraftLine,
      description: "When a job posting draft is saved for later completion",
    },
    {
      key: "jobUpdated",
      label: "Job Updated",
      icon: RiRefreshLine,
      description: "When details of an existing job posting are modified",
    },
    {
      key: "jobPublished",
      label: "Job Published",
      icon: RiCheckboxCircleLine,
      description: "When a job posting is successfully published and live",
    },
    {
      key: "jobFailed",
      label: "Publication Failed",
      icon: RiErrorWarningLine,
      description: "When a job posting fails to publish due to an error",
    },
    {
      key: "jobExpired",
      label: "Job Expired",
      icon: RiTimeLine,
      description: "When a job posting reaches its expiration date",
    },
    {
      key: "jobDeleted",
      label: "Job Deleted",
      icon: RiDeleteBinLine,
      description: "When a job posting is permanently removed",
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
      description: "Receive job posting updates via email",
      icon: RiMailLine,
    },
    {
      key: "pushNotification",
      label: "Push Notifications",
      description: "Receive browser/app push notifications",
      icon: RiNotification3Line,
    },
  ], []);

  // Initialize state from backend data
  useEffect(() => {
    const jobPostingStatusData = employerSettings?.notifications?.options?.jobPostingStatus;

    if (jobPostingStatusData && (!actualJobPostingStatusData ||
      JSON.stringify(actualJobPostingStatusData) !== JSON.stringify(jobPostingStatusData))) {
      setJobPostingStatus(jobPostingStatusData);
    }
  }, [employerSettings, setJobPostingStatus, actualJobPostingStatusData]);

  const debouncedUpdate = useCallback(
    debounce(async (settings: JobPostingStatusNotification) => {
      setIsLoading(true);
      try {
        const response = await updateJobPostingStatus(settings);
        if (response) {
          setJobPostingStatus(response);
          toast.success("Job posting notification settings updated");
        } else {
          toast.error("Failed to update job posting notification settings");
        }
      } catch (error) {
        toast.error("An error occurred while updating settings");
        console.error("Update error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [updateJobPostingStatus, setJobPostingStatus]
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleJobPostingToggle = useCallback((key: string) => {
    if (!actualJobPostingStatusData) return;

    const updatedSettings = {
      ...actualJobPostingStatusData,
      option: {
        ...actualJobPostingStatusData.option,
        [key]: !actualJobPostingStatusData.option[key as keyof JobPostingStatusNotificationOptions],
      },
    };
    setJobPostingStatus(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [actualJobPostingStatusData, setJobPostingStatus, debouncedUpdate]);

  const handleNotificationTypeToggle = useCallback((key: string) => {
    if (!actualJobPostingStatusData) return;

    const updatedSettings = {
      ...actualJobPostingStatusData,
      notificationType: {
        ...actualJobPostingStatusData.notificationType,
        [key]: !actualJobPostingStatusData.notificationType[key as keyof NotificationType],
      },
    };
    setJobPostingStatus(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [actualJobPostingStatusData, setJobPostingStatus, debouncedUpdate]);

  if (!actualJobPostingStatusData) {
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
          <div className="p-2 bg-amber-100 rounded-lg">
            <RiArticleLine className="h-6 w-6 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Job Posting Status
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          Track the lifecycle of your job postings from draft to publication and beyond.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Job Posting Events
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose which job posting events you want to be notified about
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
            {/* Left Column - Job Posting Options */}
            <div className="space-y-4">
              {jobPostingOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = actualJobPostingStatusData?.option?.[option.key as keyof JobPostingStatusNotificationOptions] || false;

                return (
                  <div
                    key={option.key}
                    className={`
                      p-4 rounded-xl border transition-all duration-200
                      ${isActive
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`
                          p-2 rounded-lg transition-colors duration-200
                          ${isActive ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}
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
                          onToggle={() => handleJobPostingToggle(option.key)}
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
                const isActive = actualJobPostingStatusData?.notificationType?.[option.key as keyof NotificationType] || false;

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
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent"></div>
              <span className="text-sm">Saving preferences...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobPostingStatus;
