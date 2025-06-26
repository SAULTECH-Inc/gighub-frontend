import React, { useCallback, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { FaWindowMinimize, FaEllipsisV } from "react-icons/fa";
import sendIcon from "../../assets/icons/send-icon.svg";
import avatarIcon from "../../assets/icons/avatar.svg";
import { emojiList } from "../../utils/constants.ts";
import { useChatStore } from "../../store/useChatStore.ts";
import { formatChatTimestamp, USER_TYPE } from "../../utils/helpers.ts";
import { useChatActions } from "../hook/useChatActions.ts";
import { ExtendedChatMessage } from "../types";
import {
  markMessageAsRead,
  deleteMessage,
  uploadFileGeneral,
} from "../../services/api";
import { useAuth } from "../../store/useAuth.ts";
import { Action, UserType } from "../../utils/enums.ts";

interface MessageMenuProps {
  message: ExtendedChatMessage;
  isVisible: boolean;
  onClose: () => void;
  onDelete: (messageId: string) => void;
  onReply: (message: ExtendedChatMessage) => void;
  onDownload?: (fileUrl: string, fileName: string) => void;
}

const MessageMenu: React.FC<MessageMenuProps> = ({
  message,
  isVisible,
  onClose,
  onDelete,
  onReply,
  onDownload,
}) => {
  if (!isVisible) return null;

  const handleDelete = () => {
    if (message._id) {
      onDelete(message._id);
    }
    onClose();
  };

  const handleReply = () => {
    onReply(message);
    onClose();
  };

  const handleDownload = () => {
    if (message.fileUrl && message.fileName && onDownload) {
      onDownload(message.fileUrl, message.fileName);
    }
    onClose();
  };

  return (
    <div className="absolute top-6 right-0 z-50 min-w-[120px] rounded-lg border border-gray-200 bg-white shadow-lg">
      <div className="py-1">
        <button
          onClick={handleReply}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        >
          Reply
        </button>
        {message.fileUrl && (
          <button
            onClick={handleDownload}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Download
          </button>
        )}
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const ChatWindow: React.FC = () => {
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const processedMessages = useRef<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeMessageMenu, setActiveMessageMenu] = useState<string | null>(
    null,
  );
  const [replyingTo, setReplyingTo] = useState<ExtendedChatMessage | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  // Close message menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMessageMenu(null);
    };

    if (activeMessageMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeMessageMenu]);

  const handleEmojiClick = (emoji: string) => {
    setMessage(message + emoji);
    setIsEmojiPickerVisible(false);
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerVisible(!isEmojiPickerVisible);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData for file upload

      // Simulate upload progress (replace with actual progress tracking if your API supports it)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      // Call your file upload API
      const uploadResponse = await uploadFileGeneral(
        recipientDetails?.applicant?.id || recipientDetails?.employer?.id || 0,
        selectedFile,
        Action.FILE_UPLOAD,
        USER_TYPE,
        "chat-file",
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadResponse.statusCode === 200) {
        const fileMessageContent = selectedFile.name;
        setMessage(fileMessageContent);
        // sendMessage();

        // Clear the message after sending
        // setMessage('');
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("File upload error:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await deleteMessage(messageId);
      if (response.statusCode === 200) {
        // Remove message from local state
        const updatedMessages = messages.filter((msg) => msg._id !== messageId);
        setMessages(updatedMessages);
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Delete message error:", error);
      alert("Failed to delete message. Please try again.");
    }
  };

  const handleReplyToMessage = (msg: ExtendedChatMessage) => {
    setReplyingTo(msg);
  };

  const handleDownloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const isImageFile = (fileType: string) => {
    return fileType.startsWith("image/");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleOpenMessage = useCallback(
    async (message: ExtendedChatMessage) => {
      if (!message._id || processedMessages.current.has(message._id)) {
        return;
      }

      processedMessages.current.add(message._id);

      try {
        console.log(
          "🔍 Before markMessageAsRead - Total messages:",
          messages.length,
        );
        console.log(
          "🔍 Message being marked as read:",
          message._id,
          message.content,
        );

        setRecipient(message.sender);
        setIsClosed(false);
        setIsMinimized(false);

        const response = await markMessageAsRead(message._id as string, email);

        console.log("🔍 markMessageAsRead API response:", response);

        if (response.statusCode === 200) {
          console.log("✅ Message marked as read", message._id);
          console.log("🔍 Messages before local update:", messages.length);

          const updatedMessages = messages.map((msg) => {
            if (msg._id === message._id) {
              return { ...msg, viewed: true };
            }
            return msg;
          });

          console.log(
            "🔍 Messages after local update:",
            updatedMessages.length,
          );
          console.log(
            "🔍 Updated messages:",
            updatedMessages.map((m) => ({
              id: m._id,
              viewed: m.viewed,
              content: m.content,
            })),
          );

          setMessages(updatedMessages);
          decrementUnread();
        }
      } catch (error) {
        console.error("❌ Error marking message as read:", error);
        processedMessages.current.delete(message._id as string);
      }
    },
    [
      setRecipient,
      setIsClosed,
      setIsMinimized,
      email,
      setMessages,
      decrementUnread,
      messages,
    ],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          const msg = messages[index];

          if (
            entry.isIntersecting &&
            msg &&
            msg._id &&
            !msg.viewed &&
            msg.sender !== sender &&
            !processedMessages.current.has(msg._id)
          ) {
            handleOpenMessage(msg).then((r) => r);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -50px 0px",
      },
    );

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

  useEffect(() => {
    const currentMessageIds = new Set(
      messages.map((msg) => msg._id).filter(Boolean),
    );
    const processedIds = Array.from(processedMessages.current);

    processedIds.forEach((id) => {
      if (!currentMessageIds.has(id)) {
        processedMessages.current.delete(id);
      }
    });
  }, [messages]);

  let name: string | null | undefined;
  let profilePics: string | null | undefined;
  let userLocation: string | null | undefined;
  let profession: string | null | undefined;

  if (recipientDetails?.userType === UserType.APPLICANT) {
    name =
      recipientDetails?.applicant?.firstName +
      " " +
      recipientDetails?.applicant?.lastName;
    profilePics = recipientDetails?.applicant?.profilePicture;
    userLocation =
      recipientDetails?.applicant?.city +
      " " +
      recipientDetails?.applicant?.country;
    profession =
      recipientDetails?.applicant?.cv?.professionalTitle ||
      recipientDetails?.applicant?.professionalTitle;
  } else {
    name = recipientDetails?.employer?.companyName;
    profilePics = recipientDetails?.employer?.companyLogo;
    userLocation =
      recipientDetails?.employer?.city +
      " " +
      recipientDetails?.employer?.country;
    profession = recipientDetails?.employer?.industry;
  }

  if (isClosed) return null;

  return (
    <Draggable handle=".drag-handle">
      <div
        className={`fixed right-5 bottom-8 z-[999999] w-[90%] md:bottom-5 md:w-[396px] ${
          isMinimized ? "h-16" : "h-[634px]"
        } flex flex-col rounded-t-[16px] bg-white shadow-lg`}
      >
        {/* Header */}
        <div className="drag-handle relative flex h-[100px] w-full cursor-move items-center justify-between rounded-t-[16px] bg-[#6438C2] p-4 text-lg font-semibold text-white">
          <div className="absolute -top-1 right-2 flex items-center gap-x-1">
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
            <div className="h-[60px] w-[60px] overflow-hidden rounded-full bg-gray-300">
              <img
                src={profilePics || avatarIcon}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm">{name}</span>
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
              const extendedMsg = msg as ExtendedChatMessage;
              return (
                <div
                  key={msg._id || index}
                  data-index={index}
                  ref={(el) => (messageRefs.current[index] = el)}
                  className={`flex items-end ${isSender ? "justify-end" : "justify-start"}`}
                >
                  {/* Recipient Avatar */}
                  {!isSender && (
                    <div className="mr-2 h-[40px] w-[40px] overflow-hidden rounded-full bg-gray-300">
                      <img
                        src={msg.recipientAvatar || avatarIcon}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Chat Bubble */}
                  <div
                    className={`chat-bubble relative flex max-w-xs flex-col p-3 ${
                      isSender
                        ? "rounded-l-xl rounded-tr-xl bg-purple-500 text-white"
                        : "rounded-tl-xl rounded-r-xl bg-[#e6e6e6] text-black"
                    }`}
                  >
                    {/* Reply indicator */}
                    {extendedMsg.replyTo && (
                      <div
                        className={`mb-2 rounded border-l-4 p-2 text-xs ${
                          isSender
                            ? "border-purple-200 bg-purple-400"
                            : "border-gray-400 bg-gray-200"
                        }`}
                      >
                        <div className="font-semibold">Replying to:</div>
                        <div className="truncate">
                          {extendedMsg.replyTo.content}
                        </div>
                      </div>
                    )}

                    {/* Message content */}
                    {extendedMsg.isFile ? (
                      <div className="flex flex-col space-y-2">
                        {isImageFile(extendedMsg.fileType || "") ? (
                          <img
                            src={extendedMsg.fileUrl}
                            alt={extendedMsg.fileName}
                            className="h-auto max-w-full rounded"
                            style={{ maxHeight: "200px" }}
                          />
                        ) : (
                          <div className="bg-opacity-20 flex items-center space-x-2 rounded bg-white p-2">
                            <div className="text-2xl">📎</div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium">
                                {extendedMsg.fileName}
                              </div>
                              {extendedMsg.fileSize && (
                                <div className="text-xs opacity-75">
                                  {formatFileSize(extendedMsg.fileSize)}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {msg.content !== extendedMsg.fileName && (
                          <div>{msg.content}</div>
                        )}
                      </div>
                    ) : (
                      <div>{msg.content}</div>
                    )}

                    {/* Message menu button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMessageMenu(
                          activeMessageMenu === msg._id
                            ? null
                            : msg._id || null,
                        );
                      }}
                      className={`absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full ${
                        isSender ? "bg-purple-600" : "bg-gray-400"
                      } hover:opacity-80`}
                    >
                      <FaEllipsisV size={10} className="text-white" />
                    </button>

                    {/* Message menu */}
                    <MessageMenu
                      message={extendedMsg}
                      isVisible={activeMessageMenu === msg._id}
                      onClose={() => setActiveMessageMenu(null)}
                      onDelete={handleDeleteMessage}
                      onReply={handleReplyToMessage}
                      onDownload={
                        extendedMsg.isFile ? handleDownloadFile : undefined
                      }
                    />

                    <div className="mt-1 flex items-center justify-end gap-1 text-xs text-gray-200">
                      {msg.createdAt && (
                        <span className="text-[10px] text-gray-200">
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
                    <div className="ml-2 h-[40px] w-[40px] overflow-hidden rounded-full bg-gray-300">
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

            {/* Upload progress indicator */}
            {isUploading && (
              <div className="flex justify-center">
                <div className="rounded-lg bg-white p-4 shadow-lg">
                  <div className="mb-2 text-sm text-gray-600">Uploading...</div>
                  <div className="h-2 w-48 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-purple-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {uploadProgress}%
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Message Input */}
        {!isMinimized && (
          <div className="bg-white p-4">
            {/* Reply indicator */}
            {replyingTo && (
              <div className="mb-2 flex items-center justify-between rounded bg-gray-100 p-2">
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-600">Replying to:</div>
                  <div className="truncate text-sm">{replyingTo.content}</div>
                </div>
                <button
                  onClick={cancelReply}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex items-center space-x-2">
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
                    setReplyingTo(null);
                  }
                }}
                rows={1}
                className="w-full resize-none rounded-[10px] border border-[#E3E6F3] bg-[#F7F8FA] p-3"
                placeholder="Write here"
              />

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
                accept="*/*"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer text-2xl text-indigo-600 hover:text-indigo-800"
              >
                📎
              </label>

              <button
                tabIndex={0}
                onClick={() => {
                  sendMessage();
                  setReplyingTo(null);
                }}
                disabled={isUploading}
                className="h-[44px] w-[50px] rounded-[10px] bg-indigo-700 px-4 py-2 text-white disabled:opacity-50"
              >
                <img src={sendIcon} alt="send" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default ChatWindow;
