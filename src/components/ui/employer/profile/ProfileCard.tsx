import React from "react";
import JumiaProfile from '../../../../assets/images/JumiaProfile.png';
import Camera from '../../../../assets/icons/Camera.svg';
import {useAuth} from "../../../../store/useAuth.ts";

const ProfileCard: React.FC = () => {
    const {employer, role, updateProfile} = useAuth();
    const handleSaveChanges = () => {
        if(employer && role){
            updateProfile(employer,role);
        }
    }
    return (

        <div className="flex items-center justify-between bg-[#6438C2] text-white p-4 rounded-t-[16px] w-full h-[123px] mx-auto">

            {/* Left Section: Logo and Details */}
            <div className="flex items-center space-x-4">
                {/* Logo */}
                <div className="relative">
                    <img
                        src={employer?.companyLogo ? employer.companyLogo : JumiaProfile} // Replace with your logo URL
                        alt="Jumia Logo"
                        className="w-[55px] h-[55px] lg:w-[95px] lg:h-[95px] rounded-full border-[4px] bg-white border-white"
                    />
                    <div className="absolute bottom-0 right-0 bg-white border-2 border-white rounded-full w-[20px] h-[20px] lg:w-[26px] lg:h-[26px] p-1 cursor-pointer">
                        <img src={Camera} alt="file upload"/>
                    </div>
                </div>
                {/* Details */}
                <div>
                    <h2 className="text-sm lg:text-lg font-semibold">{
                        employer?.companyName ? employer.companyName : "Jumia Africa"
                    }</h2>
                    <p className="text-xs lg:text-sm text-gray-200">Lagos Nigeria</p>
                </div>

            </div>

            {/* Save Changes Button */}
            <button onClick={handleSaveChanges} className="bg-white font-lato p-2 lg:px-[10px]  rounded-[16px] lg:w-[150px] lg:h-[44px] hover:bg-gray-200 text-sm lg:text-[20px] text-[#000000] transition">
                Save Changes
            </button>
        </div>
    );
};

export default ProfileCard;
