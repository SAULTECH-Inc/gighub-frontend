import React, { useState, useRef, useEffect } from "react";
import { RiArrowDownSLine, RiAddLine, RiCloseLine } from "react-icons/ri";
import { FaAsterisk } from "react-icons/fa";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label: string;
  placeholder?: string;
  options: Option[];
  selectedItems: Option[];
  setSelectedItems: (items: Option[]) => void;
  requiredAsterisk?: boolean;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
                                                   label,
                                                   placeholder = "Select options...",
                                                   options,
                                                   selectedItems,
                                                   setSelectedItems,
                                                   requiredAsterisk = false,
                                                   disabled = false,
                                                 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase()) &&
        !selectedItems.some((selected) => selected.value === option.value)
      ),
    );
  }, [search, options, selectedItems]);

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
    if (disabled) return;
    if (!selectedItems.some((item) => item.value === option.value)) {
      setSelectedItems([...selectedItems, option]);
    }
    setSearch("");
  };

  const handleAddOption = () => {
    if (disabled || search.trim() === "") return;

    const newOption: Option = {
      label: search.trim(),
      value: search.trim().toLowerCase().replace(/\s+/g, "-"),
    };

    if (!selectedItems.some((item) => item.value === newOption.value)) {
      setSelectedItems([...selectedItems, newOption]);
    }

    setSearch("");
    setIsOpen(false);
  };

  const handleRemove = (value: string) => {
    if (disabled) return;
    const updatedItems = selectedItems.filter((item) => item.value !== value);
    setSelectedItems(updatedItems);
  };

  const canAddNew = search.trim() !== "" &&
    !options.some(option => option.label.toLowerCase() === search.toLowerCase()) &&
    !selectedItems.some(item => item.label.toLowerCase() === search.toLowerCase());

  return (
    <div className="w-full space-y-3" ref={dropdownRef}>
      {/* Label */}
      <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
        {label}
        {requiredAsterisk && <FaAsterisk className="w-2 h-2 text-red-500" />}
      </label>

      {/* Input Area */}
      <div className="relative">
        <button
          type="button"
          className={`
            w-full flex items-center justify-between p-4 text-left border-2 rounded-xl transition-all duration-200
            ${disabled
            ? 'cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400'
            : 'bg-white border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'
          }
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className={`
            ${selectedItems.length > 0 ? 'text-gray-700 font-medium' : 'text-gray-500'}
            ${disabled ? 'text-gray-400' : ''}
          `}>
            {selectedItems.length > 0 ? `${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} selected` : placeholder}
          </span>
          <RiArrowDownSLine className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-100">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                placeholder="Search or type to add new..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>

            {/* Options List */}
            <div className="max-h-40 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </button>
                ))
              ) : search.trim() === "" ? (
                <div className="px-4 py-6 text-sm text-gray-500 text-center">
                  Start typing to search options
                </div>
              ) : (
                <div className="px-4 py-6 text-sm text-gray-500 text-center">
                  No matching options found
                </div>
              )}

              {/* Add New Option */}
              {canAddNew && (
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors duration-150 border-t border-gray-100 font-medium"
                  onClick={handleAddOption}
                >
                  <RiAddLine className="h-4 w-4" />
                  <span>Add "{search.trim()}"</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Items Display - Now Below */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedItems.map((item) => (
            <div
              key={item.value}
              className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
            >
              <span>{item.label}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(item.value)}
                  className="ml-1 hover:bg-orange-600 rounded-full p-0.5 transition-colors duration-150"
                >
                  <RiCloseLine className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Disabled State Message */}
      {disabled && (
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
          <span>🔒</span>
          <span>This feature requires a premium subscription</span>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;