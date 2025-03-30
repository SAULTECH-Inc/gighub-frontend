import { FC } from "react";
import { FaPowerOff } from "react-icons/fa";
import { PiGearSixLight } from "react-icons/pi";
import { GrCircleQuestion } from "react-icons/gr";
import { CiUser } from "react-icons/ci";
import avatarIcon from "../../assets/icons/avatar.svg";
import {removeFromLocalStorage, useAuth} from "../../store/useAuth.ts";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {USER_TYPE} from "../../utils/helpers.ts";
import {UserType} from "../../utils/enums.ts";
import {NODE_ENV} from "../../utils/constants.ts";
import {useNavBarActiveItem} from "../../store/useNavBarActiveItem.ts";

interface ProfileDropdownProps {
    onClose: () => void;
    isMobile: boolean;
}

const ProfileDropdown: FC<ProfileDropdownProps> = ({ onClose, isMobile }) => {
    const {logout, applicant, employer, userType } = useAuth();
    const {setActiveItem} = useNavBarActiveItem();
    const navigate = useNavigate();
    const handleLogout = async ()=>{
        const success = await logout();
        if(success){
            console.log("logged out");
            await removeFromLocalStorage(NODE_ENV);
            navigate("/login");
            onClose();
        } else{
            toast.error("Failed to logout. Please try again.");
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
                    <h3 className="text-lg font-bold text-gray-800">{
                        USER_TYPE === UserType.APPLICANT ? applicant.firstName + " " + applicant.lastName : employer?.companyName
                    }</h3>
                    <p className="text-sm text-gray-500">
                        {
                            USER_TYPE === UserType.APPLICANT ? applicant?.cv?.professionalTitle : "Company"
                        }
                    </p>
                </div>
            </div>

            {/* Auto Apply Section */}
            <div
                className="bg-gradient-to-r from-[#6438C2] to-[#FA4E09] text-white rounded-[16px] p-4 flex items-center gap-3 mb-6 cursor-pointer">
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
                    onClick={()=>{
                        setActiveItem("Profile");
                        navigate(`/${userType}/profile`);
                    }}
                >
                    <CiUser className="text-lg" /> Profile
                </li>
                <li
                    className="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-gray-800"
                    onClick={()=>{
                        setActiveItem("Settings");
                        navigate(`/settings`);
                    }}
                >
                    <PiGearSixLight className="text-lg" /> Settings
                </li>
                <li
                    className="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-gray-800"
                    onClick={()=>{
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
                className="flex items-center gap-3 cursor-pointer text-red-500 hover:text-red-700"
                onClick={handleLogout}
            >
                <FaPowerOff className="text-lg" /> Logout
            </div>
        </div>
    );
};

export default ProfileDropdown;
