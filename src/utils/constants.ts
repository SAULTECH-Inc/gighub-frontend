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

export const VITE_API_FILE_SERVICE = import.meta.env.VITE_API_FILE_SERVICE || 'http://localhost:5173';
export const applicantNavBarItemMap = new Map<string, string>([]);
applicantNavBarItemMap.set("Dashboard", "/applicant/dashboard");
applicantNavBarItemMap.set("Find Jobs", "/applicant/find-jobs");
applicantNavBarItemMap.set("Applications", "/applicant/my-applications");
applicantNavBarItemMap.set("My Networks", "/my-networks");
applicantNavBarItemMap.set("Profile", "/applicant/dashboard/profile");
applicantNavBarItemMap.set("Settings", "/applicant/dashboard/settings");
applicantNavBarItemMap.set("Help & Support", "/help-support");
applicantNavBarItemMap.set("Logout", "/logout");

export const employerNavBarItemMap = new Map<string, string>([]);
employerNavBarItemMap.set("Dashboard", "/employer/dashboard");
employerNavBarItemMap.set("Manage Applicants", "/employer/manage-applicants");
employerNavBarItemMap.set("My Networks", "/my-networks");
employerNavBarItemMap.set("Profile", "/employer/dashboard/profile");
employerNavBarItemMap.set("Settings", "/employer/dashboard/settings");
employerNavBarItemMap.set("Job List", "/employer/job-list");
employerNavBarItemMap.set("My Schedules", "/employer/my-schedules");
employerNavBarItemMap.set("Help & Support", "/help-support");
employerNavBarItemMap.set("Logout", "/logout");

export const applicantNavItems = ["Dashboard", "Find Jobs", "Applications", "My Networks"];
export const applicantNavItemsMobile = ["Dashboard", "Find Jobs", "Applications", "My Networks", "Profile", "Settings", "Help & Support"];


export const employerNavItems = ["Dashboard", "Manage Applicants", "My Networks", "Job List", "My Schedules"];
export const employerNavItemsMobile = ["Dashboard", "Manage Applicants", "My Networks", "Profile", "Settings", "Help & Support"];
