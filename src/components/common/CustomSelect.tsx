import React, { useState, useRef, useEffect, memo } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { RiSearchLine } from "react-icons/ri";

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
  value?: string;
}

const CustomSelect: React.FC<DropdownProps> = ({
  placeholder = "Select an option...",
  className = "",
  options,
  onChange,
  disabled = false,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set initial selected option based on value prop
  useEffect(() => {
    if (value) {
      const option = options.find((opt) => opt.value === value);
      if (option) setSelectedOption(option);
    }
  }, [value, options]);

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
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(option);
    }
    setIsOpen(false);
    setSearch("");
  };

  const canAddNew =
    search.trim() !== "" &&
    !options.some(
      (option) => option.label.toLowerCase() === search.toLowerCase(),
    );

  const handleAddNew = () => {
    if (!canAddNew) return;

    const newOption: Option = {
      label: search.trim(),
      value: search.trim().toLowerCase().replace(/\s+/g, "-"),
    };

    handleSelect(newOption);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`relative flex w-full items-center justify-between rounded-lg border-2 bg-white px-3 py-2 text-left transition-all duration-200 sm:px-4 sm:py-3 ${
          disabled
            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
            : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        } ${className} `}
      >
        <span className="block truncate pl-6 text-xs sm:text-sm">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="flex items-center">
          {isOpen ? (
            <MdKeyboardArrowUp className="h-4 w-4 text-gray-400 transition-transform duration-200 sm:h-5 sm:w-5" />
          ) : (
            <MdKeyboardArrowDown className="h-4 w-4 text-gray-400 transition-transform duration-200 sm:h-5 sm:w-5" />
          )}
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div className="animate-in slide-in-from-top-2 absolute z-50 mt-2 w-full rounded-lg border-2 border-gray-200 bg-white shadow-lg duration-200">
          {/* Search input */}
          <div className="border-b border-gray-100 p-3">
            <div className="relative">
              <RiSearchLine className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                className="w-full rounded-md border border-gray-200 py-2 pr-3 pl-10 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-100 focus:outline-none sm:text-sm"
                placeholder="Search options..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={`${option.value}-${index}`}
                  type="button"
                  className="w-full border-b border-gray-50 px-4 py-3 text-left text-xs transition-colors duration-150 last:border-b-0 hover:bg-blue-50 sm:text-sm"
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </button>
              ))
            ) : search.trim() === "" ? (
              <div className="px-4 py-6 text-center text-xs text-gray-500 sm:text-sm">
                Start typing to search options
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-xs text-gray-500 sm:text-sm">
                No matching options found
              </div>
            )}

            {/* Add new option */}
            {canAddNew && (
              <button
                type="button"
                className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-3 text-xs font-medium text-blue-600 transition-colors duration-150 hover:bg-blue-50 sm:text-sm"
                onClick={handleAddNew}
              >
                <span>+</span>
                <span>Add "{search.trim()}"</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(CustomSelect);
