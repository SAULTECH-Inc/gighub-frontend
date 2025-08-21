import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { RiShieldCheckLine, RiLockPasswordLine, RiRefreshLine, RiSmartphoneLine, RiLoginBoxLine, RiMailLine, RiNotification3Line, RiSecurePaymentLine } from "react-icons/ri";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  GeneralSettingsNotification,
  GeneralSettingsNotificationOptions,
  NotificationType,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";

interface GeneralSettingsConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const GeneralSettings = () => {
  const {
    applicantSettings,
    generalSettings,
    setGeneralSettings,
    updateGeneralSettings,
  } = useSettingsStore();

  const [isLoading, setIsLoading] = useState(false);

  const generalSettingsOptions: GeneralSettingsConfig[] = useMemo(() => [
    {
      key: "enableTwoFactorAuth",
      label: "Two-Factor Authentication",
      icon: RiShieldCheckLine,
      description: "When two-factor authentication is enabled on your account",
    },
    {
      key: "passwordChange",
      label: "Password Changed",
      icon: RiLockPasswordLine,
      description: "When your account password is successfully changed",
    },
    {
      key: "passwordReset",
      label: "Password Reset",
      icon: RiRefreshLine,
      description: "When your password is reset via email verification",
    },
    {
      key: "loginFromNewDevice",
      label: "New Device Login",
      icon: RiSmartphoneLine,
      description: "When your account is accessed from a new device",
    },
    {
      key: "login",
      label: "Account Login",
      icon: RiLoginBoxLine,
      description: "When someone logs into your account",
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
      description: "Receive security alerts via email",
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
    if (applicantSettings?.notifications?.options?.generalSettings) {
      setGeneralSettings(applicantSettings.notifications.options.generalSettings);
    }
  }, [applicantSettings, setGeneralSettings]);

  const debouncedUpdate = useCallback(
    debounce(async (settings: GeneralSettingsNotification) => {
      setIsLoading(true);
      try {
        const response = await updateGeneralSettings(settings);
        if (response) {
          setGeneralSettings(response);
          toast.success("Security notification settings updated");
        } else {
          toast.error("Failed to update security notification settings");
        }
      } catch (error) {
        toast.error("An error occurred while updating settings");
        console.error("Update error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [updateGeneralSettings, setGeneralSettings]
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleGeneralSettingsToggle = useCallback((key: string) => {
    if (!generalSettings) return;

    const updatedSettings = {
      ...generalSettings,
      option: {
        ...generalSettings.option,
        [key]: !generalSettings.option[key as keyof GeneralSettingsNotificationOptions],
      },
    };
    setGeneralSettings(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [generalSettings, setGeneralSettings, debouncedUpdate]);

  const handleNotificationTypeToggle = useCallback((key: string) => {
    if (!generalSettings) return;

    const updatedSettings = {
      ...generalSettings,
      notificationType: {
        ...generalSettings.notificationType,
        [key]: !generalSettings.notificationType[key as keyof NotificationType],
      },
    };
    setGeneralSettings(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [generalSettings, setGeneralSettings, debouncedUpdate]);

  if (!generalSettings) {
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
          <div className="p-2 bg-red-100 rounded-lg">
            <RiSecurePaymentLine className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Security & Account Alerts
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          Stay informed about important security events and account changes to keep your profile safe.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Security Events
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose which security events you want to be notified about
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
            {/* Left Column - Security Options */}
            <div className="space-y-4">
              {generalSettingsOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = generalSettings.option[option.key as keyof GeneralSettingsNotificationOptions];

                return (
                  <div
                    key={option.key}
                    className={`
                      p-4 rounded-xl border transition-all duration-200
                      ${isActive
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`
                          p-2 rounded-lg transition-colors duration-200
                          ${isActive ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}
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
                          onToggle={() => handleGeneralSettingsToggle(option.key)}
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
                const isActive = generalSettings.notificationType[option.key as keyof NotificationType];

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
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
              <span className="text-sm">Saving preferences...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GeneralSettings;