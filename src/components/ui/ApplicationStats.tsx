import jobApplied from "../../assets/icons/jobApplied.svg";
import shortlisted from "../../assets/icons/shortlisted.svg";
import pending from "../../assets/icons/pending.svg";
import {FC} from "react";

const ApplicationStats: FC = ()=>{
    return <>
        <div
            className="w-full md:h-[122px] bg-[#FFFFFF] grid grid-cols-3 gap-x-2 md:gap-x-6 p-2 md:p-4 sm:items-baseline items-center justify-center">
            <div className="cursor-pointer md:bg-[#F7F7F7] p-2 flex md:justify-between items-center border-r-[1px] border-r-[#ccc] md:border-none">
                <div className="text-sm md:text-2xl">
                    <h3 className="text-gray-700">Jobs Applied</h3>
                    <p className="font-bold text-[#000000]">123k</p>
                </div>
                <div
                    className="hidden bg-[#56E5A1] h-[60px] w-[60px] rounded-[50%] md:flex justify-center items-center">
                    <img src={jobApplied} alt="job applied" className="w-fit h-auto rounded"/>
                </div>
            </div>

            <div className="cursor-pointer md:bg-[#F7F7F7] p-2 flex justify-between items-center border-r-[1px] border-r-[#ccc] md:border-none">
                <div className="text-sm md:text-2xl">
                    <h3 className="text-gray-700">Shortlisted</h3>
                    <p className="font-bold text-orange-500">10k</p>
                </div>
                <div
                    className="hidden bg-[#FA4E09] h-[60px] w-[60px] rounded-[50%] md:flex justify-center items-center">
                    <img src={shortlisted} alt="shortlisted" className="w-fit h-auto rounded"/>
                </div>
            </div>

            <div className="cursor-pointer md:bg-[#F7F7F7] p-2 flex justify-between items-center">
                <div className="text-sm md:text-2xl">
                    <h3 className="text-gray-700">Pending</h3>
                    <p className="font-bold text-yellow-500">123k</p>
                </div>
                <div
                    className="hidden bg-[#FD7E14] h-[60px] w-[60px] rounded-[50%] md:flex justify-center items-center">
                    <img src={pending} alt="pending" className="w-fit h-auto rounded"/>
                </div>
            </div>
        </div>
    </>
}

export default ApplicationStats;