import React from 'react'

const NetworkConnectionsCard:React.FC = () => {
    return (
        <div className="mx-auto flex max-w-[323px] flex-col gap-10 rounded-[16px] bg-white px-4 py-6">
        <div className="relative flex flex-col gap-4">
          <div className="self-end rounded-[10px] border border-[#E6E6E6] px-4 py-[6px]">
            <button className="font-bold text-[#000000]">
              Send message
            </button>
          </div>
          <hr />
          <div className="absolute left-4 top-3 h-[60px] w-[60px] rounded-full bg-[#D9D9D9]"></div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[20px] font-bold text-[#000000]">
              Julius Abel
            </p>
            <p className="font-bold text-[#8E8E8E]">Lagos Nigeria</p>
          </div>
          <div className="h-[40px] w-[40px] rounded-full bg-[#D9D9D9]"></div>
        </div>
        <div className="flex items-center gap-2 self-center font-bold">
          <button className="rounded-[10px] bg-[#E6E6E6] px-10 py-[6px] text-[#000000]">
            Reject
          </button>
          <button className="rounded-[10px] bg-[#6438C2] px-10 py-[7px] text-[#FFFFFF]">
            Accept
          </button>
        </div>
      </div>)
}

export default NetworkConnectionsCard