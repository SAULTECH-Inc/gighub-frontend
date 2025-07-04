import { FC } from "react";
import { SelectProps } from "../../utils/types";

const DropDown: FC<SelectProps> = ({
  label,
  options,
  value,
  name,
  onChange,
  disabled = false,
  className = "",
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="mb-1 block font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
      >
        <option value="">-- Select an option --</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropDown;
