import React, { useState, useRef, useEffect } from "react";
import { Option } from "../../utils/types";

interface DropdownProps {
    placeholder?: string;
    className?: string;
    options: Option[];
    handleSelect: (selected: Option) => void;
    disabled?: boolean;
}

const CustomDropdown: React.FC<DropdownProps> = ({
                                                     placeholder = "",
                                                     className,
                                                     options,
                                                     handleSelect,
                                                     disabled,
                                                 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter options based on search input
    useEffect(() => {
        if (Array.isArray(options)) {
            const filtered = options.filter((option) =>
                option.label.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions([]); // Fallback for undefined or non-array
        }
    }, [search, options]);

    // Handle clicking outside the dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle selecting an option
    const handleOptionSelect = (option: Option) => {
        setSelectedOption(option);
        handleSelect(option);
        setIsOpen(false);
    };

    // Handle adding a new option when not found
    const handleAddNewOption = () => {
        if (search.trim() === "") return;
        const newOption: Option = { value: search.trim(), label: search.trim() };
        handleOptionSelect(newOption);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Dropdown button */}
            <button
                type="button"
                disabled={disabled ?? false}
                className={`${className}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? selectedOption.label : placeholder || '\u00A0'}
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute mt-2 w-full bg-white shadow-lg z-10 rounded-[10px] p-3 border-[1px] border-[#E3E6F3]">
                    {/* Search input */}
                    <input
                        type="text"
                        className="w-full px-3 py-2 border-b border-[#E3E6F3] focus:outline-none focus:ring-0 focus:border-inherit"
                        placeholder="Search..."
                        value={search}
                        disabled={disabled ?? false}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* Options List */}
                    <ul className="max-h-48 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option.value}
                                    className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li
                                className="px-4 py-2 cursor-pointer text-blue-500 hover:bg-blue-100"
                                onClick={handleAddNewOption}
                            >
                                Add "{search}"
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
