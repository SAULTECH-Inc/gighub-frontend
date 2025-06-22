import React, { useState, useRef, useEffect } from "react";
import { FaAsterisk } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

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
  disabled?: boolean; // ✅ Optional disabled prop
}

const MultiSelect: React.FC<MultiSelectProps> = ({
                                                   label,
                                                   placeholder,
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
        option.label.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, options]);

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
    if (disabled) return;
    if (!selectedItems.some((item) => item.value === option.value)) {
      setSelectedItems([...selectedItems, option]);
    }
    setIsOpen(false);
  };

  const handleAddOption = () => {
    if (disabled || search.trim() === "") return;

    const newOption: Option = {
      label: search,
      value: search.replace(/\s+/g, "-"),
    };

    if (!selectedItems.some((item) => item.value === newOption.value)) {
      setSelectedItems([...selectedItems, newOption]);
    }

    setIsOpen(false);
    setSearch("");
  };

  const handleRemove = (value: string) => {
    if (disabled) return;
    const updatedItems = selectedItems.filter((item) => item.value !== value);
    setSelectedItems(updatedItems);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={`flex w-full flex-wrap rounded-[16px] border ${
          disabled ? "bg-gray-200 cursor-not-allowed" : "bg-[#F7F8FA]"
        } border-[#E6E6E6] p-2 md:p-4`}
      >
        <div className="flex items-center gap-1 text-[12px] sm:text-base">
          {label}
          {requiredAsterisk && <FaAsterisk className="w-2 fill-[#FA4E09]" />}
        </div>

        <button
          type="button"
          className={`mt-2 flex w-full items-center justify-between rounded-lg border border-[#E6E6E6] ${
            disabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white text-[#8E8E8E]"
          } p-2 text-[12px] sm:text-base`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          {placeholder}
          {isOpen ? (
            <MdKeyboardArrowUp className="text-[24px]" />
          ) : (
            <MdKeyboardArrowDown className="text-[24px]" />
          )}
        </button>

        {isOpen && !disabled && (
          <div className="border-gray-300 absolute z-10 mt-2 w-full rounded-lg border bg-white p-3 shadow-lg">
            <input
              type="text"
              className="border-gray-300 w-full border-b px-3 py-2 text-sm focus:outline-none"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={disabled}
            />

            <ul className="mt-2 max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className="cursor-pointer px-4 py-2 text-sm hover:bg-[#6438C2]"
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li className="text-gray-500 px-4 py-2 text-sm">
                  No results found
                </li>
              )}
            </ul>

            {search.trim() !== "" &&
              !options.some(
                (option) =>
                  option.label.toLowerCase() === search.toLowerCase()
              ) && (
                <button
                  className="mt-2 w-full rounded bg-[#6438C2] px-4 py-2 text-sm text-white hover:bg-[#6438C2]"
                  onClick={handleAddOption}
                >
                  Add "{search}"
                </button>
              )}
          </div>
        )}

        <div className="mt-2 flex h-auto max-h-max flex-wrap gap-2 overflow-y-auto">
          {selectedItems.map((item) => (
            <div
              key={item.value}
              className="flex items-center space-x-2 rounded-lg bg-[#FA4E09] px-4 py-2 text-[12px] text-white"
            >
              <span>{item.label}</span>
              <button
                type="button"
                onClick={() => handleRemove(item.value)}
                className="cursor-pointer font-semibold text-white"
                disabled={disabled}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
