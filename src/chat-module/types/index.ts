export interface ChatMessage {
    id?: number;
    sender: string;
    recipient?: string;
    content: string;
    createdAt?: string;
    type?: MessageType;
    delivered?: boolean;
    read?: boolean;
    viewed?: boolean;
    dateSent?: Date;
    deliveredDate?: Date;
}

export interface Group {
    name: string;
    admin: string;
    members: string[];
}

export enum MessageType{
    PRIVATE="private",
    GROUP="group"
}

export enum UserChatStatus{
    online="online",
    offline="offline",
    busy="busy",
    away="away"
}

export enum NotificationCategory{
    MARKETING_AND_PROMOTION="marketing and promotion",
    APPLICANT_APPLIED="applicant applied for your job",
    JOB_POSTED="job posted",
    JOB_UPDATED="job updated",
    APPLICANT_REJECTED="applicant rejected your job",
    APPLICANT_ACCEPTED="applicant accepted your job",
    MESSAGE="message received",
    JOB_APPLICATION_UPDATED="job application updated",
    NEW_APPLICANT_FOR_JOB="new applicant for your job",
    NEW_MESSAGE_FROM_APPLICANT="new message from applicant",
    NEW_MESSAGE_FROM_EMPLOYER="new message from employer",
    NEW_APPLICATION_FOR_JOB="new application for your job",
    NEW_JOB_POSTED="new job posted",
    NEW_JOB_UPDATED="new job updated",
    SHORTLISTED="shortlisted",
    USER_STATUS_CHANGED="user status changed"
}
export enum NotificationType{
    PRIVATE="private",
    GROUP="group",
    PUBLIC="public"
}

export interface GigNotification{
    id?: string;
    title: string;
    content: string;
    type: NotificationType;
    category?: NotificationCategory;
    status?:UserChatStatus;
    user?: string;
    read?: boolean;
    delivered?: boolean;
    viewed?: boolean;
    createdAt?: Date;
}
