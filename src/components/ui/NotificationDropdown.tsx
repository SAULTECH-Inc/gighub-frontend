import { FC } from "react";
import { AiOutlineSetting } from "react-icons/ai"; // Settings icon (top-right)

interface NotificationItem {
    id: number;
    icon: JSX.Element; // Icon component
    title: string;
    description: string;
    time: string;
    actionLabel: string;
}

const notifications: NotificationItem[] = [
    {
        id: 1,
        icon: <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-600 text-lg">📅</div>,
        title: "Your interview with Fundy Inc",
        description: "is scheduled for Dec 22, 2025",
        time: "2 hours ago",
        actionLabel: "View details",
    },
    {
        id: 2,
        icon: <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 text-lg">📄</div>,
        title: "Fundy Inc shortlisted your application",
        description: "for Uiux designer",
        time: "2 hours ago",
        actionLabel: "View details",
    },
    {
        id: 3,
        icon: <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 text-lg">💬</div>,
        title: "You have a new message",
        description: "Fundy Inc",
        time: "2 hours ago",
        actionLabel: "Read message",
    },
    {
        id: 4,
        icon: <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-600 text-lg">✅</div>,
        title: "We successfully auto-applied you",
        description: 'to a job "product design" at "Fundy Inc"',
        time: "2 hours ago",
        actionLabel: "View Job",
    },
    {
        id: 5,
        icon: <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-600 text-lg">👁️</div>,
        title: "An employer has viewed your profile",
        description: "",
        time: "2 days ago",
        actionLabel: "View employer",
    },
];

interface NotificationDropdownProps {
    onClose: () => void; // A callback to close the dropdown
}

const NotificationDropdown: FC<NotificationDropdownProps> = ({ onClose }) => {
    const dividerStyle = { borderColor: "#E6E6E6" }; // Using the exact hex color

    return (
        <div className="absolute -right-10 md:right-0 top-14 w-[352px] bg-white shadow-lg rounded-[16px] z-50 font-lato p-6">
            {/* Header */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Notification</h3>
                    <AiOutlineSetting className="text-gray-500 text-xl cursor-pointer" />
                </div>
                {/* Divider Below Header */}
                <hr style={dividerStyle} className="-mx-6" />
            </div>

            {/* Notification Items */}
            <ul>
                {notifications.map((notification, index) => (
                    <li key={notification.id}>
                        {/* Notification Content */}
                        <div
                            className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer"
                            onClick={onClose}
                        >
                            {/* Icon */}
                            {notification.icon}

                            {/* Details */}
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-800">
                                    {notification.title}
                                </p>
                                <p className="text-xs text-gray-600">{notification.description}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-gray-400">{notification.time}</p>
                                    <button className="text-xs text-purple-600 hover:underline">
                                        {notification.actionLabel}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Divider (except after the last item) */}
                        {index < notifications.length - 1 && (
                            <hr style={dividerStyle} className="-mx-6" />
                        )}
                    </li>
                ))}
            </ul>

            {/* Divider Above "View All Notifications" */}
            <div className="mt-4">
                <hr style={dividerStyle} className="-mx-6 mb-4" />
                <div className="text-center">
                    <button className="text-sm font-medium text-white bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700">
                        View all notifications
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationDropdown;
