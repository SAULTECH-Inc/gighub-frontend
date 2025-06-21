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
        <label htmlFor={name} className="text-gray-700 mb-1 block font-medium">
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
        className={`border-gray-300 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    </div>
  );
};

export default TextArea;
