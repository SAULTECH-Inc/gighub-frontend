import React from "react";

const CompanyContactInfo: React.FC = ()=>{
    return (<section className="w-full mt-4 pt-5 border-t-[2px] border-t-[#000000] mx-auto">
        <h3 className="font-lato text-[20px] text-gray-700 mb-4">
            Contact Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Email Address</label>
                <input
                    type="email"
                    className="rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Phone Number</label>
                <input
                    type="tel"
                    className="rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Manager Email</label>
                <input
                    type="email"
                    className="rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Manager Phone Number</label>
                <input
                    type="tel"
                    className="rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"
                />
            </div>
        </div>

    </section>);
}

export default CompanyContactInfo;