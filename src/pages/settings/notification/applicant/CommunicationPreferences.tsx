import { useCallback, useEffect } from "react";
import ToggleSwitch from "../../../../components/common/ToggleSwitch.tsx";
import {
  CommunicationNotification,
  CommunicationNotificationOption,
  NotificationType,
  useSettingsStore,
} from "../../../../store/useSettingsStore.ts";
import { debounce } from "lodash";
import { toast } from "react-toastify";

const CommunicationPreferences = () => {
  const {
    applicantSettings,
    communication,
    setCommunication,
    updateCommunication,
  } = useSettingsStore();
  const notificationTypes = ["all", "emailNotification", "pushNotification"];
  const communicationNotificationState = ["promotionalOffers", "fromPlatform"];

  useEffect(() => {
    if (applicantSettings) {
      setCommunication(applicantSettings.notifications.options.communication);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantSettings]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce(async (settings: CommunicationNotification) => {
      const response = await updateCommunication(settings);
      if (response) {
        setCommunication(response);
      } else {
        toast.error(
          "Failed to update application status notification settings",
        );
      }
    }, 500),
    [communication],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel(); // prevent memory leak
    };
  }, [debouncedUpdate]);

  const getCommunicationStateField = (item: string) => {
    switch (item) {
      case "promotionalOffers":
        return "From employers";
      default:
        return "From platform";
    }
  };

  const getNotificationTypeStateField = (item: string) => {
    switch (item) {
      case "emailNotification":
        return "Email Notification";
      case "pushNotification":
        return "Push Notification";
      default:
        return "All";
    }
  };

  const handleNotificationTypeToggle = (item: string) => {
    const updatedSettings = {
      ...communication,
      notificationType: {
        ...communication.notificationType,
        [item]: !communication.notificationType[item as keyof NotificationType],
      },
    };
    setCommunication(updatedSettings);
    debouncedUpdate(updatedSettings);
  };

  const handleCommunicationSettingsToggle = (item: string) => {
    const updatedSettings = {
      ...communication,
      option: {
        ...communication.option,
        [item]:
          !communication.option[item as keyof CommunicationNotificationOption],
      },
    };
    setCommunication(updatedSettings);
    debouncedUpdate(updatedSettings);
  };

  return (
    <div className="font-lato flex w-[95%] flex-col self-center py-10 md:w-[90%]">
      <hr className="mb-4 w-full border-t border-[#E6E6E6]" />

      {/* Page Title */}
      <h2 className="text-left text-xl text-[24px] font-bold text-black">
        Communication Preferences
      </h2>

      {/* White Box Container */}
      <div className="mt-4 flex min-h-[200px] w-full flex-col items-start rounded-[16px] border border-[#E6E6E6] bg-white px-4 py-6 md:px-8">
        {/* Header Titles */}
        <div className="text-md grid w-full grid-cols-2 font-bold text-black">
          <h3>Receive Promotional Offers</h3>
          <h3>Notification Type</h3>
        </div>

        {/* Horizontal Rule */}
        <hr className="my-3 w-full border-t border-[#E6E6E6]" />

        {/* Two-Column Layout */}
        <div className="grid w-full grid-cols-2 gap-x-8 px-2 py-8">
          {/* Left Column - Promotional Offers */}
          <div className="w-full">
            <div className="mt-2 space-y-4">
              {communicationNotificationState.map((item, index) => (
                <label
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-[16px] text-[#8E8E8E]">
                    {getCommunicationStateField(item)}
                  </span>
                  <ToggleSwitch
                    isOn={
                      communication.option[
                        item as keyof CommunicationNotificationOption
                      ]
                    }
                    onToggle={() => handleCommunicationSettingsToggle(item)}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Right Column - Notification Type */}
          <div className="w-full">
            <div className="mt-2 space-y-4">
              {notificationTypes.map((item, index) => (
                <label
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-[16px] text-[#8E8E8E]">
                    {getNotificationTypeStateField(item)}
                  </span>
                  <ToggleSwitch
                    isOn={
                      communication.notificationType[
                        item as keyof NotificationType
                      ]
                    }
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
};

export default CommunicationPreferences;
