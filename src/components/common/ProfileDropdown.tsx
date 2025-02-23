import { FC } from "react";
import { FaPowerOff } from "react-icons/fa";
import { PiGearSixLight } from "react-icons/pi";
import { GrCircleQuestion } from "react-icons/gr";
import { CiUser } from "react-icons/ci";
import avatarIcon from "../../assets/icons/avatar.svg";
import {useAuth} from "../../store/useAuth.ts";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

interface ProfileDropdownProps {
    onClose: () => void;
    isMobile: boolean;
}

const ProfileDropdown: FC<ProfileDropdownProps> = ({ onClose, isMobile }) => {
    const {logout, error} = useAuth();
    const navigate = useNavigate();
    const handleLogout = async ()=>{
        const success = await logout();
        if(success){
            onClose();
            navigate("/login");
        }else{
            toast.error(error);
        }

    }
    return (
        <div
            className={`absolute ${isMobile ? "left-0" : "right-0"} top-14 w-[352px] bg-white shadow-lg rounded-[16px] z-50 font-lato p-6`}
        >
            {/* User Info */}
            <div className="flex items-center gap-4 mb-6">
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
            <div className="bg-gradient-to-r from-[#6438C2] to-[#FA4E09] text-white rounded-[16px] p-4 flex items-center gap-3 mb-6 cursor-pointer">
                <span className="text-xl">👑</span>
                <div>
                    <p className="font-bold text-sm">Auto Apply</p>
                    <p className="text-xs">Getjobs applied for you</p>
                </div>
            </div>

            {/* Menu Items */}
            <ul className="space-y-4 text-sm font-medium">
                <li
                    className="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                >
                    <CiUser className="text-lg" /> Profile
                </li>
                <li
                    className="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                >
                    <PiGearSixLight className="text-lg" /> Settings
                </li>
                <li
                    className="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-gray-800"
                    onClick={onClose}
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
                className="flex items-center gap-3 cursor-pointer text-red-500 hover:text-red-700"
                onClick={handleLogout}
            >
                <FaPowerOff className="text-lg" /> Logout
            </div>
        </div>
    );
};

export default ProfileDropdown;