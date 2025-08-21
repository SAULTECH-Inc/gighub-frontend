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
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-sm sm:text-lg font-medium text-gray-700 truncate">
          Upcoming Schedule
        </h3>
        <div
          className="flex h-6 w-6 sm:h-8 sm:w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-[#6E4AED] hover:bg-gray-200 transition-colors flex-shrink-0"
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
            <span className="text-xs sm:text-sm text-gray-500">Loading events...</span>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
          <div className="rounded-full bg-gray-100 p-3 sm:p-4 mb-3 sm:mb-4">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
          </div>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xs">
            No upcoming interviews scheduled. New events will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4 max-h-48 sm:max-h-64 lg:max-h-none">
          {events.map((event, idx) => {
            const dateObj = new Date(event.date);
            const weekday = dateObj.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const day = dateObj.getDate();

            return (
              <motion.div
                key={event.id}
                className="flex items-center bg-gray-50 rounded-xl p-3 sm:p-4 hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex w-full items-center gap-3 sm:gap-4">
                  {/* Date Section */}
                  <div className="flex flex-col items-center justify-center text-center bg-white rounded-lg p-2 sm:p-3 shadow-sm min-w-[50px] sm:min-w-[60px]">
                    <p className="text-xs text-gray-500 font-medium">{weekday}</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-800">{day}</p>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`bg-white rounded-lg border-l-4 ${
                        idx % 2 === 0 ? "border-l-[#F36863]" : "border-l-[#6E4AED]"
                      } p-3 sm:p-4 shadow-sm`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-800 truncate mb-1">
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
                                <span className="truncate">{event.interviewPlatform}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() => {
                            setSelectedEvent(event as InterviewScheduleDetailsResponse);
                            openModal("applicant-schedule-modal");
                          }}
                          className="bg-[#6E4AED] hover:bg-[#5A3DE0] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold transition-all duration-200 hover:shadow-md active:scale-95 flex-shrink-0"
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