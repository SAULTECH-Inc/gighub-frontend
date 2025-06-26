import { useChatStore } from "../../store/useChatStore.ts";
import { useAuth } from "../../store/useAuth.ts";
import { ExtendedChatMessage } from "../types";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import useSocket from "../../hooks/useSocket.ts";

export const useChatActions = () => {
  const {
    sender,
    recipient,
    recipientDetails,
    message,
    setMessage,
    addMessage,
    replyingTo,
    setReplyingTo,
  } = useChatStore();

  const { applicant, employer } = useAuth();
  const socket = useSocket(sender);

  const sendMessage = () => {
    if (!message.trim() || !recipient?.trim() || !socket) {
      console.warn("Cannot send: missing data or socket");
      return;
    }

    const normalizedRecipient = recipient.trim().toLowerCase();

    const newMessage: ExtendedChatMessage = {
      sender,
      senderName:
        USER_TYPE === UserType.APPLICANT
          ? `${applicant?.firstName} ${applicant?.lastName}`
          : employer?.companyName,
      senderAvatar:
        USER_TYPE === UserType.APPLICANT
          ? applicant?.profilePicture || ""
          : employer?.companyLogo || "",
      recipient: normalizedRecipient,
      recipientName:
        USER_TYPE === UserType.APPLICANT
          ? `${recipientDetails?.applicant?.firstName} ${recipientDetails?.applicant?.lastName}`
          : recipientDetails?.employer?.companyName,
      recipientAvatar:
        USER_TYPE === UserType.APPLICANT
          ? recipientDetails?.applicant?.profilePicture || ""
          : recipientDetails?.employer?.companyLogo || "",
      content: message,
      createdAt: new Date().toISOString(),

      // ✅ Add reply context here
      ...(replyingTo && {
        replyTo: {
          _id: replyingTo._id,
          sender: replyingTo.sender,
          content: replyingTo.content,
        },
      }),
    };

    socket.emit("privateMessage", newMessage);
    addMessage(newMessage);
    setMessage("");
    setReplyingTo(null); // Clear reply state after sending
  };

  return { sendMessage };
};
