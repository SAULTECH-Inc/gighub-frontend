import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useRef } from "react";
const JobSearchBar = () => {
  const jobInputRef = useRef<HTMLInputElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="relative w-full rounded-[10px] bg-white p-2 shadow-lg">
      <div className="flex items-center justify-between max-lg:hidden">
        <div className="flex items-center justify-between bg-white p-2">
          <FaSearch className="text-2xl font-normal" />
          <input
            ref={jobInputRef}
            type="text"
            placeholder="Job title"
            className="w-full border-none px-2 text-sm outline-none placeholder:text-sm placeholder:font-bold placeholder:text-black focus:border-[#ccc] focus:outline-none focus:ring-0 active:border-[#ccc]"
          />
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F7F7F7]">
            <IoClose className="text-2xl font-normal" />
          </div>
          <div className="bg-gray ml-5 h-[29px] w-[0.5px]" />
        </div>

        <div className="flex items-center justify-between bg-white p-2">
          <FaSearch className="text-2xl font-normal" />
          <input
            ref={companyInputRef}
            type="text"
            placeholder="Company Name"
            className="w-full border-none px-2 text-sm outline-none placeholder:text-sm placeholder:font-bold placeholder:text-black focus:border-[#ccc] focus:outline-none focus:ring-0 active:border-[#ccc]"
          />
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F7F7F7]">
            <IoClose className="text-2xl font-normal" />
          </div>
        </div>
        <button className="h-[3rem] w-[8rem] rounded-[10px] bg-[#6B5AED] font-bold text-white">
          Find Job
        </button>
      </div>
      <div className="hidden max-lg:flex">
        <div className="flex w-full items-center justify-between bg-white p-2">
          <FaSearch className="text-2xl font-normal" />
          <input
            ref={jobInputRef}
            type="text"
            placeholder="Search Here"
            className="w-full border-none px-2 text-sm outline-none placeholder:text-sm placeholder:font-bold placeholder:text-black focus:border-[#ccc] focus:outline-none focus:ring-0 active:border-[#ccc]"
          />
          <button className="h-[3rem] w-[8rem] rounded-[10px] bg-[#6B5AED] font-bold text-white">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSearchBar;
