import PowerIcon from "../../../assets/images/power.png"; // Imported image

const Privacy = () => {
    return (
        <div className="flex flex-col items-center py-10 font-lato">
            {/* Top Purple Header (Separate) */}
            <div className="w-[1072px] h-[101px] bg-[#6438C2] rounded-t-[16px] flex items-center px-6 ml-10 mt-[-70px]">
                <h1 className="text-white text-[32px] font-bold leading-[38.4px]">
                    Privacy Settings
                </h1>
            </div>

            {/* Privacy Settings Title (Without Background) */}
            <h2 className="text-black font-lato font-bold text-[24px] leading-[28.8px] tracking-[0%] text-xl  mt-6 self-start pl-4">
                Privacy Settings
            </h2>

            {/* Privacy Box (White Background) */}
            <div
                className="absolute bg-white border border-[#E6E6E6] rounded-[16px] w-[920px] h-[480px] flex flex-col items-start py-6 px-8 font-lato"
                style={{top: "259px", left: "406px"}}
            >
                {/* Privacy Settings Section */}
                <div className="w-full">
                    {/* Privacy Box */}
                    <div className="border-none">
                        {/* Title */}
                        <h3 className="text-black text-md font-bold mt-0">Who can view my profile</h3>

                        {/* Horizontal Rule */}
                        <hr className="w-full border-t border-[#E6E6E6] my-3"/>

                        {/* Privacy Options */}
                        <div className="space-y-4 w-full">
                            {/* Public Option */}
                            <label className="flex items-center gap-[200px]">
                    <span className="font-lato font-bold text-[16px] leading-[19.2px] text-[#8E8E8E] text-md">
                        Public (anyone can see)
                    </span>
                                <img src={PowerIcon} alt="Toggle"
                                     className="w-[35px] h-[19px]  cursor-pointer -ml-[2px]"/>
                            </label>

                            {/* Employers Only Option */}
                            <label className="flex items-center gap-[255px]">
                    <span className="font-lato font-bold text-[16px] leading-[19.2px] text-[#8E8E8E] text-md">
                        Employers Only
                    </span>
                                <img src={PowerIcon} alt="Toggle"
                                     className="w-[35px] h-[19px] cursor-pointer -ml-[5px]"/>
                            </label>

                            {/* Private Option */}
                            <label className="flex items-center gap-[173px]">
                    <span className="font-lato font-bold text-[16px] leading-[19.2px] text-[#8E8E8E] text-md">
                        Private (Only Visible to me)
                    </span>
                                <img src={PowerIcon} alt="Toggle"
                                     className="w-[35px] h-[19px] cursor-pointer ml-[-4px]"/>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
