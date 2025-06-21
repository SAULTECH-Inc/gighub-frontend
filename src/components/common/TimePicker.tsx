import React, { useState, useRef, useEffect } from "react";
import { FaRegClock } from "react-icons/fa";

interface TimePickerProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  placeholder = "",
  className = "",
  required = false,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // generate time options in 15 min intervals (00:00 → 23:45)
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }

  return (
    <div className="mb-4" ref={ref}>
      {label && (
        <label className="text-gray-700 mb-1 block font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          readOnly
          value={value ?? ""}
          onClick={() => setShowOptions(!showOptions)}
          placeholder={placeholder}
          disabled={disabled}
          className={`disabled:bg-gray-100 block w-full cursor-pointer rounded-md bg-white py-3 pl-3 pr-10 text-sm disabled:cursor-not-allowed ${className}`}
        />
        <FaRegClock
          className="text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() => setShowOptions(!showOptions)}
        />

        {showOptions && (
          <div className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border border-[#E6E6E6] bg-white shadow-lg">
            {times.map((time) => (
              <div
                key={time}
                className={`cursor-pointer px-4 py-2 text-sm hover:bg-[#6438C2] hover:text-white ${
                  time === value ? "bg-[#6438C2] text-white" : ""
                }`}
                onClick={() => {
                  onChange(time);
                  setShowOptions(false);
                }}
              >
                {time}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimePicker;
