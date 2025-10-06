import {
  APIResponse,
  ApplicantData,
  ApplicationMetrics,
  ApplicationRequest,
  ApplicationResponse,
  BulkSearchParams,
  CategoryInfo, ChangePasswordRequest,
  EmployerData,
  FeatureJob,
  FetchMyJobParam,
  FileUploadResponse, GenerateQrcodeResponse,
  InterviewScheduleDetails,
  InterviewScheduleDetailsResponse,
  JobPostResponse,
  JobStatus,
  NetworkDetails, ProfileCompletionResponse,
  RatingResponseDTO, ScreeningQuestion,
  SortBy,
  SubscriptionResponse,
  SubscriptionType,
  TopHiringCompanyDto, TwoFactorEnabledResponse
} from "../../utils/types";
import { privateApiClient, publicApiClient } from "../../client/axios.ts";
import {
  API_BASE_URL,
  CHAT_API_BASE_URL,
  NOTIFICATION_API_URL,
  SUBSCRIPTION_SERVICE_HOST,
  VITE_API_FILE_SERVICE,
} from "../../utils/constants.ts";
import { Action, UserType } from "../../utils/enums.ts";
import { PaginationParams } from "../../pages/company list/CompanyList.tsx";
import { JobRatingRequest } from "../../components/features/JobDetails.tsx";
import { JobMatchResult } from "../../components/ui/MatchDetailsModal.tsx";

export async function fetchPrivateMessages(user: string, otherUser: string) {
  try {
    const response = await fetch(
      `${CHAT_API_BASE_URL}/messages/private?user=${encodeURIComponent(user)}&otherUser=${encodeURIComponent(otherUser)}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching private messages:", error);
    return [];
  }
}

export async function fetchGroupMessages(groupId: string) {
  try {
    const response = await fetch(
      `${CHAT_API_BASE_URL}/messages/group?groupId=${encodeURIComponent(groupId)}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch group messages: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching group messages:", error);
    return [];
  }
}

export const fetchUsers = async (
  userId: number,
  page: number,
  limit: number,
): Promise<APIResponse<NetworkDetails[]>> => {
  console.log(`Fetching All users for page ${page} with limit ${limit}`);
  const response = await privateApiClient.post<APIResponse<NetworkDetails[]>>(
    `${API_BASE_URL}/users/connections/all`,
    {
      userId: userId,
      page: page,
      limit: limit,
    },
  );
  console.log("Number of users fetched:", response?.data?.data?.length);
  return response?.data;
};

export const fetchConnectionRequests = async (
  page: number,
  limit: number,
): Promise<APIResponse<NetworkDetails[]>> => {
  console.log(
    `Fetching connection requests for page ${page} with limit ${limit}`,
  );

  const response = await privateApiClient.post<APIResponse<NetworkDetails[]>>(
    `${API_BASE_URL}/users/connections/requests`,
    {
      page: page,
      limit: limit,
    },
  );

  return response?.data;
};

export const searchUsers = async (
  page: number,
  limit: number,
  filters: {
    name?: string;
    profession?: string;
    location?: string;
  },
): Promise<APIResponse<NetworkDetails[]>> => {
  console.log(`Searching users with filters: ${JSON.stringify(filters)}`);
  const response = await privateApiClient.post<APIResponse<NetworkDetails[]>>(
    `${API_BASE_URL}/users/connections/search`,
    {
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.name && { name: filters.name }),
      ...(filters.profession && { profession: filters.profession }),
      ...(filters.location && { location: filters.location }),
    },
  );
  return response.data;
};

