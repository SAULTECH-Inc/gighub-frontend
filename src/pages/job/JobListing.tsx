import React from "react";
import { Delete } from "../../assets/icons.ts";
import { EmploymentType } from "../../utils/employmentTypes.ts";

interface JobListing {
  id: string;
  skillType: string;
  employmentType: EmploymentType;
  applicants: number;
  date: string;
}

interface JobListingsProps {
  listings: JobListing[];
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const JobListing: React.FC<JobListingsProps> = ({
  listings,
  onView = () => {},
  onDelete = () => {},
}) => {
  return (
    <div className="w-full flex flex-wrap gap-4 justify-center">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="lg:hidden max-w-[322px] bg-[#F7F8FA] p-[26px] w-full rounded-[16px] flex flex-col gap-4"
        >
          <div className="flex justify-between gap-2">
            <div className="w-[50%]">
              <p className="text-[#6438C2]">Skills Type</p>
              <p className="text-[#8E8E8E]">{listing.skillType}</p>
            </div>
            <div className="w-[50%]">
              <p className="text-[#6438C2]">Employment Type</p>
              <p className="text-[#8E8E8E]">{listing.employmentType}</p>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="w-[50%]">
              <p className="text-[#6438C2]">Number of Applicants</p>
              <p className="text-[#8E8E8E]">{listing.applicants}</p>
            </div>
            <div className="w-[50%]">
              <p className="text-[#6438C2]">Application date</p>
              <p className="text-[#8E8E8E]">{listing.date}</p>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <button
              className="py-[7px] px-[30px] bg-white rounded-[10px]"
              onClick={() => onView(listing.id)}
            >
              Delete
            </button>
            <button
              className="text-white py-[7px] px-[30px] bg-[#6438C2] rounded-[10px]"
              onClick={() => onDelete(listing.id)}
            >
              View
            </button>
          </div>
        </div>
      ))}

      {listings.map((listing) => (
        <div
          key={listing.id}
          className="hidden  lg:flex  bg-[#F7F8FA] text-[#8E8E8E] w-full py-2 px-4 rounded-[10px] justify-between"
        >
          <div className="w-[75%] flex justify-between items-center">
            <p className="lg:w-[150px] text-[12px]">{listing.skillType}</p>
            <p className="lg:w-[150px] text-[12px]">{listing.employmentType}</p>
            <p className="lg:w-[150px] text-[12px]">{listing.applicants}</p>
            <p className="lg:w-[150px] text-[12px]">{listing.date}</p>
          </div>
          <div className="flex justify-between gap-2">
            <img src={Delete} alt="delete icon" />
            <button className="text-white lg:w-[103px] py-[7px] px-[13px] bg-[#6438C2] rounded-[10px]">
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobListing;
