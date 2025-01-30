import React from "react";

const CompanySocials: React.FC = ()=>{
    return (<section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">

        <h3 className="font-lato text-[20px] text-gray-700 mb-4">
            Social and Professional Links
        </h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">LinkedIn Profile</label>
                <input
                    type="url"
                    className="rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">GitHub</label>
                <input
                    type="url"
                    className="rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Twitter</label>
                <input
                    type="url"
                    className="rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Youtube</label>
                <input
                    type="url"
                    className="rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"
                />
            </div>
        </div>

    </section>);
}
export default CompanySocials;