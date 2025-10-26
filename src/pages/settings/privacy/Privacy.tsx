import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import {
  RiShieldCheckLine,
  RiGlobalLine,
  RiTeamLine,
  RiLockLine,
  RiEyeLine,
} from "react-icons/ri";
import ToggleSwitch from "../../../components/common/ToggleSwitch.tsx";
import {
  PrivacyOptions,
  useSettingsStore,
} from "../../../store/useSettingsStore.ts";

interface PrivacyConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  risk: "low" | "medium" | "high";
}

const Privacy = () => {
  const { applicantSettings, setPrivacy, updatePrivacy } = useSettingsStore();

  // Get the actual data from applicantSettings instead of the separate state
  const actualPrivacyData = applicantSettings?.privacy;

  const [isLoading, setIsLoading] = useState(false);

  const privacyOptions: PrivacyConfig[] = useMemo(
    () => [
      {
        key: "publicProfile",
        label: "Public Profile",
        icon: RiGlobalLine,
        description: "Anyone can view your profile and contact information",
        risk: "high",
      },
      {
        key: "onlyEmployers",
        label: "Employers Only",
        icon: RiTeamLine,
        description: "Only verified employers can view your profile",
        risk: "medium",
      },
      {
        key: "onlyMyNetwork",
        label: "My Network Only",
        icon: RiTeamLine,
        description: "Only people in your network can view your profile",
        risk: "low",
      },
      {
        key: "onlyMe",
        label: "Private Profile",
        icon: RiLockLine,
        description: "Only you can view your profile information",
        risk: "low",
      },
    ],
    [],
  );

  // Initialize state from backend data
  useEffect(() => {
    const privacyData = applicantSettings?.privacy;

    if (
      privacyData &&
      (!actualPrivacyData ||
        JSON.stringify(actualPrivacyData) !== JSON.stringify(privacyData))
    ) {
      setPrivacy(privacyData);
    }
  }, [applicantSettings, setPrivacy, actualPrivacyData]);

  const debouncedUpdate = useCallback(
    debounce(async (settings: PrivacyOptions) => {
      setIsLoading(true);
      try {
        const response = await updatePrivacy(settings);
        if (response) {
          setPrivacy(response);
          toast.success("Privacy settings updated successfully");
        } else {
          toast.error("Failed to update privacy settings");
        }
      } catch (error) {
        toast.error("An error occurred while updating settings");
        console.error("Update error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [updatePrivacy, setPrivacy],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handlePrivacyToggle = useCallback(
    (key: string) => {
      if (!actualPrivacyData) return;

      const updatedSettings = {
        ...actualPrivacyData,
        [key]: !actualPrivacyData[key as keyof PrivacyOptions],
      };
      setPrivacy(updatedSettings);
      debouncedUpdate(updatedSettings);
    },
    [actualPrivacyData, setPrivacy, debouncedUpdate],
  );

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getRiskIconColor = (risk: string, isActive: boolean) => {
    if (!isActive) return "bg-gray-100 text-gray-500";

    switch (risk) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      case "low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return (
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
            High Visibility
          </span>
        );
      case "medium":
        return (
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
            Medium Visibility
          </span>
        );
      case "low":
        return (
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
            Low Visibility
          </span>
        );
      default:
        return null;
    }
  };

  if (!actualPrivacyData) {
    return (
      <div className="font-lato flex w-[95%] flex-col self-center py-10 md:w-[90%]">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="h-64 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="font-lato flex w-[95%] flex-col self-center py-10 md:w-[90%]">
      {/* Section Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center space-x-3">
          <div className="rounded-lg bg-indigo-100 p-2">
            <RiEyeLine className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Privacy Settings</h2>
        </div>
        <p className="text-sm text-gray-600">
          Control who can view your profile and personal information on the
          platform.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start space-x-3">
          <RiShieldCheckLine className="mt-0.5 h-5 w-5 text-blue-600" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">
              Privacy Protection
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Your privacy is important to us. Choose the visibility level that
              makes you most comfortable while still allowing relevant
              opportunities to find you.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Profile Visibility Settings
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Select who can view your profile information
          </p>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <div className="space-y-4">
            {privacyOptions.map((option) => {
              const IconComponent = option.icon;
              const isActive =
                actualPrivacyData?.[option.key as keyof PrivacyOptions] ||
                false;

              return (
                <div
                  key={option.key}
                  className={`rounded-xl border-2 p-5 transition-all duration-200 ${
                    isActive
                      ? getRiskColor(option.risk)
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-start space-x-4">
                      <div
                        className={`rounded-lg p-3 transition-colors duration-200 ${getRiskIconColor(option.risk, isActive)} `}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center space-x-3">
                          <label className="block cursor-pointer font-semibold text-gray-900">
                            {option.label}
                          </label>
                          {getRiskBadge(option.risk)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <ToggleSwitch
                        isOn={isActive}
                        onToggle={() => handlePrivacyToggle(option.key)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Privacy Info */}
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-gray-900">
              Important Privacy Notes:
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• You can change these settings at any time</li>
              <li>
                • Some information may still be visible to platform
                administrators
              </li>
              <li>
                • Employers you've applied to can always view your application
                details
              </li>
              <li>• More restrictive settings may limit job opportunities</li>
            </ul>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="px-6 pb-4">
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
              <span className="text-sm">Saving preferences...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Privacy;
