import { useEffect } from "react";
import { useChatStore } from "../../store/useChatStore.ts";
import { ChatMessage, GigNotification } from "../types";
import useSocket from "../../hooks/useSocket.ts";
import { fetchPrivateMessages } from "../../services/api";
import audio from "../../assets/notification.mp3";
const NOTIFICATION_AUDIO = audio;
const ChatSocketHandler = ({
  userId,
  recipientId,
}: {
  userId: string;
  recipientId: string;
}) => {
  const {
    messages,
    setMessages,
    setUnreadCount,
    setConnectionStatus,
    setUserStatus, // Assuming this exists in your store
  } = useChatStore();

  const socket = useSocket(userId);

  /** Handle socket connection status **/
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("✅ Connected to socket server");
      setConnectionStatus("connected");
    });

    socket.on("disconnect", () => {
      console.warn("⚠️ Socket disconnected");
      setConnectionStatus("disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    setUnreadCount(
      messages.filter((msg) => msg.sender !== userId && !msg.viewed).length,
    ); // Increment unread count
  }, [messages, setUnreadCount, userId]);

  /** Handle incoming private messages **/
  useEffect(() => {
    if (!socket) return;

    const handlePrivateMessage = (newMessage: ChatMessage) => {
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      new Audio(NOTIFICATION_AUDIO).play().then((r) => r);
    };

    socket.on("privateMessage", handlePrivateMessage);

    return () => {
      socket.off("privateMessage", handlePrivateMessage);
    };
  }, [socket, setMessages, messages]);

  /** Fetch chat history when userId & recipientId are set **/
  useEffect(() => {
    const loadMessages = async () => {
      if (!userId || !recipientId) return;

      try {
        const history = await fetchPrivateMessages(userId, recipientId);
        setMessages(history);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    loadMessages();
  }, [userId, recipientId, setMessages]);

  /** Handle user status updates **/
  useEffect(() => {
    if (!socket) return;

    const handleUserStatusChange = (data: GigNotification) => {
      console.log(`${data.user} is now ${data.status}`);
      setUserStatus(data.user as string, data.status as string); // Store in Zustand
    };

    socket.on("userStatusChange", handleUserStatusChange);

    return () => {
      socket.off("userStatusChange", handleUserStatusChange);
    };
  }, [socket, setUserStatus]);

  /** Handle general notifications **/
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data: { title: string; content: string }) => {
      const showNotification = () => {
        new Notification(data.title, {
          body: data.content,
          silent: false,
          tag: "chat-notification",
        });
      };

      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          showNotification();
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              showNotification();
            }
          });
        }
      }

      new Audio(NOTIFICATION_AUDIO)
        .play()
        .catch((err) => console.error("Audio play error:", err));
    };

    socket.on("newNotification", handleNotification);

    return () => {
      socket.off("newNotification", handleNotification);
    };
  }, [socket]);

  return null; // Handler doesn't render UI
};

export default ChatSocketHandler;
