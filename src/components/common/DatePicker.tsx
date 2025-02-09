import {DatePickerProps} from "../../utils/types";
import {FC} from "react";

const DatePicker: FC<DatePickerProps> = ({
                                             label,
                                             value,
                                             name,
                                             onChange,
                                             disabled = false,
                                             className = '',
                                         }) => {
    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={name}
                    className="block mb-1 font-medium text-gray-700"
                >
                    {label}
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
            />
        </div>
    );
};

export default DatePicker;