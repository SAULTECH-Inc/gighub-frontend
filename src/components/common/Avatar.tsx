import {FC} from "react";
import avatarIcon from "../../assets/icons/avatar.svg";

const Avatar: FC = ()=>{
    return (
        <div
            className="flex flex-row-reverse items-center space-x-reverse space-x-2 relative"
            style={{cursor: "pointer"}}
        >
            <img src={avatarIcon} alt="Avatar" className="w-8 h-8 rounded-full"/>
            <span className="text-sm text-gray-900 font-bold">John Doe</span>
        </div>
    );
}

export default Avatar;