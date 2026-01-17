import React from "react";
import { useChatStore } from "../../store/useChatStore.ts";
import { formatChatTimestamp } from "../../utils/helpers.ts";
import { ChatMessage } from "../../chat-module/types";
import { useAuth } from "../../store/useAuth.ts";
import { markMessageAsRead } from "../../services/api";
import { AVATAR_API_URL } from "../../utils/constants.ts";

interface MessageDropdownProps {
  onClose: () => void;
  isMobile?: boolean;
}

const MessageDropdown: React.FC<MessageDropdownProps> = ({
                                                           onClose,
                                                           isMobile = false
                                                         }) => {
  const {
    setIsClosed,
    setIsMinimized,
    messages,
    setMessages,
    setRecipient,
    decrementUnread,
  } = useChatStore();
  const { email } = useAuth();

  const unreadMessages = messages
    .filter((c) => c.sender !== email && !c.viewed)
    .sort(
      (a, b) =>
        new Date(b.createdAt as string).getTime() -
        new Date(a.createdAt as string).getTime()
    )
    .slice(0, 10);

  const handleOpenMessage = async (
    e: React.MouseEvent,
    message: ChatMessage
  ) => {
    e.stopPropagation();

    try {
      setRecipient(message.sender);
      setIsClosed(false);
      setIsMinimized(false);

      const response = await markMessageAsRead(message._id as string, email);
      if (response.statusCode === 200) {
        const updatedMessages = messages.map((msg) =>
          msg._id === message._id ? { ...msg, viewed: true } : msg
        );
        setMessages(updatedMessages);
        decrementUnread();
      }

      onClose();
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  const handleViewAll = () => {
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Dropdown Container - Responsive Width */}
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
            <h3 className="text-base xl:text-lg font-bold text-gray-800">Messages</h3>
            {unreadMessages.length > 0 && (
              <span className="px-2 xl:px-2.5 py-0.5 text-[10px] xl:text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                {unreadMessages.length} new
              </span>
            )}
          </div>
        </div>

        {/* Message List */}
        <div className="overflow-y-auto flex-1">
          {unreadMessages.length === 0 ? (
            <div className="px-5 xl:px-6 py-10 xl:py-12 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-gray-100 mb-3 xl:mb-4">
                <svg
                  className="w-7 h-7 xl:w-8 xl:h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <p className="text-xs xl:text-sm font-medium text-gray-800 mb-1">
                No new messages
              </p>
              <p className="text-[10px] xl:text-xs text-gray-500">
                You're all caught up!
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {unreadMessages.map((message, index) => (
                <li key={message._id || index}>
                  <div className="px-5 xl:px-6 py-3.5 xl:py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2.5 xl:gap-3">
                      <img
                        src={
                          message.senderAvatar ||
                          AVATAR_API_URL.concat(message.senderName)
                        }
                        alt={message.senderName}
                        className="h-9 w-9 xl:h-10 xl:w-10 rounded-full object-cover flex-shrink-0 bg-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs xl:text-sm font-semibold text-gray-800 truncate">
                            {message.senderName}
                          </p>
                          <p className="text-[10px] xl:text-xs text-gray-400 ml-2 flex-shrink-0">
                            {formatChatTimestamp(
                              new Date(message?.createdAt as string)
                            )}
                          </p>
                        </div>
                        <p className="text-xs xl:text-sm text-gray-600 line-clamp-2 mb-1.5 xl:mb-2">
                          {message.content}
                        </p>
                        <button
                          onClick={(e) => handleOpenMessage(e, message)}
                          className="text-[10px] xl:text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline"
                        >
                          View Message →
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {unreadMessages.length > 0 && (
          <div className="px-5 xl:px-6 py-3.5 xl:py-4 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={handleViewAll}
              className="w-full px-4 py-2 xl:py-2.5 text-xs xl:text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              View All Messages
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MessageDropdown;