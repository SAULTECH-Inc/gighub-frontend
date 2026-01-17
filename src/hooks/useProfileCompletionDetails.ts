import { useQuery } from "@tanstack/react-query";
import { getProfileCompletionDetails } from "../services/api";

export const useProfileCompletionDetails = ()=>{
  return useQuery({
    queryKey: ['profileCompletion'],
    queryFn: async()=>getProfileCompletionDetails(),
    staleTime: 5 * 1000 * 60,
    enabled: true,
    select: res => res.data
  })
}
