import { Link } from "react-router-dom"
import { LuMessageCircleMore } from "react-icons/lu";
import React from "react";


type companyInterface = {
    title: string;
    description: string
}

const Companies: React.FC<companyInterface> = ({title, description}) => {
  return (
    <div className=" bg-white border-[1px] border-[#E6E6E6] rounded-[16px]  max-w-[500px] sm:max-w-[280px] lg:max-w-[263px]">
        <div className="w-full flex flex-col items-start">
            <div className="mt-[33px] relative h-20 w-full flex items-center">
            <hr className="absolute border border-[#AFAFAF] w-full" />
                <div className="bg-[#AFAFAF] h-full w-20 rounded-full left-5 absolute"></div>
            </div>
            <div className="flex flex-col items-start p-4">
                <h4 className="font-bold text-black text-[20px]">{title}</h4>
                <p className="text-sm text-[#8E8E8E]">{description}</p>
                <div className="flex items-start justify-between space-x-4 my-3">
                    <Link to='/company-profile' className="border-[1px] border-[#E6E6E6] text-black h-[38px] w-[129px] flex items-center justify-center rounded-[10px]">View Profile</Link>
                    <div className="bg-[#6438C2] h-10 w-10 flex items-center justify-center rounded-full">
                        <LuMessageCircleMore className="text-white text-[20px]"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Companies