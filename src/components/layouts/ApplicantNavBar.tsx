import { FC, useState, useRef, useEffect } from "react";
import GighubLogo from "../../assets/icons/GighubLogo.svg";
import Avatar from "../common/Avatar.tsx";
import SearchIcon from "../common/SearchIcon.tsx";
import NotificationIcon from "../common/NotificationIcon.tsx";
import MessageNotificationIcon from "../common/MessageNotificationIcon.tsx";
import ProfileDropdown from "../common/ProfileDropdown.tsx";
import NotificationDropdown from "../ui/NotificationDropdown.tsx";
import MessageDropdown from "../ui/MessageDropdown.tsx";
import {useNavigate} from "react-router-dom"; // Import MessageDropdown

const ApplicantNavBar: FC = () => {
    const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
    const [isMessageDropdownOpen, setMessageDropdownOpen] = useState(false); // State for MessageDropdown
    const [isSearchOpen, setSearchOpen] = useState(false); // State for Search Input
    const [isMobileNavOpen, setMobileNavOpen] = useState(false); // State for mobile drawer sidebar

    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const notificationDropdownRef = useRef<HTMLDivElement>(null);
    const messageDropdownRef = useRef<HTMLDivElement>(null); // Ref for MessageDropdown
    const searchInputRef = useRef<HTMLInputElement>(null); // Ref for Search Input

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen((prev) => !prev);
        setNotificationDropdownOpen(false); // Close notification dropdown
        setMessageDropdownOpen(false); // Close message dropdown
    };

    const toggleNotificationDropdown = () => {
        setNotificationDropdownOpen((prev) => !prev);
        setProfileDropdownOpen(false); // Close profile dropdown
        setMessageDropdownOpen(false); // Close message dropdown
    };

    const toggleMessageDropdown = () => {
        setMessageDropdownOpen((prev) => !prev);
        setProfileDropdownOpen(false); // Close profile dropdown
        setNotificationDropdownOpen(false); // Close notification dropdown
    };

    const closeDropdowns = () => {
        setProfileDropdownOpen(false);
        setNotificationDropdownOpen(false);
        setMessageDropdownOpen(false);
    };

    const handleSearchToggle = () => {
        setSearchOpen((prev) => !prev);
        if (!isSearchOpen) {
            setTimeout(() => {
                searchInputRef.current?.focus(); // Focus the input box when it opens
            }, 200);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            profileDropdownRef.current &&
            !profileDropdownRef.current.contains(event.target as Node) &&
            notificationDropdownRef.current &&
            !notificationDropdownRef.current.contains(event.target as Node) &&
            messageDropdownRef.current &&
            !messageDropdownRef.current.contains(event.target as Node) &&
            searchInputRef.current &&
            !searchInputRef.current.contains(event.target as Node)
        ) {
            closeDropdowns();
            setSearchOpen(false); // Close search input if clicked outside
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [activeItem, setActiveItem] = useState<string>("Dashboard");

    const navItems = ["Dashboard", "Find Jobs", "Applications", "My Networks"];
    const navigate = useNavigate();

    return (
        <>
            <nav className="flex justify-between items-center px-6 py-4 bg-white border-b-[1px] border-b-[#E6E6E6]">
                {/* Left: Logo */}
                <div className="flex items-center gap-2">
                    <img src={GighubLogo} alt="Gighub Logo" className="h-10 w-auto" />
                </div>

                {/* Center: Navigation Links (Desktop) */}
                <ul className="hidden md:flex gap-8 text-gray-600 font-lato text-[16px]">
                    {navItems.map((item) => (
                        <li
                            key={item}
                            onClick={() => {
                                setActiveItem(item);
                                navigate('/applicant/dashboard')
                            }} // Set the active item on click
                            className={`cursor-pointer font-medium border-b-4 ${
                                activeItem === item
                                    ? "text-[#6438C2] border-[#6438C2] border-b-[7px]"
                                    : "border-transparent hover:text-[#6438C2] hover:border-[#6438C2] hover:border-b-[7px]"
                            }`}
                        >
                            {item}
                        </li>
                    ))}
                </ul>

                {/* Hamburger Icon for Mobile */}
                <div className="md:hidden flex items-center" onClick={() => setMobileNavOpen(!isMobileNavOpen)}>
                    <div className="w-6 h-1 bg-gray-600 mb-1"></div>
                    <div className="w-6 h-1 bg-gray-600 mb-1"></div>
                    <div className="w-6 h-1 bg-gray-600"></div>
                </div>

                {/* Right: Notifications, Messages, and Profile (Desktop Only) */}
                <div className="hidden md:flex items-center gap-8">
                    {/* Search Icon and Input */}
                    <div className="relative">
                        <div
                            className="cursor-pointer"
                            onClick={handleSearchToggle}
                        >
                            <SearchIcon/>
                        </div>
                        <div
                            className={`absolute right-0 top-[-10px] transform transition-all duration-300 ${
                                isSearchOpen
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 translate-x-[200px] pointer-events-none"
                            }`}
                        >
                            <input
                                ref={searchInputRef}
                                type="text"
                                className="w-64 px-2 py-2 border-[0.5px] border-[#ccc] rounded-full shadow-sm text-sm focus:outline-none focus:border-[#ccc] active:border-[#ccc] focus:ring-0"
                                placeholder="Search..."
                            />
                        </div>
                    </div>

                    {/* Notification Icon */}
                    <div className="relative" ref={notificationDropdownRef}>
                        <div className="cursor-pointer" onClick={toggleNotificationDropdown}>
                            <NotificationIcon count={5}/>
                        </div>
                        {isNotificationDropdownOpen && <NotificationDropdown onClose={closeDropdowns}/>}
                    </div>

                    {/* Message Notification Icon */}
                    <div className="relative" ref={messageDropdownRef}>
                        <div className="cursor-pointer" onClick={toggleMessageDropdown}>
                            <MessageNotificationIcon count={8}/>
                        </div>
                        {isMessageDropdownOpen && <MessageDropdown onClose={closeDropdowns}/>}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative ml-10" ref={profileDropdownRef}>
                        <div className="cursor-pointer" onClick={toggleProfileDropdown}>
                            <Avatar/>
                        </div>
                        {isProfileDropdownOpen && <ProfileDropdown onClose={closeDropdowns}/>}
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Sidebar */}
            <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-40 md:hidden ${isMobileNavOpen ? "block" : "hidden"}`} onClick={() => setMobileNavOpen(false)}></div>

            <div className={`fixed top-0 left-0 bg-white w-64 h-full z-50 transform transition-transform duration-300 ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex flex-col items-center mt-6">
                    {navItems.map((item) => (
                        <div
                            key={item}
                            onClick={() => {
                                setActiveItem(item);
                                setMobileNavOpen(false);
                            }}
                            className={`py-2 px-4 w-full text-center text-gray-600 font-lato text-[16px] cursor-pointer border-b-2 border-transparent hover:border-[#6438C2] hover:text-[#6438C2]`}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ApplicantNavBar;
