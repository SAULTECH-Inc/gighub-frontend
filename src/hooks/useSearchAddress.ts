import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";

export interface AddressResult {
  display_name: string;
  lat: string;
  lon: string;
  [key: string]: any;
}

const fetchAddresses = async (query: string): Promise<AddressResult[]> => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query,
  )}&format=json&limit=5`;

  const res = await fetch(url, {
    headers: {
      "Accept-Language": "en",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch addresses");

  return await res.json();
};

export const useSearchAddress = (query: string, debounceMs = 500) => {
  const debouncedQuery = useDebounce(query, debounceMs);
  const enabled = debouncedQuery.trim().length > 2;

  const { data, isLoading, error } = useQuery({
    queryKey: ["address-search", debouncedQuery],
    queryFn: () => fetchAddresses(debouncedQuery),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  return {
    results: data || [],
    loading: isLoading,
    error,
  };
};
