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
      const option = options.find(opt => opt.value === value);
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

  const canAddNew = search.trim() !== "" &&
    !options.some(option => option.label.toLowerCase() === search.toLowerCase());

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
        className={`
          relative flex w-full items-center justify-between rounded-lg border-2 bg-white px-3 sm:px-4 py-2 sm:py-3 text-left transition-all duration-200
          ${disabled
          ? 'cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400'
          : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
        }
          ${className}
        `}
      >
        <span className="pl-6 block truncate text-xs sm:text-sm">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="flex items-center">
          {isOpen ? (
            <MdKeyboardArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform duration-200" />
          ) : (
            <MdKeyboardArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform duration-200" />
          )}
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border-2 border-gray-200 bg-white shadow-lg animate-in slide-in-from-top-2 duration-200">
          {/* Search input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
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
                  className="w-full text-left px-4 py-3 text-xs sm:text-sm hover:bg-blue-50 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </button>
              ))
            ) : search.trim() === "" ? (
              <div className="px-4 py-6 text-xs sm:text-sm text-gray-500 text-center">
                Start typing to search options
              </div>
            ) : (
              <div className="px-4 py-6 text-xs sm:text-sm text-gray-500 text-center">
                No matching options found
              </div>
            )}

            {/* Add new option */}
            {canAddNew && (
              <button
                type="button"
                className="w-full flex items-center gap-2 px-4 py-3 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 transition-colors duration-150 border-t border-gray-100 font-medium"
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