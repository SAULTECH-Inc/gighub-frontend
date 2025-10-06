import { useQuery } from "@tanstack/react-query";
import { fetchFlutterwaveEncryptionKey } from "../services/api";

export const useFetchFlutterwaveEncryptionKey = () => {
  return useQuery({
    queryKey: ["useFetchFlutterwaveEncryptionKey"],
    queryFn: () => fetchFlutterwaveEncryptionKey(),
    staleTime: 5 * 1000 * 60,
    enabled: true,
  });
};
