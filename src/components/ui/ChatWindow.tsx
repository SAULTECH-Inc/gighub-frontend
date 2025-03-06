import React, { useState } from "react";
import Draggable from "react-draggable";
import { FaWindowMinimize } from "react-icons/fa";
import sendIcon from "../../assets/icons/send-icon.svg";
import {emojiList} from "../../utils/constants.ts";

interface Message {
    id: number;
    text: string;
    sender: "me" | "other";
}



const ChatWindow: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hi, Good evening", sender: "other" },
        { id: 2, text: "How are you doing?", sender: "other" }
    ]);
    const [inputText, setInputText] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

    const sendMessage = () => {
        if (inputText.trim() || file) {
            const newMessage: Message = { id: messages.length + 1, text: inputText, sender: "me" };
            setMessages([...messages, newMessage]);
            setInputText("");
            setFile(null);
        }
    };

    const handleEmojiClick = (emoji: string) => {
        setInputText(inputText + emoji);
        setIsEmojiPickerVisible(false);
    };

    const toggleEmojiPicker = () => {
        setIsEmojiPickerVisible(!isEmojiPickerVisible);
    };

    if (isClosed) return null;

    return (
        <Draggable handle=".drag-handle">
            <div
                className={`fixed bottom-5 right-5 w-[396px] z-20 ${
                    isMinimized ? "h-16" : "h-[634px]"
                } bg-white rounded-t-[16px] shadow-lg flex flex-col p-0`}
            >
                {/* Header */}
                <div className="relative drag-handle bg-[#6438C2] p-4 text-white text-lg font-semibold cursor-move flex justify-between items-center rounded-t-[16px] w-full h-[100px]">
                    <div className="right-2 top-2 absolute flex justify-evenly items-center gap-x-1">
                        <FaWindowMinimize
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="text-white px-2 mb-1 cursor-pointer text-[30px]"
                        />
                        <button
                            onClick={() => setIsClosed(true)}
                            className="text-white px-2 py-1 text-[30px]"
                        >
                            &times;
                        </button>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <div className="w-[60px] h-[60px] rounded-full bg-gray-300"></div>
                        <div className="flex flex-col">
                            <span className="text-sm">John Doe</span>
                            <span className="text-sm">Product Designer</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {!isMinimized && (
                    <div className="flex-grow p-4 overflow-y-auto space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`chat-bubble p-3 max-w-xs rounded-lg ${
                                        message.sender === "me"
                                            ? "bg-purple-500 text-white chat-bubble-right"
                                            : "bg-gray-300 text-black chat-bubble-left"
                                    }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Message Input */}
                {!isMinimized && (
                    <div className="p-4 bg-white flex items-center space-x-2">
                        <button
                            onClick={toggleEmojiPicker}
                            className="text-2xl text-indigo-600"
                        >
                            😊
                        </button>

                        {/* Emoji Picker */}
                        {isEmojiPickerVisible && (
                            <div className="absolute bottom-16 left-4 p-4 bg-white rounded-xl shadow-lg grid grid-cols-6 gap-2 max-h-[180px] overflow-y-auto">
                                {emojiList.map((emoji) => (
                                    <span
                                        key={emoji}
                                        className="cursor-pointer text-xl"
                                        onClick={() => handleEmojiClick(emoji)}
                                    >
                                        {emoji}
                                    </span>
                                ))}
                            </div>
                        )}

                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault(); // Prevents a new line from being added
                                    sendMessage();
                                }
                            }}
                            rows={1}
                            className="w-full p-3 border bg-[#F7F8FA] rounded-[10px] border-[#E3E6F3] resize-none"
                            placeholder="Write here"
                        />

                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="hidden"
                            id="file-input"
                        />
                        <label htmlFor="file-input" className="cursor-pointer text-2xl text-indigo-600">
                            📎
                        </label>

                        <button
                            tabIndex={0}
                            onClick={sendMessage}
                            className="w-[50px] h-[44px] px-4 py-2 bg-indigo-700 text-white rounded-[10px]"
                        >
                            <img src={sendIcon} alt="send" />
                        </button>
                    </div>
                )}
            </div>
        </Draggable>
    );
};

export default ChatWindow;