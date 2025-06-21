import React from "react";
import { Delete } from "../../assets/icons.ts";
import { JobPostResponse } from "../../utils/types";
import moment from "moment";

interface JobListingsProps {
  listings: JobPostResponse[];
  onView?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const JobListing: React.FC<JobListingsProps> = ({
  listings,
  onView = () => {},
  onDelete = () => {},
}) => {
  return (
    <div className="flex w-full flex-wrap justify-center gap-4">
      {/*Cards Mobile*/}
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="flex w-full flex-col gap-4 rounded-[16px] bg-[#F7F8FA] p-[26px] sm:max-w-[32rem] md:hidden"
        >
          <div className="flex justify-between gap-2">
            <div className="w-[50%]">
              <p className="text-[#6438C2]">Job Title</p>
              <p className="text-[#8E8E8E]">{listing.title}</p>
            </div>
            <div className="w-[50%]">
              <p className="text-[#6438C2]">Employment Type</p>
              <p className="text-[#8E8E8E]">{listing.employmentType}</p>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="w-[50%]">
              <p className="text-[#6438C2]">Number of Applicants</p>
              <p className="text-[#8E8E8E]">{listing.applicantsCount}</p>
            </div>
            <div className="w-[50%]">
              <p className="text-[#6438C2]">Application date</p>
              <p className="text-[#8E8E8E]">
                {moment(listing.createdAt).format("DD, MMMM YYYY")}
              </p>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <button
              className="rounded-[10px] bg-white px-[30px] py-[7px]"
              onClick={() => onView(listing.id)}
            >
              Delete
            </button>
            <button
              className="rounded-[10px] bg-[#6438C2] px-[30px] py-[7px] text-white"
              onClick={() => onDelete(listing.id)}
            >
              View
            </button>
          </div>
        </div>
      ))}
      {/*Table*/}
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="hidden w-full justify-between rounded-[10px] bg-[#F7F8FA] px-4 py-2 text-[#8E8E8E] md:flex"
        >
          <div className="flex w-[75%] items-center justify-between">
            <p className="text-[12px] lg:w-[150px]">{listing.title}</p>
            <p className="text-[12px] lg:w-[150px]">{listing.employmentType}</p>
            <p className="text-[12px] lg:w-[150px]">
              {listing.applicantsCount}
            </p>
            <p className="text-[12px] lg:w-[150px]">
              {moment(listing.createdAt).format("DD, MMMM YYYY")}
            </p>
          </div>
          <div className="flex justify-between gap-x-8">
            <img src={Delete} alt="delete icon" className="cursor-pointer" />
            <button className="rounded-[10px] bg-[#6438C2] px-[13px] py-[7px] text-white lg:w-[103px]">
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobListing;
