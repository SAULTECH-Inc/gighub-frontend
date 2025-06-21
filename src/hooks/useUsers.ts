import { useQuery } from "@tanstack/react-query";
import { APIResponse, NetworkDetails } from "../utils/types";
import { fetchUsers } from "../services/api"; // adjust path

export const useUsers = (userId: number, page: number, limit: number) => {
  return useQuery<APIResponse<NetworkDetails[]>>({
    queryKey: ["users", userId, page, limit],
    queryFn: () => fetchUsers(userId, page, limit),
  });
};
