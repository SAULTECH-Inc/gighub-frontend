import { useQuery } from "@tanstack/react-query";
import { fetchTopRecommendedJob } from "../services/api";

export const useFetchTopRecommendedJob = () => {
  return useQuery({
    queryKey: ["top-recommended-job"],
    queryFn: () => fetchTopRecommendedJob(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    select: (data) => data,
  });
};
