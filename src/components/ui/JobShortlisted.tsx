import React from "react";

type JobDescription = {
  companyName: string;
  jobTitle: string;
  jobType: string;
  location: string;
  shortlisted: string;
};

const JobShortlisted: React.FC<JobDescription> = ({
  companyName,
  jobTitle,
  jobType,
  location,
  shortlisted,
}) => {
  return (
    <div className="relative mt-10 w-full rounded-2xl border border-[#E6E6E6] bg-[#F7F8FA] p-6">
      {/* Main Container */}
      <div className="flex flex-col items-center gap-x-6 lg:flex-row lg:items-start">
        {/* Left Section (Profile) */}
        <div className="flex w-full flex-col items-center justify-center lg:w-auto">
          <div className="h-24 w-24 rounded-full bg-[#AFAFAF]"></div>
          <p className="my-2 text-lg font-medium">{companyName}</p>
          <span className="text-gray-500 text-sm">{location}</span>

          {/* Connections & Recommendations */}
          <div className="mt-3 flex items-center justify-center gap-6 sm:gap-10">
            <div className="flex flex-col items-center">
              <span className="text-gray-500 text-lg sm:text-xl">500</span>
              <span className="text-gray-500 text-sm sm:text-lg">
                Connections
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-500 text-lg sm:text-xl">20</span>
              <span className="text-gray-500 text-sm sm:text-lg">
                Recommendation
              </span>
            </div>
          </div>

          {/* Send Message Button */}
          <button className="mt-6 h-12 w-full rounded-full bg-[#6B5AED] font-bold text-white sm:h-14">
            Send Message
          </button>
        </div>

        {/* Divider (Hidden on Mobile) */}
        <div className="hidden h-72 w-[1px] bg-black lg:block" />

        {/* Right Section (Details) */}
        <div className="flex w-full flex-col items-start">
          {/* Job Details */}
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3">
            <div className="flex flex-col items-start gap-1">
              <div className="h-2 w-16 bg-[#6E4AED]" />
              <h3 className="text-lg font-medium">Company Name</h3>
              <p className="text-lg text-[#6438C2]">{companyName}</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="h-2 w-16 bg-[#6E4AED]" />
              <h3 className="text-lg font-medium">Job Title</h3>
              <p className="text-lg text-[#6438C2]">{jobTitle}</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="h-2 w-16 bg-[#6E4AED]" />
              <h3 className="text-lg font-medium">Job Type</h3>
              <p className="text-lg text-[#6438C2]">{jobType}</p>
            </div>
          </div>

          {/* Divider Line */}
          <div className="my-7 h-[1px] w-full bg-[#E6E6E6]" />

          {/* Location & Shortlisted Date */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-12">
            <div className="flex flex-col items-start gap-1">
              <div className="h-2 w-16 bg-[#6E4AED]" />
              <h3 className="text-lg font-medium">Location</h3>
              <p className="text-lg text-[#6438C2]">{location}</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="h-2 w-16 bg-[#6E4AED]" />
              <h3 className="text-lg font-medium">Shortlisted On</h3>
              <p className="text-lg text-[#6438C2]">{shortlisted}</p>
            </div>
          </div>

          {/* Responsive Buttons */}
          <div className="mt-5 flex w-full flex-col items-center gap-4 sm:flex-row">
            <button className="text-gray-600 w-full rounded-xl border border-[#E6E6E6] px-6 py-3 sm:w-auto">
              View details
            </button>
            <button className="text-gray-600 w-full rounded-xl border border-[#E6E6E6] px-6 py-3 sm:w-auto">
              Remove From Shortlist
            </button>
            <button className="w-full rounded-xl border border-[#E6E6E6] bg-[#6438C2] px-6 py-3 text-white sm:w-auto">
              Interview schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobShortlisted;
