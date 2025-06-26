import { useMemo } from "react";
import { Option } from "../utils/types";
import { useQuery } from "@tanstack/react-query";


const fetchCities = async (): Promise<Option[]> => {
  const res = await fetch("https://countriesnow.space/api/v0.1/countries/population/cities");
  const json = await res.json();
  return json.data.map((c: any) => ({
    label: c.city,
    value: c.city,
  }));
};

export const useCities = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cities"],
    queryFn: fetchCities,
    staleTime: 1000 * 60 * 60, // 1 hour caching
  });

  const sortedCities = useMemo(() => {
    if (!data) return [];
    return data.sort((a, b) => a.label.localeCompare(b.label));
  }, [data]);

  return {
    cities: sortedCities,
    loading: isLoading,
    error: isError,
    refetch,
  };
};
