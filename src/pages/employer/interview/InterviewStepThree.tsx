import React, { useEffect, useState } from "react";
import { useScheduleInterview } from "../../../store/useScheduleInterview.ts";

import CustomSelect from "../../../components/common/CustomSelect.tsx";
import DatePicker from "../../../components/common/DatePicker.tsx";
import { InterviewScheduleDetails } from "../../../utils/types";

const InterviewStepThree: React.FC = () => {
  const { nextStep, prevStep, interviewDetails, setInterviewDetails } =
    useScheduleInterview();
  const [errors] = useState<{ [key: string]: string }>({});

  // calculate duration based on startTime and endTime differences
  useEffect(() => {
    if (interviewDetails?.startTime && interviewDetails?.endTime) {
      const start = new Date(`1970-01-01T${interviewDetails.startTime}`);
      const end = new Date(`1970-01-01T${interviewDetails.endTime}`);
      const diffInMs = end.getTime() - start.getTime();

      if (diffInMs > 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

        setInterviewDetails({
          ...interviewDetails,
          duration: diffInMinutes,
        } as InterviewScheduleDetails);
      } else {
        setInterviewDetails({
          ...interviewDetails,
          duration: 0,
        } as InterviewScheduleDetails);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewDetails?.startTime, interviewDetails?.endTime]);

  const processDurationIntoHoursMinutes = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleNextStep = () => {
    nextStep();
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex min-h-[400px] w-[96%] max-w-[900px] flex-col items-center rounded-[10px] bg-white py-4">
        <div className="flex w-[95%] flex-col gap-3">
          <h4 className="text-[13px] font-bold text-[#000000] sm:text-2xl">
            Select Interview Date
          </h4>
          <p className="text-[14px] text-[#000000] sm:text-[16px]">
            Choose a date and time for the interview. Make sure to select a time
            that works for both you and the candidate.
          </p>
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="date"
              className="text-[14px] font-bold text-[#000000] sm:text-[16px]"
            >
              Date
            </label>
            <DatePicker
              selectedDate={new Date(interviewDetails?.date || "01-01-2025")}
              onDateChange={(date) => {
                setInterviewDetails({
                  ...interviewDetails,
                  date: date?.toISOString(),
                } as InterviewScheduleDetails);
              }}
              className="w-full rounded-[10px] border border-[#ccc] px-4 py-2 text-[14px] focus:border-[#e6e6e6] focus:ring-0 focus:outline-none"
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>
          <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row sm:gap-6">
            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="time"
                className="text-[14px] font-bold text-[#000000] sm:text-[16px]"
              >
                Start Time
              </label>
              <input
                type="time"
                name="time"
                className="w-full rounded-md border border-[#CCCCCC] px-4 py-2 focus:border-[#CCCCCC] focus:ring-0 focus:outline-none"
                value={interviewDetails?.startTime || ""}
                onChange={(e) => {
                  setInterviewDetails({
                    ...interviewDetails,
                    startTime: e.target.value,
                  } as InterviewScheduleDetails);
                }}
              />
              {errors.time && (
                <p className="text-sm text-red-500">{errors.time}</p>
              )}
            </div>
            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="time"
                className="text-[14px] font-bold text-[#000000] sm:text-[16px]"
              >
                End Time
              </label>
              <input
                type="time"
                name="time"
                className="w-full rounded-md border border-[#CCCCCC] px-4 py-2 focus:border-[#CCCCCC] focus:ring-0 focus:outline-none"
                value={interviewDetails?.endTime || ""}
                onChange={(e) => {
                  setInterviewDetails({
                    ...interviewDetails,
                    endTime: e.target.value,
                  } as InterviewScheduleDetails);
                }}
              />
              {errors.time && (
                <p className="text-sm text-red-500">{errors.time}</p>
              )}
            </div>

            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="duration"
                className="text-[14px] font-bold text-[#000000] sm:text-[16px]"
              >
                Duration
              </label>
              <p className="w-full rounded-md border border-[#CCCCCC] px-4 py-2 focus:border-[#CCCCCC] focus:ring-0 focus:outline-none">
                {processDurationIntoHoursMinutes(
                  interviewDetails?.duration as number,
                )}
              </p>
            </div>
          </div>
          {/*    time zone*/}
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="timezone"
              className="text-[14px] font-bold text-[#000000] sm:text-[16px]"
            >
              Time Zone
            </label>
            <CustomSelect
              options={[
                { value: "GMT", label: "GMT" },
                { value: "UTC", label: "UTC" },
                { value: "PST", label: "PST" },
                { value: "CST", label: "CST" },
                { value: "EST", label: "EST" },
              ]}
              placeholder={interviewDetails?.timeZone || "Select Time Zone"}
              className="w-full rounded-md border border-[#CCCCCC] px-4 py-2 focus:border-[#CCCCCC] focus:ring-0 focus:outline-none"
              onChange={(option) => {
                setInterviewDetails({
                  ...interviewDetails,
                  timeZone: option.value,
                } as InterviewScheduleDetails);
              }}
            />
            {errors.timezone && (
              <p className="text-sm text-red-500">{errors.timezone}</p>
            )}
          </div>
        </div>
      </div>
      <div className="mx-2 my-2 flex w-[96%] max-w-[900px] justify-end gap-1 sm:gap-6">
        <button
          className="w-[35%] self-end rounded-[15px] border border-[#E6E6E6] bg-[#F7F7F7] py-[8px] sm:w-[29%]"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          className="w-[35%] rounded-[15px] bg-[#6438C2] py-[8px] text-white sm:w-[29%]"
          onClick={handleNextStep}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default InterviewStepThree;
