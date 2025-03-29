import {Option} from "./types";
import {StateStorage} from "zustand/middleware";
import secureLocalStorage from "react-secure-storage";

export const emojiList = [
    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '🥰', '😘', '😗', '😙', '😚',
    '🙂', '🙃', '🫣', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '😳', '🤐', '😌', '😴',
    '🥱', '😪', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😵', '😵‍💫', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😜', '😝',
    '😛', '🤑', '🤤', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '💀', '☠️',
    '👽', '👾', '🤖', '🦾', '🦿', '💪', '🦵', '🦶', '🦴', '🦦', '🦈', '🐅', '🐆', '🐘', '🦏', '🦓', '🦒', '🐍', '🐊',
    '🦕', '🐢', '🦎', '🦑', '🐙', '🐠', '🐡', '🐟', '🦈', '🐬', '🐳', '🐋', '🦦', '🦧', '🐆', '🐅', '🐒', '🦧', '🐆',
    '🦓', '🦒', '🦴', '🦦', '🦈', '🐆', '🐅', '🦓', '🦦', '🦇', '🦀', '🦋', '🦦', '🦈', '🦮', '🦻', '🦼', '🦶'
];
export const DEFAULT_PAGE = 0;
export const PER_PAGE = 20;

export const VITE_API_FILE_SERVICE = import.meta.env.VITE_API_FILE_SERVICE || 'http://localhost:3008';
export const SUBSCRIPTION_SERVICE_HOST = import.meta.env.VITE_API_SUBSCRIPTION_SERVICE || 'http://localhost:3007'
export const NODE_ENV = import.meta.env.NODE_ENV || 'development';
export const applicantNavBarItemMap = new Map<string, string>([]);
applicantNavBarItemMap.set("Dashboard", "/applicant/dashboard");
applicantNavBarItemMap.set("Find Jobs", "/applicant/find-jobs");
applicantNavBarItemMap.set("Applications", "/applicant/my-applications");
applicantNavBarItemMap.set("My Networks", "/applicant/network");
applicantNavBarItemMap.set("Profile", "/applicant/profile");
applicantNavBarItemMap.set("Settings", "/settings");
applicantNavBarItemMap.set("Help & Support", "/help-support");
applicantNavBarItemMap.set("Logout", "/logout");

export const employerNavBarItemMap = new Map<string, string>([]);
employerNavBarItemMap.set("Dashboard", "/employer/dashboard");
employerNavBarItemMap.set("Manage Applicants", "/employer/manage-applicants");
employerNavBarItemMap.set("My Networks", "/employer/network");
employerNavBarItemMap.set("Profile", "/employer/profile");
employerNavBarItemMap.set("Settings", "/settings");
employerNavBarItemMap.set("Job List", "/employer/manage-jobs");
employerNavBarItemMap.set("My Schedules", "/employer/my-schedules");
employerNavBarItemMap.set("Help & Support", "/help-support");
employerNavBarItemMap.set("Logout", "/logout");

export const applicantNavItems = ["Dashboard", "Find Jobs", "Applications", "My Networks"];
export const applicantNavItemsMobile = ["Dashboard", "Find Jobs", "Applications", "My Networks", "Profile", "Settings", "Help & Support"];


export const employerNavItems = ["Dashboard", "Manage Applicants", "My Networks", "Job List", "My Schedules"];
export const employerNavItemsMobile = ["Dashboard", "Manage Applicants", "My Networks", "Profile", "Settings", "Help & Support"];

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5173";
export const jobLocation: Option[] = [
    {label: "On-Site", value: "On-Site"},
    {label: "Remote", value: "Remote"},
    {label: "Hybrid", value: "Hybrid"},
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
    USD: "$",     // US Dollar
    EUR: "€",     // Euro
    GBP: "£",     // British Pound
    JPY: "¥",     // Japanese Yen
    CAD: "$",     // Canadian Dollar
    AUD: "$",     // Australian Dollar
    BRL: "R$",    // Brazilian Real
    CHF: "CHF",   // Swiss Franc
    CNY: "¥",     // Chinese Yuan
    DKK: "kr",    // Danish Krone
    HKD: "$",     // Hong Kong Dollar
    HUF: "Ft",    // Hungarian Forint
    IDR: "Rp",    // Indonesian Rupiah
    ILS: "₪",     // Israeli Shekel
    INR: "₹",     // Indian Rupee
    KRW: "₩",     // South Korean Won
    MXN: "$",     // Mexican Peso
    MYR: "RM",    // Malaysian Ringgit
    NOK: "kr",    // Norwegian Krone
    NZD: "$",     // New Zealand Dollar
    PHP: "₱",     // Philippine Peso
    PLN: "zł",    // Polish Zloty
    RON: "RON",   // Romanian Leu
    RUB: "₽",     // Russian Ruble
    SEK: "kr",    // Swedish Krona
    SGD: "$",     // Singapore Dollar
    THB: "฿",     // Thai Baht
    TRY: "₺",     // Turkish Lira
    NGN: "₦"      // Nigerian Naira
};

