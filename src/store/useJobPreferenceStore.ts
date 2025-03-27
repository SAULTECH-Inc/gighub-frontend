import {create} from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import {APIResponse, JobPreference, JobPreferenceResponse} from "../utils/types";
import {privateApiClient} from "../api/axios.ts";


interface JobPreferenceState {
    preferences: JobPreference | null;
    submitSuccess: boolean;
    error: string | null;
    fetchPreferences: (applicantId: number) => Promise<boolean>;
    setPreference: (preference: JobPreference) => void;
    addPreference: (preference: JobPreference) => Promise<boolean>;
}

export const useJobPreferenceStore = create<JobPreferenceState>()(
    devtools(
        persist(
            (set) => ({
                preferences: null,
                submitSuccess: false,
                error: null,
                setPreference: (preference: JobPreference) =>
                    set(() => ({
                        preferences: preference,
                        submitSuccess: false,
                        error: null,
                    })),
                fetchPreferences: async (applicantId: number) => {
                    try {
                        const response = await privateApiClient.get<APIResponse<JobPreferenceResponse>>(
                            `/jobs/get-preference/${applicantId}`
                        );
                        set(() => ({
                            preferences: response.data?.data,
                            submitSuccess: false,
                            error: null,
                        }));
                        return true;
                    } catch (error: any) {
                        console.error('Failed to fetch job preferences:', error);
                        set(() => ({
                            error: error.response?.data?.message || "Unknown error occurred",
                        }));
                    }
                    return false; // Returning false to indicate that the effect is async
                },

                addPreference: async (preference: JobPreference) => {
                    try {
                        const response = await privateApiClient.post<APIResponse<JobPreferenceResponse>>(
                            `/jobs/add-preference`,
                            preference
                        );
                        set(() => ({
                            preferences: {...preference,...response.data?.data},
                            submitSuccess: true,
                            error: null,
                        }));
                        return true;
                    } catch (error: any) {
                        console.error('Failed to add job preference:', error);
                        set(() => ({
                            error: error.response?.data?.message || "Unknown error occurred",
                        }));
                    }
                    return false;
                },
            }),
            {
                name: 'job-preference-store',
                partialize: (state) => ({
                    preferences: state.preferences,
                    submitSuccess: false,
                    error: null,
                }),
            }
        ),
        { name: 'JobPreferenceStore' }
    )
);
