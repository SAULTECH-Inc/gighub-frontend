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
    <div className="relative bg-[#F7F8FA] w-full border border-[#E6E6E6] p-6 rounded-2xl mt-10">
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-x-6">
        
        {/* Left Section (Profile) */}
        <div className="flex flex-col items-center justify-center w-full lg:w-auto">
          <div className="bg-[#AFAFAF] h-24 w-24 rounded-full"></div>
          <p className="text-lg font-medium my-2">{companyName}</p>
          <span className="text-sm text-gray-500">{location}</span>

          {/* Connections & Recommendations */}
          <div className="flex items-center justify-center mt-3 gap-6 sm:gap-10">
            <div className="flex flex-col items-center">
              <span className="text-gray-500 text-lg sm:text-xl">500</span>
              <span className="text-gray-500 text-sm sm:text-lg">Connections</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-500 text-lg sm:text-xl">20</span>
              <span className="text-gray-500 text-sm sm:text-lg">Recommendation</span>
            </div>
          </div>

          {/* Send Message Button */}
          <button className="bg-[#6B5AED] w-full mt-6 h-12 sm:h-14 rounded-full text-white font-bold">
            Send Message
          </button>
        </div>

        {/* Divider (Hidden on Mobile) */}
        <div className="hidden lg:block h-72 w-[1px] bg-black" />

        {/* Right Section (Details) */}
        <div className="flex flex-col items-start w-full">
          
          {/* Job Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12 mt-5">
            <div className="flex flex-col items-start gap-1">
              <div className="bg-[#6E4AED] h-2 w-16" />
              <h3 className="text-lg font-medium">Company Name</h3>
              <p className="text-lg text-[#6438C2]">{companyName}</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="bg-[#6E4AED] h-2 w-16" />
              <h3 className="text-lg font-medium">Job Title</h3>
              <p className="text-lg text-[#6438C2]">{jobTitle}</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="bg-[#6E4AED] h-2 w-16" />
              <h3 className="text-lg font-medium">Job Type</h3>
              <p className="text-lg text-[#6438C2]">{jobType}</p>
            </div>
          </div>

          {/* Divider Line */}
          <div className="h-[1px] w-full bg-[#E6E6E6] my-7" />

          {/* Location & Shortlisted Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
            <div className="flex flex-col items-start gap-1">
              <div className="bg-[#6E4AED] h-2 w-16" />
              <h3 className="text-lg font-medium">Location</h3>
              <p className="text-lg text-[#6438C2]">{location}</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="bg-[#6E4AED] h-2 w-16" />
              <h3 className="text-lg font-medium">Shortlisted On</h3>
              <p className="text-lg text-[#6438C2]">{shortlisted}</p>
            </div>
          </div>

          {/* Responsive Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-5 w-full">
            <button className="border border-[#E6E6E6] text-gray-600 py-3 px-6 rounded-xl w-full sm:w-auto">
              View details
            </button>
            <button className="border border-[#E6E6E6] text-gray-600 py-3 px-6 rounded-xl w-full sm:w-auto">
              Remove From Shortlist
            </button>
            <button className="border border-[#E6E6E6] bg-[#6438C2] text-white py-3 px-6 rounded-xl w-full sm:w-auto">
              Interview schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobShortlisted;
