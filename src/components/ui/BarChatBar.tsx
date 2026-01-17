import React from "react";

interface BarProps {
  height: number;
}
const BarChatBar: React.FC<BarProps> = ({ height }) => {
  return (
    <>
      <div
        style={{
          height: `${height}%`,
        }}
        className={`w-[11px] rounded-[10px] bg-white md:w-[13px]`}
      ></div>
    </>
  );
};

export default BarChatBar;
