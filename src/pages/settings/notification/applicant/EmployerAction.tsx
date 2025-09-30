import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { RiEyeLine, RiDownloadLine, RiMailLine, RiNotification3Line, RiBriefcaseLine } from "react-icons/ri";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  EmployerActionNotification,
  EmployerActionOption,
  NotificationType,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";

interface EmployerActionConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const EmployerAction = () => {
  const {
    applicantSettings,
    setEmployerAction,
    updateEmployerAction,
  } = useSettingsStore();

  // Get the actual data from applicantSettings instead of the separate state
  const actualEmployerActionData = applicantSettings?.notifications?.options?.employerAction;

  const [isLoading, setIsLoading] = useState(false);

  const employerActionOptions: EmployerActionConfig[] = useMemo(() => [
    {
      key: "viewedMyProfile",
      label: "Profile Views",
      icon: RiEyeLine,
      description: "When an employer views your profile",
    },
    {
      key: "downloadedMyResume",
      label: "Resume Downloads",
      icon: RiDownloadLine,
      description: "When an employer downloads your resume",
    },
    {
      key: "sentDirectMessage",
      label: "Direct Messages",
      icon: RiMailLine,
      description: "When an employer sends you a direct message",
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
      description: "Receive employer action updates via email",
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
    const employerActionData = applicantSettings?.notifications?.options?.employerAction;

    if (employerActionData && (!actualEmployerActionData ||
      JSON.stringify(actualEmployerActionData) !== JSON.stringify(employerActionData))) {
      setEmployerAction(employerActionData);
    }
  }, [applicantSettings, setEmployerAction, actualEmployerActionData]);

  const debouncedUpdate = useCallback(
    debounce(async (settings: EmployerActionNotification) => {
      setIsLoading(true);
      try {
        const response = await updateEmployerAction(settings);
        if (response) {
          setEmployerAction(response);
          toast.success("Employer action notification settings updated");
        } else {
          toast.error("Failed to update employer action notification settings");
        }
      } catch (error) {
        toast.error("An error occurred while updating settings");
        console.error("Update error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [updateEmployerAction, setEmployerAction]
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleEmployerActionToggle = useCallback((key: string) => {
    if (!actualEmployerActionData) return;

    const updatedSettings = {
      ...actualEmployerActionData,
      option: {
        ...actualEmployerActionData.option,
        [key]: !actualEmployerActionData.option[key as keyof EmployerActionOption],
      },
    };
    setEmployerAction(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [actualEmployerActionData, setEmployerAction, debouncedUpdate]);

  const handleNotificationTypeToggle = useCallback((key: string) => {
    if (!actualEmployerActionData) return;

    const updatedSettings = {
      ...actualEmployerActionData,
      notificationType: {
        ...actualEmployerActionData.notificationType,
        [key]: !actualEmployerActionData.notificationType[key as keyof NotificationType],
      },
    };
    setEmployerAction(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [actualEmployerActionData, setEmployerAction, debouncedUpdate]);

  if (!actualEmployerActionData) {
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
          <div className="p-2 bg-teal-100 rounded-lg">
            <RiBriefcaseLine className="h-6 w-6 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Employer Actions
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          Get notified when employers interact with your profile and show interest in your application.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Employer Interaction Events
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose which employer actions you want to be notified about
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
            {/* Left Column - Employer Action Options */}
            <div className="space-y-4">
              {employerActionOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = actualEmployerActionData?.option?.[option.key as keyof EmployerActionOption] || false;

                return (
                  <div
                    key={option.key}
                    className={`
                      p-4 rounded-xl border transition-all duration-200
                      ${isActive
                      ? 'border-teal-200 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`
                          p-2 rounded-lg transition-colors duration-200
                          ${isActive ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-500'}
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
                          onToggle={() => handleEmployerActionToggle(option.key)}
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
                const isActive = actualEmployerActionData?.notificationType?.[option.key as keyof NotificationType] || false;

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
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-teal-500 border-t-transparent"></div>
              <span className="text-sm">Saving preferences...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EmployerAction;
