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
import {
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineDown
} from "react-icons/ai";
import { BsGear } from "react-icons/bs";
import {
  MdOutlineContentPasteSearch,
  MdOutlineManageAccounts,
  MdWorkOutline,
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
import { HiOutlineDocumentText, HiOutlineOfficeBuilding } from "react-icons/hi";
import { BiTask } from "react-icons/bi";
import { removeFromLocalStorage, useAuth } from "../../store/useAuth.ts";
import { NODE_ENV } from "../../utils/constants.ts";
import { toast } from "react-toastify";
import { useNavBarActiveItem } from "../../store/useNavBarActiveItem.ts";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import { useNotificationStore } from "../../store/useNotificationStore.ts";
import { useIsMobile } from "../../hooks/useMediaQuery.ts";

// Navigation configuration with categories for better organization
interface NavGroup {
  label: string;
  items: string[];
}

interface NavConfig {
  primary: string[];
  groups: { [key: string]: NavGroup };
  account: string[];
}

// Configuration for applicant navigation
const applicantConfig: NavConfig = {
  primary: ["Dashboard", "Find Jobs", "Companies"],
  groups: {
    career: {
      label: "Career Tools",
      items: ["Resume Builder", "Applications", "Assessments"]
    },
    social: {
      label: "Network & Schedule",
      items: ["My Networks", "My Schedules"]
    }
  },
  account: ["Profile", "Settings", "Help & Support"]
};

// Configuration for employer navigation
const employerConfig: NavConfig = {
  primary: ["Dashboard", "Manage Applicants", "Manage Jobs"],
  groups: {
    tools: {
      label: "Tools",
      items: ["Assessments", "My Schedules"]
    },
    network: {
      label: "Network",
      items: ["My Networks"]
    }
  },
  account: ["Profile", "Settings", "Help & Support"]
};

interface TopNavBarProps {
  navbarItemsMap: Map<string, string>;
  userType?: "applicant" | "employer";
}

const TopNavBar: FC<TopNavBarProps> = ({
                                         navbarItemsMap,
                                         userType = "applicant",
                                       }) => {
  const { applicant, employer, logout } = useAuth();
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [isMessageDropdownOpen, setMessageDropdownOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const messageDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { activeItem, setActiveItem } = useNavBarActiveItem();
  const { notifications } = useNotificationStore();
  const navigate = useNavigate();

  // Mobile detection hook
  const isMobile = useIsMobile();

  const config = userType === "applicant" ? applicantConfig : employerConfig;

  // Icon mapping function
  const getIcon = (item: string) => {
    const icons: { [key: string]: any } = {
      "Dashboard": <AiOutlineDashboard className="text-lg" />,
      "Find Jobs": <MdOutlineContentPasteSearch className="text-lg" />,
      "Companies": <HiOutlineOfficeBuilding className="text-lg" />,
      "Resume Builder": <HiOutlineDocumentText className="text-lg" />,
      "Applications": <GrWorkshop className="text-lg" />,
      "Assessments": <BiTask className="text-lg" />,
      "My Networks": <GrGroup className="text-lg" />,
      "My Schedules": <GrSchedules className="text-lg" />,
      "Manage Applicants": <MdOutlineManageAccounts className="text-lg" />,
      "Manage Jobs": <MdWorkOutline className="text-lg" />,
      "Profile": <AiOutlineUser className="text-lg" />,
      "Settings": <BsGear className="text-lg" />,
      "Help & Support": <GrCircleQuestion className="text-lg" />,
    };
    return icons[item] || <AiOutlineDashboard className="text-lg" />;
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
    setNotificationDropdownOpen(false);
    setMessageDropdownOpen(false);
    setOpenDropdown(null);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen((prev) => !prev);
    setProfileDropdownOpen(false);
    setMessageDropdownOpen(false);
    setOpenDropdown(null);
  };

  const toggleMessageDropdown = () => {
    setMessageDropdownOpen((prev) => !prev);
    setProfileDropdownOpen(false);
    setNotificationDropdownOpen(false);
    setOpenDropdown(null);
  };

  const closeDropdowns = () => {
    setProfileDropdownOpen(false);
    setNotificationDropdownOpen(false);
    setMessageDropdownOpen(false);
    setOpenDropdown(null);
  };

  const handleSearchToggle = () => {
    setSearchOpen((prev) => !prev);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideAllDropdowns =
        !profileDropdownRef.current?.contains(event.target as Node) &&
        !notificationDropdownRef.current?.contains(event.target as Node) &&
        !messageDropdownRef.current?.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node) &&
        !Object.values(dropdownRefs.current).some(ref => ref?.contains(event.target as Node));

      if (isOutsideAllDropdowns) {
        closeDropdowns();
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSetItems = (item: string) => {
    setActiveItem(item);
    navigate(navbarItemsMap.get(item) || "/settings");
    setMobileNavOpen(false);
    setOpenDropdown(null);
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
      <nav className="relative flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 py-4 lg:px-10">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <img
            src={GighubLogo}
            alt="Gighub Logo"
            className="hidden h-10 w-auto cursor-pointer lg:block"
            onClick={handleNavigateHome}
          />
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center max-w-4xl mx-4">
          {/* Primary Navigation Items */}
          {config.primary.map((item) => (
            <button
              key={item}
              onClick={() => handleSetItems(item)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-lg ${
                activeItem === item
                  ? "text-[#6438C2] bg-[#6438C2]/10"
                  : "text-gray-700 hover:text-[#6438C2] hover:bg-gray-50"
              }`}
            >
              {item}
            </button>
          ))}

          {/* Dropdown Groups */}
          {Object.entries(config.groups).map(([key, group]) => (
            <div key={key} className="relative" ref={el => dropdownRefs.current[key] = el}>
              <button
                onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg flex items-center gap-1 transition-colors ${
                  group.items.includes(activeItem)
                    ? "text-[#6438C2] bg-[#6438C2]/10"
                    : "text-gray-700 hover:text-[#6438C2] hover:bg-gray-50"
                }`}
              >
                {group.label}
                <AiOutlineDown
                  className={`w-3 h-3 transition-transform ${
                    openDropdown === key ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown === key && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  {group.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSetItems(item)}
                      className={`w-full px-4 py-2.5 text-sm text-left flex items-center gap-3 transition-colors ${
                        activeItem === item
                          ? "text-[#6438C2] bg-[#6438C2]/10"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {getIcon(item)}
                      <span className="font-medium">{item}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-3 lg:gap-4 ml-auto lg:ml-0">
          {/* Search */}
          <div className="relative mb-2">
            <div
              className="flex cursor-pointer items-center justify-center rounded-full border border-gray-300 p-1 transition-colors"
              onClick={handleSearchToggle}
            >
              <SearchIcon />
            </div>
            <div
              className={`absolute top-0 right-0 transform transition-all duration-300 ${
                isSearchOpen
                  ? "translate-x-0 opacity-100"
                  : "pointer-events-none translate-x-[200px] opacity-0"
              }`}
            >
              <input
                ref={searchInputRef}
                type="text"
                className="hidden w-64 rounded-full border border-gray-300 px-4 py-2 text-sm shadow-lg focus:border-[#6438C2] focus:ring-2 focus:ring-[#6438C2]/20 focus:outline-none md:flex"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Notification Icon */}
          <div className="relative" ref={notificationDropdownRef}>
            <div
              className="cursor-pointer rounded-full p-2 transition-colors"
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
            <div
              className="cursor-pointer rounded-full p-2 transition-colors"
              onClick={toggleMessageDropdown}
            >
              <MessageNotificationIcon />
            </div>
            {isMessageDropdownOpen && (
              <MessageDropdown
                onClose={closeDropdowns}
                isMobile={isMobile}
              />
            )}
          </div>

          {/* Profile Dropdown (Hidden on Mobile) */}
          <div className="relative hidden md:flex" ref={profileDropdownRef}>
            <div className="cursor-pointer" onClick={toggleProfileDropdown}>
              <Avatar isMobile={false} />
            </div>
            {isProfileDropdownOpen && (
              <ProfileDropdown
                onClose={closeDropdowns}
                isMobile={isMobile}
              />
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Sidebar */}
      <img
        className={`absolute top-2 left-4 z-40 cursor-pointer lg:hidden ${
          isMobileNavOpen ? "hidden" : "block"
        }`}
        onClick={() => setMobileNavOpen(true)}
        src={hamburger}
        alt="hamburger"
      />

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity lg:hidden ${
          isMobileNavOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileNavOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 transform border-r border-gray-200 bg-white transition-transform duration-300 overflow-y-auto ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          {/* Close Button */}
          <RiCloseLargeFill
            className="absolute top-6 right-5 cursor-pointer text-xl hover:text-gray-700"
            onClick={() => setMobileNavOpen(false)}
          />

          {/* Logo Section */}
          <div className="mb-6">
            <img
              src={GighubLogo}
              alt="Gighub Logo"
              className="h-10 w-auto cursor-pointer"
              onClick={handleNavigateHome}
            />
          </div>

          {/* Profile Section */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex flex-col items-center gap-3 mb-4">
              <img
                src={
                  (USER_TYPE === UserType.APPLICANT
                    ? applicant?.profilePicture
                    : employer?.companyLogo) || avatarIcon
                }
                alt="Avatar"
                className="h-16 w-16 rounded-full object-cover bg-gray-200"
              />
              <div className="text-center">
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

            {/* Premium CTA */}
            <Link to="/subscriptions">
              <div className="flex cursor-pointer items-center gap-3 rounded-xl bg-gradient-to-r from-[#6438C2] to-[#FA4E09] p-4 text-white hover:shadow-lg transition-shadow">
                <span className="text-2xl">👑</span>
                <div>
                  {USER_TYPE === UserType.APPLICANT ? (
                    <>
                      <p className="text-sm font-bold">Auto Apply</p>
                      <p className="text-xs opacity-90">Get jobs applied for you</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold">Smart Match</p>
                      <p className="text-xs opacity-90">
                        AI finds perfect candidates
                      </p>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-6">
            {/* Primary Navigation */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                Main Menu
              </h4>
              <div className="space-y-1">
                {config.primary.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSetItems(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeItem === item
                        ? "bg-[#6438C2]/10 text-[#6438C2]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {getIcon(item)}
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grouped Navigation */}
            {Object.entries(config.groups).map(([key, group]) => (
              <div key={key}>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                  {group.label}
                </h4>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSetItems(item)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                        activeItem === item
                          ? "bg-[#6438C2]/10 text-[#6438C2]"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {getIcon(item)}
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Account Section */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                Account
              </h4>
              <div className="space-y-1">
                {config.account.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSetItems(item)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {getIcon(item)}
                    <span>{item}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors mt-2"
                >
                  <FaPowerOff className="text-lg" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TopNavBar);