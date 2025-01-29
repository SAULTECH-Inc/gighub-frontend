import { create } from "zustand";
import { createFormSlice, FormSlice } from "./slices/formSlice";

type AppState = FormSlice;

export const useStore = create<AppState>()((...a) => ({
  ...createFormSlice(...a),
}));
