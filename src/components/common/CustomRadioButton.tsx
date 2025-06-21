import React from "react";

interface CustomRadioButtonProps {
  name: string; // Name attribute for grouping radio buttons
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  size?: number; // Dynamic size (default: 20px)
  color?: string; // Dynamic color for border and check disc
  className?: string; // Extra classes
  disabled?: boolean; // Disable radio button
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  name,
  value,
  checked,
  onChange,
  label,
  size = 20,
  color = "#6E4AED", // Default purple color
  className = "",
  disabled = false,
}) => {
  return (
    <label
      className={`flex cursor-pointer items-center gap-x-2 ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      } ${className}`}
    >
      {/* Hidden Native Radio Input */}
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer hidden"
      />

      {/* Custom Radio Button UI */}
      <div
        className="flex items-center justify-center border-2 transition-all peer-checked:border-current peer-checked:bg-transparent"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          borderColor: checked ? color : "#D9D9D9", // Change border when checked
        }}
      >
        {checked && (
          <div
            className="rounded-full"
            style={{
              width: `${size * 0.5}px`,
              height: `${size * 0.5}px`,
              backgroundColor: color, // Inner disc color same as border
            }}
          ></div>
        )}
      </div>

      {/* Optional Label */}
      {label && (
        <span className="text-gray-800 text-sm sm:text-base">{label}</span>
      )}
    </label>
  );
};

export default CustomRadioButton;