export const connectUser = async (
  userId: string,
): Promise<APIResponse<any>> => {
  console.log(`Connecting to user with ID: ${userId}`);
  const response = await privateApiClient.get<APIResponse<any>>(
    `${API_BASE_URL}/users/connections/${userId}`, // 👈 route param, not query param
  );
  return response.data;
};
export const acceptConnectionRequest = async (
  userId: number,
): Promise<APIResponse<any>> => {
  console.log(`Accepting connection request from user with ID: ${userId}`);
  const response = await privateApiClient.get<APIResponse<any>>(
    `${API_BASE_URL}/users/connections/accept/${userId}`, // 👈 route param, not query param
  );
  return response.data;
};
export const rejectConnectionRequest = async (
  userId: number,
): Promise<APIResponse<any>> => {
  console.log(`Rejecting connection request from user with ID: ${userId}`);
  const response = await privateApiClient.get<APIResponse<any>>(
    `${API_BASE_URL}/users/connections/reject/${userId}`, // 👈 route param, not query param
  );
  return response.data;
};
export const removeConnection = async (
  userId: string,
): Promise<APIResponse<any>> => {
  console.log(`Removing connection with user ID: ${userId}`);
  const response = await privateApiClient.get<APIResponse<any>>(
    `${API_BASE_URL}/users/connections/remove/${userId}`, // 👈 route param, not query param
  );
  return response.data;
};
export const fetchUserDetails = async (
  userId: string,
): Promise<APIResponse<ApplicantData>> => {
  console.log(`Fetching details for user with ID: ${userId}`);
  const response = await privateApiClient.get<APIResponse<ApplicantData>>(
    `${API_BASE_URL}/users/${userId}`,
  );
  return response.data;
};

export const fetchMyConnections = async (
  userId: number,
  page: number,
  limit: number,
): Promise<APIResponse<NetworkDetails[]>> => {
  console.log(`Fetching my connections for page ${page} with limit ${limit}`);
  const response = await privateApiClient.post<APIResponse<NetworkDetails[]>>(
    `${API_BASE_URL}/users/connections`,
    {
      userId: userId,
      page: page,
      limit: limit,
    },
  );
  return response?.data;
};

export const searchMyConnection = async (searchParams: {
  name?: string;
  location?: string;
  profession?: string;
}): Promise<APIResponse<NetworkDetails[]>> => {
  console.log(
    `Searching my connections with filters: ${JSON.stringify(searchParams)}`,
  );
  const response = await privateApiClient.post<APIResponse<NetworkDetails[]>>(
    `${API_BASE_URL}/users/connections/search`,
    {
      ...searchParams,
    },
  );
  return response.data;
};

export const markMessageAsRead = async (
  messageId: string,
  email: string,
): Promise<APIResponse<any>> => {
  console.log(`Marking message with ID: ${messageId} as read`);
  const response = await privateApiClient.get<APIResponse<any>>(
    `${CHAT_API_BASE_URL}/messages/mark-as-read`,
    {
      params: {
        messageId: messageId,
        userId: email,
      },
    },
  );
  return response.data;
};

export const fetchMyJobPosts = async (
  fetchParams: FetchMyJobParam,
): Promise<APIResponse<JobPostResponse[]>> => {
  console.log(`Fetching My Job Posts`);
  const response = await privateApiClient.post<APIResponse<JobPostResponse[]>>(
    `${API_BASE_URL}/jobs/my-job-posts`,
    fetchParams,
  );
  return response?.data;
};

export const searchMyJobs = async (
  searchParams: FetchMyJobParam,
): Promise<APIResponse<JobPostResponse[]>> => {
  console.log(
    `Searching my jobs with filters: ${JSON.stringify(searchParams)}`,
  );
  const response = await privateApiClient.post<APIResponse<JobPostResponse[]>>(
    `${API_BASE_URL}/jobs/search-my-jobs`,
    {
      ...searchParams,
    },
  );
  return response.data;
};

export const fetchJobs = async (
  page: number,
  limit: number,
): Promise<APIResponse<JobPostResponse[]>> => {
  console.log(`Fetching All jobs for page ${page} with limit ${limit}`);
  const response = await privateApiClient.get<APIResponse<JobPostResponse[]>>(
    `${API_BASE_URL}/jobs/all/${page}/${limit}`,
  );
  console.log("Number of jobs fetched:", response?.data?.data?.length);
  return response?.data;
};

