import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import io, { Socket } from "socket.io-client";
import { NotificationItem } from "../utils/types";

const SOCKET_URL =
  import.meta.env.VITE_NOTIFICATION_SOCKET_URL || "http://localhost:3009";

interface NotificationState {
  unreadCount: number;
  incrementUnread: () => void;
  markAsRead: (id: string) => void;
  clearUnread: () => void;

  connectionStatus: string;
  setConnectionStatus: (status: string) => void;

  notifications: NotificationItem[];
  addNotification: (item: NotificationItem) => void;
  setNotifications: (items: NotificationItem[]) => void;
  removeNotification: (id: string) => void;

  socket: Socket | null;
  connectSocket: (userId: string) => void;
  disconnectSocket: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    persist(
      immer<NotificationState>((set, get) => ({
        unreadCount: 0,
        incrementUnread: () => {
          set((state) => {
            state.unreadCount += 1;
          });
        },
        clearUnread: () => {
          set((state) => {
            state.unreadCount = 0;
          });
        },
        markAsRead: (id: string) => {
          set((state) => {
            const notification = state.notifications.find((n) => n?.id === id);
            if (notification) {
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
          });
        },

        connectionStatus: "disconnected",
        setConnectionStatus: (status: string) => {
          set((state) => {
            state.connectionStatus = status;
          });
        },

        notifications: [],
        addNotification: (item: NotificationItem) => {
          set((state) => {
            state.notifications.unshift(item);
            state.unreadCount += 1;
          });
        },
        setNotifications: (items: NotificationItem[]) => {
          set((state) => {
            state.notifications = items;
            state.unreadCount = items.length;
          });
        },
        removeNotification: (id: string) => {
          set((state) => {
            state.notifications = state.notifications.filter(
              (n) => n.id !== id,
            );
          });
        },

        socket: null,
        connectSocket: (userId: string) => {
          const existing = get().socket;
          if (existing) return;

          const socketInstance = io(SOCKET_URL, {
            query: { userId },
            transports: ["websocket"],
          });

          socketInstance.on("connect", () => {
            console.log("✅ Notification socket connected");
            set({ socket: socketInstance, connectionStatus: "connected" });
          });

          socketInstance.on("disconnect", () => {
            console.warn("⚠️ Notification socket disconnected");
            set({ socket: null, connectionStatus: "disconnected" });
          });

          console.log("🔔 Setting up notification listeners");
          socketInstance.on(
            "newNotification",
            (notification: NotificationItem) => {
              get().addNotification(notification);

              if (
                "Notification" in window &&
                Notification.permission === "granted"
              ) {
                new Notification(notification.title, {
                  body: notification.content,
                });
              }

              const audio = new Audio("/notification.mp3");
              audio.play().catch(console.error);
            },
          );

          set({ socket: socketInstance });
        },

        disconnectSocket: () => {
          const socket = get().socket;
          if (socket) {
            socket.disconnect();
            set({ socket: null, connectionStatus: "disconnected" });
          }
        },
      })),
      {
        name: "job-notification-store",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          notifications: state.notifications,
          unreadCount: state.unreadCount,
        }),
      },
    ),
  ),
);
