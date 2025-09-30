import { useQuery } from "@tanstack/react-query";
import { APIResponse, CategoryInfo } from "../utils/types";
import { fetchCategories } from "../services/api";
const useFetchCategories = ()=>{
  return useQuery<APIResponse<CategoryInfo[]>>({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
    staleTime: 5*1000*60,
    enabled: true
  })
}

export default useFetchCategories;