export const searchJobs = async (
  searchParams: FetchMyJobParam,
): Promise<APIResponse<JobPostResponse[]>> => {
  console.log(`Searching jobs with filters: ${JSON.stringify(searchParams)}`);
  const response = await privateApiClient.post<APIResponse<JobPostResponse[]>>(
    `${API_BASE_URL}/jobs/search-jobs`,
    searchParams,
  );
  return response?.data;
};

export const bulkSearchJobs = async (
  searchParams: BulkSearchParams,
): Promise<APIResponse<JobPostResponse[]>> => {
  console.log(`Running bulk search: ${JSON.stringify(searchParams)}`);
  const response = await privateApiClient.post<APIResponse<JobPostResponse[]>>(
    `${API_BASE_URL}/jobs/bulk-search-jobs`,
    searchParams,
  );
  return response?.data;
};

export const fetchJobById = async (id: number) => {
  console.log(`fetching job by id: id}`);
  const response = await privateApiClient.get<APIResponse<JobPostResponse>>(
    `${API_BASE_URL}/jobs/${id}`,
  );
  return response?.data;
};

export const applyForJob = async (applicationRequest: ApplicationRequest) => {
  console.log(
    `Applying for a job with ::: ${JSON.stringify(applicationRequest)}`,
  );
  const response = await privateApiClient.post<
    APIResponse<ApplicationResponse>
  >(`${API_BASE_URL}/applications`, applicationRequest);
  return response?.data;
};

export const getMyApplications = async (
  applicationStatus: string | null,
  sort: SortBy,
  page: number,
  limit: number,
  jobTitle?: string,
  companyName?: string,
): Promise<APIResponse<ApplicationResponse[]>> => {
  console.log(`Fetching my applications for page ${page} with limit ${limit}`);
  const response = await privateApiClient.post<
    APIResponse<ApplicationResponse[]>
  >(`${API_BASE_URL}/applications/my-applications`, {
    status: applicationStatus,
    sort: sort,
    page: page,
    limit: limit,
    jobTitle: jobTitle,
    companyName: companyName,
  });
  return response?.data;
};

export const getRecentApplications = async (
  applicationStatus: string | null,
  sort: SortBy,
  page: number,
  limit: number,
  jobTitle?: string,
  companyName?: string,
): Promise<APIResponse<ApplicationResponse[]>> => {
  console.log(`Fetching my applications for page ${page} with limit ${limit}`);
  const response = await privateApiClient.post<
    APIResponse<ApplicationResponse[]>
  >(`${API_BASE_URL}/applications/recent-applications`, {
    status: applicationStatus,
    sort: sort,
    page: page,
    limit: limit,
    jobTitle: jobTitle,
    companyName: companyName,
  });
  return response?.data;
};

export const fetchMyJobsApplications = async (
  status: string,
  page: number,
  limit: number,
) => {
  console.log(`Fetching applications for page ${page} with limit ${limit}`);
  const response = await privateApiClient.post<
    APIResponse<ApplicationResponse[]>
  >(`${API_BASE_URL}/jobs/applicants`, {
    status: status,
    page: page,
    limit: limit,
  });
  return response?.data;
};

export const setViewedApplication = async (applicationId: number) => {
  console.log(`Setting application as viewed with ID: ${applicationId}`);
  const response = await privateApiClient.patch<
    APIResponse<ApplicationResponse>
  >(`${API_BASE_URL}/applications/viewed/${applicationId}`);
  return response?.data;
};

