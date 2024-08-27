import React, { useState, useEffect, useRef } from 'react';
import { getChatsByUser, getMessagesByChatId, sendMessage, getProfile } from './authService';
import { io } from 'socket.io-client';
import './App.css';
import user1Image from './img/user1.png';
import user2Image from './img/user2.png';

const socket = io(process.env.BACKEND_SERVER); // Initialize Socket.io connection

const Chat = ({ isSmall, visible, selectedChatId, chatName, toggleChat }) => {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedChat, setSelectedChat] = useState(selectedChatId || null);
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [isChatListVisible, setIsChatListVisible] = useState(!selectedChatId);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userProfile = await getProfile();
                setProfile(userProfile);
                setLoadingProfile(false);

                // Notify the server that the user has connected
                socket.emit('userConnected', userProfile._id);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        const fetchChats = async () => {
            try {
                const userChats = await getChatsByUser();
                setChats(userChats);
                if (!selectedChat && userChats.length > 0 && selectedChatId) {
                    setSelectedChat(selectedChatId);
                    setIsChatListVisible(false);
                }
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchProfile();
        fetchChats();

        // Listen for incoming messages
        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
        });

        // Listen for unread messages when the user connects
        socket.on('unreadMessages', (unreadMessages) => {
            setMessages((prevMessages) => [...prevMessages, ...unreadMessages]);
            scrollToBottom();
        });

        return () => {
            // Clean up when the component unmounts
            socket.off('newMessage');
            socket.off('unreadMessages');
        };
    }, [selectedChatId]);

    useEffect(() => {
        if (selectedChat) {
            const fetchMessages = async () => {
                try {
                    const chatMessages = await getMessagesByChatId(selectedChat);
                    setMessages(chatMessages);
                    setLoadingMessages(false);
                    scrollToBottom();
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };
            fetchMessages();
        }
    }, [selectedChat]);

    const handleSendMessage = async () => {
        try {
            const message = await sendMessage(selectedChat, newMessage);
            socket.emit('sendMessage', { chatId: selectedChat, senderId: profile._id, content: newMessage });
            setMessages([...messages, message]);
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const getUserImage = (sender) => {
        return sender._id === profile?._id ? user1Image : user2Image;
    };

    const toggleChatList = () => {
        setIsChatListVisible(!isChatListVisible);
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!visible) return null; 

    if (loadingProfile || (selectedChat && loadingMessages)) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`chat-container ${isSmall ? 'chat-small' : 'chat-large'}`}>
            {isChatListVisible ? (
                <div className="chat-sidebar">
                    <h3>Your Chats</h3>
                    <ul>
                        {chats.map((chat) => (
                            <li
                                key={chat._id}
                                onClick={() => {
                                    setSelectedChat(chat._id);
                                    setIsChatListVisible(false);
                                }}
                                className={selectedChat === chat._id ? 'active' : ''}
                            >
                                {chat.participants.find(p => p._id !== profile?._id)?.name}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="chat-window">
                    <div className="chat-header">
                        <button className="back-arrow" onClick={toggleChatList}>← Back to chats</button>
                        <span className="chat-name">{chatName}</span>
                        <button className="close-chat-button" onClick={toggleChat}>X</button>
                    </div>
                    <div className="chat-messages" style={{ overflowY: 'auto', flexGrow: 1 }}>
                        {messages.map((message) => (
                            <div 
                                key={message._id} 
                                className={`message ${message.senderId._id === profile?._id ? 'right' : 'left'}`}
                            >
                                {message.senderId._id !== profile?._id && (
                                    <img src={getUserImage(message.senderId)} alt="user" className="message-avatar" />
                                )}
                                <div className={`message-box ${message.senderId._id === profile?._id ? 'right' : 'left'}`}>
                                    <span className="sender-name">
                                        {message.senderId.name}: 
                                    </span>
                                    <span className="message-content">{message.content}</span>
                                </div>
                                {message.senderId._id === profile?._id && (
                                    <img src={getUserImage(message.senderId)} alt="user" className="message-avatar" />
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
