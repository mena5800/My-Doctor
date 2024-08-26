import React, { useState, useEffect } from 'react';
import { getChatsByUser, getMessagesByChatId, sendMessage, getProfile } from './authService';
import './App.css';
import user1Image from './img/user1.png';
import user2Image from './img/user2.png';

const Chat = ({ isSmall }) => {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [isChatListVisible, setIsChatListVisible] = useState(true); // State to toggle chat list visibility

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userProfile = await getProfile();
                setProfile(userProfile);
                setLoadingProfile(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        const fetchChats = async () => {
            try {
                const userChats = await getChatsByUser();
                setChats(userChats);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchProfile();
        fetchChats();
    }, []);

    useEffect(() => {
        if (selectedChat) {
            const fetchMessages = async () => {
                try {
                    const chatMessages = await getMessagesByChatId(selectedChat);
                    setMessages(chatMessages);
                    setLoadingMessages(false);
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
            setMessages([...messages, message]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const getUserImage = (sender) => {
        return sender._id === profile?._id ? user1Image : user2Image;
    };

    const toggleChatList = () => {
        setIsChatListVisible(!isChatListVisible); // Toggle the visibility of the chat list
    };

    if (loadingProfile || (selectedChat && loadingMessages)) {
        return <div>Loading...</div>; // Show a loading message while data is being fetched
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
                                    setIsChatListVisible(false); // Hide the chat list when a chat is selected
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
                    </div>
                    <div className="chat-messages">
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
