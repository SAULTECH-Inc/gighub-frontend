import React, {ButtonHTMLAttributes, ChangeEvent} from "react";
import {Action, UserType} from "../enums.ts";

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
    data: D;
    message?: string;
    path?: string;
    error?: string
    statusCode?: number;
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
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    variant?: 'primary' | 'secondary' | 'danger';
}

export interface ProgressBarProps {
    value: number; // 0 to 100
    className?: string;
    color?: string; // e.g. "bg-blue-600" or "bg-green-500"
}

export interface LoginRequest{
    email: string;
    password: string;
}

export interface Permission{
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
}

export interface ApplicantPersonalInfo{
    firstName?: string;
    lastName?: string;
    middleName?: string;
    email?: string ;
    phoneNumber?: string;
    country?: string;
    city?: string;
    dateOfBirth?: string;
    address?: string;
}
export interface ApplicantData {
    firstName: string | null;
    lastName: string  | null;
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
    userType: Partial<UserType>;
    cv: CvResponseDto;
    token: string | null;
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
    yearObtained?: string;
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
}

export enum CVType {
    UPLOADED='uploaded',
    LINKED='linked',
    EXTERNAL='external',
    OTHER='other',
    FILLED_FORM='filled form',
}

export const institutions: Option[] = [
    {label: "Stanford University", value: "Stanford"},
    {label: "Harvard University", value: "Harvard"},
    {label: "MIT", value: "MIT"},
    {label: "UCLA", value: "UCLA"},
    {label: "Berkeley", value: "Berkeley"},
    {label: "Princeton University", value: "Princeton"},
    {label: "UCI", value: "UCI"},
    {label: "Yale University", value: "Yale"},
    {label: "Columbia University", value: "Columbia"},
    {label: "Dartmouth College", value: "Dartmouth"},
    {label: "Cornell University", value: "Cornell"},
    {label: "Oxford University", value: "Oxford"},
];
export const countries: Option[] = [
    {label: "Australia", value: "Australia"},
    {label: "Nigeria", value: "Nigeria"},
    {label: "India", value: "India"},
    {label: "United States", value: "United States"},
    {label: "United Kingdom", value: "United Kingdom"},
    {label: "Canada", value: "Canada"},
];
export const cities: Option[] = [
    {label: "New York City", value: "NYC"},
    {label: "Los Angeles", value: "LA"},
    {label: "Chicago", value: "Chicago"},
    {label: "Houston", value: "Houston"},
    {label: "Philadelphia", value: "Philadelphia"},
    {label: "San Francisco", value: "SF"},
    {label: "Seattle", value: "Seattle"},
    {label: "Boston", value: "Boston"},
    {label: "Washington D.C.", value: "Washington"},
    {label: "Atlanta", value: "Atlanta"},
    {label: "Dallas", value: "Dallas"},
    {label: "San Diego", value: "San Diego"},
    {label: "San Jose", value: "San Jose"},
]
export const fieldsOfStudies: Option[] = [
    {label: "Computer Science", value: "Computer Science"},
    {label: "Business Administration", value: "Business Administration"},
    {label: "Engineering", value: "Engineering"},
    {label: "Humanities", value: "Humanities"},
    {label: "Psychology", value: "Psychology"},
    {label: "Marketing", value: "Marketing"},
];
export const classOfDegrees: Option[] = [
    {label: "B.ENG", value: "B.ENG"},
    {label: "B.SC", value: "B.SC"},
    {label: "B.A.", value: "B.A."},
    {label: "B.COM", value: "B.COM"},
    {label: "M.ENG", value: "M.ENG"},
    {label: "M.SC", value: "M.SC"},
    {label: "M.A.", value: "M.A."},
    {label: "M.COM", value: "M.COM"},
    {label: "Ph.D.", value: "Ph.D."},
    {label: "Other", value: "Other"},
];


export interface Location {
    country: string;
    city: string;
}

export interface SalaryRange {
    currency: string;
    minAmount: number;
    maxAmount: number;
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

export interface FileUploadResponse{
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

export interface PasswordResetRequest{
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

export interface JobApplicationDetails{
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

export interface ProfessionalSummaryData{
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
    facebookProfile: string;
    twitterProfile: string;
    linkedInProfile: string;
    instagramProfile: string;
}

export interface ComplianceAndVerifications {
    taxIdentificationNumber: string;
    registrationNumber: string;
}
