import React from "react";

interface BarProps{
    height: number;
}
const BarChatBar: React.FC<BarProps> = ({
                                           height
                                       })=>{
    return <>
       <div
           style={{
               height: `${height}%`,
           }}
           className={`rounded-[10px] md:w-[13px] w-[11px] bg-white`}>

       </div>
    </>
}

export default BarChatBar;