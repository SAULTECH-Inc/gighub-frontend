import { APIResponse, NetworkDetails } from "../utils/types";
import { useQuery } from "@tanstack/react-query";
import { fetchConnectionRequests } from "../services/api";

export const useConnectionRequest = (page: number, limit: number) => {
  return useQuery<APIResponse<NetworkDetails[]>>({
    queryKey: ["connectionRequests", page, limit],
    queryFn: () => fetchConnectionRequests(page, limit),
  });
};
