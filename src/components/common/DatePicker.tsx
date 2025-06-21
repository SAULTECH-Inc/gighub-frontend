import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../utils/lib/utils.ts";

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
  label,
  disabled = false,
  placeholder = "DD/MM/YYYY",
  className = "",
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<
    "days" | "month-select" | "year-select"
  >("days");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setViewMode("days");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getStartDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const generateDays = () => {
    const numDays = getDaysInMonth(currentMonth);
    const startDay = getStartDayOfMonth(currentMonth);
    const days: (number | null)[] = [];

    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= numDays; i++) days.push(i);

    return days;
  };

  const days = generateDays();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "short" }),
  );

  const goToPreviousMonth = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  const goToNextMonth = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  const goToPreviousYear = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1),
    );
  const goToNextYear = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1),
    );
  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), monthIndex, 1));
    setViewMode("days");
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    onDateChange(newDate);
    setIsOpen(false);
    setViewMode("days");
  };

  const isSelected = (day: number) =>
    selectedDate &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === currentMonth.getMonth() &&
    selectedDate.getFullYear() === currentMonth.getFullYear();

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const currentYear = currentMonth.getFullYear();

  return (
    <div className="relative" ref={pickerRef}>
      {label && (
        <label className="text-gray-700 mb-1 block text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between",
          className,
          disabled && "cursor-not-allowed opacity-50",
        )}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (isOpen) setViewMode("days");
          }
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        disabled={disabled}
        aria-required={required}
      >
        <span className="truncate">
          {selectedDate
            ? selectedDate.toLocaleDateString("en-GB")
            : placeholder}
        </span>
        <svg
          className="text-gray-500 h-5 w-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div className="animate-fade-in-down border-gray-200 absolute z-10 mt-2 w-full rounded-lg border bg-white p-4 shadow-lg">
          <style>{`
            @keyframes fade-in-down {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-down {
              animation: fade-in-down 0.2s ease-out forwards;
            }
          `}</style>

          {/* Header navigation */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={
                viewMode === "days" ? goToPreviousMonth : goToPreviousYear
              }
            >
              ←
            </button>

            <div className="flex gap-2">
              <button type="button" onClick={() => setViewMode("month-select")}>
                {currentMonth.toLocaleString("default", { month: "long" })}
              </button>
              <button type="button" onClick={() => setViewMode("year-select")}>
                {currentYear}
              </button>
            </div>

            <button
              type="button"
              onClick={viewMode === "days" ? goToNextMonth : goToNextYear}
            >
              →
            </button>
          </div>

          {viewMode === "days" && (
            <>
              <div className="text-gray-500 mb-1 grid grid-cols-7 text-center text-xs">
                {dayNames.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <div key={index} className="flex items-center justify-center">
                    {day ? (
                      <button
                        type="button"
                        className={cn(
                          "h-8 w-8 rounded-full text-sm",
                          isToday(day) && "bg-purple-100 text-purple-700",
                          isSelected(day)
                            ? "bg-purple-600 text-white"
                            : "hover:bg-gray-100",
                        )}
                        onClick={() => handleDayClick(day)}
                      >
                        {day}
                      </button>
                    ) : (
                      <div className="h-8 w-8" />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {viewMode === "month-select" && (
            <div className="grid grid-cols-3 gap-2">
              {monthNames.map((month, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleMonthSelect(index)}
                >
                  {month}
                </button>
              ))}
            </div>
          )}

          {viewMode === "year-select" && (
            <div className="flex items-center justify-center gap-4">
              <button type="button" onClick={goToPreviousYear}>
                ←
              </button>
              <span>{currentYear}</span>
              <button type="button" onClick={goToNextYear}>
                →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(DatePicker);
