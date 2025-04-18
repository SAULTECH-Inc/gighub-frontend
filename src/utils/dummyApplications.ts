export enum ApplicationStatus {
    PENDING = "Pending",
    HIRED = "Hired",
    INTERVIEWED = "Interview scheduled",
    REJECTED = "Rejected",
    SHORTLISTED = "Shorlisted",
    WITHDRAW = "Withdraw"
  }

  
  export interface Application {
    id: number;
    jobTitle: string;
    companyName: string;
    location: string;
    jobLocation: string;
    status: ApplicationStatus;
    position: string;
    appliedDate: string;
  }

  export const getApplications = (): Application[] => {
    const allApplications: Application[] = Array.from(
      { length: 35 },
      (_, index) => ({
        id: 1000 + index,
        jobTitle: `${["Software Engineer", "Product Manager", "UI/UX Designer", "Data Scientist", "DevOps Engineer"][index % 5]} ${Math.floor(index / 5) + 1}`,
        companyName: `${["TechCorp  Having a Lenghty Company name", "DataSystems", "InnovateCo", "DevHouse", "FutureTech", "CodeWorks", "ByteForge"][index % 7]}`,
        location: `${["San Francisco", "New York", "Seattle", "Austin", "Remote", "Chicago", "Boston"][index % 7]}`,
        jobLocation: `${["Remote", "Hybrid", "Onsite"][index % 3]}`,
        status: Object.values(ApplicationStatus)[index % 5],
        position: `${["Junior", "Mid-level", "Senior", "Lead", "Principal"][index % 5]}`,
        appliedDate: new Date(Date.now() - index * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      }),
    );
    
    return allApplications;
  };