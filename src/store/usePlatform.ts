import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { APIResponse, SupportRequest } from "../utils/types";
import { API_BASE_URL } from "../utils/constants";
import { publicApiClient } from "../client/axios";

interface PlatformState {
  isSubscribed: boolean;
  subscribe: (email: string) => Promise<void>;
  unsubscribe: (email: string) => Promise<void>;
  contactCustomerSupport: (supportRequest: SupportRequest) => Promise<APIResponse<void>>;
}

export const usePlatform = create<PlatformState>()(
  persist(
    immer<PlatformState>((set) => ({
      isSubscribed: false,
      subscribe: async (email: string) => {
        try {
          const response = await publicApiClient.get(
            `${API_BASE_URL}/platform/subscribe?email=${email}`
          );
          if (response.status === 200) {
            set((state) => {
              state.isSubscribed = true;
            });
          } else {
            console.error("Subscription failed:", response.statusText);
          }
        } catch (error) {
          console.error("Error subscribing:", error);
        }
      },
      unsubscribe: async (email: string) => {
        try {
          const response = await publicApiClient.get(
            `${API_BASE_URL}/platform/unsubscribe?email=${email}`
          );
          if (response.status === 200) {
            set((state) => {
              state.isSubscribed = false;
            });
          } else {
            console.error("Unsubscription failed:", response.statusText);
          }
        } catch (error) {
          console.error("Error unsubscribing:", error);
        }
      },
      contactCustomerSupport: async (supportRequest: SupportRequest) => {
        try {
          const response = await publicApiClient.post<APIResponse<void>>(`${API_BASE_URL}/support`, supportRequest);
          return response.data;
        } catch (error) {
          console.error("Error submitting support request:", error);
          return {
            message: "Error submitting support request",
            statusCode: 500,
          } as APIResponse<void>;
        }
      }
    })),
    { name: "platform-storage",
      partialize: (state) => ({
        isSubscribed: state.isSubscribed
      }) }
  )
);
