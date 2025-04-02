import {useNavMenuStore} from "../../../../store/useNavMenuStore.ts";

const NotificationSettingsHeader = () => {
    const {settings} = useNavMenuStore();
    return (
        <div className="hidden sticky w-full h-[101px] bg-[#6438C2] rounded-t-[16px] md:flex items-center pl-10">
            <h1 className="text-white text-[32px] font-bold">
                {settings.notification && "Notification Settings"}
                {settings.subscription && "Subscription Settings"}
                {settings.account && "Account Settings"}
                {settings.privacy && "Privacy Settings"}

            </h1>
        </div>
    );
};

export default NotificationSettingsHeader;
