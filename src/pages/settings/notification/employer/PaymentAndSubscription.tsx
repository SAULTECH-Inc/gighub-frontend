import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { RiAlarmWarningLine, RiCloseLine, RiTimeLine, RiCheckboxCircleLine, RiMailLine, RiNotification3Line, RiSecurePaymentLine } from "react-icons/ri";
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
    paymentAndBilling,
    setPaymentAndBilling,
    updatePaymentAndBilling,
  } = useSettingsStore();

  const { userType } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const paymentOptions: PaymentConfig[] = useMemo(() => [
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
      description: "Receive billing updates via email",
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
    const settings = userType === UserType.APPLICANT
      ? applicantSettings?.notifications?.options?.paymentAndBilling
      : employerSettings?.notifications?.options?.paymentAndBilling;

    if (settings) {
      setPaymentAndBilling(settings);
    }
  }, [applicantSettings, employerSettings, userType, setPaymentAndBilling]);

  const debouncedUpdate = useCallback(
    debounce(async (settings: PaymentAndBillingNotification) => {
      setIsLoading(true);
      try {
        const response = await updatePaymentAndBilling(settings);
        if (response) {
          setPaymentAndBilling(response);
          toast.success("Payment and billing notification settings updated");
        } else {
          toast.error("Failed to update payment and billing notification settings");
        }
      } catch (error) {
        toast.error("An error occurred while updating settings");
        console.error("Update error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 800),
    [updatePaymentAndBilling, setPaymentAndBilling]
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handlePaymentToggle = useCallback((key: string) => {
    if (!paymentAndBilling) return;

    const updatedSettings = {
      ...paymentAndBilling,
      option: {
        ...paymentAndBilling.option,
        [key]: !paymentAndBilling.option[key as keyof PaymentAndBillingNotificationOptions],
      },
    };
    setPaymentAndBilling(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [paymentAndBilling, setPaymentAndBilling, debouncedUpdate]);

  const handleNotificationTypeToggle = useCallback((key: string) => {
    if (!paymentAndBilling) return;

    const updatedSettings = {
      ...paymentAndBilling,
      notificationType: {
        ...paymentAndBilling.notificationType,
        [key]: !paymentAndBilling.notificationType[key as keyof NotificationType],
      },
    };
    setPaymentAndBilling(updatedSettings);
    debouncedUpdate(updatedSettings);
  }, [paymentAndBilling, setPaymentAndBilling, debouncedUpdate]);

  if (!paymentAndBilling) {
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
          <div className="p-2 bg-emerald-100 rounded-lg">
            <RiSecurePaymentLine className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Payment & Billing
          </h2>
        </div>
        <p className="text-gray-600 text-sm">
          Stay informed about your subscription payments, billing cycles, and account status changes.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Payment Events
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose which payment events you want to be notified about
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
            {/* Left Column - Payment Options */}
            <div className="space-y-4">
              {paymentOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = paymentAndBilling.option[option.key as keyof PaymentAndBillingNotificationOptions];

                return (
                  <div
                    key={option.key}
                    className={`
                      p-4 rounded-xl border transition-all duration-200
                      ${isActive
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`
                          p-2 rounded-lg transition-colors duration-200
                          ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}
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
                const isActive = paymentAndBilling.notificationType[option.key as keyof NotificationType];

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
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"></div>
              <span className="text-sm">Saving preferences...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PaymentAndSubscription;