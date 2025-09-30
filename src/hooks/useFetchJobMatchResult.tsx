import { useQuery } from "@tanstack/react-query";
import { fetchJobMatchResult } from "../services/api";

export const useFetchJobMatchResult = (applicantId: number, jobId: number)=>{
  return useQuery({
    queryKey: ['useFetchJobMatchResult',applicantId, jobId],
    queryFn: ()=>fetchJobMatchResult(applicantId, jobId),
    // staleTime: 5 * 1000 * 60,
    // enabled: true
  })
}
