import React from "react";

const MasterCardLogo: React.FC = () => {
  return (
    <div className="relative flex items-center">
      <div className="z-10 h-[15px] w-[15px] rounded-full bg-[#FA4E09]"></div>
      <div className="absolute left-[9px] z-0 h-[15px] w-[15px] rounded-full bg-[#FFD900]"></div>
    </div>
  );
};

export default MasterCardLogo;
