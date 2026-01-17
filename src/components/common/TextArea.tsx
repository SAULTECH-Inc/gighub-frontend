import { FC } from "react";
import { TextAreaProps } from "../../utils/types";

const TextArea: FC<TextAreaProps> = ({
  label,
  value,
  placeholder,
  name,
  rows = 4,
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
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
      />
    </div>
  );
};

export default TextArea;
