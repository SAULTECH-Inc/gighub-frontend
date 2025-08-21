import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { RiBriefcaseLine, RiGlobalLine, RiMailLine, RiNotification3Line, RiMessage3Line } from "react-icons/ri";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  CommunicationNotification,
  CommunicationNotificationOption,
  NotificationType,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";

interface CommunicationConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const CommunicationPreferences = () => {
  const {
    applicantSettings,
    communication,
    setCommunication,
    updateCommunication,
  } = useSettingsStore();

  const [isLoading, setIsLoading] = useState(false);

  const communicationOptions: CommunicationConfig[] = useMemo(() => [
    {
      key: "promotionalOffers",
      label: "Employer Promotions",
      icon: RiBriefcaseLine,
      description: "Promotional offers, job alerts, and marketing content from employers",
    },
    {
      key: "fromPlatform",
      label: "Platform Communications",
      icon: RiGlobalLine,
      description: "News, updates, and promotional content from our platform",
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
      description: "Receive promotional content via email",
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
    if (applicantSettings?.notifications?.options?.communication) {
      setCommunication(applicantSettings.notifications.options.communication);
    }
  }, [applicantSettings, setCommunication]);

  const debouncedUpdate = useCallback(
    debounce(async (settings: CommunicationNotification) => {
      setIsLoading(true);
      try {
        const response = await updateCommunication(settings);
        if (response) {
          setCommunication(response);
          toast.success("Communication preferences updated");
        } else {
          toast.error("Failed to update communication preferences");
        }
      } catch (error) {
        toast.error("An error occurred while updating settings");
        console.error("Update error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [updateCommunication, setCommunication]
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleCommunicationToggle = useCallback((key: string) => {
    if (!communication) return;

    const updatedSettings = {
      ...communication,
      option: {
        ...communication.option,
        [key]: !communication.option[key as keyof CommunicationNotificationOption],
      },
    };
    setCommunication(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [communication, setCommunication, debouncedUpdate]);

  const handleNotificationTypeToggle = useCallback((key: string) => {
    if (!communication) return;

    const updatedSettings = {
      ...communication,
      notificationType: {
        ...communication.notificationType,
        [key]: !communication.notificationType[key as keyof NotificationType],
      },
    };
    setCommunication(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [communication, setCommunication, debouncedUpdate]);

  if (!communication) {
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
          <div className="p-2 bg-pink-100 rounded-lg">
            <RiMessage3Line className="h-6 w-6 text-pink-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Communication Preferences
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          Control what promotional and marketing communications you receive from employers and our platform.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Promotional Content
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose what promotional content you want to receive
              </p>
            </div>
            <div className="md:text-right">
              <h3 className="font-semibold text-gray-900 text-lg">
                Notification Methods
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Select how you want to receive communications
              </p>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Communication Options */}
            <div className="space-y-4">
              {communicationOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = communication.option[option.key as keyof CommunicationNotificationOption];

                return (
                  <div
                    key={option.key}
                    className={`
                      p-4 rounded-xl border transition-all duration-200
                      ${isActive
                      ? 'border-pink-200 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`
                          p-2 rounded-lg transition-colors duration-200
                          ${isActive ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500'}
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
                          onToggle={() => handleCommunicationToggle(option.key)}
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
                const isActive = communication.notificationType[option.key as keyof NotificationType];

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
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-pink-500 border-t-transparent"></div>
              <span className="text-sm">Saving preferences...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommunicationPreferences;