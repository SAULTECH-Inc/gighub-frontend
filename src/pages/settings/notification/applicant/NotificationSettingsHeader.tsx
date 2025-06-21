import { useNavMenuStore } from "../../../../store/useNavMenuStore.ts";

const NotificationSettingsHeader = () => {
  const { settings } = useNavMenuStore();
  return (
    <div className="sticky hidden h-[101px] w-full items-center rounded-t-[16px] bg-[#6438C2] pl-10 md:flex">
      <h1 className="text-[32px] font-bold text-white">
        {settings.notification && "Notification Settings"}
        {settings.subscription && "Subscription Settings"}
        {settings.account && "Account Settings"}
        {settings.privacy && "Privacy Settings"}
      </h1>
    </div>
  );
};

export default NotificationSettingsHeader;
