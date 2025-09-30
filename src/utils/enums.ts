export enum UserType {
  EMPLOYER = "employer",
  APPLICANT = "applicant",
}

export enum Action {
  FILE_UPLOAD = "file_upload",
  PROFILE_PICTURE_UPDATE = "profile_picture_update",
  DELETE_PROFILE_FILE = "delete_profile_file",
  DELETING_A_FILE = "deleting_a_file",
  UPLOAD_CV = "upload_cv",
  UPLOAD_RESUME = "upload_resume",
  UPLOAD_COVER_LETTER = "upload_cover_letter",
  UPLOAD_OTHER = "upload_other",
  UPLOAD_EMPLOYMENT_STATEMENT = "upload_employment_statement",
  UPLOAD_REFERENCE_LIST = "upload_reference_list",
  UPLOAD_EMPLOYMENT_CERTIFICATE = "upload_employment_certificate",
  UPLOAD_EDUCATION_CERTIFICATE = "upload_education_certificate",
  UPLOAD_EMPLOYMENT_RECERTIFICATION = "upload_employment_recertification",
  UPLOAD_OTHER_DOCUMENTS = "upload_other_documents",
  UPLOAD_EMPLOYER_LOGO = "upload_employer_logo",
  UPLOAD_EMPLOYER_WEBSITE_LOGO = "upload_employer_website_logo",
  UPLOAD_COVER_PAGE_AND_COMPANY_LOGO = "upload_cover_page_and_company_logo",
  UPLOAD_COVER_PAGE = "upload_cover_page",
  UPLOAD_COMPANY_LOGO = "upload_company_logo",
}

export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  BLOCKED = 'Blocked',
  DELETED = 'Deleted',
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  UNVERIFIED = 'Unverified',
  SUSPENDED = 'Suspended',
  DEACTIVATED = 'Deactivated',
  ARCHIVED = 'Archived',
  BANNED = 'Banned',
  RESTRICTED = 'Restricted',
  PENDING_VERIFICATION = 'Pending Verification',
  PENDING_APPROVAL = 'Pending Approval',
  APPROVED = 'Approved',
}

export enum SubscriptionType {
  PROFESSIONAL = "Professional",
  ENTERPRISE = "Enterprise",
}

export enum BillingCycle {
  FREE = "Free",
  MONTHLY = "Monthly",
  QUARTERLY = "Quarterly",
  ANNUALLY = "Annually",
}

export const SubscriptionPlans: Record<
  SubscriptionType,
  Record<BillingCycle, string>
> = {
  [SubscriptionType.PROFESSIONAL]: {
    [BillingCycle.FREE]: "Lite",
    [BillingCycle.MONTHLY]: "Plus",
    [BillingCycle.QUARTERLY]: "Premium",
    [BillingCycle.ANNUALLY]: "Ultimate",
  },
  [SubscriptionType.ENTERPRISE]: {
    [BillingCycle.FREE]: "Basic",
    [BillingCycle.MONTHLY]: "Advanced",
    [BillingCycle.QUARTERLY]: "Pro",
    [BillingCycle.ANNUALLY]: "Elite",
  },
};

export enum ConnectionStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
  BLOCKED = "Blocked",
  UNBLOCKED = "Unblocked",
  CANCELED = "Canceled",
  UNFOLLOWED = "Unfollowed",
  FOLLOWED = "Followed",
}

export enum ConnectionType {
  FRIENDS = "Friends",
  FOLLOWING = "Following",
}

export enum InterviewType {
  IN_PERSON = "in-person",
  VIRTUAL_MEETING = "virtual-meeting",
  HYBRID = "hybrid",
  PHONE_CALL = "phone-call",
  ASSESSMENT = "assessment",
  GROUP_INTERVIEW = "group-interview",
}
export enum ScreeningQuestionType {
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
  YES_NO = 'yes_no',
  OPTIONS = 'options',
  DROPDOWN = 'dropdown',
}

export enum InterviewStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  RESCHEDULED = "rescheduled",
  NO_SHOW = "no-show",
}

export enum RateeType {
  JOB = "JOB",
  USER = "USER",
}

export enum Priority{
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum ApplicationStatus {
  VIEWED = "Viewed",
  PENDING = "Pending",
  HIRED = "Hired",
  INTERVIEWED = "Interview scheduled",
  REJECTED = "Rejected",
  SHORTLISTED = "Shortlisted",
  WITHDRAWN = "Withdrawn",
  ACCEPTED="Accepted",
  OFFER_ACCEPTED="Offer Accepted",
  OFFER_DECLINED="Offer Declined",
  OFFER_EXTENDED="Offer Extended",
  ALL="All",
}

export enum EmploymentType {
  FULL_TIME = "Full Time",
  PART_TIME = "Part Time",
  CONTRACT = "Contract",
  FREELANCE = "Freelance",
  REMOTE = "Remote",
  INTERNSHIP = "Internship",
  TEMPORARY = "Temporary",
  VOLUNTEER = "Volunteer",
  SEASONAL = "Seasonal",
  PER_DIEM = "Per Diem",
  CONSULTANT = "Consultant",
  APPRENTICESHIP = "Apprenticeship",
  ONSITE = "Onsite",
  HYBRID = "Hybrid",
}
