import { FC, memo, useEffect, useRef, useState } from "react";
import GighubLogo from "../../assets/icons/GighubLogo.svg";
import Avatar from "../common/Avatar.tsx";
import SearchIcon from "../common/SearchIcon.tsx";
import NotificationIcon from "../common/NotificationIcon.tsx";
import MessageNotificationIcon from "../common/MessageNotificationIcon.tsx";
import ProfileDropdown from "../common/ProfileDropdown.tsx";
import NotificationDropdown from "../ui/NotificationDropdown.tsx";
import MessageDropdown from "../ui/MessageDropdown.tsx";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineDashboard, AiOutlineUser } from "react-icons/ai";
import { BsGear } from "react-icons/bs";
import {
  MdOutlineContentPasteSearch,
  MdOutlineManageAccounts,
} from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";
import {
  GrCircleQuestion,
  GrGroup,
  GrSchedules,
  GrWorkshop,
} from "react-icons/gr";
import hamburger from "../../assets/icons/hamburger.svg";
import avatarIcon from "../../assets/icons/avatar.svg";
import { RiCloseLargeFill } from "react-icons/ri";
import { removeFromLocalStorage, useAuth } from "../../store/useAuth.ts";
import { applicantNavBarItemMap, NODE_ENV } from "../../utils/constants.ts";
import { toast } from "react-toastify";
import { useNavBarActiveItem } from "../../store/useNavBarActiveItem.ts";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import { useNotificationStore } from "../../store/useNotificationStore.ts";

interface ApplicantNavBarProps {
  navbarItemsMap: typeof applicantNavBarItemMap;
  navItems: string[];
  navItemsMobile: string[];
}

