import React from "react";
import { motion } from "framer-motion";
import questionMark from "../../assets/icons/question.svg";
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
    <div className="mx-auto mt-6 h-full w-full">
      <div className="flex items-center justify-evenly md:space-x-[100px]">
        <h3 className="text-lg font-medium text-gray-700">Upcoming Schedule</h3>
        <div
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-[#6E4AED] hover:bg-gray-200"
          aria-label="Help"
          title="Upcoming events information"
        >
          <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border-[1px] border-[#D9D9D9] p-1">
            <img src={questionMark} alt="question mark" />
          </div>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 text-center text-gray-500">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="mt-6 text-center text-gray-500">
          No upcoming interviews.
        </p>
      ) : (
        events.map((event, idx) => {
          const dateObj = new Date(event.date);
          const weekday = dateObj.toLocaleDateString("en-US", {
            weekday: "short",
          });
          const day = dateObj.getDate();

          return (
            <motion.div
              key={event.id}
              className="my-10 flex h-[59px] w-full items-center bg-gray-50 p-3 md:my-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex w-full items-center justify-between gap-x-2 md:gap-x-5">
                {/* Date */}
                <div className="flex h-[59px] w-[10%] flex-col items-center justify-center text-center">
                  <p className="text-sm text-gray-600">{weekday}</p>
                  <p className="text-lg font-bold text-gray-800">{day}</p>
                </div>

                {/* Event */}
                <div
                  className={`flex h-[80px] w-[90%] items-center rounded-[16px] bg-[#F5F5F5] pl-3 pr-2 md:h-[59px]`}
                >
                  <div
                    className={`h-[35px] w-full border-l-[3px] ${
                      idx % 2 === 0
                        ? "border-l-[#F36863]"
                        : "border-l-[#6E4AED]"
                    } flex flex-col justify-between pl-2`}
                  >
                    <p className="text-xs font-semibold text-gray-800 md:text-sm">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500 md:text-[10px]">
                      {event.startTime} - {event.endTime} &bull;{" "}
                      {event.interviewPlatform || "TBD"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEvent(
                        event as InterviewScheduleDetailsResponse,
                      );
                      openModal("applicant-schedule-modal");
                    }}
                    className="h-[30px] w-[65px] rounded-full bg-white px-4 py-1 text-[13px] font-semibold text-[#6E4AED] transition hover:bg-purple-500 hover:text-white"
                  >
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })
      )}

      <ApplicantScheduleModal
        modalId="applicant-schedule-modal"
        selectedEvent={selectedEvent}
      />
    </div>
  );
};

export default UpcomingEvent;
