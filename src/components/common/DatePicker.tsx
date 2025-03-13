import { FaAsterisk } from "react-icons/fa";
import { DatePickerProps } from "../../utils/types";
import { FC } from "react";

const DatePicker: FC<DatePickerProps> = ({
  label,
  value,
  name,
  onChange,
  disabled = false,
  className = "",
  min = new Date().toISOString().split("T")[0],
  requiredAsterisk = false,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
          <div className="flex gap-1 items-center">
            {label}
            {requiredAsterisk && <FaAsterisk className="w-2 fill-[#FA4E09]" />}
          </div>{" "}
        </label>
      )}
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        min={min}
      />
    </div>
  );
};

export default DatePicker;
