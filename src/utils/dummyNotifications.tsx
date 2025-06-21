import { NotificationType } from "./NotificationType";

interface NotificationTemplateProps {
  id: number;
  title: string;
  message: string;
  messageContent: string;
  timestamp: string;
  type: NotificationType;
}

const dummyNotifications: NotificationTemplateProps[] = [
  {
    id: 1,
    title: "Your Job Post for ‘Software Engineer’ is Now Live!",
    message:
      "Congratulations! Your job posting for ‘Software Engineer’ has been approved and is now live on our platform.",
    messageContent:
      " Candidates can now view and apply for this position. You can track its performance and manage applications directly from your dashboard.",
    timestamp: "40 minutes",
    type: NotificationType.Approved,
  },
  {
    id: 2,
    title: "New Job Application Received!",
    message:
      "Great news! Fatima Umar has applied for your ‘Data Analyst’ position.",
    messageContent:
      " Review their resume and application details to determine if they’re the right fit for your role.",
    timestamp: "4 hours ago",
    type: NotificationType.Applied,
  },
  {
    id: 3,
    title: "New Interest in Your Company!",
    message: "A.S Abubakar has expressed interest in your company.",
    messageContent:
      " Check out their profile and consider inviting them to apply for your “Accountant” position.",
    timestamp: "6 hours ago",
    type: NotificationType.Interested,
  },
  {
    id: 4,
    title: "Application Withdrawn",
    message:
      "Kabir Yunus has withdrawn their application for the ‘Customer Support Manager’ position. Don’t worry—you can still find great candidates!",
    messageContent:
      " Don’t worry—you can still review other applicants or re-promote your job to attract new talent.",
    timestamp: "8 hours ago",
    type: NotificationType.Withdrawn,
  },
  {
    id: 5,
    title: "Account Flagged for Fraud Suspicion",
    message:
      "Your account has been flagged for fraud suspicion, which may affect your ability to post jobs like ‘Project Manager.’",
    messageContent:
      "Contact our support team if you believe this was a mistake.",
    timestamp: "1 day ago",
    type: NotificationType.Flagged,
  },
];

export default dummyNotifications;
