import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import {
  RiAlarmWarningLine,
  RiCloseLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiMailLine,
  RiNotification3Line,
  RiSecurePaymentLine,
} from "react-icons/ri";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  NotificationType,
  PaymentAndBillingNotification,
  PaymentAndBillingNotificationOptions,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";
import { useAuth } from "../../../../store/useAuth.ts";
import { UserType } from "../../../../utils/enums.ts";

interface PaymentConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const PaymentAndSubscription = () => {
  const {
    applicantSettings,
    employerSettings,
    setPaymentAndBilling,
    updatePaymentAndBilling,
  } = useSettingsStore();

  const { userType } = useAuth();

  // Get the actual data from applicantSettings/employerSettings instead of the separate state
  const actualPaymentAndBillingData =
    userType === UserType.APPLICANT
      ? applicantSettings?.notifications?.options?.paymentAndBilling
      : employerSettings?.notifications?.options?.paymentAndBilling;

  const [isLoading, setIsLoading] = useState(false);

  const paymentOptions: PaymentConfig[] = useMemo(
    () => [
      {
        key: "subscriptionDue",
        label: "Payment Due",
        icon: RiAlarmWarningLine,
        description: "When a subscription payment is due or approaching",
      },
      {
        key: "subscriptionCancelled",
        label: "Subscription Cancelled",
        icon: RiCloseLine,
        description: "When your subscription has been cancelled",
      },
      {
        key: "subscriptionExpired",
        label: "Subscription Expired",
        icon: RiTimeLine,
        description: "When your subscription has expired and needs renewal",
      },
      {
        key: "subscriptionSuccessful",
        label: "Payment Successful",
        icon: RiCheckboxCircleLine,
        description: "When a subscription payment is processed successfully",
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
        description: "Receive billing updates via email",
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
        ? applicantSettings?.notifications?.options?.paymentAndBilling
        : employerSettings?.notifications?.options?.paymentAndBilling;

    if (
      settings &&
      (!actualPaymentAndBillingData ||
        JSON.stringify(actualPaymentAndBillingData) !==
          JSON.stringify(settings))
    ) {
      setPaymentAndBilling(settings);
    }
  }, [
    applicantSettings,
    employerSettings,
    userType,
    setPaymentAndBilling,
    actualPaymentAndBillingData,
  ]);

  const debouncedUpdate = useCallback(
    debounce(async (settings: PaymentAndBillingNotification) => {
      setIsLoading(true);
      try {
        const response = await updatePaymentAndBilling(settings);
        if (response) {
          setPaymentAndBilling(response);
          toast.success("Payment and billing notification settings updated");
        } else {
          toast.error(
            "Failed to update payment and billing notification settings",
          );
        }
      } catch (error) {
        toast.error("An error occurred while updating settings");
        console.error("Update error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [updatePaymentAndBilling, setPaymentAndBilling],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handlePaymentToggle = useCallback(
    (key: string) => {
      if (!actualPaymentAndBillingData) return;

      const updatedSettings = {
        ...actualPaymentAndBillingData,
        option: {
          ...actualPaymentAndBillingData.option,
          [key]:
            !actualPaymentAndBillingData.option[
              key as keyof PaymentAndBillingNotificationOptions
            ],
        },
      };
      setPaymentAndBilling(updatedSettings);
      debouncedUpdate(updatedSettings);
    },
    [actualPaymentAndBillingData, setPaymentAndBilling, debouncedUpdate],
  );

  const handleNotificationTypeToggle = useCallback(
    (key: string) => {
      if (!actualPaymentAndBillingData) return;

      const updatedSettings = {
        ...actualPaymentAndBillingData,
        notificationType: {
          ...actualPaymentAndBillingData.notificationType,
          [key]:
            !actualPaymentAndBillingData.notificationType[
              key as keyof NotificationType
            ],
        },
      };
      setPaymentAndBilling(updatedSettings);
      debouncedUpdate(updatedSettings);
    },
    [actualPaymentAndBillingData, setPaymentAndBilling, debouncedUpdate],
  );

  if (!actualPaymentAndBillingData) {
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
          <div className="rounded-lg bg-emerald-100 p-2">
            <RiSecurePaymentLine className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Payment & Billing
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Stay informed about your subscription payments, billing cycles, and
          account status changes.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Events
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Choose which payment events you want to be notified about
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
            {/* Left Column - Payment Options */}
            <div className="space-y-4">
              {paymentOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive =
                  actualPaymentAndBillingData?.option?.[
                    option.key as keyof PaymentAndBillingNotificationOptions
                  ] || false;

                return (
                  <div
                    key={option.key}
                    className={`rounded-xl border p-4 transition-all duration-200 ${
                      isActive
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    } `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-1 items-start space-x-3">
                        <div
                          className={`rounded-lg p-2 transition-colors duration-200 ${isActive ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"} `}
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
                          onToggle={() => handlePaymentToggle(option.key)}
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
                  actualPaymentAndBillingData?.notificationType?.[
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
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
              <span className="text-sm">Saving preferences...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PaymentAndSubscription;
