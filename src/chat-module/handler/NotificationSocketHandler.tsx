import { useEffect, useState } from "react";
import { useNotificationStore } from "../../store/useNotificationStore";
import audio from "../../assets/notification.mp3";
import { NotificationItem } from "../../utils/types";
import { useAuth } from "../../store/useAuth.ts";

const NOTIFICATION_AUDIO = audio;

const NotificationSocketHandler = ({ userId }: { userId: string }) => {
  const { socket, connectSocket, addNotification } = useNotificationStore();
  const { email } = useAuth();

  const [userInteracted, setUserInteracted] = useState(false);

  // ✅ Track first interaction
  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  useEffect(() => {
    if (userId && !socket) {
      connectSocket(userId);
    }

    if (!socket) return;

    console.log("✅ Connected to notification socket");

    const handlePrivateNotification = (notification: NotificationItem) => {
      if (notification.user === email) {
        if (
          notification.title !== "User Online" &&
          notification.title !== "User Offline"
        ) {
          console.log("📬 New notification received:", notification);
          addNotification(notification);
        }

        // Show browser notification
        if ("Notification" in window) {
          if (Notification.permission === "granted") {
            new Notification(notification.title, {
              body: notification.content,
              tag: "job-app-notification",
              icon: "https://cdn-icons-png.flaticon.com/512/8279/8279643.png",
            });
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((perm) => {
              if (perm === "granted") {
                new Notification(notification.title, {
                  body: notification.content,
                  tag: "job-app-notification",
                });
              }
            });
          }
        }

        if (userInteracted) {
          new Audio(NOTIFICATION_AUDIO).play().catch(console.error);
        }
      }
    };

    // Handle public notifications similarly
    const handlePublicNotification = (notification: NotificationItem) => {
      if (
        notification.title !== "User Online" &&
        notification.title !== "User Offline"
      ) {
        console.log("📬 New public notification received:", notification);
        addNotification(notification);
      }

      // Show browser notification
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(notification.title, {
            body: notification.content,
            tag: "job-app-notification",
            icon: "https://cdn-icons-png.flaticon.com/512/8279/8279643.png",
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((perm) => {
            if (perm === "granted") {
              new Notification(notification.title, {
                body: notification.content,
                tag: "job-app-notification",
              });
            }
          });
        }
      }

      if (userInteracted) {
        new Audio(NOTIFICATION_AUDIO).play().catch(console.error);
      }
    };

    // Set up all listeners
    socket.on("private.notification", handlePrivateNotification);
    socket.on("public.notification", handlePublicNotification);

    return () => {
      socket.off("private.notification", handlePrivateNotification);
      socket.off("public.notification", handlePublicNotification);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, socket, connectSocket, addNotification, userInteracted]);

  return null;
};

export default NotificationSocketHandler;
