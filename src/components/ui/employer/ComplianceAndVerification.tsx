import React from "react";

const ComplianceAndVerification: React.FC = ()=>{
    return (<section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
        <h3 className="font-lato text-[20px] mb-4">
            Compliance and Verifications
        </h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Business Registration Number</label>
                <input
                    type="url"
                    className="rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Tax Identification number</label>
                <input
                    type="url"
                    className="rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"
                />
            </div>
        </div>
    </section>);
}

export default ComplianceAndVerification;