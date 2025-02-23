import ArrowIcon from "../../../assets/icons/circle-arrow.png";


const MonthlyPlan = () => {
    return (
        <div className="flex gap-6 px-10 py-10 font-lato">
            {/* Left Box - Monthly Plan */}
            <div
                className="w-[477px] h-[192px] bg-white shadow-md rounded-lg p-5 flex flex-col justify-between"
                style={{boxShadow: "0px 4px 4px 0px #00000040"}}
            >
                {/* Top Row: Monthly Plan & Price */}
                <div className="flex justify-between items-center">
                    {/* Monthly Plan Tag */}
                    <div
                        className="bg-[#6438C2] text-white text-xs font-bold px-3 py-1  w-[116px] h-[30px] flex items-center justify-center">
                        Monthly Plan
                    </div>

                    {/* Pricing */}
                    <div className="flex items-start">
                        <p className="text-[28px] font-bold text-black leading-none">$20</p>
                        <span
                            className="text-[#8E8E8E] text-[16px] leading-[19.2px] tracking-[0%] ml-1 relative top-[-1px]">
        /Month
    </span>
                    </div>
                </div>

                {/* Middle Row: Application Count & Upgrade Button */}
                <div className="flex justify-between items-center mt-3">
                    {/* Application Usage */}
                    <div>
                        <p className="text-black text-[14px]">12 of 3000 Applications</p>
                        <div className="w-[215px] h-[9px] bg-[#F7F8FA] rounded-[16px] mt-1 relative">
                            <div className="bg-[#6438C2] h-[9px] rounded-[16px]" style={{width: "60px"}}></div>
                        </div>
                    </div>

                    {/* Upgrade Button */}
                    <button
                        className="bg-[#6438C2] text-white text-[14px] font-bold w-[137px] h-[42px] rounded-[10px] flex items-center justify-center gap-[10px]"
                        style={{padding: "9px 42px"}}
                    >
                        Upgrade
                        <img src={ArrowIcon} alt="Arrow" className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            {/* Right Box - Next Payment */}
            <div
                className="w-[318px] h-[192px] bg-white shadow-md rounded-lg p-5 flex flex-col justify-between"
                style={{boxShadow: "0px 4px 4px 0px #00000040"}}
            >
                {/* Payment Header */}
                <p className="text-black font-bold text-md">Next Payment</p>

                {/* Payment Date */}
                <p className="text-[20px] font-bold leading-[24px] tracking-[0%] font-lato">
                    On November 30, 2025
                </p>

                {/* Manage Payment Button */}
                <button
                    className="mt-8 bg-[#6438C2] text-white px-6 py-3 rounded-[10px] w-full flex justify-center items-center gap-2">
                    Manage Payment
                    <img src={ArrowIcon} alt="Arrow" className="w-4 h-4"/>
                </button>
            </div>
        </div>
    );
};

export default MonthlyPlan;
