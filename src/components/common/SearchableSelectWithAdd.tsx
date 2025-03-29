import React, { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface Option {
    label: string;
    value: string;
}

interface SearchableSelectWithAddProps {
    placeholder?: string;
    className?: string;
    options: Option[];
    onChange?: (option: Option) => void;
    onAddOption?: (option: Option) => void;
}

const SearchableSelectWithAdd: React.FC<SearchableSelectWithAddProps> = ({
    placeholder = "Select an option...",
    className,
    options,
    onChange,
    onAddOption,
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
                option.label.toLowerCase().includes(search.toLowerCase())
            )
        );
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

    const handleSelect = (option: Option) => {
        setSelectedOption(option);
        if (onChange) {
            onChange(option);
        }
        setIsOpen(false);
    };

    const handleAddOption = () => {
        if (search.trim() === "") return;
    
        const newOption: Option = {
            label: search,
            value: search.replace(/\s+/g, '-'), // Removed toLowerCase() to preserve case
        };
    
        if (onAddOption) {
            onAddOption(newOption); // Call the onAddOption callback
        }
    
        setSelectedOption(newOption);
        if (onChange) {
            onChange(newOption);
        }
        setIsOpen(false);
        setSearch("");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Dropdown button */}
            <button
                type="button"
                className={`${className}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? selectedOption.label : placeholder}
                {isOpen ? (
                    <MdKeyboardArrowUp className="absolute right-3 top-3 cursor-pointer text-[30px]" />
                ) : (
                    <MdKeyboardArrowDown className="absolute right-3 top-2 cursor-pointer text-[30px]" />
                )}
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute mt-2 w-full bg-white shadow-lg z-10 rounded-[10px] p-3 border border-gray-300">
                    {/* Search input */}
                    <input
                        type="text"
                        className="w-full px-3 py-2 text-sm border-b border-gray-300 focus:outline-none"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* Options List */}
                    <ul className="max-h-48 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option.value}
                                    className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-100"
                                    onClick={() => handleSelect(option)}
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-sm text-gray-500">No results found</li>
                        )}
                    </ul>

                    {/* Add new option button */}
                    {search.trim() !== "" && !options.some(option => option.label.toLowerCase() === search.toLowerCase()) && (
                        <button
                            className="w-full mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={handleAddOption}
                        >
                            Add "{search}"
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableSelectWithAdd;