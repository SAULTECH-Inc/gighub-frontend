
type JobDescription = {
    companyName: string;
    jobTitle: string;
    jobType: string;
    location: string;
    date: string;
  };
  
const JobApplied:React.FC<JobDescription> = ({companyName, jobTitle, jobType, location, date}) => {

  return (
    <div className='bg-[#F7F7F7] flex items-center justify-between p-3'>
       <div className="flex items-center gap-x-24">
       <div className='flex items-center gap-x-2'>
            <div className='bg-[#D9D9D9] h-12 w-12 rounded-[10px]'></div>
            <div className='flex flex-col items-center'>
                <p className='text-black font-normal text-[16px]'>{companyName}</p>
                <span className='text-sm text-[#7F7F7F]'>{location}</span>
            </div>
        </div>
        <span className='text-black font-medium text-sm sm:flex hidden'>{date}</span>
        <p className='font-normal text-black sm:flex hidden'>{jobTitle}</p>
        <p className='font-normal text-black sm:flex hidden'>{jobType}</p>
        <div className='flex items-center gap-x-3'>
            <div className='h-3 w-3 bg-orange rounded-full mr-5'></div>
            <span className='text-orange sm:flex hidden'>Summitted</span>
        </div>
       </div>
       <button className="bg-[#6438C2] h-[3rem] w-[8rem] text-white font-bold rounded-[10px]">View destails</button>
    </div>
  )
}

export default JobApplied