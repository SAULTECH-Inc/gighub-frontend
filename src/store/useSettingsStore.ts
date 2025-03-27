import { create } from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {API_BASE_URL, NODE_ENV, secureStorageWrapper} from "../utils/constants.ts";
import {UserType} from "../utils/enums.ts";
import {privateApiClient} from "../api/axios.ts";
import {APIResponse} from "../utils/types";

// Notification Types
export interface NotificationType {
    pushNotification: boolean;
    emailNotification: boolean;
    smsNotification: boolean;
    all: boolean;
}

// Application Status Notifications
export interface ApplicationStatus {
    all: boolean;
    submitted: boolean;
    shortlisted: boolean;
    rejected: boolean;
    scheduledForInterview: boolean;
}

export interface ApplicationStatusNotification {
    notificationType: NotificationType;
    option: ApplicationStatus;
}

// Job Recommendations Notifications
export interface JobRecommendations {
    profilePreferences: boolean;
    savedJobSearch: boolean;
    jobMatchFound: boolean;
}

export interface NotificationFrequency {
    instant: boolean;
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
}

export interface JobRecommendationsNotification {
    notificationType: NotificationType;
    frequency: NotificationFrequency;
    option: JobRecommendations;
}

// Interview Invitation Notifications
export interface InterviewInvitationState {
    scheduleCancelled: boolean;
    scheduleRescheduled: boolean;
    notifyForUpcomingInterviews: boolean;
    notifyForInterviewConfirmation: boolean;
}

export interface InterviewInvitationNotification {
    notificationType: NotificationType;
    option: InterviewInvitationState;
}

// Auto Apply Notifications
export interface AutoApplyState {
    jobAutoApplied: boolean;
    jobMatchFound: boolean;
    jobMatchedButFailedToApply: boolean;
}

export interface AutoApplyNotification {
    notificationType: NotificationType;
    option: AutoApplyState;
}

// Saved Job Notifications
export interface SavedJobStates {
    aboutToExpire: boolean;
    aboutToExpireNotApplied: boolean;
    aboutToExpireApplied: boolean;
    expired: boolean;
    closed: boolean;
    updatedByEmployer: boolean;
}

export interface SavedJobNotification {
    notificationType: NotificationType;
    option: SavedJobStates;
}

// Employer Actions Notifications
export interface EmployerActionOption {
    viewedMyProfile: boolean;
    downloadedMyResume: boolean;
    sentDirectMessage: boolean;
}

export interface EmployerActionNotification {
    notificationType: NotificationType;
    option: EmployerActionOption;
}

// Platform Notifications
export interface PlatformNotificationOption {
    newProductOrUpdate: boolean;
    maintenanceDowntime: boolean;
}

export interface PlatformNotifications {
    notificationType: NotificationType;
    frequency: NotificationFrequency;
    option: PlatformNotificationOption;
}

// Communication Notifications
export interface CommunicationNotificationOption {
    promotionalOffers: boolean;
    fromPlatform: boolean;
}

export interface CommunicationNotification {
    notificationType: NotificationType;
    option: CommunicationNotificationOption;
}

// Privacy Options
export interface PrivacyOptions {
    publicProfile: boolean;
    onlyEmployers: boolean;
    onlyMe: boolean;
    onlyMyNetwork: boolean;
}

// Subscription Details
interface SubscriptionPlan {
    name: string;
    price: number;
    features: string[];
}

interface SubscriptionBenefits {
    name: string;
    description: string;
}

interface SubscriptionDetails {
    frequency: NotificationFrequency;
    plan: SubscriptionPlan;
    benefits: SubscriptionBenefits[];
}

// Payment & Billing Notifications
interface PaymentAndBillingNotificationOptions {
    subscriptionDue: boolean;
    subscriptionCancelled: boolean;
    subscriptionExpired: boolean;
    subscriptionSuccessful: boolean;
}

interface PaymentAndBillingNotification {
    notificationType: NotificationType;
    option: PaymentAndBillingNotificationOptions;
}

// Job Posting Notifications
interface JobPostingStatusNotificationOptions {
    newJobPosting: boolean;
    draftSaved: boolean;
    jobUpdated: boolean;
    jobPublished: boolean;
    jobFailed: boolean;
    jobExpired: boolean;
    jobDeleted: boolean;
}

interface JobPostingStatusNotification {
    notificationType: NotificationType;
    option: JobPostingStatusNotificationOptions;
}

// Visibility Settings
interface JobPostingVisibility {
    public: boolean;
    private: boolean;
    basedOnPreferences: boolean;
}

