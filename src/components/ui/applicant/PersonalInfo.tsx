import React from "react";

const ApplicantInfo: React.FC = ()=>{
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    return (
        <section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
            <h3 className="font-lato text-[20px] mb-4">
                Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Full name</label>
                    <input
                        type="text"
                        className=" rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"/>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Email address</label>
                    <input
                        type="text"
                        className=" rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"/>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Phone number</label>
                    <input
                        type="text"
                        className=" rounded-[10px]  bg-[#F7F8FA] w-[427px] h-[37px] border-none"/>
                </div>
                <div className="flex space-x-4">
                    {/* Year of Birth */}
                    <div className="flex flex-col">
                        <label className="text-sm font-lato mb-1">Year of birth</label>
                        <select
                            className="p-2 border w-[140px] rounded-[10px] h-[37px] bg-[#F7F8FA] border-none"
                        >
                            <option value=""></option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Month of Birth */}
                    <div className="flex flex-col">
                        <label className="text-sm font-lato mb-1">Month of birth</label>
                        <select
                            className="p-2 border w-[140px] rounded-[10px] h-[37px] bg-[#F7F8FA] border-none"
                        >
                            <option value=""></option>
                            {months.map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Day of Birth */}
                    <div className="flex flex-col">
                        <label className="text-sm font-lato mb-1">Day of birth</label>
                        <select
                            className="p-2 border w-[140px] rounded-[10px] h-[37px] bg-[#F7F8FA] border-none"
                        >
                            <option value=""></option>
                            {days.map((day) => (
                                <option key={day} value={day}>
                                    {day}
                                </option>
                            ))}
                        </select>
                    </div>
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
                        className="rounded-[10px]  bg-[#F7F8FA] w-[964px] h-[37px] border-none"
                    />
                </div>
            </div>
        </section>
    );
}

export default ApplicantInfo;