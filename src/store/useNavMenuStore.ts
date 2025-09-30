import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { NODE_ENV, secureStorageWrapper } from "../utils/constants.ts";

interface ISettingsNavItems {
  account: boolean;
  notification: boolean;
  autoApply: boolean; // Add this
  privacy: boolean;
  subscription: boolean;

}

interface NavMenuStore {
  settings: ISettingsNavItems;
  toggleSetting: (setting: keyof ISettingsNavItems) => void;
}

export const useNavMenuStore = create<NavMenuStore>()(
  devtools(
    persist(
      immer<NavMenuStore>((set) => ({
        settings: {
          account: true,
          notification: false,
          autoApply: false,
          privacy: false,
          subscription: false,
        },
        toggleSetting: (setting: keyof ISettingsNavItems) => {
          set((state) => {
            // Disable all settings first
            Object.keys(state.settings).forEach((key) => {
              state.settings[key as keyof ISettingsNavItems] = false;
            });

            // Enable the clicked setting
            state.settings[setting] = true;
          });
        },
      })),
      {
        name: "nav-menu-store",
        partialize: (state) => ({
          settings: state.settings,
        }),
        storage: createJSONStorage(() =>
          NODE_ENV === "production" ? secureStorageWrapper : localStorage,
        ),
      },
    ),
  ),
);