interface CompanyVisibility {
    showAllDetails: boolean;
    showMinimalDetails: boolean;
}

// Communication Preferences
interface CommunicationPreference {
    allowDirectContact: boolean;
    subscribeToNewsletter: boolean;
    receiveJobPostUpdates: boolean;
}

// General Settings Notifications Options
export interface GeneralSettingsNotificationOptions {
    enableTwoFactorAuth: boolean;
    passwordChange: boolean;
    passwordReset: boolean;
    loginFromNewDevice: boolean;
    login: boolean;
}

export interface GeneralSettingsNotification {
    notificationType: NotificationType;
    option: GeneralSettingsNotificationOptions;
}

// Applicant Notification Settings Options
interface ApplicantNotificationSettingsOptions {
    applicationStatus: ApplicationStatusNotification;
    jobRecommendations: JobRecommendationsNotification;
    interviewInvitation: InterviewInvitationNotification;
    autoApply: AutoApplyNotification;
    savedJob: SavedJobNotification;
    employerAction: EmployerActionNotification;
    platform: PlatformNotifications;
    generalSettings: GeneralSettingsNotification;
    communication: CommunicationNotification;
    paymentAndBilling: PaymentAndBillingNotification;
}

// Applicant Notification Settings
interface ApplicantNotificationSettings {
    options: ApplicantNotificationSettingsOptions;
}

// Applicant Settings
export interface ApplicantSettings {
    notifications: ApplicantNotificationSettings;
    privacy: PrivacyOptions;
    subscription: SubscriptionDetails;
}

// Employer Notifications Options
interface EmployerNotificationsOptions {
    jobPostingStatus: JobPostingStatusNotification;
    interviewInvitation: InterviewInvitationNotification;
    paymentAndBilling: PaymentAndBillingNotification;
    platform: PlatformNotifications;
    communication: CommunicationNotification;
}

// Employer Settings
interface EmployerNotifications {
    options: EmployerNotificationsOptions;
}

// Visibility Options
interface VisibilityOptions {
    jobPostingVisibility: JobPostingVisibility;
    companyVisibility: CompanyVisibility;
}

// Employer Settings
export interface EmployerSettings {
    notifications: EmployerNotifications;
    privacy: PrivacyOptions;
    subscription: SubscriptionDetails;
    visibility: VisibilityOptions;
    communicationPreferences: CommunicationPreference;
}

// Settings Store
export interface SettingsStore {
    darkMode: boolean;
    toggleDarkMode: () => void;
    setApplicantSettings: (settings: ApplicantSettings) => void;
    setEmployerSettings: (settings: EmployerSettings) => void;
    applicantSettings: ApplicantSettings;
    employerSettings: EmployerSettings;
    applicationStatusNotification: ApplicationStatusNotification;
    jobRecommendations: JobRecommendationsNotification;
    setJobRecommendationsNotification: (jobRecommendations: JobRecommendationsNotification) => void;
    updateJobRecommendationsNotification: (jobRecommendations: JobRecommendationsNotification)=>Promise<JobRecommendationsNotification>;
    interviewInvitation: InterviewInvitationNotification;
    setInterviewInvitation: (invitation: InterviewInvitationNotification)=>void;
    updateInterviewInvitation: (invitation: InterviewInvitationNotification)=>Promise<InterviewInvitationNotification>;
    autoApply: AutoApplyNotification;
    setAutoApply: (autoApply: AutoApplyNotification)=>void;
    updateAutoApply: (autoApply: AutoApplyNotification)=>Promise<AutoApplyNotification>;
    savedJob: SavedJobNotification;
    setSavedJob: (job: SavedJobNotification)=>void;
    updateSavedJob: (job: SavedJobNotification)=>Promise<SavedJobNotification>;
    employerAction: EmployerActionNotification;
    setEmployerAction: (action: EmployerActionNotification)=>void;
    platform: PlatformNotifications;
    setPlatform: (platform: PlatformNotifications)=>void;
    updatePlatform: (platform: PlatformNotifications)=>Promise<PlatformNotifications>;
    updateEmployerAction: (action: EmployerActionNotification)=>Promise<EmployerActionNotification>;
    generalSettings: GeneralSettingsNotification;
    setGeneralSettings: (settings: GeneralSettingsNotification)=>void;
    updateGeneralSettings: (settings: GeneralSettingsNotification)=>Promise<GeneralSettingsNotification>;
    communication: CommunicationNotification;
    setCommunication: (notification: CommunicationNotification)=>void;
    updateCommunication: (notification: CommunicationNotification)=>Promise<CommunicationNotification>;
    privacy: PrivacyOptions;
    setPrivacy: (privacy: PrivacyOptions)=>void;
    updatePrivacy: (privacy: PrivacyOptions)=>Promise<PrivacyOptions>;
    setApplicationStatusNotification: (status: ApplicationStatusNotification)=>void;
    updateApplicationStatusNotification: (status: ApplicationStatusNotification)=>Promise<ApplicationStatusNotification>;
    fetchSettings: (userType: UserType)=>Promise<EmployerSettings | ApplicantSettings>;
    updateApplicantsSettings: (settings: ApplicantSettings | EmployerSettings, userType: UserType)=>Promise<ApplicantSettings | EmployerSettings>;
}

