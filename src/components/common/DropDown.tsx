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
        <label htmlFor={name} className="text-gray-700 mb-1 block font-medium">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border-gray-300 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
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
