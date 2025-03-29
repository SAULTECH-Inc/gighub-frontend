import { Link } from "react-router-dom"
import { LuMessageCircleMore } from "react-icons/lu";
import React from "react";


type companyInterface = {
    title: string;
    description: string
}

const Companies: React.FC<companyInterface> = ({title, description}) => {
  return (
    <div className=" bg-white border-[1px] border-[#E6E6E6] rounded-[16px] w-[263px] max-md:w-full max-sm:w-full ">
        <div className="flex flex-col items-start">
            <div className="relative">
            <div className="h-[0.8px] w-[263px] max-md:w-[300px] max-sm:w-[400px] bg-[#AFAFAF] absolute top-14" />
                <div className="bg-[#AFAFAF] h-20 w-20 rounded-full absolute top-5 left-5"></div>
            </div>
            <div className="flex flex-col items-start mt-24 p-4">
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