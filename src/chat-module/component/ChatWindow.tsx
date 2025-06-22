import React, { useCallback, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { FaWindowMinimize } from "react-icons/fa";
import sendIcon from "../../assets/icons/send-icon.svg";
import avatarIcon from "../../assets/icons/avatar.svg";
import { emojiList } from "../../utils/constants.ts";
import { useChatStore } from "../../store/useChatStore.ts";
import { formatChatTimestamp } from "../../utils/helpers.ts";
import { useChatActions } from "../hook/useChatActions.ts";
import { ChatMessage } from "../types";
import { markMessageAsRead } from "../../services/api";
import { useAuth } from "../../store/useAuth.ts";

const ChatWindow: React.FC = () => {
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const {
    messages,
    recipientDetails,
    setMessages,
    setRecipient,
    decrementUnread,
    message,
    setMessage,
    sender,
    isEmojiPickerVisible,
    setIsEmojiPickerVisible,
    setFile,
    isClosed,
    setIsClosed,
    isMinimized,
    setIsMinimized,
  } = useChatStore();
  const { email } = useAuth();

  const { sendMessage } = useChatActions();
  // Send message handler

  const handleEmojiClick = (emoji: string) => {
    setMessage(message + emoji);
    setIsEmojiPickerVisible(false);
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerVisible(!isEmojiPickerVisible);
  };

  const userLocation =
    recipientDetails?.city && recipientDetails?.country
      ? `${recipientDetails.city}, ${recipientDetails.country}`
      : null;

  const profession =
    recipientDetails?.professionalTitle ||
    recipientDetails?.cv?.professionalTitle ||
    null;

  const handleOpenMessage = useCallback(async (message: ChatMessage) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          const msg = messages[index];
          if (
            entry.isIntersecting &&
            msg &&
            !msg.viewed &&
            msg.sender !== sender
          ) {
            handleOpenMessage(msg).then((r) => r);
          }
        });
      },
      { threshold: 0.5 },
    );

    // ✅ Capture current refs snapshot
    const refsSnapshot = [...messageRefs.current];

    refsSnapshot.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      refsSnapshot.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [handleOpenMessage, messages, sender]);

  if (isClosed) return null;

  return (
    <Draggable handle=".drag-handle">
      <div
        className={`fixed bottom-8 md:bottom-5 right-5 z-[999999] w-[90%] md:w-[396px] ${
          isMinimized ? "h-16" : "h-[634px]"
        } flex flex-col rounded-t-[16px] bg-white shadow-lg`}
      >
        {/* Header */}
        <div className="drag-handle relative flex h-[100px] w-full cursor-move items-center justify-between rounded-t-[16px] bg-[#6438C2] p-4 text-lg font-semibold text-white">
          <div className="absolute right-2 top-2 flex gap-x-1">
            <FaWindowMinimize
              onClick={() => setIsMinimized(!isMinimized)}
              onTouchStart={() => setIsMinimized(!isMinimized)}
              className="mb-1 cursor-pointer px-2 text-[30px] text-white"
            />
            <button
              onClick={() => setIsClosed(true)}
              onTouchStart={() => setIsClosed(true)}
              className="px-2 py-1 text-[30px] text-white"
            >
              &times;
            </button>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="bg-gray-300 h-[60px] w-[60px] overflow-hidden rounded-full">
              <img
                src={recipientDetails?.profilePicture || avatarIcon}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm">
                {recipientDetails?.firstName} {recipientDetails?.lastName}
              </span>
              <span className="text-sm">{profession}</span>
              <span className="text-sm">{userLocation}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        {!isMinimized && (
          <div className="flex-grow space-y-4 overflow-y-auto p-4">
            {messages.map((msg, index) => {
              const isSender = msg.sender === sender;
              return (
                <div
                  onFocus={() => handleOpenMessage(msg)}
                  key={index}
                  data-index={index}
                  ref={(el) => (messageRefs.current[index] = el)}
                  className={`flex items-end ${isSender ? "justify-end" : "justify-start"}`}
                >
                  {/* Recipient Avatar */}
                  {!isSender && (
                    <div className="bg-gray-300 mr-2 h-[40px] w-[40px] overflow-hidden rounded-full">
                      <img
                        src={msg.recipientAvatar || avatarIcon}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Chat Bubble */}
                  <div
                    className={`chat-bubble flex max-w-xs flex-col p-3 ${
                      isSender
                        ? "rounded-l-xl rounded-tr-xl bg-purple-500 text-white"
                        : "rounded-r-xl rounded-tl-xl bg-[#e6e6e6] text-black"
                    }`}
                  >
                    <div>{msg.content}</div>
                    <div className="text-gray-200 mt-1 flex items-center justify-end gap-1 text-xs">
                      {msg.createdAt && (
                        <span className="text-gray-200 text-[10px]">
                          {formatChatTimestamp(new Date(msg.createdAt))}
                        </span>
                      )}
                      {/* Message Status */}
                      {isSender && (
                        <span>
                          {msg.viewed ? "👁️" : msg.delivered ? "✅" : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sender Avatar */}
                  {isSender && (
                    <div className="bg-gray-300 ml-2 h-[40px] w-[40px] overflow-hidden rounded-full">
                      <img
                        src={msg.senderAvatar || avatarIcon}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Message Input */}
        {!isMinimized && (
          <div className="flex items-center space-x-2 bg-white p-4">
            <button
              onClick={toggleEmojiPicker}
              className="text-2xl text-indigo-600"
            >
              😊
            </button>

            {isEmojiPickerVisible && (
              <div className="absolute bottom-16 left-4 grid max-h-[180px] grid-cols-6 gap-2 overflow-y-auto rounded-xl bg-white p-4 shadow-lg">
                {emojiList.map((emoji) => (
                  <span
                    key={emoji}
                    className="cursor-pointer text-xl"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            )}

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows={1}
              className="w-full resize-none rounded-[10px] border border-[#E3E6F3] bg-[#F7F8FA] p-3"
              placeholder="Write here"
            />

            <input
              type="file"
              onChange={(e) => setFile((e.target.files?.[0] || null) as File)}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="cursor-pointer text-2xl text-indigo-600"
            >
              📎
            </label>

            <button
              tabIndex={0}
              onClick={sendMessage}
              className="h-[44px] w-[50px] rounded-[10px] bg-indigo-700 px-4 py-2 text-white"
            >
              <img src={sendIcon} alt="send" />
            </button>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default ChatWindow;
