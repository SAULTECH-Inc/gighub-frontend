import { NODE_ENV } from "./constants.ts";
import secureLocalStorage from "react-secure-storage";
import moment from "moment";
import logger from "../log-config";
import { ApplicationStatus } from "./dummyApplications.ts";
import { UserSubscriptionResponse } from "./types";

export const calculatePasswordStrength = (password: string): number => {
  let strength = 0;

  // Check for length
  if (password.length >= 8) strength++;

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) strength++;

  // Check for lowercase letters
  if (/[a-z]/.test(password)) strength++;

  // Check for numbers
  if (/\d/.test(password)) strength++;

  // Check for special characters
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength++;

  return strength;
};
export const storage =
  NODE_ENV === "development" ? localStorage : secureLocalStorage;
export const getAuthToken = () => {
  if (NODE_ENV === "development") {
    const storage = localStorage.getItem("auth-storage");
    return storage ? JSON.parse(storage).state.authToken : null;
  } else {
    const storage = secureLocalStorage.getItem("auth-storage");
    return storage ? JSON.parse(<string>storage).state.authToken : null;
  }
};

export const setAuthToken = (token: string) => {
  if (NODE_ENV === "development") {
    localStorage.setItem(
      "auth-storage",
      JSON.stringify({ state: { authToken: token } }),
    );
  } else {
    secureLocalStorage.setItem(
      "auth-storage",
      JSON.stringify({ state: { authToken: token } }),
    );
  }
};

const getUserType = () => {
  if (NODE_ENV === "development") {
    const storage = localStorage.getItem("auth-storage");
    return storage ? JSON.parse(storage).state.userType : null;
  } else {
    const storage = secureLocalStorage.getItem("auth-storage");
    return storage ? JSON.parse(<string>storage).state.userType : null;
  }
};
export const TOKEN = getAuthToken();
export const USER_TYPE = getUserType();

export const checkPasswordStrength = (password: string): number => {
  if (!password || password.length < 6) {
    return -1; // Too weak
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[\W_]/.test(password); // Special characters

  const score =
    Number(hasLower) + Number(hasUpper) + Number(hasDigit) + Number(hasSymbol);

  // Evaluate strength
  if (password.length >= 12 && score === 4) {
    return 2; // Stronger
  } else if (password.length >= 8 && score >= 3) {
    return 1; // Strong
  } else if (password.length >= 6 && score >= 2) {
    return 0; // Weak
  }

  return -1; // Too weak (default fallback)
};

/**
 * Calculates and formats the next subscription date
 * @param subscription - Subscription object
 * @returns string | null - Formatted next subscription date or null if data is missing
 */
export function calculateNextSubscriptionDate(
  subscription: UserSubscriptionResponse,
): string | null {
  if (!subscription.createdAt || !subscription.subscription.duration) {
    return null;
  }

  const baseDate = moment(subscription.createdAt);
  const nextDate = baseDate.add(subscription.subscription.duration, "months");

  return nextDate.format("MMMM Do, YYYY"); // Example: "November 30th, 2025"
}

export const subCycle = (subscription: UserSubscriptionResponse) => {
  switch (subscription?.subscription?.duration) {
    case 1:
      return "Month";
    case 3:
      return "Quarter";
    case 6:
      return "Half-Year";
    default:
      return "Year";
  }
};

export const handleError = (error: any) => {
  if (NODE_ENV === "production") {
    logger.error(error.response?.data?.message || "Unknown error occurred");
  } else {
    // toast.error(error.response?.data?.message || 'Failed to fetch job preferences');
  }
};

export const formatChatTimestamp = (createdDate: Date) => {
  const now = moment();
  const created = moment(createdDate);
  const diffInMinutes = now.diff(created, "minutes");
  // const diffInHours = now.diff(created, 'hours');

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else if (now.isSame(created, "day")) {
    return created.format("h:mm A"); // Today
  } else if (now.clone().subtract(1, "day").isSame(created, "day")) {
    return `Yesterday at ${created.format("h:mm A")}`;
  } else if (now.isSame(created, "week")) {
    return `${created.format("dddd")} at ${created.format("h:mm A")}`; // e.g., Monday at 3:45 PM
  } else if (now.isSame(created, "year")) {
    return created.format("MMM D"); // e.g., Apr 20
  } else {
    return created.format("MMM D, YYYY"); // e.g., Apr 20, 2023
  }
};

export const formatTime = (time: string) => {
  const date = new Date(`1970-01-01T${time}:00`);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }); // Outputs: "10:00 AM" or "3:30 PM"
};

export const capitalizeEachCase = (text: string): string => {
  return text
    .split(/[\s-]+/) // split by space or dash
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const statusColorMap: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "#F59E0B", // Amber
  [ApplicationStatus.SHORTLISTED]: "#3B82F6", // Blue
  [ApplicationStatus.INTERVIEWED]: "#8B5CF6", // Purple
  [ApplicationStatus.HIRED]: "#10B981", // Green
  [ApplicationStatus.REJECTED]: "#EF4444", // Red
  [ApplicationStatus.WITHDRAW]: "#6B7280", // Gray
  [ApplicationStatus.VIEWED]: "#60A5FA", // Light Blue
};

export const getStatusColor = (status: ApplicationStatus): string => {
  return statusColorMap[status] ?? "#ccc";
};

export const calculateDaysLeft = (endDate: Date) => {
  if (!endDate) return 0;

  const today = new Date();
  const end = new Date(endDate);

  // Check if end is a valid date
  if (isNaN(end.getTime())) return 0;

  const timeDiff = end.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return daysLeft > 0 ? daysLeft : 0;
};

export function getFirstNWords(text: string, n: number): string {
  if (!text || n <= 0) return "";
  return text.split(/\s+/).slice(0, n).join(" ");
}

export const shouldSendReminder = (
  selected: { date: string; startTime: string },
  daysBefore: number,
): boolean => {
  const interviewDateTime = new Date(`${selected.date}T${selected.startTime}`);
  const now = new Date();

  const diffInMs = interviewDateTime.getTime() - now.getTime();
  const thresholdInMs = daysBefore * 24 * 60 * 60 * 1000;

  return diffInMs > 0 && diffInMs <= thresholdInMs;
};
