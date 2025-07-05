import React, { useState, useEffect, useRef } from "react";

interface SearchInputProps {
  name?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  suggestions?: string[];
}

const SearchInput: React.FC<SearchInputProps> = ({
                                                   name,
                                                   placeholder,
                                                   value,
                                                   onChange,
                                                   disabled = false,
                                                   className = "",
                                                   required = false,
                                                   suggestions = [],
                                                 }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions
  const filteredSuggestions = value
    ? suggestions.filter((s) =>
      s.toLowerCase().includes(value.toLowerCase())
    )
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setHighlightedIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (selected: string) => {
    onChange(selected);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        name={name}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => {
          if (filteredSuggestions.length > 0) setShowDropdown(true);
        }}
        disabled={disabled}
        required={required}
        className={`w-full px-3 py-2 border rounded ${className}`}
        onKeyDown={(e) => {
          if (!showDropdown) return;

          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev === null || prev === filteredSuggestions.length - 1 ? 0 : prev + 1
            );
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev === null || prev === 0 ? filteredSuggestions.length - 1 : prev - 1
            );
          } else if (e.key === "Enter" && highlightedIndex !== null) {
            e.preventDefault();
            handleSelect(filteredSuggestions[highlightedIndex]);
          }
        }}
      />

      {showDropdown && filteredSuggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
          {filteredSuggestions.map((s, idx) => (
            <li
              key={s + idx}
              onClick={() => handleSelect(s)}
              className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 ${
                highlightedIndex === idx ? "bg-gray-100" : ""
              }`}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
