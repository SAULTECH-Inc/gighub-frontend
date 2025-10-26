import { useQuery } from "@tanstack/react-query";
import { Option } from "../utils/types";

const fetchExchangeRates = async (base: string): Promise<Option[]> => {
  const res = await fetch(`https://api.frankfurter.app/latest?from=${base}`);
  const json = await res.json();
  return Object.entries(json.rates).map(([currency, rate]) => ({
    label: `${currency} - ${rate}`,
    value: currency,
  }));
};

export const useExchangeRates = (base: string) => {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["exchangeRates", base],
    queryFn: () => fetchExchangeRates(base),
    enabled: !!base,
    staleTime: 1000 * 60 * 60,
  });

  return { rates: data, isLoading, error };
};
