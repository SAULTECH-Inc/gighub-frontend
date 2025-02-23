import CustomDropdown from "../../../common/CustomDropdown.tsx";
import RichTextEditor from "../../../common/RichTextEditor.tsx";
import React from "react";
import useModalStore from "../../../../store/modalStateStores.ts";

interface AddExperienceModalProp {
    modalId: string;
}

const AddExperienceModal: React.FC<AddExperienceModalProp> = ({modalId}) => {
    const {modals, closeModal} = useModalStore();
    const isOpen = modals[modalId];

    if (!isOpen) return null;
    //   flex flex-col justify-evenly py-[5px]
    return (<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">

        <form
            className="relative m-2 w-[360px] h-[680px] md:w-[690px] md:h-[850px] lg:w-[820px] lg:h-[830px] p-5 md:p-8 lg:p-10 shadow-lg bg-white rounded-[16px] flex flex-col gap-y-5 overflow-y-scroll md:overflow-y-hidden">

            <h3>Not Specified</h3>
            <span className="absolute top-0 right-0 text-purple-600">Done</span>
            <div className="w-full flex flex-col md:flex-row gap-x-6">
                <div className="w-full flex flex-col gap-y-2">
                    <label>Degree</label>
                    <CustomDropdown
                        placeholder="Enter school name"
                        className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 lg:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>
                <div className="w-full flex flex-col gap-y-2">
                    <label>Field of Study</label>
                    <CustomDropdown
                        placeholder="Enter field of study"
                        className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 lg:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-x-6">
                <div className="w-full flex flex-col gap-y-2">
                    <label>Institution</label>
                    <CustomDropdown
                        placeholder="Enter institution"
                        className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 lg:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>
                <div className="w-full flex flex-col gap-y-2">
                    <label>Country</label>
                    <CustomDropdown
                        placeholder="Enter country"
                        className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 lg:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>
            </div>
            <div className="w-full flex md:flex-row flex-col lg:gap-x-6 gap-x-2">
                <div className="w-full md:w-1/2 flex flex-col gap-y-2">
                    <label>City</label>
                    <CustomDropdown
                        placeholder="Enter city"
                        className="rounded-[10px] text-start  bg-[#F7F8FA] w-full p-2 lg:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"
                    />
                </div>
                <div className="lg:w-1/2 w-full flex flex-col md:flex-row lg:gap-x-6 gap-x-2">
                    <div className="w-full md:w-1/2 flex flex-col gap-y-2">
                        <label>Start</label>
                        <input type="date"
                               className="rounded-[10px]  bg-[#F7F8FA] w-full p-2 lg:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col gap-y-2">
                        <label>End</label>
                        <input type="date"
                               className="rounded-[10px]  bg-[#F7F8FA] w-full p-2 lg:p-3 border-[1px] border-[#E3E6F3] focus:ring-0 focus:border-[1px] focus:border-[#E6E6E6] focus:outline-none"/>
                    </div>
                </div>
            </div>
            <div className="flex lg:justify-end justify-start">
                <span>
                <input type="checkbox"/>
                <label className="ml-2">Currently there</label>
            </span>
            </div>

            <div className="w-full flex flex-col gap-y-2 mb-0 py-0">
                <label>Description</label>
                <RichTextEditor/>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={() => closeModal(modalId)}
                    className="px-4 py-2 border-[#E6E6E6] border-[1px] w-[197px] rounded-[10px] bg-[#FFFFFF] text-purple-600 font-medium">
                    Update
                </button>
                <button
                    onClick={() => closeModal(modalId)}
                    className="ml-4 px-4 py-2 border-[#E6E6E6] border-[1px] w-[197px] rounded-[10px] bg-[#FFFFFF] text-gray-500 font-medium">
                    Cancel
                </button>
            </div>
        </form>
    </div>)
}

export default AddExperienceModal;