import {FC} from "react";
import NotificationIcon from "./NotificationIcon.tsx";
import MessageNotificationIcon from "./MessageNotificationIcon.tsx";

const OperatorNavs: FC = ()=>{
    return (
        <div className="flex gap-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange hover:bg-gray-200 rounded-md">
                Jobs
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange hover:bg-gray-200 rounded-md">
                Applications
            </button>
            <NotificationIcon count={2}/>
            <MessageNotificationIcon count={0}/>
        </div>
    );
}

export default OperatorNavs;