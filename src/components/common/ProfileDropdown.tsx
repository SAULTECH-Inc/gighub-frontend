import { FC } from "react";
import { FaPowerOff } from "react-icons/fa";
import { PiGearSixLight } from "react-icons/pi";
import { GrCircleQuestion } from "react-icons/gr";
import { CiUser } from "react-icons/ci";
import avatarIcon from "../../assets/icons/avatar.svg";
import { removeFromLocalStorage, useAuth } from "../../store/useAuth.ts";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import { NODE_ENV } from "../../utils/constants.ts";
import { useNavBarActiveItem } from "../../store/useNavBarActiveItem.ts";

interface ProfileDropdownProps {
  onClose: () => void;
  isMobile: boolean;
}

const ProfileDropdown: FC<ProfileDropdownProps> = ({ onClose, isMobile }) => {
  const { logout, applicant, employer, userType } = useAuth();
  const { setActiveItem } = useNavBarActiveItem();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      console.log("logged out");
      await removeFromLocalStorage(NODE_ENV);
      navigate("/login");
      onClose();
    } else {
      toast.error("Failed to logout. Please try again.");
    }
  };

  const handleNavigation = (path: string, itemName?: string) => {
    if (itemName) {
      setActiveItem(itemName);
    }
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Dropdown Container - Responsive Width */}
      <div
        className={`
          font-lato
          ${isMobile
          ? "fixed left-1/2 top-20 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[340px]"
          : "absolute right-0 top-full mt-2 w-80 xl:w-[340px]"
        }
          z-50 rounded-2xl bg-white shadow-2xl border border-gray-100
        `}
      >
        <div className="p-5 xl:p-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-5">
            <img
              src={
                (USER_TYPE === UserType.APPLICANT
                  ? applicant?.profilePicture
                  : employer?.companyLogo) || avatarIcon
              }
              alt="Avatar"
              className="h-11 w-11 xl:h-12 xl:w-12 rounded-full object-cover bg-gray-200 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm xl:text-base font-bold text-gray-800 truncate">
                {USER_TYPE === UserType.APPLICANT
                  ? `${applicant.firstName} ${applicant.lastName}`
                  : employer?.companyName}
              </h3>
              <p className="text-xs xl:text-sm text-gray-500 truncate">
                {USER_TYPE === UserType.APPLICANT
                  ? applicant?.cv?.professionalTitle || "Job Seeker"
                  : "Company"}
              </p>
            </div>
          </div>

          {/* Premium CTA */}
          <Link to="/subscriptions" onClick={onClose}>
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#6438C2] to-[#FA4E09] p-3.5 xl:p-4 text-white cursor-pointer hover:shadow-lg transition-shadow">
              <span className="text-xl xl:text-2xl flex-shrink-0">👑</span>
              <div className="min-w-0">
                {USER_TYPE === UserType.APPLICANT ? (
                  <>
                    <p className="text-xs xl:text-sm font-bold">Auto Apply</p>
                    <p className="text-[10px] xl:text-xs opacity-90">Get jobs applied for you</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs xl:text-sm font-bold">Smart Match</p>
                    <p className="text-[10px] xl:text-xs opacity-90">
                      AI finds perfect candidates for you
                    </p>
                  </>
                )}
              </div>
            </div>
          </Link>

          {/* Menu Items */}
          <nav className="space-y-0.5 mb-4">
            <button
              onClick={() => handleNavigation(`/${userType}/profile`, "Profile")}
              className="w-full flex items-center gap-3 px-3 py-2 xl:py-2.5 text-xs xl:text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <CiUser className="text-base xl:text-lg flex-shrink-0" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => handleNavigation("/settings", "Settings")}
              className="w-full flex items-center gap-3 px-3 py-2 xl:py-2.5 text-xs xl:text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <PiGearSixLight className="text-base xl:text-lg flex-shrink-0" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => handleNavigation("/help-and-support")}
              className="w-full flex items-center gap-3 px-3 py-2 xl:py-2.5 text-xs xl:text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <GrCircleQuestion className="text-base xl:text-lg flex-shrink-0" />
              <span>Help and Support</span>
            </button>
          </nav>

          {/* Divider */}
          <hr className="my-3.5 xl:my-4 border-gray-200" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 xl:py-2.5 text-xs xl:text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaPowerOff className="text-sm xl:text-base flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;