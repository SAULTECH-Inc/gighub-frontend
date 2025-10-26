import { useQuery } from "@tanstack/react-query";
import { fetchJobDetailsRelativeToMe } from "../services/api";
interface UseFetchJobDetailsRelativeToMeOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: boolean | number;
}
export const useFetchJobDetailsRelativeToMe = (
  jobId: number,
  options?: UseFetchJobDetailsRelativeToMeOptions,
) => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus = false,
  } = options || {};

  return useQuery({
    queryKey: ["jobDetailsRelativeToMe", jobId],
    queryFn: () => fetchJobDetailsRelativeToMe(jobId),
    enabled: enabled && !!jobId,
    staleTime: staleTime,
    refetchOnWindowFocus: refetchOnWindowFocus,
    retry: true,
    select: (data) => data.data,
  });
};
