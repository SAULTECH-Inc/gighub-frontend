import { useChatStore } from "../../store/useChatStore.ts";
import { useAuth } from "../../store/useAuth.ts";
import { ChatMessage } from "../types";
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
  } = useChatStore();

  const { applicant, employer } = useAuth();
  const socket = useSocket(sender);

  const sendMessage = () => {
    if (!message.trim() || !recipient?.trim() || !socket) {
      console.warn("Cannot send: missing data or socket");
      return;
    }

    const normalizedRecipient = recipient.trim().toLowerCase();

    const newMessage: ChatMessage = {
      sender: sender,
      senderName:
        USER_TYPE === UserType.APPLICANT
          ? `${applicant?.firstName} ${applicant?.lastName}`
          : employer?.companyName,
      senderAvatar:
        USER_TYPE === UserType.APPLICANT
          ? applicant?.profilePicture || ""
          : employer?.companyLogo || "",
      recipient: normalizedRecipient,
      recipientName: `${recipientDetails?.firstName} ${recipientDetails?.lastName}`,
      recipientAvatar: recipientDetails?.profilePicture || "",
      content: message,
      createdAt: new Date().toISOString(),
    };

    console.log("Sending message:", newMessage);
    socket.emit("privateMessage", newMessage);
    addMessage(newMessage);
    setMessage("");
  };

  return { sendMessage };
};
