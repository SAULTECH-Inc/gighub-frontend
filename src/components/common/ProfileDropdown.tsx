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

  return (
    <div
      className={`absolute ${isMobile ? "left-0" : "right-0"} font-lato top-14 z-50 w-[352px] rounded-[16px] bg-white p-6 shadow-lg`}
    >
      {/* User Info */}
      <div className="mb-6 flex items-center gap-4">
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
      <div
        className="mb-6 flex cursor-pointer items-center gap-3 rounded-[16px] bg-gradient-to-r from-[#6438C2] to-[#FA4E09] p-4 text-white">
        <span className="text-xl">👑</span>
        <Link to="/subscriptions">
          {USER_TYPE === UserType.APPLICANT ? (
            <>
              <p className="text-sm font-bold">Auto Apply</p>
              <p className="text-xs">Get Jobs applied for you</p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold">Smart Match</p>
              <p className="text-xs">AI finds perfect candidates for you</p>
            </>
          )}
        </Link>
      </div>

      {/* Menu Items */}
      <ul className="space-y-4 text-sm font-medium">
        <li
          className="flex cursor-pointer items-center gap-3 text-gray-500 hover:text-gray-800"
          onClick={() => {
            setActiveItem("Profile");
            navigate(`/${userType}/profile`);
          }}
        >
          <CiUser className="text-lg" /> Profile
        </li>
        <li
          className="flex cursor-pointer items-center gap-3 text-gray-500 hover:text-gray-800"
          onClick={() => {
            setActiveItem("Settings");
            navigate(`/settings`);
          }}
        >
          <PiGearSixLight className="text-lg" /> Settings
        </li>
        <li
          className="flex cursor-pointer items-center gap-3 text-gray-500 hover:text-gray-800"
          onClick={() => {
            navigate(`/help-and-support`);
          }}
        >
          <GrCircleQuestion className="text-lg" /> Help and support
        </li>
      </ul>

      {/* Full-Width Divider */}
      <div className="-mx-6 my-4">
        <hr className="border-t border-[#ccc]" />
      </div>

      {/* Logout */}
      <div
        className="flex cursor-pointer items-center gap-3 text-red-500 hover:text-red-700"
        onClick={handleLogout}
      >
        <FaPowerOff className="text-lg" /> Logout
      </div>
    </div>
  );
};

export default ProfileDropdown;
