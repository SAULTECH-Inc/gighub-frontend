import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../services/api";

export const useUser = (userId: number) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    select: (res) => res?.data,
    enabled: !!userId && !isNaN(userId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
