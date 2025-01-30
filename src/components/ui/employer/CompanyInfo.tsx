import React from "react";

const CompanyInfo: React.FC = ()=>{
    return (
    <section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] ">
        <h3 className="font-lato text-[20px] mb-4">
            Company Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Company Name</label>
                <input
                    type="text"
                    className=" rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"/>
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Industry</label>
                <select
                    className="rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"
                >
                    <option value="" disabled selected>
                    </option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Company Size</label>
                <select
                    className="rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"
                >
                    <option value="" disabled selected>
                    </option>
                    <option value="small">1-10 Employees</option>
                    <option value="medium">11-50 Employees</option>
                    <option value="large">51-200 Employees</option>
                    <option value="enterprise">201+ Employees</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Country</label>
                <select
                    className="rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"
                >
                    <option value="" disabled selected>
                    </option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                    <option value="ng">Nigeria</option>
                    <option value="in">India</option>
                </select>
            </div>

            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">City</label>
                <select
                    className="rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"
                >
                    <option value="" disabled selected>
                    </option>
                    <option value="new-york">New York</option>
                    <option value="london">London</option>
                    <option value="toronto">Toronto</option>
                    <option value="sydney">Sydney</option>
                    <option value="lagos">Lagos</option>
                    <option value="mumbai">Mumbai</option>
                </select>
            </div>

            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Address</label>
                <input
                    type="text"
                    className="rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"
                />
            </div>
        </div>
    </section>
    );
}

export default CompanyInfo;