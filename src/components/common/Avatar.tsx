import { FC } from "react";
import avatarIcon from "../../assets/icons/avatar.svg";
import { USER_TYPE } from "../../utils/helpers.ts";
import { UserType } from "../../utils/enums.ts";
import { useAuth } from "../../store/useAuth.ts";

interface AvatarProp {
  isMobile: boolean;
}

const Avatar: FC<AvatarProp> = ({ isMobile }) => {
  const { applicant, employer } = useAuth();
  return (
    <div
      className={`flex ${isMobile ? "flex-col" : "flex-row-reverse"} items-center ${isMobile ? "space-y-2" : "space-x-2 space-x-reverse"} relative`}
      style={{ cursor: "pointer" }}
    >
      <img
        src={
          (USER_TYPE === UserType.APPLICANT
            ? applicant?.profilePicture
            : employer?.companyLogo) || avatarIcon
        }
        alt="Avatar"
        className="h-8 w-8 rounded-full"
      />
      <span className="text-sm font-bold text-gray-900">
        {USER_TYPE === UserType.APPLICANT
          ? applicant.firstName + " " + applicant.lastName
          : employer?.companyName}
      </span>
    </div>
  );
};

export default Avatar;
