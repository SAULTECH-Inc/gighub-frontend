type JobDescription = {
  companyName: string;
  jobTitle: string;
  jobType: string;
  location: string;
  date: string;
};

const JobApplied: React.FC<JobDescription> = ({
  companyName,
  jobTitle,
  jobType,
  location,
  date,
}) => {
  return (
    <div className="flex items-center justify-between bg-[#F7F7F7] p-3">
      <div className="flex items-center gap-x-24">
        <div className="flex items-center gap-x-2">
          <div className="h-12 w-12 rounded-[10px] bg-[#D9D9D9]"></div>
          <div className="flex flex-col items-center">
            <p className="text-[16px] font-normal text-black">{companyName}</p>
            <span className="text-sm text-[#7F7F7F]">{location}</span>
          </div>
        </div>
        <span className="hidden text-sm font-medium text-black sm:flex">
          {date}
        </span>
        <p className="hidden font-normal text-black sm:flex">{jobTitle}</p>
        <p className="hidden font-normal text-black sm:flex">{jobType}</p>
        <div className="flex items-center gap-x-3">
          <div className="mr-5 h-3 w-3 rounded-full bg-orange"></div>
          <span className="hidden text-orange sm:flex">Summitted</span>
        </div>
      </div>
      <button className="h-[3rem] w-[8rem] rounded-[10px] bg-[#6438C2] font-bold text-white">
        View destails
      </button>
    </div>
  );
};

export default JobApplied;
