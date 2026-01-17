// In your hooks file
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../services/api";
import { ApplicantData } from "../utils/types";

export const useApplicant = (userId: number) => {
  return useQuery({
    queryKey: ["applicant", userId],
    queryFn: () => fetchUser(userId),
    select: (res) => res?.data as ApplicantData, // Cast to ApplicantData
    enabled: !!userId && !isNaN(userId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
