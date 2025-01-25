import React from "react";

const MasterCardLogo: React.FC = ()=>{
    return (<div className="relative flex items-center">
        <div className="bg-[#FA4E09] w-[15px] h-[15px] rounded-full z-10"></div>
        <div className="absolute left-[9px] bg-[#FFD900] w-[15px] h-[15px] rounded-full z-0"></div>
    </div>);
}

export default MasterCardLogo;