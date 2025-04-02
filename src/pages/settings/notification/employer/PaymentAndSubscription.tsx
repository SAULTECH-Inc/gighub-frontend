import {NotificationType, PaymentAndBillingNotification, PaymentAndBillingNotificationOptions,
    useSettingsStore
} from "../../../../store/useSettingsStore.ts";
import {useCallback, useEffect} from "react";
import {USER_TYPE} from "../../../../utils/helpers.ts";
import {UserType} from "../../../../utils/enums.ts";
import {debounce} from "lodash";
import {toast} from "react-toastify";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";

const PaymentAndSubscription = () => {
    // State to track toggle status for each item
    const {
        applicantSettings,
        employerSettings,
        paymentAndBilling,
        setPaymentAndBilling,
        updatePaymentAndBilling
    } = useSettingsStore();
    const notificationTypes = ["all", "emailNotification", "pushNotification"];
    const interviewUpdates = [
        "subscriptionDue",
        "subscriptionCancelled",
        "subscriptionExpired",
        "subscriptionSuccessful"
    ];

    useEffect(() => {
        if (applicantSettings && USER_TYPE === UserType.APPLICANT) {
            setPaymentAndBilling(applicantSettings.notifications.options.paymentAndBilling);
        } else {
            setPaymentAndBilling(employerSettings.notifications.options.paymentAndBilling);
        }
    }, [applicantSettings]);


    const debouncedUpdate = useCallback(
        debounce(async (settings: PaymentAndBillingNotification) => {
            const response = await updatePaymentAndBilling(settings);
            if (response) {
                setPaymentAndBilling(response);
            } else {
                toast.error("Failed to update application status notification settings");
            }
        }, 500),
        [paymentAndBilling]
    );

    useEffect(() => {
        return () => {
            debouncedUpdate.cancel(); // prevent memory leak
        };
    }, [debouncedUpdate]);

    const getInterviewInvitationStateField = (item: string) => {
        switch (item) {
            case "subscriptionDue":
                return "Notify me when a subscription payment is due";
            case "subscriptionCancelled":
                return "Notify me when a subscription is cancelled";
            case "subscriptionExpired":
                return "Notify me when a subscription is expired";
            default:
                return "Notify me when a subscription payment is successful";
        }
    }

    const getNotificationTypeStateField = (item: string) => {
        switch (item) {
            case "emailNotification":
                return "Email Notification";
            case "pushNotification":
                return "Push Notification";
            default:
                return "All";
        }
    }
    const handleNotificationTypeToggle = (item: string) => {
        const updatedSettings = {
            ...paymentAndBilling,
            notificationType: {
                ...paymentAndBilling.notificationType,
                [item]: !paymentAndBilling.notificationType[item as keyof NotificationType]
            }
        };
        setPaymentAndBilling(updatedSettings);
        debouncedUpdate(updatedSettings);
    };

    const handleInterviewInvitationToggle = (item: string) => {
        const updatedSettings = {
            ...paymentAndBilling,
            option: {
                ...paymentAndBilling.option,
                [item]: !paymentAndBilling.option[item as keyof PaymentAndBillingNotificationOptions]
            }
        };
        setPaymentAndBilling(updatedSettings);
        debouncedUpdate(updatedSettings);
    }

    return (
        <div className="w-[90%] flex flex-col self-center py-10 font-lato">
            <hr className="w-full border-t border-[#E6E6E6] mb-4"/>

            {/* Page Title */}
            <h2 className="text-black font-bold text-[24px] text-left text-xl">
                Payment and Billing
            </h2>

            {/* White Box Container */}
            <div
                className="bg-white border border-[#E6E6E6] rounded-[16px] w-full min-h-[200px] flex flex-col items-start py-6 px-8 mt-4">
                {/* Header Titles */}
                <div className="grid grid-cols-2 w-full font-bold text-md text-black">
                    <h3>Notify me:</h3>
                    <h3>Notification Type</h3>
                </div>

                {/* Horizontal Rule */}
                <hr className="w-full border-t border-[#E6E6E6] my-3"/>

                {/* Two-Column Layout */}
                <div className="grid grid-cols-2 w-full gap-x-8 p-8">
                    {/* Left Column - Interview Updates */}
                    <div className="w-full">
                        <div className="space-y-4 mt-2">
                            {interviewUpdates.map((item, index) => (
                                <label key={index} className="flex items-center justify-between">
                                    <span
                                        className="text-[16px] text-[#8E8E8E]">{getInterviewInvitationStateField(item)}</span>
                                    <ToggleSwitch
                                        isOn={paymentAndBilling.option[item as keyof PaymentAndBillingNotificationOptions]}
                                        onToggle={() => handleInterviewInvitationToggle(item)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Notification Type */}
                    <div className="w-full">
                        <div className="space-y-4 mt-2">
                            {notificationTypes.map((item, index) => (
                                <label key={index} className="flex items-center justify-between">
                                    <span
                                        className="text-[16px] text-[#8E8E8E]">{getNotificationTypeStateField(item)}</span>
                                    <ToggleSwitch
                                        isOn={paymentAndBilling.notificationType[item as keyof NotificationType]}
                                        onToggle={() => handleNotificationTypeToggle(item)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentAndSubscription;
