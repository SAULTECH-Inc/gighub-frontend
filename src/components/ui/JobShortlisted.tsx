import React from "react";

type jobDescription = {
    companyName: string;
    jobTitle: string;
    jobType: string;
    location: string;
    shortlisted: string

}
const JobShortlisted: React.FC<jobDescription> = ({companyName, jobTitle, jobType, location, shortlisted}) => {
  return (
    <div className="relative bg-[#F7F8FA] border-[1px] border-[#E6E6E6] p-6 rounded-[16px] mt-10">
        <div className="flex items-center gap-x-6">
            <div className="flex flex-col items-center justify-center">
                <div className="bg-[#AFAFAF] h-24 w-24 rounded-full"></div>
                <p className="text-[18px] font-normal my-2">{companyName}</p>
                <span className="text-sm text-[#7F7F7F]">{location}</span>
                <div className="flex items-center">
                
                    <div className="flex items-center mt-3 gap-10">
                        <div className="flex flex-col items-center">
                            <span className="text-[#7F7F7F] text-[20px]">500</span>
                            <span className="text-[#7F7F7F] text-[20px]" >Connections</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[#7F7F7F] text-[20px]">20</span>
                            <span className="text-[#7F7F7F] text-[20px]" >Recommendation</span>
                        </div>
                       
                    </div>
                </div>
                <button className="bg-[#6B5AED] w-full mt-10 h-[50px] rounded-full text-white font-bold">Send Message</button>
            </div>
            <div className="flex items-center gap-5">
                <div className="h-72 w-[0.8px] bg-black"/>
                <div className="flex flex-col items-start">
                    <div className="flex items-center  gap-x-12">
                        <div className="flex flex-col items-start gap-1">
                            <div className="bg-[#6E4AED] h-2 w-16" />
                            <h3 className="text-[20px] font-normal">Company Name</h3>
                            <p className="text-[20px] text-[#6438C2]">{companyName}</p>
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <div className="bg-[#6E4AED] h-2 w-16" />
                            <h3 className="text-[20px] font-normal">Job Title</h3>
                            <p className="text-[20px] text-[#6438C2]">{jobType}</p>
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <div className="bg-[#6E4AED] h-2 w-16" />
                            <h3 className="text-[20px] font-normal">Job Type</h3>
                            <p className="text-[20px] text-[#6438C2]">{jobType}</p>
                        </div>
                    </div>
                    <div className="h-[1px] w-full bg-[#E6E6E6] my-7" />
                    <div className="flex items-start  gap-x-12">
                        <div className="flex flex-col items-start gap-1">
                            <div className="bg-[#6E4AED] h-2 w-16" />
                            <h3 className="text-[20px] font-normal">Location</h3>
                            <p className="text-[20px] text-[#6438C2]">{location}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="bg-[#6E4AED] h-2 w-16" />
                            <h3 className="text-[20px] font-normal">Shortlisted On</h3>
                            <p className="text-[20px] text-[#6438C2]">{shortlisted}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-5">
                        <button className="border-[1px] border-[#E6E6E6] text-[#8E8E8E] py-3 px-6 rounded-[16px]">View details</button>
                        <button className="border-[1px] border-[#E6E6E6] text-[#8E8E8E] py-3 px-6 rounded-[16px]">Remove From Shortlist</button>
                        <button className="border-[1px] border-[#E6E6E6] bg-[#6438C2] text-white  py-3 px-6 rounded-[16px]">Interview schedule</button>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default JobShortlisted