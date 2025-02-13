import Image7 from "../../../assets/images/image7.png";
import Camera from "../../../assets/images/cam.svg";
const Account = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div
                className="w-[1072px] h-[835px] bg-white rounded-[16px] shadow-lg"
                style={{top: "70px", left: "333px"}}
            >
                {/* Top Purple Section */}
                <div
                    className="w-full h-[101px] bg-[#6438C2] text-white rounded-t-[16px] flex items-center px-10"
                >
                    <h2 className="text-2xl font-bold">Account Settings</h2>
                </div>

                {/* Profile Section */}
                <div className="p-10 flex items-center gap-4">
                    {/* Profile Picture with Camera Icon */}
                    <div className="relative w-[95px] h-[95px]">
                        <img
                            src={Image7} // Replace with your profile image source
                            alt="Profile"
                            className="w-full h-full rounded-full border-[4px] bg-white border-white"
                        />

                        {/* Camera Icon - Positioned Overlapping the Profile Picture */}
                        <div
                            className="absolute bottom-[-8px] right-[-8px] bg-[#6B5AED] rounded-full
                 w-[28px] h-[28px] flex items-center justify-center cursor-pointer shadow-md
                 transform translate-x-[-30%] translate-y-[-30%]"
                        >
                            <img src={Camera} alt="Edit Profile" className="w-[16px] h-[16px]"/>
                        </div>
                    </div>

                    {/* User Info */}
                    <div>
                        <h3 className="text-xl font-semibold">A.S Abuabakar</h3>
                        <p className="text-gray-500">Yobe, Nigeria</p>
                    </div>

                    {/* Role */}
                    <span className="ml-auto text-[#6438C2] font-medium">
    Mid Level Product Designer
  </span>
                </div>

                {/* Change Password Form */}
                <div className="px-10">
                    <h3 className="text-lg font-semibold">Change Password</h3>
                    <form className="mt-4 space-y-4">
                        <div className="flex gap-x-6">
                            {/* Current Password */}
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium">Current Password</label>
                                <input
                                    type="password"
                                    className="w-[359px] h-[38px] px-3  border-[#E6E6E6] bg-[#F7F7F7] rounded-md outline-none"
                                />
                            </div>

                            {/* New Password */}
                            <div className="flex flex-col">
                                <label className="text-gray-700 ml- 5 font-medium">New Password</label>
                                <input
                                    type="password"
                                    className="w-[359px] h-[38px] px-3  border-[#E6E6E6] bg-[#F7F7F7]  outline-none"
                                />
                            </div>
                        </div>

                        <p>Confirm Password</p>
                        <input
                            type="password"
                            placeholder=""
                            className="w-[754px] h-[38px] px-3  border-[#E6E6E6] bg-[#F7F7F7]  outline-none"
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="mt-4 bg-[#6438C2] w-[164px] h-[47px]  text-white px-5 py-2 font-medium rounded-[10px]"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Account;
