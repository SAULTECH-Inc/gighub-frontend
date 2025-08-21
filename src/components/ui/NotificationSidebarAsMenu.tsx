import { useNavMenuStore } from "../../store/useNavMenuStore.ts";
import { TbUserEdit } from "react-icons/tb";
import { RiNotification2Line } from "react-icons/ri";
import { MdOutlinePrivacyTip, MdOutlineUnsubscribe } from "react-icons/md";
import React, { useEffect } from "react";

interface MenuStateProp {
  open: boolean;
  toggle: () => void;
}

interface MenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
}

const NotificationSidebarAsMenu: React.FC<MenuStateProp> = ({
                                                              open = false,
                                                              toggle,
                                                            }) => {
  const { settings, toggleSetting } = useNavMenuStore();

  // Close menu when clicking outside (if needed)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (open && !target.closest('[data-menu="sidebar"]')) {
        // Uncomment if you want to close on outside click
        // toggle();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, toggle]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const menuItems: MenuItem[] = [
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

  const handleMenuItemClick = (key: string) => {
    toggleSetting(key as keyof typeof settings);
    toggle();
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggle}
          aria-hidden="true"
        />
      )}

      {/* Menu */}
      <div
        data-menu="sidebar"
        className={`
          fixed inset-x-0 top-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden
          ${open ? "translate-y-0" : "-translate-y-full"}
          font-lato h-auto max-h-screen w-full flex-col rounded-b-[16px] bg-white p-6 shadow-xl overflow-y-auto
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Settings menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav>
          <ul className="flex flex-col space-y-2" role="list">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.key}>
                  <button
                    onClick={() => handleMenuItemClick(item.key)}
                    className={`
                      flex w-full items-center p-4 rounded-xl transition-all duration-200
                      ${
                      item.isActive
                        ? "text-[#6438C2] bg-purple-50 shadow-sm border border-purple-100"
                        : "text-gray-700 hover:text-[#6438C2] hover:bg-gray-50 border border-transparent"
                    }
                    `}
                    aria-pressed={item.isActive}
                    aria-label={`${item.label} settings`}
                  >
                    <IconComponent
                      className={`
                        mr-4 h-6 w-6 transition-colors duration-200
                        ${item.isActive ? "text-[#6438C2]" : "text-gray-500"}
                      `}
                    />
                    <span className="font-semibold text-lg">{item.label}</span>

                    {/* Active indicator */}
                    {item.isActive && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-[#6438C2]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer spacing */}
        <div className="h-6" />
      </div>
    </>
  );
};

export default NotificationSidebarAsMenu;