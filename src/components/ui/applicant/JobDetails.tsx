import { Jumia } from "../../../assets/icons"
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

const JobDetails: React.FC<JobMatchCardProps> = ({
    title,
    location,
    tags,
    description,
    type,
    applicants,
    daysLeft
}) => {
  return (
    <div className="relative w-full h-[280px] rounded-[16px] cursor-pointer bg-white p-4 flex flex-col mx-auto">
        <div className="flex items-center gap-2">
            <div className="bg-[#F7F8FA] rounded-md">
                <img src={Jumia} alt="jumia" className="w-[100px]" />
            </div>
            <div className="flex flex-col">
                <h2 className="text-black text-[20px] font-medium">{title}</h2>
                <span className="text-gray text-sm">{location}</span>
            </div>
            <button className="border-[1px] border-[#E6E6E6] px-4 py-1 rounded-[10px] text-[#6438C2]">Apply</button>
        </div>
        <div className="flex items-center justify-center space-x-10 mt-4">
        {tags.map((tag, index)=>(
            <span key={index} className="bg-[#F7F8FA] px-4 py-2 rounded-full text-black">{tag}</span>
        ))}
        </div>
        <p className="text-black text-sm mt-4">{description}</p>
        <div className="flex items-center justify-between gap-x-2">
            <div className="flex items-center space-x-2 mt-5">
                <img src={jobTypeIcon} alt={type} />
                <span className="text-gray text-sm">{type}</span>
            </div>
            <div className="flex items-center space-x-2 mt-5">
                <img src={locationIcon} alt={type} />
                <span className="text-gray text-sm">{location}</span>
            </div>
            <div className="flex items-center space-x-2 mt-5">
                <img src={peopleApplied} alt={type} />
                <span className="text-gray text-sm">{applicants} Applied</span>
            </div>
            <div className="flex items-center space-x-2 mt-5">
                <img src={numberOfDaysRemaining} alt={type} />
                <span className="text-gray text-xs">{daysLeft} days left</span>
            </div>
        </div>
    </div>
  )
}

export default JobDetails