import { TextInputProps } from "../../utils/types";
import { FC } from "react";

const TextInput: FC<TextInputProps> = ({
  label,
  value,
  placeholder,
  name,
  type = "text",
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
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className={`border-gray-300 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    </div>
  );
};

export default TextInput;
