import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChatsByUser, getMessagesByChatId, sendMessage, getProfile } from './authService';
import './App.css';
import maleDoctorImage from './img/male-doc.png';
import femaleDoctorImage from './img/female-doc.png';
import malePatientImage from './img/male-patient.png';
import femalePatientImage from './img/female-patient.png';

const Chat = () => {
    const { chatId } = useParams();
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedChat, setSelectedChat] = useState(chatId || null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const userChats = await getChatsByUser();
                setChats(userChats);
                if (!selectedChat && userChats.length > 0) {
                    setSelectedChat(userChats[0]._id);
                }
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        const fetchProfile = async () => {
            try {
                const userProfile = await getProfile();
                setProfile(userProfile);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchChats();
        fetchProfile();
    }, [selectedChat]);

    useEffect(() => {
        if (selectedChat) {
            const fetchMessages = async () => {
                try {
                    const chatMessages = await getMessagesByChatId(selectedChat);
                    setMessages(chatMessages);
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
        if (sender.role === 'Doctor') {
            return sender.gender === 'male' ? maleDoctorImage : femaleDoctorImage;
        } else {
            return sender.gender === 'male' ? malePatientImage : femalePatientImage;
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h3>Your Chats</h3>
                <ul>
                    {chats.map((chat) => (
                        <li
                            key={chat._id}
                            onClick={() => setSelectedChat(chat._id)}
                            className={selectedChat === chat._id ? 'active' : ''}
                        >
                            {chat.participants.find(p => p._id !== profile?._id)?.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="chat-window">
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
        </div>
    );
};

export default Chat;
