import React from "react";

const CompanyContactInfo: React.FC = ()=>{
    return (<section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
        <h3 className="font-lato text-[20px] text-gray-700 mb-4">
            Contact Information
        </h3>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10">
            <div className="w-full flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Email Address</label>
                <input
                    type="email"
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="w-full flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Phone Number</label>
                <input
                    type="tel"
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="w-full flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Manager Email</label>
                <input
                    type="email"
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="w-full flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Manager Phone Number</label>
                <input
                    type="tel"
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </div>

    </section>);
}

export default CompanyContactInfo;