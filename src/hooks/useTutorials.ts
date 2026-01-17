// hooks/useTutorials.ts
import { useQuery } from "@tanstack/react-query";
import { fetchTutorials } from "../services/api";
import { tutorialsQueryKeys } from "../utils/tutorials.query-keys";

export const useGetAllTutorials = () => {
  return useQuery({
    queryKey: tutorialsQueryKeys.list(),
    queryFn: fetchTutorials,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
