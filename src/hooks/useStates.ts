import { useQuery } from "@tanstack/react-query";
import { Option } from "../utils/types";

const fetchStates = async (country: string): Promise<Option[]> => {
  const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country }),
  });
  const json = await res.json();
  return json.data.states.map((s: any) => ({ label: s.name, value: s.name }));
};

export const useStates = (country: string) => {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["states", country],
    queryFn: () => fetchStates(country),
    enabled: !!country,
    staleTime: 1000 * 60 * 60,
  });

  return { states: data, isLoading, error };
};
