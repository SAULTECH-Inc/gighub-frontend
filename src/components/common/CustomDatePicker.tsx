import React, { useEffect, useRef, useState } from "react";

interface CustomDatePickerProps {
  initialDate?: string;
  onChange: (date: string) => void;
  className?: string; // Optional className prop
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  initialDate = "",
  onChange,
  className = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState<string>(initialDate);

  useEffect(() => {
    const loadDatepicker = async () => {
      try {
        const { Datepicker } = await import("flowbite");
        if (inputRef.current) {
          new Datepicker(inputRef.current, {
            format: "yyyy-mm-dd",
            autohide: true,
          });

          // Update state when a date is selected via Flowbite's UI
          inputRef.current.addEventListener("changeDate", (event: Event) => {
            const target = event.target as HTMLInputElement;
            setDate(target.value);
            onChange(target.value); // Notify parent
          });
        }
      } catch (error) {
        console.error("Flowbite Datepicker failed to load:", error);
      }
    };

    loadDatepicker();
  }, [onChange]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
    onChange(event.target.value); // Notify parent
  };

  return (
    <div className="relative max-w-sm">
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
        <svg
          className="h-4 w-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
        </svg>
      </div>
      <input
        ref={inputRef}
        type="text"
        id="datepicker"
        value={date}
        onChange={handleDateChange}
        className={className} // Allow custom styling
        placeholder="Select date"
      />
    </div>
  );
};

export default CustomDatePicker;
