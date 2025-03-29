import { FC } from "react";
import avatarIcon from "../../assets/icons/avatar.svg";
import {USER_TYPE} from "../../utils/helpers.ts";
import {UserType} from "../../utils/enums.ts";
import {useAuth} from "../../store/useAuth.ts";

interface AvatarProp {
    isMobile: boolean;
}

const Avatar: FC<AvatarProp> = ({ isMobile }) => {
    const { applicant, employer } = useAuth();
    return (
        <div
            className={`flex ${isMobile ? "flex-col" : "flex-row-reverse"} items-center ${isMobile ? "space-y-2" : "space-x-reverse space-x-2"} relative`}
            style={{ cursor: "pointer" }}
        >
            <img src={avatarIcon} alt="Avatar" className="w-8 h-8 rounded-full" />
            <span className="text-sm text-gray-900 font-bold">
                {
                    USER_TYPE === UserType.APPLICANT ? applicant.firstName + " " + applicant.lastName : employer?.companyName
                }
            </span>
        </div>
    );
}

export default Avatar;
