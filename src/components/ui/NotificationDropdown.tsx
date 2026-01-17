// ===================================
// NotificationDropdown.tsx - REDESIGNED VERSION
// ===================================
import { FC, memo, useEffect, useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { Link } from "react-router-dom";
import NotificationSettingsDropdown from "./NotificationSettingsDropdown.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import { useNotificationStore } from "../../store/useNotificationStore.ts";
import moment from "moment";
import {
  eventTypeColorMap,
  notificationIconMap,
} from "../../utils/constants.ts";
import { getFirstNWords } from "../../utils/helpers.ts";
import { FaBell } from "react-icons/fa";
import { markAsViewed } from "../../services/api";

interface NotificationDropdownProps {
  isMobile?: boolean;
}

const NotificationDropdown: FC<NotificationDropdownProps> = ({
                                                               isMobile = false
                                                             }) => {
  const { isModalOpen, openModal } = useModalStore();
  const { notifications, setNotifications } = useNotificationStore();
  const [notificationMessages, setNotificationMessages] = useState(notifications);
  const [viewedMessageDetails, setViewedMessageDetails] = useState<{
    title: string;
    content: string;
  } | null>(null);

  useEffect(() => {
    if (notifications.length) {
      setNotificationMessages(notifications);
    }
  }, [notifications]);

  const handleViewDetails = async (
    title: string,
    content: string,
    notificationId: string,
  ) => {
    setViewedMessageDetails({ title, content });
    console.log(`Viewing notification post with ID: ${notificationId}`);

    const response = await markAsViewed(notificationId);
    if (response.statusCode === 200) {
      const updatedNotifications = notifications.map((notification) =>
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

  const handleCloseDetails = () => {
    setViewedMessageDetails(null);
  };

  const unreadNotifications = notificationMessages.filter((n) => !n.viewed);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" />
      )}

      {/* Main Dropdown Container */}
      <div
        className={`
          font-lato
          ${isMobile
          ? "fixed left-1/2 top-20 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[360px]"
          : "absolute right-0 top-full mt-2 w-[340px] xl:w-[380px]"
        }
          z-50 rounded-2xl bg-white shadow-2xl border border-gray-100
          flex flex-col max-h-[calc(100vh-140px)]
        `}
      >
        {/* Header */}
        <div className="px-5 xl:px-6 pt-5 xl:pt-6 pb-3.5 xl:pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-base xl:text-lg font-bold text-gray-800">
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              {unreadNotifications.length > 0 && (
                <span className="px-2 xl:px-2.5 py-0.5 text-[10px] xl:text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                  {unreadNotifications.length} new
                </span>
              )}
              <button
                onClick={() => openModal("notification-settings-dropdown")}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <AiOutlineSetting className="text-lg xl:text-xl text-gray-500" />
              </button>
            </div>
          </div>

          {/* Settings Dropdown */}
          {isModalOpen("notification-settings-dropdown") && (
            <div className="absolute top-14 right-6 z-[60]">
              <NotificationSettingsDropdown modalId="notification-settings-dropdown" />
            </div>
          )}
        </div>

        {/* Notification List */}
        <div className="overflow-y-auto flex-1">
          {unreadNotifications.length === 0 ? (
            <div className="px-5 xl:px-6 py-10 xl:py-12 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-gray-100 mb-3 xl:mb-4">
                <FaBell className="w-7 h-7 xl:w-8 xl:h-8 text-gray-400" />
              </div>
              <p className="text-xs xl:text-sm font-medium text-gray-800 mb-1">
                No new notifications
              </p>
              <p className="text-[10px] xl:text-xs text-gray-500">
                You're all caught up!
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {unreadNotifications.slice(0, 5).map((notification, index) => {
                const Icon = notificationIconMap[notification.type] ?? FaBell;
                return (
                  <li key={notification.id || index}>
                    <div className="px-5 xl:px-6 py-3.5 xl:py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          style={{
                            backgroundColor: eventTypeColorMap[notification.type],
                          }}
                          className="flex h-10 w-10 xl:h-11 xl:w-11 flex-shrink-0 items-center justify-center rounded-full"
                        >
                          <Icon className="h-5 w-5 xl:h-6 xl:w-6 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs xl:text-sm font-semibold text-gray-800 mb-0.5">
                            {notification.title}
                          </p>
                          <p className="text-xs xl:text-sm text-gray-600 mb-1.5 line-clamp-2">
                            {getFirstNWords(notification.content, 8)}...
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] xl:text-xs text-gray-400">
                              {moment(notification?.createdAt).fromNow()}
                            </p>
                            <button
                              className="text-[10px] xl:text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(
                                  notification.title,
                                  notification.content,
                                  notification.id as string,
                                ).then(r => r);
                              }}
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer - View All Button */}
        {notifications.length > 5 && (
          <div className="px-5 xl:px-6 py-3.5 xl:py-4 border-t border-gray-100 flex-shrink-0">
            <Link to="/notifications">
              <button className="w-full px-4 py-2 xl:py-2.5 text-xs xl:text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                View All Notifications
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {viewedMessageDetails && (
        <>
          {/* Details Modal Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={handleCloseDetails}
          />

          {/* Details Modal Content */}
          <div
            className={`
              font-lato fixed z-[70]
              ${isMobile
              ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-[360px]"
              : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] xl:w-[440px]"
            }
              rounded-2xl bg-white shadow-2xl border border-gray-100
              max-h-[calc(100vh-100px)] flex flex-col
            `}
          >
            {/* Modal Header */}
            <div className="px-5 xl:px-6 pt-5 xl:pt-6 pb-3.5 xl:pb-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base xl:text-lg font-bold text-gray-800 flex-1">
                  {viewedMessageDetails.title}
                </h3>
                <button
                  onClick={handleCloseDetails}
                  className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-5 xl:px-6 py-4 xl:py-5 overflow-y-auto flex-1">
              <p className="text-xs xl:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {viewedMessageDetails.content}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-5 xl:px-6 py-3.5 xl:py-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={handleCloseDetails}
                className="w-full px-4 py-2 xl:py-2.5 text-xs xl:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default memo(NotificationDropdown);