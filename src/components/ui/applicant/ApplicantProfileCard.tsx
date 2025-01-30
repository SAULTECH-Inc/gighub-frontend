import React from "react";
import Image7 from '../../../assets/images/image7.png';
import Camera from '../../../assets/icons/Camera.svg';

const ApplicantProfileCard: React.FC = () => {
    return (

        <div className="flex items-center justify-between bg-[#6438C2] text-white p-4 rounded-t-[16px] w-[1012px] h-[123px] mx-auto">

            {/* Left Section: Logo and Details */}
            <div className="flex items-center space-x-4">
                {/* Logo */}
                <div className="relative">
                    <img
                        src={Image7} // Replace with your logo URL
                        alt="Jumia Logo"
                        className="w-[95px] h-[95px] rounded-full border-[4px] bg-white border-white"
                    />
                    <div className="absolute bottom-0 right-0 bg-white border-2 border-white rounded-full w-[26px] h-[26px] p-1 cursor-pointer">
                        <img src={Camera}/>
                    </div>
                </div>
                {/* Details */}
                <div>
                    <h2 className="text-lg font-semibold">A.S ABUBAKAR</h2>
                    <p className="text-sm text-gray-200">Lagos Nigeria</p>
                </div>

            </div>

            {/* Save Changes Button */}
            <button className="bg-white font-lato px-[10px]  rounded-[16px] w-[150px] h-[44px] hover:bg-gray-200 text-[20px] text-[#000000] transition">
                Update Profile
            </button>
        </div>
    );
};

export default ApplicantProfileCard;
