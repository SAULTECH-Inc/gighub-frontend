import BackIcon from "../../../../assets/images/arrow-left-02.png";
import { useNavMenuStore } from "../../../../store/useNavMenuStore.ts";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { RiNotification2Line } from "react-icons/ri";
import { TbUserEdit } from "react-icons/tb";
import { MdOutlineUnsubscribe } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const NotificationSidebar = () => {
  const { settings, toggleSetting } = useNavMenuStore();
  const navigate = useNavigate();
  return (
    <div className="font-lato hidden h-[737px] w-full flex-col rounded-[16px] bg-white p-6 shadow lg:flex">
      {/* Back Button */}
      <div
        onClick={() => {
          navigate("/applicant/dashboard");
        }}
        className="mb-6 flex cursor-pointer items-center font-bold text-purple-700"
      >
        <img src={BackIcon} alt="Back" className="mr-2 h-4 w-4 font-bold" />
        <span>Back</span>
      </div>

      {/* Settings Title */}
      <h2 className="mb-6 text-xl font-bold">Settings</h2>

      {/* Menu Items */}
      <ul className="flex flex-col gap-y-5">
        {/* Active Item */}
        <li
          onClick={() => toggleSetting("account")}
          className={`flex items-center ${settings.account ? "text-[#6438C2]" : "text-gray-700"} cursor-pointer hover:text-[#6438C2]`}
        >
          <TbUserEdit
            className={`${settings.account ? "text-[#6438C2]" : "text-gray-700"} mr-3 h-5 w-5`}
          />
          <span>Account</span>
        </li>

        {/* Inactive Items */}
        <li
          onClick={() => toggleSetting("notification")}
          className={`flex items-center ${settings.notification ? "text-[#6438C2]" : "text-gray-700"} cursor-pointer hover:text-[#6438C2]`}
        >
          <RiNotification2Line
            className={`${settings.notification ? "text-[#6438C2]" : "text-gray-700"} mr-3 h-5 w-5`}
          />
          <span>Notification</span>
        </li>

        <li
          onClick={() => toggleSetting("privacy")}
          className={`flex items-center ${settings.privacy ? "text-[#6438C2]" : "text-gray-700"} cursor-pointer hover:text-[#6438C2]`}
        >
          <MdOutlinePrivacyTip
            className={`${settings.privacy ? "text-[#6438C2]" : "text-gray-700"} mr-3 h-5 w-5`}
          />
          {/*<img src={PrivacyIcon} alt="Privacy" className="w-5 h-5 mr-3" />*/}
          <span>Privacy</span>
        </li>

        <li
          onClick={() => toggleSetting("subscription")}
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

export default NotificationSidebar;
