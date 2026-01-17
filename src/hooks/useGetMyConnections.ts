//useGetMyConnections
import { useQuery } from "@tanstack/react-query";
import { APIResponse, NetworkDetails } from "../utils/types";
import { fetchMyConnections } from "../services/api";

const useGetMyConnections = (userId: number, page: number, limit: number) => {
  return useQuery<APIResponse<NetworkDetails[]>>({
    queryKey: ["useGetMyConnections", userId, page, limit],
    queryFn: () => fetchMyConnections(userId, page, limit),
  });
};

export default useGetMyConnections;
