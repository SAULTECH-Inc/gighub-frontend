import { Paystack } from "../../../assets/icons"
import { FaLocationDot } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { IoBagSharp } from "react-icons/io5";
const CompanyInfo = () => {
  return (
    <div className="relative sm:w-[350px] w-full rounded-[16px] cursor-pointer bg-white p-4 flex flex-col mx-auto border-l-[1px] border-[#E6E6E6]">
        <div className="flex items-center gap-2">
            <div className="bg-[#F7F8FA] rounded-md h-[80px] w-[80px]">
                <img src={Paystack} alt="paystack" className="w-[500px]" />
            </div>
            <div className="flex flex-col">
                <h2 className="text-black text-[20px] font-medium">Paystack Inc</h2>
                <p className="text-gray mt-2 text-[18px]">Financial Service Company</p>
            </div>
        </div>
        <div className="flex flex-col gap-y-4 mt-4">
            <div className="flex items-center gap-x-2">
                <FaLocationDot className="text-gray text-[20px]" />
                <span className="text-gray font-normal text-sm">Irland, Lagos, Nigeria</span>
            </div>
            <div className="flex items-center gap-x-2">
                <FaUser className="text-gray text-[20px]" />
                <span className="text-gray font-normal text-sm">750 employees on site</span>
            </div>
            <div className="flex items-center gap-x-2">
                <IoBagSharp className="text-gray text-[20px]" />
                <span className="text-gray font-normal text-sm">15 connection work here</span>
                <a href="" className="ml-16 text-[#6438C2]">See All</a>
            </div>
        </div>
        <div className="mt-6">
            <p className="text-[#8E8E8E] leading-6">Paystack is a Nigerian fintech company that provides businesses with payment solutions, enabling them to accept payments via cards, bank transfers, and mobile money. It processes over 1 trillion naira monthly and serves more than 60,000 businesses across Africa. Acquired by Stripe in 2020, it continues to expand its footprint in digital payments,</p>
            <div className="flex items-center justify-center mt-10">
            <button className=" w-full border-[1px] border-[#6438C2] px-4 py-2 rounded-[10px] bg-[#6438C2] text-white">Follow</button>
            </div>
        </div>
        <div className="flex flex-col gap-y-4 mt-10">
            <div className="flex items-center justify-between border-b-[1px] border-[#E6E6E6] pb-5">
                <h5 className="text-black font-medium">Other Roles</h5>
                <a href="" className="text-[#6438C2]">See All</a>
            </div>
            <div className="flex items-center justify-between border-b-[1px] border-[#E6E6E6] pb-5">
                <div className="flex flex-col">
                    <h5 className="text-black font-medium">Executive Business</h5>
                    <span className="text-sm text-gray">Posted 4 hours ago</span>
                </div>
                <span className="text-sm text-gray">Onsite<br /> Permanent work</span>
            </div>
            <div className="flex items-center justify-between border-b-[1px] border-[#E6E6E6] pb-5">
                <div className="flex flex-col">
                    <h5 className="text-black font-medium">UIUX Designer</h5>
                    <span className="text-sm text-gray">Posted 4 hours ago</span>
                </div>
                <span className="text-sm text-gray">Onsite<br /> Permanent work</span>
            </div>
        </div>
    </div>
  )
}

export default CompanyInfo