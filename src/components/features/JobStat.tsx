import React from "react";
import Stats from "../ui/Stats.tsx";
import people from "../../assets/icons/people.svg";
import clicks from "../../assets/icons/clicks.svg";
import applied from "../../assets/icons/applied.svg";
const JobStat: React.FC = () => {
    return (
        <div className="w-full lg:w-[556px] h-[290px] md:h-[320px] rounded-[16px] flex flex-col space-y-6 mx-auto">
            <Stats />
            <div className="flex flex-col gap-y-5">
                <div className="flex justify-start items-center gap-x-2 md:gap-x-24 lg:gap-x-12">
                    <div className="flex justify-evenly items-center w-fit min-w-26 md:min-w-28 gap-x-1 md:gap-x-2">
                        <div className="bg-[#6438C2] w-[35px] h-[35px] md:w-[40px] md:h-[40px] rounded-[10px] flex justify-center items-center">
                            <img src={people} alt="people"/>
                        </div>
                        <p className="text-xs md:text-[18px] lg:text-[16px]">People Reached</p>
                    </div>

                    <div className="flex justify-evenly items-center w-fit gap-x-1 min-w-26 md:min-w-28 md:gap-x-2">
                        <div className="bg-[#6438C2] w-[35px] h-[35px] md:w-[40px] md:h-[40px] rounded-[10px] flex justify-center items-center">
                            <img src={clicks} alt="people"/>
                        </div>
                        <p className="text-xs md:text-[18px] lg:text-[16px]">Total Clicks</p>
                    </div>

                    <div className="flex justify-evenly items-center w-fit gap-x-1 min-w-26 md:min-w-28 md:gap-x-2">
                        <div className="bg-[#6438C2] w-[35px] h-[35px] md:w-[40px] md:h-[40px] rounded-[10px] flex justify-center items-center">
                            <img src={applied} alt="people"/>
                        </div>
                        <p className="text-xs md:text-[18px] lg:text-[16px]">Applied</p>
                    </div>
                </div>
                <div className="flex flex-row justify-start items-center gap-x-16 md:gap-x-40 lg:gap-x-28">
                    <div className="flex flex-col gap-y-3 w-fit">
                        <p className="text-xs md:text-[18px] lg:text-[16px]">200 Talents</p>
                        <hr className="w-[49px] border-[3px] border-[#6438C2]"/>
                    </div>

                    <div className="flex flex-col gap-y-3 w-fit">
                        <p className="text-xs md:text-[18px] lg:text-[16px]">100 clicks</p>
                        <hr className="w-[49px] border-[3px] border-[#6438C2]"/>
                    </div>

                    <div className="flex flex-col gap-y-3 w-fit">
                        <p className="text-xs md:text-[18px] lg:text-[16px]">50 Applications</p>
                        <hr className="w-[49px] border-[3px] border-[#6438C2]"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobStat;