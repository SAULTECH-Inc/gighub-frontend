import {FC} from "react";
import {TextAreaProps} from "../../utils/types";

const TextArea: FC<TextAreaProps> = ({
                                         label,
                                         value,
                                         placeholder,
                                         name,
                                         rows = 4,
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
            <textarea
                id={name}
                name={name}
                rows={rows}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                disabled={disabled}
                className={`border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            />
        </div>
    );
};

export default TextArea;