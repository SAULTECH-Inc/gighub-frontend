import { useQuery } from "@tanstack/react-query";
import { Option } from "../utils/types";

const fetchLanguages = async (): Promise<Option[]> => {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const countries = await res.json();
  const languageSet = new Set<string>();
  countries.forEach((country: any) => {
    if (country.languages) {
      Object.values(country.languages).forEach((lang: any) =>
        languageSet.add(lang),
      );
    }
  });
  return Array.from(languageSet).map((lang) => ({
    label: lang,
    value: lang.toLowerCase(),
  }));
};

export const useLanguages = () => {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
    staleTime: 1000 * 60 * 60,
  });

  return { languages: data, isLoading, error };
};
