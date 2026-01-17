import { ApplicationResponse } from "../utils/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { NODE_ENV, secureStorageWrapper } from "../utils/constants.ts";

interface ApplicationViewState {
  selectedApplication: ApplicationResponse | null;
  setSelectedApplication: (application: ApplicationResponse) => void;
  applicationStatus: string;
  setApplicationStatus: (status: string) => void;
  sort: string;
  setSort: (sort: string) => void;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  total: number;
  setTotal: (total: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  resetState: () => void;
}

export const useApplicationView = create<ApplicationViewState>()(
  persist(
    (set) => ({
      selectedApplication: null,
      setSelectedApplication: (application) =>
        set({ selectedApplication: application }),

      applicationStatus: "all",
      setApplicationStatus: (status) => set({ applicationStatus: status }),

      sort: "",
      setSort: (sort) => set({ sort }),

      page: 1,
      setPage: (page) => set({ page }),

      limit: 10,
      setLimit: (limit) => set({ limit }),

      totalPages: 0,
      setTotalPages: (totalPages) => set({ totalPages }),

      total: 0,
      setTotal: (total) => set({ total }),

      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      resetState: () =>
        set({
          selectedApplication: null,
          applicationStatus: "",
          sort: "",
          page: 1,
          limit: 10,
          totalPages: 0,
          total: 0,
          isLoading: false,
        }),
    }),
    {
      partialize: (state) => ({
        applicationStatus: state.applicationStatus,
        sort: state.sort,
        page: state.page,
        limit: state.limit,
        totalPages: state.totalPages,
        total: state.total,
        isLoading: state.isLoading,
        selectedApplication: state.selectedApplication,
      }),
      storage: createJSONStorage(() =>
        NODE_ENV === "development" ? localStorage : secureStorageWrapper,
      ),
      name: "application-view-storage", // localStorage key
    },
  ),
);
