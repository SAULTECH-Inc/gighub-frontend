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
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    label,
    placeholder,
    options,
    selectedItems,
    setSelectedItems,
    requiredAsterisk = false,
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
        if (!selectedItems.some((item) => item.value === option.value)) {
            setSelectedItems([...selectedItems, option]);
        }
        setIsOpen(false);
    };

    const handleAddOption = () => {
        if (search.trim() === "") return;

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
        const updatedItems = selectedItems.filter((item) => item.value !== value);
        setSelectedItems(updatedItems);
    };


    return (
        <div className="relative w-full" ref={dropdownRef}>
        <div className="w-full flex flex-wrap bg-[#F7F8FA] md:p-4 border border-[#E6E6E6] p-2 rounded-[16px]">
       <div className="flex gap-1 items-center text-[12px] sm:text-base">
       {label}{requiredAsterisk && <FaAsterisk className="w-2 fill-[#FA4E09]"/>}
       </div>
        <button
                type="button"
                className={` text-[#8E8E8E]  w-full text-[12px] sm:text-base p-2 rounded-lg bg-white mt-2 flex justify-between items-center border border-[#E6E6E6]`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {placeholder}
                {isOpen ? (
                    <MdKeyboardArrowUp className="cursor-pointer text-[24px]" />
                ) : (
                    <MdKeyboardArrowDown className="cursor-pointer text-[24px]" />
                )}
            </button>
            



            {isOpen && (
                <div className="absolute mt-2 w-full bg-white shadow-lg z-10 rounded-lg p-3 border border-gray-300">
                    <input
                        type="text"
                        className="w-full px-3 py-2 text-sm border-b border-gray-300 focus:outline-none"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <ul className="max-h-48 overflow-y-auto mt-2">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option.value}
                                    className="px-4 py-2 text-sm cursor-pointer hover:bg-[#6438C2]"
                                    onClick={() => handleSelect(option)}
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-sm text-gray-500">No results found</li>
                        )}
                    </ul>

                    {search.trim() !== "" && !options.some(option => option.label.toLowerCase() === search.toLowerCase()) && (
                        <button
                            className="w-full mt-2 px-4 py-2 text-sm bg-[#6438C2] text-white rounded hover:bg-[#6438C2]"
                            onClick={handleAddOption}
                        >
                            Add "{search}"
                        </button>
                    )}


                </div>
                
            )}
            <div className="flex flex-wrap gap-2 mt-2 max-h-[100px] overflow-y-auto">
                {selectedItems.map((item) => (
                    <div
                        key={item.value}
                        className="px-4 py-2 bg-[#FA4E09] text-white text-[12px] rounded-lg flex items-center space-x-2"
                    >
                        <span>{item.label}</span>
                        <button
                            type="button"
                            onClick={() => handleRemove(item.value)}
                            className="text-white font-semibold cursor-pointer"
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
