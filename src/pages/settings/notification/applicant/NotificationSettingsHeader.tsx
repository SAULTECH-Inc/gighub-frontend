import { useNavMenuStore } from "../../../../store/useNavMenuStore.ts";
import { RiNotification2Line, RiAccountCircleLine } from "react-icons/ri";
import {
  MdOutlinePrivacyTip,
  MdOutlineUnsubscribe,
  MdAutoMode,
} from "react-icons/md";
import { useAuth } from "../../../../store/useAuth.ts";
import { UserType } from "../../../../utils/enums.ts";

interface SettingConfig {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  userTypes?: UserType[]; // Optional: restrict to certain user types
}

const NotificationSettingsHeader = () => {
  const { settings } = useNavMenuStore();
  const { userType } = useAuth();

  const allSettingsConfig: SettingConfig[] = [
    {
      key: "notification",
      title: "Notification Settings",
      icon: RiNotification2Line,
      description: "Manage your notification preferences and alerts",
    },
    {
      key: "autoApply",
      title: "Auto Apply Settings",
      icon: MdAutoMode,
      description:
        "Configure automatic job application preferences and criteria",
      userTypes: [UserType.APPLICANT], // Only show for applicants
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

  // Filter settings config based on user type
  const settingsConfig = allSettingsConfig.filter(
    (setting) =>
      !setting.userTypes || setting.userTypes.includes(userType as UserType),
  );

  const getCurrentSetting = (): SettingConfig | undefined => {
    return settingsConfig.find(
      (setting) => settings[setting.key as keyof typeof settings],
    );
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
          <h1 className="text-[28px] leading-tight font-bold text-white">
            {currentSetting.title}
          </h1>
          <p className="mt-1 text-sm font-medium text-purple-100">
            {currentSetting.description}
          </p>
          {/* Auto apply status indicator */}
          {currentSetting.key === "autoApply" && (
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 animate-pulse rounded-full bg-purple-300"></div>
                <span className="text-xs font-medium text-purple-100">
                  Auto Apply Active
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status indicator for auto apply or decorative element for others */}
      <div className="hidden items-center space-x-2 lg:flex">
        {currentSetting.key === "autoApply" ? (
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-2 text-purple-100">
              <div className="text-right">
                <p className="text-xs font-medium">Match Threshold</p>
                <p className="text-sm font-bold">75%</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <span className="text-xs font-bold text-white">75</span>
              </div>
            </div>
          </div>
        ) : (
          /* Default decorative elements */
          <>
            <div className="h-2 w-2 rounded-full bg-white/30"></div>
            <div className="h-2 w-2 rounded-full bg-white/50"></div>
            <div className="h-2 w-2 rounded-full bg-white/70"></div>
          </>
        )}
      </div>
    </header>
  );
};

export default NotificationSettingsHeader;
