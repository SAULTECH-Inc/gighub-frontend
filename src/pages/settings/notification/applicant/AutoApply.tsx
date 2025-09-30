import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { RiCheckboxCircleLine, RiSearchLine, RiCloseLine, RiMailLine, RiNotification3Line, RiRobotLine } from "react-icons/ri";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  AutoApplyState,
  AutoApplyNotification,
  NotificationType,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";

interface AutoApplyConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const AutoApply = () => {
  const {
    applicantSettings,
    setAutoApply,
    updateAutoApply
  } = useSettingsStore();

  // Get the actual data from applicantSettings instead of the separate state
  const actualAutoApplyData = applicantSettings?.notifications?.options?.autoApply;

  const [isLoading, setIsLoading] = useState(false);

  const autoApplyOptions: AutoApplyConfig[] = useMemo(() => [
    {
      key: "jobAutoApplied",
      label: "Successful Auto-Application",
      icon: RiCheckboxCircleLine,
      description: "When a job is automatically applied to successfully on your behalf",
    },
    {
      key: "jobMatchFound",
      label: "Perfect Job Match Found",
      icon: RiSearchLine,
      description: "When we find a job that matches your profile criteria",
    },
    {
      key: "jobMatchedButFailedToApply",
      label: "Application Failed",
      icon: RiCloseLine,
      description: "When a job matches your profile but the auto-application fails",
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
      description: "Receive auto-apply updates via email",
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
    const autoApplyData = applicantSettings?.notifications?.options?.autoApply;

    if (autoApplyData && (!actualAutoApplyData ||
      JSON.stringify(actualAutoApplyData) !== JSON.stringify(autoApplyData))) {
      setAutoApply(autoApplyData);
    }
  }, [applicantSettings, setAutoApply, actualAutoApplyData]);

  const debouncedUpdate = useCallback(
    debounce(async (settings: AutoApplyNotification) => {
      setIsLoading(true);
      try {
        const response = await updateAutoApply(settings);
        if (response) {
          setAutoApply(response);
          toast.success("Auto-apply notification settings updated");
        } else {
          toast.error("Failed to update auto-apply notification settings");
        }
      } catch (error) {
        toast.error("An error occurred while updating settings");
        console.error("Update error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [updateAutoApply, setAutoApply]
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleAutoApplyToggle = useCallback((key: string) => {
    if (!actualAutoApplyData) return;

    const updatedSettings = {
      ...actualAutoApplyData,
      option: {
        ...actualAutoApplyData.option,
        [key]: !actualAutoApplyData.option[key as keyof AutoApplyState],
      },
    };
    setAutoApply(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [actualAutoApplyData, setAutoApply, debouncedUpdate]);

  const handleNotificationTypeToggle = useCallback((key: string) => {
    if (!actualAutoApplyData) return;

    const updatedSettings = {
      ...actualAutoApplyData,
      notificationType: {
        ...actualAutoApplyData.notificationType,
        [key]: !actualAutoApplyData.notificationType[key as keyof NotificationType],
      },
    };
    setAutoApply(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [actualAutoApplyData, setAutoApply, debouncedUpdate]);

  if (!actualAutoApplyData) {
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
          <div className="p-2 bg-indigo-100 rounded-lg">
            <RiRobotLine className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Auto-Apply Notifications
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          Get notified about the status of jobs automatically applied to on your behalf by our AI system.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Auto-Apply Events
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose which auto-apply events you want to be notified about
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
            {/* Left Column - Auto Apply Options */}
            <div className="space-y-4">
              {autoApplyOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = actualAutoApplyData?.option?.[option.key as keyof AutoApplyState] || false;

                return (
                  <div
                    key={option.key}
                    className={`
                      p-4 rounded-xl border transition-all duration-200
                      ${isActive
                      ? 'border-indigo-200 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`
                          p-2 rounded-lg transition-colors duration-200
                          ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}
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
                          onToggle={() => handleAutoApplyToggle(option.key)}
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
                const isActive = actualAutoApplyData?.notificationType?.[option.key as keyof NotificationType] || false;

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
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
              <span className="text-sm">Saving preferences...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AutoApply;
