import React from "react";
import {useAuth} from "../../../../store/useAuth.ts";

const CompanyInfo: React.FC = ()=>{
    const {employer} = useAuth();
    return (
    <section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6] ">
        <h3 className="font-lato text-[20px] mb-4">
            Company Information
        </h3>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10">
            <div className="flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Company Name</label>
                <input
                    type="text"
                    value={
                        employer?.companyName || ""
                    }
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
            </div>
            <div className="w-full flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Industry</label>
                <select
                    value={
                        employer?.industry || ""
                    }
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
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
            <div className="w-full flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Company Size</label>
                <select
                    value={
                        employer?.companySize || ""
                    }
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                >
                    <option value="" disabled selected>
                    </option>
                    <option value="small">1-10 Employees</option>
                    <option value="medium">11-50 Employees</option>
                    <option value="large">51-200 Employees</option>
                    <option value="enterprise">201+ Employees</option>
                </select>
            </div>
            <div className="w-full flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Country</label>
                <select
                    value={
                        employer?.country || ""
                    }
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
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
                <label className="text-[16px] text-gray-600 mb-1">City</label>
                <select
                    value={
                        employer?.city || ""
                    }
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
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

            <div className="w-full flex flex-col">
                <label className="text-[16px] text-gray-600 mb-1">Address</label>
                <input
                    value={
                        employer?.companyAddress || ""
                    }
                    type="text"
                    className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </div>
    </section>
    );
}

export default CompanyInfo;