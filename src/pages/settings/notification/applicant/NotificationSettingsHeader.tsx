import { useNavMenuStore } from "../../../../store/useNavMenuStore.ts";
import { RiNotification2Line, RiAccountCircleLine } from "react-icons/ri";
import { MdOutlinePrivacyTip, MdOutlineUnsubscribe } from "react-icons/md";

interface SettingConfig {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const NotificationSettingsHeader = () => {
  const { settings } = useNavMenuStore();

  const settingsConfig: SettingConfig[] = [
    {
      key: "notification",
      title: "Notification Settings",
      icon: RiNotification2Line,
      description: "Manage your notification preferences and alerts",
    },
    {
      key: "subscription",
      title: "Subscription Settings",
      icon: MdOutlineUnsubscribe,
      description: "View and manage your subscription plans",
    },
    {
      key: "account",
      title: "Account Settings",
      icon: RiAccountCircleLine,
      description: "Update your personal information and preferences",
    },
    {
      key: "privacy",
      title: "Privacy Settings",
      icon: MdOutlinePrivacyTip,
      description: "Control your privacy and data sharing preferences",
    },
  ];

  const getCurrentSetting = (): SettingConfig | undefined => {
    return settingsConfig.find((setting) => settings[setting.key as keyof typeof settings]);
  };

  const currentSetting = getCurrentSetting();

  if (!currentSetting) {
    return null;
  }

  const IconComponent = currentSetting.icon;

  return (
    <header className="sticky top-0 z-10 hidden h-[101px] w-full items-center justify-between rounded-t-[16px] bg-gradient-to-r from-[#6438C2] to-[#7c4ddd] px-10 shadow-lg md:flex">
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-white leading-tight">
            {currentSetting.title}
          </h1>
          <p className="text-purple-100 text-sm font-medium mt-1">
            {currentSetting.description}
          </p>
        </div>
      </div>

      {/* Decorative element */}
      <div className="hidden lg:flex items-center space-x-2">
        <div className="h-2 w-2 rounded-full bg-white/30"></div>
        <div className="h-2 w-2 rounded-full bg-white/50"></div>
        <div className="h-2 w-2 rounded-full bg-white/70"></div>
      </div>
    </header>
  );
};

export default NotificationSettingsHeader;