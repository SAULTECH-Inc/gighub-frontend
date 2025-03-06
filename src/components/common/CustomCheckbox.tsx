import React from "react";

interface CustomCheckboxProps {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    size?: number; // Dynamic size (default: 20px)
    borderColor?: string; // Custom border color
    checkColor?: string; // Background color when checked
    className?: string; // Extra classes
    disabled?: boolean; // Disable checkbox
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
                                                           checked,
                                                           onChange,
                                                           label,
                                                           size = 20,
                                                           borderColor = "#D9D9D9",
                                                           checkColor = "#6E4AED",
                                                           className = "",
                                                           disabled = false,
                                                       }) => {
    return (
        <label className={`flex items-center cursor-pointer gap-x-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
            {/* Hidden Native Checkbox */}
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="hidden peer"
            />

            {/* Custom Checkbox UI */}
            <div
                className="flex items-center justify-center transition-all border-2 peer-checked:bg-current peer-checked:border-current"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: "4px",
                    borderColor: borderColor,
                    color: checkColor, // Used for peer-checked color
                }}
            >
                {checked && (
                    <svg
                        className="w-3/4 h-3/4 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>

            {/* Optional Label */}
            {label && <span className="text-gray-800">{label}</span>}
        </label>
    );
};

export default CustomCheckbox;
