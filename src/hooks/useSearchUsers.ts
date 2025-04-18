import {useQuery} from "@tanstack/react-query";
import {APIResponse, ApplicantData} from "../utils/types";
import {searchUsers} from "../services/api";

export const useSearchUsers = (
    page: number,
    limit: number,
    searchFilters: {
        name?: string;
        profession?: string;
        location?: string;
    }
) => {
    return useQuery<APIResponse<ApplicantData[]>>({
        queryKey: ['users', page, limit, searchFilters],
        queryFn: () => searchUsers(page, limit, searchFilters),
        staleTime: 1000 * 60 * 5,
    });
};
