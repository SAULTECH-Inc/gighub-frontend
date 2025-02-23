import React from "react";
import BarChatBar from "./BarChatBar.tsx";

const Stats: React.FC = () => {
    return <>
        <div className="bg-[#6438C2] w-full gap-x-8 lg:w-[556px] h-[183px] rounded-[16px] flex flex-row">
            <div title="y-axis-days" className="w-[10%] h-[100%] flex flex-col justify-center items-end gap-y-[4px] md:gap-y-3 pl-5 text-white text-[13px] font-lato">
                <p className="w-full">Sat</p>
                <p className="w-full">Thu</p>
                <p className="w-full">Wed</p>
                <p className="w-full">Tue</p>
                <p className="w-full">Mon</p>
            </div>
            <div className="w-[90%] h-[100%] flex gap-x-8 md:gap-x-9 md:justify-evenly items-end pb-5 md:pb-3">
                <BarChatBar height={33.3}/>
                <BarChatBar height={59.0}/>
                <BarChatBar height={42.6}/>
                <BarChatBar height={76}/>
                <BarChatBar height={50.3}/>
                <BarChatBar height={67.2}/>
            </div>
        </div>
    </>
}

export default Stats;