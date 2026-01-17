import React from "react";
import { FilterIcon, Setting } from "../assets/icons";
import NotificationTemplate from "../components/ui/NotificationTemplate";
import { UserType } from "../utils/enums.ts";
import TopNavBar from "../components/layouts/TopNavBar.tsx";
import {
  applicantNavBarItemMap,
  applicantNavItems,
  applicantNavItemsMobile,
  employerNavBarItemMap,
  employerNavItems,
  employerNavItemsMobile,
} from "../utils/constants.ts";
import { USER_TYPE } from "../utils/helpers.ts";
import { useNotificationStore } from "../store/useNotificationStore.ts";
import {
  deleteNotification,
  markAllNotificationsAsRead,
  markAsViewed,
} from "../services/api";
import { useAuth } from "../store/useAuth.ts";
import { NotificationItem } from "../utils/types";
import { showErrorToast } from "../utils/toastConfig.tsx";

const Notification: React.FC = () => {
  const { applicant, employer } = useAuth();
  const { notifications, setNotifications } = useNotificationStore();
  const [filterKeyword, setFilterKeyword] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest">(
    "newest",
  );
  const [notificationMessages, setNotificationMessages] =
    React.useState<NotificationItem[]>(notifications);
  const [showSettingsDropdown, setShowSettingsDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSettingsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    let result = [...notifications];

    if (filterKeyword) {
      result = result.filter(
        (notification) =>
          notification.title
            .toLowerCase()
            .includes(filterKeyword.toLowerCase()) ||
          notification.content
            .toLowerCase()
            .includes(filterKeyword.toLowerCase()),
      );
    }

    result.sort((a, b) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setNotificationMessages(result);
  }, [filterKeyword, sortOrder, notifications]);

  const handleDeleteNotification = async (id: string | number | undefined) => {
    try {
      const notificationId = id as string;
      const response = await deleteNotification(
        notificationId,
        applicant?.id || employer?.id || 0,
      );
      if (response.statusCode === 200) {
        const updatedNotifications = notificationMessages.filter(
          (notification) => notification.id !== notificationId,
        );
        setNotifications(updatedNotifications);
        console.log(`Deleted notification with ID: ${id}`);
      }
    } catch (e) {
      console.error(`Error deleting notification with ID: ${id}`, e);
      showErrorToast(`Failed to delete notification with ID: ${id}`);
    }
  };

  const handleViewPost = async (
    notificationId: string | number | undefined,
  ) => {
    console.log(`Viewing notification post with ID: ${notificationId}`);
    const response = await markAsViewed(notificationId as string);
    if (response.statusCode === 200) {
      const updatedNotifications = notificationMessages.map((notification) =>
        notification.id === notificationId
          ? { ...notification, viewed: true }
          : notification,
      );
      setNotifications(updatedNotifications);
      console.log(`Marked notification with ID: ${notificationId} as viewed`);
    } else {
      console.error(
        `Failed to mark notification with ID: ${notificationId} as viewed`,
      );
    }
  };

  const markAllAsRead = async () => {
    const updated = notificationMessages.map((n) => ({ ...n, viewed: true }));
    setNotifications(updated);
    setShowSettingsDropdown(false);
    const response = await markAllNotificationsAsRead(
      updated.map((n) => n.id as string),
      applicant?.id || employer?.id || 0,
    );
    if (response.statusCode !== 200) {
      showErrorToast("Failed to mark all notifications as read");
      return;
    }
    setNotificationMessages(updated);
    console.log("All notifications marked as read");
  };

  return (
    <div>
      {USER_TYPE === UserType.EMPLOYER ? (
        <TopNavBar
          navItems={employerNavItems}
          navItemsMobile={employerNavItemsMobile}
          navbarItemsMap={employerNavBarItemMap}
        />
      ) : (
        <TopNavBar
          navItems={applicantNavItems}
          navItemsMobile={applicantNavItemsMobile}
          navbarItemsMap={applicantNavBarItemMap}
        />
      )}

      <div className="flex min-h-screen w-full flex-col items-center gap-6 bg-[#F7F8FA]">
        <div className="w-full sm:w-[96%]">
          <div className="mt-[14px] flex w-full items-center justify-between rounded-[16px] px-[29px] py-[12px] md:bg-white">
            <p className="text-2xl font-bold text-[#000000]">Notification</p>

            {/* Desktop Filter + Settings */}
            <div
              className="hidden items-center gap-10 md:flex"
              ref={dropdownRef}
            >
              <input
                type="text"
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
                className="flex w-[400px] rounded-[10px] border border-[#E6E6E6] bg-[#F7F7F7] px-[20px] py-[12px] focus:border-[#E6E6E6] focus:ring-0 focus:outline-none"
                placeholder="Filter Notification"
              />
              <img
                className="cursor-pointer"
                src={Setting}
                alt="Setting icon"
                onClick={() => setShowSettingsDropdown((prev) => !prev)}
              />
            </div>

            {/* Mobile Filter (only icon) */}
            <div
              className="flex rounded-[10px] border border-[#E6E6E6] bg-white px-9 py-3 md:hidden"
              ref={dropdownRef}
            >
              <img
                src={FilterIcon}
                alt="Filter Icon"
                className="cursor-pointer"
                onClick={() => setShowSettingsDropdown((prev) => !prev)}
              />
            </div>

            {/* Shared Dropdown */}
            {showSettingsDropdown && (
              <div
                className="absolute right-5 z-30 mt-52 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
                onMouseDown={(e) => e.stopPropagation()} // prevent outside click handler
              >
                <div className="px-4 pb-2">
                  <label className="mb-1 block text-sm font-medium">
                    Sort by
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) =>
                      setSortOrder(e.target.value as "newest" | "oldest")
                    }
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => {
                    console.log("Navigate to Notification Preferences");
                    setShowSettingsDropdown(false);
                  }}
                >
                  Notification Preferences
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => setShowSettingsDropdown(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 bg-white px-[26px] py-[25px] sm:w-[96%]">
          <div className="flex w-full flex-col gap-4">
            {notificationMessages.map((notification, index) => (
              <NotificationTemplate
                key={index}
                notification={notification}
                deleteNotification={handleDeleteNotification}
                viewJobPost={handleViewPost}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
