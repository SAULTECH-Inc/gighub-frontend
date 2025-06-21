import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { NODE_ENV, secureStorageWrapper } from "../utils/constants.ts";

interface UseNetworkTabState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useNetworkTab = create<UseNetworkTabState>()(
  persist(
    (set) => ({
      activeTab: "find-new-connections",
      setActiveTab: (tab: string) => set({ activeTab: tab }),
    }),
    {
      name: "network-tab-storage",
      storage: createJSONStorage(() =>
        NODE_ENV === "production" ? secureStorageWrapper : localStorage,
      ),
    },
  ),
);
