import {FC, useState, useRef, useEffect} from "react";
import GighubLogo from "../../assets/icons/GighubLogo.svg";
import Avatar from "../common/Avatar.tsx";
import SearchIcon from "../common/SearchIcon.tsx";
import NotificationIcon from "../common/NotificationIcon.tsx";
import MessageNotificationIcon from "../common/MessageNotificationIcon.tsx";
import ProfileDropdown from "../common/ProfileDropdown.tsx";
import NotificationDropdown from "../ui/NotificationDropdown.tsx";
import MessageDropdown from "../ui/MessageDropdown.tsx";
import {useNavigate} from "react-router-dom"; // Import MessageDropdown
import {AiOutlineDashboard, AiOutlineUser} from "react-icons/ai";
import {FaPeopleGroup} from "react-icons/fa6";
import {BsGear, BsPersonWorkspace} from "react-icons/bs";
import {MdOutlineContentPasteSearch} from "react-icons/md";
import {FaPowerOff} from "react-icons/fa";
import {GrCircleQuestion} from "react-icons/gr";
import hamburger from '../../assets/icons/hamburger.svg';
import avatarIcon from "../../assets/icons/avatar.svg";
import {RiCloseLargeFill} from "react-icons/ri";

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
    const navItemsMobile = ["Dashboard", "Find Jobs", "Applications", "My Networks", "Profile", "Settings", "Help & Support"];

    const navigate = useNavigate();

    const handleSetItems = (item: string) => {
        console.log(JSON.stringify(item));
        setActiveItem(item);
        switch (item) {
            case "Dashboard":
                navigate("/applicant/dashboard");
                break;
            case "Find Jobs":
                navigate("/find-jobs");
                break;
            case "Applications":
                navigate("/applications");
                break;
            case "My Networks":
                navigate("/my-networks");
                break;
            default:
                break;
        }
    };
    const handleNavigateHome = () => {
        navigate("/");
    };

    return (
        <>
            <nav className="flex justify-between items-center px-6 py-4 bg-white border-b-[1px] border-b-[#E6E6E6]">
                {/* Left: Logo */}
                <div className="hidden md:flex items-center gap-2">
                    <img src={GighubLogo} alt="Gighub Logo" className="h-10 w-auto" onClick={handleNavigateHome}/>
                </div>

                {/* Center: Navigation Links (Desktop) */}
                <ul className="hidden md:flex gap-8 text-gray-600 font-lato text-[16px]">
                    {navItems.map((item) => (
                        <li
                            key={item}
                            onClick={() => handleSetItems(item)} // Set the active item on click
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
                <div className="hidden md:flex items-start gap-8">
                    {/* Search Icon and Input */}
                    <div className="relative">
                        <div
                            className="cursor-pointer flex justify-center items-center border-[1px] border-[#ccc]  rounded-full p-1"
                            onClick={handleSearchToggle}
                        >
                            <SearchIcon/>
                        </div>
                        <div
                            className={`absolute right-[-1px] top-[-6px] transform transition-all duration-300 ${
                                isSearchOpen
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 translate-x-[200px] pointer-events-none"
                            }`}
                        >
                            <input
                                ref={searchInputRef}
                                type="text"
                                className="w-64 px-4 py-2 border-[0.5px] border-[#ccc] rounded-full shadow-sm text-sm focus:outline-none focus:border-[#ccc] active:border-[#ccc] focus:ring-0"
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
                            <Avatar isMobile={false}/>
                        </div>
                        {isProfileDropdownOpen && <ProfileDropdown onClose={closeDropdowns} isMobile={false}/>}
                    </div>
                </div>
            </nav>

             {/*Mobile Drawer Sidebar */}
            <img className={`absolute top-2 left-4 z-40 md:hidden ${
                isMobileNavOpen? "hidden" : "block"
            }`}
                 onClick={() => setMobileNavOpen(true)} src={hamburger} alt="hamrburger"/>

            <div
                className={`fixed top-0 left-0 bg-white w-64 h-full z-50 transform transition-transform duration-300 border-r-[1px] border-r-[#ccc] ${
                    isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <RiCloseLargeFill className="absolute right-5 top-5 cursor-pointer font-bold" onClick={() => setMobileNavOpen(false)} />
                {/* Logo Section */}
                <div className="p-4">
                    <div className="flex items-center gap-2">
                        <img
                            src={GighubLogo}
                            alt="Gighub Logo"
                            className="h-10 w-auto cursor-pointer"
                            onClick={handleNavigateHome}
                        />
                    </div>
                </div>

                {/* Profile Section */}
                <div className="p-4 border-b border-[#ccc]">
                    <div className="flex flex-col items-center gap-4 cursor-pointer">
                        <img
                            src={avatarIcon}
                            alt="Avatar"
                            className="h-[50px] w-[50px] bg-gray rounded-full flex items-center justify-center"
                        />
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Shadrach Adamu</h3>
                            <p className="text-sm text-gray-500">Software engineer</p>
                        </div>
                    </div>

                    {/* Auto Apply Section */}
                    <div className="mt-4">
                        <div
                            className="bg-gradient-to-r from-[#6438C2] to-[#FA4E09] text-white rounded-[16px] p-4 flex items-center gap-3 mb-6 cursor-pointer">
                            <span className="text-xl">👑</span>
                            <div>
                                <p className="font-bold text-sm">Auto Apply</p>
                                <p className="text-xs">Getjobs applied for you</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Navigation Items */}
                <div className="p-4">
                    <div className="flex flex-col space-y-2">
                        {navItemsMobile.map((item) => (
                            <div
                                key={item}
                                onClick={() => {
                                    setActiveItem(item);
                                    setMobileNavOpen(false);
                                }}
                                className={`py-2 px-4 flex items-center gap-3 text-gray-600 font-lato text-[16px] cursor-pointer rounded-lg hover:bg-[#6438C2]/10 hover:text-[#6438C2] transition-colors duration-200`}
                            >
                                {item === "Dashboard" && (
                                    <AiOutlineDashboard className="text-lg"/>
                                )}
                                {item === "Find Jobs" && (
                                    <MdOutlineContentPasteSearch className="text-lg"/>
                                )}
                                {item === "Applications" && (
                                    <BsPersonWorkspace className="text-lg"/>
                                )}
                                {item === "My Networks" && (
                                    <FaPeopleGroup className="text-lg"/>
                                )}
                                {item === "Profile" && (
                                    <AiOutlineUser className="text-lg"/>
                                )}
                                {item === "Settings" && (
                                    <BsGear className="text-lg"/>
                                )}
                                {item === "Help & Support" && (
                                    <GrCircleQuestion className="text-lg"/>
                                )}

                                <span>{item}</span>
                            </div>
                        ))}
                    </div>

                    {/* Logout */}
                    <div
                        className="pl-4 mt-10 flex items-center gap-3 cursor-pointer text-red-500 hover:text-red-700"

                    >
                        <FaPowerOff className="text-lg"/> Logout
                    </div>
                </div>
            </div>
        </>
    );
};

export default ApplicantNavBar;
