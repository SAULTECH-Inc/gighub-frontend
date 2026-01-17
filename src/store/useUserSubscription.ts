import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { privateApiClient } from "../client/axios.ts";
import { APIResponse } from "../utils/types";
import {
  NODE_ENV,
  secureStorageWrapper,
  SUBSCRIPTION_SERVICE_HOST,
} from "../utils/constants.ts";
import { BillingCycle, SubscriptionType } from "../utils/enums.ts";

export interface ISubscription {
  id: string;
  billingCycle: BillingCycle;
  status: string;
  nextSubscriptionDate: Date | string;
  price: number;
  currency: string;
  type: SubscriptionType;
  name: string;
  duration: number;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubscriptionInvoices {
  id: string;
  createdAt: Date | string;
  url: string;
}

export interface ISubscriptionHistory {
  history: ISubscription;
  invoices: ISubscriptionInvoices;
}

interface ISubscriptionState {
  currentSubscription: ISubscription | null;
  subscriptionHistory: ISubscriptionHistory | [];
  invoices: ISubscriptionInvoices[] | [];
  setSubscriptionHistory: (history: ISubscriptionHistory) => void;
  setSubscription: (subscription: ISubscription) => void;
  setSubscriptionInvoices: (invoices: ISubscriptionInvoices[]) => void;
  resetSubscription: () => void;
  resetInvoices: () => void;
  fetchSubscription: (userId: number) => Promise<ISubscription | null>;
  fetchSubscriptionHistory: (
    userId: number,
  ) => Promise<ISubscriptionHistory | null>;
}

export const useUserSubscription = create<ISubscriptionState>()(
  persist(
    immer<ISubscriptionState>((set) => ({
      currentSubscription: null,
      subscriptionHistory: [],
      invoices: [],
      setSubscriptionHistory: (history) => {
        set((state) => {
          state.subscriptionHistory = history;
        });
      },
      setSubscription: (subscription) => {
        set((state) => {
          state.currentSubscription = subscription;
        });
      },
      setSubscriptionInvoices: (invoices) => {
        set((state) => {
          state.invoices = invoices;
        });
      },
      resetSubscription: () => {
        set((state) => {
          state.currentSubscription = null;
        });
      },
      resetInvoices: () => {
        set((state) => {
          state.invoices = [];
        });
      },
      fetchSubscription: async (userId) => {
        try {
          const response = await privateApiClient.get<
            APIResponse<ISubscription>
          >(`${SUBSCRIPTION_SERVICE_HOST}/subscriptions/users/${userId}`);
          set((state) => {
            state.currentSubscription = response?.data?.data;
          });
          console.log(
            "SUBSCRIPTION ::: " + JSON.stringify(response?.data?.data),
          );
          return response?.data?.data;
        } catch (error: any) {
          console.error("Error fetching subscription:", error?.response?.data);
          return null;
        }
      },
      fetchSubscriptionHistory: async (userId) => {
        try {
          const response = await privateApiClient.get<
            APIResponse<ISubscriptionHistory>
          >(
            `${SUBSCRIPTION_SERVICE_HOST}/subscriptions/users/${userId}/subscription-history`,
          );
          set((state) => {
            state.subscriptionHistory = response?.data?.data;
          });
          return response?.data?.data;
        } catch (error: any) {
          console.error("Error fetching subscription:", error?.response?.data);
          return null;
        }
      },
    })),
    {
      name: "user-subscription",
      storage: createJSONStorage(() =>
        NODE_ENV === "production" ? secureStorageWrapper : localStorage,
      ),
      partialize: (state) => ({
        currentSubscription: state.currentSubscription,
        subscriptionHistory: state.subscriptionHistory,
        invoices: state.invoices,
      }),
    },
  ),
);
