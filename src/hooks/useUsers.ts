import {useQuery} from '@tanstack/react-query';
import {APIResponse, ApplicantData} from "../utils/types";
import {fetchUsers} from "../services/api"; // adjust path

export const useUsers = (page: number, limit: number) => {
    return useQuery<APIResponse<ApplicantData[]>>({
        queryKey: ['users', page, limit],
        queryFn: () => fetchUsers(page, limit),
        staleTime: 1000 * 60 * 5,
    });
};
