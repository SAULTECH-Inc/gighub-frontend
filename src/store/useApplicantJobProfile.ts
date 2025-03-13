import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {
    APIResponse, CertificationResponseDto,
    CvResponseDto,
    EducationResponseDto,
    ExperienceRequestDto,
    ExperienceResponseDto, FileUploadRequest, FileUploadResponse,
    JobApplicationDetails,
    JobPreference,
    JobPreferenceResponse, SkillsResponseDto, SocialsResponseDto
} from '../utils/types';
import {privateApiClient} from '../api/axios';
import {toast} from 'react-toastify';
import {API_BASE_URL, NODE_ENV, secureStorageWrapper, VITE_API_FILE_SERVICE} from "../utils/constants.ts";
export interface SkillsAndCompetency{
    skills: SkillsResponseDto[];
    certifications: CertificationResponseDto[];
}

interface ApplicantJobProfile {
    preferences: JobPreference | null;
    cvDetails: Partial<CvResponseDto> | null;
    updatedCvDetails: (data: Partial<CvResponseDto>)=>Promise<CvResponseDto | null>;
    jobApplicationDetails: JobApplicationDetails[];
    skillsAndCompetency: SkillsAndCompetency;
    application: JobApplicationDetails | null;
    applicantEducation: EducationResponseDto;
    uploadProfileFile: (data: FileUploadRequest)=>Promise<FileUploadResponse | null>;
    deleteProfileFile: (data: FileUploadRequest)=>Promise<boolean>;
    experience: ExperienceResponseDto;
    experiences: ExperienceResponseDto[]
    setExperiences: (data: ExperienceResponseDto[])=>void;
    setExperience: (experience: ExperienceResponseDto) => void;
    updateSocials: (socials: SocialsResponseDto[])=>Promise<SocialsResponseDto[]>;
    addExperience: (experience: ExperienceRequestDto) => Promise<ExperienceResponseDto | null>;
    updateExperience: (experience: ExperienceResponseDto) => Promise<ExperienceResponseDto | null>;
    updateSkillsAndCompetencies: (skillsAndCompetency: SkillsAndCompetency)=>Promise<SkillsAndCompetency>;
    updatePortfolioLinks: (links: string[])=>Promise<string[]>;
    deleteExperience: (experienceId: number) => Promise<boolean>;
    fetchExperiences: ()=>Promise<ExperienceResponseDto[]>;
    resetExperiences: () => void;
    resetExperience: ()=>void;
    educations: EducationResponseDto[] | [];
    setEducations: (data: EducationResponseDto[])=>void;
    setApplicantEducation: (education: EducationResponseDto) => void;
    updatedApplicantEducation: (data: EducationResponseDto) => Promise<EducationResponseDto | null>;
    addApplicantEducation: (data: EducationResponseDto) => Promise<EducationResponseDto | null>;
    deleteEducation: (educationId: number) => Promise<boolean>;
    success: boolean;
    error: string | null;
    loading: boolean;
    fetchPreferences: (applicantId: number) => Promise<JobPreferenceResponse | null>;
    fetchCvDetails: (applicantId: number) => Promise<CvResponseDto | null>;
    fetchApplicantEducation: () => Promise<EducationResponseDto[]>;
    setPreference: (preference: JobPreference) => void;
    updatePreference: (preference: JobPreference) => Promise<JobPreferenceResponse | null>;
    setJobApplicationDetails: (jobApplicationDetails: JobApplicationDetails) => void;
    setApplication: (application: JobApplicationDetails) => void;
    setCvDetails: (cvDetails: CvResponseDto) => void;
    submitJobApplication: () => Promise<boolean>;
    resetJobApplication: () => void;
    resetApplicantEducation: () => void;
    resetEducations: () => void;
}

