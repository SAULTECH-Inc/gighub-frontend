import { useQuery } from "@tanstack/react-query";
import { APIResponse, FeatureJob } from "../utils/types";
import { fetchFeaturedJobs } from "../services/api";
const useFetchFeaturedJobs = (limit: number) => {
  return useQuery<APIResponse<FeatureJob[]>>({
    queryKey: ["featured-jobs", limit],
    queryFn: () => fetchFeaturedJobs(limit),
    staleTime: 5 * 1000 * 60,
    enabled: true,
  });
};

export default useFetchFeaturedJobs;