const TopNavBar: FC<ApplicantNavBarProps> = ({
  navbarItemsMap,
  navItems,
  navItemsMobile,
}) => {
  const { applicant, employer, logout } = useAuth();
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [isMessageDropdownOpen, setMessageDropdownOpen] = useState(false); // State for MessageDropdown
  const [isSearchOpen, setSearchOpen] = useState(false); // State for Search Input
  const [isMobileNavOpen, setMobileNavOpen] = useState(false); // State for mobile drawer sidebar

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const messageDropdownRef = useRef<HTMLDivElement>(null); // Ref for MessageDropdown
  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for Search Input
  const { activeItem, setActiveItem } = useNavBarActiveItem();

  const { notifications } = useNotificationStore();

  const navigate = useNavigate();

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

  useEffect(() => {
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSetItems = (item: string) => {
    console.log(JSON.stringify(item));
    setActiveItem(item);
    navigate(navbarItemsMap.get(item) || "/settings");
  };
  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      console.log("logged out");
      await removeFromLocalStorage(NODE_ENV);
      navigate("/login");
    } else {
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="mx-0 w-full p-0">
      <nav className="relative flex h-[calc(70px-5px)] items-center justify-between border-b-[1px] border-b-[#E6E6E6] bg-white px-10 py-4">
        {/* Left: Logo */}
        <div className="hidden items-center gap-2 lg:flex">
          <img
            src={GighubLogo}
            alt="Gighub Logo"
            className="h-10 w-auto cursor-pointer"
            onClick={handleNavigateHome}
          />
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <ul className="font-lato hidden flex-wrap justify-center gap-6 text-[16px] text-gray-700 lg:flex">
          {navItems.map((item) => (
            <li
              key={item}
              onClick={() => handleSetItems(item)} // Set the active item on click
              className={`cursor-pointer border-b-4 font-medium ${
                activeItem === item
                  ? "border-b-[7px] border-[#6438C2] text-[#6438C2]"
                  : "border-transparent hover:border-b-[7px] hover:border-[#6438C2] hover:text-[#6438C2]"
              }`}
            >
              {item}
            </li>
          ))}
        </ul>

        {/* Right: Notifications, Messages, and Profile (Desktop Only) */}
        <div className="ml-auto flex items-center gap-4 lg:ml-0 lg:gap-8">
          {" "}
          {/* ml-auto only on mobile */}
          {/* Search Icon and Input */}
          <div className="relative">
            <div
              className="mb-2 flex cursor-pointer items-center justify-center rounded-full border-[1px] border-[#ccc] p-1"
              onClick={handleSearchToggle}
            >
              <SearchIcon />
            </div>
            <div
              className={`absolute top-[-6px] right-[-1px] transform transition-all duration-300 ${
                isSearchOpen
                  ? "translate-x-0 opacity-100"
                  : "pointer-events-none translate-x-[200px] opacity-0"
              }`}
            >
              <input
                ref={searchInputRef}
                type="text"
                className="hidden w-[calc(220px+5px)] rounded-full border-[0.5px] border-[#ccc] px-4 py-2 text-sm shadow-sm focus:border-[#ccc] focus:ring-0 focus:outline-none active:border-[#ccc] md:flex"
                placeholder="Search..."
              />
            </div>
          </div>
          {/* Notification Icon */}
          <div className="relative" ref={notificationDropdownRef}>
            <div
              className="cursor-pointer"
              onClick={toggleNotificationDropdown}
            >
              <NotificationIcon
                count={notifications?.filter((n) => !n.viewed)?.length}
              />
            </div>
            {isNotificationDropdownOpen && <NotificationDropdown />}
          </div>
          {/* Message Notification Icon */}
          <div className="relative" ref={messageDropdownRef}>
            <div className="cursor-pointer" onClick={toggleMessageDropdown}>
              <MessageNotificationIcon />
            </div>
            {isMessageDropdownOpen && (
              <MessageDropdown onClose={closeDropdowns} />
            )}
          </div>
          {/* Profile Dropdown (Hidden on Mobile) */}
          <div className="relative hidden md:flex" ref={profileDropdownRef}>
            <div className="cursor-pointer" onClick={toggleProfileDropdown}>
              <Avatar isMobile={false} />
            </div>
            {isProfileDropdownOpen && (
              <ProfileDropdown onClose={closeDropdowns} isMobile={false} />
            )}
          </div>
        </div>
      </nav>

      {/*Mobile Drawer Sidebar */}
      <img
        className={`absolute top-2 left-4 z-40 lg:hidden ${
          isMobileNavOpen ? "hidden" : "block"
        }`}
        onClick={() => setMobileNavOpen(true)}
        src={hamburger}
        alt="hamrburger"
      />

      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 transform border-r-[1px] border-r-[#ccc] bg-white transition-transform duration-300 ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <RiCloseLargeFill
          className="absolute top-6 right-5 cursor-pointer font-bold"
          onClick={() => setMobileNavOpen(false)}
        />
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
        <div className="border-b border-[#ccc] p-4">
          <div className="flex cursor-pointer flex-col items-center gap-4">
            <img
              src={
                (USER_TYPE === UserType.APPLICANT
                  ? applicant?.profilePicture
                  : employer?.companyLogo) || avatarIcon
              }
              alt="Avatar"
              className="bg-gray flex h-[50px] w-[50px] items-center justify-center rounded-full"
            />
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {USER_TYPE === UserType.APPLICANT
                  ? applicant.firstName + " " + applicant.lastName
                  : employer?.companyName}
              </h3>
              <p className="text-sm text-gray-500">
                {USER_TYPE === UserType.APPLICANT
                  ? applicant?.cv?.professionalTitle
                  : "Company"}
              </p>
            </div>
          </div>

          {/* Auto Apply Section */}
          <div className="mt-4">
            <div className="mb-6 flex cursor-pointer items-center gap-3 rounded-[16px] bg-gradient-to-r from-[#6438C2] to-[#FA4E09] p-4 text-white">
              <span className="text-xl">👑</span>
              <Link to="/subscriptions">
                {USER_TYPE === UserType.APPLICANT ? (
                  <>
                    <p className="text-sm font-bold">Auto Apply</p>
                    <p className="text-xs">Get jobs applied for you</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold">Smart Match</p>
                    <p className="text-xs">
                      AI finds perfect candidates for you
                    </p>
                  </>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4">
          <div className="flex flex-col gap-y-2">
            {navItemsMobile.map((item) => (
              <div
                key={item}
                onClick={() => {
                  handleSetItems(item);
                  setMobileNavOpen(false);
                }}
                className={`font-lato flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2 text-[16px] text-gray-600 transition-colors duration-200 hover:bg-[#6438C2]/10 hover:text-[#6438C2]`}
              >
                {item === "Dashboard" && (
                  <AiOutlineDashboard className="text-lg" />
                )}
                {item === "Find Jobs" && (
                  <MdOutlineContentPasteSearch className="text-lg" />
                )}
                {item === "Companies" && (
                  <AiOutlineDashboard className="text-lg" />
                )}
                {item === "Applications" && <GrWorkshop className="text-lg" />}
                {item === "My Networks" && <GrGroup className="text-lg" />}
                {item === "My Schedules" && <GrSchedules className="text-lg" />}
                {item === "Profile" && <AiOutlineUser className="text-lg" />}
                {item === "Settings" && <BsGear className="text-lg" />}
                {item === "Help & Support" && (
                  <GrCircleQuestion className="text-lg" />
                )}

                {item === "Manage Applicants" && (
                  <MdOutlineManageAccounts className="text-lg" />
                )}

                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Logout */}
          <div
            onClick={handleLogout}
            className="mt-5 flex cursor-pointer items-center gap-3 pl-4 text-red-500 hover:text-red-700 md:mt-10"
          >
            <FaPowerOff className="text-lg" /> Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TopNavBar);
