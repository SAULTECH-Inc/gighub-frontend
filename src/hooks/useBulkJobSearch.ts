import { useQuery } from '@tanstack/react-query';
import { BulkSearchParams } from "../utils/types";
import { bulkSearchJobs } from "../services/api";


export const useBulkJobSearch = (param: BulkSearchParams, enabled = true) => {
  // console.log("SEARCH PARAMS ::: "+JSON.stringify(param));
  // console.log("ENABLED ::: ",enabled);
  return useQuery({
    queryKey: [
      'bulkJobSearch',
      {
        page: param.page,
        limit: param.limit,
        jobType: param.jobType,
        location: param.location,
        sortBy: param.sortBy,
        sortOrder: param.sortOrder,
        salaryRange: {
          currency: param.salaryRange.currency,
          frequency: param.salaryRange.frequency,
          min: param.salaryRange.min,
          max: param.salaryRange.max,
        },
      },
    ],
    queryFn: async () => bulkSearchJobs(param),
    enabled: enabled ,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
