import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface InitialState {
  activeItem: string;
  setActiveItem: (item: string) => void;
}
export const useNavBarActiveItem = create<InitialState>()(
  devtools(
    persist(
      immer<InitialState>((set) => ({
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
