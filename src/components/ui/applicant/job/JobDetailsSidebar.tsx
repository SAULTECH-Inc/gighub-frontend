import Jumia from "../../../../assets/images/JumiaProfile.png";
import locationIcon from "../../../../assets/icons/locationIcon.svg";
import peopleApplied from "../../../../assets/icons/peopleApplied.svg";
import numberOfDaysRemaining from "../../../../assets/icons/numberOfDaysRemaining.svg";
import jobTypeIcon from "../../../../assets/icons/jobTypeIcon.svg";

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
  daysLeft,
}) => {
  return (
    <div className="relative mx-auto flex w-full cursor-pointer flex-col rounded-[16px] bg-white p-4">
      <div className="flex items-center gap-2">
        <div className="rounded-md bg-[#F7F8FA]">
          <img src={Jumia} alt="jumia" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-sm font-medium text-black sm:text-[20px]">
            {title}
          </h2>
          <span className="text-gray text-sm">{location}</span>
        </div>
        <button className="rounded-[10px] border-[1px] border-[#E6E6E6] px-4 py-1 text-[#6438C2]">
          Apply
        </button>
      </div>
      <div className="mt-5 flex items-center space-x-4 sm:justify-between">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex h-10 w-24 items-center justify-center rounded-[20px] bg-[#F7F8FA] text-black"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm text-black">{description}</p>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="mt-5 flex items-center space-x-2">
          <img src={jobTypeIcon} alt={type} />
          <span className="text-gray text-[13px] md:text-sm">{type}</span>
        </div>
        <div className="mt-5 flex items-center space-x-2">
          <img src={locationIcon} alt={type} />
          <span className="text-gray text-[13px] md:text-sm">{location}</span>
        </div>
        <div className="mt-5 flex items-center space-x-2">
          <img src={peopleApplied} alt={type} />
          <span className="text-gray text-[13px] md:text-sm">
            {applicants} Applied
          </span>
        </div>
        <div className="mt-5 flex items-center space-x-2">
          <img src={numberOfDaysRemaining} alt={type} />
          <span className="text-gray text-[12px] md:text-sm">
            {daysLeft} days left
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsSidebar;
