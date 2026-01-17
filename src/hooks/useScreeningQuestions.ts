import { useQuery } from "@tanstack/react-query";
import { fetchScreeningQuestions } from "../services/api";

interface UseScreeningQuestionsOptions {
  jobId: number | undefined;
  enabled?: boolean;
}


export const useScreeningQuestions = ({ jobId, enabled = true }: UseScreeningQuestionsOptions) => {
  return useQuery({
    queryKey: ['screeningQuestions', jobId],
    queryFn: async () =>  fetchScreeningQuestions(jobId as number),
    select: res => res.data,
    enabled: enabled && !!jobId, // Only fetch when enabled and jobId exists
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
    retry: 1, // Only retry once on failure
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
};
