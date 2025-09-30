import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { RiStarLine, RiToolsLine, RiMailLine, RiNotification3Line, RiGlobalLine } from "react-icons/ri";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  NotificationType,
  PlatformNotificationOption,
  PlatformNotifications,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";
import { USER_TYPE } from "../../../../utils/helpers.ts";
import { UserType } from "../../../../utils/enums.ts";

interface PlatformConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const PlatformNotification = () => {
  const {
    applicantSettings,
    employerSettings,
    setPlatform,
    updatePlatform
  } = useSettingsStore();

  // Get the actual data from applicantSettings/employerSettings based on user type
  const actualPlatformData = USER_TYPE === UserType.APPLICANT
    ? applicantSettings?.notifications?.options?.platform
    : employerSettings?.notifications?.options?.platform;

  const [isLoading, setIsLoading] = useState(false);

  const platformOptions: PlatformConfig[] = useMemo(() => [
    {
      key: "newProductOrUpdate",
      label: "New Features & Updates",
      icon: RiStarLine,
      description: "When we release new features or platform improvements",
    },
    {
      key: "maintenanceDowntime",
      label: "Maintenance & Downtime",
      icon: RiToolsLine,
      description: "Scheduled maintenance, downtime, or service interruptions",
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
      description: "Receive platform updates via email",
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
    const platformData = USER_TYPE === UserType.APPLICANT
      ? applicantSettings?.notifications?.options?.platform
      : employerSettings?.notifications?.options?.platform;

    if (platformData && (!actualPlatformData ||
      JSON.stringify(actualPlatformData) !== JSON.stringify(platformData))) {
      setPlatform(platformData);
    }
  }, [applicantSettings, employerSettings, setPlatform, actualPlatformData]);

  const debouncedUpdate = useCallback(
    debounce(async (settings: PlatformNotifications) => {
      setIsLoading(true);
      try {
        const response = await updatePlatform(settings);
        if (response) {
          setPlatform(response);
          toast.success("Platform notification settings updated");
        } else {
          toast.error("Failed to update platform notification settings");
        }
      } catch (error) {
        toast.error("An error occurred while updating settings");
        console.error("Update error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [updatePlatform, setPlatform]
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handlePlatformToggle = useCallback((key: string) => {
    if (!actualPlatformData) return;

    const updatedSettings = {
      ...actualPlatformData,
      option: {
        ...actualPlatformData.option,
        [key]: !actualPlatformData.option[key as keyof PlatformNotificationOption],
      },
    };
    setPlatform(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [actualPlatformData, setPlatform, debouncedUpdate]);

  const handleNotificationTypeToggle = useCallback((key: string) => {
    if (!actualPlatformData) return;

    const updatedSettings = {
      ...actualPlatformData,
      notificationType: {
        ...actualPlatformData.notificationType,
        [key]: !actualPlatformData.notificationType[key as keyof NotificationType],
      },
    };
    setPlatform(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [actualPlatformData, setPlatform, debouncedUpdate]);

  if (!actualPlatformData) {
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
          <div className="p-2 bg-slate-100 rounded-lg">
            <RiGlobalLine className="h-6 w-6 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Platform Notifications
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          Stay informed about important platform updates, new features, and scheduled maintenance.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Platform Updates
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose which platform events you want to be notified about
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
            {/* Left Column - Platform Options */}
            <div className="space-y-4">
              {platformOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = actualPlatformData?.option?.[option.key as keyof PlatformNotificationOption] || false;

                return (
                  <div
                    key={option.key}
                    className={`
                      p-4 rounded-xl border transition-all duration-200
                      ${isActive
                      ? 'border-slate-200 bg-slate-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`
                          p-2 rounded-lg transition-colors duration-200
                          ${isActive ? 'bg-slate-100 text-slate-600' : 'bg-gray-100 text-gray-500'}
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
                          onToggle={() => handlePlatformToggle(option.key)}
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
                const isActive = actualPlatformData?.notificationType?.[option.key as keyof NotificationType] || false;

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
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-500 border-t-transparent"></div>
              <span className="text-sm">Saving preferences...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlatformNotification;
