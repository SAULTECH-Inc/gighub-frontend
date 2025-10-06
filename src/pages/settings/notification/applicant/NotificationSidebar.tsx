import BackIcon from "../../../../assets/images/arrow-left-02.png";
import { useNavMenuStore } from "../../../../store/useNavMenuStore.ts";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { RiNotification2Line } from "react-icons/ri";
import { TbUserEdit } from "react-icons/tb";
import { MdOutlineUnsubscribe } from "react-icons/md";
import { MdAutoMode } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../store/useAuth.ts";
import { UserType } from "../../../../utils/enums.ts";

interface MenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  userTypes?: UserType[]; // Optional: restrict to certain user types
}

const NotificationSidebar = () => {
  const { settings, toggleSetting } = useNavMenuStore();
  const { userType } = useAuth();
  const navigate = useNavigate();

  const getDashboardRoute = () => {
    return userType === UserType.EMPLOYER
      ? "/employer/dashboard"
      : "/applicant/dashboard";
  };

  const allMenuItems: MenuItem[] = [
    {
      key: "account",
      label: "Account",
      icon: TbUserEdit,
      isActive: settings.account,
    },
    {
      key: "notification",
      label: "Notification",
      icon: RiNotification2Line,
      isActive: settings.notification,
    },
    {
      key: "autoApply",
      label: "Auto Apply",
      icon: MdAutoMode,
      isActive: settings.autoApply,
      userTypes: [UserType.APPLICANT], // Only show for applicants
    },
    {
      key: "privacy",
      label: "Privacy",
      icon: MdOutlinePrivacyTip,
      isActive: settings.privacy,
    },
    {
      key: "subscription",
      label: "Subscription",
      icon: MdOutlineUnsubscribe,
      isActive: settings.subscription,
    },
  ];

  // Filter menu items based on user type
  const menuItems = allMenuItems.filter(
    (item) => !item.userTypes || item.userTypes.includes(userType as UserType),
  );

  const handleMenuItemClick = (key: string) => {
    toggleSetting(key as keyof typeof settings);
  };

  const handleBackClick = () => {
    navigate(getDashboardRoute());
  };

  return (
    <aside className="font-lato hidden h-fit max-h-[737px] w-full flex-col rounded-[16px] border border-gray-100 bg-white p-6 shadow-sm lg:flex">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="group mb-6 flex items-center font-semibold text-purple-700 transition-colors duration-200 hover:text-purple-800"
        aria-label="Go back to dashboard"
      >
        <img
          src={BackIcon}
          alt=""
          className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
        />
        <span>Back</span>
      </button>

      {/* Settings Title */}
      <h2 className="mb-6 text-xl font-bold text-gray-900">Settings</h2>

      {/* Menu Items */}
      <nav>
        <ul className="flex flex-col space-y-2" role="list">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.key}>
                <button
                  onClick={() => handleMenuItemClick(item.key)}
                  className={`flex w-full items-center rounded-lg p-3 transition-all duration-200 ${
                    item.isActive
                      ? "bg-purple-50 text-[#6438C2] shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#6438C2]"
                  } `}
                  aria-pressed={item.isActive}
                  aria-label={`${item.label} settings`}
                >
                  <IconComponent
                    className={`mr-3 h-5 w-5 transition-colors duration-200 ${item.isActive ? "text-[#6438C2]" : "text-gray-500"} `}
                  />
                  <span className="font-medium">{item.label}</span>
                  {item.key === "autoApply" && (
                    <span className="ml-auto rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-600">
                      New
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Auto Apply Status Indicator (for applicants only) */}
      {userType === UserType.APPLICANT && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="rounded-lg bg-blue-50 p-3">
            <div className="flex items-center">
              <MdAutoMode className="mr-2 h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Auto Apply
              </span>
            </div>
            <p className="mt-1 text-xs text-blue-700">
              Status: Active • 3 applications today
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default NotificationSidebar;
