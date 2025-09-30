import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { RiUser3Line, RiBookmarkLine, RiSearchLine, RiTimeLine, RiMailLine, RiNotification3Line } from "react-icons/ri";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  JobRecommendations,
  JobRecommendationsNotification,
  NotificationFrequency,
  NotificationType,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";

interface RecommendationConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface FrequencyConfig {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const JobRecommendation = () => {
  const {
    applicantSettings,
    setJobRecommendationsNotification,
    updateJobRecommendationsNotification,
  } = useSettingsStore();

  // Get the actual data from applicantSettings instead of the separate state
  const actualJobRecommendationsData = applicantSettings?.notifications?.options?.jobRecommendations;

  const [isLoading, setIsLoading] = useState(false);

  const recommendationOptions: RecommendationConfig[] = useMemo(() => [
    {
      key: "profilePreferences",
      label: "Profile Preferences",
      icon: RiUser3Line,
      description: "Jobs matching your profile settings and preferences",
    },
    {
      key: "savedJobSearch",
      label: "Saved Job Searches",
      icon: RiBookmarkLine,
      description: "New jobs matching your saved search criteria",
    },
    {
      key: "jobMatchFound",
      label: "Perfect Job Matches",
      icon: RiSearchLine,
      description: "Jobs that closely match your skills and experience",
    },
  ], []);

  const frequencyOptions: FrequencyConfig[] = useMemo(() => [
    {
      key: "instant",
      label: "Instant",
      description: "Notify me immediately when jobs are found",
      icon: RiTimeLine,
    },
    {
      key: "daily",
      label: "Daily",
      description: "Send me a daily digest of new job recommendations",
      icon: RiTimeLine,
    },
    {
      key: "weekly",
      label: "Weekly",
      description: "Send me a weekly summary of job recommendations",
      icon: RiTimeLine,
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
      description: "Receive recommendations via email",
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
    const jobRecommendationsData = applicantSettings?.notifications?.options?.jobRecommendations;

    if (jobRecommendationsData && (!actualJobRecommendationsData ||
      JSON.stringify(actualJobRecommendationsData) !== JSON.stringify(jobRecommendationsData))) {
      setJobRecommendationsNotification(jobRecommendationsData);
    }
  }, [applicantSettings, setJobRecommendationsNotification, actualJobRecommendationsData]);

  const debouncedUpdate = useCallback(
    debounce(async (settings: JobRecommendationsNotification) => {
      setIsLoading(true);
      try {
        const response = await updateJobRecommendationsNotification(settings);
        if (response) {
          setJobRecommendationsNotification(response);
          toast.success("Job recommendation settings updated");
        } else {
          toast.error("Failed to update recommendation settings");
        }
      } catch (error) {
        toast.error("An error occurred while updating settings");
        console.error("Update error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [updateJobRecommendationsNotification, setJobRecommendationsNotification]
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleRecommendationToggle = useCallback((key: string) => {
    if (!actualJobRecommendationsData) return;

    const updatedSettings = {
      ...actualJobRecommendationsData,
      option: {
        ...actualJobRecommendationsData.option,
        [key]: !actualJobRecommendationsData.option[key as keyof JobRecommendations],
      },
    };
    setJobRecommendationsNotification(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [actualJobRecommendationsData, setJobRecommendationsNotification, debouncedUpdate]);

  const handleFrequencyToggle = useCallback((key: string) => {
    if (!actualJobRecommendationsData) return;

    const updatedSettings = {
      ...actualJobRecommendationsData,
      frequency: {
        ...actualJobRecommendationsData.frequency,
        [key]: !actualJobRecommendationsData.frequency[key as keyof NotificationFrequency],
      },
    };
    setJobRecommendationsNotification(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [actualJobRecommendationsData, setJobRecommendationsNotification, debouncedUpdate]);

  const handleNotificationTypeToggle = useCallback((key: string) => {
    if (!actualJobRecommendationsData) return;

    const updatedSettings = {
      ...actualJobRecommendationsData,
      notificationType: {
        ...actualJobRecommendationsData.notificationType,
        [key]: !actualJobRecommendationsData.notificationType[key as keyof NotificationType],
      },
    };
    setJobRecommendationsNotification(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [actualJobRecommendationsData, setJobRecommendationsNotification, debouncedUpdate]);

  if (!actualJobRecommendationsData) {
    return (
      <div className="font-lato flex w-[95%] flex-col self-center py-10 md:w-[90%]">
        <div className="animate-pulse">
          <div className="h-px bg-gray-200 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Job Recommendations
        </h2>
        <p className="text-gray-600 text-sm">
          Customize how and when you receive personalized job recommendations based on your preferences.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Recommendation Sources
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose what type of job matches you want to receive
              </p>
            </div>
            <div className="md:text-right">
              <h3 className="font-semibold text-gray-900 text-lg">
                Notification Frequency
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Select how often you want to be notified
              </p>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Top Section: Recommendation Types & Frequency */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Recommendation Types */}
            <div className="space-y-4">
              {recommendationOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = actualJobRecommendationsData?.option?.[option.key as keyof JobRecommendations] || false;

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
                          onToggle={() => handleRecommendationToggle(option.key)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column - Frequency Options */}
            <div className="space-y-4">
              {frequencyOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = actualJobRecommendationsData?.frequency?.[option.key as keyof NotificationFrequency] || false;

                return (
                  <div
                    key={option.key}
                    className={`
                      p-4 rounded-xl border transition-all duration-200
                      ${isActive
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`
                          p-2 rounded-lg transition-colors duration-200
                          ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}
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
                          onToggle={() => handleFrequencyToggle(option.key)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notification Type Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 text-lg">
                Notification Methods
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose how you want to receive your job recommendations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {notificationTypeOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = actualJobRecommendationsData?.notificationType?.[option.key as keyof NotificationType] || false;

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
                          <p className="text-xs text-gray-600 mt-1">
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

export default JobRecommendation;
