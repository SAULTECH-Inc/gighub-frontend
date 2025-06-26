import React from "react";
import RemoteIcon from "../../assets/icons/remote.svg";
import FullTimeIcon from "../../assets/icons/fulltime.svg";
import SalaryIcon from "../../assets/icons/salary.svg";
import LevelIcon from "../../assets/icons/level.svg";
import CalendarIcon from "../../assets/icons/calendar.svg";
import { JobPostResponse } from "../../utils/types";
import moment from "moment";
import numeral from "numeral";
import { capitalizeEachCase, USER_TYPE } from "../../utils/helpers.ts";
import { PiUsers } from "react-icons/pi";
import { MdOutlineMoreTime } from "react-icons/md";
import { UserType } from "../../utils/enums.ts";
import useModalStore from "../../store/modalStateStores.ts";
import { useJobSearchSettings } from "../../store/useJobSearchSettings.ts";

interface SidebarProp {
  job: JobPostResponse;
  handleEditJob: () => void;
  handleBookmark?: () => void;
}

const JobDetailsSidebar: React.FC<SidebarProp> = ({
  job,
  handleEditJob,
  handleBookmark,
}) => {
  const { openModal } = useModalStore();
  const { setJobToApply } = useJobSearchSettings();
  const start = moment(job.startDate);
  const end = moment(job.endDate);
  const now = moment();

  // Ensure start and end are valid and end is after start
  let percentage = 0;
  if (end.isAfter(start)) {
    const totalDuration = end.diff(start);
    const elapsed = now.diff(start);
    percentage = (elapsed / totalDuration) * 100;
  }

  let textColor = "text-black";
  if (percentage >= 70) {
    textColor = "text-red-500";
  } else if (percentage >= 40) {
    textColor = "text-purple-500";
  } else {
    textColor = "text-green-500";
  }

  return (
    <div className="flex h-[100%] w-full flex-col gap-y-8 rounded-[16px] bg-white p-5 pb-4 shadow-sm md:w-[357px] md:px-8 md:pt-8">
      {/* Sidebar Items */}
      <div className="flex items-center gap-x-3">
        <img src={RemoteIcon} alt="Remote work" className="h-6 w-6" />
        <span className="font-lato text-[16px] leading-[20px] font-medium text-gray-700">
          {job.jobType}
        </span>
      </div>

      <div className="flex items-center gap-x-3">
        <img src={FullTimeIcon} alt="Full Time" className="h-6 w-6" />
        <span className="font-lato text-[16px] leading-[20px] font-medium text-gray-700">
          {job.employmentType}
        </span>
      </div>

      {job?.salaryRange?.maximumAmount > 0 && (
        <div className="flex items-center gap-x-3">
          <img src={SalaryIcon} alt="Salary" className="h-6 w-6" />
          <span className="font-lato text-[16px] leading-[20px] font-medium text-gray-700">
            {job.salaryRange.currency}
            {numeral(job.salaryRange.minimumAmount).format("0,0a")} -{" "}
            {job.salaryRange.currency}
            {numeral(job.salaryRange.maximumAmount).format("0,0a")}/
            {job.salaryRange.frequency}
          </span>
        </div>
      )}

      <div className="flex items-center gap-x-3">
        <img src={LevelIcon} alt="Mid Level" className="h-6 w-6" />
        <span className="font-lato text-[16px] leading-[20px] font-medium text-gray-700">
          {job.level}
        </span>
      </div>

      {/* Experience */}
      <div className="flex items-center gap-x-3">
        <MdOutlineMoreTime className="h-6 w-6" />
        <span className="text-[16px] leading-[20px] font-medium text-gray-700">
          {job.experienceYears + "+ years experience" || "2+ yrs experience"}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-x-3">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.3481 17.8057C10.9867 18.144 10.5037 18.3332 10.0009 18.3332C9.49817 18.3332 9.01517 18.144 8.65375 17.8057C5.34418 14.6882 0.908967 11.2056 3.07189 6.14955C4.24136 3.4158 7.04862 1.6665 10.0009 1.6665C12.9532 1.6665 15.7605 3.4158 16.93 6.14955C19.0902 11.1993 14.6658 14.6989 11.3481 17.8057Z"
            stroke="#000"
            strokeWidth="1.5"
          />
          <path
            d="M12.9163 9.16667C12.9163 10.7775 11.6105 12.0833 9.99967 12.0833C8.38884 12.0833 7.08301 10.7775 7.08301 9.16667C7.08301 7.55583 8.38884 6.25 9.99967 6.25C11.6105 6.25 12.9163 7.55583 12.9163 9.16667Z"
            stroke="#000"
            strokeWidth="1.5"
          />
        </svg>

        <span className="text-[16px] leading-[20px] font-medium text-gray-700">
          {job.location}
        </span>
      </div>

      <div className="flex items-center gap-x-3">
        <img src={CalendarIcon} alt="Date" className="h-6 w-6" />
        <span className="font-lato text-[16px] leading-[20px] font-medium text-gray-700">
          Closing {moment(job.startDate).format("D MMM YYYY - HH:mm")}
        </span>
      </div>

      {/* Time Left to Apply */}
      <div className="flex items-center gap-x-3">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="#000"
            strokeWidth="1.5"
          />
          <path
            d="M9.5 9.5L12.9999 12.9996M16 8L11 13"
            stroke="#000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={`${textColor} text-[16px] leading-[20px] font-medium`}>
          {capitalizeEachCase(moment(job.startDate).fromNow(true))} left to
          apply
        </span>
      </div>

      {/* Total Applicants */}
      <div className="flex items-center gap-x-3">
        <PiUsers className="h-5 w-5" />
        <span className="text-[16px] leading-[20px] font-medium text-gray-700">
          {job.applicantsCount || 0} applied
        </span>
      </div>

      {USER_TYPE === UserType.EMPLOYER ? (
        <button
          onClick={handleEditJob}
          className="text-md font-lato w-full place-self-end rounded-[15px] bg-[#6438C2] px-10 py-3 font-bold text-white transition hover:bg-[#5126a9] md:w-[225px]"
        >
          Edit Job
        </button>
      ) : (
        <div className="flex w-full flex-col gap-y-2">
          {/* Apply Button - Primary action */}
          <button
            onClick={() => {
              setJobToApply(job);
              openModal("application-modal");
            }}
            type="button"
            className="text-md font-lato w-full place-self-end rounded-[15px] bg-[#6438C2] px-10 py-3 font-bold text-white transition hover:bg-[#5126a9] md:w-[225px]"
          >
            Apply
          </button>

          {/* Bookmark Button - Soft lavender for a calm, secondary action */}
          <button
            onClick={handleBookmark}
            type="button"
            className="text-md font-lato w-full place-self-end rounded-[15px] bg-[#E9D8FD] px-10 py-3 font-bold text-[#4B0082] transition hover:bg-[#D8B4FE] md:w-[225px]"
          >
            Bookmark
          </button>

          {/* Refer Button - Deep magenta for friendly energy, still harmonious */}
          <button
            onClick={() => {
              openModal("refer-modal");
            }}
            type="button"
            className="text-md font-lato w-full place-self-end rounded-[15px] bg-[#C026D3] px-10 py-3 font-bold text-white transition hover:bg-[#A21CAF] md:w-[225px]"
          >
            Refer
          </button>
        </div>
      )}
    </div>
  );
};

export default JobDetailsSidebar;
