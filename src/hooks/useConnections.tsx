import { useQuery } from "@tanstack/react-query";
import { APIResponse, NetworkDetails } from "../utils/types";
import { fetchMyConnections } from "../services/api";

export const useConnections = (userId: number, page: number, limit: number) => {
  return useQuery<APIResponse<NetworkDetails[]>>({
    queryKey: ["users", userId, page, limit],
    queryFn: () => fetchMyConnections(userId, page, limit),
  });
};
