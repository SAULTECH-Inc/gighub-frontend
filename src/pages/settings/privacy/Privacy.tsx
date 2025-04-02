import ToggleSwitch from "../../../components/common/ToggleSwitch.tsx";
import {useCallback, useEffect} from "react";
import {PrivacyOptions, useSettingsStore} from "../../../store/useSettingsStore.ts";
import {debounce} from "lodash";
import {toast} from "react-toastify"; // Imported image

const Privacy = () => {
    const viewers = ["publicProfile", "onlyEmployers", "onlyMe", "onlyMyNetwork"];
    const {applicantSettings, privacy, setPrivacy, updatePrivacy} = useSettingsStore();


    useEffect(() => {
        if (applicantSettings) {
            setPrivacy(applicantSettings.privacy);
        }
    }, [applicantSettings]);


    const debouncedUpdate = useCallback(debounce(async (settings: PrivacyOptions) => {
        const response = await updatePrivacy(settings);
        if (response) {
            setPrivacy(response);
        } else {
            toast.error("Failed to update application status notification settings");
        }
    }, 500), [privacy]);

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
    }


    const handlePrivacySettingsToggle = (item: string) => {
        const updatedSettings = {
            ...privacy, [item]: !privacy[item as keyof PrivacyOptions]
        };
        setPrivacy(updatedSettings);
        debouncedUpdate(updatedSettings);
    }
    return (<div className="w-[95%] md:w-[90%] flex flex-col self-center py-10 font-lato">
            {/* Title */}
            <h2 className="text-black font-bold text-[24px] text-left text-xl">
                Privacy Settings
            </h2>

            {/* Privacy Box */}
            <div
                className="bg-white border border-[#E6E6E6] rounded-[16px] w-full min-h-[265px] flex flex-col items-start py-6 px-4 md:px-8 mt-4">
                {/* Two Column Headings */}
                <div className="grid grid-cols-2 w-full">
                    <h3 className="text-black text-md font-bold">Who can view my profile</h3>
                </div>

                {/* Horizontal Rule */}
                <hr className="w-full border-t border-[#E6E6E6] my-3"/>

                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-x-8 px-2 py-8">
                    {/* Left Column - Application Status */}
                    <div className="w-full flex-col space-y-4">
                        {viewers.map((item, index) => (<label key={index} className="flex items-center justify-between">
                                <span
                                    className="font-bold text-[16px] text-[#8E8E8E]">{getPrivacySettingStateFields(item)}</span>
                                <ToggleSwitch
                                    isOn={privacy[item as keyof PrivacyOptions]}
                                    onToggle={() => handlePrivacySettingsToggle(item)}
                                />
                            </label>))}
                    </div>
                </div>
            </div>
        </div>);
};

export default Privacy;
