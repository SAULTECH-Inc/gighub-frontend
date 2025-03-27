import React, {useCallback, useEffect} from "react";
import Draggable from "react-draggable";
import { FaWindowMinimize } from "react-icons/fa";
import sendIcon from "../../assets/icons/send-icon.svg";
import {emojiList} from "../../utils/constants.ts";
import {fetchPrivateMessages} from "../../services/api";
import {ChatMessage, GigNotification} from "../../chat-module/types";
import {useChatStore} from "../../store/useChatStore.ts";
import useSocket from "../../hooks/useSocket.ts";
import audio from "../../assets/notification.mp3";
const NOTIFICATION_AUDIO = audio;
const ChatWindow: React.FC = () => {
    const{
        messages,
        setMessages,
        message,
        setMessage,
        sender,
        isEmojiPickerVisible,
        setIsEmojiPickerVisible,
        file,
        setFile,
        isClosed,
        setIsClosed,
        isMinimized,
        setIsMinimized,
    } = useChatStore();
    const socket = useSocket(sender);

    const recipient = sender === "shadrachadamuul@gmail.com" ? "engrshadrachadamu@gmail.com": "shadrachadamuul@gmail.com";


    // Fetch private messages when both username and recipient are set
    useEffect(() => {
        const loadMessages = async () => {
            try {
                if (sender && recipient) {
                    const history = await fetchPrivateMessages(sender, recipient);
                    setMessages(history);
                }
            } catch (error) {
                console.error('Error fetching private messages:', error);
            }
        };

        loadMessages();
    }, [sender, recipient]);

    // Handle user status change events
    useEffect(() => {
        if (socket) {
            const handleUserStatusChange = (data: GigNotification) => {
                if(data.user !== sender){
                    console.log(`${data.user} is now ${data.status}`);
                }
            };

            socket.on('userStatusChange', handleUserStatusChange);
            return () => {
                socket.off('userStatusChange', handleUserStatusChange);
            };
        }
    }, [socket]);

    // Handle notification events and audio
    useEffect(() => {
        if (socket) {
            const handleNotification = (data: { title: string; content: string }) => {
                const showNotification = () => {
                    new Notification(data.title, {
                        body: data.content,
                        silent: false,
                        tag: 'chat-notification'
                    });
                };

                if (Notification.permission === 'granted') {
                    showNotification();
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            showNotification();
                        }
                    });
                }
                // Attempt to play the notification sound and log detailed error if it fails
                const audio = new Audio(NOTIFICATION_AUDIO);
                audio.play().catch(err => {
                    console.error('Audio play error:', err);
                });
            };

            socket.on('newNotification', handleNotification);
            return () => {
                socket.off('newNotification', handleNotification);
            };
        }
    }, [socket]);

    // Handle connection and incoming messages
    useEffect(() => {
        if (socket) {
            const handleConnect = () => {
                console.log(`Connected to server as ${sender} (id: ${socket.id})`);
            };

            const handleIncomingMessage = (newMessage: ChatMessage) => {
                if(newMessage.sender !== sender){
                    console.log('Received message:', newMessage);
                    if(newMessage.content){
                        const msg = [...messages, newMessage];
                        setMessages(msg);
                    }
                }
            };

            socket.on('connect', handleConnect);
            socket.on('privateMessage', handleIncomingMessage);

            return () => {
                socket.off('connect', handleConnect);
                socket.off('privateMessage', handleIncomingMessage);
            };
        }
    }, [socket, sender]);

    // Send message handler
    const handleSend = useCallback(() => {

        if (!message.trim() || !recipient?.trim() || !socket) {
            console.log('Not Sending message ::: '+socket);
            return;
        }

        if(!message.trim()) return;

        if(file){
            console.log('File set');
        }

        const normalizedRecipient = recipient?.trim().toLowerCase();
        const newMessage: ChatMessage = {sender:sender, recipient: normalizedRecipient, content:message, createdAt: new Date().toISOString()};

        console.log(`Emitting privateMessage from ${sender} to ${normalizedRecipient}: ${newMessage}`);
        socket.emit('privateMessage', newMessage);
        const msg = [...messages, newMessage];
        setMessages(msg);
        setMessage('');
    }, [message, recipient, socket, sender]);

    const handleEmojiClick = (emoji: string) => {
        setMessage(message + emoji);
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
                        {messages.map((message, key) => (
                            <div
                                key={key}
                                className={`flex ${message.sender === sender ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`flex flex-col chat-bubble p-3 max-w-xs rounded-lg ${
                                        message.sender === sender
                                            ? "bg-purple-500 text-white chat-bubble-right"
                                            : "bg-gray-300 text-black chat-bubble-left"
                                    }`}
                                >
                                    <div className="self-start">
                                        {message.content}
                                    </div>

                                    {message.createdAt && (
                                        <div className="text-xs self-end text-gray-600">
                                            {new Date(message.createdAt).toLocaleTimeString()}
                                        </div>
                                    )}
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
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault(); // Prevents a new line from being added
                                    if(message.trim()) {
                                        handleSend();
                                    }
                                }
                            }}
                            rows={1}
                            className="w-full p-3 border bg-[#F7F8FA] rounded-[10px] border-[#E3E6F3] resize-none"
                            placeholder="Write here"
                        />

                        <input
                            type="file"
                            onChange={(e) => setFile((e.target.files?.[0] || null) as File)}
                            className="hidden"
                            id="file-input"
                        />
                        <label htmlFor="file-input" className="cursor-pointer text-2xl text-indigo-600">
                            📎
                        </label>

                        <button
                            tabIndex={0}
                            onClick={handleSend}
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
