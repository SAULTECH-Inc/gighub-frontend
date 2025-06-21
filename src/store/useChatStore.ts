import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import io, { Socket } from "socket.io-client";
import { ChatMessage } from "../chat-module/types";
import { APIResponse, NetworkDetails } from "../utils/types";
import { privateApiClient } from "../client/axios.ts";

const SOCKET_URL = import.meta.env.CHAT_SERVER_URL || "http://localhost:3003";

interface ChatStore {
  unreadCount: number;
  setUnreadCount: (unreadCount: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;

  connectionStatus: string;
  setUserStatus: (user: string, userStatus: string) => void;
  setConnectionStatus: (connectionStatus: string) => void;

  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;

  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;

  recipient: string | null;
  recipientDetails: NetworkDetails;
  setRecipientDetails: (recipientDetails: NetworkDetails) => void;
  setRecipient: (recipient: string) => void;

  message: string;
  setMessage: (message: string) => void;
  file: File | null;
  setFile: (file: File) => void;

  isEmojiPickerVisible: boolean;
  setIsEmojiPickerVisible: (isEmojiPickerVisible: boolean) => void;
  sender: string;
  setSender: (sender: string) => void;

  isMinimized: boolean;
  setIsMinimized: (isMinimized: boolean) => void;
  isClosed: boolean;
  setIsClosed: (isClosed: boolean) => void;
  isEdit: boolean;
  setIsEdit: (isEdit: boolean) => void;

  fetchOneToOneMessages: (
    sender: string,
    recipient: string,
    page?: number,
    limit?: number,
  ) => Promise<ChatMessage[]>;
  fetchGroupMessages: (
    groupID: number,
    page?: number,
    limit?: number,
  ) => Promise<ChatMessage[]>;
  fetchPrivateMessages: (
    sender: string,
    recipient: string,
    page?: number,
    limit?: number,
  ) => Promise<ChatMessage[]>;
  fetchAllMyMessages: (
    sender: string,
    recipient: string,
    page?: number,
    limit?: number,
  ) => Promise<ChatMessage[]>;
  createGroup: (group: { name: string; members: string[] }) => Promise<boolean>;
}

export const useChatStore = create(
  devtools(
    persist(
      immer<ChatStore>((set, get) => ({
        // ✅ UNREAD MESSAGES
        unreadCount: 0,
        incrementUnread: () => {
          set((state) => {
            state.unreadCount += 1;
          });
        },
        decrementUnread: () => {
          set((state) => {
            if (state.unreadCount > 0) state.unreadCount -= 1;
          });
        },
        setUnreadCount: (unreadCount: number) => {
          set((state) => {
            state.unreadCount = unreadCount;
          });
        },
        // ✅ CONNECTION STATUS
        connectionStatus: "disconnected",
        setConnectionStatus: (connectionStatus: string) => {
          set((state) => {
            state.connectionStatus = connectionStatus;
          });
        },
        setUserStatus: (sender: string, userStatus: string) => {
          set((state) => {
            if (state.sender !== sender) return; // Only update if the sender matches
            state.connectionStatus = userStatus;
          });
        },
        messages: [],
        setMessages: (messages: ChatMessage[]) => {
          set((state) => {
            state.messages = messages;
          });
        },
        addMessage: (message) => {
          set((state) => {
            state.messages.push(message);
          });
        },

        // ✅ SOCKET MANAGEMENT
        socket: null,

        connectSocket: () => {
          console.log("One");
          if (get().socket) return; // Prevent duplicate connections
          console.log("Two");

          const sender = get().sender;
          if (!sender) return; // Ensure sender is set
          console.log("Three");

          const socketInstance = io(SOCKET_URL, {
            query: { sender },
            transports: ["websocket"],
          });
          console.log("Four");

          socketInstance.on("connect", () => {
            console.log(`✅ Connected to server: ${socketInstance.id}`);
            set({ socket: socketInstance });
          });
          console.log("five");

          socketInstance.on("disconnect", () => {
            console.log("⚠️ Socket disconnected.");
            set({ socket: null });
          });
          console.log("six");

          set({ socket: socketInstance });
        },

        disconnectSocket: () => {
          const socket = get().socket;
          if (socket) {
            console.log(`🔌 Manually disconnecting socket`);
            socket.disconnect();
            set({ socket: null });
          }
        },

        recipient: null,
        setRecipient: (recipient) => {
          set((state) => {
            state.recipient = recipient;
          });
        },
        recipientDetails: {} as NetworkDetails,
        setRecipientDetails: (recipientDetails) => {
          set((state) => {
            state.recipientDetails = recipientDetails;
          });
        },

        message: "",
        setMessage: (message) => {
          set((state) => {
            state.message = message;
          });
        },
        file: null,
        setFile: (file) => {
          set((state) => {
            state.file = file;
          });
        },

        isEmojiPickerVisible: false,
        setIsEmojiPickerVisible: (isEmojiPickerVisible) => {
          set((state) => {
            state.isEmojiPickerVisible = isEmojiPickerVisible;
          });
        },
        sender: "",
        setSender: (sender) => {
          set((state) => {
            state.sender = sender;
          });
        },

        isMinimized: false,
        setIsMinimized: (isMinimized) => {
          set((state) => {
            state.isMinimized = isMinimized;
          });
        },
        isClosed: false,
        setIsClosed: (isClosed) => {
          set((state) => {
            state.isClosed = isClosed;
          });
        },
        isEdit: false,
        setIsEdit: (isEdit) => {
          set((state) => {
            state.isEdit = isEdit;
          });
        },

        // ✅ MESSAGE FETCHING API CALLS
        fetchOneToOneMessages: async (
          sender,
          recipient,
          page = 1,
          limit = 20,
        ) => {
          try {
            const response = await privateApiClient.get<
              APIResponse<ChatMessage[]>
            >(
              `/messages/get-one-to-one/${sender}/${recipient}?page=${page}&limit=${limit}`,
            );
            return response.data.data;
          } catch (error) {
            console.error("Error fetching one-to-one messages:", error);
            return [];
          }
        },
        fetchGroupMessages: async (groupID, page = 1, limit = 20) => {
          try {
            const response = await privateApiClient.get<
              APIResponse<ChatMessage[]>
            >(`/messages/get-group/${groupID}?page=${page}&limit=${limit}`);
            return response.data.data;
          } catch (error) {
            console.error("Error fetching group messages:", error);
            return [];
          }
        },
        fetchPrivateMessages: async (
          sender,
          recipient,
          page = 1,
          limit = 20,
        ) => {
          try {
            const response = await privateApiClient.get<
              APIResponse<ChatMessage[]>
            >(
              `/messages/get-private/${sender}/${recipient}?page=${page}&limit=${limit}`,
            );
            return response.data.data;
          } catch (error) {
            console.error("Error fetching private messages:", error);
            return [];
          }
        },
        fetchAllMyMessages: async (sender, recipient, page = 1, limit = 20) => {
          try {
            const response = await privateApiClient.get<
              APIResponse<ChatMessage[]>
            >(
              `/messages/get-all/${sender}/${recipient}?page=${page}&limit=${limit}`,
            );
            return response.data.data;
          } catch (error) {
            console.error("Error fetching all my messages:", error);
            return [];
          }
        },
        createGroup: async (group) => {
          try {
            const response = await privateApiClient.post<APIResponse<boolean>>(
              "/groups/create",
              group,
            );
            return response.data.data;
          } catch (error) {
            console.error("Error creating group:", error);
            return false;
          }
        },
      })),
      {
        name: "chat-store",
        partialize: (state) => ({
          socket: state.socket,
          isEmojiPickerVisible: state.isEmojiPickerVisible,
          isMinimized: state.isMinimized,
          isClosed: state.isClosed,
          isEdit: state.isEdit,
          messages: state.messages,
          sender: state.sender,
          recipient: state.recipient,
          message: state.message,
          recipientDetails: state.recipientDetails,
          unreadCount: state.unreadCount,
          connectionStatus: state.connectionStatus,
          file: state.file,
        }),
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
