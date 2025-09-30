import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { RiFileList3Line, RiCheckboxCircleLine, RiCloseLine, RiCalendarEventLine, RiMailLine, RiNotification3Line, RiFileTextLine } from "react-icons/ri";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  ApplicationStatus,
  ApplicationStatusNotification,
  NotificationType,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";

interface OptionConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const JobApplicationUpdate = () => {
  const {
    applicantSettings,
    setApplicationStatusNotification,
    updateApplicationStatusNotification,
  } = useSettingsStore();

  // Get the actual data from applicantSettings instead of the separate state
  const actualApplicationStatusData = applicantSettings?.notifications?.options?.applicationStatus;

  const [isLoading, setIsLoading] = useState(false);

  // Configuration for application status options
  const applicationStatusOptions: OptionConfig[] = useMemo(() => [
    {
      key: "all",
      label: "All Updates",
      icon: RiFileList3Line,
      description: "Receive notifications for all application status changes",
    },
    {
      key: "submitted",
      label: "Application Submitted",
      icon: RiCheckboxCircleLine,
      description: "When your application is successfully submitted",
    },
    {
      key: "shortlisted",
      label: "Shortlisted",
      icon: RiCheckboxCircleLine,
      description: "When you've been shortlisted for a position",
    },
    {
      key: "rejected",
      label: "Application Rejected",
      icon: RiCloseLine,
      description: "When your application has been declined",
    },
    {
      key: "scheduledForInterview",
      label: "Interview Scheduled",
      icon: RiCalendarEventLine,
      description: "When an interview has been scheduled",
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
      description: "Receive updates via email",
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
    const applicationStatusData = applicantSettings?.notifications?.options?.applicationStatus;

    if (applicationStatusData && (!actualApplicationStatusData ||
      JSON.stringify(actualApplicationStatusData) !== JSON.stringify(applicationStatusData))) {
      setApplicationStatusNotification(applicationStatusData);
    }
  }, [applicantSettings, setApplicationStatusNotification, actualApplicationStatusData]);

  const debouncedUpdate = useCallback(
    debounce(async (settings: ApplicationStatusNotification) => {
      setIsLoading(true);
      try {
        const response = await updateApplicationStatusNotification(settings);
        if (response) {
          setApplicationStatusNotification(response);
          toast.success("Application status notification settings updated");
        } else {
          toast.error("Failed to update notification settings");
        }
      } catch (error) {
        toast.error("An error occurred while updating settings");
        console.error("Update error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [updateApplicationStatusNotification, setApplicationStatusNotification]
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleApplicationStatusToggle = useCallback((key: string) => {
    if (!actualApplicationStatusData) return;

    const updatedSettings = {
      ...actualApplicationStatusData,
      option: {
        ...actualApplicationStatusData.option,
        [key]: !actualApplicationStatusData.option[key as keyof ApplicationStatus],
      },
    };

    setApplicationStatusNotification(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [actualApplicationStatusData, setApplicationStatusNotification, debouncedUpdate]);

  const handleNotificationTypeToggle = useCallback((key: string) => {
    if (!actualApplicationStatusData) return;

    const updatedSettings = {
      ...actualApplicationStatusData,
      notificationType: {
        ...actualApplicationStatusData.notificationType,
        [key]: !actualApplicationStatusData.notificationType[key as keyof NotificationType],
      },
    };

    setApplicationStatusNotification(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [actualApplicationStatusData, setApplicationStatusNotification, debouncedUpdate]);

  if (!actualApplicationStatusData) {
    return (
      <div className="font-lato flex w-[95%] flex-col self-center py-10 md:w-[90%]">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="font-lato flex w-[95%] flex-col self-center py-10 md:w-[90%]">
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <RiFileTextLine className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Job Application Updates
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          Choose when and how you want to be notified about your job application status changes.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Application Status Events
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Select which status changes you want to be notified about
              </p>
            </div>
            <div className="md:text-right">
              <h3 className="font-semibold text-gray-900 text-lg">
                Notification Methods
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose how you want to receive notifications
              </p>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Application Status Options */}
            <div className="space-y-4">
              {applicationStatusOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = actualApplicationStatusData?.option?.[option.key as keyof ApplicationStatus] || false;

                return (
                  <div
                    key={option.key}
                    className={`
                      p-4 rounded-xl border transition-all duration-200
                      ${isActive
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`
                          p-2 rounded-lg transition-colors duration-200
                          ${isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}
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
                          onToggle={() => handleApplicationStatusToggle(option.key)}
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
                const isActive = actualApplicationStatusData?.notificationType?.[option.key as keyof NotificationType] || false;

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
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
              <span className="text-sm">Saving preferences...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobApplicationUpdate;
