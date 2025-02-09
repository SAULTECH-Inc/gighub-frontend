import React from "react";

const CompanySocials: React.FC = ()=>{
    return (<section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] ">

        <h3 className="font-lato text-[20px] text-gray-700 mb-4">
            Social and Professional Links
        </h3>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10">
            <div className="flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">LinkedIn Profile</label>
                <input
                    type="url"
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">GitHub</label>
                <input
                    type="url"
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Twitter</label>
                <input
                    type="url"
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Youtube</label>
                <input
                    type="url"
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </div>

    </section>);
}
export default CompanySocials;