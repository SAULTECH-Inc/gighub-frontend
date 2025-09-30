import { fetchJobApplications, fetchJobs, fetchMyJobPosts, searchMyJobs } from "../services/api";
import { APIResponse, ApplicationResponse, FetchMyJobParam, JobPostResponse } from "../utils/types";
import { useQuery } from "@tanstack/react-query";

export const useFetchMyJobs = (fetchParams: FetchMyJobParam) => {
  return useQuery<APIResponse<JobPostResponse[]>>({
    queryKey: ["myJobs"],
    queryFn: () => fetchMyJobPosts(fetchParams),
  });
};

export const useSearchJobs = (searchParams: FetchMyJobParam) => {
  return useQuery<APIResponse<JobPostResponse[]>>({
    queryKey: [
      "searchJobs",
      searchParams.page,
      searchParams.limit,
      searchParams.search,
    ],
    queryFn: () => searchMyJobs(searchParams),
  });
};

export const useFetchJobs = (page: number, limit: number) => {
  return useQuery<APIResponse<JobPostResponse[]>>({
    queryKey: ["Jobs", page, limit],
    queryFn: () => fetchJobs(page, limit),
  });
};
export const useFetchJobApplications = (jobId: number, page: number, limit: number, params:     {
  search: string,
  status: string,
  sortBy: string,
  sortOrder: string
}, shouldFetchApplications: boolean) => {
  return useQuery<APIResponse<ApplicationResponse[]>>({
    queryKey: ["jobApplications", jobId, page, limit],
    queryFn: () => fetchJobApplications(jobId, page, limit, params),
    staleTime: 5 * 1000,
    enabled: shouldFetchApplications
  });
}
