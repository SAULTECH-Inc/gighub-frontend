import React from "react";
import { InterviewType } from "../../utils/enums.ts";
import {
  Blend,
  Contact,
  Handshake,
  PhoneCall,
  User,
  Users,
  Video,
} from "lucide-react";
import { getTypeColor } from "../../utils/constants.ts";

export const InterviewIcon: React.FC<{ type: InterviewType }> = ({ type }) => {
  const iconMap: Record<InterviewType, any> = {
    "virtual-meeting": <Video className="h-5 w-5" />,
    "phone-call": <PhoneCall className="h-5 w-5" />,
    "in-person": <Contact className="h-5 w-5" />,
    "group-interview": <Users className="h-5 w-5" />,
    assessment: <Handshake className="h-5 w-5" />,
    hybrid: <Blend className="h-5 w-5" />,
  };

  return (
    <div className={`rounded-lg p-2 ${getTypeColor(type)}`}>
      {iconMap[type] || <User className="h-5 w-5" />}
    </div>
  );
};
