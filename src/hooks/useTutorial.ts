// hooks/useTutorial.ts
import { useQuery } from "@tanstack/react-query";
import { tutorialsQueryKeys } from "../utils/tutorials.query-keys.ts";
import { fetchTutorialById } from "../services/api";

export const useGetTutorialById = (id: number) => {
  return useQuery({
    queryKey: tutorialsQueryKeys.detail(id),
    queryFn: () => fetchTutorialById(id),
    enabled: !!id, // IMPORTANT
    staleTime: 5 * 60 * 1000,
  });
};
