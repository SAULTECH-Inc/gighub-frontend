import  Jumia  from "../../../assets/images/JumiaProfile.png"
import locationIcon from "../../../assets/icons/locationIcon.svg";
import peopleApplied from "../../../assets/icons/peopleApplied.svg";
import numberOfDaysRemaining from "../../../assets/icons/numberOfDaysRemaining.svg";
import jobTypeIcon from "../../../assets/icons/jobTypeIcon.svg"


export interface JobMatchCardProps {
    title: string;
    tags: string[];
    description: string;
    location: string;
    type: string;
    applicants: number;
    daysLeft: number;
}

const JobDetailsSidebar: React.FC<JobMatchCardProps> = ({
    title,
    location,
    tags,
    description,
    type,
    applicants,
    daysLeft
}) => {
  return (
    <div className="relative w-full rounded-[16px] cursor-pointer bg-white p-4 flex flex-col mx-auto">
        <div className="flex items-center gap-2">
            <div className="bg-[#F7F8FA] rounded-md">
                <img src={Jumia} alt="jumia" />
            </div>
            <div className="flex flex-col">
                <h2 className="text-black sm:text-[20px] text-sm font-medium">{title}</h2>
                <span className="text-gray text-sm">{location}</span>
            </div>
            <button className="border-[1px] border-[#E6E6E6] px-4 py-1 rounded-[10px] text-[#6438C2]">Apply</button>
        </div>
        <div className="flex items-center sm:justify-between mt-5 space-x-4">
        {tags.map((tag, index)=>(
            <span key={index} className="bg-[#F7F8FA] h-10 w-24 flex items-center justify-center rounded-[20px] text-black">{tag}</span>
        ))}
        </div>
        <p className="text-black text-sm mt-4">{description}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
            <div className="flex items-center space-x-2 mt-5">
                <img src={jobTypeIcon} alt={type} />
                <span className="text-gray text-[13px] md:text-sm">{type}</span>
            </div>
            <div className="flex items-center space-x-2 mt-5">
                <img src={locationIcon} alt={type} />
                <span className="text-gray text-[13px] md:text-sm">{location}</span>
            </div>
            <div className="flex items-center space-x-2 mt-5">
                <img src={peopleApplied} alt={type} />
                <span className="text-gray text-[13px] md:text-sm">{applicants} Applied</span>
            </div>
            <div className="flex items-center space-x-2 mt-5">
                <img src={numberOfDaysRemaining} alt={type} />
                <span className="text-gray text-[12px] md:text-sm">{daysLeft} days left</span>
            </div>
        </div>
    </div>
  )
}

export default JobDetailsSidebar