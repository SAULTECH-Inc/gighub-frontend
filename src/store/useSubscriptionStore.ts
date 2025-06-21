import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { privateApiClient } from "../client/axios.ts";
import {
  APIResponse,
  SubscriptionResponse,
  UserSubscriptionResponse,
} from "../utils/types";
import {
  NODE_ENV,
  secureStorageWrapper,
  SUBSCRIPTION_SERVICE_HOST,
} from "../utils/constants.ts";

interface SubscriptionStateStore {
  isSubscribed: boolean;
  subscription: UserSubscriptionResponse | null;
  history: UserSubscriptionResponse[] | [];
  subscriptionPlans: SubscriptionResponse[];
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;

  setIsSubscribed: (isSubscribed: boolean) => void;
  setSubscription: (sub: UserSubscriptionResponse) => void;
  setSubscriptionPlans: (plans: SubscriptionResponse[]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsError: (error: boolean) => void;
  setIsSuccess: (success: boolean) => void;

  getUserSubscription: (
    userId: number,
  ) => Promise<APIResponse<UserSubscriptionResponse | null>>;
  getUserSubscriptionHistory: (
    userId: number,
  ) => Promise<APIResponse<UserSubscriptionResponse[] | []>>;
  getSubscriptionPlans: () => Promise<APIResponse<SubscriptionResponse[] | []>>;
  cancelSubscription: (userId: number) => Promise<APIResponse<void>>;
  subscribe: (
    userId: number,
    planId: number,
  ) => Promise<APIResponse<UserSubscriptionResponse | null>>;
  resubscribe: (
    userId: number,
    planId: number,
  ) => Promise<APIResponse<UserSubscriptionResponse | null>>;
  resetSubscription: () => void;
}

export const useSubscriptionStore = create<SubscriptionStateStore>()(
  persist(
    immer<SubscriptionStateStore>((set) => ({
      isSubscribed: false,
      subscription: null,
      history: [],
      subscriptionPlans: [],
      isLoading: false,
      isError: false,
      isSuccess: false,

      setIsSubscribed: (value) =>
        set((state) => {
          state.isSubscribed = value;
        }),

      setSubscription: (sub) =>
        set((state) => {
          state.subscription = sub;
        }),

      setSubscriptionPlans: (plans) =>
        set((state) => {
          state.subscriptionPlans = plans;
        }),

      setIsLoading: (loading) =>
        set((state) => {
          state.isLoading = loading;
        }),

      setIsError: (error) =>
        set((state) => {
          state.isError = error;
        }),

      setIsSuccess: (success) =>
        set((state) => {
          state.isSuccess = success;
        }),

      getUserSubscription: async (userId) => {
        try {
          set((state) => {
            state.isLoading = true;
            state.isError = false;
          });

          const response = await privateApiClient.get<
            APIResponse<UserSubscriptionResponse>
          >(`${SUBSCRIPTION_SERVICE_HOST}/subscriptions/users/${userId}`);
          const rawResponse = response.data;
          const data = rawResponse.data;

          set((state) => {
            state.subscription = data;
            state.isSubscribed = data.isActive;
            state.isSuccess = true;
            state.isLoading = false;
          });

          return rawResponse;
        } catch (error: any) {
          console.error("Error fetching user subscription:", error);
          set((state) => {
            state.isError = true;
            state.isLoading = false;
          });
          return {
            message: error.message || "Error fetching user subscription",
            data: null,
            statusCode: error.response?.status || 500,
          };
        }
      },
      getUserSubscriptionHistory: async (userId) => {
        try {
          set((state) => {
            state.isLoading = true;
            state.isError = false;
          });

          const response = await privateApiClient.get<
            APIResponse<UserSubscriptionResponse[]>
          >(
            `${SUBSCRIPTION_SERVICE_HOST}/subscriptions/users/${userId}/subscription-history`,
          );
          const rawResponse = response.data;
          const history = rawResponse.data;

          set((state) => {
            state.history = history;
            state.isLoading = false;
          });

          return rawResponse;
        } catch (error: any) {
          console.error("Error fetching user subscription history:", error);
          set((state) => {
            state.isError = true;
            state.isLoading = false;
          });

          return {
            message: "Error fetching subscription history",
            data: [],
            statusCode: 500,
          } as APIResponse<UserSubscriptionResponse[]>;
        }
      },

      getSubscriptionPlans: async () => {
        try {
          set((state) => {
            state.isLoading = true;
            state.isError = false;
          });

          const response = await privateApiClient.get<
            APIResponse<SubscriptionResponse[]>
          >(`/api/subscription/plans`);
          const rawResponse = response.data;
          const plans = rawResponse.data;

          set((state) => {
            state.subscriptionPlans = plans;
            state.isLoading = false;
          });

          return rawResponse;
        } catch (error: any) {
          console.error("Error fetching subscription plans:", error);
          set((state) => {
            state.isError = true;
            state.isLoading = false;
          });

          return {
            message: "Error fetching plans",
            data: [],
            statusCode: 500,
          } as APIResponse<SubscriptionResponse[]>;
        }
      },

      cancelSubscription: async (userId) => {
        try {
          const response = await privateApiClient.post<APIResponse<void>>(
            `/api/subscription/cancel`,
            { userId },
          );

          set((state) => {
            state.subscription = null;
            state.isSubscribed = false;
          });

          return response.data;
        } catch (error: any) {
          console.error("Error cancelling subscription:", error);
          set((state) => {
            state.isError = true;
          });

          return {
            message: "Error cancelling subscription",
            data: undefined,
            statusCode: 500,
          } as APIResponse<void>;
        }
      },

      subscribe: async (userId, planId) => {
        try {
          const response = await privateApiClient.post<
            APIResponse<UserSubscriptionResponse>
          >(`/api/subscription/subscribe`, { userId, planId });
          const rawResponse = response.data;
          const data = rawResponse.data;

          set((state) => {
            state.subscription = data;
            state.isSubscribed = true;
          });

          return rawResponse;
        } catch (error: any) {
          console.error("Error subscribing:", error);
          set((state) => {
            state.isError = true;
          });
          return {
            message: "Error subscribing",
            data: null,
            statusCode: 500,
          } as APIResponse<UserSubscriptionResponse | null>;
        }
      },

      resubscribe: async (userId, planId) => {
        try {
          const response = await privateApiClient.post<
            APIResponse<UserSubscriptionResponse>
          >(`/api/subscription/resubscribe`, { userId, planId });
          const rawResponse = response.data;
          const data = rawResponse.data;

          set((state) => {
            state.subscription = data;
            state.isSubscribed = true;
          });

          return rawResponse;
        } catch (error: any) {
          console.error("Error resubscribing:", error);
          set((state) => {
            state.isError = true;
          });
          return {
            message: "Error resubscribing",
            data: null,
            statusCode: 500,
          } as APIResponse<UserSubscriptionResponse | null>;
        }
      },

      resetSubscription: () => {
        set((state) => {
          state.subscription = null;
          state.subscriptionPlans = [];
          state.isSubscribed = false;
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = false;
        });
      },
    })),
    {
      name: "subscription-store",
      storage: createJSONStorage(() =>
        NODE_ENV === "development"
          ? localStorage
          : {
              getItem: secureStorageWrapper.getItem,
              setItem: secureStorageWrapper.setItem,
              removeItem: secureStorageWrapper.removeItem,
            },
      ),
      partialize: (state) => ({
        isSubscribed: state.isSubscribed,
        subscription: state.subscription,
        subscriptionPlans: state.subscriptionPlans,
        isLoading: state.isLoading,
        isError: state.isError,
        isSuccess: state.isSuccess,
      }),
    },
  ),
);
