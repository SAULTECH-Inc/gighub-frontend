import React from "react";
import RichTextEditor from "../../../common/RichTextEditor.tsx";
import CustomDropdown from "../../../common/CustomDropdown.tsx";

const ExperienceUpdateForm: React.FC = ()=>{
    return (<div className="w-full flex flex-col gap-y-5">
        <div className="w-full flex flex-col md:flex-row gap-x-2 mg:gap-x-6 gap-y-3">
            <div className="w-full flex flex-col gap-y-2">
                <label>Degree</label>
                <CustomDropdown
                    placeholder="Enter school name"
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="w-full flex flex-col gap-y-2">
                <label>Field of Study</label>
                <CustomDropdown
                    placeholder="Enter field of study"
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </div>
        <div className="w-full flex  flex-col md:flex-row gap-x-2 md:gap-x-6 gap-y-3">
            <div className="w-full flex flex-col gap-y-2">
                <label>Institution</label>
                <CustomDropdown
                    placeholder="Enter institution"
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="w-full flex flex-col gap-y-2">
                <label>Country</label>
                <CustomDropdown
                    placeholder="Enter country"
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
        </div>
        <div className="w-full flex  flex-col md:flex-row gap-x-2 gap-y-3 md:gap-x-6">
            <div className="md:w-1/2 flex flex-col gap-y-2">
                <label>City</label>
                <CustomDropdown
                    placeholder="Enter city"
                    className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                />
            </div>
            <div className="md:w-1/2 flex gap-x-2 md:gap-x-6 px-2 md:px-0">
                <div className="w-1/2 flex flex-col gap-y-2">
                    <label>Start</label>
                    <input type="date"
                           className="rounded-[10px]  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                </div>
                <div className="w-1/2 flex flex-col gap-y-2">
                    <label>End</label>
                    <input type="date"
                           className="rounded-[10px]  bg-[#F7F8FA] w-full p-2 text-sm md:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                </div>
            </div>
        </div>

        <div className="w-full flex flex-col gap-y-2 mb-0 py-0">
            <label>Description</label>
            <RichTextEditor/>
        </div>
        <div className="flex justify-end">
            <button
                className="px-4 py-2 border-[#E6E6E6] border-[1px] w-[197px] rounded-[10px] bg-[#FFFFFF] text-purple-600 font-medium">
                Update
            </button>
            <button
                className="ml-4 px-4 py-2 border-[#E6E6E6] border-[1px] w-[197px] rounded-[10px] bg-[#FFFFFF] text-gray-500 font-medium">
                Cancel
            </button>
        </div>
    </div>)
}

export default ExperienceUpdateForm;