export const fetchCandidates = async (
  searchQuery: string,
  page: number,
  limit: number,
) => {
  console.log(`Fetching candidates for page ${page} with limit ${limit}`);
  const response = await privateApiClient.post<APIResponse<ApplicantData[]>>(
    `${API_BASE_URL}/applications/search`,
    {
      searchQuery: searchQuery,
      page: page,
      limit: limit,
    },
  );
  return response?.data;
};

export const removeUploadedFile = async (
  userId: number,
  fileUrl: string,
  action: Action,
  userType: UserType,
  whatIsTheItem: string,
): Promise<APIResponse<FileUploadResponse>> => {
  console.log(`Removing uploaded file with ID: ${fileUrl}`);
  const response = await privateApiClient.post<APIResponse<FileUploadResponse>>(
    `${VITE_API_FILE_SERVICE}/gighub/files/delete-a-file`,
    {
      userId: userId,
      fileUrl: fileUrl,
      action: action,
      userType: userType,
      whatIsTheItem: whatIsTheItem,
    },
  );
  return response?.data;
};

export const uploadFile = async (
  userId: number,
  file: File,
  action: Action,
  userType: UserType,
  whatIsTheItem: string,
): Promise<APIResponse<FileUploadResponse>> => {
  console.log(`Uploading file for user with ID: ${userId}`);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId.toString());
  formData.append("action", action);
  formData.append("userType", userType);
  formData.append("whatIsTheItem", whatIsTheItem);

  const response = await privateApiClient.post<APIResponse<FileUploadResponse>>(
    `${VITE_API_FILE_SERVICE}/gighub/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response?.data;
};

export const uploadFileGeneral = async (
  userId: number,
  file: File,
  action: Action,
  userType: UserType,
  whatIsTheItem: string,
): Promise<APIResponse<FileUploadResponse>> => {
  console.log(`Uploading file for user with ID: ${userId}`);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId.toString());
  formData.append("action", action);
  formData.append("userType", userType);
  formData.append("whatIsTheItem", whatIsTheItem);

  const response = await privateApiClient.post<APIResponse<FileUploadResponse>>(
    `${VITE_API_FILE_SERVICE}/gighub/upload/general`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response?.data;
};

export const saveInterviewDetails = async (
  interviewDetails: InterviewScheduleDetails,
): Promise<APIResponse<InterviewScheduleDetailsResponse>> => {
  console.log(`Saving interview details: ${JSON.stringify(interviewDetails)}`);
  const response = await privateApiClient.post<APIResponse<any>>(
    `${API_BASE_URL}/interviews/save-interview-details`,
    interviewDetails,
  );
  return response?.data;
};

export const searchForMyJobPosts = async (
  jobSearchQuery: string,
  page: number,
  limit: number,
): Promise<APIResponse<JobPostResponse[]>> => {
  console.log(`Searching for jobs with query: ${jobSearchQuery}`);
  const response = await privateApiClient.post<APIResponse<JobPostResponse[]>>(
    `${API_BASE_URL}/jobs/mine/search-job-posts`,
    {
      searchQuery: jobSearchQuery,
      page: page,
      limit: limit,
    },
  );
  return response?.data;
};

export const getInterviewDetails = async (
  interviewId: number,
): Promise<APIResponse<InterviewScheduleDetailsResponse>> => {
  console.log(`Fetching interview details with ID: ${interviewId}`);
  const response = await privateApiClient.get<
    APIResponse<InterviewScheduleDetailsResponse>
  >(`${API_BASE_URL}/interviews/${interviewId}`);
  return response?.data;
};

export const fetchMyInterviews = async (
  page: number,
  limit: number,
): Promise<APIResponse<InterviewScheduleDetailsResponse[]>> => {
  console.log(`Fetching my interviews for page ${page} with limit ${limit}`);
  const response = await privateApiClient.get<
    APIResponse<InterviewScheduleDetailsResponse[]>
  >(`${API_BASE_URL}/interviews/my-interviews/${page}/${limit}`);
  return response?.data;
};

export const withdrawApplication = async (
  jobId: number,
): Promise<APIResponse<ApplicationResponse>> => {
  console.log(`Withdrawing application with ID: ${jobId}`);
  const response = await privateApiClient.patch<
    APIResponse<ApplicationResponse>
  >(`${API_BASE_URL}/applications/withdraw/jobs/${jobId}`);
  return response?.data;
};

export const reApply = async (
  jobId: number,
): Promise<APIResponse<ApplicationResponse>> => {
  console.log(`Re-applying for job with ID: ${jobId}`);
  const response = await privateApiClient.patch<
    APIResponse<ApplicationResponse>
  >(`${API_BASE_URL}/applications/reapply/jobs/${jobId}`);
  return response?.data;
};

//':interviewId/applicants/:applicantId/reject'
export const rejectInterview = async (
  interviewId: number,
  applicantId: number,
): Promise<APIResponse<any>> => {
  console.log(
    `Rejecting interview with ID: ${interviewId} for applicant ID: ${applicantId}`,
  );
  const response = await privateApiClient.patch<APIResponse<any>>(
    `${API_BASE_URL}/applications/${interviewId}/applicants/${applicantId}/reject`,
  );
  return response?.data;
};
export const cancelInterview = async (
  interviewId: number,
): Promise<APIResponse<any>> => {
  console.log(`Canceling interview with ID: ${interviewId}`);
  const response = await privateApiClient.patch<APIResponse<any>>(
    `${API_BASE_URL}/interviews/${interviewId}/cancel`,
  );
  return response?.data;
};

export const rescheduleInterview = async (
  interviewId: number,
): Promise<APIResponse<any>> => {
  console.log(`Rescheduling interview with ID: ${interviewId}`);
  const response = await privateApiClient.patch<APIResponse<any>>(
    `${API_BASE_URL}/interviews/${interviewId}/reschedule`,
  );
  return response?.data;
};

export const fetchMetrics = async (): Promise<APIResponse<any>> => {
  console.log(`Fetching application metrics`);
  const response = await privateApiClient.post<APIResponse<ApplicationMetrics>>(
    `${API_BASE_URL}/applications/metrics`,
  );
  return response?.data;
};

export const fetchMyInterviewsWithPagination = async (req: {
  page: number;
  limit: number;
  sortBy: string;
  sortDirection: string;
}) => {
  console.log(`Fetching my interviews`);
  const response = await privateApiClient.post<
    APIResponse<InterviewScheduleDetailsResponse[]>
  >(`${API_BASE_URL}/interviews/my-interviews`, req);
  return response?.data;
};

export const fetchEmployerDetailsById = async (employerId: number) => {
  const response = await privateApiClient.get<APIResponse<EmployerData>>(
    `${API_BASE_URL}/users/${employerId}`,
  );
  return response?.data;
};

export const getJobsPostedCount = async (): Promise<APIResponse<number>> => {
  console.log(`Fetching count of jobs posted`);
  const response = await privateApiClient.get<APIResponse<number>>(
    `${API_BASE_URL}/jobs/count`,
  );
  return response?.data;
};

export const getTopHiringCompanies = async (): Promise<
  APIResponse<TopHiringCompanyDto[]>
> => {
  console.log(`Fetching top hiring companies`);
  const response = await privateApiClient.get<
    APIResponse<TopHiringCompanyDto[]>
  >(`${API_BASE_URL}/jobs/companies/top-hiring-companies`);
  return response?.data;
};

export const fetchCompanies = async (
  pagination: PaginationParams,
): Promise<APIResponse<EmployerData[]>> => {
  console.log(`Fetching companies`);
  const response = await privateApiClient.post<APIResponse<EmployerData[]>>(
    `${API_BASE_URL}/jobs/companies`,
    pagination,
  );
  return response?.data;
};

export const rateJob = async (req: JobRatingRequest) => {
  console.log(`Rating a job`);
  const response = await privateApiClient.post<APIResponse<RatingResponseDTO>>(
    `${API_BASE_URL}/feedbacks/rating`,
    req,
  );
  return response?.data;
};

export const getMostUsedKeywords = async (limit: number) => {
  const response = await privateApiClient.get<APIResponse<string[]>>(
    `${API_BASE_URL}/jobs/keywords/most-searched/${limit}`,
  );
  return response?.data;
};

export const fetchOtherJobPost = async (
  jobId: number,
  page: number,
  limit: number,
) => {
  const response = await privateApiClient.get<APIResponse<JobPostResponse[]>>(
    `${API_BASE_URL}/jobs/company/other-jobs/${jobId}/${page}/${limit}`,
  );
  return response?.data;
};

export const referJobToSomeone = async (
  jobId: number,
  applicantEmails: string[],
) => {
  const response = await privateApiClient.post<APIResponse<any[]>>(
    `${API_BASE_URL}/referrals`,
    {
      jobId: jobId,
      applicantEmails: applicantEmails,
    },
  );
  return response?.data;
};

export const fetchShortlistedJobs = async (pagination: {
  page: number;
  limit: number;
}) => {
  const response = await privateApiClient.get<APIResponse<JobPostResponse[]>>(
    `${API_BASE_URL}/applications/shortlisted/${pagination.page}/${pagination.limit}`,
  );
  return response?.data;
};

export const fetchJobsByEmployer = async (
  employerId: number,
  page: number,
  limit: number,
) => {
  const response = await privateApiClient.get<APIResponse<JobPostResponse[]>>(
    `${API_BASE_URL}/jobs/employers/${employerId}/${page}/${limit}`,
  );
  return response?.data;
};

export const deleteNotification = async (
  notificationId: string | number | undefined,
  userId: number,
): Promise<APIResponse<any>> => {
  console.log(`Deleting notification with ID: ${notificationId}`);
  const response = await privateApiClient.delete<APIResponse<any>>(
    `${NOTIFICATION_API_URL}/notifications/delete-notification/${userId}/${notificationId}`,
  );
  return response?.data;
};

export const markAsViewed = async (
  notificationId: string | number | undefined,
): Promise<APIResponse<any>> => {
  console.log(`Marking notification as viewed with ID: ${notificationId}`);
  const response = await privateApiClient.patch<APIResponse<any>>(
    `${NOTIFICATION_API_URL}/notifications/mark-notification-as-viewed/${notificationId}`,
  );
  return response?.data;
};

export const markAllNotificationsAsRead = async (
  notificationIds: string[],
  userId: number,
): Promise<APIResponse<any>> => {
  console.log(`Marking all notifications as read: ${notificationIds}`);
  const response = await privateApiClient.patch<APIResponse<any>>(
    `${NOTIFICATION_API_URL}/notifications/mark-all-notifications-as-viewed/${userId}`,
    { notificationIds },
  );
  return response?.data;
};

export const deleteMessage = async (
  messageId: string,
): Promise<APIResponse<string>> => {
  console.log(`Marking all notifications as read: ${messageId}`);
  const response = await privateApiClient.delete<APIResponse<any>>(
    `${NOTIFICATION_API_URL}/notifications/${messageId}/delete`,
  );
  return response?.data;
};

export const fetchJobApplicants = async (
  jobId: number,
  page: number,
  limit: number,
) => {
  const response = await privateApiClient.get<APIResponse<ApplicantData[]>>(
    `${API_BASE_URL}/jobs/${jobId}/applicants?page=${page}&limit=${limit}`,
  );
  return response?.data;
};

export const fetchJobApplications = async (
  jobId: number,
  page: number,
  limit: number,
  params: {
    search: string;
    status: string;
    sortBy: string;
    sortOrder: string;
  },
) => {
  const response = await privateApiClient.post<
    APIResponse<ApplicationResponse[]>
  >(
    `${API_BASE_URL}/jobs/${jobId}/applications?page=${page}&limit=${limit}`,
    params,
  );
  return response?.data;
};

export const updateApplicationStatus = async (
  applicationId: number,
  status: string,
) => {
  const response = await privateApiClient.patch<
    APIResponse<ApplicationResponse>
  >(`${API_BASE_URL}/applications/${applicationId}/status?status=${status}`);
  return response?.data;
};

export const updateJobStatus = async (
  jobId: number,
  updatedRequest: { status: JobStatus; reason?: string },
) => {
  const response = await privateApiClient.patch<APIResponse<JobPostResponse>>(
    `${API_BASE_URL}/jobs/${jobId}/status`,
    updatedRequest,
  );
  return response?.data;
};

export const updateJob = async (
  jobId: number,
  updatedRequest: Partial<JobPostResponse>,
) => {
  const response = await privateApiClient.put<APIResponse<JobPostResponse>>(
    `${API_BASE_URL}/jobs/${jobId}`,
    updatedRequest,
  );
  return response?.data;
};

export const bookmarkJob = async (jobId: number): Promise<APIResponse<any>> => {
  console.log(`Bookmarking job with ID: ${jobId}`);
  const response = await privateApiClient.post<APIResponse<any>>(
    `${API_BASE_URL}/bookmarks`,
    { jobId },
  );
  return response?.data;
};

export const removeJobBookmark = async (
  jobId: number,
): Promise<APIResponse<any>> => {
  console.log(`Removing bookmark with Job ID: ${jobId}`);
  const response = await privateApiClient.delete<APIResponse<any>>(
    `${API_BASE_URL}/bookmarks/${jobId}`,
  );
  return response?.data;
};

export const followCompany = async (companyId: number) => {
  console.log(`Following company for Job ID: ${companyId}`);
  const response = await privateApiClient.get<APIResponse<any>>(
    `${API_BASE_URL}/users/followers/${companyId}/follow`,
  );
  return response?.data;
};

export const unfollowCompany = async (companyId: number) => {
  console.log(`Following company for Job ID: ${companyId}`);
  const response = await privateApiClient.get<APIResponse<any>>(
    `${API_BASE_URL}/users/followers/${companyId}/unfollow`,
  );
  return response?.data;
};

export const fetchJobDetailsRelativeToMe = async (jobId: number) => {
  console.log(`Fetching job details relative to me for Job ID: ${jobId}`);
  const response = await privateApiClient.get<APIResponse<JobPostResponse>>(
    `${API_BASE_URL}/jobs/${jobId}/details/relative-to-me`,
  );
  return response?.data;
};

export const fetchTopRecommendedJob = async () => {
  console.log(`Fetching top recommended jobs`);
  const response = await privateApiClient.get<APIResponse<JobPostResponse>>(
    `${API_BASE_URL}/jobs/recommended-job/top`,
  );
  return response?.data;
};

export const getJobsCount = async () => {
  const response = await publicApiClient.get<APIResponse<number>>(
    `${API_BASE_URL}/jobs/all/count`,
  );
  return response.data;
};

export const getUserCount = async () => {
  const response = await publicApiClient.get<APIResponse<number>>(
    `${API_BASE_URL}/users/all/count`,
  );
  return response?.data;
};

export const getAllActiveCompanies = async () => {
  const response = await publicApiClient.get<APIResponse<number>>(
    `${API_BASE_URL}/users/companies/active/count`,
  );
  return response.data;
};

export const getAllCategories = async () => {
  const response = await publicApiClient.get<APIResponse<number>>(
    `${API_BASE_URL}/jobs/categories/all`,
  );
  return response.data;
};

export const fetchFeaturedJobs = async (limit: number) => {
  console.log("Fetching featured jobs");
  const response = await publicApiClient.get<APIResponse<FeatureJob[]>>(
    `${API_BASE_URL}/jobs/featured-jobs/all?limit=${limit}`,
  );
  return response.data;
};

export const fetchCategories = async () => {
  console.log("Fetching categories");
  const response = await publicApiClient.get<APIResponse<CategoryInfo[]>>(
    `${API_BASE_URL}/jobs/categories/all`,
  );
  return response.data;
};

export const getSubscriptionPlans = async (
  subscriptionType: SubscriptionType,
): Promise<APIResponse<SubscriptionResponse[]>> => {
  const response = await privateApiClient.get<
    APIResponse<SubscriptionResponse[]>
  >(
    `${SUBSCRIPTION_SERVICE_HOST}/subscriptions/by-type?type=${subscriptionType}`,
  );
  return response.data;
};

export const fetchFlutterwaveEncryptionKey = async () => {
  const response = await privateApiClient.get<APIResponse<string>>(
    `${SUBSCRIPTION_SERVICE_HOST}/crypto/flutterwave/encryption-key`,
  );
  return response.data;
};

export const makePaymentForSub = async (payload: any) => {
  const response = await privateApiClient.post<APIResponse<any>>(
    `${SUBSCRIPTION_SERVICE_HOST}/subscriptions/payments/pay`,
    payload,
  );
  return response.data;
};

export const fetchJobMatchResult = async (
  applicantId: number,
  jobId: number,
) => {
  const response = await publicApiClient.get<APIResponse<JobMatchResult>>(
    `${API_BASE_URL}/jobs/job-match/applicant?applicantId=${applicantId}&jobId=${jobId}`,
  );
  return response.data;
};


export const generate2faQrCodeAndSecret = async(email: string)=>{
  const response = await publicApiClient.post<APIResponse<GenerateQrcodeResponse>>(
    `${API_BASE_URL}/auth/generate?email=${email}`,
  );
  return response.data;
}

export const enableTwoFactor = async(secret: string, token: string)=>{
  const response = await privateApiClient.post<APIResponse<TwoFactorEnabledResponse>>(
    `${API_BASE_URL}/auth/enable`,{token: token, secret: secret}
  );
  return response.data;
}

export const disableTwoFactor = async(token: string)=>{
  const response = await privateApiClient.post<APIResponse<void>>(
    `${API_BASE_URL}/auth/disable`,{token: token}
  );
  return response.data;
}
//regenerateBackupCodes
export const regenerateBackupCodes = async(token: string)=>{
  const response = await privateApiClient.post<APIResponse<TwoFactorEnabledResponse>>(
    `${API_BASE_URL}/auth/regenerate-backup-codes`,{token: token}
  );
  return response.data;
}


export const changePassword = async(req: ChangePasswordRequest)=>{
  const response = await privateApiClient.put<APIResponse<TwoFactorEnabledResponse>>(
    `${API_BASE_URL}/auth/change-password`,{
      currentPassword: req.oldPassword,
      newPassword: req.newPassword,
      confirmNewPassword: req.confirmPassword
    }
  );
  return response.data;
}


export const deleteAccount = async()=>{
  const response = await publicApiClient.delete<APIResponse<any>>(
    `${API_BASE_URL}/auth/account/delete`
  );
  return response.data;
}

export const getUserDeviceLocations = async ()=>{
  const response = await privateApiClient.get<APIResponse<any>>(
    `${API_BASE_URL}/access-meta/device-locations`
  );
  return response.data;
}

export const getProfileCompletionDetails = async()=>{
  const response = await privateApiClient.get<APIResponse<ProfileCompletionResponse>>(
    `${API_BASE_URL}/users/profile/completion-details`
  );
  return response.data;
}


export const fetchScreeningQuestions = async(jobId: number)=>{
  const response = await privateApiClient.get<APIResponse<ScreeningQuestion[]>>(
    `${API_BASE_URL}/jobs/${jobId}/screening-questions`
  );
  return response.data;
}
