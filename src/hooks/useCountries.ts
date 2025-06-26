import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Option } from "../utils/types";

const fetchCountries = async (): Promise<Option[]> => {
  const res = await fetch("https://countriesnow.space/api/v0.1/countries/iso");
  const json = await res.json();
  return json.data.map((country: any) => ({
    label: country.name,
    value: country.Iso2 || country.name,
  }));
};

export const useCountries = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  const sortedCountries = useMemo(() => {
    if (!data) return [];
    return data.sort((a, b) => a.label.localeCompare(b.label));
  }, [data]);

  return {
    countries: sortedCountries,
    loading: isLoading,
    error: isError,
    refetch,
  };
};
