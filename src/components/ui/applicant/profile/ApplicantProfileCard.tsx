import React from "react";
import Image7 from '../../../../assets/images/image7.png';
import Camera from '../../../../assets/icons/Camera.svg';

const ApplicantProfileCard: React.FC = () => {
    return (

        <div className="flex items-center justify-between bg-[#6438C2] text-white p-4 rounded-t-[16px] w-full h-[123px] mx-auto">

            {/* Left Section: Logo and Details */}
            <div className="flex items-center space-x-4">
                {/* Logo */}
                <div className="relative">
                    <img
                        src={Image7} // Replace with your logo URL
                        alt="Jumia Logo"
                        className="w-[60px] h-[60px] md:w-[85px] md:h-[85px] lg:w-[95px] lg:h-[95px] rounded-full border-[4px] bg-white border-white"
                    />
                    <div className="absolute bottom-0 right-0 bg-white border-2 border-white rounded-full w-[20px] h-[20px] lg:w-[26px] lg:h-[26px] p-1 cursor-pointer">
                        <img src={Camera} alt="file dialog button icon"/>
                    </div>
                </div>
                {/* Details */}
                <div className="flex flex-col gap-y-1 lg:gap-y-2">
                    <h2 className="text-[11px] md:text-[20px] lg:text-lg font-semibold">A.S ABUBAKAR</h2>
                    <p className="text-[10px] md:text-[15px] lg:text-sm text-gray-200">Lagos Nigeria</p>
                </div>

            </div>

            {/* Save Changes Button */}
            <button className="bg-white font-lato  p-2 md:py-3 md:px-5 rounded-[16px] lg:py-2 shadow lg:px-6 hover:bg-gray-200 text-[11px] md:text-lg lg:text-[20px] text-[#000000] transition">
                Update Profile
            </button>
        </div>
    );
};

export default ApplicantProfileCard;
