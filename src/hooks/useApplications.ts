import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../utils/constants";
import {privateApiClient} from "../client/axios.ts";
import {APIResponse} from "../utils/types";

// Types
export interface Application {
    id: number;
    name: string;
    email: string;
    phone?: string;
    position: string;
    status: "new" | "reviewing" | "interviewing" | "hired" | "rejected";
    matchScore: number;
    appliedDate: string;
    experience: string;
    location: string;
    avatar: string | null;
    skills: string[];
    linkedin?: string;
    portfolio?: string;
    resumeUrl?: string;
    summary?: string;
    education?: Array<{
        degree: string;
        institution: string;
        year: string;
    }>;
    workHistory?: Array<{
        title: string;
        company: string;
        duration: string;
        description: string;
    }>;
    certifications?: string[];
    languages?: string[];
    matchDetails?: {
        skillsMatch: number;
        experienceMatch: number;
        locationMatch: number;
        educationMatch: number;
        matchingSkills: string[];
        missingSkills: string[];
        strengths: string[];
        concerns: string[];
    };
}

export interface ApplicationFilters {
    searchQuery?: string;
    status?: string;
    position?: string;
}

export interface UpdateApplicationStatusParams {
    applicationId: number;
    status: "hired" | "rejected" | "reviewing" | "interviewing";
}

const applicationApi = {
    // Fetch all applications with optional filters
    getApplications: async (filters?: ApplicationFilters): Promise<Application[]> => {
        console.log("Fetching applications with filters:", filters);
        const params = new URLSearchParams();

        if (filters?.searchQuery) {
            params.append("searchQuery", filters.searchQuery);
        }
        if (filters?.status && filters.status !== "all") {
            params.append("status", filters.status);
        }
        if (filters?.position && filters.position !== "all") {
            params.append("position", filters.position);
        }

        if (params.toString()) {
            params.append("status", "all");
            params.append("sortBy", "createdAt");
            params.append("sortDirection", "DESC");
        } else {
            params.append("sortBy", "createdAt");
            params.append("sortDirection", "DESC");
        }
        console.log("Final query params for fetching applications:", params.toString());

        const response = await privateApiClient.post<APIResponse<any>>(`${API_BASE_URL}/applications/search`);
        if (response.status !== 201) {
            throw new Error("Failed to fetch applications");
        }

        return response?.data?.data;
    },

    // Fetch single application by ID
    getApplicationById: async (id: number): Promise<Application> => {
        const response = await privateApiClient.get<APIResponse<any>>(`${API_BASE_URL}/applications/${id}`);

        if (response.status !== 200) {
            throw new Error("Failed to fetch application");
        }

        return response?.data?.data;
    },

    // Update application status
    updateApplicationStatus: async ({
                                        applicationId,
                                        status,
                                    }: UpdateApplicationStatusParams): Promise<Application> => {
        const response = await privateApiClient.patch<APIResponse<any>>(`${API_BASE_URL}/applications/${applicationId}/status`, { status });

        if (response.status !== 200) {
            throw new Error("Failed to update application status");
        }

        return response.data.data;
    },

    // Download resume
    downloadResume: async (applicationId: number): Promise<Blob> => {
        const response = await privateApiClient.get<APIResponse<any>>(`${API_BASE_URL}/applications/${applicationId}/resume`);

        if (response.status !== 200) {
            throw new Error("Failed to download resume");
        }

        return response.data.data;
    },

    // Fetch match details
    getMatchDetails: async (applicationId: number): Promise<Application["matchDetails"]> => {
        const response = await privateApiClient.get<APIResponse<any>>(`${API_BASE_URL}/applications/${applicationId}/match-details`);

        if (response.status !== 200) {
            throw new Error("Failed to fetch match details");
        }

        return response.data.data;
    },
};

// React Query Hooks

/**
 * Hook to fetch all applications with filters
 */
export const useApplications = (filters?: ApplicationFilters) => {
    return useQuery({
        queryKey: ["applications", filters],
        queryFn: () => applicationApi.getApplications(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true,
    });
};

/**
 * Hook to fetch a single application by ID
 */
export const useApplication = (id: number | null) => {
    return useQuery({
        queryKey: ["application", id],
        queryFn: () => applicationApi.getApplicationById(id!),
        enabled: !!id, // Only fetch if ID is provided
        staleTime: 5 * 60 * 1000,
    });
};

/**
 * Hook to fetch match details for an application
 */
export const useMatchDetails = (applicationId: number | null) => {
    return useQuery({
        queryKey: ["matchDetails", applicationId],
        queryFn: () => applicationApi.getMatchDetails(applicationId!),
        enabled: !!applicationId,
        staleTime: 10 * 60 * 1000, // 10 minutes - match details don't change often
    });
};

/**
 * Hook to update application status (Accept/Reject)
 */
export const useUpdateApplicationStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: applicationApi.updateApplicationStatus,
        onMutate: async ({ applicationId, status }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["applications"] });
            await queryClient.cancelQueries({ queryKey: ["application", applicationId] });

            // Snapshot previous values
            const previousApplications = queryClient.getQueryData<Application[]>(["applications"]);
            const previousApplication = queryClient.getQueryData<Application>(["application", applicationId]);

            // Optimistically update
            if (previousApplications) {
                queryClient.setQueryData<Application[]>(["applications"], (old) =>
                    old?.map((app) =>
                        app.id === applicationId ? { ...app, status } : app
                    ) || []
                );
            }

            if (previousApplication) {
                queryClient.setQueryData<Application>(["application", applicationId], {
                    ...previousApplication,
                    status,
                });
            }

            return { previousApplications, previousApplication };
        },
        onError: (_err, _variables, context) => {
            // Rollback on error
            if (context?.previousApplications) {
                queryClient.setQueryData(["applications"], context.previousApplications);
            }
            if (context?.previousApplication) {
                queryClient.setQueryData(
                    ["application", _variables.applicationId],
                    context.previousApplication
                );
            }
        },
        onSettled: () => {
            // Refetch after mutation
            queryClient.invalidateQueries({queryKey: ["applications"]}).then(r =>r);
        },
    });
};

/**
 * Hook to download resume
 */
export const useDownloadResume = () => {
    return useMutation({
        mutationFn: async (applicationId: number) => {
            const blob = await applicationApi.downloadResume(applicationId);
            return { blob, applicationId };
        },
        onSuccess: ({ blob, applicationId }) => {
            // Get application data to generate filename
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `application_${applicationId}_resume.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    });
};

/**
 * Hook to prefetch application data (useful for hover states)
 */
export const usePrefetchApplication = () => {
    const queryClient = useQueryClient();

    return (id: number) => {
        queryClient.prefetchQuery({
            queryKey: ["application", id],
            queryFn: () => applicationApi.getApplicationById(id),
            staleTime: 5 * 60 * 1000,
        }).then(r => r);
    };
};

/**
 * Hook to get application statistics
 */
export const useApplicationStats = () => {
    const { data: applications } = useApplications();

    return {
        total: applications?.length || 0,
        new: applications?.filter((app) => app.status === "new").length || 0,
        reviewing: applications?.filter((app) => app.status === "reviewing").length || 0,
        interviewing: applications?.filter((app) => app.status === "interviewing").length || 0,
        hired: applications?.filter((app) => app.status === "hired").length || 0,
        rejected: applications?.filter((app) => app.status === "rejected").length || 0,
        averageMatchScore:
            (applications?.length ? applications as Application[] : [] as Application[])
                .reduce((acc, app) => acc + app.matchScore, 0) / (applications?.length || 1) || 0,
    };
};
