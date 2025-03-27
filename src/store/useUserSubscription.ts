import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {privateApiClient} from "../api/axios.ts";
import {APIResponse} from "../utils/types";
import {NODE_ENV, secureStorageWrapper} from "../utils/constants.ts";

interface ISubscription {
    id: string;
    subscriptionType: string;
    billingCycle: string;
    status: string;
    subscriptionDate: Date | string;
    subscriptionEndDate: Date | string;
    nextSubscriptionDate: Date | string;
    price: number;
    currency: string;
}

interface ISubscriptionInvoices {
    id: string;
    createdAt: Date | string;
    url: string;
}

interface ISubscriptionHistory {
    history: ISubscription,
    invoices: ISubscriptionInvoices
}

interface ISubscriptionState {
    currentSubscription: ISubscription | null,
    subscriptionHistory: ISubscriptionHistory | [],
    invoices: ISubscriptionInvoices[] | [],
    setSubscriptionHistory: (history: ISubscriptionHistory) => void,
    setSubscription: (subscription: ISubscription) => void
    setSubscriptionInvoices: (invoices: ISubscriptionInvoices[]) => void,
    resetSubscription: () => void,
    resetInvoices: () => void,
    fetchSubscription: (userId: number) => Promise<ISubscription | null>,
    fetchSubscriptionHistory: (userId: number) => Promise<ISubscriptionHistory | null>,
}

export const useUserSubscription = create<ISubscriptionState>()(persist(immer<ISubscriptionState>((set) => ({
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
            const response = await privateApiClient.get<APIResponse<ISubscription>>(`/api/user/${userId}/subscription`);
            set((state) => {
                state.currentSubscription = response?.data?.data;
            });
            return response?.data?.data;
        } catch (error) {
            console.error("Error fetching subscription:", error);
            return null;
        }

    },
    fetchSubscriptionHistory: async (userId) => {
        try {
            const response = await privateApiClient.get<APIResponse<ISubscriptionHistory>>(`/api/user/${userId}/subscription-history`);
            set((state) => {
                state.subscriptionHistory = response?.data?.data;
            });
            return response?.data?.data;
        } catch (error) {
            console.error("Error fetching subscription history:", error);
            return null;
        }
    },
})), {
    name: 'user-subscription',
    storage: createJSONStorage(() => NODE_ENV === 'production' ? secureStorageWrapper : localStorage),
    partialize: state => ({
        currentSubscription: state.currentSubscription,
        subscriptionHistory: state.subscriptionHistory,
        invoices: state.invoices,
    })
}));