export const useSettingsStore = create<SettingsStore>()(
    devtools(
        persist(
            immer<SettingsStore>((set) => ({
                darkMode: false,
                toggleDarkMode: () => set((state) => {
                    state.darkMode = !state.darkMode;
                }),
                applicantSettings: {} as ApplicantSettings,
                employerSettings: {} as EmployerSettings,
                setApplicantSettings: (settings: ApplicantSettings) => set((state) => {
                    state.applicantSettings = settings;
                }),
                setEmployerSettings: (settings: EmployerSettings) => set((state) => {
                    state.employerSettings = settings;
                }),
                fetchSettings: async (userType: UserType) => {
                    const SETTINGS_URL = `${API_BASE_URL}/settings/user`;

                    try {
                        const response = await privateApiClient.get<APIResponse<EmployerSettings | ApplicantSettings>>(SETTINGS_URL, {
                            params: { userType }
                        });

                        return response?.data?.data ?? null;
                    } catch (err: any) {
                        console.error(`Error fetching settings for userType=${userType}:`, err);
                        throw new Error(`Failed to fetch settings: ${err.message}`);
                    }
                },
                updateApplicantsSettings: async (settings: ApplicantSettings | EmployerSettings, userType: UserType) => {
                    const SETTINGS_URL = `${API_BASE_URL}/settings/update`;

                    try {
                        const response = await privateApiClient.put<APIResponse<ApplicantSettings | EmployerSettings>>(SETTINGS_URL, {
                            userType: userType,
                            applicant: userType === UserType.APPLICANT ? settings : null,
                            employer: userType === UserType.EMPLOYER ? settings : null,
                        });

                        set((state) => {
                            if (userType === UserType.EMPLOYER) {
                                state.employerSettings = settings as EmployerSettings;
                            } else {
                                state.applicantSettings = settings as ApplicantSettings;
                            }
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        console.error(`Error updating settings for userType=${userType}:`, err);
                        throw new Error(`Failed to update settings: ${err.message}`);
                    }
                },
                applicationStatusNotification: {
                    option: {
                        all: false,
                        submitted: false,
                        shortlisted: false,
                        scheduledForInterview: false,
                        rejected: false
                    },
                    notificationType: {
                        all: false,
                        emailNotification: false,
                        pushNotification: false,
                        smsNotification: false
                    }
                },
                setApplicationStatusNotification: (status: ApplicationStatusNotification) => set((state) => {
                    state.applicantSettings.notifications.options.applicationStatus = status;
                }),
                updateApplicationStatusNotification: async (status: ApplicationStatusNotification) => {
                    const SETTINGS_URL = `${API_BASE_URL}/settings/application-status/update`;

                    try {
                        const response = await privateApiClient.put<APIResponse<ApplicationStatusNotification>>(SETTINGS_URL, status);

                        set((state) => {
                            state.applicationStatusNotification = response?.data?.data;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        console.error(`Error updating application status notification:`, err);
                        throw new Error(`Failed to update application status notification: ${err.message}`);
                    }
                },
                jobRecommendations: {
                    option: {
                        profilePreferences: false,
                        savedJobSearch: false,
                        jobMatchFound: false,
                    },
                    notificationType: {
                        all: false,
                        emailNotification: false,
                        pushNotification: false,
                        smsNotification: false
                    },
                    frequency: {
                        instant: false,
                        daily: false,
                        weekly: false,
                        monthly: false
                    }
                },
                setJobRecommendationsNotification: (jobRecommendations: JobRecommendationsNotification) => set((state) => {
                    state.applicantSettings.notifications.options.jobRecommendations = jobRecommendations;
                }),
                updateJobRecommendationsNotification: async (jobRecommendations: JobRecommendationsNotification) => {
                    const SETTINGS_URL = `${API_BASE_URL}/settings/job-recommendations/update`;

                    try {
                        const response = await privateApiClient.put<APIResponse<JobRecommendationsNotification>>(SETTINGS_URL, jobRecommendations);

                        set((state) => {
                            state.jobRecommendations = response?.data?.data;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        console.error(`Error updating job recommendations notification:`, err);
                        throw new Error(`Failed to update job recommendations notification: ${err.message}`);
                    }
                },
                interviewInvitation: {
                    option: {
                        scheduleCancelled: false,
                        scheduleRescheduled: false,
                        notifyForUpcomingInterviews: false,
                        notifyForInterviewConfirmation: false,
                    },
                    notificationType: {
                        all: false,
                        emailNotification: false,
                        pushNotification: false,
                        smsNotification: false
                    }
                },
                setInterviewInvitation: (invitation: InterviewInvitationNotification) => set((state) => {
                    state.applicantSettings.notifications.options.interviewInvitation = invitation;
                }),
                updateInterviewInvitation: async (invitation: InterviewInvitationNotification) => {
                    const SETTINGS_URL = `${API_BASE_URL}/settings/interview-invitation/update`;

                    try {
                        const response = await privateApiClient.put<APIResponse<InterviewInvitationNotification>>(SETTINGS_URL, invitation);

                        set((state) => {
                            state.interviewInvitation = response?.data?.data;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        console.error(`Error updating interview invitation notification:`, err);
                        throw new Error(`Failed to update interview invitation notification: ${err.message}`);
                    }
                },
                autoApply: {
                    option: {
                        jobAutoApplied: false,
                        jobMatchFound: false,
                        jobMatchedButFailedToApply: false
                    },
                    notificationType: {
                        all: false,
                        emailNotification: false,
                        pushNotification: false,
                        smsNotification: false
                    }
                },
                setAutoApply: (autoApply: AutoApplyNotification) => set((state) => {
                    state.applicantSettings.notifications.options.autoApply = autoApply;
                }),
                updateAutoApply: async (autoApply: AutoApplyNotification) => {
                    const SETTINGS_URL = `${API_BASE_URL}/settings/auto-apply/update`;

                    try {
                        const response = await privateApiClient.put<APIResponse<AutoApplyNotification>>(SETTINGS_URL, autoApply);

                        set((state) => {
                            state.autoApply = response?.data?.data;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        console.error(`Error updating auto apply notification:`, err);
                        throw new Error(`Failed to update auto apply notification: ${err.message}`);
                    }
                },
                savedJob: {
                    option: {
                        aboutToExpire: false,
                        aboutToExpireNotApplied: false,
                        aboutToExpireApplied: false,
                        expired: false,
                        closed: false,
                        updatedByEmployer: false,
                    },
                    notificationType: {
                        all: false,
                        emailNotification: false,
                        pushNotification: false,
                        smsNotification: false
                    }
                },
                setSavedJob: (savedJob: SavedJobNotification) => set((state) => {
                    state.applicantSettings.notifications.options.savedJob = savedJob;
                }),
                updateSavedJob: async (savedJob: SavedJobNotification) => {
                    const SETTINGS_URL = `${API_BASE_URL}/settings/saved-job/update`;

                    try {
                        const response = await privateApiClient.put<APIResponse<SavedJobNotification>>(SETTINGS_URL, savedJob);

                        set((state) => {
                            state.savedJob = response?.data?.data;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        console.error(`Error updating saved job notification:`, err);
                        throw new Error(`Failed to update saved job notification: ${err.message}`);
                    }
                },
                employerAction: {
                    option: {
                        viewedMyProfile: false,
                        downloadedMyResume: false,
                        sentDirectMessage: false,
                    },
                    notificationType: {
                        all: false,
                        emailNotification: false,
                        pushNotification: false,
                        smsNotification: false
                    }
                },
                setEmployerAction: (employerAction: EmployerActionNotification) => set((state) => {
                    state.applicantSettings.notifications.options.employerAction = employerAction;
                }),
                updateEmployerAction: async (employerAction: EmployerActionNotification) => {
                    const SETTINGS_URL = `${API_BASE_URL}/settings/employer-action/update`;

                    try {
                        const response = await privateApiClient.put<APIResponse<EmployerActionNotification>>(SETTINGS_URL, employerAction);

                        set((state) => {
                            state.employerAction = response?.data?.data;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        console.error(`Error updating employer action notification:`, err);
                        throw new Error(`Failed to update employer action notification: ${err.message}`);
                    }
                },
                platform: {
                    option: {
                        newProductOrUpdate: false,
                        maintenanceDowntime: false,
                    },
                    frequency: {
                        instant: false,
                        daily: false,
                        weekly: false,
                        monthly: false
                    },
                    notificationType: {
                        all: false,
                        emailNotification: false,
                        pushNotification: false,
                        smsNotification: false
                    }
                },
                setPlatform: platform => {
                    set((state) => {
                        state.applicantSettings.notifications.options.platform = platform
                    });
                },
                updatePlatform: async (platform: PlatformNotifications) => {
                    const SETTINGS_URL = `${API_BASE_URL}/settings/platform/update`;

                    try {
                        const response = await privateApiClient.put<APIResponse<PlatformNotifications>>(SETTINGS_URL, platform);
                        set((state) => {
                            state.platform = platform;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        console.error(`Error updating platform:`, err);
                        throw new Error(`Failed to update platform: ${err.message}`);
                    }
                },
                generalSettings: {
                    option: {
                        enableTwoFactorAuth: false,
                        passwordChange: false,
                        passwordReset: false,
                        loginFromNewDevice: false,
                        login: false,
                    },
                    notificationType: {
                        all: false,
                        emailNotification: false,
                        pushNotification: false,
                        smsNotification: false
                    }
                },
                setGeneralSettings: (generalSettings: GeneralSettingsNotification) => set((state) => {
                    state.applicantSettings.notifications.options.generalSettings = generalSettings
                }),
                updateGeneralSettings: async (generalSettings: GeneralSettingsNotification) => {
                    const SETTINGS_URL = `${API_BASE_URL}/settings/general/update`;

                    try {
                        const response = await privateApiClient.put<APIResponse<GeneralSettingsNotification>>(SETTINGS_URL, generalSettings);
                        set((state) => {
                            state.generalSettings = generalSettings;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        console.error(`Error updating general settings:`, err);
                        throw new Error(`Failed to update general settings: ${err.message}`);
                    }
                },
                communication: {
                    option: {
                        promotionalOffers: false,
                        fromPlatform: false,
                    },
                    notificationType: {
                        all: false,
                        emailNotification: false,
                        pushNotification: false,
                        smsNotification: false
                    }
                },
                setCommunication: (communication: CommunicationNotification) => set((state) => {
                    state.applicantSettings.notifications.options.communication = communication
                }),
                updateCommunication: async (communication: CommunicationNotification) => {
                    const SETTINGS_URL = `${API_BASE_URL}/settings/communication/update`;

                    try {
                        const response = await privateApiClient.put<APIResponse<CommunicationNotification>>(SETTINGS_URL, communication);
                        set((state) => {
                            state.communication = communication;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        console.error(`Error updating communication preferences:`, err);
                        throw new Error(`Failed to update communication preferences: ${err.message}`);
                    }
                },
                privacy: {
                    publicProfile: false,
                    onlyEmployers: false,
                    onlyMe: false,
                    onlyMyNetwork: false,
                },
                setPrivacy: (privacy: PrivacyOptions) => set((state) => {
                    state.applicantSettings.privacy = privacy
                }),
                updatePrivacy: async (privacy: PrivacyOptions) => {
                    const SETTINGS_URL = `${API_BASE_URL}/settings/privacy/update`;

                    try {
                        const response = await privateApiClient.put<APIResponse<PrivacyOptions>>(SETTINGS_URL, privacy);
                        set((state) => {
                            state.privacy = response?.data?.data;
                        });
                        return response?.data?.data;
                    } catch (err: any) {
                        console.error(`Error updating privacy settings:`, err);
                        throw new Error(`Failed to update privacy settings: ${err.message}`);
                    }
                }
            })),
            {
                name: 'settings',
                storage: createJSONStorage(()=>NODE_ENV === 'development' ? localStorage: secureStorageWrapper),
                partialize: state => ({
                    darkMode: state.darkMode,
                    applicantSettings: state.applicantSettings,
                    jobRecommendations: state.jobRecommendations,
                    interviewInvitation: state.interviewInvitation,
                    autoApply: state.autoApply,
                    savedJob: state.savedJob,
                    employerAction: state.employerAction,
                    platform: state.platform,
                    generalSettings: state.generalSettings,
                    communication: state.communication,
                    privacy: state.privacy,
                    applicationStatusNotification: state.applicationStatusNotification,
                    employerSettings: state.employerSettings,
                })
            }
        )
    )
);
