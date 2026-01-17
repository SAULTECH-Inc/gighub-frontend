import { useQuery } from "@tanstack/react-query";
import { APIResponse, NetworkDetails } from "../utils/types";
import { searchUsers } from "../services/api";

export const useSearchUserConnections = (
  page: number,
  limit: number,
  searchFilters: {
    name?: string;
    profession?: string;
    location?: string;
  },
) => {
  return useQuery<APIResponse<NetworkDetails[]>>({
    queryKey: ["users", page, limit, searchFilters],
    queryFn: () => searchUsers(page, limit, searchFilters),
    staleTime: 1000 * 60 * 5,
  });
};
