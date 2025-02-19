import React, { useState } from "react";
import { NotificationType } from "../../utils/NotificationType";

interface NotificationTemplateProps {
  id: number;
  title: string;
  message: string;
  messageContent: string;
  timestamp: string;
  type: NotificationType;
}

const notificationColors: Record<NotificationType, string> = {
  [NotificationType.Approved]: "#6438C2",
  [NotificationType.Applied]: "#56E5A1",
  [NotificationType.Interested]: "#51FF00",
  [NotificationType.Withdrawn]: "#FD7E14",
  [NotificationType.Flagged]: "#F36863",
};

const NotificationTemplate: React.FC<NotificationTemplateProps> = ({
  title,
  message,
  messageContent,
  timestamp,
  type,
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

  const formatTimestamp = (timestamp: string) => {
    const time = timestamp.toLowerCase();
    if (time.includes("d")) {
      return time.replace("days", "d").replace("day", "d");
    }
    if (time.includes("hour")) {
      return time.replace("hours", "h").replace("hour", "h");
    }
    if (time.includes("minute")) {
      return time.replace("minutes", "m").replace("minute", "m");
    }
    return time;
  };

  return (
    <div className="bg-[#F7F8FA] w-full flex flex-col items-center gap-2">
      <div
        className="text-white self-end py-2 px-[30px] text-[13px]"
        style={{ backgroundColor: notificationColors[type] }}
      >
        <p>{title}</p>
      </div>
      <div className="w-[98%] flex justify-between pb-2">
        <div className="flex gap-2">
          <div
            className="min-w-[40px] max-h-[40px] rounded-full"
            style={{ backgroundColor: notificationColors[type] }}
          ></div>
          <div className="text-[13px] font-medium">
          <p className="relative w-full">
              <span className="hidden md:inline">{message}</span>
              <span className="md:hidden">
                {isMessageExpanded ? message : truncateText(message, 2)}
                {message.length > 100 && (
                  <button
                    onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                    className="text-[#6438C2] hover:underline"
                  >
                    {isMessageExpanded ? "read less" : "read more"}
                  </button>
                )}
              </span>
              <span className="text-[#8E8E8E] block">
                <span className="hidden md:inline">{messageContent}</span>
                <span className="md:hidden">
                  {isContentExpanded ? messageContent : truncateText(messageContent, 1)}
                  {messageContent.length > 50 && (
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
            <div className="w-full flex gap-4 sm:gap-40">
              <button className="text-[#6438C2] font-medium">Delete</button>
              <button className="text-[#6438C2] font-medium">
                View the job post
              </button>
            </div>
          </div>
        </div>
        <p className="min-w-[70px] self-end hidden md:block text-[13px] font-semibold text-[#8E8E8E]">
          {timestamp}
        </p>
        <p className="min-w-[45px] self-end md:hidden text-[13px] font-semibold text-[#8E8E8E]">
          {formatTimestamp(timestamp)}
        </p>
      </div>
    </div>
  );
};

export default NotificationTemplate;
