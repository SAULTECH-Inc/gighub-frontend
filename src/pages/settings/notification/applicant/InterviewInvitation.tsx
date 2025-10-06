import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import {
  RiCalendarEventLine,
  RiCalendarCheckLine,
  RiCloseLine,
  RiTimeLine,
  RiMailLine,
  RiNotification3Line,
  RiCalendarLine,
} from "react-icons/ri";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  InterviewInvitationState,
  InterviewInvitationNotification,
  NotificationType,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";
import { useAuth } from "../../../../store/useAuth.ts";
import { UserType } from "../../../../utils/enums.ts";

interface InterviewConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const InterviewInvitation = () => {
  const {
    applicantSettings,
    employerSettings,
    setInterviewInvitation,
    updateInterviewInvitation,
  } = useSettingsStore();

  const { userType } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Get the actual data from applicantSettings/employerSettings instead of the separate state
  const actualInterviewInvitationData =
    userType === UserType.APPLICANT
      ? applicantSettings?.notifications?.options?.interviewInvitation
      : employerSettings?.notifications?.options?.interviewInvitation;

  const interviewOptions: InterviewConfig[] = useMemo(
    () => [
      {
        key: "scheduleRescheduled",
        label: "Interview Scheduled",
        icon: RiCalendarEventLine,
        description: "When an employer schedules a new interview with you",
      },
      {
        key: "scheduleCancelled",
        label: "Interview Cancelled",
        icon: RiCloseLine,
        description: "When an interview has been cancelled by the employer",
      },
      {
        key: "notifyForUpcomingInterviews",
        label: "Upcoming Interview Reminders",
        icon: RiTimeLine,
        description: "Reminders for interviews scheduled in the next 24 hours",
      },
      {
        key: "notifyForInterviewConfirmation",
        label: "Interview Confirmation",
        icon: RiCalendarCheckLine,
        description: "When you need to confirm your interview attendance",
      },
    ],
    [],
  );

  const notificationTypeOptions = useMemo(
    () => [
      {
        key: "all",
        label: "All Notifications",
        description: "Enable all notification methods",
        icon: RiNotification3Line,
      },
      {
        key: "emailNotification",
        label: "Email Notifications",
        description: "Receive interview updates via email",
        icon: RiMailLine,
      },
      {
        key: "pushNotification",
        label: "Push Notifications",
        description: "Receive browser/app push notifications",
        icon: RiNotification3Line,
      },
    ],
    [],
  );

  // Initialize state from backend data
  useEffect(() => {
    const settings =
      userType === UserType.APPLICANT
        ? applicantSettings?.notifications?.options?.interviewInvitation
        : employerSettings?.notifications?.options?.interviewInvitation;

    if (
      settings &&
      (!actualInterviewInvitationData ||
        JSON.stringify(actualInterviewInvitationData) !==
          JSON.stringify(settings))
    ) {
      setInterviewInvitation(settings);
    }
  }, [
    applicantSettings,
    employerSettings,
    userType,
    setInterviewInvitation,
    actualInterviewInvitationData,
  ]);

  const debouncedUpdate = useCallback(
    debounce(async (settings: InterviewInvitationNotification) => {
      setIsLoading(true);
      try {
        const response = await updateInterviewInvitation(settings);
        if (response) {
          setInterviewInvitation(response);
          toast.success("Interview notification settings updated");
        } else {
          toast.error("Failed to update interview notification settings");
        }
      } catch (error) {
        toast.error("An error occurred while updating settings");
        console.error("Update error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [updateInterviewInvitation, setInterviewInvitation],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleInterviewOptionToggle = useCallback(
    (key: string) => {
      if (!actualInterviewInvitationData) return;

      const updatedSettings = {
        ...actualInterviewInvitationData,
        option: {
          ...actualInterviewInvitationData.option,
          [key]:
            !actualInterviewInvitationData.option[
              key as keyof InterviewInvitationState
            ],
        },
      };
      setInterviewInvitation(updatedSettings);
      debouncedUpdate(updatedSettings);
    },
    [actualInterviewInvitationData, setInterviewInvitation, debouncedUpdate],
  );

  const handleNotificationTypeToggle = useCallback(
    (key: string) => {
      if (!actualInterviewInvitationData) return;

      const updatedSettings = {
        ...actualInterviewInvitationData,
        notificationType: {
          ...actualInterviewInvitationData.notificationType,
          [key]:
            !actualInterviewInvitationData.notificationType[
              key as keyof NotificationType
            ],
        },
      };
      setInterviewInvitation(updatedSettings);
      debouncedUpdate(updatedSettings);
    },
    [actualInterviewInvitationData, setInterviewInvitation, debouncedUpdate],
  );

  if (!actualInterviewInvitationData) {
    return (
      <div className="font-lato flex w-[95%] flex-col self-center py-10 md:w-[90%]">
        <div className="animate-pulse">
          <div className="mb-4 h-px bg-gray-200"></div>
          <div className="mb-4 h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="h-64 rounded bg-gray-200"></div>
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
        <div className="mb-2 flex items-center space-x-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <RiCalendarLine className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Interview Notifications
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Stay informed about your interview schedule with timely notifications
          and reminders.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Interview Events
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Choose which interview events you want to be notified about
              </p>
            </div>
            <div className="md:text-right">
              <h3 className="text-lg font-semibold text-gray-900">
                Notification Methods
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Select how you want to receive notifications
              </p>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column - Interview Options */}
            <div className="space-y-4">
              {interviewOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive =
                  actualInterviewInvitationData?.option?.[
                    option.key as keyof InterviewInvitationState
                  ] || false;

                return (
                  <div
                    key={option.key}
                    className={`rounded-xl border p-4 transition-all duration-200 ${
                      isActive
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    } `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-1 items-start space-x-3">
                        <div
                          className={`rounded-lg p-2 transition-colors duration-200 ${isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"} `}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <label className="block cursor-pointer font-medium text-gray-900">
                            {option.label}
                          </label>
                          <p className="mt-1 text-sm text-gray-600">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4">
                        <ToggleSwitch
                          isOn={isActive}
                          onToggle={() =>
                            handleInterviewOptionToggle(option.key)
                          }
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
                const isActive =
                  actualInterviewInvitationData?.notificationType?.[
                    option.key as keyof NotificationType
                  ] || false;

                return (
                  <div
                    key={option.key}
                    className={`rounded-xl border p-4 transition-all duration-200 ${
                      isActive
                        ? "border-purple-200 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    } `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-1 items-start space-x-3">
                        <div
                          className={`rounded-lg p-2 transition-colors duration-200 ${isActive ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"} `}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <label className="block cursor-pointer font-medium text-gray-900">
                            {option.label}
                          </label>
                          <p className="mt-1 text-sm text-gray-600">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4">
                        <ToggleSwitch
                          isOn={isActive}
                          onToggle={() =>
                            handleNotificationTypeToggle(option.key)
                          }
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
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              <span className="text-sm">Saving preferences...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InterviewInvitation;
