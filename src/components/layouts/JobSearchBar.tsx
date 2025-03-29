import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useRef } from "react";
const JobSearchBar = () => {
    const jobInputRef = useRef<HTMLInputElement>(null);
    const companyInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className='relative bg-white shadow-lg w-full rounded-[10px] p-2'>
        <div className="flex items-center justify-between max-lg:hidden">
        <div className="bg-white flex items-center justify-between p-2 ">
                <FaSearch className="text-2xl font-normal" />
                <input ref={jobInputRef} 
                type="text" 
                placeholder="Job title"
                className=" border-none w-full  outline-none focus:outline-none focus:border-[#ccc] active:border-[#ccc] placeholder:text-sm placeholder:text-black px-2 text-sm placeholder:font-bold focus:ring-0" />
                <div className="h-7 w-7 bg-[#F7F7F7] flex items-center justify-center rounded-full">
                    <IoClose className="text-2xl font-normal" />
                </div>
                <div className="h-[29px] bg-gray w-[0.5px] ml-5" />
            </div>

            <div className="bg-white flex items-center justify-between p-2">
                <FaSearch className="text-2xl font-normal" />
                <input ref={companyInputRef} 
                type="text" 
                placeholder="Company Name"
                className=" border-none w-full  outline-none focus:outline-none focus:border-[#ccc] active:border-[#ccc] placeholder:text-sm placeholder:text-black px-2 text-sm placeholder:font-bold focus:ring-0" />
                <div className="h-7 w-7 bg-[#F7F7F7] flex items-center justify-center rounded-full">
                    <IoClose className="text-2xl font-normal" />
                </div>
            </div>
            <button className="bg-[#6B5AED] h-[3rem] w-[8rem] text-white font-bold rounded-[10px]">Find Job</button>
        </div>
        <div className="hidden max-lg:flex">
            <div className="bg-white flex items-center justify-between p-2 w-full ">
                <FaSearch className="text-2xl font-normal" />
                <input ref={jobInputRef} 
                type="text" 
                placeholder="Search Here"
                className=" border-none w-full outline-none focus:outline-none focus:border-[#ccc] active:border-[#ccc] placeholder:text-sm placeholder:text-black px-2 text-sm placeholder:font-bold focus:ring-0" />
                <button className="bg-[#6B5AED] h-[3rem] w-[8rem] text-white font-bold rounded-[10px]">Search</button>
            </div>
            </div>
    </div>
  )
}

export default JobSearchBar