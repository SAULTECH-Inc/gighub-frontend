import {FC} from "react";
import NotificationIcon from "./NotificationIcon.tsx";
import MessageNotificationIcon from "./MessageNotificationIcon.tsx";
import SearchIcon from "./SearchIcon.tsx";

import Avatar from "./Avatar.tsx";

const OperatorNavs: FC = ()=>{
    return (
        <div className="flex gap-4">
            <SearchIcon/>
            <NotificationIcon count={2}/>
            <MessageNotificationIcon count={8}/>
            <Avatar isMobile={true}/>
        </div>
    );
}

export default OperatorNavs;