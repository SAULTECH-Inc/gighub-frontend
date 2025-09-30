import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { RiUserAddLine, RiRefreshLine, RiCalendarEventLine, RiMailLine, RiNotification3Line, RiFolderUserLine } from "react-icons/ri";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  ManageJobApplicationsNotifications,
  ManageJobNotificationState,
  NotificationType,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";

interface ManageJobConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const ManageJobNotification = () => {
  const {
    employerSettings,
    setManageJobApplications,
    updateManageJobApplications,
  } = useSettingsStore();

  // Get the actual data from employerSettings instead of the separate state
  const actualManageJobApplicationsData = employerSettings?.notifications?.options?.manageJobApplications;

  const [isLoading, setIsLoading] = useState(false);

  const manageJobOptions: ManageJobConfig[] = useMemo(() => [
    {
      key: "applicantApplies",
      label: "New Applications",
      icon: RiUserAddLine,
      description: "When a candidate applies to one of your job postings",
    },
    {
      key: "applicationStatusUpdated",
      label: "Application Status Updates",
      icon: RiRefreshLine,
      description: "When an applicant's application status is changed",
    },
    {
      key: "interviewScheduled",
      label: "Interview Scheduling",
      icon: RiCalendarEventLine,
      description: "When interviews are scheduled with applicants",
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
      description: "Receive application updates via email",
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
    const manageJobApplicationsData = employerSettings?.notifications?.options?.manageJobApplications;

    if (manageJobApplicationsData && (!actualManageJobApplicationsData ||
      JSON.stringify(actualManageJobApplicationsData) !== JSON.stringify(manageJobApplicationsData))) {
      setManageJobApplications(manageJobApplicationsData);
    }
  }, [employerSettings, setManageJobApplications, actualManageJobApplicationsData]);

  const debouncedUpdate = useCallback(
    debounce(async (settings: ManageJobApplicationsNotifications) => {
      setIsLoading(true);
      try {
        const response = await updateManageJobApplications(settings);
        if (response) {
          setManageJobApplications(response);
          toast.success("Job application management settings updated");
        } else {
          toast.error("Failed to update job application management settings");
        }
      } catch (error) {
        toast.error("An error occurred while updating settings");
        console.error("Update error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [updateManageJobApplications, setManageJobApplications]
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleManageJobToggle = useCallback((key: string) => {
    if (!actualManageJobApplicationsData) return;

    const updatedSettings = {
      ...actualManageJobApplicationsData,
      option: {
        ...actualManageJobApplicationsData.option,
        [key]: !actualManageJobApplicationsData.option[key as keyof ManageJobNotificationState],
      },
    };
    setManageJobApplications(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [actualManageJobApplicationsData, setManageJobApplications, debouncedUpdate]);

  const handleNotificationTypeToggle = useCallback((key: string) => {
    if (!actualManageJobApplicationsData) return;

    const updatedSettings = {
      ...actualManageJobApplicationsData,
      notificationType: {
        ...actualManageJobApplicationsData.notificationType,
        [key]: !actualManageJobApplicationsData.notificationType[key as keyof NotificationType],
      },
    };
    setManageJobApplications(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [actualManageJobApplicationsData, setManageJobApplications, debouncedUpdate]);

  if (!actualManageJobApplicationsData) {
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
          <div className="p-2 bg-cyan-100 rounded-lg">
            <RiFolderUserLine className="h-6 w-6 text-cyan-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Job Application Management
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          Stay informed about candidate applications and manage your hiring process efficiently.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Application Events
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose which application events you want to be notified about
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
            {/* Left Column - Job Management Options */}
            <div className="space-y-4">
              {manageJobOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = actualManageJobApplicationsData?.option?.[option.key as keyof ManageJobNotificationState] || false;

                return (
                  <div
                    key={option.key}
                    className={`
                      p-4 rounded-xl border transition-all duration-200
                      ${isActive
                      ? 'border-cyan-200 bg-cyan-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`
                          p-2 rounded-lg transition-colors duration-200
                          ${isActive ? 'bg-cyan-100 text-cyan-600' : 'bg-gray-100 text-gray-500'}
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
                          onToggle={() => handleManageJobToggle(option.key)}
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
                const isActive = actualManageJobApplicationsData?.notificationType?.[option.key as keyof NotificationType] || false;

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
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-500 border-t-transparent"></div>
              <span className="text-sm">Saving preferences...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ManageJobNotification;
