import React, { useState } from "react";
import { motion } from "framer-motion";
import eventPurple from "../../assets/icons/eventPurple.svg";
import eventOrange from "../../assets/icons/eventOrange.svg";
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from "react-icons/md";
import UpcomingEvent from "../common/UpcomingEvent.tsx";

const ApplicantSchedules: React.FC = () => {
    const today = new Date();

    // State to track the current week's start date
    const [startOfWeek, setStartOfWeek] = useState(() => {
        const start = new Date(today);
        start.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // Start from Monday
        return start;
    });

    // Get week days based on the start of the week
    const weekDays = Array.from({ length: 7 }, (_, index) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + index);
        return {
            dayName: day.toLocaleString("default", { weekday: "short" }), // e.g., "Mon"
            date: day.getDate(),
            month: day.toLocaleString("default", { month: "long" }), // e.g., "January"
            year: day.getFullYear(),
            isToday: day.toDateString() === today.toDateString(), // Highlight today
        };
    });

    // Handlers to navigate weeks
    const goToPreviousWeek = () => {
        setStartOfWeek((prev) => {
            const newStart = new Date(prev);
            newStart.setDate(prev.getDate() - 7); // Move back 7 days
            return newStart;
        });
    };

    const goToNextWeek = () => {
        setStartOfWeek((prev) => {
            const newStart = new Date(prev);
            newStart.setDate(prev.getDate() + 7); // Move forward 7 days
            return newStart;
        });
    };

    // Get the header date (Monday of the week)
    const headerDate = weekDays[0];

    return (
        <div className="w-full flex flex-col">
            <div className="w-full h-[530px] mx-auto bg-white rounded-[16px] shadow p-5">
                {/* Header */}
                <motion.div
                    className="flex justify-center items-center mb-4"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.8}}
                >
                    <motion.h2
                        key={`${headerDate.month}-${headerDate.date}-${headerDate.year}`}
                        className="text-xl font-semibold text-gray-800"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                    >
                        {headerDate.month} {headerDate.date}, {headerDate.year}
                    </motion.h2>
                </motion.div>

                {/* Days with Arrows */}
                <div className="flex items-center justify-between mt-4 h-[61px]">
                    {/* Left Arrow */}
                    <motion.button
                        onClick={goToPreviousWeek}
                        className="text-gray-300 hover:text-gray-600 focus:outline-none"
                        whileHover={{color: "#4B5563"}}
                        aria-label="Previous Week"
                    >
                        <MdOutlineArrowBackIosNew color={`#ccc`} size={24}/>
                    </motion.button>

                    {/* Days */}
                    <motion.div
                        className="flex justify-between flex-grow mx-2"
                        initial={{opacity: 0, x: -50}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5}}
                    >
                        {weekDays.map((day, index) => (
                            <motion.div
                                key={index}
                                className={`flex flex-col items-center ${
                                    day.isToday
                                        ? "text-white bg-[#6438C2] rounded-[10px] w-[41px] h-[61px] p-2"
                                        : "text-gray-600"
                                }`}
                            >
                                <span className="text-sm">{day.dayName}</span>
                                <span className="text-xs text-gray-500">{day.date}</span>

                                {/* Events */}
                                {["Mon", "Fri", "Sat"].includes(day.dayName) && (
                                    <motion.span
                                        className="relative flex mt-2"
                                        initial={{scale: 0}}
                                        animate={{scale: 1}}
                                        transition={{duration: 0.3, delay: index * 0.05}}
                                    >
                                        <img
                                            src={eventOrange}
                                            alt="event orange"
                                            className="w-3 h-3 rounded-full border-2 border-white relative z-20"
                                        />
                                        <img
                                            src={eventPurple}
                                            alt="event purple"
                                            className="-ml-1 w-3 h-3 rounded-full border-2 border-white relative z-10"
                                        />
                                    </motion.span>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Right Arrow */}
                    <motion.button
                        onClick={goToNextWeek}
                        className="text-gray-300 hover:text-gray-600 focus:outline-none"
                        whileHover={{color: "#4B5563"}}
                        aria-label="Next Week"
                    >
                        <MdOutlineArrowForwardIos color={`#ccc`} size={24}/>
                    </motion.button>
                </div>

                <hr className="border-[#F5F5F5] my-6 w-full mx-auto"/>

                {/* Upcoming Events Section */}
                <UpcomingEvent/>
            </div>
        </div>

    );
};

export default ApplicantSchedules;
