import { useQuery } from "@tanstack/react-query";
import { getUserDeviceLocations } from "../services/api";

export const useUserDeviceLocations = ()=>{
  return useQuery({
    queryKey: ['userDeviceLocations'],
    queryFn: async()=>getUserDeviceLocations(),
    staleTime: 5 * 1000 * 60,
    enabled: true
  })
}
