import { Option } from "./types";

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

export const jobTypes: string[] = [
  EmploymentType.FULL_TIME,
  EmploymentType.PART_TIME,
  EmploymentType.CONTRACT,
  EmploymentType.FREELANCE,
  EmploymentType.REMOTE,
  EmploymentType.INTERNSHIP,
  EmploymentType.TEMPORARY,
  EmploymentType.VOLUNTEER,
  EmploymentType.SEASONAL,
  EmploymentType.PER_DIEM,
  EmploymentType.CONSULTANT,
  EmploymentType.APPRENTICESHIP,
];

export const JobTypes: Option[] = [
  { label: EmploymentType.FULL_TIME, value: EmploymentType.FULL_TIME },
  { label: EmploymentType.PART_TIME, value: EmploymentType.PART_TIME },
  { label: EmploymentType.CONTRACT, value: EmploymentType.CONTRACT },
  { label: EmploymentType.FREELANCE, value: EmploymentType.FREELANCE },
  { label: EmploymentType.REMOTE, value: EmploymentType.REMOTE },
  { label: EmploymentType.INTERNSHIP, value: EmploymentType.INTERNSHIP },
  { label: EmploymentType.TEMPORARY, value: EmploymentType.TEMPORARY },
  { label: EmploymentType.VOLUNTEER, value: EmploymentType.VOLUNTEER },
  { label: EmploymentType.SEASONAL, value: EmploymentType.SEASONAL },
  { label: EmploymentType.PER_DIEM, value: EmploymentType.PER_DIEM },
  { label: EmploymentType.CONSULTANT, value: EmploymentType.CONSULTANT },
  {
    label: EmploymentType.APPRENTICESHIP,
    value: EmploymentType.APPRENTICESHIP,
  },
];
