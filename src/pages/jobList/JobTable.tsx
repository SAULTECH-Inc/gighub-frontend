import React from "react";
import BinIcon from "../../assets/icons/bin.png"; // Make sure to import your bin icon

const JobTable: React.FC = () => {
    const jobs = Array(10).fill({
        skill: "Product Design",
        employment: "Full Time Job",
        applicants: "300",
        date: "20, December 2024",
    });

    return (
        <div className="absolute w-[1367px] h-[833px] top-[161px] left-[38px] bg-white shadow-lg rounded-[16px] p-6">
            {/* Table Header */}
            <div className="w-[1315px] h-[47px] bg-[#6438C2] rounded-[16px] flex items-center px-6 text-white font-lato text-[16px] font-medium">
                <div className="w-1/4">Skills Type</div>
                <div className="w-1/4">Employment Type</div>
                <div className="w-1/6">Number of applicants</div>
                <div className="w-1/4">Application Date</div>
                <div className="w-1/6 text-center">Action</div>
            </div>

            {/* Job List */}
            {jobs.map((job, index) => (
                <div
                    key={index}
                    className="w-[1315px] h-[47px] bg-[#F7F8FA] rounded-[16px] flex items-center px-6 mt-4 text-[#8E8E8E] font-lato text-[16px] font-normal"
                >
                    <div className="w-1/4">{job.skill}</div>
                    <div className="w-1/4">{job.employment}</div>
                    <div className="w-1/6">{job.applicants}</div>
                    <div className="w-1/4">{job.date}</div>

                    {/* Action Section */}
                    <div className="w-1/6 flex justify-center items-center gap-4">
                        {/* Bin Icon */}
                        <img src={BinIcon} alt="Delete" className="w-5 h-5 cursor-pointer" />

                        {/* View Button */}
                        <button className="w-[103px] h-[33px] bg-[#6438C2] text-white rounded-[10px] px-6 py-[7px] text-center font-medium">
                            View
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default JobTable;
