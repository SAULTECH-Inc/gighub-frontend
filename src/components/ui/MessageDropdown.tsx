import React from "react";
import { useChatStore } from "../../store/useChatStore.ts";
import { formatChatTimestamp } from "../../utils/helpers.ts";
import { ChatMessage } from "../../chat-module/types";
import { useAuth } from "../../store/useAuth.ts";
import { markMessageAsRead } from "../../services/api";
import { AVATAR_API_URL } from "../../utils/constants.ts";

interface MessageDropdownProps {
  onClose: () => void;
}

const MessageDropdown: React.FC<MessageDropdownProps> = ({ onClose }) => {
  const dividerStyle = { borderColor: "#E6E6E6" }; // Faint divider color
  const {
    setIsClosed,
    setIsMinimized,
    messages,
    setMessages,
    setRecipient,
    decrementUnread,
  } = useChatStore();
  const { email } = useAuth();
  console.log(
    "Messages in dropdown:",
    messages.filter((c) => c.sender !== email && !c.viewed).length,
  );

  const handleOpenMessage = async (message: ChatMessage) => {
    setRecipient(message.sender);
    setIsClosed(false);
    setIsMinimized(false);
    const response = await markMessageAsRead(message._id as string, email);
    if (response.statusCode === 200) {
      console.log("Message marked as read");
      const updatedMessages = messages.map((msg) => {
        if (msg._id === message._id) {
          return { ...msg, viewed: true };
        }
        return msg;
      });
      setMessages(updatedMessages);
      decrementUnread();
    }
  };

  return (
    <div className="absolute right-0 top-14 z-50 w-[352px] rounded-[16px] bg-white p-6 font-lato shadow-lg">
      {/* Header */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Messages</h3>
        </div>
        {/* Divider Below Header */}
        <hr style={dividerStyle} className="-mx-6" />
      </div>

      {/* Message Items */}
      <ul>
        {messages
          .filter((c) => c.sender !== email && !c.viewed)
          .sort(
            (a, b) =>
              new Date(b.createdAt as string).getTime() -
              new Date(a.createdAt as string).getTime(),
          )
          .slice(0, 10)
          .map((message: ChatMessage, index) => (
            <li key={index}>
              {/* Message Content */}
              <div
                className="flex cursor-pointer items-center gap-4 p-3 hover:bg-gray-100"
                onClick={onClose}
              >
                {/* Avatar */}
                <img
                  src={`${message.senderAvatar || AVATAR_API_URL.concat(message.senderName)}`}
                  alt={message.sender}
                  className="h-10 w-10 rounded-full"
                />

                {/* Details */}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {message.senderName}
                  </p>
                  <p className="text-xs text-gray-600">{message.content}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {formatChatTimestamp(
                        new Date(message?.createdAt as string),
                      )}
                    </p>
                    <button
                      onClick={() => handleOpenMessage(message)}
                      className="text-xs text-purple-600 hover:underline"
                    >
                      See Message
                    </button>
                  </div>
                </div>
              </div>

              {/* Divider (except after the last item) */}
              {index < messages.length - 1 && (
                <hr style={dividerStyle} className="-mx-6" />
              )}
            </li>
          ))}
      </ul>

      {/* Divider Above "View All Messages" */}
      <div className="mt-4">
        <hr style={dividerStyle} className="-mx-6 mb-4" />
        <div className="text-center">
          <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
            View all Messages
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDropdown;
