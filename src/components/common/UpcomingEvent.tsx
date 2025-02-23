import React from "react";
import {motion} from "framer-motion";
import questionMark from "../../assets/icons/question.svg";

const UpcomingEvent: React.FC = () => {
    return (
        <div className="mt-6 mx-auto w-full h-full">
            <div className="flex items-center justify-evenly md:space-x-[100px]">
                <h3 className="text-lg font-medium text-gray-700">Upcoming Schedule</h3>
                <div
                    className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-[#6E4AED] cursor-pointer hover:bg-gray-200"
                    aria-label="Help"
                    title="Upcoming events information"
                >
                    <div className="flex justify-center items-center p-1 w-[25px] h-[25px]  rounded-full border-[#D9D9D9] border-[1px]">
                        <img src={questionMark} alt="question mark" />
                    </div>
                </div>
            </div>
            {/* Events List */}
            {[{ color: "border-l-[#F36863]" }, { color: "border-l-[#6E4AED]" }].map((event, idx) => (
                <motion.div
                    key={idx}
                    className="flex items-center bg-gray-50 p-3 my-10 md:my-4 w-full h-[59px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Parent Container */}
                    <div className="flex justify-between items-center w-full gap-x-2 md:gap-x-5">
                        {/* Date Column */}
                        <div className="text-center w-[10%] h-[59px] flex flex-col justify-center items-center">
                            <p className="text-sm text-gray-600">Tue</p>
                            <p className="text-lg font-bold text-gray-800">10</p>
                        </div>

                        {/* Event Details */}
                        <div
                            className={`flex items-center w-[90%] h-[80px] md:h-[59px] rounded-[16px] bg-[#F5F5F5] pl-3 pr-2`}
                        >
                            <div
                                className={`w-full h-[35px] border-l-[3px] ${event.color} flex flex-col justify-between pl-2`}
                            >
                                <p className="text-xs md:text-sm font-semibold text-gray-800">
                                    Google Job Interview
                                </p>
                                <p className="text-xs md:text-[10px] text-gray-500">
                                    9:00-10:00 &bull; Zoom Meeting
                                </p>
                            </div>
                            {/* View Button */}
                            <button
                                className="px-4 py-1 w-[65px] h-[30px] text-[13px] font-semibold text-[#6E4AED] bg-white rounded-full hover:bg-purple-500 hover:text-white transition"
                            >
                                View
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}

        </div>
    );
};

export default UpcomingEvent;
