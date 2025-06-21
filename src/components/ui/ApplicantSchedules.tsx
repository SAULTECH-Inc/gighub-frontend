import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import eventPurple from "../../assets/icons/eventPurple.svg";
import eventOrange from "../../assets/icons/eventOrange.svg";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import UpcomingEvent from "../common/UpcomingEvent.tsx";
import { fetchMyInterviews } from "../../services/api";
import useModalStore from "../../store/modalStateStores.ts";

const ApplicantSchedules: React.FC = () => {
  const { openModal } = useModalStore();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      return await fetchMyInterviews(1, 10);
    };
    fetchEvents()
      .then((res) => {
        console.log("Fetched events:", res.data);
        setEvents(res.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
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
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date + "T" + event.startTime);
      return (
        eventDate.getFullYear() === day.getFullYear() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getDate() === day.getDate()
      );
    });
  };

  // Get the header date (Monday of the week)
  const headerDate = weekDays[0];

  return (
    <div className="flex w-full flex-col">
      <div className="mx-auto h-[627px] w-full rounded-[16px] bg-white p-5 shadow">
        {/* Header */}
        <motion.div
          className="mb-4 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            key={`${headerDate.month}-${headerDate.date}-${headerDate.year}`}
            className="text-gray-800 text-xl font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {headerDate.month} {headerDate.date}, {headerDate.year}
          </motion.h2>
        </motion.div>

        {/* Days with Arrows */}
        <div className="mt-4 flex h-[61px] items-center justify-between">
          {/* Left Arrow */}
          <motion.button
            onClick={goToPreviousWeek}
            className="text-gray-300 hover:text-gray-600 focus:outline-none"
            whileHover={{ color: "#4B5563" }}
            aria-label="Previous Week"
          >
            <MdOutlineArrowBackIosNew color={`#ccc`} size={24} />
          </motion.button>

          {/* Days */}
          <motion.div
            className="mx-2 flex flex-grow justify-between"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {weekDays.map((day, index) => {
              const dateObj = new Date(day.year, today.getMonth(), day.date);
              const eventsForDay = getEventsForDay(dateObj);

              return (
                <motion.div
                  key={index}
                  className={`flex flex-col items-center ${
                    day.isToday
                      ? "h-[61px] w-[41px] rounded-[10px] bg-[#6438C2] pb-3 text-white"
                      : "text-gray-600"
                  }`}
                >
                  <span className="text-sm">{day.dayName}</span>
                  <span className="text-gray-500 text-xs">{day.date}</span>

                  {/* Events */}
                  {eventsForDay.length > 0 && (
                    <motion.span
                      onClick={() => {
                        setSelectedEvent(eventsForDay[0]);
                        openModal("applicant-schedule-modal");
                      }}
                      className="relative mt-2 flex cursor-pointer"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <img
                        src={eventOrange}
                        alt="event orange"
                        className="relative z-20 h-3 w-3 rounded-full border-2 border-white"
                      />
                      <img
                        src={eventPurple}
                        alt="event purple"
                        className="relative z-10 -ml-1 h-3 w-3 rounded-full border-2 border-white"
                      />
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Right Arrow */}
          <motion.button
            onClick={goToNextWeek}
            className="text-gray-300 hover:text-gray-600 focus:outline-none"
            whileHover={{ color: "#4B5563" }}
            aria-label="Next Week"
          >
            <MdOutlineArrowForwardIos color={`#ccc`} size={24} />
          </motion.button>
        </div>

        <hr className="mx-auto my-6 w-full border-[#F5F5F5]" />

        {/* Upcoming Events Section */}
        <UpcomingEvent
          events={events}
          loading={loading}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
        />
      </div>
    </div>
  );
};

export default ApplicantSchedules;
