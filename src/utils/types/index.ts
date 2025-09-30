import React, { ButtonHTMLAttributes, ChangeEvent } from "react";
import {
  Action,
  ApplicationStatus,
  ConnectionStatus,
  ConnectionType, EmploymentType,
  InterviewStatus,
  InterviewType,
  Priority,
  RateeType, ScreeningQuestionType,
  UserStatus,
  UserType
} from "../enums.ts";
import { UserChatStatus } from "../../chat-module/types";

export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  token: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  success: boolean;
};

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  success: false,
};

export interface APIResponse<D> {
  meta?: {
    total: number;
    limit: number;
    totalPages: number;
    page: number;
  } | null;
  data: D;
  message?: string;
  path?: string;
  error?: string;
  statusCode: number;
}

export interface TextInputProps {
  label?: string;
  value: string;
  placeholder?: string;
  name?: string;
  type?: React.HTMLInputTypeAttribute; // "text" | "email" | "password" etc.
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export interface TextAreaProps {
  label?: string;
  value: string;
  placeholder?: string;
  name?: string;
  rows?: number;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  className?: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  options: Option[];
  value: string;
  name?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  className?: string;
}

export interface DatePickerProps {
  label?: string;
  value: string;
  name?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  min?: string;
  requiredAsterisk?: boolean;
  placeholder?: string;
  errorMessage?: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "primary" | "secondary" | "danger";
}

export interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
  color?: string; // e.g. "bg-blue-600" or "bg-green-500"
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface EmployerData {
  lastUpdated: any;
  isRemote: any;
  salaryRange: any;
  reviewCount: any;
  foundedYear: any;
  isHiring: any;
  isTrending: any;
  openPositions : number;
  rating: any;
  companyName: string;
  companyDescription: string;
  email: string;
  companyWebsite: string;
  companySize: string;
  country: string;
  city: string;
  isVerified: boolean;
  isActive: boolean;
  isBlocked: boolean;
  role: Role;
  userType: UserType | null;
  token: string | null;
  companyPhone: string | null;
  companyAddress: string | null;
  industry: string | null;
  numberOfEmployees: number | null;
  companyLogo: string | null;
  coverPage: string | null;
  aboutCompany: string | null;
  companyRegistrationNumber: string | null;
  governmentIdentificationNumber: string | null;
  taxIdentificationNumber: string | null;
  brandAndVisuals?: string[] | null;
  facebookProfile: string | null;
  linkedInProfile: string | null;
  twitterProfile: string | null;
  instagramProfile: string | null;
  youtubeProfile: string | null;
  githubProfile: string | null;
  managerRole: string | null;
  managerEmail: string | null;
  managerPhoneNumber: string | null;
  id: number | null;
  createdBy: string;
  updatedBy: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  registrationNumber?: string;
  isFollowed?: boolean;
  noMutualConnections?: number;
}

export interface ApplicantPersonalInfo {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  dateOfBirth?: string | null;
  address?: string;
}
export interface ApplicantData {
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  email: string | null;
  phoneNumber: string | null;
  country: string | null;
  city: string | null;
  dateOfBirth: string | null;
  address: string | null;
  professionalTitle: string | null;
  isVerified: boolean;
  isActive: boolean;
  isBlocked: boolean;
  role: Partial<Role>;
  userType: UserType | null;
  cv: CvResponseDto;
  rating: number;
  token: string | null;
  status: UserStatus | null;
  profilePicture: string | null;
  coverLetterLink: string | null;
  governmentIdentificationNumber: string | null;
  facebookProfile: string | null;
  linkedInProfile: string | null;
  twitterProfile: string | null;
  instagramProfile: string | null;
  youtubeProfile: string | null;
  githubProfile: string | null;
  id: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactResponseDto {
  email: string;
  phone: string;
  website: string;
}

export interface AddressResponseDto {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EducationResponseDto {
  id?: number;
  institution?: string;
  degree?: string;
  country?: string;
  city?: string;
  startDate?: Date;
  endDate?: Date;
  fieldOfStudy?: string;
  grade?: string;
  description?: string;
}

export interface AddEducationRequestDto {
  education: EducationResponseDto;
  applicantId: number;
  cvId: number;
}

export interface ExperienceRequestDto {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}
export interface ExperienceResponseDto {
  id?: number;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  location?: string;
  city?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SkillsResponseDto {
  id?: number;
  skill: string;
  level?: string;
  description?: string;
  yearsOfExperience?: string;
  proficiency?: string;
}

export interface LanguageResponseDto {
  language: string;
  level: string;
  proficiency: string;
}

export interface CertificationResponseDto {
  id?: number;
  certification?: string;
  institution?: string;
  dateObtained?: string;
  description?: string;
  proficiency?: string;
}

export interface AwardResponseDto {
  title: string;

