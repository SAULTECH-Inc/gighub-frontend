import React from "react";
import CustomDropdown from "../../../common/CustomDropdown.tsx";

const PersonalInfo: React.FC = () => {
    return (
        <section className="mt-4 pt-5 border-t-[2px] border-t-[#E6E6E6]">
            <h3 className="font-lato text-[20px] mb-4">
                Personal Information
            </h3>
            <div className="w-full flex flex-col">
                <div className="w-full lg:flex grid grid-cols-1 gap-x-8 space-y-2">
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Full name</label>
                        <input
                            type="text"
                            className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Email address</label>
                        <input
                            type="text"
                            className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                </div>
                <div className="w-full lg:flex grid grid-cols-1 gap-x-8 space-y-2">
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Phone number</label>
                        <input
                            type="text"
                            className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Date of birth</label>
                        <input
                            type="date"
                            className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                </div>
                <div className="w-full lg:flex grid grid-cols-1 gap-x-8 space-y-2">
                    <div className="w-full flex flex-col">
                        <label className="text-sm text-gray-600 mb-1">Country</label>
                        <CustomDropdown
                            placeholder="Nigeria"
                            className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                        />
                    </div>

                    <div className="w-full flex flex-col gap-x-8">
                        <label className="text-sm text-gray-600 mb-1">City</label>
                        <CustomDropdown
                            placeholder="Lagos"
                            className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                        />
                    </div>
                </div>

                <div className="w-full flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Address</label>
                    <input
                        type="text"
                        className="rounded-[10px]  bg-[#F7F8FA] w-full p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>

            </div>
        </section>
    );
}

export default PersonalInfo;