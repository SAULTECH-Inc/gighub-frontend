import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface IntialState {
  activeItem: string;
  setActiveItem: (item: string) => void;
}
export const useNavBarActiveItem = create<IntialState>()(
  devtools(
    persist(
      immer<IntialState>((set) => ({
        activeItem: "Dashboard",
        setActiveItem: (item) => {
          set((state) => {
            state.activeItem = item;
          });
        },
      })),
      {
        name: "nav-bar-active-item",
        storage: createJSONStorage(() => localStorage),
      },
    ),
    {
      name: "nav-bar-active-item",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
