import { EmploymentType } from "./emplymentTypes";

interface JobListing {
    id: string;
    jobTitle: string;
    employmentType: EmploymentType;
    progress: number;
    date: string;
  }

export const dummyPostListings: JobListing[] = [
    {
      id: "1",
      jobTitle: "Product Design",
      employmentType: EmploymentType.FULL_TIME,
      progress: 50,
      date: "20, December 2024"
    },
    {
      id: "2",
      jobTitle: "UI/UX Design",
      employmentType: EmploymentType.CONTRACT,
      progress: 75,
      date: "19, December 2024"
    },
    {
      id: "3",
      jobTitle: "Frontend Development",
      employmentType: EmploymentType.REMOTE,
      progress: 25,
      date: "18, December 2024"
    },
    {
      id: "4",
      jobTitle: "Backend Development",
      employmentType: EmploymentType.PART_TIME,
      progress: 90,
      date: "17, December 2024"
    }
  ];