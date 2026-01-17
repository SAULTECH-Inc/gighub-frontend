import React from "react";
import { motion } from "framer-motion";
import { HelpCircle, Calendar, Clock } from "lucide-react";
import ApplicantScheduleModal from "../ui/ApplicantScheduleModal.tsx";
import useModalStore from "../../store/modalStateStores.ts";
import { InterviewScheduleDetailsResponse } from "../../utils/types";

interface UpcomingEventProps {
  events: any[];
  selectedEvent: any;
  loading: boolean;
  setSelectedEvent: React.Dispatch<React.SetStateAction<any>>;
}

const UpcomingEvent: React.FC<UpcomingEventProps> = ({
  events,
  selectedEvent,
  loading,
  setSelectedEvent,
}) => {
  const { openModal } = useModalStore();

  return (
    <div className="mx-auto h-full w-full">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h3 className="truncate text-sm font-medium text-gray-700 sm:text-lg">
          Upcoming Schedule
        </h3>
        <div
          className="flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-[#6E4AED] transition-colors hover:bg-gray-200 sm:h-8 sm:w-8"
          aria-label="Help"
          title="Upcoming events information"
        >
          <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-6 sm:py-8">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-[#6E4AED]"></div>
            <span className="text-xs text-gray-500 sm:text-sm">
              Loading events...
            </span>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center sm:py-8">
          <div className="mb-3 rounded-full bg-gray-100 p-3 sm:mb-4 sm:p-4">
            <Calendar className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />
          </div>
          <p className="max-w-xs text-xs text-gray-500 sm:text-sm">
            No upcoming interviews scheduled. New events will appear here.
          </p>
        </div>
      ) : (
        <div className="max-h-48 space-y-3 sm:max-h-64 sm:space-y-4 lg:max-h-none">
          {events.map((event, idx) => {
            const dateObj = new Date(event.date);
            const weekday = dateObj.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const day = dateObj.getDate();

            return (
              <motion.div
                key={event.id}
                className="flex items-center rounded-xl bg-gray-50 p-3 transition-colors hover:bg-gray-100 sm:p-4"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex w-full items-center gap-3 sm:gap-4">
                  {/* Date Section */}
                  <div className="flex min-w-[50px] flex-col items-center justify-center rounded-lg bg-white p-2 text-center shadow-sm sm:min-w-[60px] sm:p-3">
                    <p className="text-xs font-medium text-gray-500">
                      {weekday}
                    </p>
                    <p className="text-lg font-bold text-gray-800 sm:text-xl">
                      {day}
                    </p>
                  </div>

                  {/* Event Details */}
                  <div className="min-w-0 flex-1">
                    <div
                      className={`rounded-lg border-l-4 bg-white ${
                        idx % 2 === 0
                          ? "border-l-[#F36863]"
                          : "border-l-[#6E4AED]"
                      } p-3 shadow-sm sm:p-4`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="mb-1 truncate text-xs font-semibold text-gray-800 sm:text-sm">
                            {event.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {event.startTime} - {event.endTime}
                            </span>
                            {event.interviewPlatform && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="truncate">
                                  {event.interviewPlatform}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() => {
                            setSelectedEvent(
                              event as InterviewScheduleDetailsResponse,
                            );
                            openModal("applicant-schedule-modal");
                          }}
                          className="flex-shrink-0 rounded-full bg-[#6E4AED] px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#5A3DE0] hover:shadow-md active:scale-95 sm:px-4 sm:py-2"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <ApplicantScheduleModal
        modalId="applicant-schedule-modal"
        selectedEvent={selectedEvent}
      />
    </div>
  );
};

export default UpcomingEvent;
