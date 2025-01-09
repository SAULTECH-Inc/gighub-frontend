import {FC} from "react";
import {SelectProps} from "../../services/types";

const DropDown: FC<SelectProps> = ({
                                     label,
                                     options,
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
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            >
                <option value="">-- Select an option --</option>
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DropDown;