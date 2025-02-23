import { EmploymentType } from "./emplymentTypes";

interface JobListing {
    id: string;
    skillType: string;
    employmentType: EmploymentType;
    applicants: number;
    date: string;
  }

export const dummyListings: JobListing[] = [
    {
      id: "1",
      skillType: "Product Design",
      employmentType: EmploymentType.FULL_TIME,
      applicants: 300,
      date: "20, December 2024"
    },
    {
      id: "2",
      skillType: "UI/UX Design",
      employmentType: EmploymentType.CONTRACT,
      applicants: 150,
      date: "19, December 2024"
    },
    {
      id: "3",
      skillType: "Frontend Development",
      employmentType: EmploymentType.REMOTE,
      applicants: 450,
      date: "18, December 2024"
    },
    {
      id: "4",
      skillType: "Backend Development",
      employmentType: EmploymentType.PART_TIME,
      applicants: 200,
      date: "17, December 2024"
    }
  ];