  recipient: string;

  date: Date;

  description: string;
}

export interface ReferenceResponseDto {
  name: string;

  title: string;

  company: string;

  email: string;

  phone: string;

  relationship: string;

  address: string;
}

export interface TestimonialResponseDto {
  content: string;
  author: string;
  jobTitle: string;
}

export interface SocialsResponseDto {
  platform: string;
  link: string;
}

export interface CvResponseDto {
  id: number;
  professionalTitle: string | null;
  professionalSummary: string | null;
  headline: string | null;
  cvLink: string | null;
  coverLetterLink: string | null;
  videoCv: string | null;
  portfolioLink: string[] | null;
  applicantNotes: string | null;
  applicationMode: CVType | null;
  contact: Partial<ContactResponseDto> | null;
  addresses: Partial<AddressResponseDto>[] | null;
  socials: Partial<SocialsResponseDto>[] | null;
  educations: Partial<EducationResponseDto>[] | null;
  experiences: Partial<ExperienceResponseDto>[] | null;
  skills: Partial<SkillsResponseDto>[];
  languages: Partial<LanguageResponseDto>[] | null;
  certifications: CertificationResponseDto[] | null;
  awards: Partial<AwardResponseDto>[] | null;
  references: Partial<ReferenceResponseDto>[] | null;
  testimonials: Partial<TestimonialResponseDto>[] | null;
  yearsOfExperience: string;
}

export enum CVType {
  UPLOADED = "uploaded",
  LINKED = "linked",
  EXTERNAL = "external",
  OTHER = "other",
  FILLED_FORM = "filled form",
}

export const institutions: Option[] = [
  { label: "Stanford University", value: "Stanford" },
  { label: "Harvard University", value: "Harvard" },
  { label: "MIT", value: "MIT" },
  { label: "UCLA", value: "UCLA" },
  { label: "Berkeley", value: "Berkeley" },
  { label: "Princeton University", value: "Princeton" },
  { label: "UCI", value: "UCI" },
  { label: "Yale University", value: "Yale" },
  { label: "Columbia University", value: "Columbia" },
  { label: "Dartmouth College", value: "Dartmouth" },
  { label: "Cornell University", value: "Cornell" },
  { label: "Oxford University", value: "Oxford" },
];

export const fieldsOfStudies: Option[] = [
  { label: "Computer Science", value: "Computer Science" },
  { label: "Business Administration", value: "Business Administration" },
  { label: "Engineering", value: "Engineering" },
  { label: "Humanities", value: "Humanities" },
  { label: "Psychology", value: "Psychology" },
  { label: "Marketing", value: "Marketing" },
];
export const classOfDegrees: Option[] = [
  { label: "B.ENG", value: "B.ENG" },
  { label: "B.SC", value: "B.SC" },
  { label: "B.A.", value: "B.A." },
  { label: "B.COM", value: "B.COM" },
  { label: "M.ENG", value: "M.ENG" },
  { label: "M.SC", value: "M.SC" },
  { label: "M.A.", value: "M.A." },
  { label: "M.COM", value: "M.COM" },
  { label: "Ph.D.", value: "Ph.D." },
  { label: "Other", value: "Other" },
];

export interface Location {
  country: string;
  city: string;
}

export interface SalaryRange {
  currency: string;
  minAmount: number;
  maxAmount: number;
  frequency: string;
}

export interface JobPreferenceRequest {
  id?: number; // Optional for creating a new preference
  roles?: string[];
  jobTypes?: string[];
  locations?: Location[];
  salaryRange?: SalaryRange[];
  applicantId: number;
}

export interface JobPreferenceResponse {
  id: number;
  roles: string[] | [];
  jobTypes: string[] | [];
  locations: Location[] | [];
  salaryRange: SalaryRange[] | [];
}

export interface Location {
  country: string;
  city: string;
}

export interface JobPreference {
  roles?: string[];
  jobTypes?: string[];
  locations?: Location[];
  salaryRange?: SalaryRange[];
  applicantId?: number;
}

export interface FileUploadResponse {
  url?: string;
  userId?: number;
  userType?: string;
}

export interface FileUploadRequest {
  file?: File | string;
  fileUrl?: string;
  userId: number;
  userType: string;
  action: Action;
  whatIsTheItem: string;
}

export interface PasswordResetRequest {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface ApplicantSignupRequest {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  address: string;
  resume: File | null;
  coverLetterLink: File | null;
  portfolio: File | null;
  videoCv: File | null;
  documentType: string;
}

export interface EmployerSignupRequest {
  companyName: string;
  companyDescription: string;
  companyWebsite: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyPhone: string;
  coverPage: File | null;
  companyLogo: File | null;
}

export interface JobApplicationDetails {
  id: number;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  jobLocation: string;
  jobType: string;
  jobSalary: SalaryRange;
  jobRoles: string[];
  jobSkills: string[];
  jobReferences: string[];
  jobCompanyDescription: string;
  jobCompanySize: string;
  jobCompanyType: string;
  jobCompanyFounded: string;
  jobCompanyIndustry: string;
  jobCompanyWebsite: string;
}

export interface ProfessionalSummaryData {
  professionalTitle?: string;
  professionalSummary?: string;
}

export interface CompanyInfos {
  companyName: string;
  country: string;
  companySize: string;
  industry: string;
  city: string;
  companyAddress: string;
}

export interface VerificationDetails{
  companyRegistrationNumber?: string | null;
  governmentIdentificationNumber?: string | null;
  taxIdentificationNumber?: string | null;
}

export interface ContactInfo {
  managerEmail: string;
  managerPhoneNumber: string;
  companyPhone: string;
  email: string;
}

export interface BrandAndVisuals {
  files: string[];
}

export interface AboutCompany {
  companyDescription: string;
}

export interface Socials {
  facebookProfile?: string | null;
  twitterProfile?: string | null;
  linkedInProfile?: string | null;
  instagramProfile?: string | null;
  githubProfile?: string | null;
}

export interface ComplianceAndVerifications {
  taxIdentificationNumber: string;
  registrationNumber: string;
}

export interface NetworkDetails {
  id: number;
  userType: UserType;
  applicant?: ApplicantData;
  employer?: EmployerData;
  connectionStatus?: ConnectionStatus;
  connectionType?: ConnectionType;
  mutualFriends?: number;
}

export enum JobType {
  FULL_TIME = "Full Time",
  PART_TIME = "Part Time",
  CONTRACT = "Contract",
  FREELANCE = "Freelance",
  INTERNSHIP = "Internship",
  APPRENTICESHIP = "Apprenticeship",
  CONSULTANT = "Consultant",
  TEMPORARY = "Temporary",
  VOLUNTEER = "Volunteer",
}

export enum JobStatus {
  NEW = "New",
  POSTED = "Posted",
  EXPIRED = "Expired",
  CLOSED = "Closed",
  RECRUITING = "Recruiting",
  PAUSED = "Paused",
  VIEWING = "Viewing",
  SHORTLISTING = "ShortListing",
  WITHDRAWN = "Withdrawn",
  DRAFT = "Draft",
  DELETED="Deleted",
  ALL="All",
}

export enum JobLevel {
  BEGINNER = "Beginner",
  JUNIOR = "Junior",
  INTERMEDIATE = "Intermediate",
  MID = "Mid",
  SENIOR = "Senior",
  LEAD = "Lead",
  MANAGER = "Manager",
  EXECUTIVE = "Execute",
}

export const jobLevels: Option[] = [
  { label: "Beginner", value: "Beginner" },
  { label: "Junior", value: "Junior" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Mid", value: "Mid" },
  { label: "Senior", value: "Senior" },
  { label: "Lead", value: "Lead" },
  { label: "Manager", value: "Manager" },
  { label: "Executive", value: "Executive" },
];

export interface SalaryRangeDto {
  currency: string;
  frequency: string;
  minimumAmount: number;
  maximumAmount: number;
}

export interface ScreeningQuestion {
  question: string;
  type: ScreeningQuestionType;
  required: boolean;
  options?: string[];
  jobId?: number;
}
export interface ScreeningAnswer {
  questionId: number;
  answerText?: string;
  answerBoolean?: boolean;
  answerOptions?: string[];
}


export interface JobPostResponse {
  recommendationScore: number;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  company: string;
  startDate: Date;
  endDate: Date;
  description: string;
  responsibility: string;
  department: string;
  jobType: JobType;
  employmentType: EmploymentType;
  jobStatus: JobStatus;
  level: JobLevel;
  salaryRange: SalaryRangeDto;
  experienceYears: number;
  skillSet: string[];
  location: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  preferredCandidateCountry: string[];
  preferredCandidatePreviousCompany: string[];
  preferredCandidateUniversity: string[];
  minAmount?: number;
  maxAmount?: number;
  applicantsCount?: number;
  employer: EmployerData;
  applicationMethod: ApplicationMethod;
  rating?: UserRatingResponse;
  requirements?: string;
  hiringManager?: string;
  isBookmarked?: boolean;
  screeningQuestions?: ScreeningQuestion[];
  applied?: boolean;
}

export interface FetchMyJobParam {
  page: number;
  limit: number;
  jobStatus?: string;
  employmentType?: string;
  jobType?: string;
  search?: string;
  title?: string;
  companyName?: string;
  location?: string;
  sortBy?: string,
  sortOrder?: string,
}

export interface BulkSearchParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  jobType: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
    frequency: string;
  };
  experienceLevel: string[];
  location: string;
}

export interface ApplicationMethod {
  byCv?: boolean;
  byVideo?: boolean;
  byPortfolio?: boolean;
  byProfile?: boolean;
  byCoverLetter?: boolean;
}

export interface ApplicationRequest {
  jobId: number;
  applicationMethod: ApplicationMethod;
}

export interface ApplicationResponse {
  id: number;
  status: ApplicationStatus;
  job: JobPostResponse;
  cv: CvResponseDto;
  applicant: ApplicantData;
  applicationMethod: ApplicationMethod;
  createdAt: Date;
  updatedAt: Date;
}

export interface SortBy {
  sortDirection: "asc" | "desc";
  orderBy?: string;
}

export interface InterviewScheduleDetails {
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  duration: number;
  interviewType: InterviewType;
  interviewPlatform: string;
  interviewLink?: string;
  status: InterviewStatus;
  interviewState?: string;
  interviewCity?: string;
  interviewAddress?: string;
  interviewerPhoneNumber1?: string;
  interviewerPhoneNumber2?: string;
  interviewerEmail1?: string;
  files?: string[];
  notes?: string;
  applicantId: number[];
  jobId: number;
  tags?: string[];
}

export interface InterviewScheduleDetailsResponse {
  id: number;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  duration: number;
  interviewType: InterviewType;
  interviewPlatform: string;
  interviewLink?: string;
  status: InterviewStatus;
  interviewState?: string;
  interviewCity?: string;
  interviewAddress?: string;
  interviewerPhoneNumber1?: string;
  interviewerPhoneNumber2?: string;
  interviewerEmail1?: string;
  files?: string[];
  notes?: string;
  applicants: ApplicantData[];
  job: JobPostResponse;
  interviewer: string;
  feedback: {
    comments: string;
    rating: number;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationMetrics {
  jobsApplied: number;
  shortlisted: number;
  pending: number;
  clicked: number;
  viewed: number;
  applied: number;
  withdrawn: number;
  interviewed: number;
  hired: number;
  rejected: number;
  remote: number;
  onsite: number;
  hybrid: number;
}

export interface TopHiringCompanyDto {
  employer: EmployerData;
  job: JobPostResponse;
}

export interface RatingResponseDTO {
  id: number;
  score: number;
  comment?: string;
  rateeId: number;
  rateeType: RateeType;
  ratedBy: ApplicantData | EmployerData;
}

export interface UserRatingResponse {
  averageScore: number;
  totalRatings: number;
  ratings?: RatingResponseDTO[];
}

export enum NotificationType {
  PASSWORD_CHANGE = "password_change",
}

export enum EventType {
  // Job Events
  JOB_CREATED = "job_created",
  JOB_UPDATED = "job_updated",
  NEW_JOB_POSTED = "new_job_posted",
  NEW_JOB_UPDATED = "new_job_updated",

  // Application Events
  JOB_APPLICATION_SUBMITTED = "job_application_submitted",
  JOB_APPLICATION_UPDATED = "job_application_updated",
  JOB_APPLICATION_STATUS_CHANGED = "job_application_status_changed",
  APPLICATION_REVIEWED = "application_reviewed",
  APPLICATION_SHORTLISTED = "application_shortlisted",
  APPLICATION_ACCEPTED = "application_accepted",
  APPLICATION_REJECTED = "application_rejected",
  APPLICATION_STATUS_CHANGED = "application_status_changed",

  // Messaging Events
  MESSAGE_RECEIVED = "message_received",

  // Account/User Events
  ACCOUNT_ACTIVATION = "account_activation",
  PASSWORD_CHANGED = "password_changed",
  USER_STATUS_CHANGED = "user_status_changed",

  // Social/Network Events
  CONNECTION_REQUEST = "connection_request",
  CONNECTION_ACCEPTED = "connection_accepted",
  PROFILE_VIEWED = "profile_viewed",
  NEW_ENDORSEMENT = "new_endorsement",
  NETWORK_ANNOUNCEMENT = "network_announcement",

  // Rating & Referral Events
  RATING_RECEIVED = "rating_received",
  REFERRAL_RECEIVED = "referral_received",

  // Interview & Resume Events
  INTERVIEW_INVITE = "interview_invite",
  RESUME_DOWNLOADED = "resume_downloaded",
  INTERVIEW_CREATED = "interview_created",

  // Recommendation
  JOB_RECOMMENDATION = "job_recommendation",

  // System/Marketing Events
  SYSTEM_ALERT = "system_alert",
  MARKETING_PROMOTION = "marketing_promotion",
  MAINTENANCE = "maintenance",

  SAVED_JOB_EXPIRED = "saved_job_expired",
  SAVED_JOB_CLOSED = "saved_job_closed",
  SAVED_JOB_UPDATED = "saved_job_updated",

  AUTO_APPLY_MATCHED = "auto_apply_matched",
  AUTO_APPLY_FAILED = "auto_apply_failed",

  SUBSCRIPTION_EXPIRED = "subscription_expired",
  SUBSCRIPTION_DUE = "subscription_due",
  SUBSCRIPTION_SUCCESS = "subscription_success",
  SUBSCRIPTION_SUCCESSFUL = "subscription_successful",
  SUBSCRIPTION_CANCELLED = "subscription_cancelled",
  PASSWORD_RESET = "password_reset",
  LOGIN_FROM_NEW_DEVICE = "login_from_new_device",
  LOGIN = "login",
}

export interface NotificationItem {
  id?: string;
  title: string;
  content: string;
  type: EventType;
  category?: NotificationType;
  status?: UserChatStatus;
  icon?: string;
  user?: string;
  read?: boolean;
  delivered?: boolean;
  viewed?: boolean;
  createdAt?: Date;
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

export interface SubscriptionResponse {
  id: string;
  type: SubscriptionType;
  billingCycle: BillingCycle;
  name: string;
  duration: number;
  price: number;
  currency: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  features: string[];           // ["Feature 1", "Feature 2", ...]
  originalPrice?: number;       // 2500 (for ₦2,500)
  savings?: string;            // "Save 25%" or null
  dailyLimit: string;          // "200" or "Unlimited"
  volume: string;              // "6,000" or "Unlimited"
}

export interface UserSubscriptionResponse {
  userId: number;
  subscriptionId: string;
  autoRenew: boolean;
  couponCode: string;
  subscription: SubscriptionResponse;
  isActive: boolean;
  expirationDate: string;
  lastRenewalDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportRequest {
  name: string;
  email: string;
  phoneNumber?: string;
  priority: Priority;
  message: string;
}

export interface Currency {
  symbol: string;
  name: string;
  code: string;
  region?: string;
} // Helper function to get currency by symbol
export const CURRENCIES: Currency[] = [
  // Major Global Currencies
  { symbol: "₦", name: "Nigerian Naira", code: "NGN", region: "Africa" },
  { symbol: "$", name: "US Dollar", code: "USD", region: "North America" },
  { symbol: "€", name: "Euro", code: "EUR", region: "Europe" },
  { symbol: "£", name: "British Pound", code: "GBP", region: "Europe" },
  { symbol: "¥", name: "Japanese Yen", code: "JPY", region: "Asia" },
  {
    symbol: "C$",
    name: "Canadian Dollar",
    code: "CAD",
    region: "North America"
  },
  { symbol: "A$", name: "Australian Dollar", code: "AUD", region: "Oceania" },

  // European Currencies
  { symbol: "CHF", name: "Swiss Franc", code: "CHF", region: "Europe" },
  { symbol: "kr", name: "Swedish Krona", code: "SEK", region: "Europe" },
  { symbol: "kr", name: "Norwegian Krone", code: "NOK", region: "Europe" },
  { symbol: "kr", name: "Danish Krone", code: "DKK", region: "Europe" },
  { symbol: "zł", name: "Polish Zloty", code: "PLN", region: "Europe" },
  { symbol: "₽", name: "Russian Ruble", code: "RUB", region: "Europe" },
  { symbol: "₴", name: "Ukrainian Hryvnia", code: "UAH", region: "Europe" },

  // Asian Currencies
  { symbol: "₹", name: "Indian Rupee", code: "INR", region: "Asia" },
  { symbol: "¥", name: "Chinese Yuan", code: "CNY", region: "Asia" },
  { symbol: "₩", name: "South Korean Won", code: "KRW", region: "Asia" },
  { symbol: "S$", name: "Singapore Dollar", code: "SGD", region: "Asia" },
  { symbol: "HK$", name: "Hong Kong Dollar", code: "HKD", region: "Asia" },
  { symbol: "₨", name: "Pakistani Rupee", code: "PKR", region: "Asia" },

  // Middle Eastern Currencies
  { symbol: "﷼", name: "Saudi Riyal", code: "SAR", region: "Middle East" },
  { symbol: "د.إ", name: "UAE Dirham", code: "AED", region: "Middle East" },
  { symbol: "﷼", name: "Qatari Riyal", code: "QAR", region: "Middle East" },
  { symbol: "د.ك", name: "Kuwaiti Dinar", code: "KWD", region: "Middle East" },
  { symbol: "₪", name: "Israeli Shekel", code: "ILS", region: "Middle East" },

  // African Currencies
  { symbol: "LE", name: "Egyptian Pound", code: "EGP", region: "Africa" },
  { symbol: "R", name: "South African Rand", code: "ZAR", region: "Africa" },
  { symbol: "Ksh", name: "Kenyan Shilling", code: "KES", region: "Africa" },
  { symbol: "₵", name: "Ghanaian Cedi", code: "GHS", region: "Africa" },

  // Americas
  {
    symbol: "R$",
    name: "Brazilian Real",
    code: "BRL",
    region: "South America"
  },
  { symbol: "MX$", name: "Mexican Peso", code: "MXN", region: "North America" }
];
export const getCurrencyBySymbol = (symbol: string): Currency | undefined => {
  return CURRENCIES.find((currency) => currency.symbol === symbol);
};


export interface FeatureJob {
  id: number;
  title: string;
  company: string;
  logo?: string;
  location: string;
  salary?: string;
  type: string;
  posted: string;
  skills: string[];
  isRemote: boolean;
  applicants: number;
  match: number;
}


export interface CategoryInfo{
  id: number;
  name: string;
  count: number;
  icon: string;
  color: string;
}



export interface Customer {
  email: string;
  name: string;
}

export interface Card {
  nonce?: string;
  encrypted_card_number: string;
  encrypted_cvv: string;
  encrypted_expiry_month: string;
  encrypted_expiry_year: string;
}

export interface PaymentMethod {
  type: string;
  card: Card;
}

export interface Metadata {
  userId: string;
  subscriptionId: string;
  planName: string;
}

export interface CreatePayment {
  amount: number;
  currency: string;
  reference: string;
  customer: Customer;
  payment_method: PaymentMethod;
  metadata: Metadata;
}
