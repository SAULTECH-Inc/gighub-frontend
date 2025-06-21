import React, { useState, useRef, useEffect, memo } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  placeholder?: string;
  className?: string;
  options: Option[];
  onChange?: (option: Option) => void;
  disabled?: boolean;
}

const CustomSelect: React.FC<DropdownProps> = ({
  placeholder = "Select an option...",
  className,
  options,
  onChange,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search input
  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, options]);

  // Handle clicking outside the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: Option) => {
    setSelectedOption(option); // Store selected option
    if (onChange) {
      onChange(option); // Call the onChange callback
    }
    setIsOpen(false);
    setSearch(""); // Clear search input after selection
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 focus:outline-none ${className}`}
      >
        <span className="block truncate">
          {selectedOption ? selectedOption.label : placeholder || "\u00A0"}
        </span>

        {isOpen ? (
          <MdKeyboardArrowUp className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform text-[24px]" />
        ) : (
          <MdKeyboardArrowDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform text-[24px]" />
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-[10px] border border-[#E6E6E6] bg-white p-3 shadow-lg">
          {/* Search input */}
          <input
            type="text"
            className="mb-2 w-full border-b border-gray-300 px-3 py-2 focus:border-[#E6E6E6] focus:outline-none focus:ring-0"
            placeholder="Search..."
            value={search}
            disabled={disabled}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Options List */}
          <ul className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0
              ? filteredOptions.map((option, index) => (
                  <li
                    key={option.value + index}
                    className="cursor-pointer px-4 py-2 text-sm hover:bg-blue-100"
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </li>
                ))
              : search.trim() !== "" && (
                  <li
                    className="cursor-pointer px-4 py-2 text-sm text-blue-600 hover:bg-blue-100"
                    onClick={() =>
                      handleSelect({
                        label: search.trim(),
                        value: search.trim().toLowerCase().replace(/\s+/g, "-"),
                      })
                    }
                  >
                    Add "{search.trim()}"
                  </li>
                )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default memo(CustomSelect);
