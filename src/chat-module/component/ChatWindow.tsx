import React, { useCallback, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import {
  FaWindowMinimize,
  FaEllipsisV,
  FaReply,
  FaDownload,
  FaTrash,
  FaCopy,
  FaFileImage,
  FaFileVideo,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaFileAudio,
  FaFileCode,
  FaFile,
} from "react-icons/fa";
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
  isSender: boolean;
}

const MessageMenu: React.FC<MessageMenuProps> = ({
  message,
  isVisible,
  onClose,
  onDelete,
  onReply,
  onDownload,
  isSender,
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
    onClose();
  };

  return (
    <div className="absolute top-6 right-0 z-50 min-w-[140px] rounded-lg border border-gray-200 bg-white shadow-xl">
      <div className="py-1">
        <button
          onClick={handleReply}
          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        >
          <FaReply size={12} />
          Reply
        </button>
        {!message.isFile && (
          <button
            onClick={handleCopy}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            <FaCopy size={12} />
            Copy
          </button>
        )}
        {message.fileUrl && (
          <button
            onClick={handleDownload}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            <FaDownload size={12} />
            Download
          </button>
        )}
        {isSender && (
          <button
            onClick={handleDelete}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <FaTrash size={12} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

const ChatWindow: React.FC = () => {
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const processedMessages = useRef<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

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
    return fileType?.startsWith("image/");
  };

  const isVideoFile = (fileType: string) => {
    return fileType?.startsWith("video/");
  };

  const isAudioFile = (fileType: string) => {
    return fileType?.startsWith("audio/");
  };

  const getFileIcon = (fileName: string, fileType: string) => {
    const extension = fileName?.toLowerCase().split(".").pop() || "";

    if (isImageFile(fileType)) {
      return <FaFileImage className="text-blue-500" size={20} />;
    }

    if (isVideoFile(fileType)) {
      return <FaFileVideo className="text-red-500" size={20} />;
    }

    if (isAudioFile(fileType)) {
      return <FaFileAudio className="text-purple-500" size={20} />;
    }

    // Document types
    if (["pdf"].includes(extension)) {
      return <FaFilePdf className="text-red-600" size={20} />;
    }

    if (["doc", "docx"].includes(extension)) {
      return <FaFileWord className="text-blue-600" size={20} />;
    }

    if (["xls", "xlsx"].includes(extension)) {
      return <FaFileExcel className="text-green-600" size={20} />;
    }

    if (["ppt", "pptx"].includes(extension)) {
      return <FaFilePowerpoint className="text-orange-600" size={20} />;
    }

    if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
      return <FaFileArchive className="text-yellow-600" size={20} />;
    }

    if (
      [
        "js",
        "ts",
        "jsx",
        "tsx",
        "html",
        "css",
        "json",
        "xml",
        "py",
        "java",
        "cpp",
        "c",
        "php",
        "rb",
        "go",
        "rs",
      ].includes(extension)
    ) {
      return <FaFileCode className="text-green-500" size={20} />;
    }

    return <FaFile className="text-gray-500" size={20} />;
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
        setRecipient(message.sender);
        setIsClosed(false);
        setIsMinimized(false);

        const response = await markMessageAsRead(message._id as string, email);

        if (response.statusCode === 200) {
          const updatedMessages = messages.map((msg) => {
            if (msg._id === message._id) {
              return { ...msg, viewed: true };
            }
            return msg;
          });

          setMessages(updatedMessages);
          decrementUnread();
        }
      } catch (error) {
        console.error("Error marking message as read:", error);
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
        className={`fixed right-5 bottom-8 z-[999999] w-[90%] md:bottom-5 md:w-[420px] ${
          isMinimized ? "h-16" : "h-[650px]"
        } flex flex-col rounded-t-2xl border border-gray-200 bg-white shadow-2xl`}
      >
        {/* Header */}
        <div className="drag-handle relative flex h-[100px] w-full cursor-move items-center justify-between rounded-t-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-lg font-semibold text-white">
          <div className="absolute -top-1 right-2 flex items-center gap-x-1">
            <FaWindowMinimize
              onClick={() => setIsMinimized(!isMinimized)}
              onTouchStart={() => setIsMinimized(!isMinimized)}
              className="mb-1 cursor-pointer rounded px-2 text-[30px] text-white"
            />
            <button
              onClick={() => setIsClosed(true)}
              onTouchStart={() => setIsClosed(true)}
              className="rounded px-2 py-1 text-[30px] text-white cursor-pointer"
            >
              &times;
            </button>
          </div>
          <div className="flex items-center gap-x-3">
            <div className="relative h-[60px] w-[60px] overflow-hidden rounded-full bg-gray-300 ring-2 ring-white/30">
              <img
                src={profilePics || avatarIcon}
                alt="Profile"
                className="h-full w-full object-cover"
              />
              <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-400"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{name}</span>
              <span className="text-xs text-white/80">{profession}</span>
              <span className="text-xs text-white/60">{userLocation}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        {!isMinimized && (
          <div className="flex-grow space-y-4 overflow-y-auto bg-gray-50 p-4">
            {messages.map((msg, index) => {
              const isSender = msg.sender === sender;
              const extendedMsg = msg as ExtendedChatMessage;
              return (
                <div
                  key={msg._id || index}
                  data-index={index}
                  ref={(el) => (messageRefs.current[index] = el)}
                  className={`flex items-end gap-2 ${isSender ? "justify-end" : "justify-start"}`}
                >
                  {/* Recipient Avatar */}
                  {!isSender && (
                    <div className="h-[32px] w-[32px] flex-shrink-0 overflow-hidden rounded-full bg-gray-300">
                      <img
                        src={msg.recipientAvatar || avatarIcon}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Chat Bubble */}
                  <div className="group relative flex max-w-xs flex-col">
                    <div
                      className={`relative rounded-2xl p-3 shadow-sm ${
                        isSender
                          ? "rounded-br-md bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                          : "rounded-bl-md border border-gray-200 bg-white text-gray-900"
                      }`}
                    >
                      {/* Reply indicator */}
                      {extendedMsg.replyTo && (
                        <div
                          className={`mb-2 rounded border-l-4 p-2 text-xs ${
                            isSender
                              ? "border-white/30 bg-white/10"
                              : "border-gray-300 bg-gray-100"
                          }`}
                        >
                          <div className="font-semibold opacity-75">
                            Replying to:
                          </div>
                          <div className="truncate opacity-90">
                            {extendedMsg.replyTo.content}
                          </div>
                        </div>
                      )}

                      {/* Message content */}
                      {extendedMsg.isFile ? (
                        <div className="flex flex-col space-y-2">
                          {isImageFile(extendedMsg.fileType || "") ? (
                            <div className="group relative">
                              <img
                                src={extendedMsg.fileUrl}
                                alt={extendedMsg.fileName}
                                className="h-auto max-w-full cursor-pointer rounded-lg"
                                style={{ maxHeight: "200px" }}
                                onClick={() =>
                                  window.open(extendedMsg.fileUrl, "_blank")
                                }
                              />
                              <div className="bg-opacity-0 group-hover:bg-opacity-20 absolute inset-0 flex items-center justify-center rounded-lg bg-black transition-all">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadFile(
                                      extendedMsg.fileUrl!,
                                      extendedMsg.fileName!,
                                    );
                                  }}
                                  className="bg-opacity-90 hover:bg-opacity-100 rounded-full bg-white p-2 opacity-0 transition-all group-hover:opacity-100"
                                >
                                  <FaDownload
                                    className="text-gray-700"
                                    size={16}
                                  />
                                </button>
                              </div>
                            </div>
                          ) : isVideoFile(extendedMsg.fileType || "") ? (
                            <div className="relative">
                              <video
                                controls
                                className="h-auto max-w-full rounded-lg"
                                style={{ maxHeight: "200px" }}
                                preload="metadata"
                              >
                                <source
                                  src={extendedMsg.fileUrl}
                                  type={extendedMsg.fileType}
                                />
                                Your browser does not support the video tag.
                              </video>
                              <button
                                onClick={() =>
                                  handleDownloadFile(
                                    extendedMsg.fileUrl!,
                                    extendedMsg.fileName!,
                                  )
                                }
                                className="bg-opacity-50 hover:bg-opacity-70 absolute top-2 right-2 rounded-full bg-black p-2 transition-all"
                              >
                                <FaDownload className="text-white" size={12} />
                              </button>
                            </div>
                          ) : (
                            <div
                              className={`flex items-center space-x-3 rounded-lg border-2 border-dashed p-3 transition-colors hover:border-solid ${
                                isSender
                                  ? "border-white/30 bg-white/10 hover:border-white/50"
                                  : "border-gray-300 bg-gray-50 hover:border-gray-400"
                              }`}
                            >
                              <div className="flex-shrink-0">
                                {getFileIcon(
                                  extendedMsg.fileName || "",
                                  extendedMsg.fileType || "",
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div
                                  className={`truncate text-sm font-medium ${
                                    isSender ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {extendedMsg.fileName}
                                </div>
                                {extendedMsg.fileSize && (
                                  <div
                                    className={`text-xs ${
                                      isSender
                                        ? "text-white/70"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {formatFileSize(extendedMsg.fileSize)}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  handleDownloadFile(
                                    extendedMsg.fileUrl!,
                                    extendedMsg.fileName!,
                                  )
                                }
                                className={`flex-shrink-0 rounded-full p-2 transition-colors ${
                                  isSender
                                    ? "text-white hover:bg-white/20"
                                    : "text-gray-600 hover:bg-gray-200"
                                }`}
                                title="Download file"
                              >
                                <FaDownload size={14} />
                              </button>
                            </div>
                          )}
                          {msg.content !== extendedMsg.fileName &&
                            msg.content && (
                              <div className="mt-2">{msg.content}</div>
                            )}
                        </div>
                      ) : (
                        <div className="break-words">{msg.content}</div>
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
                        className={`absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full opacity-0 shadow-md transition-opacity group-hover:opacity-100 ${
                          isSender
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "border bg-white hover:bg-gray-50"
                        }`}
                      >
                        <FaEllipsisV
                          size={10}
                          className={isSender ? "text-white" : "text-gray-600"}
                        />
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
                        isSender={isSender}
                      />
                    </div>

                    {/* Message timestamp and status */}
                    <div
                      className={`mt-1 flex items-center gap-1 px-2 text-xs text-gray-500 ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.createdAt && (
                        <span>
                          {formatChatTimestamp(new Date(msg.createdAt))}
                        </span>
                      )}
                      {isSender && (
                        <span className="ml-1">
                          {msg.viewed ? "👁️" : msg.delivered ? "✅" : "⏳"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sender Avatar */}
                  {isSender && (
                    <div className="h-[32px] w-[32px] flex-shrink-0 overflow-hidden rounded-full bg-gray-300">
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
                <div className="rounded-lg border bg-white p-4 shadow-lg">
                  <div className="mb-2 text-sm text-gray-600">Uploading...</div>
                  <div className="h-2 w-48 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {uploadProgress}%
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Message Input */}
        {!isMinimized && (
          <div className="border-t border-gray-200 bg-white p-4">
            {/* Reply indicator */}
            {replyingTo && (
              <div className="mb-3 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-blue-600">
                    Replying to:
                  </div>
                  <div className="truncate text-sm text-gray-700">
                    {replyingTo.content}
                  </div>
                </div>
                <button
                  onClick={cancelReply}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleEmojiPicker}
                className="text-2xl transition-transform hover:scale-110"
              >
                😊
              </button>

              {isEmojiPickerVisible && (
                <div className="absolute bottom-20 left-4 z-50 grid max-h-[180px] grid-cols-6 gap-2 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
                  {emojiList.map((emoji) => (
                    <span
                      key={emoji}
                      className="cursor-pointer p-1 text-xl transition-transform hover:scale-125"
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
                className="flex-1 resize-none rounded-xl border border-gray-300 bg-gray-50 p-3 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                placeholder={
                  replyingTo
                    ? `Reply to ${replyingTo.sender}...`
                    : "Type a message..."
                }
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
                className="cursor-pointer text-2xl transition-transform hover:scale-110"
                title="Attach file"
              >
                📎
              </label>

              <button
                onClick={() => {
                  sendMessage();
                  setReplyingTo(null);
                }}
                disabled={isUploading || !message.trim()}
                className="flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all hover:from-purple-700 hover:to-blue-700 hover:shadow-xl disabled:opacity-50"
                title={replyingTo ? "Send reply" : "Send message"}
              >
                <img src={sendIcon} alt="send" className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default ChatWindow;
