import {APIResponse, ApplicantData} from "../utils/types";
import {useQuery} from "@tanstack/react-query";
import {fetchConnectionRequests} from "../services/api";

export const useConnectionRequest = (page: number, limit: number) => {
    return useQuery<APIResponse<ApplicantData[]>>({
        queryKey: ['connectionRequests', page, limit],
        queryFn: () => fetchConnectionRequests(page, limit),
        staleTime: 1000 * 60 * 5,
    });
}
