import linkedin from "../../assets/icons/linkedin-round.svg";
import twitter from "../../assets/icons/twitter-rounded.svg";
import chatIcon from "../../assets/icons/chat-icon.svg";

const NetworkConnectionsCard = ()=>{
    return <>
        <div className="w-[70%] sm:w-[298px] h-[380px] rounded-[16px] border-[1px] p-[18px] border-[#E6E6E6] space-y-4">
            <div className="w-[60px] h-[60px] rounded-full bg-[#D9D9D9] "></div>
            <div className="flex flex-col">
                <h3 className="text-[20px] text-[#000000] font-semibold">Jona johnson</h3>
                <p>Lagos, Nigeria</p>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex gap-x-2">
                    <div className=" cursor-pointer w-[50px] h-[50px] rounded-full flex justify-center items-center border-[#E6E6E6] border-[1px]">
                        <img src={linkedin} alt="linkedin-icon"/>
                    </div>
                    <div className="cursor-pointer w-[50px] h-[50px] rounded-full flex justify-center items-center border-[#E6E6E6] border-[1px]">
                        <img src={twitter} alt="twitter icon"/>
                    </div>
                </div>
                <div>
                    <div className="cursor-pointer bg-[#6438C2] w-[60px] h-[60px] rounded-full flex justify-center items-center border-[#E6E6E6] border-[1px]">
                        <img src={chatIcon} alt="chat icon"/>
                    </div>
                </div>
            </div>
            <hr className="w-full border-[#AFAFAF] border-[1px]"/>
            <div className="flex justify-between items-center font-bold text-[#6438C2] text-[16px]">
                <p>Product Designer</p>
                <p>Senior level</p>
            </div>
            <div className="flex justify-between items-center font-bold text-[#6438C2] text-[16px]">
                <p className="w-[50%] font-medium text-[#8E8E8E]">
                    500 mutual friends
                </p>
                <div className="border border-[#E6E6E6] rounded-[10px] py-[6px] px-[16px]">
                    <button className="font-medium text-[#000000] text-[16px]">
                        View Profile
                    </button>
                </div>
            </div>

        </div>
    </>
}

export default NetworkConnectionsCard;