export const useApplicantJobProfile = create<ApplicantJobProfile>()(
    devtools(
        persist(
            immer<ApplicantJobProfile>((set) => ({
                preferences: null,
                cvDetails: null,
                jobApplicationDetails: [],
                applicantEducation: {} as EducationResponseDto,
                experience: {} as ExperienceResponseDto,
                skillsAndCompetency: {} as SkillsAndCompetency,
                experiences: [],
                educations: [],
                application: null,
                success: false,
                error: null,
                loading: false,
                setJobApplicationDetails: (jobApplicationDetails: JobApplicationDetails) =>
                    set((state) => {
                        state.jobApplicationDetails = [...state.jobApplicationDetails, jobApplicationDetails];
                    }),
                setApplication: (application) =>
                    set((state) => {
                        state.application = application;
                    }),
                setCvDetails: (cvDetails: Partial<CvResponseDto>) =>
                    set((state) => {
                        state.cvDetails = cvDetails;
                    }),
                submitJobApplication: async () => {
                    // Implement the job application submission logic here
                    return true;
                },
                setPreference: (preference: JobPreference) =>
                    set((state) => {
                        state.preferences = preference;
                        state.success = false;
                        state.error = null;
                    }),
                fetchPreferences: async (applicantId: number) => {
                    set((state) => {
                        state.loading = true;
                    });
                    try {
                        const response = await privateApiClient.get<APIResponse<JobPreferenceResponse>>(
                            `/jobs/get-preference/${applicantId}`
                        );
                        set((state) => {
                            state.preferences = response.data?.data;
                            state.success = true;
                            state.error = null;
                        });
                        return response.data.data;
                    } catch (error: any) {
                        console.error('Failed to fetch job preferences:', error);
                        set((state) => {
                            state.error = error.response?.data?.message || 'Unknown error occurred';
                        });
                        toast.error(error.response?.data?.message || 'Failed to fetch job preferences');
                        return null;
                    } finally {
                        set((state) => {
                            state.loading = false;
                        });
                    }
                },
                updatePreference: async (preference: JobPreference) => {
                    set((state) => {
                        state.loading = true;
                    });
                    try {
                        const response = await privateApiClient.post<APIResponse<JobPreferenceResponse>>(
                            `/jobs/add-preference`,
                            preference
                        );
                        set((state) => {
                            state.preferences = { ...preference, ...response.data?.data };
                            state.success = true;
                            state.error = null;
                        });
                        return response.data.data;
                    } catch (error: any) {
                        console.error('Failed to add job preference:', error);
                        set((state) => {
                            state.error = error.response?.data?.message || 'Unknown error occurred';
                        });
                        toast.error(error.response?.data?.message || 'Failed to add job preference');
                        return null;
                    } finally {
                        set((state) => {
                            state.loading = false;
                        });
                    }
                },
                resetJobApplication: () =>
                    set((state) => {
                        state.preferences = null;
                        state.cvDetails = null;
                        state.jobApplicationDetails = [];
                        state.application = null;
                        state.success = false;
                        state.error = null;
                        state.loading = false;
                    }),
                updatedCvDetails: async (data: Partial<CvResponseDto>) => {
                    set((state) => {
                        state.loading = true;
                    });
                    try {
                        const response = await privateApiClient.put<APIResponse<CvResponseDto>>(`/cv/update`, data);
                        set((state) => {
                            state.cvDetails = {...state.cvDetails, ...response.data?.data };
                            state.success = true;
                            state.error = null;
                        });
                        return response.data?.data;
                    } catch (error: any) {
                        console.error('Failed to update CV details:', error);
                        set((state) => {
                            state.error = error.response?.data?.message || 'Unknown error occurred';
                        });
                        toast.error(error.response?.data?.message || 'Failed to update CV details');
                        return null;
                    } finally {
                        set((state) => {
                            state.loading = false;
                        });
                    }
                },
                fetchCvDetails: async (applicantId: number) => {
                    set((state) => {
                        state.loading = true;
                    });
                    try {
                        const response = await privateApiClient.get<APIResponse<CvResponseDto>>(`/cvs/get-details/${applicantId}`);
                        set((state) => {
                            state.cvDetails = response.data?.data;
                            state.success = true;
                            state.error = null;
                        });
                        return response.data.data;
                    } catch (error: any) {
                        console.error('Failed to fetch CV details:', error);
                        set((state) => {
                            state.error = error.response?.data?.message || 'Unknown error occurred';
                        });
                        toast.error(error.response?.data?.message || 'Failed to fetch CV details');
                        return null;
                    } finally {
                        set((state) => {
                            state.loading = false;
                        });
                    }
                },
                setApplicantEducation: (data: EducationResponseDto) => {
                    set((state) => {
                        state.applicantEducation = {
                            ...state.applicantEducation,
                            ...data,
                        };
                    });
                },
                updatedApplicantEducation: async (data: EducationResponseDto) => {
                    try {
                        set((state) => {
                            state.loading = true;
                        });
                        const response = await privateApiClient.put<APIResponse<EducationResponseDto>>(`${API_BASE_URL}/cv/update-education`, data);
                        set((state)=>{
                            state.loading = false;
                            state.error = null;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || "Error updating education information");
                        set((state) => {
                            state.error = err.response?.data?.message || "Error updating education information";
                            state.loading = false;
                        });
                        return null;
                    }
                },
                deleteEducation: async (educationId: number) => {
                    try {
                        const response = await privateApiClient.delete<APIResponse<void>>(`/cv/delete-education/${Number(educationId)}`);
                        console.log("Education deleted successfully");
                        return response?.data?.statusCode === 200;
                    } catch (error: any) {
                        console.error("Error deleting education:", error);
                        set({ error: error.response?.data?.message || "Unknown error occurred" });
                    }
                    return false;
                },
                fetchApplicantEducation: async ()=>{
                    try {
                        set((state) => {
                            state.loading = true;
                        });
                        const response = await privateApiClient.get<APIResponse<EducationResponseDto[]>>(`/cv/get-educations`);
                        set((state) => {
                            state.educations = response.data?.data;
                            state.loading = false;
                            state.error = null;
                        });
                        return response.data?.data;
                    } catch (error: any) {
                        console.error('Failed to fetch applicant education:', error);
                        set((state) => {
                            state.error = error.response?.data?.message || 'Unknown error occurred';
                            state.loading = false;
                        });
                        toast.error(error.response?.data?.message || 'Failed to fetch applicant education');
                        return [];
                    }
                },
                setEducations: data => {
                    set((state) => {
                        state.educations = data;
                    });
                },
                addApplicantEducation: async (data) => {
                    try {
                        set((state) => {
                            state.loading = true;
                        });
                        const response = await privateApiClient.post<APIResponse<EducationResponseDto>>(`${API_BASE_URL}/cv/add-education`, data);
                        set((state)=>{
                            state.loading = false;
                            state.error = null;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || "Error updating education information");
                        set((state) => {
                            state.error = err.response?.data?.message || "Error updating education information";
                            state.loading = false;
                        });
                        return null;
                    }
                },
                resetApplicantEducation: async ()=>{
                    set((state) => {
                        state.applicantEducation = {} as  EducationResponseDto;
                    });
                },
                resetEducations: async ()=>{
                    set((state) => {
                        state.educations = [];
                    });
                },
                fetchExperiences: async ()=>{
                    try {
                        set((state) => {
                            state.loading = true;
                        });
                        const response = await privateApiClient.get<APIResponse<ExperienceResponseDto[]>>(`/cv/get-experiences`);
                        set((state) => {
                            state.experiences = response.data?.data;
                            state.loading = false;
                            state.error = null;
                        });
                        return response.data?.data;
                    } catch (error: any) {
                        console.error('Failed to fetch experiences:', error);
                        set((state) => {
                            state.error = error.response?.data?.message || 'Unknown error occurred';
                            state.loading = false;
                        });
                        toast.error(error.response?.data?.message || 'Failed to fetch experiences');
                        return [];
                    }
                },
                setExperiences: data => {
                    set((state) => {
                        state.experiences = data;
                    });
                },
                addExperience: async (data) => {
                    try {
                        set((state) => {
                            state.loading = true;
                        });
                        const response = await privateApiClient.post<APIResponse<ExperienceResponseDto>>(`${API_BASE_URL}/cv/add-experience`, data);
                        set((state)=>{
                            state.loading = false;
                            state.error = null;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || "Error updating experience information");
                        set((state) => {
                            state.error = err.response?.data?.message || "Error updating experience information";
                            state.loading = false;
                        });
                        return null;
                    }
                },
                updateExperience: async (data) => {
                    try {
                        set((state) => {
                            state.loading = true;
                        });
                        const response = await privateApiClient.put<APIResponse<ExperienceResponseDto>>(`${API_BASE_URL}/cv/experiences/${data.id}/update`, data);
                        set((state)=>{
                            state.loading = false;
                            state.error = null;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || "Error updating experience information");
                        set((state) => {
                            state.error = err.response?.data?.message || "Error updating experience information";
                            state.loading = false;
                        });
                        return null;
                    }
                },
                deleteExperience: async (experienceId: number) => {
                    try {
                        const response = await privateApiClient.delete<APIResponse<void>>(`${API_BASE_URL}/cv/experiences/${Number(experienceId)}`);
                        console.log("Experience deleted successfully");
                        return response?.data?.statusCode === 200;
                    } catch (error: any) {
                        console.error("Error deleting experience:", error);
                        set({ error: error.response?.data?.message || "Unknown error occurred" });
                    }
                    return false;
                },
                setExperience: data => {
                            set((state) => {
                                state.experience = {
                                    ...state.experience,
                                    ...data
                                };
                            });
                        },
                        resetExperience: async ()=>{
                            set((state) => {
                                state.experience = {} as ExperienceResponseDto;
                            });
                        },
                            resetExperiences: async ()=>{
                            set((state) => {
                                state.experiences = [];
                    });
                },
                updateSkillsAndCompetencies: async (skillAndCompetences: SkillsAndCompetency)=>{
                    try {
                        set((state) => {
                            state.loading = true;
                        });
                        const response = await privateApiClient.put<APIResponse<SkillsAndCompetency>>(`${API_BASE_URL}/cv/skills-and-competencies`, skillAndCompetences);
                        set((state)=>{
                            state.loading = false;
                            state.error = null;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || "Error updating skills and competencies");
                        set((state) => {
                            state.error = err.response?.data?.message || "Error updating skills and competencies";
                            state.loading = false;
                        });
                        return {} as SkillsAndCompetency;
                    }
                },
                uploadProfileFile: async (data: FileUploadRequest) => {
                    try {
                        set((state) => {
                            state.loading = true;
                        });

                        console.log("Uploading profile");

                        // Create FormData object
                        const formData = new FormData();

                        // Append the file (ensure it's a File and not a string)
                        if (typeof data.file === "string") {
                            console.error("File must be of type File, but received a string.");
                            throw new Error("Invalid file type.");
                        } else {
                            formData.append("file", data?.file as File);
                        }

                        // Append additional fields
                        formData.append("userId", data.userId.toString());
                        formData.append("userType", data.userType);
                        formData.append("action", data.action);
                        formData.append("whatIsTheItem", data.whatIsTheItem);

                        // Make API call with FormData
                        const response = await privateApiClient.post<APIResponse<FileUploadResponse>>(
                            `${VITE_API_FILE_SERVICE}/gighub/upload`,
                            formData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        );

                        set((state) => {
                            state.loading = false;
                            state.error = null;
                        });

                        return response?.data?.data;
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || "Error uploading profile file");
                        set((state) => {
                            state.error = err.response?.data?.message || "Error uploading profile file";
                            state.loading = false;
                        });
                        return {} as FileUploadResponse;
                    }
                },
                deleteProfileFile: async (data: FileUploadRequest)=>{
                    try {
                        set((state) => {
                            state.loading = true;
                        });

                        const response = await privateApiClient.post<APIResponse<boolean>>(`${VITE_API_FILE_SERVICE}/gighub/files/delete`, data);
                        set((state) => {
                            state.loading = false;
                            state.error = null;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || "Error deleting profile file");
                        set((state) => {
                            state.error = err.response?.data?.message || "Error deleting profile file";
                            state.loading = false;
                        });
                        return false;
                    }
                },
                updatePortfolioLinks: async(links: string[])=>{
                    try {
                        set((state) => {
                            state.loading = true;
                        });

                        const response = await privateApiClient.put<APIResponse<string[]>>(`${API_BASE_URL}/cv/portfolio-links`, links);
                        set((state) => {
                            state.loading = false;
                            state.error = null;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || "Error updating portfolio links");
                        set((state) => {
                            state.error = err.response?.data?.message || "Error updating portfolio links";
                            state.loading = false;
                        });
                        return [];
                    }
                },
                updateSocials: async(socials: SocialsResponseDto[])=>{
                    try {
                        set((state) => {
                            state.loading = true;
                        });

                        const response = await privateApiClient.put<APIResponse<SocialsResponseDto[]>>(`${API_BASE_URL}/cv/socials`, socials);
                        set((state) => {
                            state.loading = false;
                            state.error = null;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || "Error updating socials");
                        set((state) => {
                            state.error = err.response?.data?.message || "Error updating socials";
                            state.loading = false;
                        });
                        return [];
                    }
                }
            })),
            {
                name: 'applicantJobProfile',
                partialize: (state) => ({
                    preferences: state.preferences,
                    cvDetails: state.cvDetails,
                    jobApplicationDetails: state.jobApplicationDetails,
                    educations: state.educations,
                    experience: state.experience,
                    experiences: state.experiences,
                    applicantEducation: state.applicantEducation,
                    application: state.application,
                    success: state.success,
                    error: state.error,
                    loading: state.loading,
                }),
                storage: createJSONStorage(()=>NODE_ENV === 'development' ? localStorage: secureStorageWrapper)
            }
        )
    )
);
// Usage example:
