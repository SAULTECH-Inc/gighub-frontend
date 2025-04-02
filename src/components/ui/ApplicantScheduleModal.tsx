import useModalStore from "../../store/modalStateStores.ts";
import cancel from "../../assets/icons/cancel.svg";
import profilepics from "../../assets/images/profilepics.png";
import React from "react";
interface ModalProps {
    modalId: string;
}
const ApplicantScheduleModal: React.FC<ModalProps> = ({
    modalId
                                })=>{
    const { modals, closeModal } = useModalStore();
    const isOpen = modals[modalId]; // Reactive state for this modal
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-[16px] shadow-xl flex flex-col justify-evenly w-[568px] h-[690px] overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-[#6438C2] to-[#FFFFFF] rounded-t-[16px] h-[113px] flex items-center -mt-9">
                    {/* Close Button */}
                    <div
                        onClick={()=>closeModal(modalId)}
                        className="cursor-pointer rounded-full w-[36px] h-[34px] bg-white text-black flex justify-center items-center p-2 absolute top-4 right-4 focus:outline-none"
                    >
                        <img className="cursor-pointer" src={cancel} alt="cancel" />
                    </div>
                    <div className="absolute px-3 top-[70px] w-[530px] flex justify-between items-end">
                        {/* Profile Image */}
                        <img
                            src={profilepics}
                            className="ml-3 rounded-full w-[100px] h-[100px] flex-shrink-0"
                            alt="profile pics"
                        />
                        <div className="ml-4 mb-0 pb-0 pt-5 flex justify-between items-end flex-1">
                            {/* Company Info */}
                            <div className="flex flex-col">
                                <h2 className="text-black text-[20px] font-bold">
                                    EdenLife Inc
                                </h2>
                                <p className="text-[#7F7F7F] text-[16px]">
                                    Lagos state Nigeria
                                </p>
                            </div>
                            {/* Remote Work */}
                            <p className="text-[#6B5AED] text-[20px] font-medium">
                                Remote work
                            </p>
                        </div>
                    </div>
                </div>

                {/* Application Pending and View Profile */}
                <div className="w-full flex justify-between items-center px-6 mt-[100px]">
                    <div className="bg-[#FA4E0930] border-[1px] border-[#FFE4B5] text-[#FA4E09] text-[16px] w-[128px] h-[27px] flex justify-center items-center text-center font-medium px-2 py-3  rounded-[16px]">
                        Shortlisted
                    </div>
                    <button className="bg-[#6438C2] hover:bg-purple-600 text-white text-[16px] w-[147px] h-[34px] flex justify-center items-center font-medium px-4 py-2 rounded-[10px]">
                        View Profile
                    </button>
                </div>

                {/* Application Details */}
                <div className="grid grid-cols-2 p-4 mt-6 w-[512px] h-[178px] justify-center items-center rounded-[16px] border-[1px] border-[#E6E6E6] mx-auto">
                    <div className="pl-4">
                        <h4 className="text-black text-[16px] font-semibold">Interview Date</h4>
                        <p className="text-[#6438C2] text-[16px]">10th September, 2023</p>
                    </div>
                    <div className="pl-4">
                        <h4 className="text-black text-[16px] font-semibold">Interview Time</h4>
                        <p className="text-[#6438C2] text-[16px]">10:00 AM</p>
                    </div>
                    <div className="pl-4">
                        <h4 className="text-black text-[16px] font-semibold">Interview Type</h4>
                        <p className="text-[#6438C2] text-[16px]">In Person</p>
                    </div>
                    <div className="pl-4">
                        <h4 className="text-black text-[16px] font-semibold">Meeting Link</h4>
                        <p className="text-[#6438C2] text-[16px]">Zoom</p>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex items-center justify-end px-6 py-4 mt-6 gap-x-4">
                    <button
                        onClick={()=>closeModal(modalId)}
                        className="bg-gray-100 hover:bg-gray-200 border-[1px] border-[#E6E6E6] w-[181px] text-gray-700 text-[16px] px-6 py-2 rounded-[10px]"
                    >
                        Cancel
                    </button>
                    <button className="bg-[#6438C2] hover:bg-purple-600 text-white text-[16px] px-6 py-2 rounded-[10px]">
                        Withdraw application
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ApplicantScheduleModal;
