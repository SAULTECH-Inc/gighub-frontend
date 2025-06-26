import { EventType, Option } from "./types";
import { StateStorage } from "zustand/middleware";
import secureLocalStorage from "react-secure-storage";
import { EmploymentType } from "./employmentTypes.ts";
import {
  FaBan,
  FaBell,
  FaBriefcase,
  FaBullhorn,
  FaCalendarCheck,
  FaCheck,
  FaClock,
  FaCommentDots,
  FaCreditCard,
  FaEdit,
  FaEnvelope,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaFileAlt,
  FaInfoCircle,
  FaLink,
  FaLock,
  FaMobileAlt,
  FaMoneyBillWave,
  FaPaperPlane,
  FaSignInAlt,
  FaStar,
  FaSyncAlt,
  FaThumbsUp,
  FaTimes,
  FaUndo,
  FaUserCheck,
  FaUserClock,
  FaUserFriends,
  FaUserTie,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { InterviewStatus, InterviewType } from "./enums.ts";

export const emojiList = [
  "😀",
  "😁",
  "😂",
  "🤣",
  "😃",
  "😄",
  "😅",
  "😆",
  "😉",
  "😊",
  "😋",
  "😎",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "🙂",
  "🙃",
  "🫣",
  "🤗",
  "🤩",
  "🤔",
  "🤨",
  "😐",
  "😑",
  "😶",
  "😏",
  "😒",
  "🙄",
  "😬",
  "😳",
  "🤐",
  "😌",
  "😴",
  "🥱",
  "😪",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "😵",
  "😵‍💫",
  "🤯",
  "🤠",
  "🥳",
  "😎",
  "🤓",
  "🧐",
  "😜",
  "😝",
  "😛",
  "🤑",
  "🤤",
  "😤",
  "😡",
  "😠",
  "🤬",
  "😈",
  "👿",
  "💀",
  "☠️",
  "💩",
  "🤡",
  "👹",
  "👺",
  "👻",
  "💀",
  "☠️",
  "👽",
  "👾",
  "🤖",
  "🦾",
  "🦿",
  "💪",
  "🦵",
  "🦶",
  "🦴",
  "🦦",
  "🦈",
  "🐅",
  "🐆",
  "🐘",
  "🦏",
  "🦓",
  "🦒",
  "🐍",
  "🐊",
  "🦕",
  "🐢",
  "🦎",
  "🦑",
  "🐙",
  "🐠",
  "🐡",
  "🐟",
  "🦈",
  "🐬",
  "🐳",
  "🐋",
  "🦦",
  "🦧",
  "🐆",
  "🐅",
  "🐒",
  "🦧",
  "🐆",
  "🦓",
  "🦒",
  "🦴",
  "🦦",
  "🦈",
  "🐆",
  "🐅",
  "🦓",
  "🦦",
  "🦇",
  "🦀",
  "🦋",
  "🦦",
  "🦈",
  "🦮",
  "🦻",
  "🦼",
  "🦶",
];

export const VITE_API_FILE_SERVICE =
  import.meta.env.VITE_API_FILE_SERVICE || "http://localhost:3008";
export const SUBSCRIPTION_SERVICE_HOST =
  import.meta.env.VITE_API_SUBSCRIPTION_SERVICE || "http://localhost:3007";
export const FRONTEND_BASE_URL =
  import.meta.env.VITE_API_FRONTEND_BASE_URL || "http://localhost:5173";

export const NOTIFICATION_API_URL =
  import.meta.env.VITE_API_NOTIFICATION_SERVICE || "http://localhost:3009";

export const SOCKET_URL =
  import.meta.env.VITE_API_CHAT_SERVER_URL || "http://localhost:3003";
export const NODE_ENV = import.meta.env.NODE_ENV || "development";
export const applicantNavBarItemMap = new Map<string, string>([]);
applicantNavBarItemMap.set("Dashboard", "/applicant/dashboard");
applicantNavBarItemMap.set("Find Jobs", "/applicant/find-jobs");
applicantNavBarItemMap.set("Applications", "/applicant/my-applications");
applicantNavBarItemMap.set("My Networks", "/applicant/network");
applicantNavBarItemMap.set("My Schedules", "/applicant/my-schedules");
applicantNavBarItemMap.set("Profile", "/applicant/profile");
applicantNavBarItemMap.set("Settings", "/settings");
applicantNavBarItemMap.set("Help & Support", "/help-and-support");
applicantNavBarItemMap.set("Logout", "/logout");

export const employerNavBarItemMap = new Map<string, string>([]);
employerNavBarItemMap.set("Dashboard", "/employer/dashboard");
employerNavBarItemMap.set("Manage Applicants", "/employer/manage-applicants");
employerNavBarItemMap.set("My Networks", "/employer/network");
employerNavBarItemMap.set("Profile", "/employer/profile");
employerNavBarItemMap.set("Settings", "/settings");
employerNavBarItemMap.set("Job List", "/employer/manage-jobs");
employerNavBarItemMap.set("My Schedules", "/employer/my-schedules");
employerNavBarItemMap.set("Help & Support", "/help-and-support");
employerNavBarItemMap.set("Logout", "/logout");

export const applicantNavItems = [
  "Dashboard",
  "Find Jobs",
  "Applications",
  "My Networks",
  "My Schedules",
];
export const applicantNavItemsMobile = [
  "Dashboard",
  "Find Jobs",
  "Applications",
  "My Networks",
  "My Schedules",
  "Profile",
  "Settings",
  "Help & Support",
];

export const employerNavItems = [
  "Dashboard",
  "Manage Applicants",
  "My Networks",
  "Job List",
  "My Schedules",
];
export const employerNavItemsMobile = [
  "Dashboard",
  "Manage Applicants",
  "My Networks",
  "My Schedules",
  "Profile",
  "Settings",
  "Help & Support",
];

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3005";
export const CHAT_API_BASE_URL =
  import.meta.env.VITE_API_CHAT_SERVER_URL || "http://localhost:3003";
export const jobLocation: Option[] = [
  { label: "On-Site", value: "On-Site" },
  { label: "Remote", value: "Remote" },
  { label: "Hybrid", value: "Hybrid" },
];
export const secureStorageWrapper: StateStorage = {
  getItem: (key) => {
    const value = secureLocalStorage.getItem(key);
    if (typeof value === "string") return value;
    if (value === null) return null;
    return JSON.stringify(value); // Convert non-string values to string
  },
  setItem: (key, value) => {
    secureLocalStorage.setItem(key, value);
  },
  removeItem: (key) => {
    secureLocalStorage.removeItem(key);
  },
};

export const currencyAbbreviationToSymbol: Record<string, string> = {
  USD: "$", // US Dollar
  EUR: "€", // Euro
  GBP: "£", // British Pound
  JPY: "¥", // Japanese Yen
  CAD: "$", // Canadian Dollar
  AUD: "$", // Australian Dollar
  BRL: "R$", // Brazilian Real
  CHF: "CHF", // Swiss Franc
  CNY: "¥", // Chinese Yuan
  DKK: "kr", // Danish Krone
  HKD: "$", // Hong Kong Dollar
  HUF: "Ft", // Hungarian Forint
  IDR: "Rp", // Indonesian Rupiah
  ILS: "₪", // Israeli Shekel
  INR: "₹", // Indian Rupee
  KRW: "₩", // South Korean Won
  MXN: "$", // Mexican Peso
  MYR: "RM", // Malaysian Ringgit
  NOK: "kr", // Norwegian Krone
  NZD: "$", // New Zealand Dollar
  PHP: "₱", // Philippine Peso
  PLN: "zł", // Polish Zloty
  RON: "RON", // Romanian Leu
  RUB: "₽", // Russian Ruble
  SEK: "kr", // Swedish Krona
  SGD: "$", // Singapore Dollar
  THB: "฿", // Thai Baht
  TRY: "₺", // Turkish Lira
  NGN: "₦", // Nigerian Naira
};

export const AVATAR_API_URL =
  import.meta.env.VITE_API_AVATAR ||
  "https://api.dicebear.com/9.x/avataaars/svg?seed=";

export const CompanySizes: Option[] = [
  { value: "small", label: "1-10 Employees" },
  { value: "medium", label: "11-50 Employees" },
  { value: "large", label: "51-200 Employees" },
  { value: "enterprise", label: "201+ Employees" },
];

export const storage =
  NODE_ENV === "production" ? secureLocalStorage : localStorage;

export const InterviewNatures: Option[] = [
  { label: "Technical Interview", value: "technical-interview" },
  { label: "Behavioral Interview", value: "behavioral-interview" },
  { label: "HR Interview", value: "hr-interview" },
  { label: "Screening Interview", value: "screening-interview" },
  { label: "Phone Interview", value: "phone-interview" },
  { label: "Virtual Interview", value: "virtual-interview" },
  { label: "In-person Interview", value: "in-person-interview" },
  { label: "Panel Interview", value: "panel-interview" },
  { label: "Case Interview", value: "case-interview" },
  { label: "Group Interview", value: "group-interview" },
  { label: "Coding Challenge", value: "coding-challenge" },
  { label: "Whiteboard Interview", value: "whiteboard-interview" },
  { label: "Portfolio Review", value: "portfolio-review" },
  { label: "Design Assessment", value: "design-assessment" },
  { label: "Technical Screening", value: "technical-screening" },
  { label: "Cultural Fit Interview", value: "cultural-fit-interview" },
  { label: "Management Round", value: "management-round" },
  { label: "Executive Interview", value: "executive-interview" },
  { label: "Final Interview", value: "final-interview" },
  { label: "Assessment Center", value: "assessment-center" },

  // Additional 10
  { label: "Remote Coding Interview", value: "remote-coding-interview" },
  { label: "One-on-One Interview", value: "one-on-one-interview" },
  { label: "Walk-in Interview", value: "walk-in-interview" },
  { label: "Second Round Interview", value: "second-round-interview" },
  { label: "Third Round Interview", value: "third-round-interview" },
  { label: "Onsite Interview", value: "onsite-interview" },
  { label: "Technical Deep Dive", value: "technical-deep-dive" },
  { label: "Role-play Interview", value: "role-play-interview" },
  { label: "Peer Interview", value: "peer-interview" },
  { label: "Coding Pairing Session", value: "coding-pairing-session" },
];
export const DEFAULT_MIN = 0;
export const DEFAULT_MAX = 0;
export const employmentTypeMap: Record<string, EmploymentType> = {
  Onsite: EmploymentType.ONSITE,
  Hybrid: EmploymentType.HYBRID,
  Remote: EmploymentType.REMOTE,
};
export const employmentTypeOptions: Record<EmploymentType, string> = {
  [EmploymentType.FULL_TIME]: "Full Time",
  [EmploymentType.PART_TIME]: "Part Time",
  [EmploymentType.CONTRACT]: "Contract",
  [EmploymentType.FREELANCE]: "Freelance",
  [EmploymentType.REMOTE]: "Remote",
  [EmploymentType.INTERNSHIP]: "Internship",
  [EmploymentType.TEMPORARY]: "Temporary",
  [EmploymentType.VOLUNTEER]: "Volunteer",
  [EmploymentType.SEASONAL]: "Seasonal",
  [EmploymentType.PER_DIEM]: "Per Diem",
  [EmploymentType.CONSULTANT]: "Consultant",
  [EmploymentType.APPRENTICESHIP]: "Apprenticeship",
  [EmploymentType.ONSITE]: "Onsite",
  [EmploymentType.HYBRID]: "Hybrid",
};

export const notificationIconMap: Record<EventType, IconType> = {
  // Job Events
  [EventType.JOB_CREATED]: FaBriefcase,
  [EventType.JOB_UPDATED]: FaEdit,
  [EventType.NEW_JOB_POSTED]: FaBriefcase,
  [EventType.NEW_JOB_UPDATED]: FaEdit,

  // Application Events
  [EventType.JOB_APPLICATION_SUBMITTED]: FaPaperPlane,
  [EventType.JOB_APPLICATION_UPDATED]: FaEdit,
  [EventType.JOB_APPLICATION_STATUS_CHANGED]: FaSyncAlt,
  [EventType.APPLICATION_REVIEWED]: FaBell,
  [EventType.APPLICATION_SHORTLISTED]: FaUserCheck,
  [EventType.APPLICATION_ACCEPTED]: FaCheck,
  [EventType.APPLICATION_REJECTED]: FaTimes,
  [EventType.APPLICATION_STATUS_CHANGED]: FaSyncAlt,

  // Messaging Events
  [EventType.MESSAGE_RECEIVED]: FaCommentDots,

  // Account/User Events
  [EventType.ACCOUNT_ACTIVATION]: FaEnvelope,
  [EventType.PASSWORD_CHANGED]: FaLock,
  [EventType.PASSWORD_RESET]: FaUndo,
  [EventType.USER_STATUS_CHANGED]: FaUserClock,
  [EventType.LOGIN_FROM_NEW_DEVICE]: FaMobileAlt,
  [EventType.LOGIN]: FaSignInAlt,

  // Social/Network Events
  [EventType.CONNECTION_REQUEST]: FaLink,
  [EventType.CONNECTION_ACCEPTED]: FaUserFriends,
  [EventType.PROFILE_VIEWED]: FaUserTie,
  [EventType.NEW_ENDORSEMENT]: FaThumbsUp,
  [EventType.NETWORK_ANNOUNCEMENT]: FaBullhorn,

  // Rating & Referral Events
  [EventType.RATING_RECEIVED]: FaStar,
  [EventType.REFERRAL_RECEIVED]: FaUserFriends,

  // Interview & Resume Events
  [EventType.INTERVIEW_INVITE]: FaCalendarCheck,
  [EventType.INTERVIEW_CREATED]: FaCalendarCheck,
  [EventType.RESUME_DOWNLOADED]: FaFileAlt,

  // Recommendation
  [EventType.JOB_RECOMMENDATION]: FaStar,

  // System/Marketing Events
  [EventType.SYSTEM_ALERT]: FaExclamationTriangle,
  [EventType.MARKETING_PROMOTION]: FaBullhorn,

  // Saved Job Events
  [EventType.SAVED_JOB_EXPIRED]: FaClock,
  [EventType.SAVED_JOB_CLOSED]: FaBan,
  [EventType.SAVED_JOB_UPDATED]: FaEdit,

  // Auto Apply Events
  [EventType.AUTO_APPLY_MATCHED]: FaCheck,
  [EventType.AUTO_APPLY_FAILED]: FaExclamationCircle,

  // Subscription Events
  [EventType.SUBSCRIPTION_EXPIRED]: FaClock,
  [EventType.SUBSCRIPTION_DUE]: FaInfoCircle,
  [EventType.SUBSCRIPTION_SUCCESS]: FaCreditCard,
  [EventType.SUBSCRIPTION_SUCCESSFUL]: FaCreditCard,
  [EventType.SUBSCRIPTION_CANCELLED]: FaMoneyBillWave,
};

export const eventTypeColorMap: Record<EventType, string> = {
  // Job Events
  [EventType.JOB_CREATED]: "#2D9CDB", // blue
  [EventType.JOB_UPDATED]: "#27AE60", // green
  [EventType.NEW_JOB_POSTED]: "#2D9CDB",
  [EventType.NEW_JOB_UPDATED]: "#27AE60",

  // Application Events
  [EventType.JOB_APPLICATION_SUBMITTED]: "#6C5CE7", // purple
  [EventType.JOB_APPLICATION_UPDATED]: "#0984E3",
  [EventType.JOB_APPLICATION_STATUS_CHANGED]: "#00B894",
  [EventType.APPLICATION_REVIEWED]: "#F39C12", // orange
  [EventType.APPLICATION_SHORTLISTED]: "#2980B9",
  [EventType.APPLICATION_ACCEPTED]: "#2ECC71",
  [EventType.APPLICATION_REJECTED]: "#E74C3C",
  [EventType.APPLICATION_STATUS_CHANGED]: "#00CEC9",

  // Messaging Events
  [EventType.MESSAGE_RECEIVED]: "#74B9FF",

  // Account/User Events
  [EventType.ACCOUNT_ACTIVATION]: "#8E44AD",
  [EventType.PASSWORD_CHANGED]: "#2C3E50",
  [EventType.PASSWORD_RESET]: "#1ABC9C",
  [EventType.USER_STATUS_CHANGED]: "#16A085",
  [EventType.LOGIN_FROM_NEW_DEVICE]: "#E67E22",
  [EventType.LOGIN]: "#34495E",

  // Social/Network Events
  [EventType.CONNECTION_REQUEST]: "#0984E3",
  [EventType.CONNECTION_ACCEPTED]: "#00B894",
  [EventType.PROFILE_VIEWED]: "#D63031",
  [EventType.NEW_ENDORSEMENT]: "#FDCB6E",
  [EventType.NETWORK_ANNOUNCEMENT]: "#6C5CE7",

  // Rating & Referral Events
  [EventType.RATING_RECEIVED]: "#F1C40F",
  [EventType.REFERRAL_RECEIVED]: "#00BFA6",

  // Interview & Resume Events
  [EventType.INTERVIEW_INVITE]: "#FF7675",
  [EventType.INTERVIEW_CREATED]: "#FF7675",
  [EventType.RESUME_DOWNLOADED]: "#0984E3",

  // Recommendation
  [EventType.JOB_RECOMMENDATION]: "#FAB1A0",

  // System/Marketing Events
  [EventType.SYSTEM_ALERT]: "#E84393",
  [EventType.MARKETING_PROMOTION]: "#00CEC9",

  // Saved Job Events
  [EventType.SAVED_JOB_EXPIRED]: "#B2BEC3",
  [EventType.SAVED_JOB_CLOSED]: "#636E72",
  [EventType.SAVED_JOB_UPDATED]: "#00A8FF",

  // Auto Apply Events
  [EventType.AUTO_APPLY_MATCHED]: "#55EFC4",
  [EventType.AUTO_APPLY_FAILED]: "#D63031",

  // Subscription Events
  [EventType.SUBSCRIPTION_EXPIRED]: "#E17055",
  [EventType.SUBSCRIPTION_DUE]: "#FDCB6E",
  [EventType.SUBSCRIPTION_SUCCESS]: "#00B894",
  [EventType.SUBSCRIPTION_SUCCESSFUL]: "#00B894",
  [EventType.SUBSCRIPTION_CANCELLED]: "#D63031",
};

export const getTypeColor = (type: InterviewType) => {
  const colors = {
    "virtual-meeting": "bg-blue-100 text-blue-600",
    "phone-call": "bg-green-100 text-green-600",
    "in-person": "bg-purple-100 text-purple-600",
    "group-interview": "bg-orange-100 text-orange-600",
    assessment: "bg-red-100 text-red-600",
    hybrid: "bg-indigo-100 text-indigo-600",
  };
  return colors[type] || "bg-gray-100 text-gray-600";
};
export const getStatusColor = (status: InterviewStatus) => {
  const colors = {
    scheduled: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    rescheduled: "bg-orange-100 text-orange-800",
    "no-show": "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};
