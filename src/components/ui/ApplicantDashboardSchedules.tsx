import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Plus,
  CalendarDays,
} from "lucide-react";
import UpcomingEvent from "../common/UpcomingEvent.tsx";
import { fetchMyInterviews } from "../../services/api";
import useModalStore from "../../store/modalStateStores.ts";

interface Event {
  id: string;
  date: string;
  startTime: string;
  title: string;
  type?: "interview" | "meeting" | "other";
  [key: string]: any;
}

const ApplicantDashboardSchedules: React.FC = memo(() => {
  const { openModal } = useModalStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => new Date(), []);

  const [startOfWeek, setStartOfWeek] = useState(() => {
    const start = new Date(today);
    start.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    return start;
  });

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchMyInterviews(1, 10);
        const transformedEvents = (response.data || []).map((item: any) => ({
          ...item,
          type: item.type || "interview",
        }));
        setEvents(transformedEvents);
      } catch (err: any) {
        setError(err?.message || "Failed to load events");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents().then((r) => r);
  }, []);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + index);
      return {
        dayName: day.toLocaleString("default", { weekday: "short" }),
        date: day.getDate(),
        month: day.toLocaleString("default", { month: "long" }),
        year: day.getFullYear(),
        fullDate: day,
        isToday: day.toDateString() === today.toDateString(),
        isPast: day < today && day.toDateString() !== today.toDateString(),
      };
    });
  }, [startOfWeek, today]);

  const goToPreviousWeek = useCallback(() => {
    setStartOfWeek((prev) => {
      const newStart = new Date(prev);
      newStart.setDate(prev.getDate() - 7);
      return newStart;
    });
  }, []);

  const goToNextWeek = useCallback(() => {
    setStartOfWeek((prev) => {
      const newStart = new Date(prev);
      newStart.setDate(prev.getDate() + 7);
      return newStart;
    });
  }, []);

  const goToToday = useCallback(() => {
    const start = new Date(today);
    start.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    setStartOfWeek(start);
  }, [today]);

  const getEventsForDay = useCallback(
    (day: Date) => {
      return events.filter((event) => {
        const eventDate = new Date(event.date + "T" + event.startTime);
        return (
          eventDate.getFullYear() === day.getFullYear() &&
          eventDate.getMonth() === day.getMonth() &&
          eventDate.getDate() === day.getDate()
        );
      });
    },
    [events],
  );

  const handleEventClick = useCallback(
    (dayEvents: Event[]) => {
      if (dayEvents.length > 0) {
        setSelectedEvent(dayEvents[0]);
        openModal("applicant-schedule-modal");
      }
    },
    [openModal],
  );

  const headerDate = weekDays[0];
  const isCurrentWeek = useMemo(() => {
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    return startOfWeek.toDateString() === currentWeekStart.toDateString();
  }, [startOfWeek, today]);

  return (
    <div className="h-auto transition-all duration-300 hover:shadow-xl lg:h-[59%]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-auto rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Header */}
        <div className="border-b border-slate-100 p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <div className="flex min-w-0 flex-1 items-center space-x-2 sm:space-x-3">
              <div className="flex-shrink-0 rounded-lg bg-indigo-100 p-1.5 sm:p-2">
                <CalendarDays className="h-4 w-4 text-indigo-600 sm:h-5 sm:w-5" />
              </div>
              <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                Schedule
              </h2>
            </div>

            {!isCurrentWeek && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToToday}
                className="flex-shrink-0 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 sm:px-3 sm:py-1.5"
              >
                Today
              </motion.button>
            )}
          </div>

          {/* Month/Year Display */}
          <motion.div
            key={`${headerDate.month}-${headerDate.year}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h3 className="text-lg font-semibold text-slate-800 sm:text-xl">
              {headerDate.month} {headerDate.year}
            </h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Week of {headerDate.month} {headerDate.date}
            </p>
          </motion.div>
        </div>

        {/* Week Navigation */}
        <div className="px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Previous Week Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToPreviousWeek}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:h-10 sm:w-10"
              aria-label="Previous Week"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>

            {/* Days Grid */}
            <div className="mx-2 w-full flex-1 overflow-x-auto sm:mx-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid min-w-[280px] grid-cols-7 gap-0.5 sm:min-w-0 sm:gap-1 md:gap-2"
              >
                {weekDays.map((day, index) => {
                  const dayEvents = getEventsForDay(day.fullDate);
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative flex cursor-pointer flex-col items-center rounded-lg p-1.5 transition-all sm:p-2 md:p-3 ${
                        day.isToday
                          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg"
                          : day.isPast
                            ? "text-slate-400 hover:bg-slate-50"
                            : "text-slate-700 hover:bg-slate-100"
                      }`}
                      onClick={() => hasEvents && handleEventClick(dayEvents)}
                    >
                      {/* Day Name */}
                      <span
                        className={`mb-1 text-[10px] font-medium sm:text-xs ${
                          day.isToday ? "text-white" : "text-slate-500"
                        }`}
                      >
                        {day.dayName}
                      </span>

                      {/* Date */}
                      <span
                        className={`text-sm font-bold sm:text-lg ${
                          day.isToday
                            ? "text-white"
                            : day.isPast
                              ? "text-slate-400"
                              : "text-slate-900"
                        }`}
                      >
                        {day.date}
                      </span>

                      {/* Event Indicators */}
                      {hasEvents && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          className="mt-1 flex items-center space-x-0.5 sm:mt-2 sm:space-x-1"
                        >
                          {dayEvents.slice(0, 2).map((_, eventIndex) => (
                            <div
                              key={eventIndex}
                              className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${
                                day.isToday
                                  ? "bg-white"
                                  : eventIndex === 0
                                    ? "bg-orange-400"
                                    : "bg-purple-400"
                              }`}
                            />
                          ))}
                          {dayEvents.length > 2 && (
                            <span
                              className={`text-[10px] font-medium sm:text-xs ${
                                day.isToday ? "text-white" : "text-slate-600"
                              }`}
                            >
                              +{dayEvents.length - 2}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Next Week Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToNextWeek}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:h-10 sm:w-10"
              aria-label="Next Week"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Upcoming Events Section */}
        <div className="max-h-64 flex-1 overflow-y-auto p-4 sm:max-h-80 sm:p-6 lg:max-h-none">
          {loading ? (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <div className="flex items-center space-x-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600 sm:h-5 sm:w-5"></div>
                <span className="text-xs text-slate-600 sm:text-sm">
                  Loading events...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-6 text-center sm:py-8">
              <AlertCircle className="mb-2 h-8 w-8 text-red-400 sm:mb-3 sm:h-10 sm:w-10" />
              <h3 className="mb-1 text-xs font-medium text-slate-900 sm:text-sm">
                Error Loading Events
              </h3>
              <p className="text-xs text-slate-500">{error}</p>
            </div>
          ) : (
            <UpcomingEvent
              events={events}
              loading={loading}
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
            />
          )}
        </div>

        {/* Quick Add Button */}
        <div className="border-t border-slate-100 p-3 sm:p-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center space-x-2 rounded-lg border-2 border-dashed border-slate-300 py-2.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 sm:py-3 sm:text-sm"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Add New Event</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
});

ApplicantDashboardSchedules.displayName = "ApplicantDashboardSchedules";

export default ApplicantDashboardSchedules;
