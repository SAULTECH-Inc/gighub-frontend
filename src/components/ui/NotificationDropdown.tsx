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

const NotificationDropdown: FC = () => {
  const { isModalOpen, openModal } = useModalStore();
  const dividerStyle = { borderColor: "#E6E6E6" };
  const { notifications, setNotifications } = useNotificationStore();
  const [notificationMessages, setNotificationMessages] =
    useState(notifications);
  const [viewedMessageDetails, setViewedMessageDetails] = useState<{
    title: string;
    content: string;
  } | null>(null);

  useEffect(() => {
    //load notifications when the component mounts
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

  return (
    <div className="relative w-full">
      {/*absolute right-0 top-14 w-[352px] bg-white shadow-lg rounded-[16px] z-50 font-lato p-6*/}
      <div
        className="fixed inset-x-0 top-2 z-50 mx-auto w-[95%] md:w-[352px] rounded-[16px] bg-white p-4 font-lato shadow-lg md:absolute md:right-0 md:top-8 md:left-auto md:mx-0 md:translate-x-0">
        <div>
          <div className="relative mb-4 flex items-center justify-between">
            <h3 className="text-gray-800 text-lg font-bold">Notification</h3>
            <button
              onClick={() => {
                openModal("notification-settings-dropdown");
              }}
            >
              <AiOutlineSetting className="text-gray-500 cursor-pointer text-xl" />
            </button>
            {isModalOpen("notification-settings-dropdown") && (
              <NotificationSettingsDropdown modalId="notification-settings-dropdown" />
            )}
          </div>
          <hr style={dividerStyle} className="-mx-4" />
        </div>

        <ul className="mt-4 flex flex-col gap-y-3">
          {notificationMessages
            .filter((n) => !n.viewed)
            .slice(0, 3)
            .map((notification, index) => {
              const Icon = notificationIconMap[notification.type] ?? FaBell;
              return (
                <li key={index} className="relative">
                  <div className="hover:bg-gray-100 flex cursor-pointer items-center justify-between gap-4 p-2">
                    <div
                      style={{
                        backgroundColor: eventTypeColorMap[notification.type],
                      }}
                      className="flex h-[45px] w-[45px] flex-shrink-0 items-center justify-center rounded-full"
                    >
                      {Icon ? (
                        <Icon className="h-[24px] w-[24px] rounded-full text-white" />
                      ) : (
                        <FaBell className="h-[24px] w-[24px] rounded-full text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-gray-800 text-[16px] font-semibold">
                        {notification.title}
                      </p>
                      <p className="text-gray-600 text-[16px]">
                        {getFirstNWords(notification.content, 5).concat("...")}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-[13px] text-[#8E8E8E]">
                          {moment(notification?.createdAt).fromNow()}
                        </p>
                        <button
                          className="text-xs text-purple-600 hover:underline"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await handleViewDetails(
                              notification.title,
                              notification.content,
                              notification.id as string,
                            );
                          }}
                        >
                          View details
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>

        {notifications.length > 3 && (
          <div className="mt-4">
            <hr style={dividerStyle} className="-mx-6 mb-4" />
            <div className="text-center">
              <Link
                to="/notifications"
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
              >
                View all notifications
              </Link>
            </div>
          </div>
        )}
      </div>

      {viewedMessageDetails && (
        <div
          className="fixed inset-x-0 top-[calc(100px)] z-50 mx-auto w-[90%] max-w-[400px] rounded-[16px] bg-white p-4 font-lato shadow-lg md:absolute md:right-[calc(352px+1rem)] md:top-14 md:mx-0">

          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-gray-800 text-lg font-bold">
              {viewedMessageDetails.title} Details
            </h3>
            <button
              onClick={handleCloseDetails}
              className="text-gray-500 cursor-pointer text-xl"
            >
              &times;
            </button>
          </div>
          <hr style={dividerStyle} className="-mx-4 mb-4" />
          <p className="text-gray-800 whitespace-pre-wrap text-[16px]">
            {viewedMessageDetails.content}
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(NotificationDropdown);
