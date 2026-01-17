import React, { memo, useState } from "react";
import { NotificationItem } from "../../utils/types";
import moment from "moment";
import { eventTypeColorMap } from "../../utils/constants.ts";

interface NotificationTemplateProps {
  notification: NotificationItem;
  deleteNotification: (id: string | number | undefined) => void;
  viewJobPost: (notificationId: string | number | undefined) => void;
}

const NotificationTemplate: React.FC<NotificationTemplateProps> = ({
  notification,
  deleteNotification,
  viewJobPost,
}) => {
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  const truncateText = (text: string, maxLines: number) => {
    const words = text.split(" ");
    const avgCharsPerLine = 50;
    const maxChars = avgCharsPerLine * maxLines;

    if (text.length <= maxChars) return text;

    return (
      words
        .reduce((acc: string, word: string) => {
          if (acc.length < maxChars - 15) {
            return acc + " " + word;
          }
          return acc;
        }, "")
        .trim() + "... "
    );
  };

  return (
    <div className="flex w-full flex-col items-center gap-2 bg-[#F7F8FA]">
      <div
        className="self-end px-[30px] py-2 text-[13px] text-white"
        style={{ backgroundColor: eventTypeColorMap[notification.type] }}
      >
        <p>{notification.title}</p>
      </div>
      <div className="flex w-[98%] justify-between pb-2">
        <div className="flex gap-2">
          <div
            className="max-h-[40px] min-w-[40px] rounded-full"
            style={{ backgroundColor: eventTypeColorMap[notification.type] }}
          ></div>
          <div className="text-[13px] font-medium">
            <p className="relative w-full">
              <span className="hidden md:inline">{notification.title}</span>
              <span className="md:hidden">
                {isMessageExpanded
                  ? notification.content
                  : truncateText(notification.content, 2)}
                {notification.content.length > 100 && (
                  <button
                    onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                    className="text-[#6438C2] hover:underline"
                  >
                    {isMessageExpanded ? "read less" : "read more"}
                  </button>
                )}
              </span>
              <span className="block text-[#8E8E8E]">
                <span className="hidden md:inline">{notification.content}</span>
                <span className="md:hidden">
                  {isContentExpanded
                    ? notification.content
                    : truncateText(notification.content, 1)}
                  {notification.content.length > 50 && (
                    <button
                      onClick={() => setIsContentExpanded(!isContentExpanded)}
                      className="text-[#6438C2] hover:underline"
                    >
                      {isContentExpanded ? "read less" : "read more"}
                    </button>
                  )}
                </span>
              </span>
            </p>
            <div className="flex w-full gap-4 sm:gap-40">
              <button
                onClick={() => deleteNotification(notification?.id)}
                className="font-medium text-[#6438C2]"
              >
                Delete
              </button>
              <button
                onClick={() => viewJobPost(notification?.id)}
                className="font-medium text-[#6438C2]"
              >
                View the job post
              </button>
            </div>
          </div>
        </div>
        <p className="hidden min-w-[70px] self-end text-[13px] font-semibold text-[#8E8E8E] md:block">
          {moment(notification.createdAt).fromNow()}
        </p>
        <p className="min-w-[45px] self-end text-[13px] font-semibold text-[#8E8E8E] md:hidden">
          {moment(notification.createdAt).fromNow()}
        </p>
      </div>
    </div>
  );
};

export default memo(NotificationTemplate);
