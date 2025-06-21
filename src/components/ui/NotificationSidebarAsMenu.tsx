import { useNavMenuStore } from "../../store/useNavMenuStore.ts";

import { TbUserEdit } from "react-icons/tb";
import { RiNotification2Line } from "react-icons/ri";
import { MdOutlinePrivacyTip, MdOutlineUnsubscribe } from "react-icons/md";
import React from "react";
interface MenuStateProp {
  open: boolean;
  toggle: () => void;
}
const NotificationSidebarAsMenu: React.FC<MenuStateProp> = ({
  open = false,
  toggle,
}) => {
  const { settings, toggleSetting } = useNavMenuStore();
  return (
    <div
      className={` ${open ? "flex" : "hidden"} h-[737px] w-full flex-col rounded-[16px] bg-white p-6 font-lato shadow`}
    >
      {/* Back Button */}

      {/* Settings Title */}
      <h2 className="mb-6 text-xl font-bold">Settings</h2>

      {/* Menu Items */}
      <ul className="flex flex-col gap-y-5">
        {/* Active Item */}
        <li
          onClick={() => {
            toggleSetting("account");
            toggle();
          }}
          className={`flex items-center ${settings.account ? "text-[#6438C2]" : "text-gray-700"} cursor-pointer hover:text-[#6438C2]`}
        >
          <TbUserEdit
            className={`${settings.account ? "text-[#6438C2]" : "text-gray-700"} mr-3 h-5 w-5`}
          />
          <span>Account</span>
        </li>

        {/* Inactive Items */}
        <li
          onClick={() => {
            toggleSetting("notification");
            toggle();
          }}
          className={`flex items-center ${settings.notification ? "text-[#6438C2]" : "text-gray-700"} cursor-pointer hover:text-[#6438C2]`}
        >
          <RiNotification2Line
            className={`${settings.notification ? "text-[#6438C2]" : "text-gray-700"} mr-3 h-5 w-5`}
          />
          <span>Notification</span>
        </li>

        <li
          onClick={() => {
            toggleSetting("privacy");
            toggle();
          }}
          className={`flex items-center ${settings.privacy ? "text-[#6438C2]" : "text-gray-700"} cursor-pointer hover:text-[#6438C2]`}
        >
          <MdOutlinePrivacyTip
            className={`${settings.privacy ? "text-[#6438C2]" : "text-gray-700"} mr-3 h-5 w-5`}
          />
          {/*<img src={PrivacyIcon} alt="Privacy" className="w-5 h-5 mr-3" />*/}
          <span>Privacy</span>
        </li>

        <li
          onClick={() => {
            toggleSetting("subscription");
            toggle();
          }}
          className={`flex items-center ${settings.subscription ? "text-[#6438C2]" : "text-gray-700"} cursor-pointer hover:text-[#6438C2]`}
        >
          <MdOutlineUnsubscribe
            className={`${settings.subscription ? "text-[#6438C2]" : "text-gray-700"} mr-3 h-5 w-5`}
          />
          <span>Subscription</span>
        </li>
      </ul>
    </div>
  );
};
export default NotificationSidebarAsMenu;
