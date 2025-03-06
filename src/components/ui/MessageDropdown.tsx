import React, {FC} from "react";
import {messages} from "../../utils/dumm.ts";



interface MessageDropdownProps {
    onClose: () => void;
    setChatWindowOpened: React.Dispatch<React.SetStateAction<boolean>>;
}



const MessageDropdown: FC<MessageDropdownProps> = ({ onClose, setChatWindowOpened }) => {
    const dividerStyle = { borderColor: "#E6E6E6" }; // Faint divider color

    const handleOpenMessage = ()=>{
        setChatWindowOpened(true);
    }

    return (
        <div className="absolute right-0 top-14 w-[352px] bg-white shadow-lg rounded-[16px] z-50 font-lato p-6">
            {/* Header */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Messages</h3>
                </div>
                {/* Divider Below Header */}
                <hr style={dividerStyle} className="-mx-6" />
            </div>

            {/* Message Items */}
            <ul>
                {messages.map((message, index) => (
                    <li key={message.id}>
                        {/* Message Content */}
                        <div
                            className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer"
                            onClick={onClose}
                        >
                            {/* Avatar */}
                            <img
                                src={message.avatar}
                                alt={message.name}
                                className="w-10 h-10 rounded-full"
                            />

                            {/* Details */}
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-800">
                                    {message.name}
                                </p>
                                <p className="text-xs text-gray-600">{message.message}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-gray-400">{message.time}</p>
                                    <button onClick={handleOpenMessage} className="text-xs text-purple-600 hover:underline">
                                        See Message
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Divider (except after the last item) */}
                        {index < messages.length - 1 && (
                            <hr style={dividerStyle} className="-mx-6" />
                        )}
                    </li>
                ))}
            </ul>

            {/* Divider Above "View All Messages" */}
            <div className="mt-4">
                <hr style={dividerStyle} className="-mx-6 mb-4" />
                <div className="text-center">
                    <button className="text-sm font-medium text-white bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700">
                        View all Messages
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageDropdown;
