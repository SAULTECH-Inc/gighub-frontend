import jobApplied from "../../assets/icons/jobApplied.svg";
import shortlisted from "../../assets/icons/shortlisted.svg";
import pending from "../../assets/icons/pending.svg";
import {FC} from "react";

const ApplicationStats: FC = ()=>{
    return <>
        <div
            className="w-full h-[122px] bg-[#FFFFFF] grid grid-cols-3 gap-x-6 p-4 items-center justify-center">
            <div className="cursor-pointer bg-[#F7F7F7] p-4 flex justify-between items-center">
                <div>
                    <h3 className="text-gray-700">Jobs Applied</h3>
                    <p className="text-2xl font-bold text-[#000000]">123k</p>
                </div>
                <div
                    className="bg-[#56E5A1] h-[60px] w-[60px] rounded-[50%] flex justify-center items-center">
                    <img src={jobApplied} alt="job applied" className="w-fit h-auto rounded"/>
                </div>
            </div>

            <div className="cursor-pointer bg-[#F7F7F7] p-4 flex justify-between items-center">
                <div>
                    <h3 className="text-gray-700">Shortlisted</h3>
                    <p className="text-2xl font-bold text-orange-500">10k</p>
                </div>
                <div
                    className="bg-[#FA4E09] h-[60px] w-[60px] rounded-[50%] flex justify-center items-center">
                    <img src={shortlisted} alt="shortlisted" className="w-fit h-auto rounded"/>
                </div>
            </div>

            <div className="cursor-pointer bg-[#F7F7F7] p-4 flex justify-between items-center">
                <div>
                    <h3 className="text-gray-700">Pending</h3>
                    <p className="text-2xl font-bold text-yellow-500">123k</p>
                </div>
                <div
                    className="bg-[#FD7E14] h-[60px] w-[60px] rounded-[50%] flex justify-center items-center">
                    <img src={pending} alt="pending" className="w-fit h-auto rounded"/>
                </div>
            </div>
        </div>
    </>
}

export default ApplicationStats;