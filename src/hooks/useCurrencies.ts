import { useQuery } from "@tanstack/react-query";
import { Option } from "../utils/types";

const fetchCurrencies = async (): Promise<Option[]> => {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const countries = await res.json();
  const currencySet = new Set<string>();
  countries.forEach((c: any) => {
    if (c.currencies) {
      Object.keys(c.currencies).forEach((cur: string) => currencySet.add(cur));
    }
  });
  return Array.from(currencySet).map((cur) => ({ label: cur, value: cur }));
};

export const useCurrencies = () => {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["currencies"],
    queryFn: fetchCurrencies,
    staleTime: 1000 * 60 * 60,
  });

  return { currencies: data, isLoading, error };
};
