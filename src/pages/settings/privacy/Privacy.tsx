import ToggleSwitch from "../../../components/common/ToggleSwitch.tsx";
import { useCallback, useEffect } from "react";
import {
  PrivacyOptions,
  useSettingsStore,
} from "../../../store/useSettingsStore.ts";
import { debounce } from "lodash";
import { toast } from "react-toastify"; // Imported image

const Privacy = () => {
  const viewers = ["publicProfile", "onlyEmployers", "onlyMe", "onlyMyNetwork"];
  const { applicantSettings, privacy, setPrivacy, updatePrivacy } =
    useSettingsStore();

  useEffect(() => {
    if (applicantSettings) {
      setPrivacy(applicantSettings.privacy);
    }
  }, [applicantSettings, setPrivacy]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce(async (settings: PrivacyOptions) => {
      const response = await updatePrivacy(settings);
      if (response) {
        setPrivacy(response);
      } else {
        toast.error(
          "Failed to update application status notification settings",
        );
      }
    }, 500),
    [privacy],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel(); // prevent memory leak
    };
  }, [debouncedUpdate]);
  const getPrivacySettingStateFields = (item: string) => {
    switch (item) {
      case "publicProfile":
        return "Public (anyone can see)";
      case "onlyEmployers":
        return "Employers Only";
      case "onlyMe":
        return "Private (Only Visible to me)";
      default:
        return "Ony My Network";
    }
  };

  const handlePrivacySettingsToggle = (item: string) => {
    const updatedSettings = {
      ...privacy,
      [item]: !privacy[item as keyof PrivacyOptions],
    };
    setPrivacy(updatedSettings);
    debouncedUpdate(updatedSettings);
  };
  return (
    <div className="flex w-[95%] flex-col self-center py-10 font-lato md:w-[90%]">
      {/* Title */}
      <h2 className="text-left text-[24px] text-xl font-bold text-black">
        Privacy Settings
      </h2>

      {/* Privacy Box */}
      <div className="mt-4 flex min-h-[265px] w-full flex-col items-start rounded-[16px] border border-[#E6E6E6] bg-white px-4 py-6 md:px-8">
        {/* Two Column Headings */}
        <div className="grid w-full grid-cols-2">
          <h3 className="text-md font-bold text-black">
            Who can view my profile
          </h3>
        </div>

        {/* Horizontal Rule */}
        <hr className="my-3 w-full border-t border-[#E6E6E6]" />

        {/* Two-Column Layout */}
        <div className="grid w-full grid-cols-1 gap-x-8 px-2 py-8 md:grid-cols-2">
          {/* Left Column - Application Status */}
          <div className="w-full flex-col space-y-4">
            {viewers.map((item, index) => (
              <label key={index} className="flex items-center justify-between">
                <span className="text-[16px] font-bold text-[#8E8E8E]">
                  {getPrivacySettingStateFields(item)}
                </span>
                <ToggleSwitch
                  isOn={privacy[item as keyof PrivacyOptions]}
                  onToggle={() => handlePrivacySettingsToggle(item)}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
